// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://terminology.hl7.org/ValueSet/v3-ActSubstanceAdminSubstitutionCode",
  "canonicalUrl": "http://terminology.hl7.org/ValueSet/v3-ActSubstanceAdminSubstitutionCode",
  "resolved": true,
  "version": "2014-03-26",
  "name": "v3.ActSubstanceAdminSubstitutionCode",
  "title": "V3 Value SetActSubstanceAdminSubstitutionCode",
  "status": "active",
  "description": "No Description Provided",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-substanceAdminSubstitution",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "_ActSubstanceAdminSubstitutionCode"
          }
        ]
      }
    ],
    "exclude": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-substanceAdminSubstitution",
        "concept": [
          {
            "code": "_ActSubstanceAdminSubstitutionCode"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationDispense",
      "profile": "http://hl7.org/fhir/StructureDefinition/MedicationDispense|4.0.1",
      "elementId": "MedicationDispense.substitution.type",
      "path": "MedicationDispense.substitution.type",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
