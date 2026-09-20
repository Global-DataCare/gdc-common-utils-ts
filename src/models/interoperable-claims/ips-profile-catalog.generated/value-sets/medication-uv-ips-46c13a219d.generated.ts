// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/medication-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/medication-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "MedicationsUvIps",
  "title": "Medications - IPS",
  "status": "active",
  "description": "IPS Medication codes value set.  This value set includes codes from SNOMED CT®: all descendants of 763158003 \\|Medicinal product (product)\\|; excluding the descendants or self of 787859002 \\|Vaccine product (medicinal product)\\|; including all descendants or self of 787481004 \\|No known medications (situation)\\|\n\nSNOMED CT® ECL definition:\\\n(< 763158003 \\|Medicinal product (product)\\| MINUS \\<\\< 787859002 \\|Vaccine product (medicinal product)\\|) OR \\<\\< 787481004 \\|No known medications (situation)\\|",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "descendent-of",
            "value": "763158003"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "787481004"
          }
        ]
      }
    ],
    "exclude": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "787859002"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationRequest",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/MedicationRequest-uv-ips|2.0.1",
      "elementId": "MedicationRequest.medication[x]",
      "path": "MedicationRequest.medication[x]",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "MedicationStatement",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/MedicationStatement-uv-ips|2.0.1",
      "elementId": "MedicationStatement.medication[x]",
      "path": "MedicationStatement.medication[x]",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Medication",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Medication-uv-ips|2.0.1",
      "elementId": "Medication.code",
      "path": "Medication.code",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
