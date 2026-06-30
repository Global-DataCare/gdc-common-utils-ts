// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/diagnostic-report-claims.ts

import type { ClaimSpec } from './types';

export const DiagnosticReportClaim = {
  BasedOn: 'DiagnosticReport.based-on',
  Category: 'DiagnosticReport.category',
  Code: 'DiagnosticReport.code',
  Date: 'DiagnosticReport.date',
  Encounter: 'DiagnosticReport.encounter',
  Identifier: 'DiagnosticReport.identifier',
  Media: 'DiagnosticReport.media',
  Patient: 'DiagnosticReport.patient',
  Performer: 'DiagnosticReport.performer',
  Result: 'DiagnosticReport.result',
  ResultsInterpreter: 'DiagnosticReport.results-interpreter',
  Specimen: 'DiagnosticReport.specimen',
  Status: 'DiagnosticReport.status',
  Subject: 'DiagnosticReport.subject',
  PresentedFormContentType: 'DiagnosticReport.presented-form-contenttype',
  PresentedFormData: 'DiagnosticReport.presented-form-data',
  PresentedFormUrl: 'DiagnosticReport.presented-form-url',
  ContainedDocuments: 'DiagnosticReport.contained-documents',
} as const;

/**
 * TODO(ips-next):
 * Add resource-level claim helpers in `src/utils/claims-helpers-diagnostic-report.ts`
 * following the same contract already used by Consent/Medication/Condition/Allergy:
 * - `getDiagnosticReportClaimList(...)`
 * - `setDiagnosticReportClaimList(...)`
 * - `addDiagnosticReportClaimList(...)`
 * - `removeDiagnosticReportClaimList(...)`
 * - focused helpers for:
 *   - `get/set/add/removeDiagnosticReportResultList`
 *   - `get/set/add/removeDiagnosticReportPerformerList`
 *   - `get/set/add/removeDiagnosticReportSpecimenList`
 *   - `get/set/add/removeDiagnosticReportContainedDocuments`
 *   - `get/setDiagnosticReportPresentedFormContentType`
 *   - `get/setDiagnosticReportPresentedFormData`
 *   - `get/setDiagnosticReportPresentedFormUrl`
 *
 * Keep naming aligned with canonical FHIR search parameter names
 * (lowercase with `-`) and reuse the existing `SearchParamNames` + contextualized
 * claim-key mapping pattern.
 *
 * This file is intentionally type-first only for now so GW Core and
 * `common-utils` can already exercise the rest of the bundle workflow without
 * committing to the DiagnosticReport editing surface yet.
 */

export type DiagnosticReportClaimKey = typeof DiagnosticReportClaim[keyof typeof DiagnosticReportClaim];

export const DiagnosticReportClaimSpecs: ClaimSpec[] = [
  { key: DiagnosticReportClaim.BasedOn, meaning: 'Request or order that originated the report.', example: 'ServiceRequest/sr-1' },
  { key: DiagnosticReportClaim.Category, meaning: 'Diagnostic service section/category.', example: 'http://terminology.hl7.org/CodeSystem/v2-0074|LAB' },
  { key: DiagnosticReportClaim.Code, meaning: 'Main diagnostic report code.', example: 'http://loinc.org|58410-2' },
  { key: DiagnosticReportClaim.Date, meaning: 'Report issuance date/time.', example: '2026-06-12T10:00:00Z' },
  { key: DiagnosticReportClaim.Encounter, meaning: 'Encounter reference.', example: 'Encounter/enc-1' },
  { key: DiagnosticReportClaim.Identifier, meaning: 'Business identifier for the report.', example: 'diag-report-001' },
  { key: DiagnosticReportClaim.Media, meaning: 'Linked media reference list (comma-separeted).', example: 'Media/media-1' },
  { key: DiagnosticReportClaim.Patient, meaning: 'Patient reference.', example: 'did:web:patient.example.org' },
  { key: DiagnosticReportClaim.Performer, meaning: 'Performer reference.', example: 'did:web:lab.example.org:system:lisin' },
  { key: DiagnosticReportClaim.Result, meaning: 'Observation/result reference.', example: 'Observation/obs-1' },
  { key: DiagnosticReportClaim.ResultsInterpreter, meaning: 'Results interpreter reference.', example: 'Practitioner/prac-1' },
  { key: DiagnosticReportClaim.Specimen, meaning: 'Specimen reference list (comma-separared).', example: 'Specimen/spec-1' },
  { key: DiagnosticReportClaim.Status, meaning: 'Diagnostic report status.', example: 'final' },
  { key: DiagnosticReportClaim.Subject, meaning: 'Canonical subject reference.', example: 'did:web:patient.example.org' },
  { key: DiagnosticReportClaim.PresentedFormContentType, meaning: 'FHIR presentedForm attachment content type.', example: 'application/pdf' },
  { key: DiagnosticReportClaim.PresentedFormData, meaning: 'FHIR presentedForm inline base64 payload.', example: 'JVBERi0xLjc...' },
  { key: DiagnosticReportClaim.PresentedFormUrl, meaning: 'FHIR presentedForm external URL.', example: 'https://example.org/report.pdf' },
  { key: DiagnosticReportClaim.ContainedDocuments, meaning: 'CSV of linked DocumentReference identifiers stored in the same bundle.', example: 'docref-example-001,docref-example-002' },
];

export const DiagnosticReportSearchParamNames = {
  BasedOn: 'based-on',
  Category: 'category',
  Code: 'code',
  Date: 'date',
  Encounter: 'encounter',
  Identifier: 'identifier',
  Media: 'media',
  Patient: 'patient',
  Performer: 'performer',
  Result: 'result',
  ResultsInterpreter: 'results-interpreter',
  Specimen: 'specimen',
  Status: 'status',
  Subject: 'subject',
} as const;

export type DiagnosticReportSearchParamName =
  typeof DiagnosticReportSearchParamNames[keyof typeof DiagnosticReportSearchParamNames];

export enum DiagnosticReportClaimsFhirApi {
  BasedOn = 'org.hl7.fhir.api.DiagnosticReport.based-on',
  Category = 'org.hl7.fhir.api.DiagnosticReport.category',
  Code = 'org.hl7.fhir.api.DiagnosticReport.code',
  Date = 'org.hl7.fhir.api.DiagnosticReport.date',
  Encounter = 'org.hl7.fhir.api.DiagnosticReport.encounter',
  Identifier = 'org.hl7.fhir.api.DiagnosticReport.identifier',
  Media = 'org.hl7.fhir.api.DiagnosticReport.media',
  Patient = 'org.hl7.fhir.api.DiagnosticReport.patient',
  Performer = 'org.hl7.fhir.api.DiagnosticReport.performer',
  Result = 'org.hl7.fhir.api.DiagnosticReport.result',
  ResultsInterpreter = 'org.hl7.fhir.api.DiagnosticReport.results-interpreter',
  Specimen = 'org.hl7.fhir.api.DiagnosticReport.specimen',
  Status = 'org.hl7.fhir.api.DiagnosticReport.status',
  Subject = 'org.hl7.fhir.api.DiagnosticReport.subject',
}

export const DiagnosticReportSearchParamToClaimKey: Record<
DiagnosticReportSearchParamName,
DiagnosticReportClaimsFhirApi
> = {
  [DiagnosticReportSearchParamNames.BasedOn]: DiagnosticReportClaimsFhirApi.BasedOn,
  [DiagnosticReportSearchParamNames.Category]: DiagnosticReportClaimsFhirApi.Category,
  [DiagnosticReportSearchParamNames.Code]: DiagnosticReportClaimsFhirApi.Code,
  [DiagnosticReportSearchParamNames.Date]: DiagnosticReportClaimsFhirApi.Date,
  [DiagnosticReportSearchParamNames.Encounter]: DiagnosticReportClaimsFhirApi.Encounter,
  [DiagnosticReportSearchParamNames.Identifier]: DiagnosticReportClaimsFhirApi.Identifier,
  [DiagnosticReportSearchParamNames.Media]: DiagnosticReportClaimsFhirApi.Media,
  [DiagnosticReportSearchParamNames.Patient]: DiagnosticReportClaimsFhirApi.Patient,
  [DiagnosticReportSearchParamNames.Performer]: DiagnosticReportClaimsFhirApi.Performer,
  [DiagnosticReportSearchParamNames.Result]: DiagnosticReportClaimsFhirApi.Result,
  [DiagnosticReportSearchParamNames.ResultsInterpreter]: DiagnosticReportClaimsFhirApi.ResultsInterpreter,
  [DiagnosticReportSearchParamNames.Specimen]: DiagnosticReportClaimsFhirApi.Specimen,
  [DiagnosticReportSearchParamNames.Status]: DiagnosticReportClaimsFhirApi.Status,
  [DiagnosticReportSearchParamNames.Subject]: DiagnosticReportClaimsFhirApi.Subject,
};

/**
 * TODO(ips-next):
 * Add `DiagnosticReportClaimsFhirApiExtended` only if/when the bundle editor
 * needs operational flat fields beyond the official search parameter surface.
 *
 * Do not invent camelCase names. Prefer official FHIR search parameter names
 * or explicit attachment aliases such as `presented-form-*` and
 * `contained-documents`.
 *
 * Keep `DiagnosticReport` paused at the typing/mapping layer until:
 * 1. `claims-helpers-diagnostic-report.ts` exists
 * 2. GW Core readers/tests consume the same shared claim keys
 */
