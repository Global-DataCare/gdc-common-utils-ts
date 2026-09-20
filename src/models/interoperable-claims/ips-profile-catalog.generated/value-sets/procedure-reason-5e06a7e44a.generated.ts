// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/procedure-reason|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/procedure-reason",
  "resolved": true,
  "version": "4.0.1",
  "name": "ProcedureReasonCodes",
  "title": "Procedure Reason Codes",
  "status": "draft",
  "description": "This example value set defines the set of codes that can be used to indicate a reason for a procedure.",
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "404684003"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "71388002"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "ImagingStudy",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/ImagingStudy-uv-ips|2.0.1",
      "elementId": "ImagingStudy.reasonCode",
      "path": "ImagingStudy.reasonCode",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
