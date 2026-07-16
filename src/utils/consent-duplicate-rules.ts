import { HealthcareAllRolesByClaim } from '../constants/healthcare.js';
import { ClaimConsent, ConsentDecisions } from '../models/consent-rule.js';
import type { BundleEntry } from '../models/bundle.js';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types.js';
import { buildRawCidV1FromUtf8String, SHA3_384_MULTIHASH_PROFILE } from './multiformat-profile.js';

export type ConsentDuplicateRuleTargetSet = Readonly<{
  sections: readonly string[];
  resourceTypes: readonly string[];
  allTargets: readonly string[];
}>;

export type ConsentDuplicateRuleAffectedEntry = Readonly<{
  entryIndex: number;
  fullUrl?: string;
  identifier?: string;
  subject?: string;
  decision: string;
  actorIdentifier: string;
  purpose: string;
  role?: string;
  targets: ConsentDuplicateRuleTargetSet;
  redundantTargets: ConsentDuplicateRuleTargetSet;
}>;

export type ConsentDuplicateRuleConflict = Readonly<{
  ruleId: string;
  subject?: string;
  decision: string;
  actorIdentifier: string;
  purpose: string;
  role?: string;
  affectedEntries: readonly ConsentDuplicateRuleAffectedEntry[];
  effectiveTargets: ConsentDuplicateRuleTargetSet;
  hasPermissionReduction: boolean;
}>;

type DerivedAtomicConsentRule = Readonly<{
  ruleId: string;
  entryIndex: number;
  fullUrl?: string;
  identifier?: string;
  subject?: string;
  decision: string;
  actorIdentifier: string;
  purpose: string;
  role?: string;
  targets: ConsentDuplicateRuleTargetSet;
}>;

const SECTION_PREFIX = 'section:';
const RESOURCE_TYPE_PREFIX = 'resourceType:';

/**
 * Builds the canonical duplicate-detection rule id for one atomic consent rule.
 *
 * The identifier intentionally excludes section/resource targets so that two
 * entries that authorize different target sets for the same subject, decision,
 * actor, purpose, and role collide into the same duplicate group.
 */
export function buildConsentAtomicRuleId(input: Readonly<{
  subject?: string;
  decision?: string;
  actorIdentifier: string;
  purpose: string;
  role?: string;
}>): string {
  return [
    normalizeRuleKeyPart(input.subject),
    normalizeDecision(input.decision).toLowerCase(),
    normalizeRuleKeyPart(input.actorIdentifier),
    normalizeRuleKeyPart(input.purpose),
    normalizeConsentRoleForRuleKey(input.role),
  ].join('||');
}

/**
 * Builds the blockchain-facing atomic consent rule entry identifier.
 *
 * Contract:
 * - the clear-text canonical rule key never travels to chaincode as `entry.id`
 * - the physical identifier is a CIDv1 over the canonical rule key bytes
 * - digest algorithm: SHA3-384
 * - text encoding: UTF-8
 * - multicodec: raw
 * - multibase: base58btc
 */
export function buildConsentAtomicRuleCidV1(ruleId: string): string {
  return buildRawCidV1FromUtf8String(ruleId, SHA3_384_MULTIHASH_PROFILE);
}

/**
 * Detects duplicate atomic consent rules across bundle entries and calculates
 * the least-privilege target set shared by every duplicate.
 */
export function detectDuplicateConsentRuleConflicts(
  entries: readonly BundleEntry[],
): ConsentDuplicateRuleConflict[] {
  const grouped = new Map<string, DerivedAtomicConsentRule[]>();

  entries.forEach((entry, entryIndex) => {
    for (const rule of deriveAtomicConsentRules(entry, entryIndex)) {
      const current = grouped.get(rule.ruleId) || [];
      current.push(rule);
      grouped.set(rule.ruleId, current);
    }
  });

  const conflicts: ConsentDuplicateRuleConflict[] = [];
  for (const rules of grouped.values()) {
    const uniqueEntries = new Set(rules.map((rule) => rule.entryIndex));
    if (uniqueEntries.size < 2) continue;

    const effectiveTargets = intersectTargetSets(rules.map((rule) => rule.targets));
    const affectedEntries = rules.map((rule) => ({
      entryIndex: rule.entryIndex,
      ...(rule.fullUrl ? { fullUrl: rule.fullUrl } : {}),
      ...(rule.identifier ? { identifier: rule.identifier } : {}),
      ...(rule.subject ? { subject: rule.subject } : {}),
      decision: rule.decision,
      actorIdentifier: rule.actorIdentifier,
      purpose: rule.purpose,
      ...(rule.role ? { role: rule.role } : {}),
      targets: rule.targets,
      redundantTargets: subtractTargetSets(rule.targets, effectiveTargets),
    }));

    conflicts.push({
      ruleId: rules[0].ruleId,
      ...(rules[0].subject ? { subject: rules[0].subject } : {}),
      decision: rules[0].decision,
      actorIdentifier: rules[0].actorIdentifier,
      purpose: rules[0].purpose,
      ...(rules[0].role ? { role: rules[0].role } : {}),
      affectedEntries,
      effectiveTargets,
      hasPermissionReduction: affectedEntries.some((entry) => entry.redundantTargets.allTargets.length > 0),
    });
  }

  return conflicts.sort((left, right) => left.ruleId.localeCompare(right.ruleId));
}

function deriveAtomicConsentRules(entry: BundleEntry, entryIndex: number): DerivedAtomicConsentRule[] {
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
  const identifier = String(claims[ClaimConsent.identifier] || '').trim() || undefined;
  const decision = normalizeDecision(claims[ClaimConsent.decision]);
  const targets = extractTargetSet(claims);
  const derived: DerivedAtomicConsentRule[] = [];

  for (const actorIdentifier of actorIdentifiers) {
    for (const purpose of purposes) {
      for (const role of normalizedRoles) {
        derived.push({
          ruleId: buildConsentAtomicRuleId({
            subject,
            decision,
            actorIdentifier,
            purpose,
            role: role || undefined,
          }),
          entryIndex,
          ...(entry.fullUrl ? { fullUrl: entry.fullUrl } : {}),
          ...(identifier ? { identifier } : {}),
          ...(subject ? { subject } : {}),
          decision,
          actorIdentifier,
          purpose,
          ...(role ? { role } : {}),
          targets,
        });
      }
    }
  }

  return derived;
}

function extractTargetSet(claims: Record<string, unknown>): ConsentDuplicateRuleTargetSet {
  const sections = normalizeCsvValues([
    ...splitCsv(claims[ClaimConsent.action]),
    ...splitCsv(claims[ClaimConsent.category]),
  ]);
  const resourceTypes = splitCsv(claims[ClaimConsent.resourceType]);
  return freezeTargetSet({
    sections,
    resourceTypes,
    allTargets: [
      ...sections.map((section) => `${SECTION_PREFIX}${section}`),
      ...resourceTypes.map((resourceType) => `${RESOURCE_TYPE_PREFIX}${resourceType}`),
    ],
  });
}

function intersectTargetSets(targets: readonly ConsentDuplicateRuleTargetSet[]): ConsentDuplicateRuleTargetSet {
  if (targets.length === 0) {
    return freezeTargetSet({ sections: [], resourceTypes: [], allTargets: [] });
  }

  let sectionValues = [...targets[0].sections];
  let resourceTypeValues = [...targets[0].resourceTypes];

  for (const target of targets.slice(1)) {
    const nextSections = new Set(target.sections);
    const nextResourceTypes = new Set(target.resourceTypes);
    sectionValues = sectionValues.filter((section) => nextSections.has(section));
    resourceTypeValues = resourceTypeValues.filter((resourceType) => nextResourceTypes.has(resourceType));
  }

  return freezeTargetSet({
    sections: sectionValues,
    resourceTypes: resourceTypeValues,
    allTargets: [
      ...sectionValues.map((section) => `${SECTION_PREFIX}${section}`),
      ...resourceTypeValues.map((resourceType) => `${RESOURCE_TYPE_PREFIX}${resourceType}`),
    ],
  });
}

function subtractTargetSets(
  source: ConsentDuplicateRuleTargetSet,
  target: ConsentDuplicateRuleTargetSet,
): ConsentDuplicateRuleTargetSet {
  const targetSections = new Set(target.sections);
  const targetResourceTypes = new Set(target.resourceTypes);
  const remainingSections = source.sections.filter((section) => !targetSections.has(section));
  const remainingResourceTypes = source.resourceTypes.filter((resourceType) => !targetResourceTypes.has(resourceType));
  return freezeTargetSet({
    sections: remainingSections,
    resourceTypes: remainingResourceTypes,
    allTargets: [
      ...remainingSections.map((section) => `${SECTION_PREFIX}${section}`),
      ...remainingResourceTypes.map((resourceType) => `${RESOURCE_TYPE_PREFIX}${resourceType}`),
    ],
  });
}

function normalizeDecision(value: unknown): string {
  return String(value || '').trim() === ConsentDecisions.Deny
    ? ConsentDecisions.Deny
    : ConsentDecisions.Permit;
}

function normalizeRuleKeyPart(value: unknown): string {
  return String(value || '').trim().toLowerCase();
}

function normalizeConsentRoleForRuleKey(value: unknown): string {
  const claim = String(value || '').trim();
  if (!claim) return '';

  const knownRole = HealthcareAllRolesByClaim[claim];
  if (knownRole?.i18nKey) {
    return knownRole.i18nKey.toLowerCase();
  }

  const rawSeparatorIndex = claim.indexOf('|');
  if (rawSeparatorIndex <= 0) {
    return claim.toLowerCase();
  }

  const system = claim.slice(0, rawSeparatorIndex).trim().toLowerCase();
  const code = claim.slice(rawSeparatorIndex + 1).trim().toLowerCase();
  if (!code) {
    return claim.toLowerCase();
  }

  if (system === 'isco-08') {
    return `org.ilo.isco-08.${code}`;
  }
  if (system === 'v3-rolecode') {
    return `org.hl7.terminology.codesystem.v3-rolecode.${code}`;
  }
  if (system === 'v3-personalrelationshiproletype') {
    return `org.hl7.terminology.codesystem.v3-rolecode.${code}`;
  }

  return claim.toLowerCase();
}


function splitCsv(value: unknown): string[] {
  return normalizeCsvValues(String(value || '').split(','));
}

function normalizeCsvValues(values: readonly unknown[]): string[] {
  return Array.from(new Set(
    values
      .map((value) => String(value || '').trim())
      .filter(Boolean),
  ));
}

function freezeTargetSet(targets: {
  sections: readonly string[];
  resourceTypes: readonly string[];
  allTargets: readonly string[];
}): ConsentDuplicateRuleTargetSet {
  return Object.freeze({
    sections: Object.freeze([...targets.sections]),
    resourceTypes: Object.freeze([...targets.resourceTypes]),
    allTargets: Object.freeze([...targets.allTargets]),
  });
}
