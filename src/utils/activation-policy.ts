export type ActivationRepresentativePolicyErrorCode =
  | 'MISSING_REPRESENTATIVE_DID_WEB'
  | 'MISSING_REPRESENTATIVE_ROLE_RESPRSN'
  | 'MISSING_REPRESENTATIVE_CREDENTIAL_MATERIAL'
  | 'REPRESENTATIVE_TAXID_MISMATCH';

export type ActivationRepresentativePolicyError = {
  code: ActivationRepresentativePolicyErrorCode;
  message: string;
};

function asObject(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object') return undefined;
  return value as Record<string, unknown>;
}

export function extractCredentialSubject(credential: unknown): Record<string, unknown> | undefined {
  const obj = asObject(credential);
  if (!obj) return undefined;
  const subject = obj.credentialSubject;
  if (Array.isArray(subject)) return asObject(subject[0]);
  return asObject(subject);
}

export function normalizeTaxIdentifier(value: unknown): string | undefined {
  const normalized = String(value || '').trim().toUpperCase();
  return normalized || undefined;
}

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

export function extractRepresentativeRoleCode(representativeCredential: unknown): string | undefined {
  const subject = extractCredentialSubject(representativeCredential) || {};
  const occupation = subject.hasOccupation;
  if (typeof occupation === 'string') return occupation.trim() || undefined;
  if (occupation && typeof occupation === 'object') {
    const occ = occupation as Record<string, unknown>;
    const id = String(occ.identifier || '').trim();
    if (id) return id;
    const name = String(occ.name || '').trim();
    if (name) return name;
  }
  return undefined;
}

export function hasRoleCode(roleCode: string | undefined, requiredCode = 'RESPRSN'): boolean {
  const normalizedRole = String(roleCode || '').trim().toUpperCase();
  const normalizedRequired = String(requiredCode || '').trim().toUpperCase();
  return normalizedRole.includes(normalizedRequired);
}

export function extractRepresentativeCredentialMaterial(representativeCredential: unknown): string | undefined {
  const subject = extractCredentialSubject(representativeCredential) || {};
  const credentialData = subject.hasCredential;
  if (typeof credentialData === 'string') return credentialData.trim() || undefined;
  if (Array.isArray(credentialData)) {
    for (const item of credentialData) {
      const mat = String((item as Record<string, unknown>)?.material || '').trim();
      if (mat) return mat;
    }
  }
  if (credentialData && typeof credentialData === 'object') {
    const mat = String((credentialData as Record<string, unknown>)?.material || '').trim();
    if (mat) return mat;
  }
  return undefined;
}

export function extractDidWebFromCredential(credential: unknown): string | undefined {
  const obj = asObject(credential);
  if (!obj) return undefined;
  const subject = extractCredentialSubject(obj);
  const didCandidate = String(subject?.id || obj.id || '').trim();
  return didCandidate.startsWith('did:web:') ? didCandidate : undefined;
}

export function buildMemberDidWeb(ownerDidWeb: string, memberId: string, roleCode: string): string {
  return `${String(ownerDidWeb).trim()}:member:${String(memberId).trim()}:${String(roleCode).trim()}`;
}

export function isMemberDidWebUnderOwner(memberDidWeb: string, ownerDidWeb: string): boolean {
  const did = String(memberDidWeb || '').trim();
  const owner = String(ownerDidWeb || '').trim();
  if (!did.startsWith('did:web:') || !owner.startsWith('did:web:')) return false;
  return did.startsWith(`${owner}:member:`);
}

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

  const material = extractRepresentativeCredentialMaterial(input.representativeCredential);
  if (!material) {
    errors.push({
      code: 'MISSING_REPRESENTATIVE_CREDENTIAL_MATERIAL',
      message: 'ICA-issued representative credential is missing credentialSubject.hasCredential.material.',
    });
  }
  return errors;
}
