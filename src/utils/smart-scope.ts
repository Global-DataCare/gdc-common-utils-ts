import {
  HealthcareBasicSections,
  HealthcareSummarySections,
} from '../constants/healthcare';
import type {
  ConsentActorDescriptor,
  EffectiveAccessEvaluation,
} from '../models/consent-access';
import type { ConsentRule } from '../models/consent-rule';
import { evaluateConsentCoverage } from './consent';

export type SmartCompositionReadScopeOptions = {
  /**
   * Subject DID pinned by the current CORE GW root scope contract.
   */
  subjectDid: string;
  /**
   * One or more section claims such as `LOINC|60591-5`.
   *
   * When omitted, the helper defaults to the IPS patient summary document.
   */
  sections?: string | string[];
  /**
   * Read verb suffix used in the current GW SMART root scope contract.
   *
   * Defaults to `rs`.
   */
  accessVerb?: 'r' | 'rs' | 'cruds';
};

/**
 * Builds the gateway-pinned SMART root scope required by the current CORE GW
 * token contract:
 *
 * `organization/Composition.<verb>?subject=<did:web:...>&section=<code>[,<code>...]`
 *
 * This is intentionally a gateway-contract helper, not a generic SMART/FHIR
 * scope builder.
 */
export function buildSmartCompositionReadScope(
  options: SmartCompositionReadScopeOptions,
): string {
  const subjectDid = String(options.subjectDid || '').trim();
  if (!subjectDid) {
    throw new Error('buildSmartCompositionReadScope requires subjectDid.');
  }

  const sections = Array.isArray(options.sections)
    ? options.sections
    : options.sections
      ? [options.sections]
      : [HealthcareBasicSections.PatientSummaryDocument.claim];

  const normalizedSections = sections
    .map((section) => String(section || '').trim())
    .filter(Boolean);

  const query = new URLSearchParams({ subject: subjectDid });
  if (normalizedSections.length > 0) {
    query.set('section', normalizedSections.join(','));
  }

  return `organization/Composition.${options.accessVerb || 'rs'}?${query.toString()}`;
}

export type DeriveGrantedSmartScopesInput = Readonly<{
  /** Requested SMART root scopes. Every scope must pin the same subject. */
  requestedScopes: string | readonly string[];
  /** Authenticated actor descriptors resolved by a trusted runtime. */
  actor: ConsentActorDescriptor;
  /** Canonical relationship or professional role claim. */
  actorRole?: string;
  /** Consent purpose required for the access. */
  purpose?: string;
  /** Deterministic clock used by tests and policy evaluation. */
  now?: string | Date;
  /**
   * Known sections used to expand `section=*` or an omitted section filter.
   *
   * Defaults to the shared IPS summary-section registry. Supplying an explicit
   * list is useful for a sector-specific profile while keeping the evaluator
   * product-neutral.
   */
  availableSections?: readonly string[];
}>;

export type GrantedSmartScopesDecision = 'granted' | 'partial' | 'denied';

export type GrantedSmartScopesResult = Readonly<{
  /** One subject shared by every accepted request scope. */
  subject: string;
  /** Overall projection decision. Empty grants are always `denied`. */
  decision: GrantedSmartScopesDecision;
  /** Exact scopes that GW may place in the signed token. */
  grantedScopes: string[];
  /** Original scopes or scope fragments that received no grant. */
  deniedScopes: string[];
  /** Exact clinical sections retained in `grantedScopes`. */
  grantedSections: string[];
  /** Requested clinical sections omitted from `grantedScopes`. */
  deniedSections: string[];
  /** Per-scope shared consent evaluations retained for audit/tests. */
  evaluations: EffectiveAccessEvaluation[];
}>;

type ParsedClinicalScope = Readonly<{
  raw: string;
  subject: string;
  accessVerb: SmartCompositionReadScopeOptions['accessVerb'];
  requestedSections: string[];
  supported: boolean;
}>;

/**
 * Derives the exact read-only SMART scopes covered by active Consent rules.
 *
 * This pure helper deliberately does not create or sign a JWT. A trusted GW
 * supplies authoritative rules and actor identity, calls this projection, and
 * signs only `grantedScopes`. Browser applications may use the same function
 * with fixtures to predict UI capabilities, but that prediction grants no
 * authority.
 *
 * Security properties:
 * - all root scopes must target one subject
 * - `patient/*`, non-Composition and write-bearing scopes fail closed
 * - wildcard/omitted section requests are expanded to explicit known sections
 * - the returned scopes contain only `requested ∩ actively consented`
 *
 * @param rules Authoritative or test Consent rules.
 * @param input Requested scopes plus trusted actor/purpose context.
 */
export function deriveGrantedSmartScopes(
  rules: readonly ConsentRule[],
  input: DeriveGrantedSmartScopesInput,
): GrantedSmartScopesResult {
  const rawScopes = (Array.isArray(input.requestedScopes)
    ? input.requestedScopes
    : [input.requestedScopes])
    .map((scope) => String(scope || '').trim())
    .filter(Boolean);
  if (rawScopes.length === 0) {
    throw new Error('deriveGrantedSmartScopes requires at least one requested scope.');
  }

  const availableSections = Array.from(new Set(
    (input.availableSections?.length
      ? input.availableSections
      : Object.values(HealthcareSummarySections).map((section) => section.attributeValue))
      .map((section) => String(section || '').trim())
      .filter(Boolean),
  ));
  const parsedScopes = rawScopes.map((scope) => parseClinicalScope(scope, availableSections));
  const subjects = Array.from(new Set(parsedScopes.map((scope) => scope.subject).filter(Boolean)));
  if (subjects.length !== 1) {
    throw new Error('deriveGrantedSmartScopes requires every requested scope to pin one single subject.');
  }

  const subject = subjects[0];
  const grantedScopes: string[] = [];
  const deniedScopes: string[] = [];
  const grantedSections: string[] = [];
  const deniedSections: string[] = [];
  const evaluations: EffectiveAccessEvaluation[] = [];

  for (const parsed of parsedScopes) {
    if (!parsed.supported) {
      deniedScopes.push(parsed.raw);
      deniedSections.push(...parsed.requestedSections);
      continue;
    }

    const scopeGrantedSections: string[] = [];
    for (const section of parsed.requestedSections) {
      const evaluation = evaluateConsentCoverage([...rules], {
        subject,
        actor: input.actor,
        actorRole: input.actorRole,
        purpose: input.purpose,
        sections: [section],
        resourceTypes: ['Composition'],
        now: input.now,
      });
      evaluations.push(evaluation);
      if (evaluation.allowed) {
        scopeGrantedSections.push(section);
        grantedSections.push(section);
      } else {
        deniedSections.push(section);
      }
    }

    if (scopeGrantedSections.length === 0) {
      deniedScopes.push(parsed.raw);
      continue;
    }

    grantedScopes.push(buildSmartCompositionReadScope({
      subjectDid: subject,
      sections: scopeGrantedSections,
      accessVerb: parsed.accessVerb,
    }));
    if (scopeGrantedSections.length !== parsed.requestedSections.length) {
      deniedScopes.push(parsed.raw);
    }
  }

  const uniqueGrantedScopes = Array.from(new Set(grantedScopes));
  const uniqueDeniedScopes = Array.from(new Set(deniedScopes));
  const uniqueGrantedSections = Array.from(new Set(grantedSections));
  const uniqueDeniedSections = Array.from(new Set(deniedSections))
    .filter((section) => !uniqueGrantedSections.includes(section));
  const decision: GrantedSmartScopesDecision = uniqueGrantedScopes.length === 0
    ? 'denied'
    : uniqueDeniedScopes.length > 0 || uniqueDeniedSections.length > 0
      ? 'partial'
      : 'granted';

  return {
    subject,
    decision,
    grantedScopes: uniqueGrantedScopes,
    deniedScopes: uniqueDeniedScopes,
    grantedSections: uniqueGrantedSections,
    deniedSections: uniqueDeniedSections,
    evaluations,
  };
}

function parseClinicalScope(
  rawScope: string,
  availableSections: readonly string[],
): ParsedClinicalScope {
  const [head, queryString = ''] = rawScope.split('?', 2);
  const match = head.match(/^organization\/Composition\.(r|rs)$/);
  const params = new URLSearchParams(queryString);
  const subject = String(params.get('subject') || '').trim();
  if (!subject) {
    throw new Error(`SMART scope must pin a subject: ${rawScope}`);
  }
  const unsupportedFilter = Array.from(params.keys())
    .some((key) => key !== 'subject' && key !== 'section');
  const requested = String(params.get('section') || '').trim();
  const requestedSections = !requested || requested.split(',').includes('*')
    ? [...availableSections]
    : requested
      .split(',')
      .map((section) => section.trim())
      .filter(Boolean);

  return {
    raw: rawScope,
    subject,
    accessVerb: match?.[1] as SmartCompositionReadScopeOptions['accessVerb'],
    requestedSections: Array.from(new Set(requestedSections)),
    supported: Boolean(match) && !unsupportedFilter && requestedSections.length > 0,
  };
}
