// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/ucum-vitals-common|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/ucum-vitals-common",
  "resolved": true,
  "version": "4.0.1",
  "name": "VitalSignsUnits",
  "title": "Vital Signs Units",
  "status": "draft",
  "description": "Common UCUM units for recording Vital Signs",
  "compose": {
    "include": [
      {
        "system": "http://unitsofmeasure.org",
        "concept": [
          {
            "code": "%",
            "display": "percent"
          },
          {
            "code": "cm",
            "display": "centimeter"
          },
          {
            "code": "[in_i]",
            "display": "inch (international)"
          },
          {
            "code": "kg",
            "display": "kilogram"
          },
          {
            "code": "g",
            "display": "gram"
          },
          {
            "code": "[lb_av]",
            "display": "pound (US and British)"
          },
          {
            "code": "Cel",
            "display": "degree Celsius"
          },
          {
            "code": "[degF]",
            "display": "degree Fahrenheit"
          },
          {
            "code": "mm[Hg]",
            "display": "millimeter of mercury"
          },
          {
            "code": "/min",
            "display": "per minute"
          },
          {
            "code": "kg/m2",
            "display": "kilogram / (meter ^ 2)"
          },
          {
            "code": "m2",
            "display": "square meter"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/resprate|4.0.1",
      "elementId": "Observation.component.value[x]",
      "path": "Observation.component.value[x]",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/heartrate|4.0.1",
      "elementId": "Observation.component.value[x]",
      "path": "Observation.component.value[x]",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/oxygensat|4.0.1",
      "elementId": "Observation.component.value[x]",
      "path": "Observation.component.value[x]",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodytemp|4.0.1",
      "elementId": "Observation.component.value[x]",
      "path": "Observation.component.value[x]",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyheight|4.0.1",
      "elementId": "Observation.component.value[x]",
      "path": "Observation.component.value[x]",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/headcircum|4.0.1",
      "elementId": "Observation.component.value[x]",
      "path": "Observation.component.value[x]",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bodyweight|4.0.1",
      "elementId": "Observation.component.value[x]",
      "path": "Observation.component.value[x]",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bmi|4.0.1",
      "elementId": "Observation.component.value[x]",
      "path": "Observation.component.value[x]",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bp|4.0.1",
      "elementId": "Observation.component.value[x]",
      "path": "Observation.component.value[x]",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bp|4.0.1",
      "elementId": "Observation.component:SystolicBP.value[x]",
      "path": "Observation.component.value[x]",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/StructureDefinition/bp|4.0.1",
      "elementId": "Observation.component:DiastolicBP.value[x]",
      "path": "Observation.component.value[x]",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
