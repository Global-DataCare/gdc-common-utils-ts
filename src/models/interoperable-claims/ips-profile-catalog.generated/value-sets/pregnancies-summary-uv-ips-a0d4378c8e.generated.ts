// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/pregnancies-summary-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/pregnancies-summary-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "PregnanciesSummaryUvIps",
  "title": "Pregnancy Outcome - IPS",
  "status": "active",
  "description": "IPS Pregnancies Summary",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://loinc.org",
        "concept": [
          {
            "code": "11636-8",
            "display": "[#] Births.live"
          },
          {
            "code": "11637-6",
            "display": "[#] Births.preterm"
          },
          {
            "code": "11638-4",
            "display": "[#] Births.still living"
          },
          {
            "code": "11639-2",
            "display": "[#] Births.term"
          },
          {
            "code": "11640-0",
            "display": "[#] Births total"
          },
          {
            "code": "11612-9",
            "display": "[#] Abortions"
          },
          {
            "code": "11613-7",
            "display": "[#] Abortions.induced"
          },
          {
            "code": "11614-5",
            "display": "[#] Abortions.spontaneous"
          },
          {
            "code": "33065-4",
            "display": "[#] Ectopic pregnancy"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-outcome-uv-ips|2.0.1",
      "elementId": "Observation.code",
      "path": "Observation.code",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
