// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types.js';
import type { BundleEntry, BundleJsonApi } from '../models/bundle.js';
import { ClaimConsent } from '../models/consent-rule.js';
import {
  AllergyIntoleranceClaim,
  AllergyIntoleranceClaimsFhirApi,
} from '../models/interoperable-claims/allergy-intolerance-claims.js';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims.js';
import {
  ConditionClaim,
  ConditionClaimsFhirApi,
} from '../models/interoperable-claims/condition-claims.js';
import { ImmunizationClaim } from '../models/interoperable-claims/immunization-claims.js';
import {
  MedicationStatementClaim,
  MedicationStatementClaimsFhirApi,
  MedicationStatementClaimsFhirApiExtended,
} from '../models/interoperable-claims/medication-statement-claims.js';
import { ObservationClaim } from '../models/interoperable-claims/observation-claims.js';

const CONSENT_ACTOR_REFERENCE_CLAIM = 'Consent.actor-reference';
const GENERIC_CREATOR_CLAIM_SUFFIX = '.creator';
const GENERIC_PERFORMER_CLAIM_SUFFIX = '.performer';
const GENERIC_ASSERTER_CLAIM_SUFFIX = '.asserter';

export type ClinicalViewClaims = Record<string, unknown>;

export type ClinicalActorType =
  | 'actor'
  | 'actor-reference'
  | 'recipient'
  | 'sender'
  | 'source'
  | 'creator'
  | 'performer'
  | 'asserter'
  | 'subject'
  | 'unknown';

export type ClinicalResourceActorView = Readonly<{
  identifier: string;
  role?: string;
  type: ClinicalActorType;
}>;

export type ClinicalResourceCommonView = Readonly<{
  title: string;
  resourceType: string;
  identifier?: string;
  date?: string;
  periodStart?: string;
  periodEnd?: string;
  fullUrl?: string;
  actors: ClinicalResourceActorView[];
  claims: ClinicalViewClaims;
}>;

export type ClinicalResourceCardView = Readonly<{
  title: string;
  resourceType: string;
  date?: string;
  fullUrl?: string;
  actorsCount: number;
}>;

export type ClinicalResourceExpandedView = Readonly<{
  common: ClinicalResourceCommonView;
  xhtml?: string;
  notes: string[];
}>;

export type ClinicalResourceLike = Readonly<{
  resourceType?: string;
  text?: {
    div?: unknown;
  };
  meta?: {
    claims?: Record<string, unknown>;
  };
  note?: unknown;
  code?: unknown;
  valueQuantity?: unknown;
  [key: string]: unknown;
}>;

export type LocalTextAndIntDisplay = Readonly<{
  localText?: string;
  internationalDisplay?: string;
  combined?: string;
}>;

export type NarrativeResult = Readonly<{
  xhtml?: string;
  source: 'resource.text.div' | 'derived-from-claims' | 'missing';
}>;

export type ClinicalResourceEntryLike = Readonly<{
  fullUrl?: string;
  type?: string;
  meta?: BundleEntry['meta'];
  resource?: BundleEntry['resource'];
}>;

export type ClinicalResourceBundleLike = Readonly<{
  resourceType?: string;
  type?: string;
  data?: readonly ClinicalResourceEntryLike[];
  entry?: readonly ClinicalResourceEntryLike[];
}>;

/**
 * Maps one bundle entry to a UI-friendly common clinical view contract.
 */
export function toClinicalResourceCommonView(entry: ClinicalResourceEntryLike): ClinicalResourceCommonView {
  const claims = readClaims(entry);
  const resourceType = resolveResourceType(entry, claims);
  const title = resolveTitle(resourceType, claims);

  return {
    title,
    resourceType,
    identifier: resolveIdentifier(resourceType, claims),
    date: resolveDate(resourceType, claims),
    periodStart: resolvePeriodStart(resourceType, claims),
    periodEnd: resolvePeriodEnd(resourceType, claims),
    fullUrl: trimValue(entry.fullUrl),
    actors: resolveActors(resourceType, claims),
    claims,
  };
}

/**
 * Maps all entries from a Bundle into common clinical views.
 */
export function toClinicalResourceCommonViews(bundle: ClinicalResourceBundleLike): ClinicalResourceCommonView[] {
  return readBundleEntries(bundle).map((entry) => toClinicalResourceCommonView(entry));
}

/**
 * Maps one bundle entry to a minimal card view for section counters/list cards.
 */
export function toClinicalResourceCardView(entry: ClinicalResourceEntryLike): ClinicalResourceCardView {
  const common = toClinicalResourceCommonView(entry);
  return {
    title: common.title,
    resourceType: common.resourceType,
    date: common.date,
    fullUrl: common.fullUrl,
    actorsCount: common.actors.length,
  };
}

/**
 * Maps all entries from a Bundle into minimal card views.
 */
export function toClinicalResourceCardViews(bundle: ClinicalResourceBundleLike): ClinicalResourceCardView[] {
  return readBundleEntries(bundle).map((entry) => toClinicalResourceCardView(entry));
}

/**
 * Maps one bundle entry to an expanded view that includes XHTML and notes array.
 */
export function toClinicalResourceExpandedView(entry: ClinicalResourceEntryLike): ClinicalResourceExpandedView {
  const common = toClinicalResourceCommonView(entry);
  return {
    common,
    xhtml: resolveXhtml(entry, common.claims),
    notes: resolveNotes(entry, common.resourceType, common.claims),
  };
}

/**
 * Maps all entries from a Bundle into expanded views.
 */
export function toClinicalResourceExpandedViews(bundle: ClinicalResourceBundleLike): ClinicalResourceExpandedView[] {
  return readBundleEntries(bundle).map((entry) => toClinicalResourceExpandedView(entry));
}

/**
 * Returns the most useful local text plus international display pair that can
 * be inferred from one FHIR-like resource and its `meta.claims`.
 */
export function getLocalTextAndIntDisplay(resource: ClinicalResourceLike): LocalTextAndIntDisplay {
  const claims = asRecord(resource?.meta?.claims);
  const resourceType = resolveResourceType({ resource }, claims);

  const localText = firstDefinedText([
    resolveResourceCodeText(resource),
    findBySuffix(claims, '.code-text'),
    findBySuffix(claims, '.medication-text'),
    findBySuffix(claims, '.vaccine-code-text'),
    findBySuffix(claims, '.value-concept-text'),
  ]) || resolveTitle(resourceType, claims);

  const internationalDisplay = firstDefinedText([
    resolveResourceCodeDisplay(resource),
    findBySuffix(claims, '.code-display'),
    findBySuffix(claims, '.vaccine-code-display'),
    findBySuffix(claims, '.value-concept-display'),
  ]);

  const combined = buildCombinedLabel(localText, internationalDisplay);
  return {
    ...(localText ? { localText } : {}),
    ...(internationalDisplay ? { internationalDisplay } : {}),
    ...(combined ? { combined } : {}),
  };
}

/**
 * Returns XHTML narrative for one FHIR-like resource, preferring
 * `resource.text.div` and otherwise deriving a deterministic fallback from
 * canonical `meta.claims`.
 */
export function getXhtmlOrDerived(resource: ClinicalResourceLike): string | undefined {
  return getNarrative(resource).xhtml;
}

/**
 * Returns XHTML plus the source used to obtain it.
 */
export function getNarrative(resource: ClinicalResourceLike): NarrativeResult {
  const fromFhirNarrative = trimValue(asRecord(resource?.text).div);
  if (fromFhirNarrative) {
    return {
      xhtml: fromFhirNarrative,
      source: 'resource.text.div',
    };
  }

  const claims = asRecord(resource?.meta?.claims);
  const fromSpecificClaim = findBySuffix(claims, '.xhtml')
    || findBySuffix(claims, '.text-div');
  if (fromSpecificClaim) {
    return {
      xhtml: fromSpecificClaim,
      source: 'derived-from-claims',
    };
  }

  const resourceType = resolveResourceType({ resource }, claims);
  const lines = buildNarrativeLines(resourceType, claims, resource);
  if (lines.length === 0) {
    return {
      source: 'missing',
    };
  }

  return {
    xhtml: `<div xmlns="http://www.w3.org/1999/xhtml">${lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}</div>`,
    source: 'derived-from-claims',
  };
}

function readClaims(entry: ClinicalResourceEntryLike): ClinicalViewClaims {
  const resourceClaims = asRecord(entry?.resource?.meta?.claims);
  const legacyClaims = asRecord(entry?.meta?.claims);
  return {
    ...legacyClaims,
    ...resourceClaims,
  };
}

function resolveResourceType(entry: ClinicalResourceEntryLike, claims: ClinicalViewClaims): string {
  const fromClaim = trimValue(claims[ClaimConsent.resourceType]);
  if (fromClaim) {
    return fromClaim;
  }

  const fromResource = trimValue(entry?.resource?.resourceType);
  if (fromResource) {
    return fromResource;
  }

  return 'Unknown';
}

function resolveTitle(resourceType: string, claims: ClinicalViewClaims): string {
  if (resourceType === ResourceTypesFhirR4.Communication) {
    return (
      trimValue(claims[CommunicationClaim.ContentAttachmentTitle])
      || trimValue(claims[CommunicationClaim.Text])
      || trimValue(claims[CommunicationClaim.NoteText])
      || resourceType
    );
  }

  if (resourceType === ResourceTypesFhirR4.Consent) {
    const firstCategory = splitCsv(claims[ClaimConsent.category])[0];
    const firstAction = splitCsv(claims[ClaimConsent.action])[0];
    const firstPurpose = splitCsv(claims[ClaimConsent.purpose])[0];
    return firstCategory || firstAction || firstPurpose || resourceType;
  }

  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    const text = firstClaimValue(claims, [
      MedicationStatementClaim.MedicationText,
      MedicationStatementClaimsFhirApi.Medication,
    ]);
    const firstCode = firstClaimCsvValue(claims, [
      MedicationStatementClaim.Code,
      MedicationStatementClaimsFhirApi.Code,
    ]);
    return text || firstCode || resourceType;
  }

  if (resourceType === ResourceTypesFhirR4.Condition) {
    const firstCode = firstClaimCsvValue(claims, [
      ConditionClaim.Code,
      ConditionClaimsFhirApi.Code,
    ]);
    const firstCategory = firstClaimCsvValue(claims, [
      ConditionClaim.Category,
      ConditionClaimsFhirApi.Category,
    ]);
    return firstCode || firstCategory || resourceType;
  }

  if (resourceType === ResourceTypesFhirR4.AllergyIntolerance) {
    const firstCode = firstClaimCsvValue(claims, [
      AllergyIntoleranceClaim.Code,
      AllergyIntoleranceClaimsFhirApi.Code,
    ]);
    const firstCategory = firstClaimCsvValue(claims, [
      AllergyIntoleranceClaim.Category,
      AllergyIntoleranceClaimsFhirApi.Category,
    ]);
    return firstCode || firstCategory || resourceType;
  }

  return resourceType;
}

function resolveIdentifier(resourceType: string, claims: ClinicalViewClaims): string | undefined {
  if (resourceType === ResourceTypesFhirR4.Communication) {
    return trimValue(claims[CommunicationClaim.Identifier]);
  }
  if (resourceType === ResourceTypesFhirR4.Consent) {
    return trimValue(claims[ClaimConsent.identifier]);
  }
  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    return firstClaimValue(claims, [
      MedicationStatementClaim.Identifier,
      MedicationStatementClaimsFhirApi.Identifier,
    ]);
  }
  if (resourceType === ResourceTypesFhirR4.Condition) {
    return firstClaimValue(claims, [
      ConditionClaim.Identifier,
      ConditionClaimsFhirApi.Identifier,
    ]);
  }
  if (resourceType === ResourceTypesFhirR4.AllergyIntolerance) {
    return firstClaimValue(claims, [
      AllergyIntoleranceClaim.Identifier,
      AllergyIntoleranceClaimsFhirApi.Identifier,
    ]);
  }
  return undefined;
}

function resolveDate(resourceType: string, claims: ClinicalViewClaims): string | undefined {
  if (resourceType === ResourceTypesFhirR4.Communication) {
    return trimValue(claims[CommunicationClaim.Sent]);
  }
  if (resourceType === ResourceTypesFhirR4.Consent) {
    return trimValue(claims[ClaimConsent.date]);
  }
  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    return firstClaimValue(claims, [
      MedicationStatementClaim.Effective,
      MedicationStatementClaimsFhirApi.Effective,
    ]);
  }
  if (resourceType === ResourceTypesFhirR4.Condition) {
    return firstClaimValue(claims, [
      ConditionClaim.OnsetDateTime,
      ConditionClaimsFhirApi.OnsetDateTime,
    ]);
  }
  if (resourceType === ResourceTypesFhirR4.AllergyIntolerance) {
    return firstClaimValue(claims, [
      AllergyIntoleranceClaim.OnsetDateTime,
      AllergyIntoleranceClaimsFhirApi.OnsetDateTime,
    ]);
  }

  const genericDate = findBySuffix(claims, '.date');
  return genericDate || undefined;
}

function resolvePeriodStart(resourceType: string, claims: ClinicalViewClaims): string | undefined {
  if (resourceType === ResourceTypesFhirR4.Consent) {
    return trimValue(claims[ClaimConsent.periodStart]);
  }
  return findBySuffix(claims, '.period-start') || undefined;
}

function resolvePeriodEnd(resourceType: string, claims: ClinicalViewClaims): string | undefined {
  if (resourceType === ResourceTypesFhirR4.Consent) {
    return trimValue(claims[ClaimConsent.periodEnd]);
  }
  return findBySuffix(claims, '.period-end') || undefined;
}

function resolveActors(resourceType: string, claims: ClinicalViewClaims): ClinicalResourceActorView[] {
  const out: ClinicalResourceActorView[] = [];

  if (resourceType === ResourceTypesFhirR4.Consent) {
    const identifiers = splitCsv(claims[ClaimConsent.actorIdentifier]);
    const roles = splitCsv(claims[ClaimConsent.actorRole]);
    const references = splitCsv(claims[CONSENT_ACTOR_REFERENCE_CLAIM]);

    identifiers.forEach((identifier, index) => {
      pushActor(out, {
        identifier,
        role: roles[index] || roles[0],
        type: 'actor',
      });
    });

    references.forEach((identifier, index) => {
      pushActor(out, {
        identifier,
        role: roles[index] || roles[0],
        type: 'actor-reference',
      });
    });
  }

  if (resourceType === ResourceTypesFhirR4.Communication) {
    splitCsv(claims[CommunicationClaim.Sender]).forEach((identifier) => {
      pushActor(out, { identifier, type: 'sender' });
    });

    splitCsv(claims[CommunicationClaim.Recipient]).forEach((identifier) => {
      pushActor(out, { identifier, type: 'recipient' });
    });
  }

  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    splitClaimCsv(claims, [
      MedicationStatementClaim.Source,
      MedicationStatementClaimsFhirApi.Source,
    ]).forEach((identifier) => {
      pushActor(out, { identifier, type: 'source' });
    });

    splitClaimCsv(claims, [
      MedicationStatementClaim.Subject,
      MedicationStatementClaimsFhirApi.Subject,
      MedicationStatementClaimsFhirApi.Patient,
    ]).forEach((identifier) => {
      pushActor(out, { identifier, type: 'subject' });
    });
  }

  if (resourceType === ResourceTypesFhirR4.Condition) {
    splitClaimCsv(claims, [
      ConditionClaim.Subject,
      ConditionClaimsFhirApi.Subject,
    ]).forEach((identifier) => {
      pushActor(out, { identifier, type: 'subject' });
    });

    splitClaimCsv(claims, [
      ConditionClaim.Recorder,
      ConditionClaimsFhirApi.Recorder,
    ]).forEach((identifier) => {
      pushActor(out, { identifier, type: 'asserter' });
    });
  }

  if (resourceType === ResourceTypesFhirR4.AllergyIntolerance) {
    splitClaimCsv(claims, [
      AllergyIntoleranceClaim.Subject,
      AllergyIntoleranceClaim.Patient,
      AllergyIntoleranceClaimsFhirApi.Subject,
      AllergyIntoleranceClaimsFhirApi.Patient,
    ]).forEach((identifier) => {
      pushActor(out, { identifier, type: 'subject' });
    });

    splitClaimCsv(claims, [
      AllergyIntoleranceClaim.Recorder,
      AllergyIntoleranceClaimsFhirApi.Recorder,
    ]).forEach((identifier) => {
      pushActor(out, { identifier, type: 'asserter' });
    });
  }

  appendGenericActorType(out, claims, GENERIC_CREATOR_CLAIM_SUFFIX, 'creator');
  appendGenericActorType(out, claims, GENERIC_PERFORMER_CLAIM_SUFFIX, 'performer');
  appendGenericActorType(out, claims, GENERIC_ASSERTER_CLAIM_SUFFIX, 'asserter');

  return out;
}

function resolveXhtml(entry: ClinicalResourceEntryLike, claims: ClinicalViewClaims): string | undefined {
  if (!entry?.resource) {
    return undefined;
  }
  const mergedResource: ClinicalResourceLike = {
    ...entry.resource,
    meta: {
      claims,
    },
  };
  return getXhtmlOrDerived(mergedResource);
}

function resolveNotes(entry: ClinicalResourceEntryLike, resourceType: string, claims: ClinicalViewClaims): string[] {
  const notesFromResource = readFhirNoteArray(entry);
  const notesFromClaims = readNotesFromClaims(resourceType, claims);
  return uniqueTokens([...notesFromResource, ...notesFromClaims]);
}

function readFhirNoteArray(entry: ClinicalResourceEntryLike): string[] {
  const rawNotes = entry?.resource?.note;
  if (!Array.isArray(rawNotes)) {
    return [];
  }

  return uniqueTokens(
    rawNotes
      .map((item) => trimValue(asRecord(item).text))
      .filter(Boolean),
  );
}

function readNotesFromClaims(resourceType: string, claims: ClinicalViewClaims): string[] {
  const out: string[] = [];

  if (resourceType === ResourceTypesFhirR4.Communication) {
    out.push(...splitCsv(claims[CommunicationClaim.NoteText]));
  }
  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    out.push(...splitClaimCsv(claims, [MedicationStatementClaim.Note]));
  }

  for (const [key, value] of Object.entries(claims)) {
    if (String(key || '').toLowerCase().endsWith('.note')) {
      out.push(...splitCsv(value));
    }
  }

  return uniqueTokens(out);
}

function appendGenericActorType(
  out: ClinicalResourceActorView[],
  claims: ClinicalViewClaims,
  keySuffix: string,
  actorType: ClinicalActorType,
): void {
  for (const [key, value] of Object.entries(claims)) {
    if (!String(key || '').toLowerCase().endsWith(keySuffix)) {
      continue;
    }
    splitCsv(value).forEach((identifier) => {
      pushActor(out, {
        identifier,
        type: actorType,
      });
    });
  }
}

function readBundleEntries(bundle: ClinicalResourceBundleLike | undefined): ClinicalResourceEntryLike[] {
  if (Array.isArray(bundle?.data)) {
    return [...bundle.data];
  }
  if (Array.isArray(bundle?.entry)) {
    return [...bundle.entry];
  }
  return [];
}

function firstClaimValue(claims: ClinicalViewClaims, keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = trimValue(claims[key]);
    if (value) {
      return value;
    }
  }
  return undefined;
}

function firstClaimCsvValue(claims: ClinicalViewClaims, keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const first = splitCsv(claims[key])[0];
    if (first) {
      return first;
    }
  }
  return undefined;
}

function splitClaimCsv(claims: ClinicalViewClaims, keys: readonly string[]): string[] {
  const out: string[] = [];
  for (const key of keys) {
    out.push(...splitCsv(claims[key]));
  }
  return out;
}

function findBySuffix(claims: ClinicalViewClaims, keySuffix: string): string | undefined {
  for (const [key, value] of Object.entries(claims)) {
    if (String(key || '').toLowerCase().endsWith(keySuffix)) {
      const normalized = trimValue(value);
      if (normalized) {
        return normalized;
      }
    }
  }
  return undefined;
}

function resolveResourceCodeText(resource: ClinicalResourceLike): string | undefined {
  return trimValue(asRecord(resource?.code).text) || undefined;
}

function resolveResourceCodeDisplay(resource: ClinicalResourceLike): string | undefined {
  const coding = asArray(asRecord(resource?.code).coding);
  for (const item of coding) {
    const display = trimValue(asRecord(item).display);
    if (display) {
      return display;
    }
  }
  return undefined;
}

function firstDefinedText(values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const normalized = trimValue(value);
    if (normalized) {
      return normalized;
    }
  }
  return undefined;
}

function buildCombinedLabel(localText?: string, internationalDisplay?: string): string | undefined {
  const local = trimValue(localText);
  const intl = trimValue(internationalDisplay);
  if (local && intl && local !== intl) {
    return `${local} (${intl})`;
  }
  return local || intl || undefined;
}

function buildNarrativeLines(
  resourceType: string,
  claims: ClinicalViewClaims,
  resource: ClinicalResourceLike,
): string[] {
  const lines: string[] = [];
  const label = getLocalTextAndIntDisplay(resource).combined || resolveTitle(resourceType, claims) || resourceType;
  if (label) {
    lines.push(label);
  }

  const date = resolveDate(resourceType, claims);
  if (date) {
    lines.push(`Date: ${date}`);
  }

  const periodStart = resolvePeriodStart(resourceType, claims);
  const periodEnd = resolvePeriodEnd(resourceType, claims);
  if (periodStart) {
    lines.push(`Start: ${periodStart}`);
    if (periodEnd) {
      lines.push(`End: ${periodEnd}`);
    }
  }

  appendFamilySpecificNarrativeLines(lines, resourceType, claims, resource);
  return uniqueTokens(lines);
}

function appendFamilySpecificNarrativeLines(
  lines: string[],
  resourceType: string,
  claims: ClinicalViewClaims,
  resource: ClinicalResourceLike,
): void {
  if (resourceType === ResourceTypesFhirR4.AllergyIntolerance) {
    pushLine(lines, 'Clinical status', firstClaimValue(claims, [
      AllergyIntoleranceClaim.ClinicalStatus,
      AllergyIntoleranceClaimsFhirApi.ClinicalStatus,
    ]));
    pushLine(lines, 'Verification status', firstClaimValue(claims, [
      AllergyIntoleranceClaim.VerificationStatus,
      AllergyIntoleranceClaimsFhirApi.VerificationStatus,
    ]));
    pushLine(lines, 'Criticality', firstClaimValue(claims, [
      AllergyIntoleranceClaim.Criticality,
      AllergyIntoleranceClaimsFhirApi.Criticality,
    ]));
    pushLine(lines, 'Category', firstClaimCsvValue(claims, [
      AllergyIntoleranceClaim.Category,
      AllergyIntoleranceClaimsFhirApi.Category,
    ]));
    return;
  }

  if (resourceType === ResourceTypesFhirR4.Condition) {
    pushLine(lines, 'Clinical status', firstClaimValue(claims, [
      ConditionClaim.ClinicalStatus,
      ConditionClaimsFhirApi.ClinicalStatus,
    ]));
    pushLine(lines, 'Verification status', firstClaimValue(claims, [
      ConditionClaim.VerificationStatus,
      ConditionClaimsFhirApi.VerificationStatus,
    ]));
    pushLine(lines, 'Severity', firstClaimValue(claims, [
      ConditionClaim.Severity,
      ConditionClaimsFhirApi.Severity,
    ]));
    pushLine(lines, 'Category', firstClaimCsvValue(claims, [
      ConditionClaim.Category,
      ConditionClaimsFhirApi.Category,
    ]));
    return;
  }

  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    pushLine(lines, 'Status', firstClaimValue(claims, [
      MedicationStatementClaim.Status,
      MedicationStatementClaimsFhirApi.Status,
    ]));
    pushLine(lines, 'Dose', buildQuantityLabel(
      firstDefinedText([
        normalizeNumericValue(claims[MedicationStatementClaimsFhirApiExtended.DoseQuantityValue]),
        normalizeNumericValue(claims['MedicationStatement.dose-quantity-value']),
      ]),
      firstDefinedText([
        trimValue(claims[MedicationStatementClaimsFhirApiExtended.DoseQuantityUnit]),
        trimValue(claims['MedicationStatement.dose-quantity-unit']),
      ]),
    ));
    pushLine(lines, 'Timing', buildMedicationTimingLabel(claims));
    pushLine(lines, 'Note', firstClaimValue(claims, [MedicationStatementClaim.Note]));
    return;
  }

  if (resourceType === ResourceTypesFhirR4.Immunization) {
    pushLine(lines, 'Status', trimValue(claims[ImmunizationClaim.Status]));
    pushLine(lines, 'Vaccine', firstDefinedText([
      findBySuffix(claims, '.vaccine-code-text'),
      findBySuffix(claims, '.vaccine-code-display'),
      trimValue(claims[ImmunizationClaim.VaccineCode]),
    ]));
    pushLine(lines, 'Performer', trimValue(claims[ImmunizationClaim.Performer]));
    pushLine(lines, 'Note', trimValue(claims[ImmunizationClaim.Note]));
    return;
  }

  if (resourceType === ResourceTypesFhirR4.Observation) {
    appendObservationNarrativeLines(lines, claims, resource);
  }
}

function appendObservationNarrativeLines(
  lines: string[],
  claims: ClinicalViewClaims,
  resource: ClinicalResourceLike,
): void {
  const codeValue = firstDefinedText([
    trimValue(claims[ObservationClaim.CodeValue]),
    splitTokenCode(claims[ObservationClaim.Code]),
  ]);

  const systolic = normalizeNumericValue(claims[ObservationClaim.BloodPressureSystolicNumber]);
  const diastolic = normalizeNumericValue(claims[ObservationClaim.BloodPressureDiastolicNumber]);
  const unit = firstDefinedText([
    trimValue(claims[ObservationClaim.ValueQuantityUnit]),
    resolveObservationUnitFromResource(resource),
  ]);

  if (codeValue === '85354-9' || systolic || diastolic) {
    if (systolic) {
      pushLine(lines, 'Systolic', buildQuantityLabel(systolic, unit));
    }
    if (diastolic) {
      pushLine(lines, 'Diastolic', buildQuantityLabel(diastolic, unit));
    }
    return;
  }

  const numericValue = normalizeNumericValue(claims[ObservationClaim.ValueQuantityNumber]);
  if (numericValue || unit) {
    pushLine(lines, 'Value', buildQuantityLabel(numericValue, unit));
  }
  pushLine(lines, 'Note', trimValue(claims[ObservationClaim.Note]));
}

function buildMedicationTimingLabel(claims: ClinicalViewClaims): string | undefined {
  const frequency = firstDefinedText([
    normalizeNumericValue(claims[MedicationStatementClaimsFhirApiExtended.TimingFrequency]),
    normalizeNumericValue(claims['MedicationStatement.timing-frequency']),
  ]);
  const period = firstDefinedText([
    normalizeNumericValue(claims[MedicationStatementClaimsFhirApiExtended.TimingPeriod]),
    normalizeNumericValue(claims['MedicationStatement.timing-period']),
  ]);
  const unit = firstDefinedText([
    trimValue(claims[MedicationStatementClaimsFhirApiExtended.TimingPeriodUnit]),
    trimValue(claims['MedicationStatement.timing-period-unit']),
  ]);
  if (!frequency && !period && !unit) {
    return undefined;
  }
  return [frequency ? `${frequency}x` : undefined, period ? `every ${period}` : undefined, unit].filter(Boolean).join(' ');
}

function buildQuantityLabel(value?: string, unit?: string): string | undefined {
  const normalizedValue = trimValue(value);
  const normalizedUnit = trimValue(unit);
  if (normalizedValue && normalizedUnit) {
    return `${normalizedValue} ${normalizedUnit}`;
  }
  return normalizedValue || normalizedUnit || undefined;
}

function resolveObservationUnitFromResource(resource: ClinicalResourceLike): string | undefined {
  const valueQuantity = asRecord(resource?.valueQuantity);
  return trimValue(valueQuantity.unit) || trimValue(valueQuantity.code) || undefined;
}

function normalizeNumericValue(value: unknown): string | undefined {
  const normalized = trimValue(value);
  return normalized || undefined;
}

function splitTokenCode(value: unknown): string | undefined {
  const normalized = trimValue(value);
  if (!normalized) {
    return undefined;
  }
  if (!normalized.includes('|')) {
    return normalized;
  }
  const parts = normalized.split('|');
  return trimValue(parts[parts.length - 1]) || undefined;
}

function pushLine(lines: string[], label: string, value?: string): void {
  const normalized = trimValue(value);
  if (!normalized) {
    return;
  }
  lines.push(`${label}: ${normalized}`);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function pushActor(out: ClinicalResourceActorView[], actor: ClinicalResourceActorView): void {
  const identifier = trimValue(actor.identifier);
  if (!identifier) {
    return;
  }

  const role = trimValue(actor.role);
  const candidate: ClinicalResourceActorView = {
    identifier,
    role: role || undefined,
    type: actor.type,
  };

  const dedupeKey = `${candidate.type}|${candidate.identifier}|${candidate.role || ''}`;
  const exists = out.some((item) => `${item.type}|${item.identifier}|${item.role || ''}` === dedupeKey);
  if (!exists) {
    out.push(candidate);
  }
}

function splitCsv(value: unknown): string[] {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueTokens(values: readonly string[]): string[] {
  return [...new Set(values.map((item) => String(item || '').trim()).filter(Boolean))];
}

function trimValue(value: unknown): string {
  return String(value || '').trim();
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}
