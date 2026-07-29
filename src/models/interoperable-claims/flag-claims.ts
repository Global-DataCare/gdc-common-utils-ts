// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/flag-claims.ts

import type { ClaimSpec } from './types';

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
} as const;

export type FlagClaimKey = typeof FlagClaim[keyof typeof FlagClaim];

export const FlagClaimSpecs: ClaimSpec[] = [
  { key: FlagClaim.Author, meaning: 'Author reference.', example: 'Practitioner/prac-1' },
  { key: FlagClaim.Date, meaning: 'Flag issue date/time.', example: '2026-06-01T10:00:00Z' },
  { key: FlagClaim.Encounter, meaning: 'Encounter reference.', example: 'Encounter/enc-1' },
  { key: FlagClaim.Identifier, meaning: 'Business identifier.', example: 'flag-001' },
  { key: FlagClaim.Patient, meaning: 'Patient reference.', example: 'did:web:patient.example.org' },
  { key: FlagClaim.Subject, meaning: 'Canonical subject reference.', example: 'did:web:patient.example.org' },
  { key: FlagClaim.Status, meaning: 'Flag status.', example: 'active' },
  { key: FlagClaim.Category, meaning: 'Flag category token.', example: 'http://terminology.hl7.org/CodeSystem/flag-category|safety' },
  { key: FlagClaim.Code, meaning: 'Flag code token.', example: 'http://loinc.org|104605-1' },
  { key: FlagClaim.CodeText, meaning: 'Local-language alert name matching resource language.', example: 'Dieta sin marisco' },
  { key: FlagClaim.CodeDisplay, meaning: 'English/international terminology display.', example: 'Shellfish free diet' },
  { key: FlagClaim.PeriodStart, meaning: 'Flag period start.', example: '2026-06-01T10:00:00Z' },
  { key: FlagClaim.PeriodEnd, meaning: 'Flag period end.', example: '2026-07-01T10:00:00Z' },
];
