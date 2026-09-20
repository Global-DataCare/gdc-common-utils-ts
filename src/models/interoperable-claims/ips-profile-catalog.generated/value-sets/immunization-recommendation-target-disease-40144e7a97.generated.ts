// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/immunization-recommendation-target-disease",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/immunization-recommendation-target-disease",
  "resolved": true,
  "version": "4.0.1",
  "name": "ImmunizationRecommendationTargetDiseaseCodes",
  "title": "Immunization Recommendation Target Disease Codes",
  "status": "draft",
  "description": "The value set to instantiate this attribute should be drawn from a terminologically robust code system that consists of or contains concepts to support describing the disease targeted by a vaccination recommendation. This value set is provided as a suggestive example and includes the SNOMED CT concepts from the 64572001 (Disease) hierarchy.",
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "concept": [
          {
            "code": "1857005"
          },
          {
            "code": "397430003"
          },
          {
            "code": "14189004"
          },
          {
            "code": "36989005"
          },
          {
            "code": "36653000"
          },
          {
            "code": "76902006"
          },
          {
            "code": "709410003"
          },
          {
            "code": "27836007"
          },
          {
            "code": "398102009"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "ImmunizationRecommendation",
      "profile": "http://hl7.org/fhir/StructureDefinition/ImmunizationRecommendation|4.0.1",
      "elementId": "ImmunizationRecommendation.recommendation.targetDisease",
      "path": "ImmunizationRecommendation.recommendation.targetDisease",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
