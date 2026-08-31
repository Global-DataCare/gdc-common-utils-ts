// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { HealthcareActorRoleCodes } from '../constants/healthcare';
import { DataspaceSectors } from '../constants/sectors';

/** Subject categories accepted by the shared emergency-access contract. */
export const BreakGlassSubjectKinds = Object.freeze({
  Human: 'human',
  Animal: 'animal',
} as const);

export type BreakGlassSubjectKind =
  typeof BreakGlassSubjectKinds[keyof typeof BreakGlassSubjectKinds];

/** Governed reasons accepted by the shared emergency-access contract. */
export const BreakGlassReasonCodes = Object.freeze({
  LifeThreatening: 'life-threatening',
  SeriousImminentHarm: 'serious-imminent-harm',
  UnconsciousOrIncapacitated: 'unconscious-or-incapacitated',
  AnimalEmergency: 'animal-emergency',
} as const);

export type BreakGlassReasonCode =
  typeof BreakGlassReasonCodes[keyof typeof BreakGlassReasonCodes];

/** Transport-neutral emergency request data evaluated before persistence. */
export type BreakGlassRequest = Readonly<{
  incidentId: string;
  subjectKind: BreakGlassSubjectKind;
  reasonCode: BreakGlassReasonCode;
  justification: string;
}>;

export type BreakGlassPolicyInput = Readonly<{
  routeSector: string;
  subjectKind: BreakGlassSubjectKind;
  professionalRole: string;
  requestedScope: string;
  reasonCode: BreakGlassReasonCode;
}>;

export type BreakGlassPolicyDecision =
  | Readonly<{ allowed: true; maxLifetimeSeconds: 900 }>
  | Readonly<{ allowed: false; reason: string }>;

/** Extension hook owned by a domain package that recognizes its exact subject identifier. */
export type BreakGlassSubjectKindMatcher = (
  subjectDid: string,
  subjectKind: BreakGlassSubjectKind,
) => boolean;

const RESEARCH_SECTORS = new Set<string>([
  DataspaceSectors.HealthResearch,
  DataspaceSectors.AnimalResearch,
  DataspaceSectors.OneHealthResearch,
]);

function occupationCode(value: string): string {
  const normalized = String(value || '').trim();
  return (normalized.includes('|') ? normalized.slice(normalized.lastIndexOf('|') + 1) : normalized)
    .replace(/[^0-9]/g, '');
}

function isReadOnlyScope(scope: string): boolean {
  const tokens = String(scope || '').split(/\s+/).filter(Boolean);
  return tokens.length > 0 && tokens.every((token) => {
    const head = token.split('?', 1)[0] || '';
    const permission = head.slice(head.lastIndexOf('.') + 1).toLowerCase();
    return permission === 'r' || permission === 'rs';
  });
}

/** Matches only neutral subject identifiers. Product/card formats require an injected matcher. */
export const matchesCanonicalBreakGlassSubjectKind: BreakGlassSubjectKindMatcher = (
  subjectDid,
  subjectKind,
) => {
  const normalized = String(subjectDid || '').trim().toLowerCase();
  return subjectKind === BreakGlassSubjectKinds.Human
    ? normalized.includes(':individual:')
    : normalized.includes(':animal:');
};

/**
 * Resolves one subject identifier through the neutral matcher plus optional
 * domain matchers. Shared code never imports a product-specific card parser.
 */
export function matchesBreakGlassSubjectKind(
  subjectDid: string,
  subjectKind: BreakGlassSubjectKind,
  domainMatchers: readonly BreakGlassSubjectKindMatcher[] = [],
): boolean {
  return [matchesCanonicalBreakGlassSubjectKind, ...domainMatchers]
    .some((matcher) => matcher(subjectDid, subjectKind));
}

/**
 * Evaluates the reusable sector, role, reason and read-only scope policy.
 * GW services orchestrate persistence and audit; domain packages may extend
 * identifier recognition through the shared matcher interface.
 */
export function evaluateBreakGlassPolicy(
  input: BreakGlassPolicyInput,
): BreakGlassPolicyDecision {
  const routeSector = String(input.routeSector || '').trim().toLowerCase();
  if (RESEARCH_SECTORS.has(routeSector)) {
    return { allowed: false, reason: 'research_sector_forbidden' };
  }
  if (!isReadOnlyScope(input.requestedScope)) {
    return { allowed: false, reason: 'read_only_scope_required' };
  }

  const role = occupationCode(input.professionalRole);
  if (input.subjectKind === BreakGlassSubjectKinds.Human) {
    if (routeSector !== DataspaceSectors.HealthCare) {
      return { allowed: false, reason: 'human_sector_mismatch' };
    }
    if (!role.startsWith(HealthcareActorRoleCodes.MedicalDoctors)) {
      return { allowed: false, reason: 'professional_role_not_authorized' };
    }
    if (input.reasonCode === BreakGlassReasonCodes.AnimalEmergency) {
      return { allowed: false, reason: 'reason_subject_mismatch' };
    }
    return { allowed: true, maxLifetimeSeconds: 900 };
  }

  if (routeSector !== DataspaceSectors.AnimalCare) {
    return { allowed: false, reason: 'animal_sector_mismatch' };
  }
  if (role !== HealthcareActorRoleCodes.Veterinarian) {
    return { allowed: false, reason: 'professional_role_not_authorized' };
  }
  if (input.reasonCode !== BreakGlassReasonCodes.AnimalEmergency) {
    return { allowed: false, reason: 'reason_subject_mismatch' };
  }
  return { allowed: true, maxLifetimeSeconds: 900 };
}
