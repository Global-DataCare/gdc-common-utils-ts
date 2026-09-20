// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/body-site|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/body-site",
  "resolved": true,
  "version": "4.0.1",
  "name": "SNOMEDCTBodyStructures",
  "title": "SNOMED CT Body Structures",
  "status": "draft",
  "description": "This value set includes all codes from [SNOMED CT](http://snomed.info/sct) where concept is-a 442083009 (Anatomical or acquired body site (body structure)).",
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "442083009"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Condition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Condition-uv-ips|2.0.1",
      "elementId": "Condition.bodySite",
      "path": "Condition.bodySite",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Immunization",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Immunization-uv-ips|2.0.1",
      "elementId": "Immunization.site",
      "path": "Immunization.site",
      "purpose": "primary",
      "strength": "preferred"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-edd-uv-ips|2.0.1",
      "elementId": "Observation.bodySite",
      "path": "Observation.bodySite",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-outcome-uv-ips|2.0.1",
      "elementId": "Observation.bodySite",
      "path": "Observation.bodySite",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-status-uv-ips|2.0.1",
      "elementId": "Observation.bodySite",
      "path": "Observation.bodySite",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-radiology-uv-ips|2.0.1",
      "elementId": "Observation.bodySite",
      "path": "Observation.bodySite",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Procedure",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Procedure-uv-ips|2.0.1",
      "elementId": "Procedure.bodySite",
      "path": "Procedure.bodySite",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
