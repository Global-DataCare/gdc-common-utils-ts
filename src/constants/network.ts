// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Canonical network/environment labels used to identify host networks during
 * discovery/bootstrap flows.
 *
 * These labels do not replace the business route `sector`. They describe the
 * host environment itself.
 */
export const HostNetworkTypes = Object.freeze({
  Test: 'test',
  TestNetwork: 'test-network',
  Network: 'network',
} as const);

export type HostNetworkType =
  typeof HostNetworkTypes[keyof typeof HostNetworkTypes];

/**
 * @deprecated Use `HostNetworkTypes`.
 */
export const NodeOperatorNetworkTypes = HostNetworkTypes;

/**
 * @deprecated Use `HostNetworkType`.
 */
export type NodeOperatorNetworkType = HostNetworkType;
