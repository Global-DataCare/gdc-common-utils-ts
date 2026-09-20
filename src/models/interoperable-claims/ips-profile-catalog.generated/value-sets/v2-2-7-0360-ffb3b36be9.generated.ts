// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://terminology.hl7.org/ValueSet/v2-2.7-0360|0360",
  "canonicalUrl": "http://terminology.hl7.org/ValueSet/v2-2.7-0360",
  "resolved": true,
  "version": "0360",
  "name": "v2.0360.2.7",
  "title": "v2 table 0360, Version 2.7",
  "status": "active",
  "description": "FHIR Value set/code system definition for HL7 v2 table 0360 ver 2.9 ( Degree/License/Certificate)",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v2-0360|2.7"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Practitioner",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Practitioner-uv-ips|2.0.1",
      "elementId": "Practitioner.qualification.code",
      "path": "Practitioner.qualification.code",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
