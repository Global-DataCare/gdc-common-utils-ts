// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  DataspaceDiscoverySourceMode,
  type DataspaceDiscoverySourceModeValue,
} from '../constants/dataspace-discovery';
import { normalizeCountryCode } from '../constants/eu-countries';
import type {
  DataspaceDiscoveryBootstrapInput,
  DataspaceDiscoveryBootstrapPlan,
  DataspaceDiscoveryDefaultHostingFilter,
  DataspaceDiscoveryDefaultIcaFilter,
  DataspaceDiscoveryDefaultsRegistrySeed,
  DefaultHostingOperatorRegistration,
  DefaultIcaRegistration,
} from '../models/dataspace-discovery-defaults';
import type { PublishedProviderCatalogRecord } from '../models/dataspace-discovery';
import { buildOrganizationDidWeb, getBaseUrlFromDidWeb } from './did';
import { matchesHostingOperatorDiscoveryFilter } from './dataspace-discovery';

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeAuthority(value: unknown): string {
  const raw = normalizeString(value).replace(/\/+$/, '');
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) {
    try {
      return new URL(raw).host;
    } catch {
      return raw.replace(/^https?:\/\//i, '');
    }
  }
  return raw;
}

function getProtocolForAuthority(authority: string): string {
  const normalized = authority.trim().toLowerCase();
  return normalized.startsWith('localhost')
    || normalized.startsWith('127.0.0.1')
    || normalized.startsWith('[::1]')
    ? 'http'
    : 'https';
}

function encodeDidWebAuthority(authority: string): string {
  return authority.replace(/:/g, '%3A').toLowerCase();
}

function buildDidWebFromAuthority(authority: string): string {
  return `did:web:${encodeDidWebAuthority(authority)}`;
}

function normalizeCapabilities(values: readonly string[] | undefined): string[] {
  return Array.from(new Set((values || []).map((value) => normalizeString(value)).filter(Boolean)));
}

function normalizePublishedProvider(
  input: PublishedProviderCatalogRecord,
): PublishedProviderCatalogRecord {
  return {
    providerDid: normalizeString(input.providerDid),
    serviceType: normalizeString(input.serviceType),
    category: normalizeString(input.category),
    areaServed: normalizeCapabilities(
      Array.isArray(input.areaServed)
        ? input.areaServed
        : normalizeString(input.areaServed)
          ? normalizeString(input.areaServed).split(',')
          : undefined,
    ).join(',') || undefined,
    endpointUrl: normalizeString(input.endpointUrl) || undefined,
    discoveryUrl: normalizeString(input.discoveryUrl) || undefined,
    catalogUrl: normalizeString(input.catalogUrl) || undefined,
  };
}

function normalizeIcaRegistration(input: DefaultIcaRegistration): DefaultIcaRegistration {
  return {
    jurisdiction: normalizeString(input.jurisdiction),
    version: normalizeString(input.version),
    networkType: normalizeString(input.networkType),
    icaUrl: normalizeString(input.icaUrl),
    icaDid: normalizeString(input.icaDid) || undefined,
    title: normalizeString(input.title) || undefined,
  };
}

function normalizeHostingOperatorRegistration(
  input: DefaultHostingOperatorRegistration,
): DefaultHostingOperatorRegistration {
  return {
    jurisdiction: normalizeString(input.jurisdiction),
    version: normalizeString(input.version),
    networkType: normalizeString(input.networkType),
    operatorDid: normalizeString(input.operatorDid),
    discoveryUrl: normalizeString(input.discoveryUrl) || undefined,
    catalogUrl: normalizeString(input.catalogUrl) || undefined,
    record: {
      ...input.record,
      subjectId: normalizeString(input.record.subjectId) || undefined,
      serviceTypes: normalizeCapabilities(input.record.serviceTypes),
      categories: Array.from(new Set((input.record.categories || []).map((value) => normalizeString(value)).filter(Boolean))),
      areaServed: Array.from(new Set((input.record.areaServed || []).map((value) => normalizeString(value)).filter(Boolean))),
      addressCountry: normalizeString(input.record.addressCountry) || undefined,
      coverageScope: normalizeString(input.record.coverageScope) || undefined,
    },
    publishedProviders: (input.publishedProviders || []).map((provider) => normalizePublishedProvider(provider)),
    title: normalizeString(input.title) || undefined,
  };
}

function matchesNetworkContext(
  left: Readonly<{ jurisdiction: string; version: string; networkType: string }>,
  right: Readonly<Partial<{ jurisdiction: string; version: string; networkType: string }>>,
): boolean {
  if (right.jurisdiction && normalizeString(right.jurisdiction) !== left.jurisdiction) return false;
  if (right.version && normalizeString(right.version) !== left.version) return false;
  if (right.networkType && normalizeString(right.networkType) !== left.networkType) return false;
  return true;
}

export type BuildDefaultIcaRegistrationFromAuthorityInput = Readonly<{
  authority: string;
  jurisdiction: string;
  version: string;
  networkType: string;
  title?: string;
}>;

export type BuildDefaultHostingOperatorRegistrationFromAuthorityInput = Readonly<{
  authority: string;
  jurisdiction: string;
  version: string;
  networkType: string;
  sector: string;
  serviceTypes: readonly string[];
  title?: string;
  areaServed?: readonly string[];
  addressCountry?: string;
  coverageScope?: string;
}>;

export type BuildDefaultPublishedProviderRecordFromTenantInput = Readonly<{
  hostAuthority: string;
  tenantId: string;
  jurisdiction: string;
  version: string;
  sector: string;
  providerCapability: string;
  areaServed?: readonly string[];
  /**
   * Optional public domain for a future externally visible provider surface.
   *
   * For now most deployments will not use it, so the helper falls back to the
   * hosted/internal tenant route under the hosting operator domain.
   */
  externalDomain?: string;
}>;

/**
 * Builds one ICA default seed from a domain/IP authority.
 *
 * This helper exists so integrators do not have to handcraft:
 * - the `did:web`
 * - the well-known ICA URL
 * - the repeated host/network context fields
 */
export function buildDefaultIcaRegistrationFromAuthority(
  input: BuildDefaultIcaRegistrationFromAuthorityInput,
): DefaultIcaRegistration {
  const authority = normalizeAuthority(input.authority);
  const protocol = getProtocolForAuthority(authority);
  return normalizeIcaRegistration({
    jurisdiction: input.jurisdiction,
    version: input.version,
    networkType: input.networkType,
    title: input.title,
    icaUrl: `${protocol}://${authority}/.well-known/ica-configuration`,
    icaDid: buildDidWebFromAuthority(authority),
  });
}

/**
 * Builds one hosting-operator default seed from a domain/IP authority.
 *
 * This helper exists so integrators do not have to handcraft:
 * - the `did:web`
 * - the host-scoped DSP discovery URL
 * - the semantic host record shape
 */
export function buildDefaultHostingOperatorRegistrationFromAuthority(
  input: BuildDefaultHostingOperatorRegistrationFromAuthorityInput,
): DefaultHostingOperatorRegistration {
  const authority = normalizeAuthority(input.authority);
  const protocol = getProtocolForAuthority(authority);
  const addressCountry = normalizeCountryCode(input.addressCountry) || normalizeCountryCode(input.jurisdiction);
  const coverageScope = normalizeString(input.coverageScope) || undefined;
  const areaServed = Array.from(new Set(
    (input.areaServed || [input.jurisdiction])
      .map((value) => normalizeString(value))
      .filter(Boolean),
  ));
  return normalizeHostingOperatorRegistration({
    jurisdiction: input.jurisdiction,
    version: input.version,
    networkType: input.networkType,
    title: input.title,
    operatorDid: buildDidWebFromAuthority(authority),
    discoveryUrl: `${protocol}://${authority}/host/cds-${input.jurisdiction}/${input.version}/${input.networkType}/.well-known/dspace-version`,
    record: {
      subjectId: buildDidWebFromAuthority(authority),
      serviceTypes: [...input.serviceTypes],
      categories: [normalizeString(input.sector)],
      areaServed,
      addressCountry: addressCountry || undefined,
      coverageScope,
    },
  });
}

/**
 * Builds one published-provider default entry from a tenant id under a given
 * hosting operator authority.
 *
 * Integrator-friendly rule:
 * - the backend usually knows `tenantId`
 * - it usually does not want to handcraft the hosted/internal `did:web`
 * - this helper derives the hosted provider DID and tenant-scoped DSP URLs
 */
export function buildDefaultPublishedProviderRecordFromTenant(
  input: BuildDefaultPublishedProviderRecordFromTenantInput,
): PublishedProviderCatalogRecord {
  const hostAuthority = normalizeAuthority(input.hostAuthority);
  const hostDidWeb = buildDidWebFromAuthority(hostAuthority);
  const providerDid = buildOrganizationDidWeb({
    hostDidWeb,
    tenantId: input.tenantId,
    jurisdiction: input.jurisdiction,
    version: input.version,
    sector: input.sector,
  });
  const providerBaseUrl = normalizeAuthority(input.externalDomain)
    ? `${getProtocolForAuthority(normalizeAuthority(input.externalDomain))}://${normalizeAuthority(input.externalDomain)}/`
    : getBaseUrlFromDidWeb(providerDid);
  const areaServed = normalizeCapabilities(
    (input.areaServed || [input.jurisdiction]).map((value) => normalizeString(value)),
  ).join(',') || undefined;

  return normalizePublishedProvider({
    providerDid,
    serviceType: input.providerCapability,
    category: input.sector,
    areaServed,
    endpointUrl: providerBaseUrl,
    discoveryUrl: new URL('.well-known/dspace-version', providerBaseUrl).toString(),
    catalogUrl: new URL('dsp/catalog/dcat.json', providerBaseUrl).toString(),
  });
}

/**
 * Mutable in-memory registry for discovery defaults used by portal/backend
 * bootstrap code.
 *
 * Scope:
 * - ICA defaults are indexed by `jurisdiction + version + networkType`
 * - hosting defaults are indexed by `jurisdiction + version + networkType`
 * - sector filtering is applied only when listing hosting operators, because
 *   sectors belong to tenant/provider discovery rather than to the host network
 *
 * This registry is intentionally simple and synchronous so backend code can
 * preload defaults during startup and immediately serve the frontend in
 * `defaults-only` or `default-first` mode.
 */
export class DataspaceDiscoveryDefaultsRegistry {
  private readonly icas: DefaultIcaRegistration[] = [];
  private readonly hostingOperators: DefaultHostingOperatorRegistration[] = [];

  constructor(seed: DataspaceDiscoveryDefaultsRegistrySeed = {}) {
    for (const registration of seed.icas || []) {
      this.addIca(registration);
    }
    for (const registration of seed.hostingOperators || []) {
      this.addHostingOperator(registration);
    }
  }

  /**
   * Adds one ICA default for a concrete host/network context.
   *
   * @example
   * ```ts
   * registry.addIca({
   *   jurisdiction: 'ES',
   *   version: 'v1',
   *   networkType: 'test',
   *   icaUrl: 'https://ica.example.org',
   * });
   * ```
   */
  public addIca(input: DefaultIcaRegistration): this {
    this.icas.push(normalizeIcaRegistration(input));
    return this;
  }

  /**
   * Adds one hosting-operator default for a concrete host/network context.
   *
   * The record itself may later serve multiple sectors depending on the
   * semantic categories and capabilities published in `record`.
   */
  public addHostingOperator(input: DefaultHostingOperatorRegistration): this {
    this.hostingOperators.push(normalizeHostingOperatorRegistration(input));
    return this;
  }

  /**
   * Lists configured ICA defaults for a host/network context.
   */
  public listIcas(filter: DataspaceDiscoveryDefaultIcaFilter = {}): DefaultIcaRegistration[] {
    return this.icas
      .filter((registration) => matchesNetworkContext(registration, filter))
      .map((registration) => ({ ...registration }));
  }

  /**
   * Lists configured hosting-operator defaults for a frontend/backend discovery
   * request.
   *
   * Sector and capability filtering are applied against the semantic host
   * record because those dimensions belong to the provider/tenant side.
   */
  public listHostingOperators(
    filter: DataspaceDiscoveryDefaultHostingFilter = {},
  ): DefaultHostingOperatorRegistration[] {
    return this.hostingOperators
      .filter((registration) => matchesNetworkContext(registration, filter))
      .filter((registration) => {
        if (!filter.sector) return true;
        return matchesHostingOperatorDiscoveryFilter(registration.record, {
          sector: normalizeString(filter.sector),
          coverageScope: normalizeString(filter.coverageScope) || undefined,
          requiredCapabilities: normalizeCapabilities(filter.requiredCapabilities),
        });
      })
      .map((registration) => ({
        ...registration,
        record: {
          ...registration.record,
          serviceTypes: [...registration.record.serviceTypes],
          categories: [...registration.record.categories],
          areaServed: [...registration.record.areaServed],
        },
        publishedProviders: (registration.publishedProviders || []).map((provider) => ({
          ...provider,
        })),
      }));
  }

  /**
   * Builds the backend bootstrap plan for one provider-discovery request.
   *
   * Current default-first policy:
   * - use configured hosting defaults immediately when they exist
   * - only try live ICA/internet when no host defaults match the request and at
   *   least one ICA default is configured for the same host/network context
   */
  public buildBootstrapPlan(
    input: DataspaceDiscoveryBootstrapInput,
  ): DataspaceDiscoveryBootstrapPlan {
    const sourceMode = normalizeString(input.sourceMode) as DataspaceDiscoverySourceModeValue
      || DataspaceDiscoverySourceMode.DefaultFirst;
    const icas = this.listIcas(input);
    const hostingOperators = this.listHostingOperators(input);
    const hasDefaults = Boolean(icas.length || hostingOperators.length);
    const shouldUseDefaultsFirst = sourceMode !== DataspaceDiscoverySourceMode.InternetFirst;
    const shouldTryInternet = sourceMode !== DataspaceDiscoverySourceMode.DefaultsOnly
      && icas.length > 0
      && (
        sourceMode === DataspaceDiscoverySourceMode.InternetFirst
        || hostingOperators.length === 0
      );

    return {
      sourceMode,
      icas,
      hostingOperators,
      hasDefaults,
      shouldUseDefaultsFirst,
      shouldTryInternet,
    };
  }
}

/**
 * Convenience factory for the in-memory defaults registry.
 */
export function createDataspaceDiscoveryDefaultsRegistry(
  seed: DataspaceDiscoveryDefaultsRegistrySeed = {},
): DataspaceDiscoveryDefaultsRegistry {
  return new DataspaceDiscoveryDefaultsRegistry(seed);
}
