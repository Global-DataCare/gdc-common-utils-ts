import { describe, expect, it } from '@jest/globals';
import { DataspaceSectors } from '../src/constants/sectors.js';
import { ClaimsOrganizationSchemaorg, ClaimsServiceSchemaorg } from '../src/constants/schemaorg.js';
import {
  ServiceCapability,
  ServiceCapabilityToken,
} from '../src/constants/service-capabilities.js';
import {
  buildExampleHostingOperatorDiscoveryCatalog,
  buildExampleHostingOperatorCredentialSubject,
  buildExampleHostingOperatorMetaClaims,
  buildExamplePublishedProviderCatalogRecord,
  buildExampleTenantServiceCredentialSubject,
  buildExampleTenantServiceMetaClaims,
} from '../src/examples/dataspace-discovery.js';
import {
  EXAMPLE_COVERAGE_SCOPE_EU,
  EXAMPLE_HOSTING_OPERATOR_CATALOG_ARTIFACT_URL,
  EXAMPLE_HOSTING_OPERATOR_DID,
  EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL,
  EXAMPLE_JURISDICTION,
  EXAMPLE_NON_EU_COUNTRY,
  EXAMPLE_SECTOR,
  EXAMPLE_SECONDARY_TENANT_SERVICE_DID,
  EXAMPLE_SECONDARY_EU_COUNTRY,
  EXAMPLE_TENANT_SERVICE_DID,
} from '../src/examples/shared.js';
import {
  extractDataspaceServiceSemanticRecord,
  extractHostingOperatorSemanticRecord,
  extractTenantServiceSemanticRecord,
  filterHostingOperatorDiscoveryCatalog,
  filterHostingOperatorsByDiscoveryFilter,
  filterPublishedProvidersByDiscoveryFilter,
  inferCoverageScopeFromCountryCode,
  matchesPublishedProviderDiscoveryFilter,
  parseAreaServed,
} from '../src/utils/dataspace-discovery.js';

describe('dataspace discovery helpers', () => {
  it('extracts semantic data from credentialSubject and infers EU coverage from country', () => {
    const record = extractHostingOperatorSemanticRecord({
      credentialSubject: buildExampleHostingOperatorCredentialSubject(),
    });

    expect(record.subjectId).toBe(EXAMPLE_HOSTING_OPERATOR_DID);
    expect(record.serviceTypes).toEqual([
      ServiceCapability.IndexProvider,
      ServiceCapability.DigitalTwinProvider,
    ]);
    expect(record.categories).toEqual([EXAMPLE_SECTOR]);
    expect(record.areaServed).toEqual([EXAMPLE_COVERAGE_SCOPE_EU, EXAMPLE_JURISDICTION]);
    expect(record.addressCountry).toBe(EXAMPLE_JURISDICTION);
    expect(record.coverageScope).toBe(EXAMPLE_COVERAGE_SCOPE_EU);
  });

  it('falls back to flattened meta.claims when semantic fields are absent', () => {
    const record = extractTenantServiceSemanticRecord({
      credentialSubject: {
        id: EXAMPLE_TENANT_SERVICE_DID,
      },
      meta: {
        claims: buildExampleTenantServiceMetaClaims(),
      },
    });

    expect(record.subjectId).toBe(EXAMPLE_TENANT_SERVICE_DID);
    expect(record.serviceTypes).toEqual([ServiceCapability.IndexProvider]);
    expect(record.categories).toEqual([EXAMPLE_SECTOR]);
    expect(record.areaServed).toEqual([EXAMPLE_COVERAGE_SCOPE_EU]);
    expect(record.addressCountry).toBe(EXAMPLE_JURISDICTION);
  });

  it('rejects mismatches between semantic values and flattened claims', () => {
    expect(() => extractDataspaceServiceSemanticRecord({
      credentialSubject: buildExampleTenantServiceCredentialSubject({
        areaServed: ['EU'],
      }),
      meta: {
        claims: {
          ...buildExampleTenantServiceMetaClaims({
            areaServed: ['US'],
          }),
        },
      },
    })).toThrow('Dataspace discovery mismatch for areaServed');
  });

  it('parses areaServed from arrays, scalar strings, and AdministrativeArea-like objects', () => {
    expect(parseAreaServed([
      { '@type': 'AdministrativeArea', name: EXAMPLE_COVERAGE_SCOPE_EU },
      EXAMPLE_JURISDICTION,
      `${EXAMPLE_SECONDARY_EU_COUNTRY},${EXAMPLE_JURISDICTION}`,
    ])).toEqual([EXAMPLE_COVERAGE_SCOPE_EU, EXAMPLE_JURISDICTION, EXAMPLE_SECONDARY_EU_COUNTRY]);
  });

  it('builds consistent examples for semantic subjects and flattened claims', () => {
    const subject = buildExampleHostingOperatorCredentialSubject({
      categories: [DataspaceSectors.AnimalCare],
      areaServed: [EXAMPLE_COVERAGE_SCOPE_EU],
    });
    const claims = buildExampleHostingOperatorMetaClaims({
      categories: [DataspaceSectors.AnimalCare],
      areaServed: [EXAMPLE_COVERAGE_SCOPE_EU],
    });

    expect(subject.category).toBe(DataspaceSectors.AnimalCare);
    expect(claims[ClaimsServiceSchemaorg.category]).toBe(DataspaceSectors.AnimalCare);
    expect(claims[ClaimsServiceSchemaorg.areaServed]).toBe(EXAMPLE_COVERAGE_SCOPE_EU);
    expect(claims[ClaimsOrganizationSchemaorg.addressCountry]).toBe(EXAMPLE_JURISDICTION);
  });

  it('returns the country itself as coverage scope when the country is outside the EU set', () => {
    expect(inferCoverageScopeFromCountryCode(EXAMPLE_NON_EU_COUNTRY)).toBe(EXAMPLE_NON_EU_COUNTRY);
  });

  it('filters hosting operators by sector, required capabilities, and coverage', () => {
    const matchingRecord = extractHostingOperatorSemanticRecord({
      credentialSubject: buildExampleHostingOperatorCredentialSubject(),
    });
    const nonMatchingRecord = extractHostingOperatorSemanticRecord({
      credentialSubject: buildExampleHostingOperatorCredentialSubject({
        categories: [DataspaceSectors.AnimalCare],
        areaServed: [EXAMPLE_NON_EU_COUNTRY],
      }),
    });

    const filtered = filterHostingOperatorsByDiscoveryFilter(
      [matchingRecord, nonMatchingRecord],
      {
        sector: EXAMPLE_SECTOR,
        requiredCapabilities: [ServiceCapability.IndexProvider],
        coverageScope: EXAMPLE_COVERAGE_SCOPE_EU,
      },
    );

    expect(filtered).toEqual([matchingRecord]);
  });

  it('filters published providers and excludes reader-only service types', () => {
    const matchingRecord = buildExamplePublishedProviderCatalogRecord();
    const readerRecord = buildExamplePublishedProviderCatalogRecord({
      did: EXAMPLE_TENANT_SERVICE_DID,
      serviceTypes: [ServiceCapability.DigitalTwinReader],
    });

    expect(matchesPublishedProviderDiscoveryFilter(matchingRecord, {
      sector: EXAMPLE_SECTOR,
      capability: ServiceCapability.IndexProvider,
      coverageScope: EXAMPLE_COVERAGE_SCOPE_EU,
    })).toBe(true);

    const filtered = filterPublishedProvidersByDiscoveryFilter(
      [matchingRecord, readerRecord],
      {
        sector: EXAMPLE_SECTOR,
        coverageScope: EXAMPLE_COVERAGE_SCOPE_EU,
      },
    );

    expect(filtered).toEqual([matchingRecord]);
  });

  it('filters hosting operator catalogs without mutating their publication shape', () => {
    const catalog = buildExampleHostingOperatorDiscoveryCatalog([
      buildExamplePublishedProviderCatalogRecord(),
      buildExamplePublishedProviderCatalogRecord({
        did: EXAMPLE_SECONDARY_TENANT_SERVICE_DID,
        serviceTypes: [ServiceCapability.DigitalTwinProvider],
      }),
    ]);

    const filtered = filterHostingOperatorDiscoveryCatalog(catalog, {
      sector: EXAMPLE_SECTOR,
      capability: ServiceCapability.IndexProvider,
      coverageScope: EXAMPLE_COVERAGE_SCOPE_EU,
    });

    expect(filtered.hostingOperatorDid).toBe(catalog.hostingOperatorDid);
    expect(filtered.discoveryUrl).toBe(EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL);
    expect(filtered.catalogUrl).toBe(EXAMPLE_HOSTING_OPERATOR_CATALOG_ARTIFACT_URL);
    expect(filtered.providers).toHaveLength(1);
    expect(filtered.providers[0]?.serviceType).toBe(ServiceCapability.IndexProvider);
  });

  it('normalizes deprecated persisted capability values into the canonical family tokens', () => {
    const record = extractTenantServiceSemanticRecord({
      credentialSubject: {
        id: EXAMPLE_TENANT_SERVICE_DID,
      },
      meta: {
        claims: {
          ...buildExampleTenantServiceMetaClaims(),
          [ClaimsServiceSchemaorg.serviceType]: `${ServiceCapabilityToken.LegacyIndexProvider},${ServiceCapabilityToken.LegacyDigitalTwinReader}`,
        },
      },
    });

    expect(record.serviceTypes).toEqual([
      ServiceCapability.IndexProvider,
      ServiceCapability.DigitalTwinReader,
    ]);
  });

  it('publishes discovery entrypoint and derived catalog artifact explicitly in examples', () => {
    const provider = buildExamplePublishedProviderCatalogRecord();
    const catalog = buildExampleHostingOperatorDiscoveryCatalog([provider]);

    expect(provider.discoveryUrl).toBe(EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL);
    expect(provider.catalogUrl).toBe(EXAMPLE_HOSTING_OPERATOR_CATALOG_ARTIFACT_URL);
    expect(catalog.discoveryUrl).toBe(EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL);
    expect(catalog.catalogUrl).toBe(EXAMPLE_HOSTING_OPERATOR_CATALOG_ARTIFACT_URL);
  });
});
