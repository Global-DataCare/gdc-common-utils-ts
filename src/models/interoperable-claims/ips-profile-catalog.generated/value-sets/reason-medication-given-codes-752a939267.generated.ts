// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/reason-medication-given-codes",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/reason-medication-given-codes",
  "resolved": true,
  "version": "4.0.1",
  "name": "ReasonMedicationGivenCodes",
  "title": "Reason Medication Given Codes",
  "status": "draft",
  "description": "This value set is provided as an example. The value set to instantiate this attribute should be drawn from a robust terminology code system that consists of or contains concepts to support the medication process.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/reason-medication-given"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationAdministration",
      "profile": "http://hl7.org/fhir/StructureDefinition/MedicationAdministration|4.0.1",
      "elementId": "MedicationAdministration.reasonCode",
      "path": "MedicationAdministration.reasonCode",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
