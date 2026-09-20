// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/observation-category|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/observation-category",
  "resolved": true,
  "version": "4.0.1",
  "name": "ObservationCategoryCodes",
  "title": "Observation Category Codes",
  "status": "draft",
  "description": "Observation Category codes.",
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/observation-category"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-laboratory-pathology-uv-ips|2.0.1",
      "elementId": "Observation.category",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-laboratory-pathology-uv-ips|2.0.1",
      "elementId": "Observation.category:laboratory",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-radiology-uv-ips|2.0.1",
      "elementId": "Observation.category",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-radiology-uv-ips|2.0.1",
      "elementId": "Observation.category:radiology",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
