// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/problems-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/problems-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "ProblemsUvIps",
  "title": "Problems - IPS",
  "status": "active",
  "description": "IPS Problem (Condition) codes value set.  This value set includes codes from SNOMED CT®: all descendants of 404684003 \\|Clinical finding (finding)\\|; all descendants of 243796009 \\|Situation with explicit context (situation)\\|; all descendants of 272379006 \\|Event (event)\\|; all descendants or self of 160245001 \\|No current problems or disability (situation)\\|.  The descendants of 71388002 \\|Procedure (procedure)\\| (which were included in the CORE problem list) are not included, as they are expected to be represented separately in the History of Procedures Section.\n\nSNOMED CT® ECL definition:\\\n< 404684003 \\|Clinical finding (finding)\\| OR < 243796009 \\|Situation with explicit context (situation)\\| OR < 272379006 \\|Event (event)\\| OR \\<\\< 160245001 \\|No current problems or disability (situation)\\|",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "descendent-of",
            "value": "404684003"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "descendent-of",
            "value": "243796009"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "descendent-of",
            "value": "272379006"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "160245001"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Condition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Condition-uv-ips|2.0.1",
      "elementId": "Condition.code",
      "path": "Condition.code",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
