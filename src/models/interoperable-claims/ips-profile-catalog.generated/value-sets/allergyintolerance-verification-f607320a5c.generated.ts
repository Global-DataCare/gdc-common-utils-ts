// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/allergyintolerance-verification|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/allergyintolerance-verification",
  "resolved": true,
  "version": "4.0.1",
  "name": "AllergyIntoleranceVerificationStatusCodes",
  "title": "AllergyIntolerance Verification Status Codes",
  "status": "draft",
  "description": "Preferred value set for AllergyIntolerance Verification Status.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "AllergyIntolerance",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/AllergyIntolerance-uv-ips|2.0.1",
      "elementId": "AllergyIntolerance.verificationStatus",
      "path": "AllergyIntolerance.verificationStatus",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
