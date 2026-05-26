export type ActivationRepresentativePolicyErrorCode =
  | 'MISSING_REPRESENTATIVE_DID_WEB'
  | 'MISSING_REPRESENTATIVE_ROLE_RESPRSN'
  | 'MISSING_REPRESENTATIVE_CREDENTIAL_BINDING'
  | 'REPRESENTATIVE_TAXID_MISMATCH';

export type ActivationRepresentativePolicyError = {
  code: ActivationRepresentativePolicyErrorCode;
  message: string;
};

function asObject(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object') return undefined;
  return value as Record<string, unknown>;
}

/**
 * Extracts `credentialSubject` from a VC-like object.
 *
 * @param credential Candidate VC-like object.
 */
export function extractCredentialSubject(credential: unknown): Record<string, unknown> | undefined {
  const obj = asObject(credential);
  if (!obj) return undefined;
  const subject = obj.credentialSubject;
  if (Array.isArray(subject)) return asObject(subject[0]);
  return asObject(subject);
}

/**
 * Normalizes a tax identifier into uppercase trimmed form.
 *
 * @param value Raw tax identifier value.
 */
export function normalizeTaxIdentifier(value: unknown): string | undefined {
  const normalized = String(value || '').trim().toUpperCase();
  return normalized || undefined;
}

/**
 * Extracts an organization tax id from a VC-like organization credential.
 *
 * @param organizationCredential Candidate organization credential.
 */
export function extractOrganizationTaxId(organizationCredential: unknown): string | undefined {
  const subject = extractCredentialSubject(organizationCredential) || {};
  const identifier = asObject(subject.identifier);
  return (
    normalizeTaxIdentifier(subject.taxID)
    || normalizeTaxIdentifier(subject.taxId)
    || normalizeTaxIdentifier(identifier?.value)
    || normalizeTaxIdentifier(subject.identifierValue)
  );
}

/**
 * Extracts the `memberOf` tax id from a representative credential.
 *
 * @param representativeCredential Candidate representative credential.
 */
export function extractRepresentativeMemberOfTaxId(representativeCredential: unknown): string | undefined {
  const subject = extractCredentialSubject(representativeCredential) || {};
  const memberOf = asObject(subject.memberOf) || {};
  const identifier = asObject(memberOf.identifier);
  return (
    normalizeTaxIdentifier(memberOf.taxID)
    || normalizeTaxIdentifier(memberOf.taxId)
    || normalizeTaxIdentifier(identifier?.value)
    || normalizeTaxIdentifier(memberOf.identifierValue)
  );
}

/**
 * Extracts the representative role code from `credentialSubject.hasOccupation`.
 *
 * @param representativeCredential Candidate representative credential.
 */
export function extractRepresentativeRoleCode(representativeCredential: unknown): string | undefined {
  const subject = extractCredentialSubject(representativeCredential) || {};
  const occupation = subject.hasOccupation;
  if (typeof occupation === 'string') return occupation.trim() || undefined;
  if (occupation && typeof occupation === 'object') {
    const occ = occupation as Record<string, unknown>;
    const idRaw = occ.identifier;
    if (typeof idRaw === 'string' && idRaw.trim()) return idRaw.trim();
    if (idRaw && typeof idRaw === 'object') {
      const idObj = idRaw as Record<string, unknown>;
      const idValue = String(idObj.value || '').trim();
      if (idValue) return idValue;
    }
    const idValue = String(occ.value || '').trim();
    if (idValue) return idValue;
    const name = String(occ.name || '').trim();
    if (name) return name;
  }
  return undefined;
}

/**
 * Checks whether a role code contains the required code, ignoring prefixes such as `SYSTEM|`.
 *
 * @param roleCode Candidate role code.
 * @param requiredCode Required normalized code, defaults to `RESPRSN`.
 */
export function hasRoleCode(roleCode: string | undefined, requiredCode = 'RESPRSN'): boolean {
  const normalizedRole = String(roleCode || '')
    .trim()
    .toUpperCase()
    .replace(/^.*\|/, '')
    .replace(/^[|:]+/, '');
  const normalizedRequired = String(requiredCode || '').trim().toUpperCase();
  return normalizedRole.includes(normalizedRequired);
}

/**
 * Extracts representative signing/binding continuity data from `credentialSubject.hasCredential`.
 *
 * Compatibility rules:
 * - legacy VC payloads may still carry `hasCredential.material`
 * - newer payloads may carry the same semantic value in `hasCredential.value`
 *   or `hasCredential.identifier.value`
 *
 * @param representativeCredential Candidate representative credential.
 */
export function extractRepresentativeCredentialBinding(representativeCredential: unknown): string | undefined {
  const subject = extractCredentialSubject(representativeCredential) || {};
  const credentialData = subject.hasCredential;
  if (typeof credentialData === 'string') return credentialData.trim() || undefined;
  if (Array.isArray(credentialData)) {
    for (const item of credentialData) {
      const candidate = extractCredentialBindingValue(item);
      if (candidate) return candidate;
    }
  }
  if (credentialData && typeof credentialData === 'object') {
    const candidate = extractCredentialBindingValue(credentialData);
    if (candidate) return candidate;
  }
  return undefined;
}

function extractCredentialBindingValue(value: unknown): string | undefined {
  const obj = asObject(value) || {};
  const identifier = asObject(obj.identifier);
  const candidate = String(
    obj.material
    || obj.value
    || identifier?.value
    || '',
  ).trim();
  return candidate || undefined;
}

/**
 * Extracts a `did:web:` identifier from a VC-like credential.
 *
 * @param credential Candidate credential.
 */
export function extractDidWebFromCredential(credential: unknown): string | undefined {
  const obj = asObject(credential);
  if (!obj) return undefined;
  const subject = extractCredentialSubject(obj);
  const didCandidate = String(subject?.id || obj.id || '').trim();
  return didCandidate.startsWith('did:web:') ? didCandidate : undefined;
}

/**
 * Builds a deterministic member DID under an owner DID namespace.
 *
 * @param ownerDidWeb Owner DID.
 * @param memberId Member identifier fragment.
 * @param roleCode Role code fragment.
 */
export function buildMemberDidWeb(ownerDidWeb: string, memberId: string, roleCode: string): string {
  return `${String(ownerDidWeb).trim()}:member:${String(memberId).trim()}:${String(roleCode).trim()}`;
}

/**
 * Checks whether a member DID is scoped under an owner DID namespace.
 *
 * @param memberDidWeb Candidate member DID.
 * @param ownerDidWeb Owner DID namespace.
 */
export function isMemberDidWebUnderOwner(memberDidWeb: string, ownerDidWeb: string): boolean {
  const did = String(memberDidWeb || '').trim();
  const owner = String(ownerDidWeb || '').trim();
  if (!did.startsWith('did:web:') || !owner.startsWith('did:web:')) return false;
  return did.startsWith(`${owner}:member:`);
}

/**
 * Validates the activation representative policy against organization and representative credentials.
 *
 * @param input.organizationCredential Candidate organization credential.
 * @param input.representativeCredential Candidate representative credential.
 * @param input.requiredRoleCode Required representative role, defaults to `RESPRSN`.
 */
export function validateActivationRepresentativePolicy(input: {
  organizationCredential?: unknown;
  representativeCredential?: unknown;
  requiredRoleCode?: string;
}): ActivationRepresentativePolicyError[] {
  const errors: ActivationRepresentativePolicyError[] = [];
  const representativeDid = input.representativeCredential
    ? extractDidWebFromCredential(input.representativeCredential)
    : undefined;

  if (input.representativeCredential && !representativeDid) {
    errors.push({
      code: 'MISSING_REPRESENTATIVE_DID_WEB',
      message: 'ICA-issued representative credential is missing credentialSubject.id did:web.',
    });
  }

  if (!input.representativeCredential) return errors;

  const orgTax = extractOrganizationTaxId(input.organizationCredential);
  const repTax = extractRepresentativeMemberOfTaxId(input.representativeCredential);
  if (orgTax && repTax && orgTax !== repTax) {
    errors.push({
      code: 'REPRESENTATIVE_TAXID_MISMATCH',
      message: 'ICA-issued representative credential memberOf.taxID must match organization credential taxID.',
    });
  }

  const roleCode = extractRepresentativeRoleCode(input.representativeCredential);
  if (!hasRoleCode(roleCode, input.requiredRoleCode || 'RESPRSN')) {
    errors.push({
      code: 'MISSING_REPRESENTATIVE_ROLE_RESPRSN',
      message: 'ICA-issued representative credential must include Responsible Party role (RESPRSN) in credentialSubject.hasOccupation.',
    });
  }

  const binding = extractRepresentativeCredentialBinding(input.representativeCredential);
  if (!binding) {
    errors.push({
      code: 'MISSING_REPRESENTATIVE_CREDENTIAL_BINDING',
      message: 'ICA-issued representative credential is missing credentialSubject.hasCredential binding data (material, value, or identifier.value).',
    });
  }
  return errors;
}
