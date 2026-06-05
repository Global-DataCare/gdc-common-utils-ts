import { describe, expect, it } from '@jest/globals';
import { ServiceCapability } from '../src/constants/service-capabilities.js';
import { HostNetworkTypes } from '../src/constants/network.js';
import { DataspaceProtocolVersions } from '../src/constants/dataspace-protocol.js';
import {
  EXAMPLE_HOST_COVERAGE_SCOPE,
  EXAMPLE_HOSTING_OPERATOR_CATALOG_ARTIFACT_URL,
  EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL,
  EXAMPLE_JURISDICTION,
  EXAMPLE_TENANT_IDENTIFIER,
} from '../src/examples/shared.js';
import {
  buildDspaceVersionMetadata,
  buildGwCatalogArtifactPath,
  buildGwCatalogDatasetPath,
  buildGwCatalogRequestPath,
  buildGwDataspaceBasePath,
  buildGwDspaceVersionWellKnownPath,
  deriveGwCatalogArtifactUrlFromDspaceVersion,
} from '../src/utils/dataspace-protocol.js';
import {
  buildDefaultHostingOperatorDiscoveryCatalog,
  buildDefaultPublishedProviderCatalogRecord,
  createDiscoveryCatalogFetcher,
  DiscoveryCatalogSource,
} from '../src/utils/dataspace-discovery.js';

describe('dataspace protocol helpers', () => {
  const hostContext = {
    participantId: 'host',
    hostCoverageScope: EXAMPLE_HOST_COVERAGE_SCOPE,
    jurisdiction: EXAMPLE_JURISDICTION,
    version: DataspaceProtocolVersions.Current,
    hostNetwork: HostNetworkTypes.Test,
  } as const;
  const currentVersion = DataspaceProtocolVersions.Current;

  it('builds the canonical host-scoped DSP paths from one route context', () => {
    expect(buildGwDataspaceBasePath(hostContext)).toBe(`/host/cds-EU/${currentVersion}/test/dsp`);
    expect(buildGwDspaceVersionWellKnownPath(hostContext)).toBe(`/host/cds-EU/${currentVersion}/test/.well-known/dspace-version`);
    expect(buildGwCatalogRequestPath(hostContext)).toBe(`/host/cds-EU/${currentVersion}/test/dsp/catalog/request`);
    expect(buildGwCatalogArtifactPath(hostContext)).toBe(`/host/cds-EU/${currentVersion}/test/dsp/catalog/dcat.json`);
    expect(buildGwCatalogDatasetPath(hostContext, 'dataset-1')).toBe(`/host/cds-EU/${currentVersion}/test/dsp/catalog/datasets/dataset-1`);
  });

  it('falls back to jurisdiction when host coverage scope is not provided', () => {
    expect(buildGwDspaceVersionWellKnownPath({
      participantId: 'host',
      jurisdiction: EXAMPLE_JURISDICTION,
      version: DataspaceProtocolVersions.Current,
      hostNetwork: HostNetworkTypes.Test,
    })).toBe(`/host/cds-ES/${currentVersion}/test/.well-known/dspace-version`);
  });

  it('builds the canonical tenant-scoped DSP entrypoint from tenant route inputs', () => {
    expect(buildGwDspaceVersionWellKnownPath({
      tenantId: EXAMPLE_TENANT_IDENTIFIER,
      jurisdiction: EXAMPLE_JURISDICTION,
      version: DataspaceProtocolVersions.Current,
      businessSector: 'animal-care',
    })).toBe(`/acme-id/cds-ES/${currentVersion}/animal-care/.well-known/dspace-version`);
  });

  it('derives the catalog artifact URL from the advertised dspace-version payload', () => {
    const metadata = buildDspaceVersionMetadata('/host/cds-EU/v1/test/dsp');

    expect(deriveGwCatalogArtifactUrlFromDspaceVersion(
      EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL,
      metadata,
    )).toBe(EXAMPLE_HOSTING_OPERATOR_CATALOG_ARTIFACT_URL);
  });

  it('demonstrates network, cache, and default fallback sources for integrators', async () => {
    const discoveryUrl = EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL;
    const catalog = buildDefaultHostingOperatorDiscoveryCatalog({
      discoveryUrl,
      catalogUrl: EXAMPLE_HOSTING_OPERATOR_CATALOG_ARTIFACT_URL,
      providers: [
        buildDefaultPublishedProviderCatalogRecord({
          providerDid: 'did:web:provider.example.org',
          serviceType: ServiceCapability.IndexProvider,
          category: 'health-care',
          areaServed: ['EU', 'ES'],
          endpointUrl: 'https://host.example.org/catalog/provider-a',
          discoveryUrl: 'https://provider.example.org/acme-id/cds-ES/v1/health-care/.well-known/dspace-version',
          catalogUrl: 'https://host.example.org/acme-id/cds-ES/v1/health-care/dsp/catalog/dcat.json',
        }),
      ],
    });
    const harness = createDiscoveryCatalogFetcher({
      internetCatalogs: {
        [discoveryUrl]: catalog,
      },
      defaultCatalogs: {
        [discoveryUrl]: buildDefaultHostingOperatorDiscoveryCatalog({
          hostingOperatorDid: 'did:web:default-host.example.org',
          providers: [],
        }),
      },
    });

    const first = await harness.fetcher(discoveryUrl);
    expect(first.ok).toBe(true);
    expect(harness.sources.get(discoveryUrl)).toBe(DiscoveryCatalogSource.Internet);

    harness.setInternetFailure(discoveryUrl, 503);
    const second = await harness.fetcher(discoveryUrl);
    expect(second.ok).toBe(true);
    expect(harness.sources.get(discoveryUrl)).toBe(DiscoveryCatalogSource.Cache);

    harness.clearInternetRoute(discoveryUrl);
    harness.cache.delete(discoveryUrl);
    const third = await harness.fetcher(discoveryUrl);
    expect(third.ok).toBe(true);
    expect(harness.sources.get(discoveryUrl)).toBe(DiscoveryCatalogSource.Default);
  });
});
