// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/vaccine-code",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/vaccine-code",
  "resolved": true,
  "version": "4.0.1",
  "name": "VaccineAdministeredValueSet",
  "title": "Vaccine Administered Value Set",
  "status": "active",
  "description": "This identifies the vaccine substance administered - CVX codes.",
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/sid/cvx"
      },
      {
        "system": "urn:oid:1.2.36.1.2001.1005.17"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "ImmunizationRecommendation",
      "profile": "http://hl7.org/fhir/StructureDefinition/ImmunizationRecommendation|4.0.1",
      "elementId": "ImmunizationRecommendation.recommendation.vaccineCode",
      "path": "ImmunizationRecommendation.recommendation.vaccineCode",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "ImmunizationRecommendation",
      "profile": "http://hl7.org/fhir/StructureDefinition/ImmunizationRecommendation|4.0.1",
      "elementId": "ImmunizationRecommendation.recommendation.contraindicatedVaccineCode",
      "path": "ImmunizationRecommendation.recommendation.contraindicatedVaccineCode",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
