// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Canonical shared coverage scopes derived from semantic service metadata.
 *
 * `EU` is a coverage scope, not a sector.
 */
export const DataspaceCoverageScope = {
  EuropeanUnion: 'EU',
} as const;

export type DataspaceCoverageScopeValue =
  typeof DataspaceCoverageScope[keyof typeof DataspaceCoverageScope];

/**
 * Runtime-neutral service-discovery record normalized from a semantic
 * `credentialSubject` and optionally its flattened `meta.claims` projection.
 */
export type DataspaceServiceSemanticRecord = Readonly<{
  subjectId?: string;
  serviceTypes: string[];
  categories: string[];
  areaServed: string[];
  addressCountry?: string;
  coverageScope?: string;
}>;

/**
 * Semantic hosting-operator record extracted from an ICA-issued VC or
 * equivalent semantic payload.
 */
export type HostingOperatorSemanticRecord = DataspaceServiceSemanticRecord;

/**
 * Semantic tenant-service record extracted from an ICA-issued VC or equivalent
 * semantic payload.
 */
export type TenantServiceSemanticRecord = DataspaceServiceSemanticRecord;

/**
 * Public provider entry expected from a host discovery catalog.
 */
export type PublishedProviderCatalogRecord = Readonly<{
  providerDid: string;
  serviceType: string;
  category: string;
  areaServed?: string;
  endpointUrl?: string;
  catalogUrl?: string;
}>;

/**
 * Shared host-catalog filter for service autodiscovery.
 *
 * This shape is runtime-neutral and can be reused by GW, ICA, backend SDKs,
 * and portal/native-app backends.
 */
export type DataspaceDiscoveryFilter = Readonly<{
  sector: string;
  capability?: string;
  requiredCapabilities?: readonly string[];
  jurisdiction?: string;
  coverageScope?: string;
}>;

/**
 * Public host/operator service-autodiscovery catalog.
 *
 * This is distinct from any dataset-specific catalog exposed by an individual
 * `DigitalTwinProvider`.
 */
export type HostingOperatorDiscoveryCatalog = Readonly<{
  hostingOperatorDid?: string;
  catalogUrl?: string;
  providers: PublishedProviderCatalogRecord[];
}>;
