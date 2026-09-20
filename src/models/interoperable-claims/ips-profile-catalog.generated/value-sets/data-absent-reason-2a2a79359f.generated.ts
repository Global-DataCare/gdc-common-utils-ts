// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/data-absent-reason",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/data-absent-reason",
  "resolved": true,
  "version": "4.0.1",
  "name": "DataAbsentReason",
  "title": "DataAbsentReason",
  "status": "active",
  "description": "Used to specify why the normally expected content of the data element is missing.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/data-absent-reason"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/resprate|4.0.1",
      "elementId": "Observation.dataAbsentReason",
      "path": "Observation.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/resprate|4.0.1",
      "elementId": "Observation.component.dataAbsentReason",
      "path": "Observation.component.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/heartrate|4.0.1",
      "elementId": "Observation.dataAbsentReason",
      "path": "Observation.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/heartrate|4.0.1",
      "elementId": "Observation.component.dataAbsentReason",
      "path": "Observation.component.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/oxygensat|4.0.1",
      "elementId": "Observation.dataAbsentReason",
      "path": "Observation.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/oxygensat|4.0.1",
      "elementId": "Observation.component.dataAbsentReason",
      "path": "Observation.component.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodytemp|4.0.1",
      "elementId": "Observation.dataAbsentReason",
      "path": "Observation.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodytemp|4.0.1",
      "elementId": "Observation.component.dataAbsentReason",
      "path": "Observation.component.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyheight|4.0.1",
      "elementId": "Observation.dataAbsentReason",
      "path": "Observation.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyheight|4.0.1",
      "elementId": "Observation.component.dataAbsentReason",
      "path": "Observation.component.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/headcircum|4.0.1",
      "elementId": "Observation.dataAbsentReason",
      "path": "Observation.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/headcircum|4.0.1",
      "elementId": "Observation.component.dataAbsentReason",
      "path": "Observation.component.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyweight|4.0.1",
      "elementId": "Observation.dataAbsentReason",
      "path": "Observation.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyweight|4.0.1",
      "elementId": "Observation.component.dataAbsentReason",
      "path": "Observation.component.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bmi|4.0.1",
      "elementId": "Observation.dataAbsentReason",
      "path": "Observation.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bmi|4.0.1",
      "elementId": "Observation.component.dataAbsentReason",
      "path": "Observation.component.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bp|4.0.1",
      "elementId": "Observation.dataAbsentReason",
      "path": "Observation.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bp|4.0.1",
      "elementId": "Observation.component.dataAbsentReason",
      "path": "Observation.component.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bp|4.0.1",
      "elementId": "Observation.component:SystolicBP.dataAbsentReason",
      "path": "Observation.component.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bp|4.0.1",
      "elementId": "Observation.component:DiastolicBP.dataAbsentReason",
      "path": "Observation.component.dataAbsentReason",
      "purpose": "primary",
      "strength": "extensible"
    }
  ]
} as const satisfies IpsValueSetDefinition;
