// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

export type AuthorityResolutionSource =
  | 'catalog'
  | 'metadata'
  | 'cache'
  | 'legacy';

export type AuthorityResolutionMatch =
  | 'tenant-context'
  | 'subject-did'
  | 'subject-same-as'
  | 'authority-did'
  | 'authority-base-url';

/**
 * Runtime-neutral request shape used to resolve which authority/host is
 * responsible for one tenant or subject identifier.
 *
 * Design rule:
 * - business callers should prefer `tenantId + jurisdiction + sector`
 * - callers may additionally provide `subjectDid` or `subjectSameAs` when that
 *   is the only identifier already known
 * - `authorityDidWeb` and `authorityBaseUrl` are optional technical hints, not
 *   the preferred business inputs
 */
export type AuthorityResolutionInput = Readonly<{
  tenantId?: string;
  jurisdiction?: string;
  sector?: string;
  version?: string;
  subjectDid?: string;
  subjectSameAs?: string;
  authorityDidWeb?: string;
  authorityBaseUrl?: string;
  metadataUrl?: string;
}>;

/**
 * One published or preloaded authority catalog entry.
 *
 * The current minimal contract is intentionally small:
 * - enough to route to one host/ICA quickly
 * - enough to derive the hosted tenant DID when tenant context is known
 * - enough to match by public subject alias prefixes in future registries
 */
export type AuthorityCatalogRecord = Readonly<{
  authorityDidWeb: string;
  authorityBaseUrl?: string;
  tenantDidWeb?: string;
  tenantId?: string;
  jurisdiction?: string;
  version?: string;
  sector?: string;
  metadataUrl?: string;
  subjectDidPrefixes?: readonly string[];
  subjectSameAsPrefixes?: readonly string[];
}>;

/**
 * Normalized authority resolution output returned by shared discovery helpers.
 */
export type AuthorityResolution = Readonly<{
  authorityDidWeb: string;
  authorityBaseUrl?: string;
  tenantDidWeb?: string;
  metadataUrl?: string;
  source: AuthorityResolutionSource;
  matchedBy: AuthorityResolutionMatch;
  record?: AuthorityCatalogRecord;
}>;
