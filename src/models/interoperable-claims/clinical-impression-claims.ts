// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/clinical-impression-claims.ts

import type { ClaimSpec } from './types';

export const ClinicalImpressionClaim = {
  Identifier: 'ClinicalImpression.identifier',
  Status: 'ClinicalImpression.status',
  Description: 'ClinicalImpression.description',
  Subject: 'ClinicalImpression.subject',
  Encounter: 'ClinicalImpression.encounter',
  EffectiveDateTime: 'ClinicalImpression.effectiveDateTime',
  Date: 'ClinicalImpression.date',
  Assessor: 'ClinicalImpression.assessor',
  Problem: 'ClinicalImpression.problem',
  Finding: 'ClinicalImpression.finding',
  PrognosisCode: 'ClinicalImpression.prognosis-code',
  Summary: 'ClinicalImpression.summary',
} as const;

export type ClinicalImpressionClaimKey = typeof ClinicalImpressionClaim[keyof typeof ClinicalImpressionClaim];

export const ClinicalImpressionClaimSpecs: ClaimSpec[] = [
  { key: ClinicalImpressionClaim.Identifier, meaning: 'Business identifier.', example: 'ci-001' },
  { key: ClinicalImpressionClaim.Status, meaning: 'Clinical impression status.', example: 'completed' },
  { key: ClinicalImpressionClaim.Description, meaning: 'Narrative description.', example: 'Post-discharge review.' },
  { key: ClinicalImpressionClaim.Subject, meaning: 'Canonical subject reference.', example: 'did:web:patient.example.org' },
  { key: ClinicalImpressionClaim.Encounter, meaning: 'Encounter reference.', example: 'Encounter/enc-1' },
  { key: ClinicalImpressionClaim.EffectiveDateTime, meaning: 'Effective assessment date/time.', example: '2026-06-01T10:00:00Z' },
  { key: ClinicalImpressionClaim.Date, meaning: 'FHIR date field.', example: '2026-06-01T10:30:00Z' },
  { key: ClinicalImpressionClaim.Assessor, meaning: 'Assessor reference.', example: 'Practitioner/prac-1' },
  { key: ClinicalImpressionClaim.Problem, meaning: 'Problem references (CSV).', example: 'Condition/cond-1' },
  { key: ClinicalImpressionClaim.Finding, meaning: 'Finding references (CSV).', example: 'Observation/obs-1' },
  { key: ClinicalImpressionClaim.PrognosisCode, meaning: 'Prognosis token.', example: 'http://snomed.info/sct|271299001' },
  { key: ClinicalImpressionClaim.Summary, meaning: 'Summary text.', example: 'Stable with mild fatigue.' },
];
