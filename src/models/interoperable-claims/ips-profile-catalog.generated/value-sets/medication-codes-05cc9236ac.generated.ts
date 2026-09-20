// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/medication-codes",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/medication-codes",
  "resolved": true,
  "version": "4.0.1",
  "name": "SNOMEDCTMedicationCodes",
  "title": "SNOMED CT Medication Codes",
  "status": "draft",
  "description": "This value set includes all drug or medicament substance codes and all pharmaceutical/biologic products from SNOMED CT - provided as an exemplar value set.",
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "410942007"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "373873005"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "106181007"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "CarePlan",
      "profile": "http://hl7.org/fhir/StructureDefinition/CarePlan|4.0.1",
      "elementId": "CarePlan.activity.detail.product[x]",
      "path": "CarePlan.activity.detail.product[x]",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "MedicationAdministration",
      "profile": "http://hl7.org/fhir/StructureDefinition/MedicationAdministration|4.0.1",
      "elementId": "MedicationAdministration.medication[x]",
      "path": "MedicationAdministration.medication[x]",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "MedicationDispense",
      "profile": "http://hl7.org/fhir/StructureDefinition/MedicationDispense|4.0.1",
      "elementId": "MedicationDispense.medication[x]",
      "path": "MedicationDispense.medication[x]",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
