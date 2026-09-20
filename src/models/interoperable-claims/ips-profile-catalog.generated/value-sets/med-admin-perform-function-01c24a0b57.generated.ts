// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/med-admin-perform-function",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/med-admin-perform-function",
  "resolved": true,
  "version": "4.0.1",
  "name": "MedicationAdministration Performer Function Codes",
  "title": "Medication administration  performer  function  codes",
  "status": "draft",
  "description": "MedicationAdministration Performer Function Codes",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/med-admin-perform-function"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationAdministration",
      "profile": "http://hl7.org/fhir/StructureDefinition/MedicationAdministration|4.0.1",
      "elementId": "MedicationAdministration.performer.function",
      "path": "MedicationAdministration.performer.function",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
