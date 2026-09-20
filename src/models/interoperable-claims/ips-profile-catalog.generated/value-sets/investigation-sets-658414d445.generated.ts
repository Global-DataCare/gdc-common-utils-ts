// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/investigation-sets",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/investigation-sets",
  "resolved": true,
  "version": "4.0.1",
  "name": "InvestigationType",
  "title": "Investigation Type",
  "status": "draft",
  "description": "Example value set for investigation type.",
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "concept": [
          {
            "code": "271336007",
            "display": "Examination / signs"
          },
          {
            "code": "160237006",
            "display": "History/symptoms"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "ClinicalImpression",
      "profile": "http://hl7.org/fhir/StructureDefinition/ClinicalImpression|4.0.1",
      "elementId": "ClinicalImpression.investigation.code",
      "path": "ClinicalImpression.investigation.code",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
