import { describe, expect, it } from '@jest/globals';
import {
  DataspaceDiscoverySourceMode,
  DataspaceSectors,
  ServiceCapability,
} from '../src/constants/index.js';
import {
  buildExampleHostingOperatorCredentialSubject,
} from '../src/examples/dataspace-discovery.js';
import {
  EXAMPLE_COVERAGE_SCOPE_EU,
  EXAMPLE_DEFAULT_ICA_DID,
  EXAMPLE_DEFAULT_ICA_URL,
  EXAMPLE_HOST_COVERAGE_SCOPE,
  EXAMPLE_HOSTING_OPERATOR_CATALOG_ARTIFACT_URL,
  EXAMPLE_HOSTING_OPERATOR_DID,
  EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL,
  EXAMPLE_JURISDICTION,
  EXAMPLE_NETWORK_TYPE,
  EXAMPLE_NON_EU_COUNTRY,
  EXAMPLE_ROUTE_VERSION,
} from '../src/examples/shared.js';
import {
  type DataspaceDiscoveryBootstrapInput,
  type DefaultHostingOperatorRegistration,
} from '../src/models/dataspace-discovery-defaults.js';
import {
  buildDefaultHostingOperatorRegistrationFromAuthority,
  buildDefaultIcaRegistrationFromAuthority,
  buildDefaultPublishedProviderRecordFromTenant,
  createDataspaceDiscoveryDefaultsRegistry,
} from '../src/utils/dataspace-discovery-defaults.js';
import { extractHostingOperatorSemanticRecord } from '../src/utils/dataspace-discovery.js';

function buildDefaultHostingOperatorRegistration(
  overrides: Partial<DefaultHostingOperatorRegistration> = {},
): DefaultHostingOperatorRegistration {
  return {
    jurisdiction: EXAMPLE_JURISDICTION,
    version: EXAMPLE_ROUTE_VERSION,
    networkType: EXAMPLE_NETWORK_TYPE,
    operatorDid: EXAMPLE_HOSTING_OPERATOR_DID,
    discoveryUrl: EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL,
    catalogUrl: EXAMPLE_HOSTING_OPERATOR_CATALOG_ARTIFACT_URL,
    record: extractHostingOperatorSemanticRecord({
      credentialSubject: buildExampleHostingOperatorCredentialSubject({
        categories: [DataspaceSectors.HealthCare],
        serviceTypes: [ServiceCapability.IndexProvider],
        areaServed: [EXAMPLE_COVERAGE_SCOPE_EU, EXAMPLE_JURISDICTION],
      }),
    }),
    ...overrides,
  };
}

function buildBootstrapInput(
  overrides: Partial<DataspaceDiscoveryBootstrapInput> = {},
): DataspaceDiscoveryBootstrapInput {
  return {
    jurisdiction: EXAMPLE_JURISDICTION,
    version: EXAMPLE_ROUTE_VERSION,
    networkType: EXAMPLE_NETWORK_TYPE,
    sector: DataspaceSectors.HealthCare,
    coverageScope: EXAMPLE_COVERAGE_SCOPE_EU,
    requiredCapabilities: [ServiceCapability.IndexProvider],
    ...overrides,
  };
}

describe('dataspace discovery defaults 101', () => {
  it('builds ICA defaults from a single authority value', () => {
    expect(buildDefaultIcaRegistrationFromAuthority({
      authority: 'ica.example.org',
      jurisdiction: EXAMPLE_JURISDICTION,
      version: EXAMPLE_ROUTE_VERSION,
      networkType: EXAMPLE_NETWORK_TYPE,
      title: 'ICA ES Test',
    })).toEqual({
      jurisdiction: EXAMPLE_JURISDICTION,
      version: EXAMPLE_ROUTE_VERSION,
      networkType: EXAMPLE_NETWORK_TYPE,
      title: 'ICA ES Test',
      icaUrl: 'https://ica.example.org/.well-known/ica-configuration',
      icaDid: 'did:web:ica.example.org',
    });
  });

  it('builds host defaults from a single authority value', () => {
    expect(buildDefaultHostingOperatorRegistrationFromAuthority({
      authority: 'host-animal-care.example.org',
      jurisdiction: EXAMPLE_JURISDICTION,
      hostCoverageScope: EXAMPLE_HOST_COVERAGE_SCOPE,
      version: EXAMPLE_ROUTE_VERSION,
      networkType: EXAMPLE_NETWORK_TYPE,
      title: 'Animal Care Host ES',
      sector: DataspaceSectors.AnimalCare,
      serviceTypes: [ServiceCapability.IndexProvider],
      areaServed: [EXAMPLE_COVERAGE_SCOPE_EU, EXAMPLE_JURISDICTION],
      coverageScope: EXAMPLE_COVERAGE_SCOPE_EU,
    })).toEqual({
      jurisdiction: EXAMPLE_JURISDICTION,
      version: EXAMPLE_ROUTE_VERSION,
      networkType: EXAMPLE_NETWORK_TYPE,
      title: 'Animal Care Host ES',
      operatorDid: 'did:web:host-animal-care.example.org',
      discoveryUrl: EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL.replace('host.example.org', 'host-animal-care.example.org'),
      catalogUrl: undefined,
      publishedProviders: [],
      record: {
        subjectId: 'did:web:host-animal-care.example.org',
        serviceTypes: [ServiceCapability.IndexProvider],
        categories: [DataspaceSectors.AnimalCare],
        areaServed: [EXAMPLE_COVERAGE_SCOPE_EU, EXAMPLE_JURISDICTION],
        addressCountry: EXAMPLE_JURISDICTION,
        coverageScope: EXAMPLE_COVERAGE_SCOPE_EU,
      },
    });
  });

  it('builds published provider defaults from tenantId under one host', () => {
    expect(buildDefaultPublishedProviderRecordFromTenant({
      hostAuthority: 'host-health.example.org',
      tenantId: 'acme-id',
      jurisdiction: EXAMPLE_JURISDICTION,
      version: EXAMPLE_ROUTE_VERSION,
      sector: DataspaceSectors.HealthCare,
      providerCapability: ServiceCapability.IndexProvider,
      areaServed: [EXAMPLE_COVERAGE_SCOPE_EU, EXAMPLE_JURISDICTION],
    })).toEqual({
      providerDid: 'did:web:host-health.example.org:acme-id:cds-ES:v1:health-care',
      serviceType: ServiceCapability.IndexProvider,
      category: DataspaceSectors.HealthCare,
      areaServed: `${EXAMPLE_COVERAGE_SCOPE_EU},${EXAMPLE_JURISDICTION}`,
      endpointUrl: 'https://host-health.example.org/acme-id/cds-ES/v1/health-care/',
      discoveryUrl: 'https://host-health.example.org/acme-id/cds-ES/v1/health-care/.well-known/dspace-version',
      catalogUrl: 'https://host-health.example.org/acme-id/cds-ES/v1/health-care/dsp/catalog/dcat.json',
    });
  });

  it('stores ICA defaults by jurisdiction, version, and network type', () => {
    const registry = createDataspaceDiscoveryDefaultsRegistry();

    registry.addIca({
      jurisdiction: EXAMPLE_JURISDICTION,
      version: EXAMPLE_ROUTE_VERSION,
      networkType: EXAMPLE_NETWORK_TYPE,
      icaUrl: EXAMPLE_DEFAULT_ICA_URL,
      icaDid: EXAMPLE_DEFAULT_ICA_DID,
    });
    registry.addIca({
      jurisdiction: EXAMPLE_NON_EU_COUNTRY,
      version: EXAMPLE_ROUTE_VERSION,
      networkType: EXAMPLE_NETWORK_TYPE,
      icaUrl: 'https://ica-us.example.org',
    });

    expect(registry.listIcas({
      jurisdiction: EXAMPLE_JURISDICTION,
      version: EXAMPLE_ROUTE_VERSION,
      networkType: EXAMPLE_NETWORK_TYPE,
    })).toEqual([{
      jurisdiction: EXAMPLE_JURISDICTION,
      version: EXAMPLE_ROUTE_VERSION,
      networkType: EXAMPLE_NETWORK_TYPE,
      icaUrl: EXAMPLE_DEFAULT_ICA_URL,
      icaDid: EXAMPLE_DEFAULT_ICA_DID,
      title: undefined,
    }]);
  });

  it('lists only hosting defaults that match the requested business sector and capability', () => {
    const registry = createDataspaceDiscoveryDefaultsRegistry({
      hostingOperators: [
        buildDefaultHostingOperatorRegistration(),
        buildDefaultHostingOperatorRegistration({
          operatorDid: 'did:web:animal-host.example.org',
          record: extractHostingOperatorSemanticRecord({
            credentialSubject: buildExampleHostingOperatorCredentialSubject({
              categories: [DataspaceSectors.AnimalCare],
              serviceTypes: [ServiceCapability.DigitalTwinProvider],
              areaServed: [EXAMPLE_COVERAGE_SCOPE_EU, EXAMPLE_JURISDICTION],
            }),
          }),
        }),
      ],
    });

    const healthCareHosts = registry.listHostingOperators(buildBootstrapInput());

    expect(healthCareHosts).toHaveLength(1);
    expect(healthCareHosts[0]?.operatorDid).toBe(EXAMPLE_HOSTING_OPERATOR_DID);
  });

  it('defaults-only keeps the backend on configured seeds and never triggers internet discovery', () => {
    const registry = createDataspaceDiscoveryDefaultsRegistry({
      icas: [{
        jurisdiction: EXAMPLE_JURISDICTION,
        version: EXAMPLE_ROUTE_VERSION,
        networkType: EXAMPLE_NETWORK_TYPE,
        icaUrl: EXAMPLE_DEFAULT_ICA_URL,
      }],
      hostingOperators: [buildDefaultHostingOperatorRegistration()],
    });

    const plan = registry.buildBootstrapPlan({
      ...buildBootstrapInput(),
      sourceMode: DataspaceDiscoverySourceMode.DefaultsOnly,
    });

    expect(plan.hasDefaults).toBe(true);
    expect(plan.shouldUseDefaultsFirst).toBe(true);
    expect(plan.shouldTryInternet).toBe(false);
    expect(plan.hostingOperators).toHaveLength(1);
  });

  it('default-first uses matching host defaults immediately and only falls back to ICA when hosts are missing', () => {
    const registry = createDataspaceDiscoveryDefaultsRegistry({
      icas: [{
        jurisdiction: EXAMPLE_JURISDICTION,
        version: EXAMPLE_ROUTE_VERSION,
        networkType: EXAMPLE_NETWORK_TYPE,
        icaUrl: EXAMPLE_DEFAULT_ICA_URL,
      }],
      hostingOperators: [buildDefaultHostingOperatorRegistration()],
    });

    const planWithHosts = registry.buildBootstrapPlan({
      ...buildBootstrapInput(),
      sourceMode: DataspaceDiscoverySourceMode.DefaultFirst,
    });
    const planWithoutHosts = registry.buildBootstrapPlan({
      ...buildBootstrapInput(),
      sourceMode: DataspaceDiscoverySourceMode.DefaultFirst,
      sector: DataspaceSectors.AnimalCare,
      requiredCapabilities: [ServiceCapability.DigitalTwinProvider],
    });

    expect(planWithHosts.shouldUseDefaultsFirst).toBe(true);
    expect(planWithHosts.shouldTryInternet).toBe(false);
    expect(planWithoutHosts.hostingOperators).toHaveLength(0);
    expect(planWithoutHosts.shouldTryInternet).toBe(true);
  });

  it('internet-first still exposes configured defaults as fallback while preferring ICA/live discovery', () => {
    const registry = createDataspaceDiscoveryDefaultsRegistry({
      icas: [{
        jurisdiction: EXAMPLE_JURISDICTION,
        version: EXAMPLE_ROUTE_VERSION,
        networkType: EXAMPLE_NETWORK_TYPE,
        icaUrl: EXAMPLE_DEFAULT_ICA_URL,
      }],
      hostingOperators: [buildDefaultHostingOperatorRegistration()],
    });

    const plan = registry.buildBootstrapPlan({
      ...buildBootstrapInput(),
      sourceMode: DataspaceDiscoverySourceMode.InternetFirst,
    });

    expect(plan.shouldUseDefaultsFirst).toBe(false);
    expect(plan.shouldTryInternet).toBe(true);
    expect(plan.icas[0]?.icaUrl).toBe(EXAMPLE_DEFAULT_ICA_URL);
    expect(plan.hostingOperators[0]?.discoveryUrl).toBe(EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL);
  });
});
