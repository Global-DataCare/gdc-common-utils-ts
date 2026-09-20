// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/consent-data-meaning|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/consent-data-meaning",
  "resolved": true,
  "version": "4.0.1",
  "name": "ConsentDataMeaning",
  "title": "ConsentDataMeaning",
  "status": "draft",
  "description": "How a resource reference is interpreted when testing consent restrictions.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/consent-data-meaning"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Consent",
      "profile": "http://hl7.org/fhir/StructureDefinition/Consent|4.0.1",
      "elementId": "Consent.provision.data.meaning",
      "path": "Consent.provision.data.meaning",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
