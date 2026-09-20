// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/doc-section-codes",
  "resolved": true,
  "version": "4.0.1",
  "name": "DocumentSectionCodes",
  "title": "Document Section Codes",
  "status": "draft",
  "description": "Document section codes (LOINC codes used in CCDA sections).",
  "compose": {
    "include": [
      {
        "system": "http://loinc.org",
        "concept": [
          {
            "code": "10154-3"
          },
          {
            "code": "10157-6"
          },
          {
            "code": "10160-0"
          },
          {
            "code": "10164-2"
          },
          {
            "code": "10183-2"
          },
          {
            "code": "10184-0"
          },
          {
            "code": "10187-3"
          },
          {
            "code": "10210-3"
          },
          {
            "code": "10216-0"
          },
          {
            "code": "10218-6"
          },
          {
            "code": "10218-6"
          },
          {
            "code": "10223-6"
          },
          {
            "code": "10222-8"
          },
          {
            "code": "11329-0"
          },
          {
            "code": "11348-0"
          },
          {
            "code": "11369-6"
          },
          {
            "code": "57852-6"
          },
          {
            "code": "11493-4"
          },
          {
            "code": "11535-2"
          },
          {
            "code": "11537-8"
          },
          {
            "code": "18776-5"
          },
          {
            "code": "18841-7"
          },
          {
            "code": "29299-5"
          },
          {
            "code": "29545-1"
          },
          {
            "code": "29549-3"
          },
          {
            "code": "29554-3"
          },
          {
            "code": "29762-2"
          },
          {
            "code": "30954-2"
          },
          {
            "code": "42344-2"
          },
          {
            "code": "42346-7"
          },
          {
            "code": "42348-3"
          },
          {
            "code": "42349-1"
          },
          {
            "code": "46240-8"
          },
          {
            "code": "46241-6"
          },
          {
            "code": "46264-8"
          },
          {
            "code": "47420-5"
          },
          {
            "code": "47519-4"
          },
          {
            "code": "48765-2"
          },
          {
            "code": "48768-6"
          },
          {
            "code": "51848-0"
          },
          {
            "code": "55109-3"
          },
          {
            "code": "55122-6"
          },
          {
            "code": "59768-2"
          },
          {
            "code": "59769-0"
          },
          {
            "code": "59770-8"
          },
          {
            "code": "59771-6"
          },
          {
            "code": "59772-4"
          },
          {
            "code": "59773-2"
          },
          {
            "code": "59775-7"
          },
          {
            "code": "59776-5"
          },
          {
            "code": "61149-1"
          },
          {
            "code": "61150-9"
          },
          {
            "code": "61150-9"
          },
          {
            "code": "69730-0"
          },
          {
            "code": "8648-8"
          },
          {
            "code": "8653-8"
          },
          {
            "code": "8716-3"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionProblems.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionAllergies.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionMedications.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionImmunizations.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionResults.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionProceduresHx.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionMedicalDevices.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionAdvanceDirectives.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionAlerts.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionFunctionalStatus.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionPastProblems.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionPregnancyHx.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionPatientStory.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionPlanOfCare.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionSocialHistory.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    },
    {
      "resourceType": "Composition",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1",
      "elementId": "Composition.section:sectionVitalSigns.code",
      "path": "Composition.section.code",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
