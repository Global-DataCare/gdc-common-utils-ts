// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/medication-form-codes|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/medication-form-codes",
  "resolved": true,
  "version": "4.0.1",
  "name": "SNOMEDCTFormCodes",
  "title": "SNOMED CT Form Codes",
  "status": "draft",
  "description": "This value set includes all dose form codes from SNOMED CT - provided as an exemplar.",
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "421967003"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Medication",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Medication-uv-ips|2.0.1",
      "elementId": "Medication.form",
      "path": "Medication.form",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
