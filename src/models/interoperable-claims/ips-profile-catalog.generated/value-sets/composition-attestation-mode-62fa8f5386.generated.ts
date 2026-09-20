// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/composition-attestation-mode|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/composition-attestation-mode",
  "resolved": true,
  "version": "4.0.1",
  "name": "CompositionAttestationMode",
  "title": "CompositionAttestationMode",
  "status": "draft",
  "description": "The way in which a person authenticated a composition.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/composition-attestation-mode"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.attester.mode",
      "path": "Composition.attester.mode",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
