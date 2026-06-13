# Lifecycle Technical Roadmap

This is the canonical technical note for what is already modeled in
`gdc-common-utils-ts`, what is only wired in SDK plumbing today, and what still
needs shared high-level helpers before a portal/backend facade should be built.

This is not a `101` guide.

Use it when you are working on:

- shared helper design
- SDK plumbing
- runtime contracts
- test coverage strategy

Do not start here if you are a frontend or portal integrator learning the flow.

Current canonical result shape for interoperable entries:

- `entry[].resource.meta.claims`
- `data[].resource.meta.claims`

Deprecated compatibility still tolerated by shared readers:

- `entry[].meta.claims`
- `data[].meta.claims`

New writers should emit only the canonical `resource.meta.claims` shape.

## Layer Order

Build lifecycle support in this order:

1. `gdc-common-utils-ts`
   - semantic drafts/editors/readers
   - shared examples and fixtures
   - didactic `101` tests
2. `gdc-sdk-core-ts`
   - neutral facade surface and contracts
3. `gdc-sdk-node-ts` / `gdc-sdk-front-ts`
   - runtime wiring to current GW CORE routes
4. portal/backend virtual API
   - thin HTTP facade over already-stable SDK methods

Do not start from the portal backend contract when the shared semantic helper
does not exist yet.

## Current Coverage

### Employee

Shared today:

- search bundle builders
- create/disable/purge batch entry helpers
- examples and `101` docs around `BundleEditor` / `BundleReader`

Still missing at shared high level:

- no additional shared helper gap beyond runtime/live coverage

Available now:

- shared neutral lifecycle result reader in `src/utils/lifecycle-result-reader.ts`
- shared employee search/list reader in `src/utils/employee.ts`
- executable employee readback examples in `__tests__/101-employee-examples.test.ts`

### Individual organization

Shared today:

- onboarding/start claim helpers
- final registration request builders
- semantic lifecycle examples
- current GW disable/purge payload editor in
  `src/utils/individual-organization-lifecycle.ts`

Still missing at shared high level:

- live E2E coverage through `sdk-node` against `gwtemplate-node-ts`

Available now:

- shared neutral lifecycle result reader in `src/utils/lifecycle-result-reader.ts`
- actor-facing lifecycle facade in
  `gdc-sdk-core-ts/src/individual-organization-lifecycle-facade.ts`

### Related person

Shared today:

- identifier-first disable contract
- related-person upsert bundle examples
- related-person lifecycle examples and fixtures

Still missing:

- stable purge contract in GW CORE
- one frontend-oriented `101` guide focused on:
  - upsert bundle editing
  - disable semantic intent
  - reading response entries back in UI

Available now:

- `docs/101-RELATED_PERSON_EDITOR.md`
- `src/utils/related-person-list.ts`
- `__tests__/101-related-person-list-reader.test.ts`

Structural follow-up:

- if the portal/backend later needs richer related-person read/search screens,
  `sdk-core` still needs a neutral reader/search surface rather than only
  runtime methods

### Licenses / offers / orders

Shared today:

- flat claim constants for `Offer`, `Order`, `IndividualProduct`
- offer/order summary readers
- example summaries and response fixtures

Still missing:

- public SDK facade methods only after the real GW source/contract is fixed

Available now:

- `docs/101-LICENSE_OFFERS_ORDERS_AND_LISTS.md`
- `src/utils/license-list-search.ts`
- `__tests__/101-license-list-search.test.ts`

### Consent

Shared today:

- consent editors and claim helpers
- consent access examples

Still missing:

- no additional shared helper gap before runtime/live coverage

Available now:

- `docs/101-CONSENT_EDITOR_AND_READBACK.md`
- `src/utils/consent-lifecycle-result-reader.ts`
- `__tests__/101-consent-lifecycle-result-reader.test.ts`

Structural follow-up:

- `sdk-core` consent fluent/removal parity is now aligned for the current
  shared surface; future gaps here should only refer to newly added shared
  helpers, not the existing `remove...()` operations

### Clinical read flows

Shared today:

- IPS bundle helpers
- vital sign examples
- bundle search references and parameter helpers

Still missing:

- one frontend-oriented `101` path for:
  - building a search request
  - understanding when to use `BundleEditor` vs higher-level query helpers
  - reading returned bundle entries and summaries for UI screens

Available now:

- `docs/101-CLINICAL_READ_AND_SEARCH.md`

Structural follow-up:

- `CommunicationAttachedBundleSession` already supports shared upsert helpers
  for `Condition`, `Observation`, `AllergyIntolerance`, and
  `DocumentReference`, but `sdk-core` still lacks equivalent fluent wrappers
  for several of those domains
- `DiagnosticReport` still has an obsolete TODO gate in
  `CommunicationAttachedBundleSession` even though shared claim helpers already
  exist; the high-level editing surface remains missing
- `sdk-core/src/communication-document-facade.ts` is narrower than the shared
  bundle query utilities already available in `common-utils`; neutral reader
  APIs for id/filter-driven clinical readback are still incomplete

## Practical Rule

When a lifecycle use case is still represented only by:

- local strings in one SDK
- route-specific envelopes without shared examples
- or ad hoc test payloads

it is not ready yet for a portal backend virtual API.

First move it into:

- `src/utils/...`
- `src/examples/...`
- `__tests__/101-...`

and only then wire it in `sdk-core` and runtime packages.
