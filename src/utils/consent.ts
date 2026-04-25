// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { assignCidToClaimsId } from './fhir-cid';

export type ConsentActorTargetInput = {
  /** Canonical actor identifier (for example did:web:..., urn:taxid:..., urn:tel:..., email). */
  identifier?: string;
  /** Preferred URL/domain alias for organization actor resolution (maps to did:web:<host>). */
  url?: string;
  /** Legacy alias maintained for backwards compatibility. */
  didWeb?: string;
  /** Legacy alias maintained for backwards compatibility. */
  organizationUrl?: string;
  organizationTaxId?: string;
  email?: string;
  phone?: string;
};

export type SubjectIdentifierInput = {
  // Domain model note: in business flows this can represent the member DID
  // of a personal organization (subject/person/patient), even if the wire
  // claim key remains `Consent.subject` for FHIR compatibility.
  subjectDid?: string;
  subjectPhone?: string;
  subjectGivenName?: string;
};

export type BuildConsentClaimsSimpleInput = SubjectIdentifierInput & {
  actor: ConsentActorTargetInput;
  actorRole: string;
  purpose: string;
  actions: string[];
  consentIdentifier?: string;
  consentDate?: string;
  decision?: 'permit' | 'deny';
  attachmentContentType?: string;
  attachmentBase64?: string;
};

export type BuildConsentClaimsSimpleOptions = {
  errorPrefix?: string;
  consentIdentifierFactory?: () => string;
};

export type ConsentClaimsSimpleResult = {
  actorIdentifier: string;
  subjectIdentifier: string;
  consentClaims: Record<string, unknown>;
};

export type ConsentClaimsWithCidResult = ConsentClaimsSimpleResult & {
  claimsCid: string;
};

export function normalizePhone(value: string): string {
  return String(value || '').replace(/[^\d+]/g, '');
}

export function normalizeIdentifierToken(value: string): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function withPrefix(prefix: string | undefined, message: string): string {
  return prefix ? `${prefix} ${message}` : message;
}

export function resolveActorIdentifier(
  target: ConsentActorTargetInput,
  options: { errorPrefix?: string } = {},
): string {
  const identifier = String(target?.identifier || '').trim();
  if (identifier) return identifier;

  const didWeb = String(target?.didWeb || '').trim();
  if (didWeb.startsWith('did:web:')) return didWeb;

  const orgUrl = String(target?.url || target?.organizationUrl || '').trim();
  if (orgUrl) {
    try {
      const parsed = orgUrl.includes('://') ? new URL(orgUrl) : new URL(`https://${orgUrl}`);
      if (parsed.hostname) return `did:web:${parsed.hostname.toLowerCase()}`;
    } catch {
      // Ignore malformed URL and continue with other fallbacks.
    }
  }

  const email = String(target?.email || '').trim().toLowerCase();
  if (email && email.includes('@')) return email;

  const taxId = String(target?.organizationTaxId || '').trim().toUpperCase();
  if (taxId) return `urn:taxid:${taxId}`;

  const phone = normalizePhone(String(target?.phone || ''));
  if (phone) return `urn:tel:${phone}`;

  throw new Error(withPrefix(options.errorPrefix, 'Could not resolve actor identifier from identifier/didWeb/url/email/taxId/phone.'));
}

export function resolveSubjectIdentifier(
  input: SubjectIdentifierInput,
  options: { errorPrefix?: string } = {},
): string {
  const did = String(input?.subjectDid || '').trim();
  if (did) return did;

  const phone = normalizePhone(String(input?.subjectPhone || ''));
  const given = normalizeIdentifierToken(String(input?.subjectGivenName || ''));
  if (phone && given) return `urn:person:phone:${phone}:given:${given}`;

  throw new Error(withPrefix(options.errorPrefix, 'grantProfessionalAccessSimple requires subjectDid or (subjectPhone + subjectGivenName).'));
}

export function buildConsentClaimsSimple(
  input: BuildConsentClaimsSimpleInput,
  options: BuildConsentClaimsSimpleOptions = {},
): ConsentClaimsSimpleResult {
  const actorIdentifier = resolveActorIdentifier(input.actor || {}, { errorPrefix: options.errorPrefix });
  const subjectIdentifier = resolveSubjectIdentifier(input, { errorPrefix: options.errorPrefix });

  const consentDate = String(input.consentDate || '').trim() || new Date().toISOString().slice(0, 10);
  const consentIdentifier = String(input.consentIdentifier || '').trim() || String(options.consentIdentifierFactory?.() || '').trim();
  if (!consentIdentifier) {
    throw new Error(withPrefix(options.errorPrefix, 'consentIdentifier is required when no consentIdentifierFactory is provided.'));
  }

  return {
    actorIdentifier,
    subjectIdentifier,
    consentClaims: {
      '@context': 'org.hl7.fhir.api',
      'Consent.decision': input.decision || 'permit',
      'Consent.subject': subjectIdentifier,
      'Consent.identifier': consentIdentifier,
      'Consent.date': consentDate,
      'Consent.purpose': input.purpose,
      'Consent.action': (input.actions || []).join(','),
      'Consent.actor-identifier': actorIdentifier,
      'Consent.actor-role': input.actorRole,
      'Consent.attachment-contentType': input.attachmentContentType || 'application/odrl+json',
      'Consent.attachment-data': input.attachmentBase64 || 'e30=',
    },
  };
}

export function buildConsentClaimsSimpleWithCid(
  input: BuildConsentClaimsSimpleInput,
  options: BuildConsentClaimsSimpleOptions = {},
): ConsentClaimsWithCidResult {
  const built = buildConsentClaimsSimple(input, options);
  const assigned = assignCidToClaimsId(built.consentClaims);
  return {
    actorIdentifier: built.actorIdentifier,
    subjectIdentifier: built.subjectIdentifier,
    consentClaims: assigned.claims,
    claimsCid: assigned.cid,
  };
}
