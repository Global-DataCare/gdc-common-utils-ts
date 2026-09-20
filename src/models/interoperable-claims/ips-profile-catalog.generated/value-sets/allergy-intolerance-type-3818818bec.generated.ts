// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/allergy-intolerance-type|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/allergy-intolerance-type",
  "resolved": true,
  "version": "4.0.1",
  "name": "AllergyIntoleranceType",
  "title": "AllergyIntoleranceType",
  "status": "draft",
  "description": "Identification of the underlying physiological mechanism for a Reaction Risk.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/allergy-intolerance-type"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "AllergyIntolerance",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/AllergyIntolerance-uv-ips|2.0.1",
      "elementId": "AllergyIntolerance.type",
      "path": "AllergyIntolerance.type",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
