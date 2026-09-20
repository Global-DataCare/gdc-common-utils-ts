// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/administrative-gender|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/administrative-gender",
  "resolved": true,
  "version": "4.0.1",
  "name": "AdministrativeGender",
  "title": "AdministrativeGender",
  "status": "active",
  "description": "The gender of a person used for administrative purposes.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/administrative-gender"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Patient",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1",
      "elementId": "Patient.gender",
      "path": "Patient.gender",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "RelatedPerson",
      "profile": "http://hl7.org/fhir/StructureDefinition/RelatedPerson|4.0.1",
      "elementId": "RelatedPerson.gender",
      "path": "RelatedPerson.gender",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
