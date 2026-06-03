// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/observation-claims.ts

import type { ClaimSpec } from './types';

export const ObservationClaim = {
  BasedOn: 'Observation.based-on',
  Category: 'Observation.category',
  Code: 'Observation.code',
  Date: 'Observation.date',
  Device: 'Observation.device',
  Encounter: 'Observation.encounter',
  Focus: 'Observation.focus',
  HasMember: 'Observation.has-member',
  Identifier: 'Observation.identifier',
  Method: 'Observation.method',
  Patient: 'Observation.patient',
  Performer: 'Observation.performer',
  Specimen: 'Observation.specimen',
  Status: 'Observation.status',
  Subject: 'Observation.subject',
  ValueConcept: 'Observation.value-concept',
  ValueDate: 'Observation.value-date',
  ValueString: 'Observation.value-string',
  ComponentCode: 'Observation.component-code',
  Note: 'Observation.note',
  EffectiveDateTime: 'Observation.effectiveDateTime',
} as const;

export type ObservationClaimKey = typeof ObservationClaim[keyof typeof ObservationClaim];

export const ObservationClaimSpecs: ClaimSpec[] = [
  { key: ObservationClaim.BasedOn, meaning: 'Order or request that originated the observation.', example: 'ServiceRequest/sr-1' },
  { key: ObservationClaim.Category, meaning: 'Observation category token.', example: 'http://terminology.hl7.org/CodeSystem/observation-category|vital-signs' },
  { key: ObservationClaim.Code, meaning: 'Observation code token.', example: 'http://loinc.org|8480-6' },
  { key: ObservationClaim.Date, meaning: 'Observation effective or issued date/time.', example: '2026-06-01T10:00:00Z' },
  { key: ObservationClaim.Device, meaning: 'Device reference.', example: 'Device/dev-1' },
  { key: ObservationClaim.Encounter, meaning: 'Encounter reference.', example: 'Encounter/enc-1' },
  { key: ObservationClaim.Focus, meaning: 'Focus reference.', example: 'Condition/cond-1' },
  { key: ObservationClaim.HasMember, meaning: 'Member observation references (CSV).', example: 'Observation/obs-2,Observation/obs-3' },
  { key: ObservationClaim.Identifier, meaning: 'Business identifier.', example: 'obs-001' },
  { key: ObservationClaim.Method, meaning: 'Observation method token.', example: 'http://snomed.info/sct|252465000' },
  { key: ObservationClaim.Patient, meaning: 'Patient reference.', example: 'did:web:patient.example.org' },
  { key: ObservationClaim.Performer, meaning: 'Performer references (CSV).', example: 'Practitioner/prac-1' },
  { key: ObservationClaim.Specimen, meaning: 'Specimen reference.', example: 'Specimen/spec-1' },
  { key: ObservationClaim.Status, meaning: 'Observation status.', example: 'final' },
  { key: ObservationClaim.Subject, meaning: 'Canonical subject reference.', example: 'did:web:patient.example.org' },
  { key: ObservationClaim.ValueConcept, meaning: 'Value concept token.', example: 'http://snomed.info/sct|373066001' },
  { key: ObservationClaim.ValueDate, meaning: 'Value date.', example: '2026-06-01' },
  { key: ObservationClaim.ValueString, meaning: 'Value string.', example: 'Former smoker' },
  { key: ObservationClaim.ComponentCode, meaning: 'Component code token.', example: 'http://loinc.org|8462-4' },
  { key: ObservationClaim.Note, meaning: 'Clinical note text.', example: 'Patient seated for 5 minutes before measurement.' },
  { key: ObservationClaim.EffectiveDateTime, meaning: 'FHIR-compatible effectiveDateTime fallback.', example: '2026-06-01T10:00:00Z' },
];
