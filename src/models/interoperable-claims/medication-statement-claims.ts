// src/models/fhir/MedicationStatement.claims.ts
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

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
  Code: 'MedicationStatement.code',
  Medication: 'MedicationStatement.medication',
  PartOf: 'MedicationStatement.part-of',
  Source: 'MedicationStatement.source',
  MedicationText: 'MedicationStatement.medication-text',
  Note: 'MedicationStatement.note',
  DosageInstruction: 'MedicationStatement.dosage-instruction',
  MedicationIdentifier: 'MedicationStatement.medication-identifier',
  MedicationSerialNumber: 'MedicationStatement.medication-serial-number',
  MedicationExpirationDate: 'MedicationStatement.medication-expiration-date',
} as const;

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

export const MedicationStatementClaimsFhirApiMap = {
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
  'MedicationStatement.category'?: string;
  'MedicationStatement.code'?: string;
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
