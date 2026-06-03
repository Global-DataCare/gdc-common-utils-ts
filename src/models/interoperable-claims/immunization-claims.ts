// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/immunization-claims.ts

import type { ClaimSpec } from './types';

export const ImmunizationClaim = {
  Date: 'Immunization.date',
  Identifier: 'Immunization.identifier',
  Location: 'Immunization.location',
  LotNumber: 'Immunization.lot-number',
  Manufacturer: 'Immunization.manufacturer',
  Patient: 'Immunization.patient',
  Performer: 'Immunization.performer',
  ReactionDate: 'Immunization.reaction-date',
  ReasonCode: 'Immunization.reason-code',
  ReasonReference: 'Immunization.reason-reference',
  Series: 'Immunization.series',
  Status: 'Immunization.status',
  StatusReason: 'Immunization.status-reason',
  TargetDisease: 'Immunization.target-disease',
  VaccineCode: 'Immunization.vaccine-code',
  DoseSequence: 'Immunization.dose-sequence',
  Subject: 'Immunization.subject',
  Note: 'Immunization.note',
} as const;

export type ImmunizationClaimKey = typeof ImmunizationClaim[keyof typeof ImmunizationClaim];

export const ImmunizationClaimSpecs: ClaimSpec[] = [
  { key: ImmunizationClaim.Date, meaning: 'Administration date/time.', example: '2026-06-01T10:00:00Z' },
  { key: ImmunizationClaim.Identifier, meaning: 'Business identifier.', example: 'imm-001' },
  { key: ImmunizationClaim.Location, meaning: 'Location reference.', example: 'Location/loc-1' },
  { key: ImmunizationClaim.LotNumber, meaning: 'Vaccine lot number.', example: 'LOT-2026-01' },
  { key: ImmunizationClaim.Manufacturer, meaning: 'Manufacturer reference.', example: 'Organization/org-vax' },
  { key: ImmunizationClaim.Patient, meaning: 'Patient reference.', example: 'did:web:patient.example.org' },
  { key: ImmunizationClaim.Performer, meaning: 'Performer references (CSV).', example: 'Practitioner/prac-1' },
  { key: ImmunizationClaim.ReactionDate, meaning: 'Reaction date/time.', example: '2026-06-02T08:00:00Z' },
  { key: ImmunizationClaim.ReasonCode, meaning: 'Reason code token.', example: 'http://snomed.info/sct|281647001' },
  { key: ImmunizationClaim.ReasonReference, meaning: 'Reason reference.', example: 'Condition/cond-1' },
  { key: ImmunizationClaim.Series, meaning: 'Vaccination series.', example: 'COVID primary series' },
  { key: ImmunizationClaim.Status, meaning: 'Immunization status.', example: 'completed' },
  { key: ImmunizationClaim.StatusReason, meaning: 'Status reason token.', example: 'http://terminology.hl7.org/CodeSystem/immunization-status-reason|expired' },
  { key: ImmunizationClaim.TargetDisease, meaning: 'Target disease token.', example: 'http://snomed.info/sct|840539006' },
  { key: ImmunizationClaim.VaccineCode, meaning: 'Vaccine code token.', example: 'http://hl7.org/fhir/sid/cvx|207' },
  { key: ImmunizationClaim.DoseSequence, meaning: 'Dose sequence string.', example: '2' },
  { key: ImmunizationClaim.Subject, meaning: 'Canonical subject reference.', example: 'did:web:patient.example.org' },
  { key: ImmunizationClaim.Note, meaning: 'Clinical note text.', example: 'No adverse reaction recorded.' },
];
