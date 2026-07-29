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

export type ClinicalTerminologyTranslationInput = Readonly<{
  resourceType: string;
  system?: string;
  code: string;
  token: string;
  locale: string;
}>;

export type ClinicalResourceDisplayOptions = Readonly<{
  /** UI language requested by the current user, for example `es` or `es-ES`. */
  locale?: string;
  /**
   * Product terminology lookup keyed by canonical `system|code`.
   *
   * Return `undefined` when the product has no translation so the shared
   * reader can fall back to the international `Coding.display`.
   */
  translateCode?: (input: ClinicalTerminologyTranslationInput) => string | undefined;
}>;

export type ClinicalResourceExpandedView = Readonly<{
  common: ClinicalResourceCommonView;
  xhtml?: string;
  notes: string[];
}>;

/** UI-ready summary for one Composition section and its resolved entries. */
export type ClinicalSectionView = Readonly<{
  code?: string;
  title: string;
  emptyReason?: string;
  resources: ClinicalResourceCardView[];
  unresolvedReferences: string[];
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
export function toClinicalResourceCommonView(
  entry: ClinicalResourceEntryLike,
  options: ClinicalResourceDisplayOptions = {},
): ClinicalResourceCommonView {
  const claims = readClaims(entry);
  const resourceType = resolveResourceType(entry, claims);
  const resource = entry.resource as ClinicalResourceLike | undefined;
  const title = resolveTitle(resourceType, claims, resource, options);

  return {
    title,
    resourceType,
    identifier: resolveIdentifier(resourceType, claims, resource),
    date: resolveDate(resourceType, claims, resource),
    periodStart: resolvePeriodStart(resourceType, claims, resource),
    periodEnd: resolvePeriodEnd(resourceType, claims, resource),
    fullUrl: trimValue(entry.fullUrl),
    actors: resolveActors(resourceType, claims, resource),
    claims,
  };
}

/**
 * Maps all entries from a Bundle into common clinical views.
 */
export function toClinicalResourceCommonViews(
  bundle: ClinicalResourceBundleLike,
  options: ClinicalResourceDisplayOptions = {},
): ClinicalResourceCommonView[] {
  return readBundleEntries(bundle).map((entry) => toClinicalResourceCommonView(entry, options));
}

/**
 * Maps one bundle entry to a minimal card view for section counters/list cards.
 */
export function toClinicalResourceCardView(
  entry: ClinicalResourceEntryLike,
  options: ClinicalResourceDisplayOptions = {},
): ClinicalResourceCardView {
  const common = toClinicalResourceCommonView(entry, options);
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
export function toClinicalResourceCardViews(
  bundle: ClinicalResourceBundleLike,
  options: ClinicalResourceDisplayOptions = {},
): ClinicalResourceCardView[] {
  return readBundleEntries(bundle).map((entry) => toClinicalResourceCardView(entry, options));
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
 * Builds section cards from the references authored in an IPS Composition.
 *
 * The Composition is authoritative for grouping. Resource type is deliberately
 * not used to guess a section because Observation and supporting resources can
 * be referenced from several IPS sections. Display options are propagated to
 * every generated card.
 */
export function toClinicalSectionViews(
  bundle: ClinicalResourceBundleLike,
  options: ClinicalResourceDisplayOptions = {},
): ClinicalSectionView[] {
  const entries = readBundleEntries(bundle);
  const composition = entries.find((entry) => entry.resource?.resourceType === ResourceTypesFhirR4.Composition);
  if (!composition?.resource) {
    return [];
  }

  const entryIndex = indexEntriesByFhirReference(entries);
  return flattenCompositionSections(asArray(composition.resource.section)).map((section) => {
    const references = asArray(section.entry)
      .map((item) => trimValue(asRecord(item).reference))
      .filter(Boolean);
    const resolvedEntries: ClinicalResourceEntryLike[] = [];
    const unresolvedReferences: string[] = [];

    references.forEach((reference) => {
      const resolved = resolveIndexedEntry(entryIndex, reference);
      if (resolved) {
        resolvedEntries.push(resolved);
      } else {
        unresolvedReferences.push(reference);
      }
    });

    const code = resolveCodeableConceptToken(section.code);
    const title = trimValue(section.title)
      || resolveCodeableConceptLabel(section.code)
      || code
      || 'Section';

    return {
      ...(code ? { code } : {}),
      title,
      ...(resolveCodeableConceptLabel(section.emptyReason)
        ? { emptyReason: resolveCodeableConceptLabel(section.emptyReason) }
        : {}),
      resources: resolvedEntries.map((entry) => toClinicalResourceCardView(entry, options)),
      unresolvedReferences,
    };
  });
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
    findBySuffix(claims, '.code-text-local'),
    findBySuffix(claims, '.codetextlocal'),
    findBySuffix(claims, '.medication-text'),
    findBySuffix(claims, '.vaccine-code-text'),
    findBySuffix(claims, '.value-concept-text'),
  ]) || resolveTitle(resourceType, claims);

  const internationalDisplay = firstDefinedText([
    resolveResourceCodeDisplay(resource),
    findBySuffix(claims, '.code-display'),
    findBySuffix(claims, '.codedisplay'),
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

function resolveTitle(
  resourceType: string,
  claims: ClinicalViewClaims,
  resource?: ClinicalResourceLike,
  options: ClinicalResourceDisplayOptions = {},
): string {
  if (resourceType === ResourceTypesFhirR4.Communication) {
    return (
      trimValue(claims[CommunicationClaim.ContentAttachmentTitle])
      || trimValue(claims[CommunicationClaim.Text])
      || trimValue(claims[CommunicationClaim.NoteText])
      || resolveFhirResourceTitle(resourceType, resource)
      || resourceType
    );
  }

  if (resourceType === ResourceTypesFhirR4.Consent) {
    const firstCategory = splitCsv(claims[ClaimConsent.category])[0];
    const firstAction = splitCsv(claims[ClaimConsent.action])[0];
    const firstPurpose = splitCsv(claims[ClaimConsent.purpose])[0];
    const categoryConcept = asArray(resource?.category)[0];
    return resolveLocalizedCodedTitle({
      resourceType,
      claims,
      resource,
      options,
      concept: categoryConcept,
      token: firstCategory || resolveCodeableConceptToken(categoryConcept),
    }) || humanTitleCandidate(firstAction) || humanTitleCandidate(firstPurpose) || resourceType;
  }

  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    const text = firstClaimValue(claims, [
      MedicationStatementClaim.MedicationText,
      MedicationStatementClaimsFhirApi.Medication,
    ]);
    const codeText = findFirstClaimBySuffixes(claims, ['.code-text', '.code-text-local', '.codetextlocal']);
    const codeDisplay = findFirstClaimBySuffixes(claims, ['.code-display', '.codedisplay']);
    const firstCode = firstClaimCsvValue(claims, [
      MedicationStatementClaim.Code,
      MedicationStatementClaimsFhirApi.Code,
    ]);
    return resolveLocalizedCodedTitle({
      resourceType,
      claims,
      resource,
      options,
      localText: text || codeText,
      internationalDisplay: codeDisplay,
      token: firstCode,
      concept: resource?.medicationCodeableConcept,
    }) || resourceType;
  }

  if (resourceType === ResourceTypesFhirR4.Condition) {
    const codeText = firstClaimValue(claims, [
      ConditionClaim.CodeText,
      ConditionClaimsFhirApi.CodeText,
    ]);
    const codeDisplay = firstClaimValue(claims, [
      ConditionClaim.CodeDisplay,
      ConditionClaimsFhirApi.CodeDisplay,
    ]);
    const firstCode = firstClaimCsvValue(claims, [
      ConditionClaim.Code,
      ConditionClaimsFhirApi.Code,
    ]);
    const firstCategory = firstClaimCsvValue(claims, [
      ConditionClaim.Category,
      ConditionClaimsFhirApi.Category,
    ]);
    return resolveLocalizedCodedTitle({
      resourceType,
      claims,
      resource,
      options,
      localText: codeText,
      internationalDisplay: codeDisplay,
      token: firstCode,
      concept: resource?.code,
    }) || humanTitleCandidate(firstCategory) || resourceType;
  }

  if (resourceType === ResourceTypesFhirR4.AllergyIntolerance) {
    const codeText = firstClaimValue(claims, [
      AllergyIntoleranceClaim.CodeText,
      AllergyIntoleranceClaimsFhirApi.CodeText,
    ]);
    const codeDisplay = firstClaimValue(claims, [
      AllergyIntoleranceClaim.CodeDisplay,
      AllergyIntoleranceClaimsFhirApi.CodeDisplay,
    ]);
    const firstCode = firstClaimCsvValue(claims, [
      AllergyIntoleranceClaim.Code,
      AllergyIntoleranceClaimsFhirApi.Code,
    ]);
    const firstCategory = firstClaimCsvValue(claims, [
      AllergyIntoleranceClaim.Category,
      AllergyIntoleranceClaimsFhirApi.Category,
    ]);
    return resolveLocalizedCodedTitle({
      resourceType,
      claims,
      resource,
      options,
      localText: codeText,
      internationalDisplay: codeDisplay,
      token: firstCode,
      concept: resource?.code,
    }) || humanTitleCandidate(firstCategory) || resourceType;
  }

  const primaryConcept = resolvePrimaryCodeableConcept(resourceType, resource);
  return resolveLocalizedCodedTitle({
    resourceType,
    claims,
    resource,
    options,
    concept: primaryConcept,
    token: resolveCodeableConceptToken(primaryConcept),
  }) || resolveFhirResourceTitle(resourceType, resource) || resourceType;
}

function resolveLocalizedCodedTitle(input: Readonly<{
  resourceType: string;
  claims: ClinicalViewClaims;
  resource?: ClinicalResourceLike;
  options: ClinicalResourceDisplayOptions;
  concept?: unknown;
  localText?: string;
  internationalDisplay?: string;
  token?: string;
}>): string | undefined {
  const concept = asRecord(input.concept);
  const localText = trimValue(input.localText)
    || trimValue(concept.text)
    || findFirstClaimBySuffixes(input.claims, ['.code-text', '.code-text-local', '.codetextlocal']);
  const internationalDisplay = trimValue(input.internationalDisplay)
    || asArray(concept.coding)
      .map((coding) => trimValue(asRecord(coding).display))
      .find(Boolean)
    || findFirstClaimBySuffixes(input.claims, ['.code-display', '.codedisplay']);
  const token = trimValue(input.token) || resolveCodeableConceptToken(input.concept);
  const locale = normalizeLanguage(input.options.locale);
  const resourceLanguage = normalizeLanguage(
    trimValue(input.resource?.language)
      || findBySuffix(input.claims, '.language'),
  );

  if (!locale) {
    return localText || internationalDisplay || resolveFhirResourceTitle(input.resourceType, input.resource);
  }
  if (resourceLanguage && locale === resourceLanguage && localText) {
    return localText;
  }
  if (locale === 'en') {
    return internationalDisplay || (resourceLanguage === 'en' ? localText : undefined) || localText;
  }
  if (token && input.options.translateCode) {
    const [system, ...codeParts] = token.split('|');
    const code = codeParts.length ? codeParts.join('|') : system;
    const translated = trimValue(input.options.translateCode({
      resourceType: input.resourceType,
      ...(codeParts.length ? { system } : {}),
      code,
      token,
      locale,
    }));
    if (translated) return translated;
  }
  return internationalDisplay || localText || resolveFhirResourceTitle(input.resourceType, input.resource);
}

function normalizeLanguage(value: unknown): string | undefined {
  const normalized = trimValue(value).toLowerCase().replace('_', '-');
  return normalized ? normalized.split('-')[0] : undefined;
}

function humanTitleCandidate(value: unknown): string | undefined {
  const normalized = trimValue(value);
  return normalized && !/^\S+\|\S+$/.test(normalized) ? normalized : undefined;
}

function resolveIdentifier(
  resourceType: string,
  claims: ClinicalViewClaims,
  resource?: ClinicalResourceLike,
): string | undefined {
  if (resourceType === ResourceTypesFhirR4.Communication) {
    return trimValue(claims[CommunicationClaim.Identifier]) || resolveFhirIdentifier(resource);
  }
  if (resourceType === ResourceTypesFhirR4.Consent) {
    return trimValue(claims[ClaimConsent.identifier]) || resolveFhirIdentifier(resource);
  }
  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    return firstClaimValue(claims, [
      MedicationStatementClaim.Identifier,
      MedicationStatementClaimsFhirApi.Identifier,
    ]) || resolveFhirIdentifier(resource);
  }
  if (resourceType === ResourceTypesFhirR4.Condition) {
    return firstClaimValue(claims, [
      ConditionClaim.Identifier,
      ConditionClaimsFhirApi.Identifier,
    ]) || resolveFhirIdentifier(resource);
  }
  if (resourceType === ResourceTypesFhirR4.AllergyIntolerance) {
    return firstClaimValue(claims, [
      AllergyIntoleranceClaim.Identifier,
      AllergyIntoleranceClaimsFhirApi.Identifier,
    ]) || resolveFhirIdentifier(resource);
  }
  return resolveFhirIdentifier(resource);
}

function resolveDate(
  resourceType: string,
  claims: ClinicalViewClaims,
  resource?: ClinicalResourceLike,
): string | undefined {
  if (resourceType === ResourceTypesFhirR4.Communication) {
    return trimValue(claims[CommunicationClaim.Sent]) || resolveFhirDate(resourceType, resource);
  }
  if (resourceType === ResourceTypesFhirR4.Consent) {
    return trimValue(claims[ClaimConsent.date]) || resolveFhirDate(resourceType, resource);
  }
  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    return firstClaimValue(claims, [
      MedicationStatementClaim.Effective,
      MedicationStatementClaimsFhirApi.Effective,
    ]) || resolveFhirDate(resourceType, resource);
  }
  if (resourceType === ResourceTypesFhirR4.Condition) {
    return firstClaimValue(claims, [
      ConditionClaim.OnsetDateTime,
      ConditionClaimsFhirApi.OnsetDateTime,
    ]) || resolveFhirDate(resourceType, resource);
  }
  if (resourceType === ResourceTypesFhirR4.AllergyIntolerance) {
    return firstClaimValue(claims, [
      AllergyIntoleranceClaim.OnsetDateTime,
      AllergyIntoleranceClaimsFhirApi.OnsetDateTime,
    ]) || resolveFhirDate(resourceType, resource);
  }

  const genericDate = findBySuffix(claims, '.date');
  return genericDate || resolveFhirDate(resourceType, resource) || undefined;
}

function resolvePeriodStart(
  resourceType: string,
  claims: ClinicalViewClaims,
  resource?: ClinicalResourceLike,
): string | undefined {
  if (resourceType === ResourceTypesFhirR4.Consent) {
    return trimValue(claims[ClaimConsent.periodStart]) || resolveFhirPeriod(resource).start;
  }
  return findBySuffix(claims, '.period-start') || resolveFhirPeriod(resource).start || undefined;
}

function resolvePeriodEnd(
  resourceType: string,
  claims: ClinicalViewClaims,
  resource?: ClinicalResourceLike,
): string | undefined {
  if (resourceType === ResourceTypesFhirR4.Consent) {
    return trimValue(claims[ClaimConsent.periodEnd]) || resolveFhirPeriod(resource).end;
  }
  return findBySuffix(claims, '.period-end') || resolveFhirPeriod(resource).end || undefined;
}

function resolveActors(
  resourceType: string,
  claims: ClinicalViewClaims,
  resource?: ClinicalResourceLike,
): ClinicalResourceActorView[] {
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
  appendFhirActors(out, resource);

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

function findFirstClaimBySuffixes(
  claims: ClinicalViewClaims,
  suffixes: readonly string[],
): string | undefined {
  return firstDefinedText(suffixes.map((suffix) => findBySuffix(claims, suffix)));
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

function resolvePrimaryCodeableConcept(
  resourceType: string,
  resource?: ClinicalResourceLike,
): unknown {
  if (!resource) return undefined;
  if (
    resourceType === ResourceTypesFhirR4.MedicationStatement
    || resourceType === ResourceTypesFhirR4.MedicationRequest
    || resourceType === ResourceTypesFhirR4.Medication
  ) {
    return resource.medicationCodeableConcept || resource.code;
  }
  if (resourceType === ResourceTypesFhirR4.Immunization) return resource.vaccineCode;
  if (resourceType === ResourceTypesFhirR4.Device) return resource.type;
  if (resourceType === ResourceTypesFhirR4.DocumentReference) return resource.type;
  if (resourceType === ResourceTypesFhirR4.Specimen) return resource.type;
  if (resourceType === ResourceTypesFhirR4.ImagingStudy) return asArray(resource.procedureCode)[0];
  if (resourceType === ResourceTypesFhirR4.PractitionerRole) return asArray(resource.code)[0];
  if (resourceType === ResourceTypesFhirR4.ImmunizationRecommendation) {
    const recommendation = asRecord(asArray(resource.recommendation)[0]);
    return asArray(recommendation.vaccineCode)[0];
  }
  return resource.code || asArray(resource.category)[0];
}

function resolveFhirResourceTitle(
  resourceType: string,
  resource?: ClinicalResourceLike,
): string | undefined {
  if (!resource) {
    return undefined;
  }

  const codeableConceptCandidates: unknown[] = [];
  if (
    resourceType === ResourceTypesFhirR4.MedicationStatement
    || resourceType === ResourceTypesFhirR4.MedicationRequest
  ) {
    codeableConceptCandidates.push(resource.medicationCodeableConcept);
    const medicationDisplay = trimValue(asRecord(resource.medicationReference).display);
    if (medicationDisplay) return medicationDisplay;
  }
  if (resourceType === ResourceTypesFhirR4.Immunization) {
    codeableConceptCandidates.push(resource.vaccineCode);
  }
  if (resourceType === ResourceTypesFhirR4.Device) {
    const deviceName = asArray(resource.deviceName)
      .map((item) => trimValue(asRecord(item).name))
      .find(Boolean);
    if (deviceName) return deviceName;
    codeableConceptCandidates.push(resource.type);
  }
  if (resourceType === ResourceTypesFhirR4.DeviceUseStatement) {
    const deviceDisplay = trimValue(asRecord(resource.device).display);
    if (deviceDisplay) return deviceDisplay;
  }
  if (resourceType === ResourceTypesFhirR4.Practitioner) {
    const humanName = asRecord(asArray(resource.name)[0]);
    const given = asArray(humanName.given).map((value) => trimValue(value)).filter(Boolean);
    const family = trimValue(humanName.family);
    const formatted = [...given, ...(family ? [family] : [])].join(' ').trim();
    if (formatted) return formatted;
  }

  codeableConceptCandidates.push(
    resource.code,
    resource.title,
    resource.name,
    resource.description,
    resource.summary,
    resource.scope,
    resource.category,
  );

  for (const candidate of codeableConceptCandidates) {
    const plainText = trimValue(candidate);
    if (plainText && typeof candidate !== 'object') {
      return plainText;
    }
    const label = resolveCodeableConceptPreferredLabel(candidate);
    if (label) {
      return label;
    }
    for (const item of asArray(candidate)) {
      const arrayLabel = resolveCodeableConceptPreferredLabel(item);
      if (arrayLabel) return arrayLabel;
    }
  }

  return undefined;
}

function resolveFhirIdentifier(resource?: ClinicalResourceLike): string | undefined {
  if (!resource) return undefined;
  for (const identifier of asArray(resource.identifier)) {
    const record = asRecord(identifier);
    const value = trimValue(record.value);
    if (value) return value;
  }
  return trimValue(resource.id) || undefined;
}

function resolveFhirDate(
  resourceType: string,
  resource?: ClinicalResourceLike,
): string | undefined {
  if (!resource) return undefined;
  const period = resolveFhirPeriod(resource);
  const candidates = resourceType === ResourceTypesFhirR4.MedicationRequest
    ? [resource.authoredOn, period.start]
    : resourceType === ResourceTypesFhirR4.Immunization
      ? [resource.occurrenceDateTime, resource.occurrenceString, resource.recorded]
      : resourceType === ResourceTypesFhirR4.Procedure
        ? [resource.performedDateTime, resource.performedString, period.start]
        : [
          resource.effectiveDateTime,
          resource.effectiveInstant,
          resource.occurrenceDateTime,
          resource.onsetDateTime,
          resource.dateTime,
          resource.date,
          resource.issued,
          resource.recordedDate,
          resource.recordedOn,
          resource.authoredOn,
          resource.created,
          period.start,
        ];
  return firstDefinedText(candidates.map((candidate) => trimValue(candidate) || undefined));
}

function resolveFhirPeriod(resource?: ClinicalResourceLike): { start?: string; end?: string } {
  if (!resource) return {};
  const candidates = [
    resource.effectivePeriod,
    resource.performedPeriod,
    resource.occurrencePeriod,
    resource.timingPeriod,
    resource.period,
    resource.onsetPeriod,
  ];
  for (const candidate of candidates) {
    const period = asRecord(candidate);
    const start = trimValue(period.start);
    const end = trimValue(period.end);
    if (start || end) {
      return {
        ...(start ? { start } : {}),
        ...(end ? { end } : {}),
      };
    }
  }
  return {};
}

function appendFhirActors(
  out: ClinicalResourceActorView[],
  resource?: ClinicalResourceLike,
): void {
  if (!resource) return;
  appendFhirReference(out, resource.subject || resource.patient, 'subject');
  appendFhirReference(out, resource.informationSource || resource.source, 'source');
  appendFhirReference(out, resource.sender, 'sender');
  appendFhirReference(out, resource.recipient, 'recipient');
  appendFhirReference(out, resource.recorder || resource.asserter, 'asserter');
  appendFhirReference(out, resource.author, 'creator');
  appendFhirReference(out, resource.performer, 'performer');
}

function appendFhirReference(
  out: ClinicalResourceActorView[],
  value: unknown,
  type: ClinicalActorType,
): void {
  const values = Array.isArray(value) ? value : [value];
  values.forEach((item) => {
    const record = asRecord(item);
    const actor = asRecord(record.actor);
    const identifierRecord = asRecord(record.identifier);
    const actorIdentifierRecord = asRecord(actor.identifier);
    const identifier = firstDefinedText([
      trimValue(record.reference) || undefined,
      trimValue(actor.reference) || undefined,
      trimValue(identifierRecord.value) || undefined,
      trimValue(actorIdentifierRecord.value) || undefined,
      trimValue(record.display) || undefined,
      trimValue(actor.display) || undefined,
    ]);
    if (identifier) pushActor(out, { identifier, type });
  });
}

function resolveCodeableConceptLabel(value: unknown): string | undefined {
  const concept = asRecord(value);
  const localText = trimValue(concept.text) || undefined;
  const internationalDisplay = asArray(concept.coding)
    .map((coding) => trimValue(asRecord(coding).display))
    .find(Boolean);
  return buildCombinedLabel(localText, internationalDisplay);
}

/**
 * Compact clinical cards show one human label. The local FHIR
 * `CodeableConcept.text` wins; the terminology `Coding.display` is the
 * English/international fallback. `system|code` is never treated as a label.
 */
function resolveCodeableConceptPreferredLabel(value: unknown): string | undefined {
  const concept = asRecord(value);
  const localText = trimValue(concept.text) || undefined;
  if (localText) return localText;
  return asArray(concept.coding)
    .map((coding) => trimValue(asRecord(coding).display))
    .find(Boolean);
}

function resolveCodeableConceptToken(value: unknown): string | undefined {
  const coding = asArray(asRecord(value).coding)
    .map((item) => asRecord(item))
    .find((item) => trimValue(item.code));
  if (!coding) return undefined;
  const system = trimValue(coding.system);
  const code = trimValue(coding.code);
  return system ? `${system}|${code}` : code;
}

function flattenCompositionSections(values: unknown[]): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  values.forEach((value) => {
    const section = asRecord(value);
    out.push(section);
    out.push(...flattenCompositionSections(asArray(section.section)));
  });
  return out;
}

function indexEntriesByFhirReference(
  entries: ClinicalResourceEntryLike[],
): Map<string, ClinicalResourceEntryLike> {
  const index = new Map<string, ClinicalResourceEntryLike>();
  entries.forEach((entry) => {
    const fullUrl = trimValue(entry.fullUrl);
    const resourceType = trimValue(entry.resource?.resourceType);
    const id = trimValue(entry.resource?.id);
    if (fullUrl) index.set(fullUrl, entry);
    if (resourceType && id) index.set(`${resourceType}/${id}`, entry);
    if (id) index.set(`urn:uuid:${id}`, entry);
  });
  return index;
}

function resolveIndexedEntry(
  index: Map<string, ClinicalResourceEntryLike>,
  reference: string,
): ClinicalResourceEntryLike | undefined {
  const direct = index.get(reference);
  if (direct) return direct;
  const relativeReference = reference.match(/([A-Za-z]+\/[^/]+)$/)?.[1];
  return relativeReference ? index.get(relativeReference) : undefined;
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
