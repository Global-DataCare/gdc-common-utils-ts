// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/composition-status|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/composition-status",
  "resolved": true,
  "version": "4.0.1",
  "name": "CompositionStatus",
  "title": "CompositionStatus",
  "status": "draft",
  "description": "The workflow/clinical status of the composition.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/composition-status"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.status",
      "path": "Composition.status",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "DocumentReference",
      "profile": "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1",
      "elementId": "DocumentReference.docStatus",
      "path": "DocumentReference.docStatus",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
