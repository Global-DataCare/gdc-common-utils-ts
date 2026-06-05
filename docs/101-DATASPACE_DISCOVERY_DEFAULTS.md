# Dataspace Discovery Defaults 101

This guide explains the simplest bootstrap model for portal/backend discovery
when ICA, CA, and live GW discovery are not fully deployed yet.

Use this document when the immediate goal is:

- unblock frontend/backend integration now
- preload one or more ICAs by `jurisdiction + version + networkType`
- preload one or more hosting operators by `jurisdiction + version + networkType`
- keep provider discovery itself business-scoped by `sector`

## Mental Model

Three dimensions must stay separate:

1. host/network context
   - `jurisdiction` for legal/bootstrap selection
   - `hostCoverageScope` for host-scoped discovery URLs
   - `version`
   - `networkType`
2. provider/tenant business context
   - `sector`
3. discovery source policy
   - `defaults-only`
   - `default-first`
   - `internet-first`

Rule:

- ICA and hosting defaults are selected by host/network context
- published providers are selected later by business `sector`

## Copy/Paste Example

```ts
import {
  DataspaceDiscoverySourceMode,
  ServiceCapability,
} from 'gdc-common-utils-ts/constants';
import {
  buildDefaultHostingOperatorRegistrationFromAuthority,
  buildDefaultIcaRegistrationFromAuthority,
  buildDefaultPublishedProviderRecordFromTenant,
  createDataspaceDiscoveryDefaultsRegistry,
} from 'gdc-common-utils-ts/utils/dataspace-discovery-defaults';

const defaults = createDataspaceDiscoveryDefaultsRegistry();

defaults.addIca(buildDefaultIcaRegistrationFromAuthority({
  authority: 'ica.example.org',
  jurisdiction: 'ES',
  version: 'v1',
  networkType: 'test',
  title: 'ICA ES Test',
}));

defaults.addHostingOperator(buildDefaultHostingOperatorRegistrationFromAuthority({
  authority: 'host.example.org',
  jurisdiction: 'ES',
  hostCoverageScope: 'EU',
  version: 'v1',
  networkType: 'test',
  title: 'Health Care Host ES',
  sector: 'health-care',
  serviceTypes: [ServiceCapability.IndexProvider],
  areaServed: ['EU', 'ES'],
  coverageScope: 'EU',
}));

// Optional: seed one published provider directly under that host.
// This is useful during early portal development, before you want to depend on
// the host public catalog.
defaults.addHostingOperator({
  ...buildDefaultHostingOperatorRegistrationFromAuthority({
    authority: 'host-health.example.org',
    jurisdiction: 'ES',
    hostCoverageScope: 'EU',
    version: 'v1',
    networkType: 'test',
    title: 'Health Host ES',
    sector: 'health-care',
    serviceTypes: [ServiceCapability.IndexProvider],
    areaServed: ['EU', 'ES'],
    coverageScope: 'EU',
  }),
  publishedProviders: [
    buildDefaultPublishedProviderRecordFromTenant({
      hostAuthority: 'host-health.example.org',
      tenantId: 'acme-id',
      jurisdiction: 'ES',
      version: 'v1',
      sector: 'health-care',
      providerCapability: ServiceCapability.IndexProvider,
      areaServed: ['EU', 'ES'],
      // Future optional public domain:
      // externalDomain: 'acme-health.example.org',
    }),
  ],
});

const plan = defaults.buildBootstrapPlan({
  jurisdiction: 'ES',
  version: 'v1',
  networkType: 'test',
  sector: 'health-care',
  coverageScope: 'EU',
  requiredCapabilities: [ServiceCapability.IndexProvider],
  sourceMode: DataspaceDiscoverySourceMode.DefaultFirst,
});
```

## Policy Semantics

`defaults-only`

- never tries live ICA/internet discovery
- always serves configured defaults only
- best for local frontend/backend development and incomplete deployments

`default-first`

- uses matching hosting defaults immediately when present
- only tries ICA/internet when no matching host defaults exist for the request
- best for the current portal phase

`internet-first`

- prefers live ICA/internet discovery first
- still exposes configured defaults as fallback
- best for later production deployment once live trust/discovery is ready

## Portal Backend Rule

The frontend should not choose `networkType`.

Recommended backend behavior:

1. frontend sends `sector + jurisdiction + providerCapability`
2. backend chooses `networkType` from deployment configuration
3. backend builds a bootstrap plan from configured defaults
4. backend resolves hosting operators
5. backend resolves published providers for the requested `sector`
6. frontend receives only normalized DTOs from the backend

## Executable References

- [`__tests__/dataspace-discovery-defaults.101.test.ts`](../__tests__/dataspace-discovery-defaults.101.test.ts)
- [`__tests__/dataspace-protocol.test.ts`](../__tests__/dataspace-protocol.test.ts)
- [`__tests__/dataspace-discovery.test.ts`](../__tests__/dataspace-discovery.test.ts)
