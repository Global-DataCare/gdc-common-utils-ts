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

## Test Rule

Keep high-level tests step by step, with JSDoc when the usage pattern is not
obvious.

Shared examples and fixtures should originate here so SDK/runtime tests can
reuse them instead of redefining inline literals.

## Naming Rule

- `Editor`, `Reader`, `Builder`, `State` are preferred neutral names
- use `Draft` only when the domain truly represents a provisional artifact
- keep operation prefixes first in function names, e.g. `prepareSearch...`
- when a runtime-specific specialization exists, keep the common concept first
  and the specialization later, e.g. `createJobManagerInMemory(...)`
