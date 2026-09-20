// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/medicationrequest-intent|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/medicationrequest-intent",
  "resolved": true,
  "version": "4.0.1",
  "name": "medicationRequest Intent",
  "title": "Medication request  intent",
  "status": "draft",
  "description": "MedicationRequest Intent Codes",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/CodeSystem/medicationrequest-intent"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationRequest",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/MedicationRequest-uv-ips|2.0.1",
      "elementId": "MedicationRequest.intent",
      "path": "MedicationRequest.intent",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
