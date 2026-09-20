// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/ucum-bodylength|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/ucum-bodylength",
  "resolved": true,
  "version": "4.0.1",
  "name": "BodyLengthUnits",
  "title": "Body Length Units",
  "status": "draft",
  "description": "UCUM units for recording body length measures such as height and head circumference",
  "compose": {
    "include": [
      {
        "system": "http://unitsofmeasure.org",
        "concept": [
          {
            "code": "cm"
          },
          {
            "code": "[in_i]"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyheight|4.0.1",
      "elementId": "Observation.value[x]:valueQuantity.code",
      "path": "Observation.value[x].code",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/headcircum|4.0.1",
      "elementId": "Observation.value[x]:valueQuantity.code",
      "path": "Observation.value[x].code",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
