// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/medication-statement-status|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/medication-statement-status",
  "resolved": true,
  "version": "4.0.1",
  "name": "Medication Status Codes",
  "title": "Medication  status  codes",
  "status": "draft",
  "description": "Medication Status Codes",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/CodeSystem/medication-statement-status"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationStatement",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/MedicationStatement-uv-ips|2.0.1",
      "elementId": "MedicationStatement.status",
      "path": "MedicationStatement.status",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
