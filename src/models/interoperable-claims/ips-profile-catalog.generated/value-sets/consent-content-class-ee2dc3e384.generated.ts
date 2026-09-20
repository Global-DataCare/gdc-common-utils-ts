// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/consent-content-class",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/consent-content-class",
  "resolved": true,
  "version": "4.0.1",
  "name": "ConsentContentClass",
  "title": "Consent Content Class",
  "status": "draft",
  "description": "This value set includes the FHIR resource types, along with some other important content class codes",
  "compose": {
    "include": [
      {
        "valueSet": [
          "http://hl7.org/fhir/ValueSet/formatcodes"
        ]
      },
      {
        "system": "http://hl7.org/fhir/resource-types"
      },
      {
        "system": "urn:ietf:rfc:3986",
        "concept": [
          {
            "code": "http://hl7.org/fhir/StructureDefinition/lipidprofile",
            "display": "Lipid Lab Report"
          }
        ]
      },
      {
        "system": "urn:ietf:bcp:13",
        "concept": [
          {
            "code": "application/hl7-cda+xml",
            "display": "CDA Documents"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Consent",
      "profile": "http://hl7.org/fhir/StructureDefinition/Consent|4.0.1",
      "elementId": "Consent.provision.class",
      "path": "Consent.provision.class",
      "purpose": "primary",
      "strength": "extensible"
    }
  ]
} as const satisfies IpsValueSetDefinition;
