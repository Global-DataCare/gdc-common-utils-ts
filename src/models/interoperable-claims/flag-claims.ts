// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/flag-claims.ts

import type { ClaimSpec, FhirStandardExtensionClaimSpec } from './types';

export const FlagClaim = {
  Author: 'Flag.author',
  Date: 'Flag.date',
  Encounter: 'Flag.encounter',
  Identifier: 'Flag.identifier',
  Patient: 'Flag.patient',
  Subject: 'Flag.subject',
  Status: 'Flag.status',
  Category: 'Flag.category',
  Code: 'Flag.code',
  CodeText: 'Flag.code-text',
  CodeTextLocal: 'Flag.code-text',
  CodeDisplay: 'Flag.code-display',
  PeriodStart: 'Flag.period-start',
  PeriodEnd: 'Flag.period-end',
  Detail: 'Flag.flag-detail',
  Priority: 'Flag.flag-priority',
} as const;

export type FlagClaimKey = typeof FlagClaim[keyof typeof FlagClaim];

const FlagBaseClaimSpecs: ClaimSpec[] = [
  { key: FlagClaim.Author, meaning: 'Author reference.', example: 'Practitioner/prac-1' },
  { key: FlagClaim.Date, meaning: 'Flag issue date/time.', example: '2026-06-01T10:00:00Z' },
  { key: FlagClaim.Encounter, meaning: 'Encounter reference.', example: 'Encounter/enc-1' },
  { key: FlagClaim.Identifier, meaning: 'Business identifier.', example: 'flag-001' },
  { key: FlagClaim.Patient, meaning: 'Patient reference.', example: 'did:web:patient.example.org' },
  { key: FlagClaim.Subject, meaning: 'Canonical subject reference.', example: 'did:web:patient.example.org' },
  { key: FlagClaim.Status, meaning: 'Flag status.', example: 'active' },
  { key: FlagClaim.Category, meaning: 'Flag category token.', example: 'http://terminology.hl7.org/CodeSystem/flag-category|contact' },
  { key: FlagClaim.Code, meaning: 'Flag code token; distinct from the IPS Alerts section code.', example: 'http://snomed.info/sct|370388006' },
  { key: FlagClaim.CodeText, meaning: 'Local-language alert name matching resource language.', example: 'Dieta sin marisco' },
  { key: FlagClaim.CodeDisplay, meaning: 'English/international terminology display.', example: 'Shellfish free diet' },
  { key: FlagClaim.PeriodStart, meaning: 'Flag period start.', example: '2026-06-01T10:00:00Z' },
  { key: FlagClaim.PeriodEnd, meaning: 'Flag period end.', example: '2026-07-01T10:00:00Z' },
];

export const FlagStandardExtensionClaimSpecs = [
  {
    key: FlagClaim.Detail,
    meaning: 'References to information that explains the flag in more detail.',
    example: 'Condition/condition-1',
    origin: 'fhir-standard-extension',
    canonicalUrl: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
    fhirType: 'Reference',
  },
  {
    key: FlagClaim.Priority,
    meaning: 'Alarm priority code; Must Support in the IPS Flag profile.',
    example: 'http://hl7.org/fhir/flag-priority-code|PH',
    origin: 'fhir-standard-extension',
    canonicalUrl: 'http://hl7.org/fhir/StructureDefinition/flag-priority',
    fhirType: 'CodeableConcept',
  },
] as const satisfies readonly FhirStandardExtensionClaimSpec[];

export const FlagClaimSpecs: ClaimSpec[] = [
  ...FlagBaseClaimSpecs,
  ...FlagStandardExtensionClaimSpecs,
];
