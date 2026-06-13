# Resource Identifier And Operations 101

This document fixes one small but important contract for SDKs, gateways, and
frontend helpers:

- `resource.identifier` is the interoperable business locator
- `resource.id` is internal/runtime metadata
- `resource.meta.claims` is the canonical processing shape

If you keep those three roles separate, the rest of the lifecycle/search
contract becomes much simpler.

For most frontend developers, this is not the first document to read.

Start with:

- `docs/101-LIFECYCLE.md`
- `docs/101-BUNDLE_EDITOR_READER.md`
- one domain-specific editor doc such as `docs/101-EMPLOYEE_ENTRY_EDITOR.md`

Come back here only when you need to understand how the semantic bundle data is
later wrapped into operation requests.

## The Three Identity Layers

### `resource.identifier`

Use this at API boundaries.

It is the portable business identifier that a frontend, another backend, or a
gateway wrapper can safely send.

Examples:

- `RelatedPerson.identifier`
- `Observation.identifier`
- `MedicationStatement.identifier`

### `resource.id`

Treat this as internal technical metadata.

It may be useful when a backend already knows the stored resource instance, but
it is not the interoperable contract to rely on across systems.

### `resource.meta.claims`

This is the canonical processing representation used by shared helpers and GW
managers.

In FHIR mode, the preferred flow is:

1. read `resource.identifier`
2. normalize the FHIR resource into `resource.meta.claims`
3. process the operation through claims-first business logic

That lets the API stay FHIR-friendly without forcing every manager to process
raw FHIR structures directly.

## Operation Contract

### `/_search`

Target contract:

- action in path: `/_search`
- `Bundle.entry.request.method = POST`
- `Bundle.entry.request.url = Resource/_search`
- `Bundle.entry.resource.resourceType = Parameters`

Legacy `GET` query-string search may still exist during migration, but it is
not the preferred shared contract.

### `/_disable`

Target contract:

- action in path: `/_disable`
- `Bundle.entry.request.method = POST`
- `Bundle.entry.resource.identifier[0].value` is the primary locator
- `Bundle.entry.resource.id` is optional internal metadata
- `Bundle.entry.resource.meta.status = inactive`

Important:

- do not overload resource-specific FHIR fields such as `active`
- for example, `RelatedPerson.active` remains a boolean relation flag, not the
  generic lifecycle state

### `/_purge`

Target contract:

- action in path: `/_purge`
- `Bundle.entry.request.method = POST`
- `Bundle.entry.resource.identifier[0].value` is the primary locator
- `Bundle.entry.resource.meta.status = purged`

## Why This Contract Exists

Without this split, every repository starts mixing:

- path actions
- entry request methods
- FHIR resource fields
- internal storage ids
- claims-first processing rules

The shared contract reduces that confusion:

- identifier at the boundary
- claims during processing
- id only as internal metadata
- lifecycle in `resource.meta.status`

## Shared Helpers

See:

- `createInteroperableResourceOperationEditor(...)`
- `getPrimaryFhirIdentifierValue(...)`
- `normalizeClaimsFromFhirResource(...)`
- `buildLifecycleOperationResource(...)`

And the didactic test:

- `__tests__/101-interoperable-resource-operation.test.ts`

## Frontend Path

The intended frontend flow is:

1. build or edit semantic data with a shared editor
2. materialize one bundle or entry in memory
3. pass that value to a lower SDK/runtime/backend layer
4. let that lower layer encapsulate it into current GW operation wiring
5. read the response bundle with `BundleReader`

That means a frontend developer usually works directly with:

- `BundleEditor`
- `BundleReader`
- resource-specific entry editors

and only indirectly with:

- `resource.identifier`
- `resource.meta.claims`
- `/_search`
- `/_disable`
- `/_purge`
