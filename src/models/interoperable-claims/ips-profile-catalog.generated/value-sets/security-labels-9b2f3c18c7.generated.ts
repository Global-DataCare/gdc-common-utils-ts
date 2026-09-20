// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/security-labels",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/security-labels",
  "resolved": true,
  "version": "4.0.1",
  "name": "All Security Labels",
  "title": "SecurityLabels",
  "status": "active",
  "description": "A single value set for all security labels defined by FHIR.",
  "compose": {
    "include": [
      {
        "valueSet": [
          "http://terminology.hl7.org/ValueSet/v3-ConfidentialityClassification"
        ]
      },
      {
        "valueSet": [
          "http://terminology.hl7.org/ValueSet/v3-InformationSensitivityPolicy"
        ]
      },
      {
        "valueSet": [
          "http://terminology.hl7.org/ValueSet/v3-Compartment"
        ]
      },
      {
        "valueSet": [
          "http://terminology.hl7.org/ValueSet/v3-SecurityIntegrityObservationValue"
        ]
      },
      {
        "valueSet": [
          "http://terminology.hl7.org/ValueSet/v3-SecurityControlObservationValue"
        ]
      },
      {
        "valueSet": [
          "http://terminology.hl7.org/ValueSet/v3-ActUSPrivacyLaw"
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Consent",
      "profile": "http://hl7.org/fhir/StructureDefinition/Consent|4.0.1",
      "elementId": "Consent.provision.securityLabel",
      "path": "Consent.provision.securityLabel",
      "purpose": "primary",
      "strength": "extensible"
    },
    {
      "resourceType": "DocumentReference",
      "profile": "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1",
      "elementId": "DocumentReference.securityLabel",
      "path": "DocumentReference.securityLabel",
      "purpose": "primary",
      "strength": "extensible"
    }
  ]
} as const satisfies IpsValueSetDefinition;
