// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Shared discovery-source policies used by backend/bootstrap layers that must
 * decide whether to start from configured defaults or from live internet/ICA
 * discovery.
 */
export const DataspaceDiscoverySourceMode = Object.freeze({
  DefaultFirst: 'default-first',
  DefaultsOnly: 'defaults-only',
  InternetFirst: 'internet-first',
} as const);

export type DataspaceDiscoverySourceModeValue =
  typeof DataspaceDiscoverySourceMode[keyof typeof DataspaceDiscoverySourceMode];
