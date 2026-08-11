import {
  extractCredentialSubject,
  extractOrganizationTaxId,
  extractRepresentativeCredentialBinding,
  extractRepresentativeMemberOfTaxId,
} from './activation-policy';

export type LegalOrganizationVerificationCredential = Record<string, unknown>;

export type LegalOrganizationVerificationCredentialPair = Readonly<{
  verificationEntries: readonly unknown[];
  organizationCredential: LegalOrganizationVerificationCredential;
  legalRepresentativeCredential: LegalOrganizationVerificationCredential;
}>;

function asObject(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object') return undefined;
  return value as Record<string, unknown>;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function findCredentialResource(
  entries: readonly unknown[],
  expectedTypeFragment: string,
  fallbackIndex: number,
): LegalOrganizationVerificationCredential {
  const byType = entries.find((entry) => {
    const candidate = asObject(entry);
    const typeValue = candidate?.type;
    const tokens = Array.isArray(typeValue)
      ? typeValue.map((token) => String(token || ''))
      : [String(typeValue || '')];
    return tokens.some((token) => token.includes(expectedTypeFragment));
  });
  const selected = asObject(byType) || asObject(entries[fallbackIndex]);
  const resource = asObject(selected?.resource) || selected;
  if (!resource) {
    throw new Error(`Missing '${expectedTypeFragment}' verification credential in legal-organization verification response.`);
  }
  return resource;
}

function hasCredentialType(value: unknown, expectedType: string): boolean {
  const candidate = asObject(value);
  const resource = asObject(candidate?.resource);
  const typeValues = [candidate?.type, resource?.type];
  return typeValues.some((typeValue) => {
    const tokens = Array.isArray(typeValue)
      ? typeValue.map((token) => String(token || ''))
      : [String(typeValue || '')];
    return tokens.some((token) => token.includes(expectedType));
  });
}

/**
 * Extracts the controller actor stored at
 * `credentialSubject.owner` in an organization-controller service VC.
 *
 * @param credential Candidate organization-controller credential.
 */
export function extractOrganizationControllerOwner(
  credential: unknown,
): Record<string, unknown> | undefined {
  return asObject(extractCredentialSubject(credential)?.owner);
}

/**
 * Extracts the stable public actor identifier from an
 * organization-controller service VC.
 *
 * @param credential Candidate organization-controller credential.
 */
export function extractOrganizationControllerSameAs(credential: unknown): string | undefined {
  return String(extractOrganizationControllerOwner(credential)?.sameAs || '').trim() || undefined;
}

/**
 * Extracts the RFC 9278 JWK-thumbprint binding from an
 * organization-controller service VC.
 *
 * @param credential Candidate organization-controller credential.
 */
export function extractOrganizationControllerBinding(credential: unknown): string | undefined {
  const owner = extractOrganizationControllerOwner(credential);
  return owner ? extractRepresentativeCredentialBinding({ credentialSubject: owner }) : undefined;
}

/**
 * Returns the ICA verification entries currently projected by GW host
 * legal-organization `_transaction`.
 *
 * Supported shapes:
 * - direct `vc[]` projection on the first response entry
 * - nested `resource.icaResponse.body.data[]`
 * - direct ICA `_verify-response` bodies reused in tests/docs
 */
export function getLegalOrganizationVerificationEntriesFromResponseBody(responseBody: unknown): unknown[] {
  const root = asObject(responseBody) || {};
  const topLevelEntries = asArray(root.data);
  const bodyEntries = asArray(asObject(root.body)?.data);
  const firstEntry = asObject(bodyEntries[0]) || asObject(topLevelEntries[0]) || {};
  const projectedCredentials = asArray(firstEntry.vc);
  if (projectedCredentials.length >= 2) {
    return projectedCredentials;
  }

  const nestedIcaResponse = asObject(asObject(firstEntry.resource)?.icaResponse) || {};
  const nestedBodyEntries = asArray(asObject(nestedIcaResponse.body)?.data);
  if (nestedBodyEntries.length >= 2) {
    return nestedBodyEntries;
  }
  const nestedTopLevelEntries = asArray(nestedIcaResponse.data);
  if (nestedTopLevelEntries.length >= 2) {
    return nestedTopLevelEntries;
  }

  if (bodyEntries.length >= 2) {
    return bodyEntries;
  }
  if (topLevelEntries.length >= 2) {
    return topLevelEntries;
  }

  throw new Error('Legal-organization verification response is missing ICA verification credential entries.');
}

/**
 * Reads the organization and legal-representative credentials returned by the
 * legal-organization verification flow.
 */
export function readLegalOrganizationVerificationCredentialPairFromResponseBody(
  responseBody: unknown,
): LegalOrganizationVerificationCredentialPair {
  const verificationEntries = getLegalOrganizationVerificationEntriesFromResponseBody(responseBody);
  return {
    verificationEntries,
    organizationCredential: findCredentialResource(verificationEntries, 'Organization', 0),
    legalRepresentativeCredential: findCredentialResource(verificationEntries, 'LegalRepresentative', 1),
  };
}

/**
 * Reads the canonical organization tax id from the verification credential
 * pair and enforces agreement between organization and representative VC when
 * both values are present.
 */
export function readLegalOrganizationVerificationTaxIdFromResponseBody(responseBody: unknown): string {
  const pair = readLegalOrganizationVerificationCredentialPairFromResponseBody(responseBody);
  const organizationTaxId = extractOrganizationTaxId(pair.organizationCredential);
  const representativeTaxId = extractRepresentativeMemberOfTaxId(pair.legalRepresentativeCredential);
  const resolvedTaxId = organizationTaxId || representativeTaxId;
  if (!resolvedTaxId) {
    throw new Error('Legal-organization verification response is missing organization tax id in both organization and representative credentials.');
  }
  if (organizationTaxId && representativeTaxId && organizationTaxId !== representativeTaxId) {
    throw new Error('Legal-organization verification response contains mismatched organization tax ids between organization and representative credentials.');
  }
  return resolvedTaxId;
}

/**
 * Reads `credentialSubject.sameAs` from the legal-representative credential
 * when present.
 */
export function readLegalRepresentativeSameAsFromResponseBody(responseBody: unknown): string | undefined {
  const pair = readLegalOrganizationVerificationCredentialPairFromResponseBody(responseBody);
  return String(extractCredentialSubject(pair.legalRepresentativeCredential)?.sameAs || '').trim() || undefined;
}

/**
 * Reads `credentialSubject.hasCredential.material` continuity data from the
 * legal-representative credential when present.
 */
export function readLegalRepresentativeBindingFromResponseBody(responseBody: unknown): string | undefined {
  const pair = readLegalOrganizationVerificationCredentialPairFromResponseBody(responseBody);
  return extractRepresentativeCredentialBinding(pair.legalRepresentativeCredential);
}

/**
 * Returns all independently issued organization-controller service
 * credentials in an ICA or projected GW verification response.
 *
 * The result is empty when the response contains only the legacy organization
 * and legal-representative credential pair.
 */
export function readOrganizationControllerCredentialsFromResponseBody(
  responseBody: unknown,
): LegalOrganizationVerificationCredential[] {
  return getLegalOrganizationVerificationEntriesFromResponseBody(responseBody)
    .filter((entry) => hasCredentialType(entry, 'OrganizationControllerCredential'))
    .map((entry) => asObject(asObject(entry)?.resource) || asObject(entry))
    .filter((entry): entry is LegalOrganizationVerificationCredential => Boolean(entry));
}

/**
 * Returns one organization-controller service credential in an ICA or
 * projected GW verification response. Pass a stable actor `sameAs` to select
 * one controller independently; otherwise the first controller is returned.
 */
export function readOrganizationControllerCredentialFromResponseBody(
  responseBody: unknown,
  controllerSameAs?: string,
): LegalOrganizationVerificationCredential | undefined {
  const credentials = readOrganizationControllerCredentialsFromResponseBody(responseBody);
  const expectedSameAs = String(controllerSameAs || '').trim();
  return expectedSameAs
    ? credentials.find((credential) => extractOrganizationControllerSameAs(credential) === expectedSameAs)
    : credentials[0];
}

/**
 * Reads `credentialSubject.owner.sameAs` from the first
 * organization-controller service credential when present.
 */
export function readOrganizationControllerSameAsFromResponseBody(responseBody: unknown): string | undefined {
  return extractOrganizationControllerSameAs(
    readOrganizationControllerCredentialFromResponseBody(responseBody),
  );
}

/**
 * Reads `credentialSubject.owner.hasCredential.material` from the first
 * organization-controller service credential when present.
 */
export function readOrganizationControllerBindingFromResponseBody(responseBody: unknown): string | undefined {
  return extractOrganizationControllerBinding(
    readOrganizationControllerCredentialFromResponseBody(responseBody),
  );
}
