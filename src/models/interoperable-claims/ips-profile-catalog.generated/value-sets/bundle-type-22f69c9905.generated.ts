// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/bundle-type|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/bundle-type",
  "resolved": true,
  "version": "4.0.1",
  "name": "BundleType",
  "title": "BundleType",
  "status": "active",
  "description": "Indicates the purpose of a bundle - how it is intended to be used.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/bundle-type"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.type",
      "path": "Bundle.type",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
