// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/pregnancy-status-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/pregnancy-status-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "PregnancyStatusUvIps",
  "title": "Pregnancy Status - IPS",
  "status": "active",
  "description": "IPS pregnancy status codes value set.  This value set includes codes from SNOMED CT®: 77386006 \\|Pregnant\\|; 60001007 \\|Not pregnant\\|; 152231000119106 \\|Pregnancy not yet confirmed\\|; 146799005 \\|Possible pregnancy\\|\n\nSNOMED CT® ECL definition:\\\n77386006 \\|Pregnant\\| OR 60001007 \\|Not pregnant\\| OR 152231000119106 \\|Pregnancy not yet confirmed\\| OR 146799005 \\|Possible pregnancy\\|",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "concept": [
          {
            "code": "77386006",
            "display": "Pregnant"
          },
          {
            "code": "60001007",
            "display": "Not pregnant"
          },
          {
            "code": "152231000119106",
            "display": "Pregnancy not yet confirmed"
          },
          {
            "code": "146799005",
            "display": "Possible pregnancy"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-status-uv-ips|2.0.1",
      "elementId": "Observation.value[x]:valueCodeableConcept",
      "path": "Observation.value[x]",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
