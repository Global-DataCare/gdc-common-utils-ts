// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/imaging-study-status-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/imaging-study-status-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "ImagingStudyStatusUvIps",
  "title": "Imaging Study Status Codes - IPS",
  "status": "active",
  "description": "IPS Imaging Study status codes allowable for results. section  This value set includes all imaging study status codes except \\\"entered-in-error\\\" from http://hl7.org/fhir/imagingstudy-status.",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/imagingstudy-status",
        "version": "4.0.1"
      }
    ],
    "exclude": [
      {
        "system": "http://hl7.org/fhir/imagingstudy-status",
        "version": "4.0.1",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "entered-in-error"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "ImagingStudy",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/ImagingStudy-uv-ips|2.0.1",
      "elementId": "ImagingStudy.status",
      "path": "ImagingStudy.status",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
