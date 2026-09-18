// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/allergy-intolerance-claims.ts

import type { ClaimSpec } from './types';

// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

/**
 * FHIR R4 `AllergyIntolerance.criticality` codes describing potential future harm.
 *
 * @see https://hl7.org/fhir/R4/allergyintolerance.html
 * @see https://build.fhir.org/ig/HL7/fhir-ips/en/StructureDefinition-AllergyIntolerance-uv-ips.html
 */
export const AllergyIntoleranceCriticalities = {
  Low: 'low',
  High: 'high',
  UnableToAssess: 'unable-to-assess',
} as const;

export type AllergyIntoleranceCriticality =
  typeof AllergyIntoleranceCriticalities[keyof typeof AllergyIntoleranceCriticalities];

/**
 * FHIR R4 `AllergyIntolerance.reaction.severity` codes for one observed reaction event.
 *
 * @see https://hl7.org/fhir/R4/valueset-reaction-event-severity.html
 * @see https://build.fhir.org/ig/HL7/fhir-ips/en/StructureDefinition-AllergyIntolerance-uv-ips.html
 */
export const AllergyIntoleranceReactionSeverities = {
  Mild: 'mild',
  Moderate: 'moderate',
  Severe: 'severe',
} as const;

export type AllergyIntoleranceReactionSeverity =
  typeof AllergyIntoleranceReactionSeverities[keyof typeof AllergyIntoleranceReactionSeverities];

export const AllergyIntoleranceClaim = {
  Identifier: 'AllergyIntolerance.identifier',
  Subject: 'AllergyIntolerance.subject',
  /**
   * @deprecated Use `AllergyIntolerance.subject`.
   * Kept as compatibility alias because FHIR native field is `patient`.
   */
  Patient: 'AllergyIntolerance.patient',
  Code: 'AllergyIntolerance.code',
  /** Local-language label projected to FHIR `AllergyIntolerance.code.text`. */
  CodeText: 'AllergyIntolerance.code-text',
  /** Alias that makes the local-language purpose explicit to UI authors. */
  CodeTextLocal: 'AllergyIntolerance.code-text',
  /** English/international terminology label projected to `code.coding.display`. */
  CodeDisplay: 'AllergyIntolerance.code-display',
  ClinicalStatus: 'AllergyIntolerance.clinical-status',
  VerificationStatus: 'AllergyIntolerance.verification-status',
  Category: 'AllergyIntolerance.category',
  /**
   * Canonical CSV/list of related contained resource references or identifiers.
   */
  ContainedReferenceList: 'AllergyIntolerance.contained-reference-list',
  /**
   * @deprecated Use `ContainedReferenceList`.
   */
  ContainedResourceList: 'AllergyIntolerance.contained-resource-list',
  /**
   * @deprecated Use `ContainedReferenceList`.
   */
  ContainedDocuments: 'AllergyIntolerance.contained-documents',
  /**
   * @deprecated Use `ContainedReferenceList`.
   */
  AttachmentContentIds: 'AllergyIntolerance.attachment-content-ids',
  Criticality: 'AllergyIntolerance.criticality',
  Asserter: 'AllergyIntolerance.asserter',
  RecordedDate: 'AllergyIntolerance.date',
  LastOccurrence: 'AllergyIntolerance.last-date',
  Manifestation: 'AllergyIntolerance.manifestation',
  Onset: 'AllergyIntolerance.onset',
  Route: 'AllergyIntolerance.route',
  Severity: 'AllergyIntolerance.severity',
  Type: 'AllergyIntolerance.type',
  OnsetDateTime: 'AllergyIntolerance.onset-datetime',
  Recorder: 'AllergyIntolerance.recorder',
} as const;

export type AllergyIntoleranceClaimKey = typeof AllergyIntoleranceClaim[keyof typeof AllergyIntoleranceClaim];

export enum AllergyIntoleranceClaimsFhirApi {
  Identifier = 'org.hl7.fhir.api.AllergyIntolerance.identifier',
  Subject = 'org.hl7.fhir.api.AllergyIntolerance.subject',
  Patient = 'org.hl7.fhir.api.AllergyIntolerance.patient',
  Code = 'org.hl7.fhir.api.AllergyIntolerance.code',
  CodeText = 'org.hl7.fhir.api.AllergyIntolerance.code-text',
  CodeDisplay = 'org.hl7.fhir.api.AllergyIntolerance.code-display',
  ClinicalStatus = 'org.hl7.fhir.api.AllergyIntolerance.clinical-status',
  VerificationStatus = 'org.hl7.fhir.api.AllergyIntolerance.verification-status',
  Category = 'org.hl7.fhir.api.AllergyIntolerance.category',
  Criticality = 'org.hl7.fhir.api.AllergyIntolerance.criticality',
  Asserter = 'org.hl7.fhir.api.AllergyIntolerance.asserter',
  Date = 'org.hl7.fhir.api.AllergyIntolerance.date',
  LastDate = 'org.hl7.fhir.api.AllergyIntolerance.last-date',
  Manifestation = 'org.hl7.fhir.api.AllergyIntolerance.manifestation',
  Onset = 'org.hl7.fhir.api.AllergyIntolerance.onset',
  Route = 'org.hl7.fhir.api.AllergyIntolerance.route',
  Severity = 'org.hl7.fhir.api.AllergyIntolerance.severity',
  Type = 'org.hl7.fhir.api.AllergyIntolerance.type',
  OnsetDateTime = 'org.hl7.fhir.api.AllergyIntolerance.onset-datetime',
  Recorder = 'org.hl7.fhir.api.AllergyIntolerance.recorder',
}

/**
 * Resource-specific FHIR R4 search parameters. UI presentation remains governed
 * separately by the applicable IPS StructureDefinition and its obligations.
 *
 * @see https://hl7.org/fhir/R4/allergyintolerance.html#search
 * @see https://build.fhir.org/ig/HL7/fhir-ips/en/CapabilityStatement-ips-server.html
 */
export const AllergyIntoleranceSearchParamNames = {
  Identifier: 'identifier',
  Subject: 'subject',
  Patient: 'patient',
  Code: 'code',
  CodeText: 'code-text',
  CodeDisplay: 'code-display',
  ClinicalStatus: 'clinical-status',
  VerificationStatus: 'verification-status',
  Category: 'category',
  Criticality: 'criticality',
  Asserter: 'asserter',
  Date: 'date',
  LastDate: 'last-date',
  Manifestation: 'manifestation',
  Onset: 'onset',
  Route: 'route',
  Severity: 'severity',
  Type: 'type',
  OnsetDateTime: 'onset-datetime',
  Recorder: 'recorder',
} as const;

export type AllergyIntoleranceSearchParamName =
  typeof AllergyIntoleranceSearchParamNames[keyof typeof AllergyIntoleranceSearchParamNames];

export const AllergyIntoleranceSearchParamToClaimKey: Record<
AllergyIntoleranceSearchParamName,
AllergyIntoleranceClaimsFhirApi
> = {
  [AllergyIntoleranceSearchParamNames.Identifier]: AllergyIntoleranceClaimsFhirApi.Identifier,
  [AllergyIntoleranceSearchParamNames.Subject]: AllergyIntoleranceClaimsFhirApi.Subject,
  [AllergyIntoleranceSearchParamNames.Patient]: AllergyIntoleranceClaimsFhirApi.Patient,
  [AllergyIntoleranceSearchParamNames.Code]: AllergyIntoleranceClaimsFhirApi.Code,
  [AllergyIntoleranceSearchParamNames.CodeText]: AllergyIntoleranceClaimsFhirApi.CodeText,
  [AllergyIntoleranceSearchParamNames.CodeDisplay]: AllergyIntoleranceClaimsFhirApi.CodeDisplay,
  [AllergyIntoleranceSearchParamNames.ClinicalStatus]: AllergyIntoleranceClaimsFhirApi.ClinicalStatus,
  [AllergyIntoleranceSearchParamNames.VerificationStatus]: AllergyIntoleranceClaimsFhirApi.VerificationStatus,
  [AllergyIntoleranceSearchParamNames.Category]: AllergyIntoleranceClaimsFhirApi.Category,
  [AllergyIntoleranceSearchParamNames.Criticality]: AllergyIntoleranceClaimsFhirApi.Criticality,
  [AllergyIntoleranceSearchParamNames.Asserter]: AllergyIntoleranceClaimsFhirApi.Asserter,
  [AllergyIntoleranceSearchParamNames.Date]: AllergyIntoleranceClaimsFhirApi.Date,
  [AllergyIntoleranceSearchParamNames.LastDate]: AllergyIntoleranceClaimsFhirApi.LastDate,
  [AllergyIntoleranceSearchParamNames.Manifestation]: AllergyIntoleranceClaimsFhirApi.Manifestation,
  [AllergyIntoleranceSearchParamNames.Onset]: AllergyIntoleranceClaimsFhirApi.Onset,
  [AllergyIntoleranceSearchParamNames.Route]: AllergyIntoleranceClaimsFhirApi.Route,
  [AllergyIntoleranceSearchParamNames.Severity]: AllergyIntoleranceClaimsFhirApi.Severity,
  [AllergyIntoleranceSearchParamNames.Type]: AllergyIntoleranceClaimsFhirApi.Type,
  [AllergyIntoleranceSearchParamNames.OnsetDateTime]: AllergyIntoleranceClaimsFhirApi.OnsetDateTime,
  [AllergyIntoleranceSearchParamNames.Recorder]: AllergyIntoleranceClaimsFhirApi.Recorder,
};

export const AllergyIntoleranceClaimsFhirApiMap = {
  [AllergyIntoleranceClaimsFhirApi.Identifier]: String,
  [AllergyIntoleranceClaimsFhirApi.Subject]: String,
  [AllergyIntoleranceClaimsFhirApi.Patient]: String,
  [AllergyIntoleranceClaimsFhirApi.Code]: String,
  [AllergyIntoleranceClaimsFhirApi.CodeText]: String,
  [AllergyIntoleranceClaimsFhirApi.CodeDisplay]: String,
  [AllergyIntoleranceClaimsFhirApi.ClinicalStatus]: String,
  [AllergyIntoleranceClaimsFhirApi.VerificationStatus]: String,
  [AllergyIntoleranceClaimsFhirApi.Category]: String,
  [AllergyIntoleranceClaimsFhirApi.Criticality]: String,
  [AllergyIntoleranceClaimsFhirApi.Asserter]: String,
  [AllergyIntoleranceClaimsFhirApi.Date]: String,
  [AllergyIntoleranceClaimsFhirApi.LastDate]: String,
  [AllergyIntoleranceClaimsFhirApi.Manifestation]: String,
  [AllergyIntoleranceClaimsFhirApi.Onset]: String,
  [AllergyIntoleranceClaimsFhirApi.Route]: String,
  [AllergyIntoleranceClaimsFhirApi.Severity]: String,
  [AllergyIntoleranceClaimsFhirApi.Type]: String,
  [AllergyIntoleranceClaimsFhirApi.OnsetDateTime]: String,
  [AllergyIntoleranceClaimsFhirApi.Recorder]: String,
};

/**
 * http://hl7.org/fhir/uv/ips/ValueSet/allergies-intolerances-uv-ips
 * Snomed IPS codes for allergy and intolerance categories: food, medication, environment, biologic.
 * WHO ATC codes V01AA for Allergen extracts
 */
export const AllergyIntoleranceClaimSpecs: ClaimSpec[] = [
  { key: AllergyIntoleranceClaim.Identifier, meaning: 'Business identifier for allergy record.', example: 'ALG-0001' },
  { key: AllergyIntoleranceClaim.Subject, meaning: 'Canonical subject reference (maps to FHIR AllergyIntolerance.patient.reference).', example: 'urn:uuid:<UUID-V4>' },
  { key: AllergyIntoleranceClaim.Patient, meaning: 'Deprecated alias of subject for compatibility.', example: 'urn:uuid:<UUID-V4>' },
  { key: AllergyIntoleranceClaim.Code, meaning: 'Allergy or intolerance code.', example: 'http://snomed.info/sct|227493005' },
  { key: AllergyIntoleranceClaim.CodeText, meaning: 'Local-language allergy label matching the resource language.', example: 'Penicilina' },
  { key: AllergyIntoleranceClaim.CodeDisplay, meaning: 'English/international terminology display.', example: 'Penicillin' },
  { key: AllergyIntoleranceClaim.ClinicalStatus, meaning: 'Clinical status code.', example: 'active' },
  { key: AllergyIntoleranceClaim.VerificationStatus, meaning: 'Verification status code.', example: 'confirmed' },
  { key: AllergyIntoleranceClaim.Category, meaning: 'Category value.', example: 'food' },
  { key: AllergyIntoleranceClaim.Criticality, meaning: 'Potential future harm if exposed to the substance.', example: AllergyIntoleranceCriticalities.High },
  { key: AllergyIntoleranceClaim.Asserter, meaning: 'Source of the allergy assertion.', example: 'Practitioner/practitioner-123' },
  { key: AllergyIntoleranceClaim.RecordedDate, meaning: 'Date the allergy record was first captured.', example: '2026-01-10T10:00:00Z' },
  { key: AllergyIntoleranceClaim.LastOccurrence, meaning: 'Date of the most recent known reaction.', example: '2026-01-09T18:00:00Z' },
  { key: AllergyIntoleranceClaim.Manifestation, meaning: 'Clinical manifestation of the reaction.', example: 'http://snomed.info/sct|247472004' },
  { key: AllergyIntoleranceClaim.Onset, meaning: 'Searchable onset value for the allergy or reaction.', example: '2026-01-10' },
  { key: AllergyIntoleranceClaim.Route, meaning: 'Exposure route for the reaction.', example: 'http://snomed.info/sct|26643006' },
  { key: AllergyIntoleranceClaim.Severity, meaning: 'Severity of one observed reaction event, distinct from future-risk criticality.', example: AllergyIntoleranceReactionSeverities.Moderate },
  { key: AllergyIntoleranceClaim.Type, meaning: 'Allergy or intolerance classification.', example: 'allergy' },
  { key: AllergyIntoleranceClaim.OnsetDateTime, meaning: 'Onset date/time.', example: '2026-01-10T10:00:00Z' },
  { key: AllergyIntoleranceClaim.Recorder, meaning: 'Recorder reference.', example: 'did:web:<domain>:organization:taxid:<TAXID>:member:<MEMBER_ID>:<roleCode>' },
];
