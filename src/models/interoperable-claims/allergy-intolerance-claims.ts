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
  Criticality: 'AllergyIntolerance.criticality',
  OnsetDateTime: 'AllergyIntolerance.onset-datetime',
  Recorder: 'AllergyIntolerance.recorder',
} as const;

export type AllergyIntoleranceClaimKey = typeof AllergyIntoleranceClaim[keyof typeof AllergyIntoleranceClaim];

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
