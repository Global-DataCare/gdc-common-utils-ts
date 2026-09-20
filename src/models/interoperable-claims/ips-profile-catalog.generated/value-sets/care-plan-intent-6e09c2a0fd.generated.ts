// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/care-plan-intent|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/care-plan-intent",
  "resolved": true,
  "version": "4.0.1",
  "name": "CarePlanIntent",
  "title": "Care Plan Intent",
  "status": "draft",
  "description": "Codes indicating the degree of authority/intentionality associated with a care plan.",
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/request-intent",
        "concept": [
          {
            "code": "proposal"
          },
          {
            "code": "plan"
          },
          {
            "code": "order"
          },
          {
            "code": "option"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "CarePlan",
      "profile": "http://hl7.org/fhir/StructureDefinition/CarePlan|4.0.1",
      "elementId": "CarePlan.intent",
      "path": "CarePlan.intent",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
