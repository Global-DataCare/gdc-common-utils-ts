// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
  "resolved": true,
  "version": "4.0.1",
  "name": "VitalSigns",
  "title": "Vital Signs",
  "status": "active",
  "description": "This value set indicates the allowed vital sign result types.   The LOINC code for Vitals Signs panel (85353-1) is a grouping structure for a set of vital signs and includes related links (with type=has-member) to the Observations in this set (e.g. respiratory rate, heart rate, BP).  The Blood pressure panel (85354-9) is used to group the component observations Systolic blood pressure (8480-6) and Diastolic blood pressure (8462-4).",
  "compose": {
    "include": [
      {
        "system": "http://loinc.org",
        "concept": [
          {
            "code": "85353-1"
          },
          {
            "code": "9279-1"
          },
          {
            "code": "8867-4"
          },
          {
            "code": "2708-6"
          },
          {
            "code": "8310-5"
          },
          {
            "code": "8302-2"
          },
          {
            "code": "9843-4"
          },
          {
            "code": "29463-7"
          },
          {
            "code": "39156-5"
          },
          {
            "code": "85354-9"
          },
          {
            "code": "8480-6"
          },
          {
            "code": "8462-4"
          },
          {
            "code": "8478-0"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/resprate|4.0.1",
      "elementId": "Observation.code",
      "path": "Observation.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/resprate|4.0.1",
      "elementId": "Observation.component.code",
      "path": "Observation.component.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/heartrate|4.0.1",
      "elementId": "Observation.code",
      "path": "Observation.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/heartrate|4.0.1",
      "elementId": "Observation.component.code",
      "path": "Observation.component.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/oxygensat|4.0.1",
      "elementId": "Observation.code",
      "path": "Observation.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/oxygensat|4.0.1",
      "elementId": "Observation.component.code",
      "path": "Observation.component.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodytemp|4.0.1",
      "elementId": "Observation.code",
      "path": "Observation.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodytemp|4.0.1",
      "elementId": "Observation.component.code",
      "path": "Observation.component.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyheight|4.0.1",
      "elementId": "Observation.code",
      "path": "Observation.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyheight|4.0.1",
      "elementId": "Observation.component.code",
      "path": "Observation.component.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/headcircum|4.0.1",
      "elementId": "Observation.code",
      "path": "Observation.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/headcircum|4.0.1",
      "elementId": "Observation.component.code",
      "path": "Observation.component.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyweight|4.0.1",
      "elementId": "Observation.code",
      "path": "Observation.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyweight|4.0.1",
      "elementId": "Observation.component.code",
      "path": "Observation.component.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bmi|4.0.1",
      "elementId": "Observation.code",
      "path": "Observation.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bmi|4.0.1",
      "elementId": "Observation.component.code",
      "path": "Observation.component.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bp|4.0.1",
      "elementId": "Observation.code",
      "path": "Observation.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bp|4.0.1",
      "elementId": "Observation.component.code",
      "path": "Observation.component.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bp|4.0.1",
      "elementId": "Observation.component:SystolicBP.code",
      "path": "Observation.component.code",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bp|4.0.1",
      "elementId": "Observation.component:DiastolicBP.code",
      "path": "Observation.component.code",
      "purpose": "primary",
      "strength": "extensible"
    }
  ]
} as const satisfies IpsValueSetDefinition;
