# Dataspace Discovery Roadmap

Version:
- Planned common-utils release: `1.12.0`
- Planned node runtime release: `0.6.0`
- Planned frontend runtime release: `0.6.0`
- Branch baseline: `feat/dataspace-discovery-foundation`
- Date: `2026-05-29`

## Scope

This document defines the first implementation slice for dataspace discovery
without inventing private claims or host-to-tenant linkage inside tenant VCs.

This document does not define:

- concrete Fabric network/channel names
- veterinary network segmentation
- concrete regional rollout naming

Those decisions are outside common-utils scope and should remain in workspace or
extension-level repositories.

Canonical discovery model:

1. ICA-issued VCs remain the source of truth for semantic service metadata.
2. `credentialSubject` carries the Schema.org-shaped semantic object.
3. `meta.claims` may carry the flattened operational projection derived from the
   same semantic content and excluded from VC hash/signature verification by the
   current profile rules.
4. Public discovery for individuals must resolve providers through published
   hosting-operator catalogs, not by scanning private tenant-host mappings.

## Cross-Repo Sequence

1. `gdc-common-utils-ts`
   - add shared constants, DTOs, parsing helpers, EU coverage helpers, and
     parameterized examples
2. `gdc-sdk-node-ts`
   - add abstract runtime discovery contracts and backend-oriented resolver
     surface
3. `gdc-sdk-front-ts`
   - add frontend-facing discovery client contracts that can consume a portal
     backend or public catalogs
4. `dataspace-ica-ts`
   - extend ICA-issued VC examples and issuance/profile docs
5. `gwtemplate-node-ts`
   - publish provider offerings in host DSP catalogs grouped by service type

## Canonical Semantics

### VC semantic layer

`credentialSubject` must remain the semantic source of truth.

Required service-discovery fields to support:

- `serviceType`
- `category`
- `areaServed`
- `address.addressCountry`

These values must exist in `credentialSubject` before they are projected into
`meta.claims`.

### Flattened operational layer

Projected `meta.claims` keys must reuse existing canonical claim names and add
only Schema.org-aligned keys that can be derived from `credentialSubject`.

Required flattened keys:

- `org.schema.Service.serviceType`
- `org.schema.Service.category`
- `org.schema.Service.areaServed`
- `org.schema.Organization.address.addressCountry`

## Common-Utils Deliverables

### New constants

Add:

- `src/constants/eu-countries.ts`
- `src/constants/schemaorg-service-discovery.ts` only if existing
  `schemaorg.ts` becomes too crowded; otherwise extend `schemaorg.ts`

Expected exports:

- `EU_COUNTRY_CODES`
- `isEuCountryCode(countryCode)`
- `normalizeCountryCode(countryCode)`

### New shared models

Add:

- `src/models/dataspace-discovery.ts`

Expected DTOs:

- `DataspaceServiceCapability`
- `DataspaceServiceCapabilityToken` (deprecated compatibility alias)
- `DataspaceCoverage`
- `DataspaceServiceSemanticRecord`
- `HostingOperatorSemanticRecord`
- `TenantServiceSemanticRecord`
- `PublishedProviderCatalogRecord`

Rules:

- no private host-assignment field in tenant semantic DTOs
- `areaServed` is a coverage dimension, not a sector
- `category` remains the sector dimension

### New shared parsing helpers

Add:

- `src/utils/dataspace-discovery.ts`

Expected helpers:

- `parseServiceTypeCsv(value)`
- `parseServiceCategories(value)`
- `parseAreaServed(value)`
- `extractDataspaceServiceSemanticRecord(input)`
- `extractHostingOperatorSemanticRecord(input)`
- `extractTenantServiceSemanticRecord(input)`
- `inferCoverageScopeFromCountryCode(countryCode)`
- `inferCoverageScopeFromCredentialSubject(subject)`

Parsing rules:

- read semantic values from `credentialSubject` first
- accept `meta.claims` as a compatibility projection/fallback
- if both exist and disagree, throw or return a structured inconsistency error
- keep helpers runtime-neutral and side-effect free

### New examples

Add:

- `src/examples/dataspace-discovery.ts`

Example rules:

- do not hardcode real legal names, domains, tax IDs, DIDs, or countries beyond
  neutral placeholders needed to demonstrate semantics
- prefer builder functions that accept input parameters
- allow deterministic defaults such as `did:web:provider.example.org`
- do not embed private tenant-host linkage in tenant examples

Expected example builders:

- `buildExampleHostingOperatorCredentialSubject(input)`
- `buildExampleTenantServiceCredentialSubject(input)`
- `buildExampleHostingOperatorMetaClaims(input)`
- `buildExampleTenantServiceMetaClaims(input)`

### Tests

Add:

- `__tests__/dataspace-discovery.test.ts`
- `__tests__/eu-countries.test.ts`

Coverage minimum:

- semantic extraction from `credentialSubject`
- fallback extraction from `meta.claims`
- mismatch detection between semantic and flattened layers
- EU coverage inference from `address.addressCountry`
- `areaServed` parsing for scalar and array forms

## JSDoc To Generate

Every new public constant, type, and helper must include JSDoc.

Required JSDoc coverage:

- every new exported type alias and interface
- every new exported function
- every example builder

Required JSDoc content:

- purpose
- source-of-truth rule: `credentialSubject` first, `meta.claims` derived/fallback
- parameter semantics
- return semantics
- compatibility notes for scalar vs array `areaServed`
- explicit note that `EU` is coverage scope, not sector

Required examples inside JSDoc:

- one semantic `credentialSubject` example
- one flattened `meta.claims` projection example
- one country-to-coverage example using an EU ISO-2 code

## Repo-Specific Follow-Up Outside Common Utils

### gdc-sdk-node-ts

- define abstract `DataspaceResolver`
- define backend-facing input/output DTOs for:
  - `resolveHostingOperators(...)`
  - `resolvePublishedProviders(...)`
- implement a resolver that can combine:
  - trusted VC parsing
  - host catalog fetch
  - capability filtering

### gdc-sdk-front-ts

- define a frontend discovery client contract
- support portal/BFF consumption as the default integration path
- allow a public-catalog mode only when the consuming app can safely use it

### dataspace-ica-ts

- extend ICA-issued VC examples so `credentialSubject` contains the semantic
  service object and `meta.claims` mirrors it
- document issuance/profile rules for `serviceType`, `category`, `areaServed`,
  and `address.addressCountry`
- keep tenant-host linkage out of tenant VC content

### gwtemplate-node-ts

- expose host-level DSP catalog offerings grouped by provider service capability
- publish only provider offerings:
  - `IndexProvider`
  - `DigitalTwinProvider`
- do not publish reader-only capabilities:
  - `IndexReader`
  - `DigitalTwinReader`

## Blockers

Current workspace state blocks safe direct edits in:

- `dataspace-ica-ts`
- `gwtemplate-node-ts`

Reason:

- both repositories already contain local changes unrelated to this branch
- `dataspace-ica-ts` is not currently on `main`

Until those states are normalized, treat this document as the authoritative
implementation contract for those repos.
