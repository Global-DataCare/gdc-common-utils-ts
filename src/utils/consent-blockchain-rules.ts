import type { BundleEntry, BundleJsonApi } from '../models/bundle.js';
import { ClaimConsent, ConsentDecisions } from '../models/consent-rule.js';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types.js';
import { buildConsentAtomicRuleCidV1, buildConsentAtomicRuleId } from './consent-duplicate-rules.js';
import { resolveSourceReferenceFromEvidence, sanitizeBlockchainReference } from './evidence-blockchain-references.js';
import type { EvidenceObjectDLT } from '../models/oidc4ida.evidence.model.js';
import { DocumentReferenceClaim } from '../models/interoperable-claims/document-reference-claims.js';

export type ConsentRuleBlockchainEntry = Readonly<{
  id: string;
  type: string;
  resource: Readonly<{
    resourceType: typeof ResourceTypesFhirR4.Consent;
    meta: Readonly<{
      claims: Record<string, unknown>;
    }>;
  }>;
}>;

export type ConsentRuleBlockchainPrimaryDocument = Readonly<{
  data: readonly ConsentRuleBlockchainEntry[];
}>;

export type ConsentRuleBlockchainStatus = 'active' | 'revoked';

export type BuildConsentRulePrimaryDocumentOptions = Readonly<{
  entryType?: string;
}>;

const DEFAULT_RULE_ENTRY_TYPE = 'ConsentAccessRule';
/**
 * Converts one bundle of `Consent` entries into a blockchain-oriented primary
 * document of atomic access rules.
 *
 * Design contract documented by tests:
 * - output is always a JSON:API-style primary document with `data[]`
 * - each output `data[i].id` is the CIDv1 hash of the canonical atomic `ruleId`
 * - each output entry keeps only the claims that should survive on-chain
 * - the source consent link is preserved under `Consent.event-basedon`
 * - non content-addressed references are hashed with SHA3-384 before they are
 *   allowed into the persisted claim set
 * - the current shared contract treats only `z...` base58 multibase references
 *   as already content-addressed by default
 * - `meta.audit` is intentionally absent because chaincode should author it
 */
export function buildConsentRulePrimaryDocument(
  entries: readonly BundleEntry[],
  options: BuildConsentRulePrimaryDocumentOptions = {},
): ConsentRuleBlockchainPrimaryDocument {
  const data: ConsentRuleBlockchainEntry[] = [];
  const bundleEvidenceReferenceIndex = buildBundleEvidenceReferenceIndex(entries);

  entries.forEach((entry) => {
    data.push(...deriveRuleEntriesFromConsentEntry(entry, options, bundleEvidenceReferenceIndex));
  });

  return Object.freeze({
    data: Object.freeze(data),
  });
}

/**
 * Keeps content-addressed references as-is and hashes plain identifiers or
 * locator references so they can be stored on-chain without leaking them.
 */
export function sanitizeConsentReferenceForBlockchain(value: unknown): string | undefined {
  return sanitizeBlockchainReference(value);
}

/**
 * Resolves the lifecycle status that one atomic blockchain rule should carry
 * when exported from a Consent resource.
 *
 * Shared rule:
 * - default status is `active`
 * - when `Consent.period-end` exists and is already in the past (or exactly
 *   now), the rule is exported as `revoked`
 */
export function deriveConsentRuleBlockchainStatus(
  claims: Record<string, unknown>,
  options: Readonly<{ now?: string | Date }> = {},
): ConsentRuleBlockchainStatus {
  const periodEnd = String(claims[ClaimConsent.periodEnd] || '').trim();
  if (!periodEnd) return 'active';

  const periodEndMs = Date.parse(periodEnd);
  if (Number.isNaN(periodEndMs)) return 'active';

  const nowMs = options.now instanceof Date
    ? options.now.getTime()
    : options.now
      ? new Date(options.now).getTime()
      : Date.now();

  return periodEndMs <= nowMs ? 'revoked' : 'active';
}

function deriveRuleEntriesFromConsentEntry(
  entry: BundleEntry,
  options: BuildConsentRulePrimaryDocumentOptions,
  bundleEvidenceReferenceIndex: Readonly<Record<string, string>>,
): ConsentRuleBlockchainEntry[] {
  const resourceType = String(entry.resource?.resourceType || '').trim();
  if (resourceType && resourceType !== ResourceTypesFhirR4.Consent) {
    return [];
  }

  const claims = (entry.resource?.meta?.claims || {}) as Record<string, unknown>;
  const actorIdentifiers = splitCsv(claims[ClaimConsent.actorIdentifier]);
  const purposes = splitCsv(claims[ClaimConsent.purpose]);
  if (actorIdentifiers.length === 0 || purposes.length === 0) {
    return [];
  }

  const roles = splitCsv(claims[ClaimConsent.actorRole]);
  const normalizedRoles = roles.length > 0 ? roles : [''];
  const subject = String(claims[ClaimConsent.subject] || '').trim() || undefined;
  const decision = normalizeDecision(claims[ClaimConsent.decision]);
  const sourceConsentIdentifier = String(claims[ClaimConsent.identifier] || '').trim() || undefined;
  const evidence = ((entry.resource?.meta || {}) as { evidence?: EvidenceObjectDLT | EvidenceObjectDLT[] }).evidence;
  const eventBasedOn = sanitizeConsentReferenceForBlockchain(
    claims[ClaimConsent.eventBasedOn] || sourceConsentIdentifier,
  );
  const sourceReference = resolveSourceReferenceFromEvidence(evidence)
    || resolveSourceReferenceFromBundleIndex(claims, bundleEvidenceReferenceIndex)
    || sanitizeConsentReferenceForBlockchain(claims[ClaimConsent.sourceReference]);
  const sanitizedClaims = buildSanitizedRuleClaims(claims, eventBasedOn, sourceReference);

  const out: ConsentRuleBlockchainEntry[] = [];
  for (const actorIdentifier of actorIdentifiers) {
    for (const purpose of purposes) {
      for (const role of normalizedRoles) {
        const ruleId = buildConsentAtomicRuleId({
          sourceConsentIdentifier,
          subject,
          decision,
          actorIdentifier,
          purpose,
          role: role || undefined,
        });
        out.push(Object.freeze({
          id: buildConsentAtomicRuleCidV1(ruleId),
          type: options.entryType || DEFAULT_RULE_ENTRY_TYPE,
          resource: Object.freeze({
            resourceType: ResourceTypesFhirR4.Consent,
            meta: Object.freeze({
              claims: sanitizedClaims,
            }),
          }),
        }));
      }
    }
  }

  return out;
}

function buildSanitizedRuleClaims(
  claims: Record<string, unknown>,
  eventBasedOn: string | undefined,
  sourceReference: string | undefined,
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {
    '@context': claims['@context'] || 'org.hl7.fhir.api',
  };

  const actions = splitCsv(claims[ClaimConsent.action]);
  if (actions.length > 0) {
    sanitized[ClaimConsent.action] = actions.join(',');
  }

  const roles = splitCsv(claims[ClaimConsent.actorRole]);
  if (roles.length > 0) {
    sanitized[ClaimConsent.actorRole] = roles.join(',');
  }

  if (eventBasedOn) {
    sanitized[ClaimConsent.eventBasedOn] = eventBasedOn;
  }

  if (sourceReference) {
    sanitized[ClaimConsent.sourceReference] = sourceReference;
  }

  return sanitized;
}

function normalizeDecision(value: unknown): string {
  return String(value || '').trim() === ConsentDecisions.Deny
    ? ConsentDecisions.Deny
    : ConsentDecisions.Permit;
}

function splitCsv(value: unknown): string[] {
  return Array.from(new Set(
    String(value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  ));
}

function buildBundleEvidenceReferenceIndex(entries: readonly BundleEntry[]): Readonly<Record<string, string>> {
  const index = new Map<string, string>();

  for (const entry of entries) {
    const resourceType = String(entry.resource?.resourceType || '').trim();
    const meta = (entry.resource?.meta || {}) as { claims?: Record<string, unknown>; evidence?: EvidenceObjectDLT | EvidenceObjectDLT[] };
    const evidenceReference = resolveSourceReferenceFromEvidence(meta.evidence);
    if (!evidenceReference) continue;

    const claims = meta.claims || {};
    const keys = [
      String(entry.fullUrl || '').trim(),
      String(entry.id || '').trim(),
      String(claims[DocumentReferenceClaim.Identifier] || '').trim(),
    ].filter(Boolean);

    if (resourceType === ResourceTypesFhirR4.DocumentReference || keys.length > 0) {
      for (const key of keys) index.set(key, evidenceReference);
    }
  }

  return Object.freeze(Object.fromEntries(index.entries()));
}

function resolveSourceReferenceFromBundleIndex(
  claims: Record<string, unknown>,
  bundleEvidenceReferenceIndex: Readonly<Record<string, string>>,
): string | undefined {
  const candidates = [
    ...splitCsv(claims[ClaimConsent.sourceReference]),
    ...splitCsv(claims[ClaimConsent.containedDocuments]),
    ...splitCsv(claims[ClaimConsent.attachmentContentIds]),
  ];

  for (const candidate of candidates) {
    const resolved = bundleEvidenceReferenceIndex[candidate];
    if (resolved) return resolved;
  }
  return undefined;
}

export type _BundleJsonApiRulesDocument = BundleJsonApi<ConsentRuleBlockchainEntry>;
