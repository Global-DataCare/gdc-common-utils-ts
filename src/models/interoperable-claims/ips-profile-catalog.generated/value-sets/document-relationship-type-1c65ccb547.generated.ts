// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/document-relationship-type|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/document-relationship-type",
  "resolved": true,
  "version": "4.0.1",
  "name": "DocumentRelationshipType",
  "title": "DocumentRelationshipType",
  "status": "draft",
  "description": "The type of relationship between documents.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/document-relationship-type"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.relatesTo.code",
      "path": "Composition.relatesTo.code",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "DocumentReference",
      "profile": "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1",
      "elementId": "DocumentReference.relatesTo.code",
      "path": "DocumentReference.relatesTo.code",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
