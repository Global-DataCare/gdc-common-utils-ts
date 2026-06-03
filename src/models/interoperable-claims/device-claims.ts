// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/device-claims.ts

import type { ClaimSpec } from './types';

export const DeviceClaim = {
  DeviceName: 'Device.device-name',
  Identifier: 'Device.identifier',
  Location: 'Device.location',
  Manufacturer: 'Device.manufacturer',
  Model: 'Device.model',
  Organization: 'Device.organization',
  Patient: 'Device.patient',
  SerialNumber: 'Device.serial-number',
  Status: 'Device.status',
  Type: 'Device.type',
  UdiCarrier: 'Device.udi-carrier',
  Url: 'Device.url',
  Note: 'Device.note',
} as const;

export type DeviceClaimKey = typeof DeviceClaim[keyof typeof DeviceClaim];

export const DeviceClaimSpecs: ClaimSpec[] = [
  { key: DeviceClaim.DeviceName, meaning: 'Human-readable device name.', example: 'Insulin pump' },
  { key: DeviceClaim.Identifier, meaning: 'Business identifier.', example: 'device-001' },
  { key: DeviceClaim.Location, meaning: 'Location reference.', example: 'Location/loc-1' },
  { key: DeviceClaim.Manufacturer, meaning: 'Manufacturer name.', example: 'Medtronic' },
  { key: DeviceClaim.Model, meaning: 'Model number or name.', example: 'MiniMed 780G' },
  { key: DeviceClaim.Organization, meaning: 'Owning organization reference.', example: 'Organization/org-1' },
  { key: DeviceClaim.Patient, meaning: 'Patient reference.', example: 'did:web:patient.example.org' },
  { key: DeviceClaim.SerialNumber, meaning: 'Serial number.', example: 'SN-12345' },
  { key: DeviceClaim.Status, meaning: 'Device status.', example: 'active' },
  { key: DeviceClaim.Type, meaning: 'Device type token.', example: 'http://snomed.info/sct|706172005' },
  { key: DeviceClaim.UdiCarrier, meaning: 'UDI carrier string.', example: '(01)09504000059118(17)220101(10)ABCD1234' },
  { key: DeviceClaim.Url, meaning: 'Canonical URL.', example: 'https://device.example.org/catalogue/123' },
  { key: DeviceClaim.Note, meaning: 'Clinical note text.', example: 'Patient-owned continuous glucose monitor.' },
];
