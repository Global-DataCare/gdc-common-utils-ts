// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/consent-policy",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/consent-policy",
  "resolved": true,
  "version": "4.0.1",
  "name": "ConsentPolicyRuleCodes",
  "title": "Consent PolicyRule Codes",
  "status": "draft",
  "description": "This value set includes sample Regulatory consent policy types from the US and other regions.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/consentpolicycodes"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Consent",
      "profile": "http://hl7.org/fhir/StructureDefinition/Consent|4.0.1",
      "elementId": "Consent.policyRule",
      "path": "Consent.policyRule",
      "purpose": "primary",
      "strength": "extensible"
    }
  ]
} as const satisfies IpsValueSetDefinition;
