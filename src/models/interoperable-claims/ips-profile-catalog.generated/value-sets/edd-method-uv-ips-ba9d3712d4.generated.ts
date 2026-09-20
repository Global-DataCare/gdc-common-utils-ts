// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/edd-method-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/edd-method-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "PregnancyExpectedDeliveryDateMethodUvIps",
  "title": "Pregnancy Expected Delivery Date Method - IPS",
  "status": "active",
  "description": "IPS Expected Delivery Date Method",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://loinc.org",
        "concept": [
          {
            "code": "11778-8",
            "display": "Delivery date Estimated"
          },
          {
            "code": "11779-6",
            "display": "Delivery date Estimated from last menstrual period"
          },
          {
            "code": "11780-4",
            "display": "Delivery date Estimated from ovulation date"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-edd-uv-ips|2.0.1",
      "elementId": "Observation.code",
      "path": "Observation.code",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
