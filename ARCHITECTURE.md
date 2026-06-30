# Architecture

## Purpose

`gdc-common-utils-ts` owns the shared high-level, runtime-neutral building
blocks reused by downstream consumer layers.

This package is the canonical home for:

- `Editor`, `Reader`, `Builder`, and `State` abstractions
- high-level `get...` / `set...` methods on shared semantic classes
- runtime-neutral models for profile state, outbox items, queue items, and
  vault payload shapes when they are reusable across runtimes
- shared examples and fixtures
- reusable claim normalization and readback helpers
- didactic `101` tests that define the intended high-level contract

This package is not the place for:

- actor-runtime orchestration
- role-specific UX flows
- frontend session semantics
- runtime transport orchestration
- concrete `JobManager`, `Outbox`, `Queue`, or `Vault` implementations
- gateway route binding or polling behavior

## File Hygiene Rules

Keep module structure strict:

- one exported class per file
- exported types belong in `src/models/*` or another dedicated type module
- reusable helper functions belong in `src/utils/*-helpers.ts` or another
  dedicated helper module
- do not define exported types, helper functions, and multiple exported classes
  together in the same file

Re-exports for compatibility are acceptable, but the owning implementation must
still respect the one-class-per-file rule.

Inside class methods:

- keep orchestration shallow
- move parsing, normalization, classification, flattening, and serialization
  logic into reusable helper functions
- prefer calling named helper functions over embedding long decision trees in
  methods

## Ownership Rules

Put code here when it is:

- reusable across browser, node, and other consumer/runtime contexts
- semantically high-level but still runtime-neutral
- not tied to one user role, sector, or execution environment

If a high-level semantic class needs `get...` / `set...` methods, define those
methods here before exposing or consuming that class through downstream facade,
profile, or runtime layers.

Do not put code here when it:

- requires token/session/runtime context
- represents one concrete actor profile runtime
- depends on HTTP routes, polling, retries, storage adapters, concrete job managers, or credential plumbing

## Runtime State Model Rule

When runtime state concepts must be shared across node/front runtimes, this
package may own their neutral data shapes, for example:

- outbox item payload shapes
- queue item payload shapes
- vault document shapes
- high-level profile/session state records

But this package must not own concrete runtime behavior such as:

- `createJobManagerInMemory(...)`
- `createServerQueueInMemory(...)`
- `VaultSqlite`
- `VaultFirestore`
- `closeProfile(...)` orchestration

The same rule applies to wallet-aware runtime orchestration:

- runtime-neutral wallet contracts belong in `gdc-sdk-core-ts`
- concrete Node wallet adapters belong in `gdc-sdk-node-ts`
- this package should only keep low-level crypto primitives and reusable data
  models, not wallet orchestration contracts or runtime adapters

## Naming Rules

Use these conventions consistently:

- `Editor`: mutable high-level helper for assembling or refining a semantic payload
- `Reader`: readback/helper over a returned payload
- `Builder`: construction helper where edit semantics are not the focus
- `State`: normalized serializable state behind an editor/helper
- `Draft`: only when the domain genuinely models a provisional artifact, not just an internal helper state

For helper/facade methods, keep the operation prefix first and the specific
target later.

Examples:

- `prepareSearchLicenseList`
- `prepareSearchLicenseOffer`
- `prepareLifecycleIndividualOrganizationDisable`

Avoid mixing:

- `new...`
- CRUD-looking `create...` names for non-create operations
- ambiguous synonyms such as `edit`, `update`, or `patch` when the function is not performing those actions

## Layer Boundary

This package feeds:

- `gdc-sdk-core-ts`
- `gdc-sdk-node-ts`
- `gdc-sdk-front-ts`
- other downstream consumers where shared neutral semantics are needed

The expected dependency direction is:

1. `gdc-common-utils-ts`
2. `gdc-sdk-core-ts`
3. `gdc-sdk-node-ts` / `gdc-sdk-front-ts`
4. downstream route-specific or runtime-specific surfaces

## Test And Example Policy

High-level tests in this repository are the canonical executable contract.

They should be:

- step by step
- high-level
- free of runtime plumbing
- free of ad-hoc literals when a shared example already exists
- backed by shared fixtures/examples in this repository

Preferred anchors:

- [__tests__/101-bundle-reader.test.ts](/Users/fernando/GITS/gdc-workspace/gdc-common-utils-ts/__tests__/101-bundle-reader.test.ts:1)
- [__tests__/101-employee-examples.test.ts](/Users/fernando/GITS/gdc-workspace/gdc-common-utils-ts/__tests__/101-employee-examples.test.ts:1)
- [__tests__/101-individual-organization-lifecycle.test.ts](/Users/fernando/GITS/gdc-workspace/gdc-common-utils-ts/__tests__/101-individual-organization-lifecycle.test.ts:1)
- [__tests__/101-interoperable-resource-operation.test.ts](/Users/fernando/GITS/gdc-workspace/gdc-common-utils-ts/__tests__/101-interoperable-resource-operation.test.ts:1)
- [__tests__/101-license-list-search.test.ts](/Users/fernando/GITS/gdc-workspace/gdc-common-utils-ts/__tests__/101-license-list-search.test.ts:1)
- [__tests__/101-license-offer-order-editor.test.ts](/Users/fernando/GITS/gdc-workspace/gdc-common-utils-ts/__tests__/101-license-offer-order-editor.test.ts:1)
- [__tests__/101-communication-search-editor.test.ts](/Users/fernando/GITS/gdc-workspace/gdc-common-utils-ts/__tests__/101-communication-search-editor.test.ts:1)

When a test crosses frontend/BFF/GW concerns, it must state the boundary
explicitly:

- frontend/app responsibilities:
  semantic editing, bundle construction, communication construction
- BFF/runtime responsibilities:
  DIDComm plaintext wrapping, signing, encryption, queueing, submission
- GW-like responsibilities:
  unpack, verify, decrypt, decode, readback

For example:

- `buildDidcommPayloadFromBundle(...)` is the BFF/runtime-side plaintext
  wrapping step for direct operational bundles
- `buildDidcommPayloadFromCommunicationClaims(...)` is the BFF/runtime-side
  plaintext wrapping step for Communication-carried payloads
- actual `pack/sign/encrypt` behavior belongs to the wallet/runtime layer, not
  to frontend editors

## JSDoc Policy

Every exported high-level helper should have JSDoc that explains:

- what semantic layer it belongs to
- what it does not do
- whether it is editor/reader/builder/state
- how it is expected to be consumed by downstream layers

For shared semantic classes with `get...` / `set...` methods, JSDoc should make
clear that the canonical high-level surface lives in `gdc-common-utils-ts`.

## Shared Data Rule

Shared test/examples data must originate here and be reused by SDK/runtime
tests whenever possible.

SDK repositories should prefer importing examples and fixtures from
`gdc-common-utils-ts` instead of redefining inline literals.

## Acceptance Rule

If a high-level reusable helper can live in `gdc-common-utils-ts`, it should be
introduced here before being wrapped or specialized elsewhere.

The same rule applies to high-level `get...` / `set...` methods on shared
semantic classes.
