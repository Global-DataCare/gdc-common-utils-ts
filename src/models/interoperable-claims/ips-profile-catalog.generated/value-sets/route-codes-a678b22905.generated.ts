// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/route-codes|4.0.1",
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
      "resourceType": "MedicationRequest",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/MedicationRequest-uv-ips|2.0.1",
      "elementId": "MedicationRequest.dosageInstruction.route",
      "path": "MedicationRequest.dosageInstruction.route",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "MedicationStatement",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/MedicationStatement-uv-ips|2.0.1",
      "elementId": "MedicationStatement.dosage.route",
      "path": "MedicationStatement.dosage.route",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Immunization",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Immunization-uv-ips|2.0.1",
      "elementId": "Immunization.route",
      "path": "Immunization.route",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
