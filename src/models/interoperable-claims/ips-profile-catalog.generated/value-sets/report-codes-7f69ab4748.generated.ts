// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/report-codes|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/report-codes",
  "resolved": true,
  "version": "4.0.1",
  "name": "LOINCDiagnosticReportCodes",
  "title": "LOINC Diagnostic Report Codes",
  "status": "draft",
  "description": "This value set includes LOINC codes that relate to Diagnostic Observations.",
  "compose": {
    "include": [
      {
        "system": "http://loinc.org"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "DiagnosticReport",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/DiagnosticReport-uv-ips|2.0.1",
      "elementId": "DiagnosticReport.code",
      "path": "DiagnosticReport.code",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
