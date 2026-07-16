import { ActivationCredentialTypes, W3cCredentialContexts, W3cCredentialTypes } from '../constants/verifiable-credentials';
import { ClaimsPersonSchemaorg } from '../constants/schemaorg';
import type { VerifiableCredentialV2 } from '../models/verifiable-credential';

/**
 * Input for the canonical individual-onboarding acceptance credential.
 *
 * This helper builds the evidence object that a frontend/BFF can later sign
 * with the user profile key pair before sending it as an attachment.
 *
 * Canonical semantics:
 * - `credentialSubject.memberOf.taxID` is the organization tax identifier
 * - `credentialSubject.hasOccupation.identifier.value` defaults to `RESPRSN`
 * - `credentialSubject.hasCredential.material` binds the credential to the
 *   profile signing material
 */
export type IndividualOnboardingAcceptanceCredentialInput = Readonly<{
  issuerDid: string;
  subjectDid: string;
  organizationTaxId: string;
  profileKeyMaterial: string;
  validFrom: string;
  credentialId?: string;
  representativeIdentifier?: string;
  representativeRoleCode?: string;
  sameAs?: string;
  validUntil?: string;
  proof?: VerifiableCredentialV2['proof'];
}>;

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function requireText(value: string, fieldName: string): string {
  const normalized = normalizeText(value);
  if (!normalized) {
    throw new Error(`buildIndividualOnboardingAcceptanceCredential requires ${fieldName}.`);
  }
  return normalized;
}

/**
 * Builds the canonical Verifiable Credential for individual onboarding
 * acceptance.
 *
 * The result is unsigned by design. Callers sign it with the user profile key
 * pair and then attach the signed VC to the `Organization/_transaction`
 * request.
 */
export function buildIndividualOnboardingAcceptanceCredential(
  input: IndividualOnboardingAcceptanceCredentialInput,
): VerifiableCredentialV2 {
  const issuerDid = requireText(input.issuerDid, 'issuerDid');
  const subjectDid = requireText(input.subjectDid, 'subjectDid');
  const organizationTaxId = requireText(input.organizationTaxId, 'organizationTaxId');
  const profileKeyMaterial = requireText(input.profileKeyMaterial, 'profileKeyMaterial');
  const validFrom = requireText(input.validFrom, 'validFrom');
  const roleCode = normalizeText(input.representativeRoleCode) || 'RESPRSN';

  return {
    '@context': [W3cCredentialContexts.V2, 'https://schema.org'],
    ...(normalizeText(input.credentialId) ? { id: normalizeText(input.credentialId) } : {}),
    type: [W3cCredentialTypes.VerifiableCredential, ActivationCredentialTypes.LegalRepresentativeCredential],
    issuer: issuerDid,
    credentialSubject: {
      id: subjectDid,
      memberOf: {
        taxID: organizationTaxId,
      },
      hasOccupation: {
        identifier: {
          value: roleCode,
        },
      },
      hasCredential: {
        material: profileKeyMaterial,
      },
      ...(normalizeText(input.representativeIdentifier)
        ? { [ClaimsPersonSchemaorg.identifierValue]: normalizeText(input.representativeIdentifier) }
        : {}),
      ...(normalizeText(input.sameAs) ? { sameAs: normalizeText(input.sameAs) } : {}),
    },
    validFrom,
    ...(normalizeText(input.validUntil) ? { validUntil: normalizeText(input.validUntil) } : {}),
    ...(input.proof ? { proof: input.proof } : {}),
  };
}