// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/device-use-statement-claims.ts

import type { ClaimSpec } from './types';

// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

export const DeviceUseStatementClaim = {
  Identifier: 'DeviceUseStatement.identifier',
  Subject: 'DeviceUseStatement.subject',
  Status: 'DeviceUseStatement.status',
  Device: 'DeviceUseStatement.device',
  DeviceDisplay: 'DeviceUseStatement.device-display',
  RecordedOn: 'DeviceUseStatement.recordedon',
  TimingDateTime: 'DeviceUseStatement.timing-datetime',
  ReasonCode: 'DeviceUseStatement.reasoncode',
  Source: 'DeviceUseStatement.source',
} as const;

export type DeviceUseStatementClaimKey = typeof DeviceUseStatementClaim[keyof typeof DeviceUseStatementClaim];

export const DeviceUseStatementClaimSpecs: ClaimSpec[] = [
  { key: DeviceUseStatementClaim.Identifier, meaning: 'Business identifier for device-use record.', example: 'DUS-0001' },
  { key: DeviceUseStatementClaim.Subject, meaning: 'Patient subject reference.', example: 'Patient/pat-123' },
  { key: DeviceUseStatementClaim.Status, meaning: 'Use statement status.', example: 'active' },
  { key: DeviceUseStatementClaim.Device, meaning: 'Device reference.', example: 'Device/dev-777' },
  { key: DeviceUseStatementClaim.DeviceDisplay, meaning: 'Human-readable device name accompanying the reference.', example: 'Hip prosthesis' },
  { key: DeviceUseStatementClaim.RecordedOn, meaning: 'Record creation date/time.', example: '2026-03-01T12:00:00Z' },
  { key: DeviceUseStatementClaim.TimingDateTime, meaning: 'When the use happened.', example: '2026-03-01T08:00:00Z' },
  { key: DeviceUseStatementClaim.ReasonCode, meaning: 'Reason code for use.', example: 'http://snomed.info/sct|182840001' },
  { key: DeviceUseStatementClaim.Source, meaning: 'Source actor reference.', example: 'Practitioner/prac-8' },
];
