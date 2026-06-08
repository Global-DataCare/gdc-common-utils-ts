// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ClaimsOrganizationSchemaorg, ClaimsServiceSchemaorg } from '../constants/schemaorg';
import { isEuCountryCode, normalizeCountryCode } from '../constants/eu-countries';
import {
  isProviderServiceCapability,
  parseServiceCapabilityTokens,
} from '../constants/service-capabilities';
import {
  DataspaceCoverageScope,
  type DataspaceDiscoveryFilter,
  type DataspaceServiceSemanticRecord,
  type HostingOperatorSemanticRecord,
  type HostingOperatorDiscoveryCatalog,
  type PublishedProviderCatalogRecord,
  type TenantServiceSemanticRecord,
} from '../models/dataspace-discovery';

type JsonObject = Record<string, unknown>;

function asObject(value: unknown): JsonObject | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonObject
    : undefined;
}

function asNonEmptyString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export type DiscoveryCatalogFetchResponse = Readonly<{
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
  text(): Promise<string>;
}>;

export const DiscoveryCatalogSource = Object.freeze({
  Internet: 'internet',
  Cache: 'cache',
  Default: 'default',
} as const);

export type DiscoveryCatalogSourceValue =
  typeof DiscoveryCatalogSource[keyof typeof DiscoveryCatalogSource];

export type DiscoveryCatalogFetcherOptions = Readonly<{
  internetCatalogs?: Record<string, HostingOperatorDiscoveryCatalog>;
  internetJsonByUrl?: Record<string, unknown>;
  defaultCatalogs?: Record<string, HostingOperatorDiscoveryCatalog>;
}>;

export type DiscoveryCatalogFetcherHarness = Readonly<{
  fetcher(input: string, init?: unknown): Promise<DiscoveryCatalogFetchResponse>;
  calls: string[];
  sources: Map<string, DiscoveryCatalogSourceValue>;
  cache: Map<string, HostingOperatorDiscoveryCatalog>;
  setInternetCatalog(url: string, catalog: HostingOperatorDiscoveryCatalog): void;
  setInternetJson(url: string, payload: unknown): void;
  setInternetFailure(url: string, status?: number, body?: unknown): void;
  clearInternetRoute(url: string): void;
}>;

function createDiscoveryCatalogFetchResponse(
  payload: unknown,
  init: Readonly<{ ok?: boolean; status?: number }> = {},
): DiscoveryCatalogFetchResponse {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => payload,
    text: async () => JSON.stringify(payload),
  };
}

export type DefaultPublishedProviderCatalogRecordInput = Readonly<{
  providerDid: string;
  serviceType: string;
  category: string;
  areaServed?: string | readonly string[];
  endpointUrl?: string;
  discoveryUrl?: string;
  catalogUrl?: string;
}>;

export type DefaultHostingOperatorDiscoveryCatalogInput = Readonly<{
  hostingOperatorDid?: string;
  discoveryUrl?: string;
  catalogUrl?: string;
  providers?: ReadonlyArray<PublishedProviderCatalogRecord>;
}>;

function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return Array.from(new Set(
      value
        .flatMap((entry) => toStringList(entry))
        .map((entry) => entry.trim())
        .filter(Boolean),
    ));
  }
  const raw = asNonEmptyString(value);
  if (!raw) return [];
  return Array.from(new Set(
    raw
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean),
  ));
}

function normalizeList(values: string[]): string[] {
  return Array.from(new Set(
    values
      .map((value) => value.trim())
      .filter(Boolean),
  ));
}

function sameNormalizedList(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false;
  const normalizedLeft = [...normalizeList(left)].sort();
  const normalizedRight = [...normalizeList(right)].sort();
  return normalizedLeft.every((value, index) => value === normalizedRight[index]);
}

function parseAreaServedValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return normalizeList(value.flatMap((entry) => parseAreaServedValue(entry)));
  }
  if (typeof value === 'string') {
    return toStringList(value);
  }
  const objectValue = asObject(value);
  if (!objectValue) return [];
  return normalizeList([
    asNonEmptyString(objectValue.name),
    asNonEmptyString(objectValue['@id']),
    asNonEmptyString(objectValue.id),
  ].filter(Boolean));
}

function getSemanticCredentialSubject(input: unknown): JsonObject | undefined {
  const objectInput = asObject(input);
  if (!objectInput) return undefined;
  const credentialSubject = asObject(objectInput.credentialSubject);
  if (credentialSubject) return credentialSubject;
  return objectInput;
}

function getFlattenedClaims(input: unknown): JsonObject | undefined {
  const objectInput = asObject(input);
  if (!objectInput) return undefined;
  const meta = asObject(objectInput.meta);
  const claims = asObject(meta?.claims);
  return claims;
}

function getSemanticServiceTypes(subject: JsonObject | undefined): string[] {
  return parseServiceTypeClaims(subject?.serviceType, subject?.additionalType);
}

function getSemanticCategories(subject: JsonObject | undefined): string[] {
  return toStringList(subject?.category);
}

function getSemanticAreaServed(subject: JsonObject | undefined): string[] {
  return parseAreaServedValue(subject?.areaServed);
}

function getSemanticAddressCountry(subject: JsonObject | undefined): string {
  const address = asObject(subject?.address);
  return normalizeCountryCode(asNonEmptyString(address?.addressCountry));
}

function getFlattenedServiceTypes(claims: JsonObject | undefined): string[] {
  return parseServiceTypeClaims(
    claims?.[ClaimsServiceSchemaorg.serviceType],
    claims?.[ClaimsServiceSchemaorg.additionalType],
  );
}

function getFlattenedCategories(claims: JsonObject | undefined): string[] {
  return toStringList(claims?.[ClaimsServiceSchemaorg.category]);
}

function getFlattenedAreaServed(claims: JsonObject | undefined): string[] {
  return parseAreaServedValue(claims?.[ClaimsServiceSchemaorg.areaServed]);
}

function getFlattenedAddressCountry(claims: JsonObject | undefined): string {
  return normalizeCountryCode(asNonEmptyString(claims?.[ClaimsOrganizationSchemaorg.addressCountry]));
}

function assertNoMismatch(kind: string, semantic: string[], flattened: string[]): void {
  if (!semantic.length || !flattened.length) return;
  if (!sameNormalizedList(semantic, flattened)) {
    throw new Error(`Dataspace discovery mismatch for ${kind}: credentialSubject and meta.claims disagree.`);
  }
}

function assertNoScalarMismatch(kind: string, semantic: string, flattened: string): void {
  if (!semantic || !flattened) return;
  if (semantic !== flattened) {
    throw new Error(`Dataspace discovery mismatch for ${kind}: credentialSubject and meta.claims disagree.`);
  }
}

/**
 * Parses the CSV or array representation of `serviceType`.
 *
 * @param value Semantic `credentialSubject.serviceType` or flattened
 * `meta.claims['org.schema.Service.serviceType']`.
 * @returns Normalized unique service capability tokens.
 *
 * @example
 * ```ts
 * parseServiceTypeCsv('organization/Composition.cruds,organization/ResearchSubject.rs');
 * // ['organization/Composition.cruds', 'organization/ResearchSubject.rs']
 * ```
 */
export function parseServiceTypeCsv(value: unknown): string[] {
  if (Array.isArray(value)) {
    return Array.from(new Set(
      value.flatMap((entry) => parseServiceTypeCsv(entry)),
    ));
  }
  return parseServiceCapabilityTokens(value);
}

/**
 * Parses service capability tokens from both `serviceType` and `additionalType`.
 */
export function parseServiceTypeClaims(serviceTypeValue: unknown, additionalTypeValue?: unknown): string[] {
  return Array.from(new Set([
    ...parseServiceTypeCsv(serviceTypeValue),
    ...parseServiceTypeCsv(additionalTypeValue),
  ]));
}

/**
 * Parses the Schema.org `category` service dimension used as the dataspace
 * sector vocabulary in the current profile.
 *
 * @param value Semantic `credentialSubject.category` or flattened
 * `meta.claims['org.schema.Service.category']`.
 * @returns Normalized unique sector/category values.
 *
 * @example
 * ```ts
 * parseServiceCategories('animal-care,health-care');
 * // ['animal-care', 'health-care']
 * ```
 */
export function parseServiceCategories(value: unknown): string[] {
  return toStringList(value);
}

/**
 * Parses Schema.org `areaServed` values.
 *
 * Accepts scalar strings, CSV strings, arrays, and simple
 * `AdministrativeArea`-like objects with `name` or `@id`.
 *
 * @param value Semantic `credentialSubject.areaServed` or flattened
 * `meta.claims['org.schema.Service.areaServed']`.
 * @returns Normalized unique coverage values.
 *
 * @example
 * ```ts
 * parseAreaServed([{ '@type': 'AdministrativeArea', name: 'EU' }, 'ES']);
 * // ['EU', 'ES']
 * ```
 */
export function parseAreaServed(value: unknown): string[] {
  return parseAreaServedValue(value);
}

/**
 * Infers a broader coverage scope from an ISO-2 country code.
 *
 * `EU` is returned only as a coverage scope. It must not be treated as a
 * sector.
 *
 * @param countryCode ISO-2 country code, typically from
 * `credentialSubject.address.addressCountry`.
 * @returns `EU` for EU member countries, otherwise the normalized country code.
 *
 * @example
 * ```ts
 * inferCoverageScopeFromCountryCode('ES');
 * // 'EU'
 * ```
 */
export function inferCoverageScopeFromCountryCode(countryCode: string | undefined | null): string | undefined {
  const normalized = normalizeCountryCode(countryCode);
  if (!normalized) return undefined;
  return isEuCountryCode(normalized)
    ? DataspaceCoverageScope.EuropeanUnion
    : normalized;
}

/**
 * Infers a coverage scope from the semantic `credentialSubject`.
 *
 * @param subject Semantic service object containing `address.addressCountry`.
 * @returns Broader coverage scope such as `EU`, or the normalized country code
 * when the country is outside the EU set.
 */
export function inferCoverageScopeFromCredentialSubject(subject: unknown): string | undefined {
  const subjectObject = asObject(subject);
  const address = asObject(subjectObject?.address);
  return inferCoverageScopeFromCountryCode(asNonEmptyString(address?.addressCountry));
}

/**
 * Extracts the shared dataspace service semantics from a VC-like payload.
 *
 * Source-of-truth rule:
 * - semantic values come from `credentialSubject` first
 * - flattened `meta.claims` is accepted as a compatibility projection/fallback
 * - when both exist they must agree
 *
 * @param input VC-like payload, direct semantic object, or equivalent DTO.
 * @returns Runtime-neutral normalized dataspace discovery semantics.
 *
 * @example
 * ```ts
 * extractDataspaceServiceSemanticRecord({
 *   credentialSubject: {
 *     id: 'did:web:provider.example.org',
 *     serviceType: 'organization/Composition.cruds',
 *     category: 'animal-care',
 *     areaServed: { '@type': 'AdministrativeArea', name: 'EU' },
 *     address: { addressCountry: 'ES' },
 *   },
 *   meta: {
 *     claims: {
 *       'org.schema.Service.serviceType': 'organization/Composition.cruds',
 *       'org.schema.Service.category': 'animal-care',
 *       'org.schema.Service.areaServed': 'EU',
 *       'org.schema.Organization.address.addressCountry': 'ES',
 *     },
 *   },
 * });
 * ```
 */
export function extractDataspaceServiceSemanticRecord(input: unknown): DataspaceServiceSemanticRecord {
  const subject = getSemanticCredentialSubject(input);
  const claims = getFlattenedClaims(input);

  const semanticServiceTypes = getSemanticServiceTypes(subject);
  const semanticCategories = getSemanticCategories(subject);
  const semanticAreaServed = getSemanticAreaServed(subject);
  const semanticAddressCountry = getSemanticAddressCountry(subject);

  const flattenedServiceTypes = getFlattenedServiceTypes(claims);
  const flattenedCategories = getFlattenedCategories(claims);
  const flattenedAreaServed = getFlattenedAreaServed(claims);
  const flattenedAddressCountry = getFlattenedAddressCountry(claims);

  assertNoMismatch('serviceType', semanticServiceTypes, flattenedServiceTypes);
  assertNoMismatch('category', semanticCategories, flattenedCategories);
  assertNoMismatch('areaServed', semanticAreaServed, flattenedAreaServed);
  assertNoScalarMismatch('address.addressCountry', semanticAddressCountry, flattenedAddressCountry);

  const serviceTypes = semanticServiceTypes.length ? semanticServiceTypes : flattenedServiceTypes;
  const categories = semanticCategories.length ? semanticCategories : flattenedCategories;
  const areaServed = semanticAreaServed.length ? semanticAreaServed : flattenedAreaServed;
  const addressCountry = semanticAddressCountry || flattenedAddressCountry || undefined;

  return {
    subjectId: asNonEmptyString(subject?.id) || undefined,
    serviceTypes,
    categories,
    areaServed,
    addressCountry,
    coverageScope: inferCoverageScopeFromCountryCode(addressCountry),
  };
}

/**
 * Extracts a hosting-operator semantic record from a VC-like payload.
 *
 * @param input VC-like payload or direct semantic object.
 * @returns Hosting-operator semantic record normalized with the common
 * dataspace extraction rules.
 */
export function extractHostingOperatorSemanticRecord(input: unknown): HostingOperatorSemanticRecord {
  return extractDataspaceServiceSemanticRecord(input);
}

/**
 * Extracts a tenant-service semantic record from a VC-like payload.
 *
 * @param input VC-like payload or direct semantic object.
 * @returns Tenant-service semantic record normalized with the common dataspace
 * extraction rules.
 */
export function extractTenantServiceSemanticRecord(input: unknown): TenantServiceSemanticRecord {
  return extractDataspaceServiceSemanticRecord(input);
}

function matchesCoverageFilter(
  areaServed: readonly string[] | undefined,
  jurisdiction: string | undefined,
  coverageScope: string | undefined,
): boolean {
  const normalizedAreaServed = normalizeList([...(areaServed || [])]);
  if (jurisdiction && !normalizedAreaServed.includes(jurisdiction)) return false;
  if (coverageScope && !normalizedAreaServed.includes(coverageScope)) return false;
  return true;
}

/**
 * Returns whether a normalized hosting-operator record satisfies a service
 * autodiscovery filter.
 */
export function matchesHostingOperatorDiscoveryFilter(
  record: HostingOperatorSemanticRecord,
  filter: DataspaceDiscoveryFilter,
): boolean {
  if (!record.categories.includes(filter.sector)) return false;
  if (!matchesCoverageFilter(record.areaServed, filter.jurisdiction, filter.coverageScope)) return false;
  if (filter.capability && !record.serviceTypes.includes(filter.capability)) return false;
  if (filter.requiredCapabilities?.length) {
    return filter.requiredCapabilities.every((capability) => record.serviceTypes.includes(capability));
  }
  return true;
}

/**
 * Returns whether a published provider catalog entry satisfies a service
 * autodiscovery filter.
 */
export function matchesPublishedProviderDiscoveryFilter(
  record: PublishedProviderCatalogRecord,
  filter: DataspaceDiscoveryFilter,
): boolean {
  if (!isProviderServiceCapability(record.serviceType)) return false;
  if (record.category !== filter.sector) return false;
  if (filter.capability && record.serviceType !== filter.capability) return false;
  return matchesCoverageFilter(
    record.areaServed ? [record.areaServed] : [],
    filter.jurisdiction,
    filter.coverageScope,
  );
}

/**
 * Filters hosting-operator records using the shared service-autodiscovery
 * semantics.
 */
export function filterHostingOperatorsByDiscoveryFilter(
  records: ReadonlyArray<HostingOperatorSemanticRecord>,
  filter: DataspaceDiscoveryFilter,
): HostingOperatorSemanticRecord[] {
  return records.filter((record) => matchesHostingOperatorDiscoveryFilter(record, filter));
}

/**
 * Filters published provider entries using the shared service-autodiscovery
 * semantics.
 */
export function filterPublishedProvidersByDiscoveryFilter(
  records: ReadonlyArray<PublishedProviderCatalogRecord>,
  filter: DataspaceDiscoveryFilter,
): PublishedProviderCatalogRecord[] {
  return records.filter((record) => matchesPublishedProviderDiscoveryFilter(record, filter));
}

/**
 * Filters a host/operator discovery catalog down to the providers that satisfy
 * the requested service-autodiscovery filter.
 */
export function filterHostingOperatorDiscoveryCatalog(
  catalog: HostingOperatorDiscoveryCatalog,
  filter: DataspaceDiscoveryFilter,
): HostingOperatorDiscoveryCatalog {
  return {
    ...catalog,
    providers: filterPublishedProvidersByDiscoveryFilter(catalog.providers, filter),
  };
}

/**
 * Builds a normalized published-provider catalog DTO suitable for:
 *
 * - backend-owned fallback catalogs
 * - default discovery data loaded from configuration
 * - tests that should use the same DTO constructors as production code
 *
 * This helper is intentionally neutral:
 * - no example DIDs
 * - no example URLs
 * - no hidden business defaults
 *
 * @param input Required provider catalog fields plus optional URLs.
 * @returns Normalized published-provider catalog record.
 */
export function buildDefaultPublishedProviderCatalogRecord(
  input: DefaultPublishedProviderCatalogRecordInput,
): PublishedProviderCatalogRecord {
  const normalizedAreaServed = Array.isArray(input.areaServed)
    ? normalizeList(input.areaServed.map((value) => asNonEmptyString(value)).filter(Boolean))
    : toStringList(input.areaServed);
  return {
    providerDid: asNonEmptyString(input.providerDid),
    serviceType: asNonEmptyString(input.serviceType),
    category: asNonEmptyString(input.category),
    areaServed: normalizedAreaServed.length ? normalizedAreaServed.join(',') : undefined,
    endpointUrl: asNonEmptyString(input.endpointUrl) || undefined,
    discoveryUrl: asNonEmptyString(input.discoveryUrl) || undefined,
    catalogUrl: asNonEmptyString(input.catalogUrl) || undefined,
  };
}

/**
 * Builds a normalized hosting-operator discovery catalog DTO suitable for:
 *
 * - backend-owned fallback catalogs
 * - default host catalogs assembled from configuration
 * - tests that should reuse the same constructor as production code
 *
 * @param input Optional host identity fields plus the provider list.
 * @returns Normalized host discovery catalog.
 */
export function buildDefaultHostingOperatorDiscoveryCatalog(
  input: DefaultHostingOperatorDiscoveryCatalogInput = {},
): HostingOperatorDiscoveryCatalog {
  return {
    hostingOperatorDid: asNonEmptyString(input.hostingOperatorDid) || undefined,
    discoveryUrl: asNonEmptyString(input.discoveryUrl) || undefined,
    catalogUrl: asNonEmptyString(input.catalogUrl) || undefined,
    providers: [...(input.providers || [])],
  };
}

function isHostingOperatorCatalogPayload(value: unknown): value is HostingOperatorDiscoveryCatalog {
  const objectValue = asObject(value);
  return Boolean(objectValue && Array.isArray(objectValue.providers));
}

/**
 * Creates a generic host-catalog fetcher with cache and default fallback.
 *
 * Intended use:
 * - docs
 * - SDK integration examples
 * - tests that need to demonstrate the transport boundary around discovery
 *
 * Behavior:
 * - successful network catalog refreshes cache
 * - later network failures reuse cached catalog when available
 * - when both network and cache are unavailable, configured defaults are used
 *
 * Production integrations may follow the same policy while replacing this
 * in-memory harness with real logging, metrics, and storage.
 *
 * @param options Optional initial network and default catalogs keyed by URL.
 * @returns Fetcher plus observable state and mutation helpers.
 */
export function createDiscoveryCatalogFetcher(
  options: DiscoveryCatalogFetcherOptions = {},
): DiscoveryCatalogFetcherHarness {
  const internetResponses = new Map<string, DiscoveryCatalogFetchResponse>([
    ...Object.entries(options.internetCatalogs || {}).map(([url, catalog]) => (
      [url, createDiscoveryCatalogFetchResponse(catalog, { ok: true, status: 200 })] as const
    )),
    ...Object.entries(options.internetJsonByUrl || {}).map(([url, payload]) => (
      [url, createDiscoveryCatalogFetchResponse(payload, { ok: true, status: 200 })] as const
    )),
  ]);
  const internetPayloads = new Map<string, unknown>([
    ...Object.entries(options.internetCatalogs || {}).map(([url, catalog]) => [String(url), catalog] as const),
    ...Object.entries(options.internetJsonByUrl || {}).map(([url, payload]) => [String(url), payload] as const),
  ]);
  const defaultCatalogs = new Map(Object.entries(options.defaultCatalogs || {}));
  const cache = new Map<string, HostingOperatorDiscoveryCatalog>();
  const sources = new Map<string, DiscoveryCatalogSourceValue>();
  const calls: string[] = [];

  return {
    calls,
    sources,
    cache,
    setInternetCatalog(url: string, catalog: HostingOperatorDiscoveryCatalog) {
      internetResponses.set(String(url), createDiscoveryCatalogFetchResponse(catalog, { ok: true, status: 200 }));
      internetPayloads.set(String(url), catalog);
    },
    setInternetJson(url: string, payload: unknown) {
      internetResponses.set(String(url), createDiscoveryCatalogFetchResponse(payload, { ok: true, status: 200 }));
      internetPayloads.set(String(url), payload);
    },
    setInternetFailure(url: string, status = 503, body: unknown = { error: 'temporary failure' }) {
      internetResponses.set(String(url), createDiscoveryCatalogFetchResponse(body, { ok: false, status }));
      internetPayloads.delete(String(url));
    },
    clearInternetRoute(url: string) {
      internetResponses.delete(String(url));
      internetPayloads.delete(String(url));
    },
    async fetcher(input: string): Promise<DiscoveryCatalogFetchResponse> {
      const key = String(input);
      calls.push(key);

      const internetResponse = internetResponses.get(key);
      if (internetResponse && internetResponse.ok) {
        const payload = internetPayloads.get(key);
        if (isHostingOperatorCatalogPayload(payload)) {
          cache.set(key, payload);
        }
        sources.set(key, DiscoveryCatalogSource.Internet);
        return internetResponse;
      }

      if (cache.has(key)) {
        sources.set(key, DiscoveryCatalogSource.Cache);
        return createDiscoveryCatalogFetchResponse(cache.get(key), { ok: true, status: 200 });
      }

      if (defaultCatalogs.has(key)) {
        sources.set(key, DiscoveryCatalogSource.Default);
        return createDiscoveryCatalogFetchResponse(defaultCatalogs.get(key), { ok: true, status: 200 });
      }

      sources.set(key, DiscoveryCatalogSource.Default);
      return createDiscoveryCatalogFetchResponse({ error: 'not found' }, { ok: false, status: 404 });
    },
  };
}
