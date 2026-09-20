// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/event-status|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/event-status",
  "resolved": true,
  "version": "4.0.1",
  "name": "EventStatus",
  "title": "EventStatus",
  "status": "draft",
  "description": "Codes identifying the lifecycle stage of an event.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/event-status"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Procedure",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Procedure-uv-ips|2.0.1",
      "elementId": "Procedure.status",
      "path": "Procedure.status",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
