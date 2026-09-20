// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/medicine-active-substances-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/medicine-active-substances-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "MedicineActiveSubstancesUvIps",
  "title": "Medicine Active Substances - IPS",
  "status": "active",
  "description": "IPS Medicine active substance codes value set.  This value set includes codes from SNOMED CT®: all descendants of 410942007 \\|Drug or medicament (substance)\\|\n\nSNOMED CT® ECL definition:\\\n< 410942007 \\|Drug or medicament (substance)\\|\\\n\nFuture implementations should consider ISO 11238 Health informatics -- Identification of medicinal products -- Data elements and structures for the unique identification and exchange of regulated information on substances.",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "descendent-of",
            "value": "410942007"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Medication",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Medication-uv-ips|2.0.1",
      "elementId": "Medication.ingredient.item[x]",
      "path": "Medication.ingredient.item[x]",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
