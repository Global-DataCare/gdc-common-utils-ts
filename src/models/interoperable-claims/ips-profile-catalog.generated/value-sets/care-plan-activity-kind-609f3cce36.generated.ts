// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/care-plan-activity-kind|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/care-plan-activity-kind",
  "resolved": true,
  "version": "4.0.1",
  "name": "CarePlanActivityKind",
  "title": "Care Plan Activity Kind",
  "status": "draft",
  "description": "Resource types defined as part of FHIR that can be represented as in-line definitions of a care plan activity.",
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/resource-types",
        "concept": [
          {
            "code": "Appointment"
          },
          {
            "code": "CommunicationRequest"
          },
          {
            "code": "DeviceRequest"
          },
          {
            "code": "MedicationRequest"
          },
          {
            "code": "NutritionOrder"
          },
          {
            "code": "Task"
          },
          {
            "code": "ServiceRequest"
          },
          {
            "code": "VisionPrescription"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "CarePlan",
      "profile": "http://hl7.org/fhir/StructureDefinition/CarePlan|4.0.1",
      "elementId": "CarePlan.activity.detail.kind",
      "path": "CarePlan.activity.detail.kind",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
