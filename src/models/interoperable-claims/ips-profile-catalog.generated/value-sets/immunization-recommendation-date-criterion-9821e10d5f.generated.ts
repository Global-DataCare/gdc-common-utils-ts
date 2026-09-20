// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/immunization-recommendation-date-criterion",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/immunization-recommendation-date-criterion",
  "resolved": true,
  "version": "4.0.1",
  "name": "ImmunizationRecommendationDateCriterionCodes",
  "title": "Immunization Recommendation Date Criterion Codes",
  "status": "draft",
  "description": "The value set to instantiate this attribute should be drawn from a terminologically robust code system that consists of or contains concepts to support the definition of dates relevant to recommendations for future doses of vaccines. This value set is provided as a suggestive example.",
  "compose": {
    "include": [
      {
        "system": "http://loinc.org",
        "concept": [
          {
            "code": "30981-5"
          },
          {
            "code": "30980-7"
          },
          {
            "code": "59777-3"
          },
          {
            "code": "59778-1"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "ImmunizationRecommendation",
      "profile": "http://hl7.org/fhir/StructureDefinition/ImmunizationRecommendation|4.0.1",
      "elementId": "ImmunizationRecommendation.recommendation.dateCriterion.code",
      "path": "ImmunizationRecommendation.recommendation.dateCriterion.code",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
