// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ClaimsOrganizationSchemaorg, ClaimsServiceSchemaorg } from '../constants/schemaorg';
import {
  serializeServiceCapabilityTokens,
  ServiceCapability,
} from '../constants/service-capabilities';
import type {
  HostingOperatorDiscoveryCatalog,
  PublishedProviderCatalogRecord,
} from '../models/dataspace-discovery';
import {
  EXAMPLE_HOSTING_OPERATOR_CATALOG_ARTIFACT_URL,
  EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL,
  EXAMPLE_HOSTING_OPERATOR_DID,
  EXAMPLE_PROVIDER_PUBLISHED_ENDPOINT_URL,
  EXAMPLE_JURISDICTION,
  EXAMPLE_SECTOR,
  EXAMPLE_TENANT_SERVICE_DID,
} from './shared';

export type ExampleDataspaceCredentialSubjectInput = Readonly<{
  did?: string;
  serviceTypes?: readonly string[];
  categories?: readonly string[];
  areaServed?: readonly string[];
  addressCountry?: string;
}>;

function firstOrCsv(values: readonly string[]): string {
  return values.length <= 1 ? (values[0] || '') : values.join(',');
}

/**
 * Builds a synthetic hosting-operator semantic `credentialSubject`.
 *
 * This example is parameterized on purpose: public docs/tests must not hardcode
 * business identities when demonstrating dataspace discovery semantics.
 *
 * @param input Optional overrides for the synthetic subject.
 * @returns Schema.org-shaped semantic subject with service metadata.
 */
export function buildExampleHostingOperatorCredentialSubject(
  input: ExampleDataspaceCredentialSubjectInput = {},
) {
  const serviceTypes = input.serviceTypes || [
    ServiceCapability.IndexProvider,
    ServiceCapability.DigitalTwinProvider,
  ];
  const categories = input.categories || [EXAMPLE_SECTOR];
  const areaServed = input.areaServed || ['EU', EXAMPLE_JURISDICTION];
  const addressCountry = input.addressCountry || EXAMPLE_JURISDICTION;
  return {
    id: input.did || 'did:web:host.example.org',
    serviceType: firstOrCsv(serviceTypes),
    category: firstOrCsv(categories),
    areaServed: areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
    address: {
      addressCountry,
    },
  };
}

/**
 * Builds a synthetic tenant-service semantic `credentialSubject`.
 *
 * @param input Optional overrides for the synthetic tenant subject.
 * @returns Schema.org-shaped semantic subject with public service metadata.
 */
export function buildExampleTenantServiceCredentialSubject(
  input: ExampleDataspaceCredentialSubjectInput = {},
) {
  const serviceTypes = input.serviceTypes || [ServiceCapability.IndexProvider];
  const categories = input.categories || [EXAMPLE_SECTOR];
  const areaServed = input.areaServed || ['EU'];
  const addressCountry = input.addressCountry || EXAMPLE_JURISDICTION;
  return {
    id: input.did || 'did:web:provider.example.org',
    serviceType: firstOrCsv(serviceTypes),
    category: firstOrCsv(categories),
    areaServed: areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
    address: {
      addressCountry,
    },
  };
}

/**
 * Builds the flattened `meta.claims` projection for a hosting-operator semantic
 * subject.
 *
 * @param input Optional overrides for the synthetic projection.
 * @returns Flat operational claims derived from the semantic subject.
 */
export function buildExampleHostingOperatorMetaClaims(
  input: ExampleDataspaceCredentialSubjectInput = {},
) {
  const serviceTypes = input.serviceTypes || [
    ServiceCapability.IndexProvider,
    ServiceCapability.DigitalTwinProvider,
  ];
  const categories = input.categories || [EXAMPLE_SECTOR];
  const areaServed = input.areaServed || ['EU', EXAMPLE_JURISDICTION];
  const addressCountry = input.addressCountry || EXAMPLE_JURISDICTION;
  return {
    [ClaimsServiceSchemaorg.serviceType]: serializeServiceCapabilityTokens(serviceTypes),
    [ClaimsServiceSchemaorg.category]: firstOrCsv(categories),
    [ClaimsServiceSchemaorg.areaServed]: firstOrCsv(areaServed),
    [ClaimsOrganizationSchemaorg.addressCountry]: addressCountry,
  };
}

/**
 * Builds the flattened `meta.claims` projection for a tenant-service semantic
 * subject.
 *
 * @param input Optional overrides for the synthetic projection.
 * @returns Flat operational claims derived from the semantic subject.
 */
export function buildExampleTenantServiceMetaClaims(
  input: ExampleDataspaceCredentialSubjectInput = {},
) {
  const serviceTypes = input.serviceTypes || [ServiceCapability.IndexProvider];
  const categories = input.categories || [EXAMPLE_SECTOR];
  const areaServed = input.areaServed || ['EU'];
  const addressCountry = input.addressCountry || EXAMPLE_JURISDICTION;
  return {
    [ClaimsServiceSchemaorg.serviceType]: serializeServiceCapabilityTokens(serviceTypes),
    [ClaimsServiceSchemaorg.category]: firstOrCsv(categories),
    [ClaimsServiceSchemaorg.areaServed]: firstOrCsv(areaServed),
    [ClaimsOrganizationSchemaorg.addressCountry]: addressCountry,
  };
}

/**
 * Builds a synthetic published-provider record as it would appear in a host
 * service-autodiscovery catalog.
 *
 * URL rule:
 * - `discoveryUrl` is the participant-scoped `/.well-known/dspace-version`
 *   entrypoint
 * - `catalogUrl` is the derived `/dsp/catalog/dcat.json` artifact
 *
 * @param input Optional overrides for the synthetic provider publication.
 * @returns Shared host-catalog provider entry.
 */
export function buildExamplePublishedProviderCatalogRecord(
  input: ExampleDataspaceCredentialSubjectInput = {},
): PublishedProviderCatalogRecord {
  const serviceTypes = input.serviceTypes || [ServiceCapability.IndexProvider];
  const categories = input.categories || [EXAMPLE_SECTOR];
  const areaServed = input.areaServed || ['EU'];
  return {
    providerDid: input.did || EXAMPLE_TENANT_SERVICE_DID,
    serviceType: serviceTypes[0] || ServiceCapability.IndexProvider,
    category: categories[0] || EXAMPLE_SECTOR,
    areaServed: firstOrCsv(areaServed) || 'EU',
    endpointUrl: EXAMPLE_PROVIDER_PUBLISHED_ENDPOINT_URL,
    discoveryUrl: EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL,
    catalogUrl: EXAMPLE_HOSTING_OPERATOR_CATALOG_ARTIFACT_URL,
  };
}

/**
 * Builds a synthetic host/operator service-autodiscovery catalog.
 *
 * URL rule:
 * - `discoveryUrl` is the canonical entrypoint clients should fetch first
 * - `catalogUrl` is the read-only DSP artifact derived from the advertised
 *   base path
 *
 * @param providers Optional published providers to include.
 * @returns Shared catalog DTO for host-side public service autodiscovery.
 */
export function buildExampleHostingOperatorDiscoveryCatalog(
  providers: ReadonlyArray<PublishedProviderCatalogRecord> = [buildExamplePublishedProviderCatalogRecord()],
): HostingOperatorDiscoveryCatalog {
  return {
    hostingOperatorDid: EXAMPLE_HOSTING_OPERATOR_DID,
    discoveryUrl: EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL,
    catalogUrl: EXAMPLE_HOSTING_OPERATOR_CATALOG_ARTIFACT_URL,
    providers: [...providers],
  };
}
