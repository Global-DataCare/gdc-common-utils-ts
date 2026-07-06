// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/condition-claims.ts

import type { ClaimSpec } from './types';

// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

export const ConditionClaim = {
  Identifier: 'Condition.identifier',
  Subject: 'Condition.subject',
  ClinicalStatus: 'Condition.clinical-status',
  VerificationStatus: 'Condition.verification-status',
  Category: 'Condition.category',
  Code: 'Condition.code',
  /**
   * Canonical CSV/list of related contained resource references or identifiers.
   */
  ContainedReferenceList: 'Condition.contained-reference-list',
  /**
   * @deprecated Use `ContainedReferenceList`.
   */
  ContainedResourceList: 'Condition.contained-resource-list',
  /**
   * @deprecated Use `ContainedReferenceList`.
   */
  ContainedDocuments: 'Condition.contained-documents',
  /**
   * @deprecated Use `ContainedReferenceList`.
   */
  AttachmentContentIds: 'Condition.attachment-content-ids',
  Severity: 'Condition.severity',
  OnsetDateTime: 'Condition.onset-datetime',
  Recorder: 'Condition.recorder',
} as const;

export type ConditionClaimKey = typeof ConditionClaim[keyof typeof ConditionClaim];

export enum ConditionClaimsFhirApi {
  Identifier = 'org.hl7.fhir.api.Condition.identifier',
  Subject = 'org.hl7.fhir.api.Condition.subject',
  ClinicalStatus = 'org.hl7.fhir.api.Condition.clinical-status',
  VerificationStatus = 'org.hl7.fhir.api.Condition.verification-status',
  Category = 'org.hl7.fhir.api.Condition.category',
  Code = 'org.hl7.fhir.api.Condition.code',
  Severity = 'org.hl7.fhir.api.Condition.severity',
  OnsetDateTime = 'org.hl7.fhir.api.Condition.onset-datetime',
  Recorder = 'org.hl7.fhir.api.Condition.recorder',
}

export const ConditionSearchParamNames = {
  Identifier: 'identifier',
  Subject: 'subject',
  ClinicalStatus: 'clinical-status',
  VerificationStatus: 'verification-status',
  Category: 'category',
  Code: 'code',
  Severity: 'severity',
  OnsetDateTime: 'onset-datetime',
  Recorder: 'recorder',
} as const;

export type ConditionSearchParamName =
  typeof ConditionSearchParamNames[keyof typeof ConditionSearchParamNames];

export const ConditionSearchParamToClaimKey: Record<
ConditionSearchParamName,
ConditionClaimsFhirApi
> = {
  [ConditionSearchParamNames.Identifier]: ConditionClaimsFhirApi.Identifier,
  [ConditionSearchParamNames.Subject]: ConditionClaimsFhirApi.Subject,
  [ConditionSearchParamNames.ClinicalStatus]: ConditionClaimsFhirApi.ClinicalStatus,
  [ConditionSearchParamNames.VerificationStatus]: ConditionClaimsFhirApi.VerificationStatus,
  [ConditionSearchParamNames.Category]: ConditionClaimsFhirApi.Category,
  [ConditionSearchParamNames.Code]: ConditionClaimsFhirApi.Code,
  [ConditionSearchParamNames.Severity]: ConditionClaimsFhirApi.Severity,
  [ConditionSearchParamNames.OnsetDateTime]: ConditionClaimsFhirApi.OnsetDateTime,
  [ConditionSearchParamNames.Recorder]: ConditionClaimsFhirApi.Recorder,
};

export const ConditionClaimsFhirApiMap = {
  [ConditionClaimsFhirApi.Identifier]: String,
  [ConditionClaimsFhirApi.Subject]: String,
  [ConditionClaimsFhirApi.ClinicalStatus]: String,
  [ConditionClaimsFhirApi.VerificationStatus]: String,
  [ConditionClaimsFhirApi.Category]: String,
  [ConditionClaimsFhirApi.Code]: String,
  [ConditionClaimsFhirApi.Severity]: String,
  [ConditionClaimsFhirApi.OnsetDateTime]: String,
  [ConditionClaimsFhirApi.Recorder]: String,
};

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
