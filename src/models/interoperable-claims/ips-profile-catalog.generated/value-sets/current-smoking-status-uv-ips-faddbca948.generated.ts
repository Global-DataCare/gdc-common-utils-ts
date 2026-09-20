// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/current-smoking-status-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/current-smoking-status-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "CurrentSmokingStatusUvIps",
  "title": "Current Smoking Status - IPS",
  "status": "active",
  "description": "HL7 IPS SNOMED value set for smoking status.  This value set includes a set of specific SNOMED CT codes (no subtypes included) that may be used to represent smoking status.\n\nSNOMED CT® ECL definition:\\\n449868002 |Smokes tobacco daily (finding)| OR 428041000124106 |Occasional tobacco smoker (finding)| OR 8517006 |Ex-smoker (finding)| OR 266919005 |Never smoked tobacco (finding)| OR 77176002 |Smoker (finding)| OR 266927001 |Tobacco smoking consumption unknown (finding)| OR 230063004 |Heavy cigarette smoker (finding)| OR 230060001 |Light cigarette smoker (finding)|",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "concept": [
          {
            "code": "449868002",
            "display": "Smokes tobacco daily (finding)"
          },
          {
            "code": "428041000124106",
            "display": "Occasional tobacco smoker (finding)"
          },
          {
            "code": "8517006",
            "display": "Ex-smoker (finding)"
          },
          {
            "code": "266919005",
            "display": "Never smoked tobacco (finding)"
          },
          {
            "code": "77176002",
            "display": "Smoker (finding)"
          },
          {
            "code": "266927001",
            "display": "Tobacco smoking consumption unknown (finding)"
          },
          {
            "code": "230063004",
            "display": "Heavy cigarette smoker (finding)"
          },
          {
            "code": "230060001",
            "display": "Light cigarette smoker (finding)"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-tobaccouse-uv-ips|2.0.1",
      "elementId": "Observation.value[x]:valueCodeableConcept",
      "path": "Observation.value[x]",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
