// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/device-statement-status|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/device-statement-status",
  "resolved": true,
  "version": "4.0.1",
  "name": "DeviceUseStatementStatus",
  "title": "DeviceUseStatementStatus",
  "status": "draft",
  "description": "A coded concept indicating the current status of the Device Usage.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/device-statement-status"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "DeviceUseStatement",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/DeviceUseStatement-uv-ips|2.0.1",
      "elementId": "DeviceUseStatement.status",
      "path": "DeviceUseStatement.status",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
