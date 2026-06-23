// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/observation-claims.ts

import type { ClaimSpec } from './types';
import { ObservationCategoryCodes } from '../../constants/observation-category';

/**
 * Canonical flat claims for a persisted Observation.
 *
 * Naming contract:
 * - version-specific suffixes go at the end of helper names, e.g.
 *   `observationToFlatFhirR4`, not `observationFhirR4ToFlat`
 * - short canonical keys use `Observation.<concrete-param>`
 * - scalarized extended keys use `org.hl7.fhir.api.Observation.<concrete-param>`
 * - concrete parameters must stay kebab-case
 *
 * Observation scope reference:
 * - https://hl7.org/fhir/observation.html
 * - HL7 uses Observation for vital signs, laboratory data, imaging results,
 *   clinical findings, device measurements, device settings, assessment tools,
 *   personal characteristics, social history, core characteristics, and
 *   product quality tests.
 *
 * Important runtime distinction used by local-first Vital Signs storage:
 * - a visible/primary vital-sign Observation carries `Observation.status`
 * - a reduced indexed component derived from FHIR `component` may carry only
 *   `identifier` and `subject` plus its own component/value claims, but no
 *   `status`; those reduced rows are kept for reconstruction/export and must be
 *   ignored by normal Vital Signs list/search operations.
 * 
 * TODO Extensions:
 * - Observation.apgar-appearance-number
 * - Observation.apgar-pulse-number
 * - Observation.apgar-grimace-number
 * - Observation.apgar-activity-number
 * - Observation.apgar-respiration-number
 */
export const ObservationClaim = {
  /** Upstream order/request reference list. Example: `ServiceRequest/sr-1`. */
  BasedOn: 'Observation.based-on',
  /** Observation category token list. Example: `http://terminology.hl7.org/CodeSystem/observation-category|vital-signs`. */
  Category: 'Observation.category',
  /** Observation/category/code system URL. Example: `http://loinc.org`. */
  CodeSystem: 'Observation.code-system',
  /** Observation/category/code value. Example: `8867-4`. */
  CodeValue: 'Observation.code-value',
  /** Local-language label used by UI/forms. Example: `Heart rate`. */
  CodeText: 'Observation.code-text',
  /**
   * Naming alias for `Observation.code-text` when the caller wants the
   * setter/getter name to make the local-text intent explicit.
   */
  CodeTextLocal: 'Observation.code-text',
  /** Canonical English/international display. Example: `Heart rate`. */
  CodeDisplay: 'Observation.code-display',
  /** Observation or component code as `system|code`. Example: `http://loinc.org|8867-4`. */
  Code: 'Observation.code',
  /** Effective clinical date/dateTime when stored as one scalar string. Example: `2026-06-01T10:00:00Z`. */
  Date: 'Observation.date',
  /** Device reference. Example: `Device/dev-1`. */
  Device: 'Observation.device',
  /** Encounter reference. Example: `Encounter/enc-1`. */
  Encounter: 'Observation.encounter',
  /** Focus reference list. Example: `Condition/cond-1`. */
  Focus: 'Observation.focus',
  /** Child Observation references for panels/groups. Example: `Observation/hr-1,Observation/temp-1`. */
  HasMember: 'Observation.has-member',
  /** Optional synthetic tags summarizing component presence on a composite observation. Example: `bp-systolic,bp-diastolic`. */
  ComponentTags: 'Observation.component-tags',
  /** Optional component code values present on a composite observation. Example: `8480-6,8462-4`. */
  ComponentCodeValues: 'Observation.component-code-values',
  /** Optional human-readable component names. Example: `Systolic blood pressure,Diastolic blood pressure`. */
  ComponentNames: 'Observation.component-names',
  /** Business/local identifier. Example: `hr-1`. */
  Identifier: 'Observation.identifier',
  /** BCP-47 language tag. Example: `en`, `es`. */
  Language: 'Observation.language',
  /** Observation method token. Example: `http://snomed.info/sct|252465000`. */
  Method: 'Observation.method',
  /** Optional compatibility alias of `Observation.subject`. Example: `did:web:host.example.com:health-care;organization:taxid:VATES-B00112233:individual:multibase:zExampleIndividualId`. */
  Patient: 'Observation.patient',
  /** Performer reference list. Example: `Practitioner/prac-1`. */
  Performer: 'Observation.performer',
  /** Specimen reference. Example: `Specimen/spec-1`. */
  Specimen: 'Observation.specimen',
  /** Observation status. Presence marks one visible/searchable main observation. Example: `final`. */
  Status: 'Observation.status',
  /** Canonical subject reference. Example: `did:web:host.example.com:health-care;organization:taxid:VATES-B00112233:individual:multibase:zExampleIndividualId`. */
  Subject: 'Observation.subject',
  /** Value as coded concept token. Example: `http://terminology.hl7.org/CodeSystem/data-absent-reason|not-performed`. */
  ValueConcept: 'Observation.value-concept',
  /** Value concept system URL. Example: `http://snomed.info/sct`. */
  ValueConceptSystem: 'Observation.value-concept-system',
  /** Value concept code value. Example: `373066001`. */
  ValueConceptValue: 'Observation.value-concept-value',
  /** Local-language label for the coded value. Example: `Never smoker`. */
  ValueConceptText: 'Observation.value-concept-text',
  /** Canonical English/international display for the coded value. Example: `Absent`. */
  ValueConceptDisplay: 'Observation.value-concept-display',
  /** Value when the result itself is a date/dateTime. Example: `2026-06-01`. */
  ValueDate: 'Observation.value-date',
  /** Optional FHIR Quantity comparator. Allowed: `<`, `<=`, `>=`, `>`. Example: `>=`. */
  ValueQuantityComparator: 'Observation.value-quantity-comparator',
  /** Numeric scalar of the observation value. Example heart rate: `72`. Example temperature: `38.4`. */
  ValueQuantityNumber: 'Observation.value-quantity-number',
  /** Human-readable quantity unit. Example: `/min`, `mmHg`, `Cel`. */
  ValueQuantityUnit: 'Observation.value-quantity-unit',
  /** Aggregated score total for composite assessment observations when present. Example: `8`. */
  ScoreTotalNumber: 'Observation.score-total-number',
  /** Indexed systolic scalar copied onto the parent blood pressure observation. Example: `120`. */
  BloodPressureSystolicNumber: 'Observation.bp-systolic-number',
  /** Indexed diastolic scalar copied onto the parent blood pressure observation. Example: `78`. */
  BloodPressureDiastolicNumber: 'Observation.bp-diastolic-number',
  /** Free-text value when the result is narrative. Example: `Former smoker`. */
  ValueString: 'Observation.value-string',
  /** User-authored note. Example: `Measured after resting 5 minutes.` */
  Note: 'Observation.note',
  /** FHIR-compatible explicit `effectiveDateTime` fallback. Example: `2026-06-01T10:00:00Z`. */
  EffectiveDateTime: 'Observation.effectiveDateTime',
} as const;

export type ObservationClaimKey = typeof ObservationClaim[keyof typeof ObservationClaim];

export type SplitCodingClaims = Readonly<{
  system?: string;
  value?: string;
  text?: string;
  display?: string;
}>;

/**
 * Builds the legacy compact `system|code` token from split claims.
 *
 * Use this only for compatibility/export. Frontend authoring should prefer the
 * split fields such as `code-value`, `code-text`, and `value-concept-value`.
 */
export function buildObservationCodingClaim(input: SplitCodingClaims): string | undefined {
  const value = String(input.value || '').trim();
  const system = String(input.system || '').trim();
  if (!value) return undefined;
  return system ? `${system}|${value}` : value;
}

/**
 * Splits a compact token such as `http://loinc.org|8867-4` into separate
 * claims that are easier for forms, local storage, and numeric/text filters.
 */
export function splitObservationCodingClaim(value: unknown): SplitCodingClaims {
  const token = String(value || '').trim();
  if (!token) {
    return {};
  }
  const separatorIndex = token.indexOf('|');
  if (separatorIndex < 0) {
    return { value: token };
  }
  return {
    system: token.slice(0, separatorIndex) || undefined,
    value: token.slice(separatorIndex + 1) || undefined,
  };
}

/**
 * Reduced claim surface that mirrors FHIR `Observation.component`.
 *
 * By design this shape does not include `status`, `subject`, or other
 * top-level Observation context fields from FHIR. When a component needs to be
 * persisted/indexed locally, the transformer may add only the minimum
 * operational fields (`identifier`, `subject`) in a separate indexed shape.
 */
export interface ClaimsObservationComponent {
  /** Code system URL. Example: `http://loinc.org`. The SDK can derive the compact token from this and `code-value`. */
  [ObservationClaim.CodeSystem]?: string;
  /** Code value. Example: `8480-6`. This is the main code field for UI authoring and search. */
  [ObservationClaim.CodeValue]?: string;
  /** Local-language human label used by forms. Example: `Presión arterial sistólica`. */
  [ObservationClaim.CodeText]?: string;
  /** Canonical English/international display. Example: `Systolic blood pressure`. */
  [ObservationClaim.CodeDisplay]?: string;
  /** Component/observation code as `system|code`. Example: `http://loinc.org|8480-6`. */
  [ObservationClaim.Code]?: string;
  /** Value concept system URL. Example: `http://terminology.hl7.org/CodeSystem/data-absent-reason`. */
  [ObservationClaim.ValueConceptSystem]?: string;
  /** Value concept code value. Example: `not-performed`. */
  [ObservationClaim.ValueConceptValue]?: string;
  /** Local-language label for the value concept. Example: `No realizado`. */
  [ObservationClaim.ValueConceptText]?: string;
  /** Canonical English/international display for the value concept. Example: `Not performed`. */
  [ObservationClaim.ValueConceptDisplay]?: string;
  /** Value as coded concept token. Example: `http://terminology.hl7.org/CodeSystem/data-absent-reason|not-performed`. */
  [ObservationClaim.ValueConcept]?: string;
  /** Value when the observation result itself is one date/dateTime. Example: `2026-06-01T10:00:00Z`. */
  [ObservationClaim.ValueDate]?: string;
  /** Free-text value when the result is narrative rather than coded/quantified. Example: `Former smoker`. */
  [ObservationClaim.ValueString]?: string;
  /** Optional FHIR Quantity comparator. Allowed values: `<`, `<=`, `>=`, `>`. Example: `>=`. */
  [ObservationClaim.ValueQuantityComparator]?: string;
  /** Numeric scalar of the observed value. Example heart rate: `72`. Example temperature: `38.4`. */
  [ObservationClaim.ValueQuantityNumber]?: string | number;
  /** Human-readable quantity unit. Example: `/min`, `mmHg`, `Cel`. */
  [ObservationClaim.ValueQuantityUnit]?: string;
}

/**
 * Reduced component claims after local indexing adds only the minimal locator
 * information required by vault persistence and parent/child traversal.
 */
export interface ClaimsObservationComponentIndexed extends ClaimsObservationComponent {
  /** Synthetic/local identifier added during indexing of a reduced imported component. Example: `bp-systolic-1`. */
  [ObservationClaim.Identifier]: string;
  /** Subject inherited from the parent observation so the reduced row can be indexed and located locally. */
  [ObservationClaim.Subject]: string;
  /** Optional compatibility alias of `Observation.subject`. */
  [ObservationClaim.Patient]?: string;
}

/**
 * Minimal visible Vital Signs Observation claims.
 *
 * This is the practical authoring/search surface for local-first individual
 * apps. A row without `Observation.status` is not considered a visible vital
 * sign result and should be ignored by normal section list/search operations.
 */
export interface ClaimsObservationVitalSigns extends ClaimsObservationComponentIndexed {
  /** Required for visible/searchable vital signs. If missing, treat the row as internal/supporting only. Example: `final`. */
  [ObservationClaim.Status]: string;
  /** Must contain the vital-signs category token for visible Vital Signs rows. */
  [ObservationClaim.Category]: string;
  /** Vital Sign LOINC code. Example heart rate: `http://loinc.org|8867-4`. */
  [ObservationClaim.Code]: string;
  /** Clinical time of the observation when represented as one scalar date/dateTime. */
  [ObservationClaim.Date]?: string;
  /** FHIR-compatible explicit `effectiveDateTime` fallback. Example: `2026-06-01T10:00:00Z`. */
  [ObservationClaim.EffectiveDateTime]?: string;
  /** Language of authored text/narrative. Example: `en`, `es`. */
  [ObservationClaim.Language]?: string;
  /** Observation method token when relevant. Example: `http://snomed.info/sct|252465000`. */
  [ObservationClaim.Method]?: string;
  /** User-authored note. Example: `Measured after resting 5 minutes.` */
  [ObservationClaim.Note]?: string;
}

/**
 * General Observation claims for persisted/searchable clinical resources.
 *
 * This is the widest flat contract currently used by the package. It extends
 * the Vital Signs-visible shape so consumers can reuse one traversal/query
 * model while adding broader Observation fields such as encounter, performer,
 * specimen, focus, and group membership.
 */
export interface ClaimsObservationGeneral extends ClaimsObservationVitalSigns {
  /** Upstream order/request reference list. Example: `ServiceRequest/sr-1`. */
  [ObservationClaim.BasedOn]?: string;
  /** Device reference. Example: `Device/dev-1`. */
  [ObservationClaim.Device]?: string;
  /** Encounter reference. Example: `Encounter/enc-1`. */
  [ObservationClaim.Encounter]?: string;
  /** Focus reference list when the observation is about another target. Example: `Condition/cond-1`. */
  [ObservationClaim.Focus]?: string;
  /** Child Observation references for panels/groups. Example: `Observation/hr-1,Observation/temp-1`. */
  [ObservationClaim.HasMember]?: string;
  /** Synthetic tags summarizing component presence on a composite observation. Example: `bp-systolic,bp-diastolic`. */
  [ObservationClaim.ComponentTags]?: string;
  /** Component code values summarized on the parent observation. Example: `8480-6,8462-4`. */
  [ObservationClaim.ComponentCodeValues]?: string;
  /** Human-readable component names summarized on the parent observation. Example: `Systolic blood pressure,Diastolic blood pressure`. */
  [ObservationClaim.ComponentNames]?: string;
  /** Performer reference list. Example: `Practitioner/prac-1`. */
  [ObservationClaim.Performer]?: string;
  /** Specimen reference. Example: `Specimen/spec-1`. */
  [ObservationClaim.Specimen]?: string;
  /** Total assessment score summarized on the parent observation when applicable. Example: `8`. */
  [ObservationClaim.ScoreTotalNumber]?: string | number;
  /** Parent blood pressure panel copy of the systolic numeric value. Example: `120`. */
  [ObservationClaim.BloodPressureSystolicNumber]?: string | number;
  /** Parent blood pressure panel copy of the diastolic numeric value. Example: `78`. */
  [ObservationClaim.BloodPressureDiastolicNumber]?: string | number;
}

/**
 * Backwards-compatible alias kept during the current refactor.
 *
 * Prefer `ClaimsObservationVitalSigns` in new code when the row is expected to
 * be one visible/searchable vital-sign Observation.
 */
export type ClaimsVitalSign = ClaimsObservationVitalSigns;

/**
 * Full persisted claim surface for a general Observation row in local storage.
 *
 * This list is intentionally broader than the searchable/indexable subset.
 * Free-text or UI-only fields may exist here even when they must stay out of
 * blind-query/search indexes.
 */
export const ObservationGeneralClaimsList = [
  ObservationClaim.BasedOn,
  ObservationClaim.Category,
  ObservationClaim.CodeSystem,
  ObservationClaim.CodeValue,
  ObservationClaim.CodeText,
  ObservationClaim.CodeDisplay,
  ObservationClaim.Code,
  ObservationClaim.Date,
  ObservationClaim.Device,
  ObservationClaim.Encounter,
  ObservationClaim.EffectiveDateTime,
  ObservationClaim.Focus,
  ObservationClaim.HasMember,
  ObservationClaim.ComponentTags,
  ObservationClaim.ComponentCodeValues,
  ObservationClaim.ComponentNames,
  ObservationClaim.Identifier,
  ObservationClaim.Language,
  ObservationClaim.Method,
  ObservationClaim.Note,
  ObservationClaim.Patient,
  ObservationClaim.Performer,
  ObservationClaim.Specimen,
  ObservationClaim.Status,
  ObservationClaim.Subject,
  ObservationClaim.ValueConceptSystem,
  ObservationClaim.ValueConceptValue,
  ObservationClaim.ValueConceptText,
  ObservationClaim.ValueConceptDisplay,
  ObservationClaim.ValueConcept,
  ObservationClaim.ValueDate,
  ObservationClaim.ValueQuantityComparator,
  ObservationClaim.ValueQuantityNumber,
  ObservationClaim.ValueQuantityUnit,
  ObservationClaim.ScoreTotalNumber,
  ObservationClaim.BloodPressureSystolicNumber,
  ObservationClaim.BloodPressureDiastolicNumber,
  ObservationClaim.ValueString,
] as const;

/**
 * Full persisted claim surface for visible/searchable Vital Signs rows.
 *
 * This keeps the claims-first authoring fields but still avoids introducing
 * fields that only belong to broader Observation families.
 */
export const ObservationVitalSignsClaimsList = [
  ObservationClaim.Category,
  ObservationClaim.CodeSystem,
  ObservationClaim.CodeValue,
  ObservationClaim.CodeText,
  ObservationClaim.CodeDisplay,
  ObservationClaim.Code,
  ObservationClaim.Date,
  ObservationClaim.EffectiveDateTime,
  ObservationClaim.HasMember,
  ObservationClaim.ComponentTags,
  ObservationClaim.ComponentCodeValues,
  ObservationClaim.ComponentNames,
  ObservationClaim.Identifier,
  ObservationClaim.Language,
  ObservationClaim.Method,
  ObservationClaim.Note,
  ObservationClaim.Patient,
  ObservationClaim.Status,
  ObservationClaim.Subject,
  ObservationClaim.ValueConceptSystem,
  ObservationClaim.ValueConceptValue,
  ObservationClaim.ValueConceptText,
  ObservationClaim.ValueConceptDisplay,
  ObservationClaim.ValueConcept,
  ObservationClaim.ValueDate,
  ObservationClaim.ValueQuantityComparator,
  ObservationClaim.ValueQuantityNumber,
  ObservationClaim.ValueQuantityUnit,
  ObservationClaim.ScoreTotalNumber,
  ObservationClaim.BloodPressureSystolicNumber,
  ObservationClaim.BloodPressureDiastolicNumber,
  ObservationClaim.ValueString,
] as const;

export const ObservationClaimSpecs: ClaimSpec[] = [
  { key: ObservationClaim.BasedOn, meaning: 'Order or request that originated the observation.', example: 'ServiceRequest/sr-1' },
  { key: ObservationClaim.Category, meaning: 'Observation category token.', example: 'http://terminology.hl7.org/CodeSystem/observation-category|vital-signs' },
  { key: ObservationClaim.CodeSystem, meaning: 'Observation code system URL for UI/storage normalization.', example: 'http://loinc.org' },
  { key: ObservationClaim.CodeValue, meaning: 'Observation code value used for UI editing and search.', example: '8867-4' },
  { key: ObservationClaim.CodeText, meaning: 'Local-language label shown to the user.', example: 'Heart rate' },
  { key: ObservationClaim.CodeDisplay, meaning: 'Canonical English/international code display.', example: 'Heart rate' },
  { key: ObservationClaim.Code, meaning: 'Observation code token.', example: 'http://loinc.org|8480-6' },
  { key: ObservationClaim.Date, meaning: 'Observation effective or issued date/time.', example: '2026-06-01T10:00:00Z' },
  { key: ObservationClaim.Device, meaning: 'Device reference.', example: 'Device/dev-1' },
  { key: ObservationClaim.Encounter, meaning: 'Encounter reference.', example: 'Encounter/enc-1' },
  { key: ObservationClaim.Focus, meaning: 'Focus reference.', example: 'Condition/cond-1' },
  { key: ObservationClaim.HasMember, meaning: 'Member observation references (CSV).', example: 'Observation/obs-2,Observation/obs-3' },
  { key: ObservationClaim.ComponentTags, meaning: 'Synthetic component tags summarized on the parent observation.', example: 'bp-systolic,bp-diastolic' },
  { key: ObservationClaim.ComponentCodeValues, meaning: 'Component code values summarized on the parent observation.', example: '8480-6,8462-4' },
  { key: ObservationClaim.ComponentNames, meaning: 'Human-readable component names summarized on the parent observation.', example: 'Systolic blood pressure,Diastolic blood pressure' },
  { key: ObservationClaim.Identifier, meaning: 'Business identifier.', example: 'obs-001' },
  { key: ObservationClaim.Language, meaning: 'BCP-47 language of the observation content.', example: 'en' },
  { key: ObservationClaim.Method, meaning: 'Observation method token.', example: 'http://snomed.info/sct|252465000' },
  { key: ObservationClaim.Patient, meaning: 'Patient reference.', example: 'did:web:patient.example.org' },
  { key: ObservationClaim.Performer, meaning: 'Performer references (CSV).', example: 'Practitioner/prac-1' },
  { key: ObservationClaim.Specimen, meaning: 'Specimen reference.', example: 'Specimen/spec-1' },
  { key: ObservationClaim.Status, meaning: 'Observation status.', example: 'final' },
  { key: ObservationClaim.Subject, meaning: 'Canonical subject reference.', example: 'did:web:patient.example.org' },
  { key: ObservationClaim.ValueConceptSystem, meaning: 'Value concept system URL for UI/storage normalization.', example: 'http://snomed.info/sct' },
  { key: ObservationClaim.ValueConceptValue, meaning: 'Value concept code value used for UI editing and filters.', example: '373066001' },
  { key: ObservationClaim.ValueConceptText, meaning: 'Local-language label for the coded value.', example: 'Never smoker' },
  { key: ObservationClaim.ValueConceptDisplay, meaning: 'Canonical English/international display for the coded value.', example: 'Never smoker' },
  { key: ObservationClaim.ValueConcept, meaning: 'Value concept token.', example: 'http://snomed.info/sct|266919005' },
  { key: ObservationClaim.ValueDate, meaning: 'Value date.', example: '2026-06-01' },
  { key: ObservationClaim.ValueQuantityComparator, meaning: 'Optional FHIR Quantity comparator.', example: '>=' },
  { key: ObservationClaim.ValueQuantityNumber, meaning: 'Observation value quantity numeric scalar.', example: '72' },
  { key: ObservationClaim.ValueQuantityUnit, meaning: 'Observation value quantity unit token or display.', example: 'http://unitsofmeasure.org|/min' },
  { key: ObservationClaim.ScoreTotalNumber, meaning: 'Aggregated assessment score total for the parent observation when present.', example: '8' },
  { key: ObservationClaim.BloodPressureSystolicNumber, meaning: 'Parent blood pressure panel copy of the systolic numeric value.', example: '120' },
  { key: ObservationClaim.BloodPressureDiastolicNumber, meaning: 'Parent blood pressure panel copy of the diastolic numeric value.', example: '78' },
  { key: ObservationClaim.ValueString, meaning: 'Value string.', example: 'Former smoker' },
  { key: ObservationClaim.Note, meaning: 'Clinical note text.', example: 'Patient seated for 5 minutes before measurement.' },
  { key: ObservationClaim.EffectiveDateTime, meaning: 'FHIR-compatible effectiveDateTime fallback.', example: '2026-06-01T10:00:00Z' },
];

/**
 * Returns `true` when the flat claims represent one visible/searchable vital
 * sign Observation row.
 *
 * Current rule:
 * - must be categorized as `vital-signs`
 * - must carry `Observation.status`
 *
 * Reduced indexed component rows derived from FHIR `component` intentionally do
 * not carry `Observation.status`, so they are excluded from normal UI list and
 * search results even though they remain persisted for reconstruction/export.
 */
export function isDisplayableVitalSignObservationClaims(claims: Record<string, unknown> | undefined): boolean {
  if (!claims || typeof claims !== 'object') {
    return false;
  }

  const status = String(claims[ObservationClaim.Status] || '').trim();
  const category = String(claims[ObservationClaim.Category] || '').trim();
  return Boolean(status) && category
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .includes(ObservationCategoryCodes.VitalSigns.claim);
}
