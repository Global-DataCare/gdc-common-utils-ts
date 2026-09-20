// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/clinical-findings",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/clinical-findings",
  "resolved": true,
  "version": "4.0.1",
  "name": "SNOMEDCTClinicalFindings",
  "title": "SNOMED CT Clinical Findings",
  "status": "draft",
  "description": "This value set includes all the \"Clinical finding\" [SNOMED CT](http://snomed.info/sct) codes - concepts where concept is-a 404684003 (Clinical finding (finding)).",
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "404684003"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "CarePlan",
      "profile": "http://hl7.org/fhir/StructureDefinition/CarePlan|4.0.1",
      "elementId": "CarePlan.activity.detail.reasonCode",
      "path": "CarePlan.activity.detail.reasonCode",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
