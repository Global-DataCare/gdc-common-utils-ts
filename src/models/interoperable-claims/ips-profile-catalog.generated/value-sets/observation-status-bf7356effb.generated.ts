// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/observation-status|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/observation-status",
  "resolved": true,
  "version": "4.0.1",
  "name": "ObservationStatus",
  "title": "ObservationStatus",
  "status": "active",
  "description": "Codes providing the status of an observation.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/observation-status"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-edd-uv-ips|2.0.1",
      "elementId": "Observation.status",
      "path": "Observation.status",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-outcome-uv-ips|2.0.1",
      "elementId": "Observation.status",
      "path": "Observation.status",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-status-uv-ips|2.0.1",
      "elementId": "Observation.status",
      "path": "Observation.status",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-alcoholuse-uv-ips|2.0.1",
      "elementId": "Observation.status",
      "path": "Observation.status",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-tobaccouse-uv-ips|2.0.1",
      "elementId": "Observation.status",
      "path": "Observation.status",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/resprate|4.0.1",
      "elementId": "Observation.status",
      "path": "Observation.status",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/heartrate|4.0.1",
      "elementId": "Observation.status",
      "path": "Observation.status",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/oxygensat|4.0.1",
      "elementId": "Observation.status",
      "path": "Observation.status",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodytemp|4.0.1",
      "elementId": "Observation.status",
      "path": "Observation.status",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyheight|4.0.1",
      "elementId": "Observation.status",
      "path": "Observation.status",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/headcircum|4.0.1",
      "elementId": "Observation.status",
      "path": "Observation.status",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyweight|4.0.1",
      "elementId": "Observation.status",
      "path": "Observation.status",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bmi|4.0.1",
      "elementId": "Observation.status",
      "path": "Observation.status",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bp|4.0.1",
      "elementId": "Observation.status",
      "path": "Observation.status",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
