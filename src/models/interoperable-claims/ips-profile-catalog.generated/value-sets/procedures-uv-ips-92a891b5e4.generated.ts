// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/procedures-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/procedures-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "ProceduresUvIps",
  "title": "Procedures - IPS",
  "status": "active",
  "description": "IPS Procedure codes value set.  This value set includes codes from SNOMED CT®: all descendants of 71388002 \\|Procedure (procedure)\\|; excluding [all descendants or self of 14734007 \\|Administrative procedure (procedure)\\|; all descendants or self of 59524001 \\|Blood bank procedure (procedure)\\|; all descendants or self of 389067005 \\|Community health procedure (procedure)\\|; all descendants or self of 442006003 \\|Determination of information related to transfusion (procedure)\\|; all descendants or self of 225288009 \\|Environmental care procedure (procedure)\\|; all descendants or self of 308335008 \\|Patient encounter procedure (procedure)\\|; all descendants or self of 710135002 \\|Promotion (procedure)\\|; all descendants or self of 389084004 \\|Staff related procedure (procedure)\\|]; including all descendants or self of 787480003 \\|No known procedures (situation)\\|\n\nSNOMED CT® ECL definition:\\\n(< 71388002 \\|Procedure (procedure)\\| MINUS (\\<\\< 14734007 \\|Administrative procedure (procedure)\\| OR \\<\\< 59524001 \\|Blood bank procedure (procedure)\\| OR \\<\\< 389067005 \\|Community health procedure (procedure)\\| OR \\<\\< 442006003 \\|Determination of information related to transfusion (procedure)\\| OR \\<\\< 225288009 \\|Environmental care procedure (procedure)\\| OR \\<\\< 308335008 \\|Patient encounter procedure (procedure)\\| OR \\<\\< 710135002 \\|Promotion (procedure)\\| OR \\<\\< 389084004 \\|Staff related procedure (procedure)\\|)) OR << 787480003 \\|No known procedures (situation)\\|",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "descendent-of",
            "value": "71388002"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "787480003"
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
            "value": "14734007"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "59524001"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "389067005"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "442006003"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "225288009"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "308335008"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "710135002"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "389084004"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Procedure",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Procedure-uv-ips|2.0.1",
      "elementId": "Procedure.code",
      "path": "Procedure.code",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
