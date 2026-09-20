// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/allergies-intolerances-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/allergies-intolerances-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "AllergiesIntolerancesUvIps",
  "title": "Allergies & Intolerances - IPS",
  "status": "active",
  "description": "IPS allergy and intolerance codes value set. This value set includes codes from SNOMED CT®: all descendants of 373873005 \\|Pharmaceutical / biologic product (product)\\|; all descendants of 105590001 \\|Substance (substance)\\|; all descendants of 420134006 \\|Propensity to adverse reaction (finding)\\|; all descendants or self of 716186003 \\|No known allergy (situation)\\|\n\nSNOMED CT® ECL definition:\\\n< 373873005 \\|Pharmaceutical / biologic product (product)\\| OR < 105590001 \\|Substance (substance)\\| OR < 420134006 \\|Propensity to adverse reaction (finding)\\| OR \\<\\< 716186003 \\|No known allergy (situation)\\|",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "descendent-of",
            "value": "105590001"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "descendent-of",
            "value": "373873005"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "descendent-of",
            "value": "420134006"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "716186003"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "AllergyIntolerance",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/AllergyIntolerance-uv-ips|2.0.1",
      "elementId": "AllergyIntolerance.code",
      "path": "AllergyIntolerance.code",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
