// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/vaccines-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/vaccines-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "VaccinesUvIps",
  "title": "Vaccines - IPS",
  "status": "active",
  "description": "IPS Vaccine codes value set.  This value set includes codes from SNOMED CT®: all descendants of 787859002 \\|Vaccine product (product)\\|; all descendants or self of 787482006 \\|No known immunizations (situation)\\|\n\nSNOMED CT® ECL definition:\\\n< 787859002 \\|Vaccine product (product)\\| OR \\<\\< 787482006 \\|No known immunizations (situation)\\|",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "descendent-of",
            "value": "787859002"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "787482006"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Immunization",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Immunization-uv-ips|2.0.1",
      "elementId": "Immunization.vaccineCode",
      "path": "Immunization.vaccineCode",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
