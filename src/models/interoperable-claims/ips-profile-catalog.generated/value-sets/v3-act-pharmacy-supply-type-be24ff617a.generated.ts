// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://terminology.hl7.org/ValueSet/v3-ActPharmacySupplyType",
  "canonicalUrl": "http://terminology.hl7.org/ValueSet/v3-ActPharmacySupplyType",
  "resolved": true,
  "version": "2014-03-26",
  "name": "v3.ActPharmacySupplyType",
  "title": "V3 Value SetActPharmacySupplyType",
  "status": "active",
  "description": " Identifies types of dispensing events",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "_ActPharmacySupplyType"
          }
        ]
      }
    ],
    "exclude": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        "concept": [
          {
            "code": "_ActPharmacySupplyType"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationDispense",
      "profile": "http://hl7.org/fhir/StructureDefinition/MedicationDispense|4.0.1",
      "elementId": "MedicationDispense.type",
      "path": "MedicationDispense.type",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
