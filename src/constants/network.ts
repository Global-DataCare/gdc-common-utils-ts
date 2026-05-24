// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Canonical network/environment labels used to identify node-operator networks
 * during discovery/bootstrap flows.
 *
 * These labels do not replace the clinical route `sector`. They describe the
 * operator environment itself.
 */
export const NodeOperatorNetworkTypes = Object.freeze({
  Test: 'test',
  TestNetwork: 'test-network',
  Network: 'network',
} as const);

export type NodeOperatorNetworkType =
  typeof NodeOperatorNetworkTypes[keyof typeof NodeOperatorNetworkTypes];
