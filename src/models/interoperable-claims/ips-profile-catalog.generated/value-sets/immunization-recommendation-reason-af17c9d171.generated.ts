// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/immunization-recommendation-reason",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/immunization-recommendation-reason",
  "resolved": true,
  "version": "4.0.1",
  "name": "ImmunizationRecommendationReasonCodes",
  "title": "Immunization Recommendation Reason Codes",
  "status": "draft",
  "description": "The value set to instantiate this attribute should be drawn from a terminologically robust code system that consists of or contains concepts to support describing the reasons why a given recommendation status is assigned. This value set is provided as a suggestive example and includes SNOMED CT concepts.",
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "concept": [
          {
            "code": "77176002"
          },
          {
            "code": "77386006"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "ImmunizationRecommendation",
      "profile": "http://hl7.org/fhir/StructureDefinition/ImmunizationRecommendation|4.0.1",
      "elementId": "ImmunizationRecommendation.recommendation.forecastReason",
      "path": "ImmunizationRecommendation.recommendation.forecastReason",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
