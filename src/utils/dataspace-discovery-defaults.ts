// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  DataspaceDiscoverySourceMode,
  type DataspaceDiscoverySourceModeValue,
} from '../constants/dataspace-discovery';
import type {
  DataspaceDiscoveryBootstrapInput,
  DataspaceDiscoveryBootstrapPlan,
  DataspaceDiscoveryDefaultHostingFilter,
  DataspaceDiscoveryDefaultIcaFilter,
  DataspaceDiscoveryDefaultsRegistrySeed,
  DefaultHostingOperatorRegistration,
  DefaultIcaRegistration,
} from '../models/dataspace-discovery-defaults';
import { matchesHostingOperatorDiscoveryFilter } from './dataspace-discovery';

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeCapabilities(values: readonly string[] | undefined): string[] {
  return Array.from(new Set((values || []).map((value) => normalizeString(value)).filter(Boolean)));
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
