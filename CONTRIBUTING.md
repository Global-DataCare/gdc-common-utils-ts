# Contributing

Read [ARCHITECTURE.md](./ARCHITECTURE.md) before introducing new helpers,
editors, readers, states, or examples.

## Main Rule

`gdc-common-utils-ts` is the first home for reusable high-level neutral
semantics.

If a helper can be shared across runtimes, put it here before wrapping it in
downstream facades or runtime adapters.

If a shared semantic class needs high-level `get...` / `set...` methods, add
them here before using them from SDK profiles, facades, or runtime layers.

If runtime state concepts must be shared across runtimes, put only the neutral
data shapes here, for example:

- profile/session state records
- outbox item payload shapes
- queue item payload shapes
- vault document shapes

Do not put concrete runtime behavior here such as:

- `createJobManagerInMemory(...)`
- concrete queue workers
- concrete `Vault...` adapters
- `loadProfile(...)` / `closeProfile(...)` orchestration

## Module Hygiene Rule

Keep source files structurally clean:

- one exported class per file
- exported types in `src/models/*`
- reusable helper functions in dedicated helper modules such as
  `src/utils/*-helpers.ts`
- do not mix exported types, helper implementations, and multiple exported
  classes in one file

Compatibility re-exports are allowed, but the owning file should still respect
those boundaries.

Inside class methods, keep only the orchestration that truly belongs to the
class. Move reusable parsing, flattening, classification, normalization, and
serialization logic into helper functions.

## Test Rule

Keep high-level tests step by step, with JSDoc when the usage pattern is not
obvious.

Shared examples and fixtures should originate here so SDK/runtime tests can
reuse them instead of redefining inline literals.

When a test crosses app/frontend and BFF/runtime concerns, document the split
explicitly in comments:

- frontend/app builds business payloads such as `Bundle` or `Communication`
- BFF/runtime wraps them as DIDComm plaintext JSON
- wallet/runtime then signs/encrypts/submits when the mode is not plain/FHIR-compat

In particular:

- `buildDidcommPayloadFromBundle(...)` should be explained as the BFF/runtime
  plaintext wrapping step for direct operational bundles
- `buildDidcommPayloadFromCommunicationClaims(...)` should be explained as the
  BFF/runtime plaintext wrapping step for Communication-carried payloads

## Naming Rule

- `Editor`, `Reader`, `Builder`, `State` are preferred neutral names
- use `Draft` only when the domain truly represents a provisional artifact
- keep operation prefixes first in function names, e.g. `prepareSearch...`
- when a runtime-specific specialization exists, keep the common concept first
  and the specialization later, e.g. `createJobManagerInMemory(...)`
