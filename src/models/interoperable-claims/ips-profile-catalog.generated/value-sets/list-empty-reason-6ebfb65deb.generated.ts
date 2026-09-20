// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/list-empty-reason|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/list-empty-reason",
  "resolved": true,
  "version": "4.0.1",
  "name": "ListEmptyReasons",
  "title": "List Empty Reasons",
  "status": "draft",
  "description": "General reasons for a list to be empty. Reasons are either related to a summary list (i.e. problem or medication list) or to a workflow related list (i.e. consultation list).",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/list-empty-reason"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionProblems.emptyReason",
      "path": "Composition.section.emptyReason",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionAllergies.emptyReason",
      "path": "Composition.section.emptyReason",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionMedications.emptyReason",
      "path": "Composition.section.emptyReason",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
