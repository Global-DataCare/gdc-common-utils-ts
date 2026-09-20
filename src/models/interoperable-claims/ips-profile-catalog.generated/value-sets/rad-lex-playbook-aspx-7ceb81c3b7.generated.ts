// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://www.rsna.org/RadLex_Playbook.aspx",
  "canonicalUrl": "http://www.rsna.org/RadLex_Playbook.aspx",
  "resolved": false,
  "usages": [
    {
      "resourceType": "ImagingStudy",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/ImagingStudy-uv-ips|2.0.1",
      "elementId": "ImagingStudy.procedureCode",
      "path": "ImagingStudy.procedureCode",
      "purpose": "primary",
      "strength": "extensible"
    }
  ]
} as const satisfies IpsValueSetDefinition;
