// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/medicationdispense-category",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/medicationdispense-category",
  "resolved": true,
  "version": "4.0.1",
  "name": "MedicationDispense Category Codes",
  "title": "Medication dispense  category  codes",
  "status": "draft",
  "description": "MedicationDispense Category Codes",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/fhir/CodeSystem/medicationdispense-category"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationDispense",
      "profile": "http://hl7.org/fhir/StructureDefinition/MedicationDispense|4.0.1",
      "elementId": "MedicationDispense.category",
      "path": "MedicationDispense.category",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
