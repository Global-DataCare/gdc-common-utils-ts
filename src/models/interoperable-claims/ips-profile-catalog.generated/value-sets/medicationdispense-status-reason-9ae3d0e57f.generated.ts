// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/medicationdispense-status-reason",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/medicationdispense-status-reason",
  "resolved": true,
  "version": "4.0.1",
  "name": "MedicationDispense Status Reason Codes",
  "title": "Medication dispense  status  reason  codes",
  "status": "draft",
  "description": "MedicationDispense Status Codes",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/fhir/CodeSystem/medicationdispense-status-reason"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationDispense",
      "profile": "http://hl7.org/fhir/StructureDefinition/MedicationDispense|4.0.1",
      "elementId": "MedicationDispense.statusReason[x]",
      "path": "MedicationDispense.statusReason[x]",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
