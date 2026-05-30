// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ClaimsOrganizationSchemaorg, ClaimsServiceSchemaorg } from '../constants/schemaorg';
import { serializeServiceCapabilityTokens, ServiceCapabilityToken } from '../constants/service-capabilities';
import {
  EXAMPLE_JURISDICTION,
  EXAMPLE_SECTOR,
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
    ServiceCapabilityToken.IndexProvider,
    ServiceCapabilityToken.DigitalTwinProvider,
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
  const serviceTypes = input.serviceTypes || [ServiceCapabilityToken.IndexProvider];
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
    ServiceCapabilityToken.IndexProvider,
    ServiceCapabilityToken.DigitalTwinProvider,
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
  const serviceTypes = input.serviceTypes || [ServiceCapabilityToken.IndexProvider];
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
