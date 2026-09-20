// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/reaction-event-severity|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/reaction-event-severity",
  "resolved": true,
  "version": "4.0.1",
  "name": "AllergyIntoleranceSeverity",
  "title": "AllergyIntoleranceSeverity",
  "status": "draft",
  "description": "Clinical assessment of the severity of a reaction event as a whole, potentially considering multiple different manifestations.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/reaction-event-severity"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "AllergyIntolerance",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/AllergyIntolerance-uv-ips|2.0.1",
      "elementId": "AllergyIntolerance.reaction.severity",
      "path": "AllergyIntolerance.reaction.severity",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
