# Consent Editor And Readback 101

> 101 note
> - Teach here: the highest-level public `common-utils` helper available for this topic.
> - Do not present raw `meta.claims`, `upsert*`, or pack/unpack as the main path unless the topic itself is transport.
> - Read [101-README.md](./101-README.md) for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.


This is the frontend/integrator guide for editing one consent and reading it
back as UI state.

Use this when you need to understand:

- how a frontend edits one consent step by step
- how that consent lives inside a communication-attached bundle
- how the UI can read the stored consent back as a view model
- how to read lifecycle/result responses without parsing raw bundle plumbing

Read in this order:

1. [101-LIFECYCLE.md](./101-LIFECYCLE.md)
2. this file
3. [101-COMMUNICATION_LAYERING.md](./101-COMMUNICATION_LAYERING.md)
   when you need the envelope mental model

## What The Frontend Should Think About

A frontend usually cares about:

- who receives access
- for what purpose
- which sections/documents are allowed
- whether the current edited consent is valid or duplicated
- how to load the stored consent back into screen state

It usually does not need to start from:

- low-level claim keys
- attachment base64 wiring
- transport envelopes

## The Main Editor

Use:

- `createConsentAccessEditor(...)`

This is the high-level shared editor for the consent bundle carried inside a
`Communication`.

The intended frontend loop is:

1. create or load the bundle editor
2. open or create one active consent entry
3. edit that active consent
4. save and release it
5. reload it later as a frontend-facing view model

## Editing Flow

The shortest teaching references are:

- [__tests__/101-consent-bundle-editor.test.ts](../__tests__/101-consent-bundle-editor.test.ts)
- [__tests__/101-consent-view-model.test.ts](../__tests__/101-consent-view-model.test.ts)
- [__tests__/101-consent-lifecycle-result-reader.test.ts](../__tests__/101-consent-lifecycle-result-reader.test.ts)

Those two tests together show the whole intended path:

- write/edit one consent
- save it into the attached bundle
- reopen it later as screen state

## High-Level Mental Model

Think in three layers:

1. semantic consent values
   - purpose
   - actors
   - targets
   - decision
2. bundle editing
   - one consent entry is inserted or updated
3. view-model readback
   - the same stored consent is projected back into UI state

## Typical Frontend Operations

Typical high-level operations are:

- create a new consent entry
- patch the active consent claims
- save and release the entry
- load `getConsentViewModel()`
- apply edited UI values back with `applyConsentViewModel(...)`

Example references:

- edit/write path:
  - [__tests__/101-consent-bundle-editor.test.ts](../__tests__/101-consent-bundle-editor.test.ts)
- readback/view-model path:
  - [__tests__/101-consent-view-model.test.ts](../__tests__/101-consent-view-model.test.ts)

## Why This Matters For Frontend Work

The important thing is that the frontend does not need to parse raw stored
claims directly every time.

The shared layer already gives:

- one editor path for writing
- one view-model path for reading persisted consent state through `ConsentViewModel`
- one lifecycle result reader alias for response/polling screens through
  `createConsentLifecycleResultReader(...)`

That is the real 101 value for consent integration.

Use the two readers for different jobs:

- `ConsentViewModel`
  - when the app reopens one stored consent and wants screen state
- `ConsentLifecycleResultReader`
  - when the app wants to inspect success/error results of lifecycle-like
    operations or polling responses

## Related Shared Material

- [101-CONSENT_ACCESS.md](./101-CONSENT_ACCESS.md)
- [101-COMMUNICATION_LAYERING.md](./101-COMMUNICATION_LAYERING.md)
