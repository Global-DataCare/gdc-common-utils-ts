# Lifecycle 101

> 101 note
> - Teach here: the highest-level public `common-utils` helper available for this topic.
> - Do not present raw `meta.claims`, `upsert*`, or pack/unpack as the main path unless the topic itself is transport.
> - Read [101-README.md](./101-README.md) for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.


This document is the entry-level lifecycle guide.

It is intentionally for:

- frontend developers
- portal/backend integrators
- SDK consumers learning the domain

It is intentionally not the place for current GW CORE payload wiring, route
details, or `body.data[]` transport envelopes.

Read the technical details later in:

- `docs/LIFECYCLE_TECHNICAL_ROADMAP.md`
- `docs/101-RESOURCE_IDENTIFIER_AND_OPERATIONS.md`
- `docs/101-BUNDLE_EDITOR_READER.md`
- `docs/101-EMPLOYEE_ENTRY_EDITOR.md`

## If You Are Integrating From Front

Read in this order:

1. this file
   - understand the business meaning of `enable`, `disable`, `delete`
2. `docs/101-BUNDLE_EDITOR_READER.md`
   - learn how to build one bundle and how to read a returned bundle
3. one resource-specific editor guide such as:
   - `docs/101-EMPLOYEE_ENTRY_EDITOR.md`
   - `docs/101-INDIVIDUAL_ORGANIZATION_LIFECYCLE_EDITOR.md`
   - `docs/101-RELATED_PERSON_EDITOR.md`
   - `docs/101-LICENSE_OFFERS_ORDERS_AND_LISTS.md`
   - `docs/101-CONSENT_EDITOR_AND_READBACK.md`
   - `docs/101-CLINICAL_READ_AND_SEARCH.md`
   - learn the chainable `set...()` / `get...()` methods for that domain
4. `docs/101-RESOURCE_IDENTIFIER_AND_OPERATIONS.md`
   - only when you need to understand how the built resource is later wrapped
     into search/disable/purge style operations

The intended frontend path is:

- build semantic data locally with chainable editors
- hand the built bundle or built entry to the SDK/runtime/backend layer
- let that lower layer encapsulate/sign/submit it
- read the returned bundle with `BundleReader` to paint the UI

## Start Here

When teaching lifecycle to application developers, use only these business
ideas first:

- `enable`
- `disable`
- `delete`

Do not start from:

- `/_disable`
- `/_purge`
- `request.method = POST`
- `body.data[]`
- `meta.claims`

Those are transport details. They belong to SDK/runtime plumbing.

## What Each Operation Means

### `enable`

Use `enable` when an existing identity or record must become active again.

Typical examples:

- reactivate an employee with the same role
- reactivate an individual context after a temporary suspension
- reactivate a consent that should grant access again

### `disable`

Use `disable` when the record must stop being operational but must remain
auditable.

Typical examples:

- suspend an employee without erasing history
- suspend an individual/family record without deleting all trace
- suspend a consent so it stops granting access

Important rule:

- `disable` is not the same thing as VC revocation
- `disable` does not automatically mean license release

### `delete`

Use `delete` when the business/legal intent is removal, not just suspension.

Typical examples:

- privacy-driven deletion workflow for an individual
- consent removal when suspension is not enough
- exceptional cleanup flows

Important rule:

- `delete` does not force one immediate physical storage purge in every backend
- retention and audit obligations may still apply

## Mental Model By Domain

### Employee

- create or reactivate the employee identity
- disable if the person should stop operating
- delete/purge only when the business/legal flow really requires it

### Individual organization

- start the individual/family organization
- confirm the returned order/offer
- disable when the hosted subject context must stop operating
- delete/purge only when the privacy/legal workflow requires it

### Related person

- this is not the same as employee lifecycle
- it models caregiver/guardian/family relationship records
- its lifecycle must stay separate from the individual organization lifecycle

### Consent

- consent lifecycle is about whether access is currently granted
- it is not the same as employee lifecycle or subject lifecycle

## What Frontend Developers Usually Need

A frontend developer usually needs to understand:

- what business action they are triggering
- whether the action is reversible
- whether it affects access immediately
- whether it releases licenses or not
- whether the result is expected to stay visible in history

They usually do not need to know:

- the current GW route name
- the exact payload envelope
- how submit/poll is wired
- where claims are normalized

## Source Of Truth Split

Use this split consistently:

- `101-LIFECYCLE.md`
  - business meaning
  - actor/use-case explanation
  - frontend/integrator mental model
- technical shared helpers in `src/utils/...`
  - builders/editors/readers
  - reusable examples
  - canonical test fixtures
- runtime SDK docs
  - current GW route/path behavior
  - submit/poll plumbing
  - live integration notes

## Practical Rule

If a lifecycle explanation starts looking like transport wiring, it probably
does not belong in this `101` guide.

Move that detail to:

- shared helper docs
- runtime integration docs
- tests/examples close to the code
