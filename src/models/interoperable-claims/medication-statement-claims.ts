// src/models/fhir/MedicationStatement.claims.ts
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import type { ClaimSpec } from './types';

/** Canonical FHIR R5 code system for `MedicationStatement.adherence.code`. */
export const MEDICATION_STATEMENT_ADHERENCE_CODE_SYSTEM =
  'http://hl7.org/fhir/CodeSystem/medication-statement-adherence' as const;

/**
 * Codes published by the FHIR R5 Medication Statement Adherence value set.
 *
 * The FHIR binding strength is `example`, so applications must accept other
 * valid Coding values even when these helpers cover the published code system.
 */
export const MedicationStatementAdherenceCodes = {
  Taking: 'taking',
  TakingAsDirected: 'taking-as-directed',
  TakingNotAsDirected: 'taking-not-as-directed',
  NotTaking: 'not-taking',
  OnHold: 'on-hold',
  OnHoldAsDirected: 'on-hold-as-directed',
  OnHoldNotAsDirected: 'on-hold-not-as-directed',
  Stopped: 'stopped',
  StoppedAsDirected: 'stopped-as-directed',
  StoppedNotAsDirected: 'stopped-not-as-directed',
  Unknown: 'unknown',
} as const;

export type MedicationStatementAdherenceCode =
  typeof MedicationStatementAdherenceCodes[keyof typeof MedicationStatementAdherenceCodes];

/**
 * Canonical flat claim keys for the lightweight `MedicationStatement.*` mapping
 * used by shared examples, GW ingestion, and converter roundtrip tests.
 */
export const MedicationStatementClaim = {
  Identifier: 'MedicationStatement.identifier',
  Subject: 'MedicationStatement.subject',
  Patient: 'MedicationStatement.patient',
  Status: 'MedicationStatement.status',
  Category: 'MedicationStatement.category',
  Effective: 'MedicationStatement.effective',
  /** Official token SearchParameter `code`; maps to the medication concept, not a root FHIR element. */
  Code: 'MedicationStatement.code',
  /** Local/manual `CodeableConcept.text` companion for the medication concept. */
  CodeText: 'MedicationStatement.code-text',
  /** Readable alias for frontend authors; the emitted claim remains `MedicationStatement.code-text`. */
  CodeTextLocal: 'MedicationStatement.code-text',
  /** Terminology `Coding.display` companion for the medication concept. */
  CodeDisplay: 'MedicationStatement.code-display',
  /** Official reference SearchParameter; maps to `medication.reference`. */
  Medication: 'MedicationStatement.medication',
  PartOf: 'MedicationStatement.part-of',
  Source: 'MedicationStatement.source',
  /** @deprecated Use `CodeText`; retained only for historical payload readback. */
  MedicationText: 'MedicationStatement.medication-text',
  /** Official R5 token SearchParameter; its FHIRPath expression targets the adherence CodeableConcept. */
  Adherence: 'MedicationStatement.adherence',
  /** Local/manual CodeableConcept.text companion for the official `adherence` token. */
  AdherenceText: 'MedicationStatement.adherence-text',
  /** Terminology Coding.display companion for the official `adherence` token. */
  AdherenceDisplay: 'MedicationStatement.adherence-display',
  UserSelected: 'MedicationStatement.user-selected',
  /**
   * Free-text clinical note.
   *
   * Use this for human-readable instructions or remarks that may be authored
   * in any language, for example "take after meals" or "take as needed".
   *
   * For a dosage sentence such as "1 tablet every 8 hours", prefer
   * `DosageInstruction`. For structured timing/PRN semantics, prefer the
   * contextualized FHIR-style fields in `MedicationStatementClaimsFhirApiExtended`
   * such as `DosageAsNeeded`, `TimingFrequency`, `TimingPeriod`,
   * `TimingPeriodUnit`, and `DosagePatientInstructionText`.
   */
  Note: 'MedicationStatement.note',
  /**
   * Canonical CSV/list of related contained resource references or identifiers.
   *
   * Values may be:
   * - `urn:uuid:*`
   * - `ResourceType/urn:uuid:*`
   * - another canonical local resource reference used inside the same bundle
   */
  ContainedReferenceList: 'MedicationStatement.contained-reference-list',
  /**
   * @deprecated Use `ContainedReferenceList`.
   */
  ContainedResourceList: 'MedicationStatement.contained-resource-list',
  /**
   * @deprecated Use `ContainedReferenceList`.
   */
  ContainedDocuments: 'MedicationStatement.contained-documents',
  /**
   * @deprecated Use `ContainedDocuments`.
   */
  AttachmentContentIds: 'MedicationStatement.attachment-content-ids',
  /**
   * Human-readable dosage text, for example "1 tablet every 8 hours".
   *
   * This is the short flat claim to use when frontend or ingestion code needs
   * one sentence without expanding the full timing model.
   */
  DosageInstruction: 'MedicationStatement.dosage-instruction',
  MedicationIdentifier: 'MedicationStatement.medication-identifier',
  MedicationSerialNumber: 'MedicationStatement.medication-serial-number',
  MedicationExpirationDate: 'MedicationStatement.medication-expiration-date',
  DoseQuantityValue: 'MedicationStatement.dose-quantity-value',
  DoseQuantityUnit: 'MedicationStatement.dose-quantity-unit',
  DosageRoute: 'MedicationStatement.dosage-route',
  TimingFrequency: 'MedicationStatement.timing-frequency',
  TimingPeriod: 'MedicationStatement.timing-period',
  TimingPeriodUnit: 'MedicationStatement.timing-period-unit',
} as const;

export type MedicationStatementClaimKey =
  typeof MedicationStatementClaim[keyof typeof MedicationStatementClaim];

export const MedicationStatementClaimSpecs: ClaimSpec[] = [
  { key: MedicationStatementClaim.Code, meaning: 'Official token SearchParameter for medication.concept.', example: 'http://www.nlm.nih.gov/research/umls/rxnorm|5640' },
  { key: MedicationStatementClaim.CodeText, meaning: 'Local/manual medication concept text matching resource language.', example: 'Ibuprofeno' },
  { key: MedicationStatementClaim.CodeDisplay, meaning: 'Canonical/international medication Coding.display.', example: 'Ibuprofen' },
  { key: MedicationStatementClaim.Medication, meaning: 'Official reference SearchParameter for medication.reference.', example: 'Medication/medication-123' },
  { key: MedicationStatementClaim.Adherence, meaning: 'Official R5 adherence token SearchParameter.', example: `${MEDICATION_STATEMENT_ADHERENCE_CODE_SYSTEM}|taking-as-directed` },
  { key: MedicationStatementClaim.AdherenceText, meaning: 'Local/manual adherence CodeableConcept.text.', example: 'Tomando según indicación' },
  { key: MedicationStatementClaim.AdherenceDisplay, meaning: 'Canonical adherence Coding.display.', example: 'Taking As Directed' },
];

/**
 * Flat claims contract for MedicationStatement using FHIR API-like search params.
 *
 * Convention:
 * - Key format: `org.hl7.fhir.api.MedicationStatement.<concrete-parameter>`
 * - `<concrete-parameter>` in kebab-case (no nested dots).
 * - Keep values scalar/string-friendly so they can be persisted as tabular columns.
 */

/**
 * Standard FHIR search parameters for MedicationStatement.
 * @basedon https://hl7.org/fhir/medicationstatement.html#search
 */
export enum MedicationStatementClaimsFhirApi {
  Adherence = 'org.hl7.fhir.api.MedicationStatement.adherence',
  Category = 'org.hl7.fhir.api.MedicationStatement.category',
  Code = 'org.hl7.fhir.api.MedicationStatement.code',
  Effective = 'org.hl7.fhir.api.MedicationStatement.effective',
  Identifier = 'org.hl7.fhir.api.MedicationStatement.identifier',
  Medication = 'org.hl7.fhir.api.MedicationStatement.medication',
  PartOf = 'org.hl7.fhir.api.MedicationStatement.part-of',
  Patient = 'org.hl7.fhir.api.MedicationStatement.patient',
  Source = 'org.hl7.fhir.api.MedicationStatement.source',
  Status = 'org.hl7.fhir.api.MedicationStatement.status',
  Subject = 'org.hl7.fhir.api.MedicationStatement.subject',
}

/**
 * Extended flat parameters used for dosage/timing and operational indexing.
 * These are intentionally scalarized to map cleanly to SQL columns.
 */
export enum MedicationStatementClaimsFhirApiExtended {
  Adherence = 'org.hl7.fhir.api.MedicationStatement.adherence',
  AdherenceText = 'org.hl7.fhir.api.MedicationStatement.adherence-text',
  AdherenceDisplay = 'org.hl7.fhir.api.MedicationStatement.adherence-display',
  CodeText = 'org.hl7.fhir.api.MedicationStatement.code-text',
  CodeDisplay = 'org.hl7.fhir.api.MedicationStatement.code-display',
  Category = 'org.hl7.fhir.api.MedicationStatement.category',
  Code = 'org.hl7.fhir.api.MedicationStatement.code',
  Effective = 'org.hl7.fhir.api.MedicationStatement.effective',
  Identifier = 'org.hl7.fhir.api.MedicationStatement.identifier',
  Medication = 'org.hl7.fhir.api.MedicationStatement.medication',
  PartOf = 'org.hl7.fhir.api.MedicationStatement.part-of',
  Patient = 'org.hl7.fhir.api.MedicationStatement.patient',
  Source = 'org.hl7.fhir.api.MedicationStatement.source',
  Status = 'org.hl7.fhir.api.MedicationStatement.status',
  Subject = 'org.hl7.fhir.api.MedicationStatement.subject',

  // Dosage-level quantities
  DoseQuantity = 'org.hl7.fhir.api.MedicationStatement.dose-quantity',
  DoseQuantityValue = 'org.hl7.fhir.api.MedicationStatement.dose-quantity-value',
  DoseQuantityUnit = 'org.hl7.fhir.api.MedicationStatement.dose-quantity-unit',
  RateQuantity = 'org.hl7.fhir.api.MedicationStatement.rate-quantity',
  RateQuantityValue = 'org.hl7.fhir.api.MedicationStatement.rate-quantity-value',
  RateQuantityUnit = 'org.hl7.fhir.api.MedicationStatement.rate-quantity-unit',
  RateRangeLowQuantity = 'org.hl7.fhir.api.MedicationStatement.rate-range-low-quantity',
  RateRangeLowQuantityValue = 'org.hl7.fhir.api.MedicationStatement.rate-range-low-quantity-value',
  RateRangeLowQuantityUnit = 'org.hl7.fhir.api.MedicationStatement.rate-range-low-quantity-unit',
  RateRangeHighQuantity = 'org.hl7.fhir.api.MedicationStatement.rate-range-high-quantity',
  RateRangeHighQuantityValue = 'org.hl7.fhir.api.MedicationStatement.rate-range-high-quantity-value',
  RateRangeHighQuantityUnit = 'org.hl7.fhir.api.MedicationStatement.rate-range-high-quantity-unit',
  RateRatioNumeratorQuantity = 'org.hl7.fhir.api.MedicationStatement.rate-ratio-numerator-quantity',
  RateRatioNumeratorQuantityValue = 'org.hl7.fhir.api.MedicationStatement.rate-ratio-numerator-quantity-value',
  RateRatioNumeratorQuantityUnit = 'org.hl7.fhir.api.MedicationStatement.rate-ratio-numerator-quantity-unit',
  RateDenominatorQuantity = 'org.hl7.fhir.api.MedicationStatement.rate-denominator-quantity',
  RateDenominatorQuantityValue = 'org.hl7.fhir.api.MedicationStatement.rate-denominator-quantity-value',
  RateDenominatorQuantityUnit = 'org.hl7.fhir.api.MedicationStatement.rate-denominator-quantity-unit',
  DoseType = 'org.hl7.fhir.api.MedicationStatement.dose-type',
  DosageMethod = 'org.hl7.fhir.api.MedicationStatement.dosage-method',
  DosageMethodText = 'org.hl7.fhir.api.MedicationStatement.dosage-method-text',
  DosageRoute = 'org.hl7.fhir.api.MedicationStatement.dosage-route',
  DosageRouteText = 'org.hl7.fhir.api.MedicationStatement.dosage-route-text',
  DosageSite = 'org.hl7.fhir.api.MedicationStatement.dosage-site',
  DosageSiteText = 'org.hl7.fhir.api.MedicationStatement.dosage-site-text',
  DosageCondition = 'org.hl7.fhir.api.MedicationStatement.dosage-condition',
  DosageAsNeeded = 'org.hl7.fhir.api.MedicationStatement.dosage-asneeded',
  DosagePatientInstructionText = 'org.hl7.fhir.api.MedicationStatement.dosage-patientinstruction-text',
  DoseMaxPerPeriod = 'org.hl7.fhir.api.MedicationStatement.dose-maxperperiod',
  DoseMaxPerAdministration = 'org.hl7.fhir.api.MedicationStatement.dose-maxperadministration',
  DoseMaxPerLifetime = 'org.hl7.fhir.api.MedicationStatement.dose-maxperlifetime',

  // Timing.repeat scalarization
  TimingDescription = 'org.hl7.fhir.api.MedicationStatement.timing-description',
  TimingCount = 'org.hl7.fhir.api.MedicationStatement.timing-count',
  TimingCountMax = 'org.hl7.fhir.api.MedicationStatement.timing-countmax',
  TimingDuration = 'org.hl7.fhir.api.MedicationStatement.timing-duration',
  TimingDurationMax = 'org.hl7.fhir.api.MedicationStatement.timing-durationmax',
  TimingDurationUnit = 'org.hl7.fhir.api.MedicationStatement.timing-duration-unit',
  TimingFrequency = 'org.hl7.fhir.api.MedicationStatement.timing-frequency',
  TimingFrequencyMax = 'org.hl7.fhir.api.MedicationStatement.timing-frequencymax',
  TimingPeriod = 'org.hl7.fhir.api.MedicationStatement.timing-period',
  TimingPeriodMax = 'org.hl7.fhir.api.MedicationStatement.timing-periodmax',
  TimingPeriodUnit = 'org.hl7.fhir.api.MedicationStatement.timing-period-unit',
  TimingDayOfWeek = 'org.hl7.fhir.api.MedicationStatement.timing-dayofweek',
  TimingTimeOfDay = 'org.hl7.fhir.api.MedicationStatement.timing-timeofday',
  TimingWhen = 'org.hl7.fhir.api.MedicationStatement.timing-when',
  TimingOffset = 'org.hl7.fhir.api.MedicationStatement.timing-offset',
  TimingStartOffset = 'org.hl7.fhir.api.MedicationStatement.timing-startoffset',
  TimingEndOffset = 'org.hl7.fhir.api.MedicationStatement.timing-endoffset',

  // Timing.repeat.bounds[x]
  TimingBoundsType = 'org.hl7.fhir.api.MedicationStatement.timing-bounds-type',
  TimingBoundsPeriodStart = 'org.hl7.fhir.api.MedicationStatement.timing-bounds-period-start',
  TimingBoundsPeriodEnd = 'org.hl7.fhir.api.MedicationStatement.timing-bounds-period-end',
  TimingBoundsDuration = 'org.hl7.fhir.api.MedicationStatement.timing-bounds-duration',
  TimingBoundsDurationValue = 'org.hl7.fhir.api.MedicationStatement.timing-bounds-duration-value',
  TimingBoundsDurationUnit = 'org.hl7.fhir.api.MedicationStatement.timing-bounds-duration-unit',
  TimingBoundsRangeLow = 'org.hl7.fhir.api.MedicationStatement.timing-bounds-range-low',
  TimingBoundsRangeLowValue = 'org.hl7.fhir.api.MedicationStatement.timing-bounds-range-low-value',
  TimingBoundsRangeLowUnit = 'org.hl7.fhir.api.MedicationStatement.timing-bounds-range-low-unit',
  TimingBoundsRangeHigh = 'org.hl7.fhir.api.MedicationStatement.timing-bounds-range-high',
  TimingBoundsRangeHighValue = 'org.hl7.fhir.api.MedicationStatement.timing-bounds-range-high-value',
  TimingBoundsRangeHighUnit = 'org.hl7.fhir.api.MedicationStatement.timing-bounds-range-high-unit',
}

/**
 * Canonical FHIR-style search parameter names for MedicationStatement.
 * These names are intentionally not contextualized so they can be reused
 * by query builders and frontend filters.
 */
export const MedicationStatementSearchParamNames = {
  Adherence: 'adherence',
  Category: 'category',
  Code: 'code',
  Effective: 'effective',
  Identifier: 'identifier',
  Medication: 'medication',
  PartOf: 'part-of',
  Patient: 'patient',
  Source: 'source',
  Status: 'status',
  Subject: 'subject',
  DoseQuantity: 'dose-quantity',
  DoseQuantityValue: 'dose-quantity-value',
  DoseQuantityUnit: 'dose-quantity-unit',
  RateQuantity: 'rate-quantity',
  RateQuantityValue: 'rate-quantity-value',
  RateQuantityUnit: 'rate-quantity-unit',
  RateRangeLowQuantity: 'rate-range-low-quantity',
  RateRangeLowQuantityValue: 'rate-range-low-quantity-value',
  RateRangeLowQuantityUnit: 'rate-range-low-quantity-unit',
  RateRangeHighQuantity: 'rate-range-high-quantity',
  RateRangeHighQuantityValue: 'rate-range-high-quantity-value',
  RateRangeHighQuantityUnit: 'rate-range-high-quantity-unit',
  RateRatioNumeratorQuantity: 'rate-ratio-numerator-quantity',
  RateRatioNumeratorQuantityValue: 'rate-ratio-numerator-quantity-value',
  RateRatioNumeratorQuantityUnit: 'rate-ratio-numerator-quantity-unit',
  RateDenominatorQuantity: 'rate-denominator-quantity',
  RateDenominatorQuantityValue: 'rate-denominator-quantity-value',
  RateDenominatorQuantityUnit: 'rate-denominator-quantity-unit',
  DoseType: 'dose-type',
  DosageMethod: 'dosage-method',
  DosageMethodText: 'dosage-method-text',
  DosageRoute: 'dosage-route',
  DosageRouteText: 'dosage-route-text',
  DosageSite: 'dosage-site',
  DosageSiteText: 'dosage-site-text',
  DosageCondition: 'dosage-condition',
  DosageAsNeeded: 'dosage-asneeded',
  DosagePatientInstructionText: 'dosage-patientinstruction-text',
  DoseMaxPerPeriod: 'dose-maxperperiod',
  DoseMaxPerAdministration: 'dose-maxperadministration',
  DoseMaxPerLifetime: 'dose-maxperlifetime',
  TimingDescription: 'timing-description',
  TimingCount: 'timing-count',
  TimingCountMax: 'timing-countmax',
  TimingDuration: 'timing-duration',
  TimingDurationMax: 'timing-durationmax',
  TimingDurationUnit: 'timing-duration-unit',
  TimingFrequency: 'timing-frequency',
  TimingFrequencyMax: 'timing-frequencymax',
  TimingPeriod: 'timing-period',
  TimingPeriodMax: 'timing-periodmax',
  TimingPeriodUnit: 'timing-period-unit',
  TimingDayOfWeek: 'timing-dayofweek',
  TimingTimeOfDay: 'timing-timeofday',
  TimingWhen: 'timing-when',
  TimingOffset: 'timing-offset',
  TimingStartOffset: 'timing-startoffset',
  TimingEndOffset: 'timing-endoffset',
  TimingBoundsType: 'timing-bounds-type',
  TimingBoundsPeriodStart: 'timing-bounds-period-start',
  TimingBoundsPeriodEnd: 'timing-bounds-period-end',
  TimingBoundsDuration: 'timing-bounds-duration',
  TimingBoundsDurationValue: 'timing-bounds-duration-value',
  TimingBoundsDurationUnit: 'timing-bounds-duration-unit',
  TimingBoundsRangeLow: 'timing-bounds-range-low',
  TimingBoundsRangeLowValue: 'timing-bounds-range-low-value',
  TimingBoundsRangeLowUnit: 'timing-bounds-range-low-unit',
  TimingBoundsRangeHigh: 'timing-bounds-range-high',
  TimingBoundsRangeHighValue: 'timing-bounds-range-high-value',
  TimingBoundsRangeHighUnit: 'timing-bounds-range-high-unit',
} as const;

export type MedicationStatementSearchParamName =
  typeof MedicationStatementSearchParamNames[keyof typeof MedicationStatementSearchParamNames];

export const MedicationStatementSearchParamToClaimKey: Record<
MedicationStatementSearchParamName,
MedicationStatementClaimsFhirApi | MedicationStatementClaimsFhirApiExtended
> = {
  [MedicationStatementSearchParamNames.Adherence]: MedicationStatementClaimsFhirApi.Adherence,
  [MedicationStatementSearchParamNames.Category]: MedicationStatementClaimsFhirApi.Category,
  [MedicationStatementSearchParamNames.Code]: MedicationStatementClaimsFhirApi.Code,
  [MedicationStatementSearchParamNames.Effective]: MedicationStatementClaimsFhirApi.Effective,
  [MedicationStatementSearchParamNames.Identifier]: MedicationStatementClaimsFhirApi.Identifier,
  [MedicationStatementSearchParamNames.Medication]: MedicationStatementClaimsFhirApi.Medication,
  [MedicationStatementSearchParamNames.PartOf]: MedicationStatementClaimsFhirApi.PartOf,
  [MedicationStatementSearchParamNames.Patient]: MedicationStatementClaimsFhirApi.Patient,
  [MedicationStatementSearchParamNames.Source]: MedicationStatementClaimsFhirApi.Source,
  [MedicationStatementSearchParamNames.Status]: MedicationStatementClaimsFhirApi.Status,
  [MedicationStatementSearchParamNames.Subject]: MedicationStatementClaimsFhirApi.Subject,
  [MedicationStatementSearchParamNames.DoseQuantity]: MedicationStatementClaimsFhirApiExtended.DoseQuantity,
  [MedicationStatementSearchParamNames.DoseQuantityValue]: MedicationStatementClaimsFhirApiExtended.DoseQuantityValue,
  [MedicationStatementSearchParamNames.DoseQuantityUnit]: MedicationStatementClaimsFhirApiExtended.DoseQuantityUnit,
  [MedicationStatementSearchParamNames.RateQuantity]: MedicationStatementClaimsFhirApiExtended.RateQuantity,
  [MedicationStatementSearchParamNames.RateQuantityValue]: MedicationStatementClaimsFhirApiExtended.RateQuantityValue,
  [MedicationStatementSearchParamNames.RateQuantityUnit]: MedicationStatementClaimsFhirApiExtended.RateQuantityUnit,
  [MedicationStatementSearchParamNames.RateRangeLowQuantity]: MedicationStatementClaimsFhirApiExtended.RateRangeLowQuantity,
  [MedicationStatementSearchParamNames.RateRangeLowQuantityValue]: MedicationStatementClaimsFhirApiExtended.RateRangeLowQuantityValue,
  [MedicationStatementSearchParamNames.RateRangeLowQuantityUnit]: MedicationStatementClaimsFhirApiExtended.RateRangeLowQuantityUnit,
  [MedicationStatementSearchParamNames.RateRangeHighQuantity]: MedicationStatementClaimsFhirApiExtended.RateRangeHighQuantity,
  [MedicationStatementSearchParamNames.RateRangeHighQuantityValue]: MedicationStatementClaimsFhirApiExtended.RateRangeHighQuantityValue,
  [MedicationStatementSearchParamNames.RateRangeHighQuantityUnit]: MedicationStatementClaimsFhirApiExtended.RateRangeHighQuantityUnit,
  [MedicationStatementSearchParamNames.RateRatioNumeratorQuantity]: MedicationStatementClaimsFhirApiExtended.RateRatioNumeratorQuantity,
  [MedicationStatementSearchParamNames.RateRatioNumeratorQuantityValue]: MedicationStatementClaimsFhirApiExtended.RateRatioNumeratorQuantityValue,
  [MedicationStatementSearchParamNames.RateRatioNumeratorQuantityUnit]: MedicationStatementClaimsFhirApiExtended.RateRatioNumeratorQuantityUnit,
  [MedicationStatementSearchParamNames.RateDenominatorQuantity]: MedicationStatementClaimsFhirApiExtended.RateDenominatorQuantity,
  [MedicationStatementSearchParamNames.RateDenominatorQuantityValue]: MedicationStatementClaimsFhirApiExtended.RateDenominatorQuantityValue,
  [MedicationStatementSearchParamNames.RateDenominatorQuantityUnit]: MedicationStatementClaimsFhirApiExtended.RateDenominatorQuantityUnit,
  [MedicationStatementSearchParamNames.DoseType]: MedicationStatementClaimsFhirApiExtended.DoseType,
  [MedicationStatementSearchParamNames.DosageMethod]: MedicationStatementClaimsFhirApiExtended.DosageMethod,
  [MedicationStatementSearchParamNames.DosageMethodText]: MedicationStatementClaimsFhirApiExtended.DosageMethodText,
  [MedicationStatementSearchParamNames.DosageRoute]: MedicationStatementClaimsFhirApiExtended.DosageRoute,
  [MedicationStatementSearchParamNames.DosageRouteText]: MedicationStatementClaimsFhirApiExtended.DosageRouteText,
  [MedicationStatementSearchParamNames.DosageSite]: MedicationStatementClaimsFhirApiExtended.DosageSite,
  [MedicationStatementSearchParamNames.DosageSiteText]: MedicationStatementClaimsFhirApiExtended.DosageSiteText,
  [MedicationStatementSearchParamNames.DosageCondition]: MedicationStatementClaimsFhirApiExtended.DosageCondition,
  [MedicationStatementSearchParamNames.DosageAsNeeded]: MedicationStatementClaimsFhirApiExtended.DosageAsNeeded,
  [MedicationStatementSearchParamNames.DosagePatientInstructionText]: MedicationStatementClaimsFhirApiExtended.DosagePatientInstructionText,
  [MedicationStatementSearchParamNames.DoseMaxPerPeriod]: MedicationStatementClaimsFhirApiExtended.DoseMaxPerPeriod,
  [MedicationStatementSearchParamNames.DoseMaxPerAdministration]: MedicationStatementClaimsFhirApiExtended.DoseMaxPerAdministration,
  [MedicationStatementSearchParamNames.DoseMaxPerLifetime]: MedicationStatementClaimsFhirApiExtended.DoseMaxPerLifetime,
  [MedicationStatementSearchParamNames.TimingDescription]: MedicationStatementClaimsFhirApiExtended.TimingDescription,
  [MedicationStatementSearchParamNames.TimingCount]: MedicationStatementClaimsFhirApiExtended.TimingCount,
  [MedicationStatementSearchParamNames.TimingCountMax]: MedicationStatementClaimsFhirApiExtended.TimingCountMax,
  [MedicationStatementSearchParamNames.TimingDuration]: MedicationStatementClaimsFhirApiExtended.TimingDuration,
  [MedicationStatementSearchParamNames.TimingDurationMax]: MedicationStatementClaimsFhirApiExtended.TimingDurationMax,
  [MedicationStatementSearchParamNames.TimingDurationUnit]: MedicationStatementClaimsFhirApiExtended.TimingDurationUnit,
  [MedicationStatementSearchParamNames.TimingFrequency]: MedicationStatementClaimsFhirApiExtended.TimingFrequency,
  [MedicationStatementSearchParamNames.TimingFrequencyMax]: MedicationStatementClaimsFhirApiExtended.TimingFrequencyMax,
  [MedicationStatementSearchParamNames.TimingPeriod]: MedicationStatementClaimsFhirApiExtended.TimingPeriod,
  [MedicationStatementSearchParamNames.TimingPeriodMax]: MedicationStatementClaimsFhirApiExtended.TimingPeriodMax,
  [MedicationStatementSearchParamNames.TimingPeriodUnit]: MedicationStatementClaimsFhirApiExtended.TimingPeriodUnit,
  [MedicationStatementSearchParamNames.TimingDayOfWeek]: MedicationStatementClaimsFhirApiExtended.TimingDayOfWeek,
  [MedicationStatementSearchParamNames.TimingTimeOfDay]: MedicationStatementClaimsFhirApiExtended.TimingTimeOfDay,
  [MedicationStatementSearchParamNames.TimingWhen]: MedicationStatementClaimsFhirApiExtended.TimingWhen,
  [MedicationStatementSearchParamNames.TimingOffset]: MedicationStatementClaimsFhirApiExtended.TimingOffset,
  [MedicationStatementSearchParamNames.TimingStartOffset]: MedicationStatementClaimsFhirApiExtended.TimingStartOffset,
  [MedicationStatementSearchParamNames.TimingEndOffset]: MedicationStatementClaimsFhirApiExtended.TimingEndOffset,
  [MedicationStatementSearchParamNames.TimingBoundsType]: MedicationStatementClaimsFhirApiExtended.TimingBoundsType,
  [MedicationStatementSearchParamNames.TimingBoundsPeriodStart]: MedicationStatementClaimsFhirApiExtended.TimingBoundsPeriodStart,
  [MedicationStatementSearchParamNames.TimingBoundsPeriodEnd]: MedicationStatementClaimsFhirApiExtended.TimingBoundsPeriodEnd,
  [MedicationStatementSearchParamNames.TimingBoundsDuration]: MedicationStatementClaimsFhirApiExtended.TimingBoundsDuration,
  [MedicationStatementSearchParamNames.TimingBoundsDurationValue]: MedicationStatementClaimsFhirApiExtended.TimingBoundsDurationValue,
  [MedicationStatementSearchParamNames.TimingBoundsDurationUnit]: MedicationStatementClaimsFhirApiExtended.TimingBoundsDurationUnit,
  [MedicationStatementSearchParamNames.TimingBoundsRangeLow]: MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeLow,
  [MedicationStatementSearchParamNames.TimingBoundsRangeLowValue]: MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeLowValue,
  [MedicationStatementSearchParamNames.TimingBoundsRangeLowUnit]: MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeLowUnit,
  [MedicationStatementSearchParamNames.TimingBoundsRangeHigh]: MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeHigh,
  [MedicationStatementSearchParamNames.TimingBoundsRangeHighValue]: MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeHighValue,
  [MedicationStatementSearchParamNames.TimingBoundsRangeHighUnit]: MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeHighUnit,
};

export const MedicationStatementClaimsFhirApiMap = {
  [MedicationStatementClaimsFhirApi.Adherence]: String,
  [MedicationStatementClaimsFhirApi.Category]: String,
  [MedicationStatementClaimsFhirApi.Code]: String,
  [MedicationStatementClaimsFhirApi.Effective]: String,
  [MedicationStatementClaimsFhirApi.Identifier]: String,
  [MedicationStatementClaimsFhirApi.Medication]: String,
  [MedicationStatementClaimsFhirApi.PartOf]: String,
  [MedicationStatementClaimsFhirApi.Patient]: String,
  [MedicationStatementClaimsFhirApi.Source]: String,
  [MedicationStatementClaimsFhirApi.Status]: String,
  [MedicationStatementClaimsFhirApi.Subject]: String,
};

export const MedicationStatementClaimsFhirApiExtendedMap = {
  ...MedicationStatementClaimsFhirApiMap,
  [MedicationStatementClaimsFhirApiExtended.AdherenceText]: String,
  [MedicationStatementClaimsFhirApiExtended.AdherenceDisplay]: String,
  [MedicationStatementClaimsFhirApiExtended.CodeText]: String,
  [MedicationStatementClaimsFhirApiExtended.CodeDisplay]: String,
  [MedicationStatementClaimsFhirApiExtended.DoseQuantity]: String,
  [MedicationStatementClaimsFhirApiExtended.DoseQuantityValue]: Number,
  [MedicationStatementClaimsFhirApiExtended.DoseQuantityUnit]: String,
  [MedicationStatementClaimsFhirApiExtended.RateQuantity]: String,
  [MedicationStatementClaimsFhirApiExtended.RateQuantityValue]: Number,
  [MedicationStatementClaimsFhirApiExtended.RateQuantityUnit]: String,
  [MedicationStatementClaimsFhirApiExtended.RateRangeLowQuantity]: String,
  [MedicationStatementClaimsFhirApiExtended.RateRangeLowQuantityValue]: Number,
  [MedicationStatementClaimsFhirApiExtended.RateRangeLowQuantityUnit]: String,
  [MedicationStatementClaimsFhirApiExtended.RateRangeHighQuantity]: String,
  [MedicationStatementClaimsFhirApiExtended.RateRangeHighQuantityValue]: Number,
  [MedicationStatementClaimsFhirApiExtended.RateRangeHighQuantityUnit]: String,
  [MedicationStatementClaimsFhirApiExtended.RateRatioNumeratorQuantity]: String,
  [MedicationStatementClaimsFhirApiExtended.RateRatioNumeratorQuantityValue]: Number,
  [MedicationStatementClaimsFhirApiExtended.RateRatioNumeratorQuantityUnit]: String,
  [MedicationStatementClaimsFhirApiExtended.RateDenominatorQuantity]: String,
  [MedicationStatementClaimsFhirApiExtended.RateDenominatorQuantityValue]: Number,
  [MedicationStatementClaimsFhirApiExtended.RateDenominatorQuantityUnit]: String,
  [MedicationStatementClaimsFhirApiExtended.DoseType]: String,
  [MedicationStatementClaimsFhirApiExtended.DosageMethod]: String,
  [MedicationStatementClaimsFhirApiExtended.DosageMethodText]: String,
  [MedicationStatementClaimsFhirApiExtended.DosageRoute]: String,
  [MedicationStatementClaimsFhirApiExtended.DosageRouteText]: String,
  [MedicationStatementClaimsFhirApiExtended.DosageSite]: String,
  [MedicationStatementClaimsFhirApiExtended.DosageSiteText]: String,
  [MedicationStatementClaimsFhirApiExtended.DosageCondition]: String,
  [MedicationStatementClaimsFhirApiExtended.DosageAsNeeded]: Boolean,
  [MedicationStatementClaimsFhirApiExtended.DosagePatientInstructionText]: String,
  [MedicationStatementClaimsFhirApiExtended.DoseMaxPerPeriod]: String,
  [MedicationStatementClaimsFhirApiExtended.DoseMaxPerAdministration]: String,
  [MedicationStatementClaimsFhirApiExtended.DoseMaxPerLifetime]: String,
  [MedicationStatementClaimsFhirApiExtended.TimingDescription]: String,
  [MedicationStatementClaimsFhirApiExtended.TimingCount]: Number,
  [MedicationStatementClaimsFhirApiExtended.TimingCountMax]: Number,
  [MedicationStatementClaimsFhirApiExtended.TimingDuration]: Number,
  [MedicationStatementClaimsFhirApiExtended.TimingDurationMax]: Number,
  [MedicationStatementClaimsFhirApiExtended.TimingDurationUnit]: String,
  [MedicationStatementClaimsFhirApiExtended.TimingFrequency]: Number,
  [MedicationStatementClaimsFhirApiExtended.TimingFrequencyMax]: Number,
  [MedicationStatementClaimsFhirApiExtended.TimingPeriod]: Number,
  [MedicationStatementClaimsFhirApiExtended.TimingPeriodMax]: Number,
  [MedicationStatementClaimsFhirApiExtended.TimingPeriodUnit]: String,
  [MedicationStatementClaimsFhirApiExtended.TimingDayOfWeek]: String,
  [MedicationStatementClaimsFhirApiExtended.TimingTimeOfDay]: String,
  [MedicationStatementClaimsFhirApiExtended.TimingWhen]: String,
  [MedicationStatementClaimsFhirApiExtended.TimingOffset]: Number,
  [MedicationStatementClaimsFhirApiExtended.TimingStartOffset]: Number,
  [MedicationStatementClaimsFhirApiExtended.TimingEndOffset]: Number,
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsType]: String,
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsPeriodStart]: String,
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsPeriodEnd]: String,
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsDuration]: String,
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsDurationValue]: Number,
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsDurationUnit]: String,
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeLow]: String,
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeLowValue]: Number,
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeLowUnit]: String,
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeHigh]: String,
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeHighValue]: Number,
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeHighUnit]: String,
};

/**
 * Flat interface for `meta.claims` payload authoring.
 * Values remain scalar (or CSV string for multi-value params) so they can map to SQL columns.
 */
export interface MedicationStatementClaimsFlat {
  '@context'?: 'org.hl7.fhir.api';
  [MedicationStatementClaimsFhirApi.Adherence]?: string;
  [MedicationStatementClaimsFhirApi.Category]?: string;
  [MedicationStatementClaimsFhirApi.Code]?: string;
  [MedicationStatementClaimsFhirApi.Effective]?: string;
  [MedicationStatementClaimsFhirApi.Identifier]?: string;
  [MedicationStatementClaimsFhirApi.Medication]?: string;
  [MedicationStatementClaimsFhirApi.PartOf]?: string;
  [MedicationStatementClaimsFhirApi.Patient]?: string;
  [MedicationStatementClaimsFhirApi.Source]?: string;
  [MedicationStatementClaimsFhirApi.Status]?: string;
  [MedicationStatementClaimsFhirApi.Subject]?: string;
  [MedicationStatementClaimsFhirApiExtended.AdherenceText]?: string;
  [MedicationStatementClaimsFhirApiExtended.AdherenceDisplay]?: string;
  [MedicationStatementClaimsFhirApiExtended.CodeText]?: string;
  [MedicationStatementClaimsFhirApiExtended.CodeDisplay]?: string;
  [MedicationStatementClaimsFhirApiExtended.DoseQuantity]?: string;
  [MedicationStatementClaimsFhirApiExtended.DoseQuantityValue]?: number;
  [MedicationStatementClaimsFhirApiExtended.DoseQuantityUnit]?: string;
  [MedicationStatementClaimsFhirApiExtended.RateQuantity]?: string;
  [MedicationStatementClaimsFhirApiExtended.DoseType]?: string;
  [MedicationStatementClaimsFhirApiExtended.DosageMethod]?: string;
  [MedicationStatementClaimsFhirApiExtended.DosageMethodText]?: string;
  [MedicationStatementClaimsFhirApiExtended.DosageRoute]?: string;
  [MedicationStatementClaimsFhirApiExtended.DosageRouteText]?: string;
  [MedicationStatementClaimsFhirApiExtended.DosageSite]?: string;
  [MedicationStatementClaimsFhirApiExtended.DosageSiteText]?: string;
  [MedicationStatementClaimsFhirApiExtended.DosageCondition]?: string;
  [MedicationStatementClaimsFhirApiExtended.DosageAsNeeded]?: boolean;
  [MedicationStatementClaimsFhirApiExtended.DosagePatientInstructionText]?: string;
  [MedicationStatementClaimsFhirApiExtended.TimingDescription]?: string;
  [MedicationStatementClaimsFhirApiExtended.TimingDuration]?: number;
  [MedicationStatementClaimsFhirApiExtended.TimingDurationUnit]?: string;
  [MedicationStatementClaimsFhirApiExtended.TimingFrequency]?: number;
  [MedicationStatementClaimsFhirApiExtended.TimingFrequencyMax]?: number;
  [MedicationStatementClaimsFhirApiExtended.TimingPeriod]?: number;
  [MedicationStatementClaimsFhirApiExtended.TimingPeriodUnit]?: string;
  [MedicationStatementClaimsFhirApiExtended.TimingPeriodMax]?: number;
  [MedicationStatementClaimsFhirApiExtended.TimingDayOfWeek]?: string;
  [MedicationStatementClaimsFhirApiExtended.TimingTimeOfDay]?: string;
  [MedicationStatementClaimsFhirApiExtended.TimingWhen]?: string;
  [MedicationStatementClaimsFhirApiExtended.TimingOffset]?: number;
  [MedicationStatementClaimsFhirApiExtended.TimingStartOffset]?: number;
  [MedicationStatementClaimsFhirApiExtended.TimingEndOffset]?: number;
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsType]?: string;
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsPeriodStart]?: string;
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsPeriodEnd]?: string;
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsDuration]?: string;
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsDurationValue]?: number;
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsDurationUnit]?: string;
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeLow]?: string;
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeLowValue]?: number;
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeLowUnit]?: string;
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeHigh]?: string;
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeHighValue]?: number;
  [MedicationStatementClaimsFhirApiExtended.TimingBoundsRangeHighUnit]?: string;
}

/**
 * Contextualized payload shape used by current `meta.claims` bodies:
 * - `@context: org.hl7.fhir.api`
 * - keys as `MedicationStatement.<concrete-parameter>`
 */
export interface MedicationStatementClaimsContextualized {
  '@context': 'org.hl7.fhir.api';
  'MedicationStatement.adherence'?: string;
  'MedicationStatement.adherence-text'?: string;
  'MedicationStatement.adherence-display'?: string;
  'MedicationStatement.category'?: string;
  'MedicationStatement.code'?: string;
  'MedicationStatement.code-text'?: string;
  'MedicationStatement.code-display'?: string;
  'MedicationStatement.effective'?: string;
  'MedicationStatement.identifier'?: string;
  'MedicationStatement.medication'?: string;
  'MedicationStatement.part-of'?: string;
  'MedicationStatement.patient'?: string;
  'MedicationStatement.source'?: string;
  'MedicationStatement.status'?: string;
  'MedicationStatement.subject'?: string;
  'MedicationStatement.dose-quantity'?: string;
  'MedicationStatement.dose-quantity-value'?: number;
  'MedicationStatement.dose-quantity-unit'?: string;
  'MedicationStatement.rate-quantity'?: string;
  'MedicationStatement.rate-quantity-value'?: number;
  'MedicationStatement.rate-quantity-unit'?: string;
  'MedicationStatement.rate-range-low-quantity'?: string;
  'MedicationStatement.rate-range-low-quantity-value'?: number;
  'MedicationStatement.rate-range-low-quantity-unit'?: string;
  'MedicationStatement.rate-range-high-quantity'?: string;
  'MedicationStatement.rate-range-high-quantity-value'?: number;
  'MedicationStatement.rate-range-high-quantity-unit'?: string;
  'MedicationStatement.rate-ratio-numerator-quantity'?: string;
  'MedicationStatement.rate-ratio-numerator-quantity-value'?: number;
  'MedicationStatement.rate-ratio-numerator-quantity-unit'?: string;
  'MedicationStatement.rate-denominator-quantity'?: string;
  'MedicationStatement.rate-denominator-quantity-value'?: number;
  'MedicationStatement.rate-denominator-quantity-unit'?: string;
  'MedicationStatement.dose-type'?: string;
  'MedicationStatement.dosage-method'?: string;
  'MedicationStatement.dosage-method-text'?: string;
  'MedicationStatement.dosage-route'?: string;
  'MedicationStatement.dosage-route-text'?: string;
  'MedicationStatement.dosage-site'?: string;
  'MedicationStatement.dosage-site-text'?: string;
  'MedicationStatement.dosage-condition'?: string;
  'MedicationStatement.dosage-asneeded'?: boolean;
  'MedicationStatement.dosage-patientinstruction-text'?: string;
  'MedicationStatement.dose-maxperperiod'?: string;
  'MedicationStatement.dose-maxperadministration'?: string;
  'MedicationStatement.dose-maxperlifetime'?: string;
  'MedicationStatement.timing-description'?: string;
  'MedicationStatement.timing-count'?: number;
  'MedicationStatement.timing-countmax'?: number;
  'MedicationStatement.timing-duration'?: number;
  'MedicationStatement.timing-durationmax'?: number;
  'MedicationStatement.timing-duration-unit'?: string;
  'MedicationStatement.timing-frequency'?: number;
  'MedicationStatement.timing-frequencymax'?: number;
  'MedicationStatement.timing-period'?: number;
  'MedicationStatement.timing-periodmax'?: number;
  'MedicationStatement.timing-period-unit'?: string;
  'MedicationStatement.timing-dayofweek'?: string;
  'MedicationStatement.timing-timeofday'?: string;
  'MedicationStatement.timing-when'?: string;
  'MedicationStatement.timing-offset'?: number;
  'MedicationStatement.timing-startoffset'?: number;
  'MedicationStatement.timing-endoffset'?: number;
  'MedicationStatement.timing-bounds-type'?: string;
  'MedicationStatement.timing-bounds-period-start'?: string;
  'MedicationStatement.timing-bounds-period-end'?: string;
  'MedicationStatement.timing-bounds-duration'?: string;
  'MedicationStatement.timing-bounds-duration-value'?: number;
  'MedicationStatement.timing-bounds-duration-unit'?: string;
  'MedicationStatement.timing-bounds-range-low'?: string;
  'MedicationStatement.timing-bounds-range-low-value'?: number;
  'MedicationStatement.timing-bounds-range-low-unit'?: string;
  'MedicationStatement.timing-bounds-range-high'?: string;
  'MedicationStatement.timing-bounds-range-high-value'?: number;
  'MedicationStatement.timing-bounds-range-high-unit'?: string;
}
