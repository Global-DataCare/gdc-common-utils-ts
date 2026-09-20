// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://dicom.nema.org/medical/dicom/current/output/chtml/part04/sect_B.5.html#table_B.5-1",
  "canonicalUrl": "http://dicom.nema.org/medical/dicom/current/output/chtml/part04/sect_B.5.html#table_B.5-1",
  "resolved": false,
  "usages": [
    {
      "resourceType": "ImagingStudy",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/ImagingStudy-uv-ips|2.0.1",
      "elementId": "ImagingStudy.series.instance.sopClass",
      "path": "ImagingStudy.series.instance.sopClass",
      "purpose": "primary",
      "strength": "extensible"
    }
  ]
} as const satisfies IpsValueSetDefinition;
