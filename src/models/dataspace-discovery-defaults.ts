// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import type { DataspaceDiscoverySourceModeValue } from '../constants/dataspace-discovery';
import type { HostingOperatorSemanticRecord } from './dataspace-discovery';

/**
 * Shared host/ICA context used to select dataspace discovery defaults.
 *
 * `networkType` belongs to the host/ICA side.
 * Tenant/provider resolution later uses `sector`.
 */
export type DataspaceDiscoveryNetworkContext = Readonly<{
  jurisdiction: string;
  version: string;
  networkType: string;
}>;

/**
 * Configured ICA seed for a given host/network context.
 */
export type DefaultIcaRegistration = DataspaceDiscoveryNetworkContext & Readonly<{
  icaUrl: string;
  icaDid?: string;
  title?: string;
}>;

/**
 * Configured hosting-operator seed for a given host/network context.
 *
 * This mirrors the record shape consumed later by backend resolvers.
 */
export type DefaultHostingOperatorRegistration = DataspaceDiscoveryNetworkContext & Readonly<{
  operatorDid: string;
  discoveryUrl?: string;
  catalogUrl?: string;
  record: HostingOperatorSemanticRecord;
  title?: string;
}>;

/**
 * Optional seed data used when constructing a defaults registry.
 */
export type DataspaceDiscoveryDefaultsRegistrySeed = Readonly<{
  icas?: readonly DefaultIcaRegistration[];
  hostingOperators?: readonly DefaultHostingOperatorRegistration[];
}>;

/**
 * Filter used to list configured ICA defaults for a host/network context.
 */
export type DataspaceDiscoveryDefaultIcaFilter = Readonly<Partial<DataspaceDiscoveryNetworkContext>>;

/**
 * Filter used to list configured hosting-operator defaults for a discovery
 * request.
 */
export type DataspaceDiscoveryDefaultHostingFilter =
  Readonly<Partial<DataspaceDiscoveryNetworkContext> & {
    sector?: string;
    coverageScope?: string;
    requiredCapabilities?: readonly string[];
  }>;

/**
 * Input used to decide how a backend should bootstrap discovery for a
 * frontend/API request.
 */
export type DataspaceDiscoveryBootstrapInput = DataspaceDiscoveryNetworkContext & Readonly<{
  sector: string;
  coverageScope?: string;
  requiredCapabilities?: readonly string[];
  sourceMode?: DataspaceDiscoverySourceModeValue;
}>;

/**
 * Bootstrap plan returned by the defaults registry.
 *
 * Backend usage:
 * - use `hostingOperators` immediately when `shouldUseDefaultsFirst` is true
 * - try live ICA/internet only when `shouldTryInternet` is true
 */
export type DataspaceDiscoveryBootstrapPlan = Readonly<{
  sourceMode: DataspaceDiscoverySourceModeValue;
  icas: DefaultIcaRegistration[];
  hostingOperators: DefaultHostingOperatorRegistration[];
  hasDefaults: boolean;
  shouldUseDefaultsFirst: boolean;
  shouldTryInternet: boolean;
}>;
