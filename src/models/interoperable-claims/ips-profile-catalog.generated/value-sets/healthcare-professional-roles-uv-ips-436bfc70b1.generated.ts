// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/healthcare-professional-roles-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/healthcare-professional-roles-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "HealthcareProfessionalRolesUvIps",
  "title": "Healthcare Professional Roles - IPS",
  "status": "active",
  "description": "IPS Healthcare Professional Roles",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "urn:oid:2.16.840.1.113883.2.9.6.2.7",
        "filter": [
          {
            "property": "concept",
            "op": "descendent-of",
            "value": "22"
          }
        ]
      },
      {
        "system": "urn:oid:2.16.840.1.113883.2.9.6.2.7",
        "filter": [
          {
            "property": "concept",
            "op": "descendent-of",
            "value": "32"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "PractitionerRole",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/PractitionerRole-uv-ips|2.0.1",
      "elementId": "PractitionerRole.code",
      "path": "PractitionerRole.code",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
