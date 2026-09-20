// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/flag-category|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/flag-category",
  "resolved": true,
  "version": "4.0.1",
  "name": "FlagCategory",
  "title": "Flag Category",
  "status": "draft",
  "description": "Example list of general categories for flagged issues. (Not complete or necessarily appropriate.)",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/flag-category"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Flag",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Flag-alert-uv-ips|2.0.1",
      "elementId": "Flag.category",
      "path": "Flag.category",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
