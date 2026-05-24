# Consent Access 101

This guide defines the shared consent-access evaluation model used across:

- `gdc-common-utils-ts`
- `gdc-sdk-core-ts`
- `gdc-sdk-node-ts`
- `gdc-sdk-front-ts`
- `gwtemplate-node-ts`

It does not reopen bootstrap decisions around `_activate`, `vp_token`,
`controller.*`, `owner`, or legal representative semantics.

## Goal

Given:

- one subject
- one requesting actor
- actor role
- purpose
- requested sections
- requested resource types when present
- all active consent rules for the subject

determine:

- allowed
- denied
- partially allowed
- what is missing
- whether an explicit deny overrides a broader allow

## Canonical target kinds

Direct actor target:

- email
- `did:web`
- phone only when a sector/runtime explicitly enables it

Organizational target:

- `did:web`
- organization URL normalized to `did:web:<host>`
- email domain only as fallback normalization

Jurisdiction target:

- country/jurisdiction code such as `ES`

Related person:

- same direct-selector support model as other actor-specific matches

## Active consent aggregation

Always evaluate the full set of active consent rules for the subject.

Shared helper:

- [`groupActiveConsentsByTarget(...)`](../src/utils/consent.ts)

Grouped views exposed today:

- actor-specific target
- organization target
- jurisdiction target
- phone-extension target

## Precedence

Evaluation precedence is:

1. explicit deny for a concrete email
2. explicit permit for a concrete email
3. organization-scoped permit/deny
4. jurisdiction-scoped permit/deny
5. default deny

This is evaluated per requested section and optional resource type.

## Shared contracts

Models:

- [`ConsentRule`](../src/models/consent-rule.ts)
- [`NormalizedConsentTarget`](../src/models/consent-access.ts)
- [`ConsentCoverageRequest`](../src/models/consent-access.ts)
- [`EffectiveAccessEvaluation`](../src/models/consent-access.ts)
- [`MissingPermissionSet`](../src/models/consent-access.ts)
- [`ActiveConsentView`](../src/models/consent-access.ts)

Helpers:

- [`normalizeConsentTarget(...)`](../src/utils/consent.ts)
- [`resolveConsentActor(...)`](../src/utils/consent.ts)
- [`isConsentRuleActive(...)`](../src/utils/consent.ts)
- [`groupActiveConsentsByTarget(...)`](../src/utils/consent.ts)
- [`evaluateConsentCoverage(...)`](../src/utils/consent.ts)

## Source-of-truth examples

Reusable examples live in:

- [`src/examples/consent-access.ts`](../src/examples/consent-access.ts)
- [`src/examples/professional.ts`](../src/examples/professional.ts)
- [`src/examples/related-person.ts`](../src/examples/related-person.ts)

Covered matrix:

- physician by email and role for continuous care
- physician by email and role for emergencies
- physician by organization and role
- physician by jurisdiction and role
- nurse by organization
- paramedic by jurisdiction
- explicit deny for one physician email inside an allowed organization
- related person specific target
- revoked consent with no remaining fallback

Phone remains documented as pending extension unless a sector-specific
contract closes it explicitly.

## SDK usage

`gdc-sdk-core-ts` builds on these helpers to expose:

- grouped controller views
- requested-access evaluation
- missing-permission extraction
- canonical permission-request `Communication` creation
- canonical permission-request lookup query creation

## Permission request `Communication`

When coverage is missing, the SDK should build a canonical `Communication`
for the subject controller.

Canonical retrieval identifiers:

- `Communication.identifier`
- `thid`
- `DocumentReference.contenthash` as `z<base58>` CID when present

Push/email/SMS are notification channels around this canonical
`Communication`, not the main contract.
