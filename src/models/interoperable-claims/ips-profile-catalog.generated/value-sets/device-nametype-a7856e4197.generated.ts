// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/device-nametype|4.0.1",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/device-nametype",
  "resolved": true,
  "version": "4.0.1",
  "name": "DeviceNameType",
  "title": "DeviceNameType",
  "status": "draft",
  "description": "The type of name the device is referred by.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/device-nametype"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Device",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Device-uv-ips|2.0.1",
      "elementId": "Device.deviceName.type",
      "path": "Device.deviceName.type",
      "purpose": "primary",
      "strength": "required"
    },
    {
      "resourceType": "Device",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Device-observer-uv-ips|2.0.1",
      "elementId": "Device.deviceName.type",
      "path": "Device.deviceName.type",
      "purpose": "primary",
      "strength": "required"
    }
  ]
} as const satisfies IpsValueSetDefinition;
