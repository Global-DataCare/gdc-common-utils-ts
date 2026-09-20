// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/consent-state-codes|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/consent-state-codes",
  "resolved": true,
  "version": "4.0.1",
  "name": "ConsentState",
  "title": "ConsentState",
  "status": "draft",
  "description": "Indicates the state of the consent.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/consent-state-codes"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Consent",
      "profile": "http://hl7.org/fhir/StructureDefinition/Consent|4.0.1",
      "elementId": "Consent.status",
      "path": "Consent.status",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
