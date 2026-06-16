import {
  parseServiceCategories,
  parseServiceTypeClaims,
} from './dataspace-discovery';

export type ActivationRepresentativePolicyErrorCode =
  | 'MISSING_REPRESENTATIVE_SUBJECT_ID'
  | 'MISSING_REPRESENTATIVE_ROLE_RESPRSN'
  | 'MISSING_REPRESENTATIVE_CREDENTIAL_BINDING'
  | 'REPRESENTATIVE_TAXID_MISMATCH';

export type ActivationServiceAuthorizationPolicyErrorCode =
  | 'MISSING_ORGANIZATION_SERVICE_CATEGORY'
  | 'MISSING_ORGANIZATION_SERVICE_TYPE'
  | 'UNAUTHORIZED_ORGANIZATION_SERVICE_CATEGORY'
  | 'UNAUTHORIZED_ORGANIZATION_SERVICE_TYPE';

export type ActivationRepresentativePolicyError = {
  code: ActivationRepresentativePolicyErrorCode;
  message: string;
};

export type ActivationServiceAuthorizationPolicyError = {
  code: ActivationServiceAuthorizationPolicyErrorCode;
  message: string;
};

function asObject(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object') return undefined;
  return value as Record<string, unknown>;
}

function getCredentialSubjectMakesOffer(credential: unknown): Record<string, unknown> | undefined {
  const subject = extractCredentialSubject(credential);
  return asObject(subject?.makesOffer);
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
 * Security note:
 * - this field proves continuity of the controller signing/binding key
 * - it is intentionally different from `credentialSubject.sameAs`, which
 *   proves continuity of the representative public identity alias (for example
 *   email-derived `urn:multibase:z...`)
 * - production-grade activation flows are strongest when both dimensions are
 *   present in the ICA-issued representative VC
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
 * Extracts the representative subject identifier from `credentialSubject.id`.
 *
 * ICA currently models the natural person with a stable person URN while the
 * controller/bootstrap continuity is carried in sibling claims:
 * - `sameAs` for public identity continuity
 * - `hasCredential` for key-binding continuity
 *
 * Activation policy must therefore accept the canonical person URN form and
 * must not require a representative `did:web`.
 *
 * @param representativeCredential Candidate representative credential.
 */
export function extractRepresentativeSubjectId(representativeCredential: unknown): string | undefined {
  const obj = asObject(representativeCredential);
  if (!obj) return undefined;
  const subject = extractCredentialSubject(obj);
  const subjectId = String(subject?.id || '').trim();
  return subjectId || undefined;
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
 * Checks whether the representative role expresses the activation-controller
 * semantics accepted by GW.
 *
 * Compatibility rules:
 * - historical GW payloads may still use HL7/FHIR `RESPRSN`
 * - current ICA person credentials may encode the legal representative role as
 *   ISCO-08 `1120`, either tokenized (`ISCO-08|1120`) or as the canonical
 *   ILO URN (`urn:ilo:ilostat:isco-08:1120`)
 *
 * @param roleCode Candidate role token extracted from the credential.
 * @param requiredCode Required GW compatibility code, defaults to `RESPRSN`.
 */
export function hasActivationRepresentativeRole(roleCode: string | undefined, requiredCode = 'RESPRSN'): boolean {
  if (hasRoleCode(roleCode, requiredCode)) return true;
  const normalized = String(roleCode || '').trim().toUpperCase();
  if (!normalized) return false;
  return /(?:^|[|:])1120$/.test(normalized);
}

/**
 * Extracts the categories authorized by an ICA-issued organization credential.
 *
 * Canonical contract:
 * - `credentialSubject.makesOffer.category`
 *
 * Compatibility fallback:
 * - `credentialSubject.category`
 *
 * Host/operator credentials may authorize every business sector by publishing
 * `*` in the category list.
 */
export function extractAuthorizedServiceCategoriesFromCredential(
  organizationCredential: unknown,
): string[] {
  const subject = extractCredentialSubject(organizationCredential) || {};
  const makesOffer = getCredentialSubjectMakesOffer(organizationCredential) || {};
  return parseServiceCategories(makesOffer.category ?? subject.category);
}

/**
 * Extracts the service capability tokens authorized by an ICA-issued
 * organization credential.
 *
 * Canonical contract:
 * - `credentialSubject.makesOffer.serviceType`
 *
 * Compatibility fallbacks:
 * - `credentialSubject.serviceType`
 * - `credentialSubject.additionalType`
 * - `credentialSubject.makesOffer.additionalType`
 */
export function extractAuthorizedServiceTypesFromCredential(
  organizationCredential: unknown,
): string[] {
  const subject = extractCredentialSubject(organizationCredential) || {};
  const makesOffer = getCredentialSubjectMakesOffer(organizationCredential) || {};
  return parseServiceTypeClaims(
    makesOffer.serviceType ?? subject.serviceType,
    makesOffer.additionalType ?? subject.additionalType,
  );
}

/**
 * Validates that the ICA-issued organization credential authorizes the sector
 * and service capability that GW is about to activate/publish.
 *
 * Contract:
 * - `requiredCategory` must be present in
 *   `credentialSubject.makesOffer.category`
 * - `*` authorizes any requested category
 * - every `requiredServiceType` must be present in the credential capability set
 * - a missing authorization dimension is treated as a hard error because GW
 *   must not activate or publish an unsupported operator/provider profile
 */
export function validateActivationServiceAuthorizationPolicy(input: {
  organizationCredential?: unknown;
  requiredCategory?: string;
  requiredServiceTypes?: ReadonlyArray<string | undefined | null>;
}): ActivationServiceAuthorizationPolicyError[] {
  const errors: ActivationServiceAuthorizationPolicyError[] = [];
  const authorizedCategories = extractAuthorizedServiceCategoriesFromCredential(input.organizationCredential);
  const authorizedServiceTypes = extractAuthorizedServiceTypesFromCredential(input.organizationCredential);
  const requiredCategory = String(input.requiredCategory || '').trim();
  const requiredServiceTypes = Array.from(new Set(
    (input.requiredServiceTypes || [])
      .map((value) => String(value || '').trim())
      .filter(Boolean),
  ));

  if (requiredCategory) {
    if (!authorizedCategories.length) {
      errors.push({
        code: 'MISSING_ORGANIZATION_SERVICE_CATEGORY',
        message: 'ICA-issued organization credential is missing credentialSubject.makesOffer.category authorization.',
      });
    } else if (!authorizedCategories.includes(requiredCategory) && !authorizedCategories.includes('*')) {
      errors.push({
        code: 'UNAUTHORIZED_ORGANIZATION_SERVICE_CATEGORY',
        message: `ICA-issued organization credential does not authorize service category '${requiredCategory}'.`,
      });
    }
  }

  if (requiredServiceTypes.length) {
    if (!authorizedServiceTypes.length) {
      errors.push({
        code: 'MISSING_ORGANIZATION_SERVICE_TYPE',
        message: 'ICA-issued organization credential is missing credentialSubject.makesOffer.serviceType authorization.',
      });
    } else {
      const unauthorized = requiredServiceTypes.filter((serviceType) => !authorizedServiceTypes.includes(serviceType));
      if (unauthorized.length > 0) {
        errors.push({
          code: 'UNAUTHORIZED_ORGANIZATION_SERVICE_TYPE',
          message: `ICA-issued organization credential does not authorize serviceType '${unauthorized[0]}'.`,
        });
      }
    }
  }

  return errors;
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
 * The representative proof model is intentionally two-dimensional:
 * - `credentialSubject.sameAs` expresses public identity continuity
 * - `credentialSubject.hasCredential.material` expresses signing-key continuity
 *
 * For GW activation, the key-binding dimension is the hard requirement
 * enforced here. The public-identity dimension may still be used by higher
 * layers for stronger demo/production matching and auditability.
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
  const representativeSubjectId = input.representativeCredential
    ? extractRepresentativeSubjectId(input.representativeCredential)
    : undefined;

  if (input.representativeCredential && !representativeSubjectId) {
    errors.push({
      code: 'MISSING_REPRESENTATIVE_SUBJECT_ID',
      message: 'ICA-issued representative credential is missing credentialSubject.id.',
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
  if (!hasActivationRepresentativeRole(roleCode, input.requiredRoleCode || 'RESPRSN')) {
    errors.push({
      code: 'MISSING_REPRESENTATIVE_ROLE_RESPRSN',
      message: 'ICA-issued representative credential must include legal representative role semantics (RESPRSN or ISCO-08 1120) in credentialSubject.hasOccupation.',
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
