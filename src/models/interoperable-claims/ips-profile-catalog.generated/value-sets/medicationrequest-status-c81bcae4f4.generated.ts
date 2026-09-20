// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/medicationrequest-status|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/medicationrequest-status",
  "resolved": true,
  "version": "4.0.1",
  "name": "medicationrequest Status",
  "title": "Medicationrequest  status",
  "status": "draft",
  "description": "MedicationRequest Status Codes",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/CodeSystem/medicationrequest-status"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationRequest",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/MedicationRequest-uv-ips|2.0.1",
      "elementId": "MedicationRequest.status",
      "path": "MedicationRequest.status",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
