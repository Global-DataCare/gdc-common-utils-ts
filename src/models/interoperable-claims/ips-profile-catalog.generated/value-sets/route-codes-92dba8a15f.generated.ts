// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/route-codes",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/route-codes",
  "resolved": true,
  "version": "4.0.1",
  "name": "SNOMEDCTRouteCodes",
  "title": "SNOMED CT Route Codes",
  "status": "draft",
  "description": "This value set includes all Route codes from SNOMED CT - provided as an exemplar.",
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "284009009"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationAdministration",
      "profile": "http://hl7.org/fhir/StructureDefinition/MedicationAdministration|4.0.1",
      "elementId": "MedicationAdministration.dosage.route",
      "path": "MedicationAdministration.dosage.route",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
