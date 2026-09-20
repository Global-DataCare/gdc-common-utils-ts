// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/observation-methods|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/observation-methods",
  "resolved": true,
  "version": "4.0.1",
  "name": "ObservationMethods",
  "title": "Observation Methods",
  "status": "draft",
  "description": "Observation Method codes from [SNOMED CT](http://snomed.info/sct) where concept is-a 272394005 (Technique (qualifier value)) or is-a 129264002 (Action (qualifier value)) or is-a 386053000 (Evaluation procedure(procedure))",
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "272394005"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "129264002"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "386053000"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-edd-uv-ips|2.0.1",
      "elementId": "Observation.method",
      "path": "Observation.method",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
