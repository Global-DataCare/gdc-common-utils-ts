// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/document-reference-status|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/document-reference-status",
  "resolved": true,
  "version": "4.0.1",
  "name": "DocumentReferenceStatus",
  "title": "DocumentReferenceStatus",
  "status": "draft",
  "description": "The status of the document reference.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/document-reference-status"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "DocumentReference",
      "profile": "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1",
      "elementId": "DocumentReference.status",
      "path": "DocumentReference.status",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
