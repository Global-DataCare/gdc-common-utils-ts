// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Canonical Dataspace Protocol version identifiers used by the current GW/SDK
 * discovery flows.
 */
export const DataspaceProtocolVersions = Object.freeze({
  Current: '2025-1',
} as const);

/**
 * Canonical well-known paths used by Dataspace Protocol discovery.
 */
export const DataspaceWellKnownPaths = Object.freeze({
  VersionMetadata: '/.well-known/dspace-version',
} as const);

/**
 * Project-local GW CORE DSP binding paths.
 *
 * These preserve the current internal API structure while still ending in the
 * DSP catalog route shapes.
 */
export const GwDataspaceBindingPaths = Object.freeze({
  Base: '/dsp',
  CatalogCollectionSuffix: '/catalog',
  CatalogRequestSuffix: '/catalog/request',
  CatalogArtifactSuffix: '/catalog/dcat.json',
  CatalogDatasetsPrefix: '/catalog/datasets',
} as const);

export type DataspaceProtocolVersionValue =
  typeof DataspaceProtocolVersions[keyof typeof DataspaceProtocolVersions];
