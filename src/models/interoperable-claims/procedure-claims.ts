// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/procedure-claims.ts

import type { ClaimSpec } from './types';

export const ProcedureClaim = {
  BasedOn: 'Procedure.based-on',
  BodySite: 'Procedure.body-site',
  Code: 'Procedure.code',
  CodeText: 'Procedure.code-text',
  CodeDisplay: 'Procedure.code-display',
  Date: 'Procedure.date',
  Encounter: 'Procedure.encounter',
  Identifier: 'Procedure.identifier',
  InstantiatesCanonical: 'Procedure.instantiates-canonical',
  InstantiatesUri: 'Procedure.instantiates-uri',
  Location: 'Procedure.location',
  PartOf: 'Procedure.part-of',
  Patient: 'Procedure.patient',
  Performer: 'Procedure.performer',
  ReasonCode: 'Procedure.reason-code',
  ReasonReference: 'Procedure.reason-reference',
  Status: 'Procedure.status',
  Subject: 'Procedure.subject',
  Note: 'Procedure.note',
} as const;

export type ProcedureClaimKey = typeof ProcedureClaim[keyof typeof ProcedureClaim];

export const ProcedureClaimSpecs: ClaimSpec[] = [
  { key: ProcedureClaim.BasedOn, meaning: 'Request or order reference.', example: 'ServiceRequest/sr-1' },
  { key: ProcedureClaim.BodySite, meaning: 'Body site token.', example: 'http://snomed.info/sct|66754008' },
  { key: ProcedureClaim.Code, meaning: 'Procedure code token.', example: 'http://snomed.info/sct|80146002' },
  { key: ProcedureClaim.CodeText, meaning: 'Local-language procedure label used by forms/UI.', example: 'Apendicectomia' },
  { key: ProcedureClaim.CodeDisplay, meaning: 'Canonical/international procedure display label.', example: 'Appendectomy' },
  { key: ProcedureClaim.Date, meaning: 'Performed date/time.', example: '2026-06-01T10:00:00Z' },
  { key: ProcedureClaim.Encounter, meaning: 'Encounter reference.', example: 'Encounter/enc-1' },
  { key: ProcedureClaim.Identifier, meaning: 'Business identifier.', example: 'procedure-001' },
  { key: ProcedureClaim.InstantiatesCanonical, meaning: 'Instantiated canonical plan/protocol.', example: 'http://example.org/PlanDefinition/appendectomy' },
  { key: ProcedureClaim.InstantiatesUri, meaning: 'Instantiated URI.', example: 'urn:procedure-protocol:appendectomy' },
  { key: ProcedureClaim.Location, meaning: 'Location reference.', example: 'Location/loc-1' },
  { key: ProcedureClaim.PartOf, meaning: 'Parent procedure reference.', example: 'Procedure/proc-parent' },
  { key: ProcedureClaim.Patient, meaning: 'Patient reference.', example: 'did:web:patient.example.org' },
  { key: ProcedureClaim.Performer, meaning: 'Performer references (CSV).', example: 'Practitioner/prac-1' },
  { key: ProcedureClaim.ReasonCode, meaning: 'Reason code token.', example: 'http://snomed.info/sct|233604007' },
  { key: ProcedureClaim.ReasonReference, meaning: 'Reason reference.', example: 'Condition/cond-1' },
  { key: ProcedureClaim.Status, meaning: 'Procedure status.', example: 'completed' },
  { key: ProcedureClaim.Subject, meaning: 'Canonical subject reference.', example: 'did:web:patient.example.org' },
  { key: ProcedureClaim.Note, meaning: 'Clinical note text.', example: 'Procedure tolerated well.' },
];
