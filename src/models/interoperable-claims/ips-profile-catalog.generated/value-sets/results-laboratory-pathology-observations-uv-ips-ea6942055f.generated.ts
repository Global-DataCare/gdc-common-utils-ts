// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/results-laboratory-pathology-observations-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/results-laboratory-pathology-observations-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "ResultsLaboratoryPathologyObservationUvIps",
  "title": "Results Laboratory/Pathology Observation - IPS",
  "status": "active",
  "description": "Value Set Definition: LOINC {STATUS in {ACTIVE}, CLASSTYPE in {Laboratory class (1)}, CLASS exclude {LP62148-9 (NR STATS), LP175679-2 (H&P.HX.LAB), LP7785-1 (CHALSKIN), LP94892-4 (LABORDERS)}}",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://loinc.org",
        "filter": [
          {
            "property": "STATUS",
            "op": "=",
            "value": "ACTIVE"
          },
          {
            "property": "CLASSTYPE",
            "op": "=",
            "value": "1"
          }
        ]
      }
    ],
    "exclude": [
      {
        "system": "http://loinc.org",
        "filter": [
          {
            "property": "CLASS",
            "op": "=",
            "value": "LP62148-9"
          }
        ]
      },
      {
        "system": "http://loinc.org",
        "filter": [
          {
            "property": "CLASS",
            "op": "=",
            "value": "LP175679-2"
          }
        ]
      },
      {
        "system": "http://loinc.org",
        "filter": [
          {
            "property": "CLASS",
            "op": "=",
            "value": "LP7785-1"
          }
        ]
      },
      {
        "system": "http://loinc.org",
        "filter": [
          {
            "property": "CLASS",
            "op": "=",
            "value": "LP94892-4"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-laboratory-pathology-uv-ips|2.0.1",
      "elementId": "Observation.code",
      "path": "Observation.code",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
