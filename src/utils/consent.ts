// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { assignCidToClaimsId } from './fhir-cid';

/**
 * Legacy structured actor selector kept for backwards compatibility while the
 * SDK converges on the canonical flat consent actor identifier contract.
 */
export type ConsentActorTargetInput = {
  /** Canonical actor identifier fallback when the caller already has it. */
  identifier?: string;
  /** Preferred URL/domain alias for organization actor resolution. */
  url?: string;
  /** Legacy alias maintained for backwards compatibility. */
  didWeb?: string;
  /** Legacy alias maintained for backwards compatibility. */
  organizationUrl?: string;
  /** Legacy alias maintained for backwards compatibility. */
  organizationTaxId?: string;
  /** Legacy alias maintained for backwards compatibility. */
  email?: string;
  /** Legacy alias maintained for backwards compatibility. */
  phone?: string;
};

/**
 * A canonical consent actor input accepted by the shared SDK helpers.
 *
 * Supported token forms:
 * - `did:...`
 * - `user@example.org`
 * - `tel:+34600111222`
 * - `ES`
 * - comma-separated lists such as `did:web:a,user@example.org,ES`
 *
 * Arrays are normalized into the same comma-separated canonical string form.
 * Legacy structured objects remain accepted for backwards compatibility.
 */
export type ConsentActorInput = string | string[] | ConsentActorTargetInput;

export type SubjectIdentifierInput = {
  // Domain model note: in business flows this can represent the member DID
  // of a personal organization (subject/person/patient), even if the wire
  // claim key remains `Consent.subject` for FHIR compatibility.
  subjectDid?: string;
  subjectPhone?: string;
  subjectGivenName?: string;
};

export type BuildConsentClaimsSimpleInput = SubjectIdentifierInput & {
  /**
   * Canonical consent actor selector.
   *
 * Prefer passing a canonical string or string list instead of the legacy
 * structured object. The normalized value becomes the flat
 * `Consent.actor-identifier` claim expected by CORE GW.
   */
  actor: ConsentActorInput;
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

export type ParsedConsentActorTokenKind =
  | 'did'
  | 'email'
  | 'phone'
  | 'country';

export type ParsedConsentActorToken = {
  kind: ParsedConsentActorTokenKind;
  value: string;
};

/**
 * Normalizes a phone string into a compact token form.
 *
 * @param value Raw phone-like input.
 */
export function normalizePhone(value: string): string {
  return String(value || '').replace(/[^\d+]/g, '');
}

/**
 * Normalizes arbitrary identifier text into a lowercase token-safe fragment.
 *
 * @param value Raw identifier text.
 */
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

/**
 * Parses a single canonical consent actor token into its resolved kind/value.
 *
 * @param rawToken Raw actor token such as `did:...`, `user@example.org`,
 * `tel:+34600111222`, or `ES`.
 * @returns The normalized parsed token or `undefined` when the token cannot be resolved.
 */
export function parseConsentActorToken(rawToken: string): ParsedConsentActorToken | undefined {
  const token = String(rawToken || '').trim();
  if (!token) return undefined;

  if (token.startsWith('did:')) {
    return { kind: 'did', value: token };
  }

  const email = token.toLowerCase();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { kind: 'email', value: email };
  }

  if (/^tel:/i.test(token)) {
    const normalizedPhone = normalizePhone(token.slice(4));
    if (normalizedPhone) return { kind: 'phone', value: `tel:${normalizedPhone}` };
  }

  if (/^[A-Z]{2}$/.test(token)) {
    return { kind: 'country', value: token };
  }

  return undefined;
}

/**
 * Normalizes a consent actor input into a list of canonical actor tokens.
 *
 * The output preserves input order while removing empty and duplicate tokens.
 * Legacy structured actor inputs are still supported as a compatibility layer.
 *
 * @param actor Consent actor input in canonical or legacy form.
 * @param options.errorPrefix Optional error prefix.
 * @throws When no valid actor token can be resolved from the input.
 */
export function normalizeConsentActors(
  actor: ConsentActorInput,
  options: { errorPrefix?: string } = {},
): string[] {
  const rawTokens: string[] = [];

  if (typeof actor === 'string') {
    rawTokens.push(...actor.split(','));
  } else if (Array.isArray(actor)) {
    for (const item of actor) rawTokens.push(...String(item || '').split(','));
  } else if (actor && typeof actor === 'object') {
    const legacy = actor as ConsentActorTargetInput;
    const identifier = String(legacy.identifier || '').trim();
    if (identifier) rawTokens.push(identifier);

    const didWeb = String(legacy.didWeb || '').trim();
    if (didWeb) rawTokens.push(didWeb);

    const orgUrl = String(legacy.url || legacy.organizationUrl || '').trim();
    if (orgUrl) {
      try {
        const parsed = orgUrl.includes('://') ? new URL(orgUrl) : new URL(`https://${orgUrl}`);
        if (parsed.hostname) rawTokens.push(`did:web:${parsed.hostname.toLowerCase()}`);
      } catch {
        // Ignore malformed URL and continue with other fallbacks.
      }
    }

    const email = String(legacy.email || '').trim();
    if (email) rawTokens.push(email);

    const phone = normalizePhone(String(legacy.phone || ''));
    if (phone) rawTokens.push(`tel:${phone}`);
  }

  const normalized: string[] = [];
  const seen = new Set<string>();
  for (const rawToken of rawTokens) {
    const parsed = parseConsentActorToken(rawToken);
    if (!parsed) continue;
    if (!seen.has(parsed.value)) {
      seen.add(parsed.value);
      normalized.push(parsed.value);
    }
  }

  if (normalized.length === 0) {
    throw new Error(withPrefix(options.errorPrefix, 'Consent.actor-identifier input is required and must contain at least one resolvable token (did, email, tel, or country code).'));
  }

  return normalized;
}

/**
 * Resolves the canonical consent actor string used in consent claims.
 *
 * The resulting value is always a comma-separated canonical string, even when
 * the caller provides an array or a legacy structured object.
 *
 * @param actor Consent actor input in canonical or legacy form.
 * @param options.errorPrefix Optional error prefix.
 */
export function resolveActorIdentifier(
  actor: ConsentActorInput,
  options: { errorPrefix?: string } = {},
): string {
  return normalizeConsentActors(actor, options).join(',');
}

/**
 * Resolves the canonical subject identifier used in consent claims.
 *
 * @param input Subject identification inputs.
 * @param options.errorPrefix Optional error prefix.
 */
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

/**
 * Builds a minimal consent claims object from simple business inputs.
 *
 * @param input Consent actor/subject/business data.
 * @param options.errorPrefix Optional error prefix.
 * @param options.consentIdentifierFactory Optional fallback identifier factory.
 */
export function buildConsentClaimsSimple(
  input: BuildConsentClaimsSimpleInput,
  options: BuildConsentClaimsSimpleOptions = {},
): ConsentClaimsSimpleResult {
  const actorIdentifier = resolveActorIdentifier(input.actor, { errorPrefix: options.errorPrefix });
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

/**
 * Builds minimal consent claims and assigns a deterministic CID into the claims id.
 *
 * @param input Consent actor/subject/business data.
 * @param options.errorPrefix Optional error prefix.
 * @param options.consentIdentifierFactory Optional fallback identifier factory.
 */
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
