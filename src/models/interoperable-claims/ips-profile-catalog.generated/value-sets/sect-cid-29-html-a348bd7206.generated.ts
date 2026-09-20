// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://dicom.nema.org/medical/dicom/current/output/chtml/part16/sect_CID_29.html",
  "canonicalUrl": "http://dicom.nema.org/medical/dicom/current/output/chtml/part16/sect_CID_29.html",
  "resolved": false,
  "usages": [
    {
      "resourceType": "ImagingStudy",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/ImagingStudy-uv-ips|2.0.1",
      "elementId": "ImagingStudy.series.modality",
      "path": "ImagingStudy.series.modality",
      "purpose": "primary",
      "strength": "extensible"
    }
  ]
} as const satisfies IpsValueSetDefinition;
