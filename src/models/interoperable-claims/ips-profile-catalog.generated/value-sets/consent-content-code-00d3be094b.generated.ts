// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/consent-content-code",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/consent-content-code",
  "resolved": true,
  "version": "4.0.1",
  "name": "ConsentContentCodes",
  "title": "Consent Content Codes",
  "status": "draft",
  "description": "This example value set contains all LOINC code",
  "compose": {
    "include": [
      {
        "system": "http://loinc.org"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Consent",
      "profile": "http://hl7.org/fhir/StructureDefinition/Consent|4.0.1",
      "elementId": "Consent.provision.code",
      "path": "Consent.provision.code",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
