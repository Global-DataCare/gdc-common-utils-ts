// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/condition-claims.ts

import type { ClaimSpec } from './types';

export const ConditionClaim = {
  Identifier: 'Condition.identifier',
  Subject: 'Condition.subject',
  ClinicalStatus: 'Condition.clinical-status',
  VerificationStatus: 'Condition.verification-status',
  Category: 'Condition.category',
  Code: 'Condition.code',
  Severity: 'Condition.severity',
  OnsetDateTime: 'Condition.onset-datetime',
  Recorder: 'Condition.recorder',
} as const;

export type ConditionClaimKey = typeof ConditionClaim[keyof typeof ConditionClaim];

export const ConditionClaimSpecs: ClaimSpec[] = [
  { key: ConditionClaim.Identifier, meaning: 'Business identifier for condition record.', example: 'COND-0001' },
  { key: ConditionClaim.Subject, meaning: 'Patient subject reference.', example: 'Patient/pat-123' },
  { key: ConditionClaim.ClinicalStatus, meaning: 'Clinical status code.', example: 'active' },
  { key: ConditionClaim.VerificationStatus, meaning: 'Verification status code.', example: 'confirmed' },
  { key: ConditionClaim.Category, meaning: 'Condition category code.', example: 'problem-list-item' },
  { key: ConditionClaim.Code, meaning: 'Condition code.', example: 'http://snomed.info/sct|44054006' },
  { key: ConditionClaim.Severity, meaning: 'Condition severity code.', example: 'http://snomed.info/sct|24484000' },
  { key: ConditionClaim.OnsetDateTime, meaning: 'Onset date/time.', example: '2026-01-03T09:30:00Z' },
  { key: ConditionClaim.Recorder, meaning: 'Recorder reference.', example: 'Practitioner/prac-2' },
];
