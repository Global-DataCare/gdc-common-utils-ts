// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/medication-admin-category",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/medication-admin-category",
  "resolved": true,
  "version": "4.0.1",
  "name": "MedicationAdministration Category Codes",
  "title": "Medication administration  category  codes",
  "status": "draft",
  "description": "MedicationAdministration Category Codes",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/medication-admin-category"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationAdministration",
      "profile": "http://hl7.org/fhir/StructureDefinition/MedicationAdministration|4.0.1",
      "elementId": "MedicationAdministration.category",
      "path": "MedicationAdministration.category",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
