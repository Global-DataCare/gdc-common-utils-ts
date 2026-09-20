// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/reason-medication-not-given-codes",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/reason-medication-not-given-codes",
  "resolved": true,
  "version": "4.0.1",
  "name": "SNOMEDCTReasonMedicationNotGivenCodes",
  "title": "SNOMED CT Reason Medication Not Given Codes",
  "status": "draft",
  "description": "This value set includes all medication refused, medication not administered, and non-administration of necessary drug or medicine codes from SNOMED CT - provided as an exemplar value set.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "242990004"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "182895007"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationAdministration",
      "profile": "http://hl7.org/fhir/StructureDefinition/MedicationAdministration|4.0.1",
      "elementId": "MedicationAdministration.statusReason",
      "path": "MedicationAdministration.statusReason",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
