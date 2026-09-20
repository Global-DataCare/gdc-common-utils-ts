// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/medicationdispense-status|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/medicationdispense-status",
  "resolved": true,
  "version": "4.0.1",
  "name": "MedicationDispense Status Codes",
  "title": "Medication dispense  status  codes",
  "status": "draft",
  "description": "MedicationDispense Status Codes",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/medicationdispense-status"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationDispense",
      "profile": "http://hl7.org/fhir/StructureDefinition/MedicationDispense|4.0.1",
      "elementId": "MedicationDispense.status",
      "path": "MedicationDispense.status",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
