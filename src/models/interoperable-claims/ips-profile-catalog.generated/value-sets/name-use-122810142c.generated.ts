// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/name-use|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/name-use",
  "resolved": true,
  "version": "4.0.1",
  "name": "NameUse",
  "title": "NameUse",
  "status": "active",
  "description": "The use of a human name.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/name-use"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Patient",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1",
      "elementId": "Patient.name.use",
      "path": "Patient.name.use",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
