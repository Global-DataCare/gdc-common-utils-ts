// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/consent-category",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/consent-category",
  "resolved": true,
  "version": "4.0.1",
  "name": "ConsentCategoryCodes",
  "title": "Consent Category Codes",
  "status": "draft",
  "description": "This value set includes sample Consent Directive Type codes, including several consent directive related LOINC codes; HL7 VALUE SET: ActConsentType(2.16.840.1.113883.1.11.19897); examples of US realm consent directive legal descriptions and references to online and/or downloadable forms such as the SSA-827 Authorization to Disclose Information to the Social Security Administration; and other anticipated consent directives related to participation in a clinical trial, medical procedures, reproductive procedures; health care directive (Living Will); advance directive, do not resuscitate (DNR); Physician Orders for Life-Sustaining Treatment (POLST)",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/consentcategorycodes"
      },
      {
        "valueSet": [
          "http://terminology.hl7.org/ValueSet/v3-ActConsentType"
        ]
      },
      {
        "system": "http://loinc.org",
        "concept": [
          {
            "code": "59284-0",
            "display": "Patient Consent "
          },
          {
            "code": "57016-8",
            "display": "Privacy policy acknowledgement Document"
          },
          {
            "code": "57017-6",
            "display": "Privacy policy Organization Document "
          },
          {
            "code": "64292-6",
            "display": "Release of information consent "
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Consent",
      "profile": "http://hl7.org/fhir/StructureDefinition/Consent|4.0.1",
      "elementId": "Consent.category",
      "path": "Consent.category",
      "purpose": "primary",
      "strength": "extensible"
    }
  ]
} as const satisfies IpsValueSetDefinition;
