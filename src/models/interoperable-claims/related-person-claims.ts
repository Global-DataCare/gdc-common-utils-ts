// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/related-person-claims.ts

import type { ClaimSpec } from './types';

export const RelatedPersonClaim = {
  Identifier: 'RelatedPerson.identifier',
  Active: 'RelatedPerson.active',
  Patient: 'RelatedPerson.patient',
  Relationship: 'RelatedPerson.relationship',
  Name: 'RelatedPerson.name',
  Telecom: 'RelatedPerson.telecom',
  Gender: 'RelatedPerson.gender',
  BirthDate: 'RelatedPerson.birthdate',
  Address: 'RelatedPerson.address',
} as const;

export type RelatedPersonClaimKey = typeof RelatedPersonClaim[keyof typeof RelatedPersonClaim];

export const RelatedPersonClaimSpecs: ClaimSpec[] = [
  { key: RelatedPersonClaim.Identifier, meaning: 'Business identifier.', example: 'rel-001' },
  { key: RelatedPersonClaim.Active, meaning: 'Active flag.', example: 'true' },
  { key: RelatedPersonClaim.Patient, meaning: 'Linked patient reference.', example: 'did:web:patient.example.org' },
  { key: RelatedPersonClaim.Relationship, meaning: 'Relationship token.', example: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode|MTH' },
  { key: RelatedPersonClaim.Name, meaning: 'Display name.', example: 'Jane Doe' },
  { key: RelatedPersonClaim.Telecom, meaning: 'Contact value.', example: 'mailto:jane@example.org' },
  { key: RelatedPersonClaim.Gender, meaning: 'Administrative gender.', example: 'female' },
  { key: RelatedPersonClaim.BirthDate, meaning: 'Birth date.', example: '1980-02-01' },
  { key: RelatedPersonClaim.Address, meaning: 'Display address.', example: '123 Main St, Vancouver' },
];
