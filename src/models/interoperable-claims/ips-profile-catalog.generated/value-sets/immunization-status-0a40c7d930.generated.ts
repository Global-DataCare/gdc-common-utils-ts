// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/immunization-status|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/immunization-status",
  "resolved": true,
  "version": "4.0.1",
  "name": "ImmunizationStatusCodes",
  "title": "Immunization Status Codes",
  "status": "draft",
  "description": "The value set to instantiate this attribute should be drawn from a terminologically robust code system that consists of or contains concepts to support describing the current status of the administered dose of vaccine.",
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/event-status",
        "concept": [
          {
            "code": "completed"
          },
          {
            "code": "entered-in-error"
          },
          {
            "code": "not-done"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Immunization",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Immunization-uv-ips|2.0.1",
      "elementId": "Immunization.status",
      "path": "Immunization.status",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
