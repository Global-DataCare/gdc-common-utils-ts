// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/related-person-claims.ts

import type { ClaimSpec } from './types';

export const RelatedPersonClaim = {
  /** @deprecated Prefer `RelatedPerson.identifier.value` for canonical exactness. */
  Identifier: 'RelatedPerson.identifier',
  IdentifierValue: 'RelatedPerson.identifier.value',
  Active: 'RelatedPerson.active',
  Patient: 'RelatedPerson.patient',
  Relationship: 'RelatedPerson.relationship',
  /**
   * GDC flat-claim extension for comma-separated functional HL7 role codes.
   * FHIR R4 RelatedPerson has no native `role` property; relationship/kinship
   * remains in `RelatedPerson.relationship`.
   */
  Role: 'RelatedPerson.role',
  Name: 'RelatedPerson.name',
  Telecom: 'RelatedPerson.telecom',
  Gender: 'RelatedPerson.gender',
  BirthDate: 'RelatedPerson.birthdate',
  Address: 'RelatedPerson.address',
  /** Logical kind used when a RelatedPerson record acts as a related entity. */
  RelatedEntityType: 'RelatedPerson.related-entity-type',
  /**
   * Original public values used to calculate the Consent rule/asset id.
   * These values must not be replaced by the opaque RelatedPerson resource id.
   */
  ActorIdentifier: 'RelatedPerson.actor-identifier',
} as const;

export type RelatedPersonClaimKey = typeof RelatedPersonClaim[keyof typeof RelatedPersonClaim];

export const RelatedPersonClaimSpecs: ClaimSpec[] = [
  { key: RelatedPersonClaim.IdentifierValue, meaning: 'Business identifier value.', example: 'rel-001' },
  { key: RelatedPersonClaim.Identifier, meaning: 'Legacy business identifier alias.', example: 'rel-001' },
  { key: RelatedPersonClaim.Active, meaning: 'Active flag.', example: 'true' },
  { key: RelatedPersonClaim.Patient, meaning: 'Linked patient reference.', example: 'did:web:patient.example.org' },
  { key: RelatedPersonClaim.Relationship, meaning: 'Relationship token.', example: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode|MTH' },
  { key: RelatedPersonClaim.Role, meaning: 'Comma-separated functional HL7 role values; this is a GDC flat-claim extension, not a native FHIR R4 RelatedPerson property. Known codes resolve to their canonical RoleClass or RoleCode system.', example: 'CAREGIVER,ECON,BILL' },
  { key: RelatedPersonClaim.Name, meaning: 'Display name.', example: 'Jane Doe' },
  { key: RelatedPersonClaim.Telecom, meaning: 'Contact value.', example: 'mailto:jane@example.org' },
  { key: RelatedPersonClaim.Gender, meaning: 'Administrative gender.', example: 'female' },
  { key: RelatedPersonClaim.BirthDate, meaning: 'Birth date.', example: '1980-02-01' },
  { key: RelatedPersonClaim.Address, meaning: 'Display address.', example: '123 Main St, Vancouver' },
  { key: RelatedPersonClaim.RelatedEntityType, meaning: 'Logical related-entity kind.', example: 'country-set' },
  { key: RelatedPersonClaim.ActorIdentifier, meaning: 'Original public Consent actor identifiers as CSV.', example: 'ES,PT' },
];
