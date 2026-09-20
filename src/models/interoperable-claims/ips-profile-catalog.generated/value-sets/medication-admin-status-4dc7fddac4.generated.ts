// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/medication-admin-status|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/medication-admin-status",
  "resolved": true,
  "version": "4.0.1",
  "name": "MedicationAdministration Status Codes",
  "title": "Medication administration  status  codes",
  "status": "draft",
  "description": "MedicationAdministration Status Codes",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/medication-admin-status"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationAdministration",
      "profile": "http://hl7.org/fhir/StructureDefinition/MedicationAdministration|4.0.1",
      "elementId": "MedicationAdministration.status",
      "path": "MedicationAdministration.status",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
