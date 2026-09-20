// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/clinicalimpression-status|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/clinicalimpression-status",
  "resolved": true,
  "version": "4.0.1",
  "name": "ClinicalImpressionStatus",
  "title": "Clinical Impression Status",
  "status": "draft",
  "description": "Codes that reflect the current state of a clinical impression within its overall lifecycle.",
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/event-status",
        "concept": [
          {
            "code": "in-progress"
          },
          {
            "code": "completed"
          },
          {
            "code": "entered-in-error"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "ClinicalImpression",
      "profile": "http://hl7.org/fhir/StructureDefinition/ClinicalImpression|4.0.1",
      "elementId": "ClinicalImpression.status",
      "path": "ClinicalImpression.status",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
