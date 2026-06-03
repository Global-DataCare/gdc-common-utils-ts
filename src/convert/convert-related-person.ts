// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-related-person.ts

import { RelatedPersonClaim } from '../models/interoperable-claims/related-person-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceToValue } from './convert-shared';

export function relatedPersonFlatToFhirR4(claims: FlatClaims): FhirResource {
  return {
    resourceType: 'RelatedPerson',
    identifier: claims[RelatedPersonClaim.Identifier] ? [{ value: claims[RelatedPersonClaim.Identifier] }] : undefined,
    active: claims[RelatedPersonClaim.Active] === undefined ? undefined : claims[RelatedPersonClaim.Active] === 'true',
    patient: claims[RelatedPersonClaim.Patient] ? { reference: claims[RelatedPersonClaim.Patient] } : undefined,
    relationship: claims[RelatedPersonClaim.Relationship] ? [{ coding: codingFromValue(claims[RelatedPersonClaim.Relationship]) }] : undefined,
    name: claims[RelatedPersonClaim.Name] ? [{ text: claims[RelatedPersonClaim.Name] }] : undefined,
    telecom: claims[RelatedPersonClaim.Telecom] ? [{ value: claims[RelatedPersonClaim.Telecom] }] : undefined,
    gender: claims[RelatedPersonClaim.Gender],
    birthDate: claims[RelatedPersonClaim.BirthDate],
    address: claims[RelatedPersonClaim.Address] ? [{ text: claims[RelatedPersonClaim.Address] }] : undefined,
  };
}

export function relatedPersonFhirR4ToFlat(resource: FhirResource): FlatClaims {
  return {
    [RelatedPersonClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [RelatedPersonClaim.Active]: resource.active === undefined ? undefined : String(resource.active),
    [RelatedPersonClaim.Patient]: referenceToValue(resource.patient as { reference?: string } | undefined),
    [RelatedPersonClaim.Relationship]: codingToValue((resource.relationship as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [RelatedPersonClaim.Name]: (resource.name as Array<{ text?: string }> | undefined)?.[0]?.text,
    [RelatedPersonClaim.Telecom]: (resource.telecom as Array<{ value?: string }> | undefined)?.[0]?.value,
    [RelatedPersonClaim.Gender]: resource.gender as string | undefined,
    [RelatedPersonClaim.BirthDate]: resource.birthDate as string | undefined,
    [RelatedPersonClaim.Address]: (resource.address as Array<{ text?: string }> | undefined)?.[0]?.text,
  };
}
