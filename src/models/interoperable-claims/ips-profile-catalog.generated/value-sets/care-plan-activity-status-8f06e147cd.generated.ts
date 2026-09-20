// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/care-plan-activity-status|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/care-plan-activity-status",
  "resolved": true,
  "version": "4.0.1",
  "name": "CarePlanActivityStatus",
  "title": "CarePlanActivityStatus",
  "status": "draft",
  "description": "Codes that reflect the current state of a care plan activity within its overall life cycle.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/care-plan-activity-status"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "CarePlan",
      "profile": "http://hl7.org/fhir/StructureDefinition/CarePlan|4.0.1",
      "elementId": "CarePlan.activity.detail.status",
      "path": "CarePlan.activity.detail.status",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
