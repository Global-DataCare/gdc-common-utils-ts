import {
  ContractCredentialTypes,
  W3cCredentialContexts,
  W3cCredentialTypes,
} from '../constants/verifiable-credentials';
import type { VerifiableCredentialV2 } from '../models/verifiable-credential';

/** Canonical protected-code algorithm used by postal activation bindings. */
export const POSTAL_ACTIVATION_CODE_BINDING_ALGORITHM = 'scrypt-v1' as const;

/** Lifecycle for a separate postal-address verification credential. */
export const PostalActivationLicenseStatuses = Object.freeze({
  Issued: 'issued',
  Delivered: 'delivered',
  Redeemed: 'redeemed',
  Revoked: 'revoked',
  Expired: 'expired',
} as const);

export type PostalActivationLicenseStatus =
  typeof PostalActivationLicenseStatuses[keyof typeof PostalActivationLicenseStatuses];

/**
 * Public binding recorded for the activation licence. The activation code is
 * deliberately absent. The VC carries only a salted, pepper-dependent scrypt
 * binding so the host can verify the same code later without disclosing it or
 * enabling offline guessing from the credential alone.
 */
export type PostalActivationLicenseBinding = Readonly<{
  licenseId: string;
  applicationId: string;
  organizationIdentifier: string;
  controllerEmail: string;
  controllerKeyMaterial: string;
  postalAddressHash: string;
  protectedCode: Readonly<{
    algorithm: typeof POSTAL_ACTIVATION_CODE_BINDING_ALGORITHM;
    salt: string;
    digest: string;
  }>;
  hostDid: string;
  network: 'test-network' | 'network';
  status: PostalActivationLicenseStatus;
  issuedAt: string;
  expiresAt: string;
  deliveredAt?: string;
  redeemedAt?: string;
}>;

/** Reusable protected-code slice stored in encrypted host registration state. */
export type PostalActivationCodeBinding = PostalActivationLicenseBinding['protectedCode'];

/** Input for the credential returned out-of-band to the applicant controller. */
export type OrganizationTestNetworkCredentialInput = Readonly<{
  issuerDid: string;
  subjectDid: string;
  credentialId: string;
  validFrom: string;
  validUntil: string;
  legalName: string;
  organizationIdentifier: string;
  controllerEmail: string;
  controllerKeyMaterial: string;
  applicationId: string;
  accessPath: 'partner' | 'test-network';
  targetNetwork: 'test-network' | 'network';
  /**
   * @deprecated Postal-address verification is a separate production-readiness
   * flow. This compatibility input is ignored and is never embedded in a Test
   * Network authorization credential.
   */
  postalLicense?: PostalActivationLicenseBinding;
  proof?: VerifiableCredentialV2['proof'];
}>;

function required(value: unknown, name: string): string {
  const normalized = String(value || '').trim();
  if (!normalized) throw new Error(`Organization registration authorization requires ${name}.`);
  return normalized;
}

/**
 * Builds the immutable VC that a controller receives out-of-band and attaches
 * to `Organization/_transaction`. Postal-address verification is deliberately
 * outside this credential and may be completed independently before production.
 */
export function buildOrganizationTestNetworkCredential(
  input: OrganizationTestNetworkCredentialInput,
): VerifiableCredentialV2 {
  const applicationId = required(input.applicationId, 'applicationId');
  const organizationIdentifier = required(input.organizationIdentifier, 'organizationIdentifier');
  const controllerEmail = required(input.controllerEmail, 'controllerEmail').toLowerCase();

  return {
    '@context': [W3cCredentialContexts.V2, 'https://schema.org'],
    id: required(input.credentialId, 'credentialId'),
    type: [
      W3cCredentialTypes.VerifiableCredential,
      ContractCredentialTypes.OrganizationTestNetworkCredential,
    ],
    issuer: required(input.issuerDid, 'issuerDid'),
    credentialSubject: {
      id: required(input.subjectDid, 'subjectDid'),
      applicationId,
      accessPath: input.accessPath,
      targetNetwork: input.targetNetwork,
      organization: {
        legalName: required(input.legalName, 'legalName'),
        identifier: organizationIdentifier,
      },
      controller: {
        email: controllerEmail,
        hasCredential: { material: required(input.controllerKeyMaterial, 'controllerKeyMaterial') },
      },
    },
    validFrom: required(input.validFrom, 'validFrom'),
    validUntil: required(input.validUntil, 'validUntil'),
    ...(input.proof ? { proof: input.proof } : {}),
  };
}

/**
 * Applies the only legal state transitions for the purpose-bound postal code.
 * Confirmation proves delivery but deliberately does not consume the code;
 * redemption occurs later during `_exchange`.
 */
export function transitionPostalActivationLicense(
  current: PostalActivationLicenseStatus,
  action: 'mark_delivered' | 'redeem' | 'revoke' | 'expire',
): PostalActivationLicenseStatus {
  if (action === 'mark_delivered' && current === PostalActivationLicenseStatuses.Issued) {
    return PostalActivationLicenseStatuses.Delivered;
  }
  if (action === 'redeem' && current === PostalActivationLicenseStatuses.Delivered) {
    return PostalActivationLicenseStatuses.Redeemed;
  }
  if (action === 'revoke'
    && (current === PostalActivationLicenseStatuses.Issued
      || current === PostalActivationLicenseStatuses.Delivered)) {
    return PostalActivationLicenseStatuses.Revoked;
  }
  if (action === 'expire'
    && (current === PostalActivationLicenseStatuses.Issued
      || current === PostalActivationLicenseStatuses.Delivered)) {
    return PostalActivationLicenseStatuses.Expired;
  }
  throw new Error(`Invalid postal activation licence transition: ${current} -> ${action}.`);
}

function canonicalizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalizeValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key !== 'proof')
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => [key, canonicalizeValue(nested)]),
  );
}

/**
 * Produces deterministic UTF-8 JSON for detached proofs. Every proof signs the
 * same credential payload with the complete `proof` property removed, so a
 * later counter-proof cannot invalidate an earlier one.
 */
export function canonicalizeOrganizationTestNetworkCredential(
  credential: VerifiableCredentialV2,
): string {
  if (!credential.type.includes(ContractCredentialTypes.OrganizationTestNetworkCredential)) {
    throw new Error('Credential is not an organization Test Network admission.');
  }
  return JSON.stringify(canonicalizeValue(credential));
}
