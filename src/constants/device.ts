// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Canonical user classes used by device licenses and frontend/backend SDK flows.
 */
export const DeviceUserClasses = Object.freeze({
  Employee: 'employee',
  Individual: 'individual',
} as const);

export type DeviceUserClass = typeof DeviceUserClasses[keyof typeof DeviceUserClasses];

/**
 * Canonical device/app form factors used by licensing and activation flows.
 */
export const DeviceAppTypes = Object.freeze({
  Mobile: 'mobile',
  Web: 'web',
} as const);

export type DeviceAppType = typeof DeviceAppTypes[keyof typeof DeviceAppTypes];

/** Lifecycle states for one concrete DCR installation bound to a seat. */
export const DeviceBindingStatuses = Object.freeze({
  Active: 'active',
  Revoked: 'revoked',
} as const);

export type DeviceBindingStatus =
  typeof DeviceBindingStatuses[keyof typeof DeviceBindingStatuses];
