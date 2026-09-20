// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/observation-category",
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
      "profile": "http://hl7.org/fhir/StructureDefinition/resprate|4.0.1",
      "elementId": "Observation.category",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/resprate|4.0.1",
      "elementId": "Observation.category:VSCat",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/heartrate|4.0.1",
      "elementId": "Observation.category",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/heartrate|4.0.1",
      "elementId": "Observation.category:VSCat",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/oxygensat|4.0.1",
      "elementId": "Observation.category",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/oxygensat|4.0.1",
      "elementId": "Observation.category:VSCat",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodytemp|4.0.1",
      "elementId": "Observation.category",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodytemp|4.0.1",
      "elementId": "Observation.category:VSCat",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyheight|4.0.1",
      "elementId": "Observation.category",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyheight|4.0.1",
      "elementId": "Observation.category:VSCat",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/headcircum|4.0.1",
      "elementId": "Observation.category",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/headcircum|4.0.1",
      "elementId": "Observation.category:VSCat",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyweight|4.0.1",
      "elementId": "Observation.category",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyweight|4.0.1",
      "elementId": "Observation.category:VSCat",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bmi|4.0.1",
      "elementId": "Observation.category",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bmi|4.0.1",
      "elementId": "Observation.category:VSCat",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bp|4.0.1",
      "elementId": "Observation.category",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bp|4.0.1",
      "elementId": "Observation.category:VSCat",
      "path": "Observation.category",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
