// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/allergy-intolerance-claims.ts

import type { ClaimSpec } from './types';

// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

export const AllergyIntoleranceClaim = {
  Identifier: 'AllergyIntolerance.identifier',
  Subject: 'AllergyIntolerance.subject',
  /**
   * @deprecated Use `AllergyIntolerance.subject`.
   * Kept as compatibility alias because FHIR native field is `patient`.
   */
  Patient: 'AllergyIntolerance.patient',
  Code: 'AllergyIntolerance.code',
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
  OnsetDateTime: 'AllergyIntolerance.onset-datetime',
  Recorder: 'AllergyIntolerance.recorder',
} as const;

export type AllergyIntoleranceClaimKey = typeof AllergyIntoleranceClaim[keyof typeof AllergyIntoleranceClaim];

export enum AllergyIntoleranceClaimsFhirApi {
  Identifier = 'org.hl7.fhir.api.AllergyIntolerance.identifier',
  Subject = 'org.hl7.fhir.api.AllergyIntolerance.subject',
  Patient = 'org.hl7.fhir.api.AllergyIntolerance.patient',
  Code = 'org.hl7.fhir.api.AllergyIntolerance.code',
  ClinicalStatus = 'org.hl7.fhir.api.AllergyIntolerance.clinical-status',
  VerificationStatus = 'org.hl7.fhir.api.AllergyIntolerance.verification-status',
  Category = 'org.hl7.fhir.api.AllergyIntolerance.category',
  Criticality = 'org.hl7.fhir.api.AllergyIntolerance.criticality',
  OnsetDateTime = 'org.hl7.fhir.api.AllergyIntolerance.onset-datetime',
  Recorder = 'org.hl7.fhir.api.AllergyIntolerance.recorder',
}

export const AllergyIntoleranceSearchParamNames = {
  Identifier: 'identifier',
  Subject: 'subject',
  Patient: 'patient',
  Code: 'code',
  ClinicalStatus: 'clinical-status',
  VerificationStatus: 'verification-status',
  Category: 'category',
  Criticality: 'criticality',
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
  [AllergyIntoleranceSearchParamNames.ClinicalStatus]: AllergyIntoleranceClaimsFhirApi.ClinicalStatus,
  [AllergyIntoleranceSearchParamNames.VerificationStatus]: AllergyIntoleranceClaimsFhirApi.VerificationStatus,
  [AllergyIntoleranceSearchParamNames.Category]: AllergyIntoleranceClaimsFhirApi.Category,
  [AllergyIntoleranceSearchParamNames.Criticality]: AllergyIntoleranceClaimsFhirApi.Criticality,
  [AllergyIntoleranceSearchParamNames.OnsetDateTime]: AllergyIntoleranceClaimsFhirApi.OnsetDateTime,
  [AllergyIntoleranceSearchParamNames.Recorder]: AllergyIntoleranceClaimsFhirApi.Recorder,
};

export const AllergyIntoleranceClaimsFhirApiMap = {
  [AllergyIntoleranceClaimsFhirApi.Identifier]: String,
  [AllergyIntoleranceClaimsFhirApi.Subject]: String,
  [AllergyIntoleranceClaimsFhirApi.Patient]: String,
  [AllergyIntoleranceClaimsFhirApi.Code]: String,
  [AllergyIntoleranceClaimsFhirApi.ClinicalStatus]: String,
  [AllergyIntoleranceClaimsFhirApi.VerificationStatus]: String,
  [AllergyIntoleranceClaimsFhirApi.Category]: String,
  [AllergyIntoleranceClaimsFhirApi.Criticality]: String,
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
  { key: AllergyIntoleranceClaim.ClinicalStatus, meaning: 'Clinical status code.', example: 'active' },
  { key: AllergyIntoleranceClaim.VerificationStatus, meaning: 'Verification status code.', example: 'confirmed' },
  { key: AllergyIntoleranceClaim.Category, meaning: 'Category value.', example: 'food' },
  { key: AllergyIntoleranceClaim.Criticality, meaning: 'Criticality level.', example: 'high' },
  { key: AllergyIntoleranceClaim.OnsetDateTime, meaning: 'Onset date/time.', example: '2026-01-10T10:00:00Z' },
  { key: AllergyIntoleranceClaim.Recorder, meaning: 'Recorder reference.', example: 'did:web:<domain>:organization:taxid:<TAXID>:member:<MEMBER_ID>:<roleCode>' },
];
