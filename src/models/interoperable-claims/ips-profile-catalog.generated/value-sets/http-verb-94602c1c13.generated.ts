// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/http-verb",
  "resolved": true,
  "version": "4.0.1",
  "name": "HTTPVerb",
  "title": "HTTPVerb",
  "status": "active",
  "description": "HTTP verbs (in the HTTP command line). See [HTTP rfc](https://tools.ietf.org/html/rfc7231) for details.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/http-verb"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:composition.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:patient.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:allergyintolerance.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:careplan.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:clinicalimpression.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:condition.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:consent.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:device.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:deviceusestatement.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:diagnosticreport.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:documentreference.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:flag.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:imagingstudy.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:immunization.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:immunizationrecommendation.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:medication.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:medicationrequest.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:medicationstatement.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:practitioner.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:practitionerrole.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:procedure.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:observation-pregnancy-edd.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:observation-pregnancy-outcome.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:observation-pregnancy-status.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:observation-alcohol-use.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:observation-tobacco-use.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:observation-results-laboratory-pathology.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:observation-results-radiology.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:observation-vital-signs.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:organization.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Bundle",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1",
      "elementId": "Bundle.entry:specimen.request.method",
      "path": "Bundle.entry.request.method",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
