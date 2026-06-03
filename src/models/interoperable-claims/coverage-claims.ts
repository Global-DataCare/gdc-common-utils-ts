// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/coverage-claims.ts

import type { ClaimSpec } from './types';

export const CoverageClaim = {
  Identifier: 'Coverage.identifier',
  Status: 'Coverage.status',
  Type: 'Coverage.type',
  PolicyHolder: 'Coverage.policy-holder',
  Subscriber: 'Coverage.subscriber',
  Beneficiary: 'Coverage.beneficiary',
  Relationship: 'Coverage.relationship',
  PeriodStart: 'Coverage.period-start',
  PeriodEnd: 'Coverage.period-end',
  Payor: 'Coverage.payor',
  Class: 'Coverage.class',
} as const;

export type CoverageClaimKey = typeof CoverageClaim[keyof typeof CoverageClaim];

export const CoverageClaimSpecs: ClaimSpec[] = [
  { key: CoverageClaim.Identifier, meaning: 'Business identifier.', example: 'cov-001' },
  { key: CoverageClaim.Status, meaning: 'Coverage status.', example: 'active' },
  { key: CoverageClaim.Type, meaning: 'Coverage type token.', example: 'http://terminology.hl7.org/CodeSystem/v3-ActCode|EHCPOL' },
  { key: CoverageClaim.PolicyHolder, meaning: 'Policy holder reference.', example: 'RelatedPerson/rel-1' },
  { key: CoverageClaim.Subscriber, meaning: 'Subscriber reference.', example: 'RelatedPerson/rel-1' },
  { key: CoverageClaim.Beneficiary, meaning: 'Beneficiary reference.', example: 'did:web:patient.example.org' },
  { key: CoverageClaim.Relationship, meaning: 'Relationship token.', example: 'http://terminology.hl7.org/CodeSystem/subscriber-relationship|self' },
  { key: CoverageClaim.PeriodStart, meaning: 'Coverage start.', example: '2026-01-01' },
  { key: CoverageClaim.PeriodEnd, meaning: 'Coverage end.', example: '2026-12-31' },
  { key: CoverageClaim.Payor, meaning: 'Payor references (CSV).', example: 'Organization/payer-1' },
  { key: CoverageClaim.Class, meaning: 'Coverage class values (CSV).', example: 'group|G-001,plan|P-001' },
];
