// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/care-plan-activity-outcome",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/care-plan-activity-outcome",
  "resolved": true,
  "version": "4.0.1",
  "name": "CarePlanActivityOutcome",
  "title": "Care Plan Activity Outcome",
  "status": "draft",
  "description": "Example codes indicating the outcome of a care plan activity. Note that these are in no way complete and might not even be appropriate for some uses.",
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "397640006"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "CarePlan",
      "profile": "http://hl7.org/fhir/StructureDefinition/CarePlan|4.0.1",
      "elementId": "CarePlan.activity.outcomeCodeableConcept",
      "path": "CarePlan.activity.outcomeCodeableConcept",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
