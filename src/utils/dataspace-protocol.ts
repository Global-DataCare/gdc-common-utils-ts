// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  DataspaceProtocolVersions,
  DataspaceWellKnownPaths,
  GwDataspaceBindingPaths,
  type DataspaceProtocolVersionValue,
} from '../constants/dataspace-protocol';
import type {
  DspaceProtocolVersionEntry,
  DspaceVersionMetadata,
} from '../models/dataspace-protocol';

/**
 * Route context used to build tenant-scoped or host-scoped GW CORE DSP paths.
 *
 * Semantic rule:
 * - `tenantId` participants use `businessSector`
 * - `host`/ICA/runtime participants use `hostNetwork`
 */
export type GwDataspaceRouteContext = Readonly<{
  participantId?: string;
  tenantId?: string;
  jurisdiction?: string;
  version?: string;
  hostNetwork?: string;
  /** @deprecated Use `hostNetwork`. */
  hostNetworkOrBusinessSector?: string;
  businessSector?: string;
  sector?: string;
}>;

function resolveParticipantId(input: GwDataspaceRouteContext): string {
  return String(input.participantId || input.tenantId || '').trim();
}

function resolveSectorLikeSegment(input: GwDataspaceRouteContext): string {
  return String(
    input.hostNetwork
    || input.hostNetworkOrBusinessSector
    || input.businessSector
    || input.sector
    || '',
  ).trim();
}

function hasParticipantRouteContext(input: GwDataspaceRouteContext): boolean {
  return Boolean(
    resolveParticipantId(input)
    && String(input.jurisdiction || '').trim()
    && String(input.version || '').trim()
    && resolveSectorLikeSegment(input),
  );
}

/**
 * Builds the GW CORE base DSP path.
 *
 * Participant scope:
 * - `/{participantId}/cds-{jurisdiction}/{version}/{hostNetwork|businessSector}/dsp`
 */
export function buildGwDataspaceBasePath(input: GwDataspaceRouteContext = {}): string {
  if (!hasParticipantRouteContext(input)) {
    return GwDataspaceBindingPaths.Base;
  }

  return `/${resolveParticipantId(input)}`
    + `/cds-${String(input.jurisdiction).trim()}`
    + `/${String(input.version).trim()}`
    + `/${resolveSectorLikeSegment(input)}`
    + GwDataspaceBindingPaths.Base;
}

/**
 * Builds the canonical DSP version-discovery well-known path for GW CORE.
 *
 * Participant scope:
 * - `/{participantId}/cds-{jurisdiction}/{version}/{hostNetwork|businessSector}/.well-known/dspace-version`
 */
export function buildGwDspaceVersionWellKnownPath(input: GwDataspaceRouteContext = {}): string {
  if (!hasParticipantRouteContext(input)) {
    return DataspaceWellKnownPaths.VersionMetadata;
  }

  return `/${resolveParticipantId(input)}`
    + `/cds-${String(input.jurisdiction).trim()}`
    + `/${String(input.version).trim()}`
    + `/${resolveSectorLikeSegment(input)}`
    + DataspaceWellKnownPaths.VersionMetadata;
}

/**
 * Builds the project-local GW CORE DSP catalog request endpoint.
 */
export function buildGwCatalogRequestPath(input: GwDataspaceRouteContext = {}): string {
  return `${buildGwDataspaceBasePath(input)}${GwDataspaceBindingPaths.CatalogRequestSuffix}`;
}

/**
 * Builds the GW CORE catalog collection base path.
 */
export function buildGwCatalogCollectionPath(input: GwDataspaceRouteContext = {}): string {
  return `${buildGwDataspaceBasePath(input)}${GwDataspaceBindingPaths.CatalogCollectionSuffix}`;
}

/**
 * Builds the project-local GW CORE catalog artifact URL path used for public
 * read-only autodiscovery.
 */
export function buildGwCatalogArtifactPath(input: GwDataspaceRouteContext = {}): string {
  return `${buildGwDataspaceBasePath(input)}${GwDataspaceBindingPaths.CatalogArtifactSuffix}`;
}

/**
 * Builds the project-local GW CORE dataset lookup path.
 */
export function buildGwCatalogDatasetPath(
  input: GwDataspaceRouteContext = {},
  datasetId = ':id',
): string {
  return `${buildGwDataspaceBasePath(input)}${GwDataspaceBindingPaths.CatalogDatasetsPrefix}/${datasetId}`;
}

/**
 * Builds a minimal DSP version metadata payload for a given GW CORE DSP base
 * path.
 */
export function buildDspaceVersionMetadata(
  path: string,
  version: DataspaceProtocolVersionValue = DataspaceProtocolVersions.Current,
): DspaceVersionMetadata {
  return {
    protocolVersions: [
      {
        version,
        path,
      },
    ],
  };
}

/**
 * Selects the preferred advertised DSP version entry from a `dspace-version`
 * payload.
 */
export function selectDspaceProtocolVersionEntry(
  metadata: DspaceVersionMetadata | null | undefined,
  version: string = DataspaceProtocolVersions.Current,
): DspaceProtocolVersionEntry | undefined {
  const entries = metadata?.protocolVersions || [];
  return entries.find((entry) => String(entry.version || '').trim() === String(version).trim())
    || entries[0];
}

/**
 * Derives the GW CORE catalog artifact URL from a `dspace-version` endpoint URL
 * and its parsed payload.
 */
export function deriveGwCatalogArtifactUrlFromDspaceVersion(
  dspaceVersionUrl: string,
  metadata: DspaceVersionMetadata | null | undefined,
  version: string = DataspaceProtocolVersions.Current,
): string | undefined {
  const entry = selectDspaceProtocolVersionEntry(metadata, version);
  if (!entry?.path) return undefined;
  const base = new URL(dspaceVersionUrl);
  return new URL(`${String(entry.path).trim()}${GwDataspaceBindingPaths.CatalogArtifactSuffix}`, `${base.protocol}//${base.host}`).toString();
}
