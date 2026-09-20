// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/results-coded-values-laboratory-pathology-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/results-coded-values-laboratory-pathology-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "ResultsCodedValuesLaboratoryPathologyUvIps",
  "title": "Results Coded Values Laboratory/Pathology - IPS",
  "status": "active",
  "description": "IPS Results Coded Values Laboratory/Pathology value set.  This value set includes the codes from the [Results Blood Group - IPS](ValueSet-results-blood-group-uv-ips.html), [Results Presence/Absence - IPS](ValueSet-results-presence-absence-uv-ips.html), [Results Microorganism - IPS](ValueSet-results-microorganism-uv-ips.html) and [Results Pathology - IPS](ValueSet-results-pathology-uv-ips.html) value sets.\n\nSNOMED CT® ECL definition:\\\n< 365636006 \\|Finding of blood group (finding)\\| OR < 260411009 \\|Presence findings (qualifier value)\\| OR < 272519000 \\|Absence findings (qualifier value)\\| OR < 409822003 \\|Domain Bacteria (organism)\\| OR < 441649000 \\|Class Cestoda and/or Class Trematoda and/or Phylum Nemata (organism)\\| OR < 414561005 \\|Kingdom Fungi (organism)\\| OR < 84676004 \\|Prion (organism)\\| OR < 49872002 \\|Virus (organism)\\| OR < 417396000 \\|Kingdom Protozoa (organism)\\| OR < 419036000 \\|Domain Archaea (organism)\\| OR < 426785004 \\|Kingdom Chromista (organism)\\| OR < 370570004 \\|Kingdom Protoctista (organism)\\| OR < 417377004 \\|Kingdom Viridiplantae (organism)\\| OR < 243565002 \\|Slime mold (organism)\\| OR < 106253005 \\|Histologic grading differentiation AND/OR behavior (qualifier value)\\| OR < 373369003 \\|Finding of histologic grading differentiation AND/OR behavior (finding)\\| OR < 399981008 \\|Neoplasm and/or hamartoma (disorder)\\|",
  "immutable": false,
  "compose": {
    "include": [
      {
        "valueSet": [
          "http://hl7.org/fhir/uv/ips/ValueSet/results-blood-group-uv-ips|2.0.1"
        ]
      },
      {
        "valueSet": [
          "http://hl7.org/fhir/uv/ips/ValueSet/results-presence-absence-uv-ips"
        ]
      },
      {
        "valueSet": [
          "http://hl7.org/fhir/uv/ips/ValueSet/results-microorganism-uv-ips"
        ]
      },
      {
        "valueSet": [
          "http://hl7.org/fhir/uv/ips/ValueSet/results-pathology-uv-ips"
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-laboratory-pathology-uv-ips|2.0.1",
      "elementId": "Observation.value[x]:valueCodeableConcept",
      "path": "Observation.value[x]",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
