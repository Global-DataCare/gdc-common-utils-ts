# 101 Communication Search Editor

This guide explains the reusable high-level builder introduced for
`Communication/_search`.

## Why this exists

The lower layers of GW use FHIR-like `Parameters` and `Bundle` payloads for
search. Calling code should not need to handcraft those rows every time. The
editor keeps the app-facing API readable while still producing the canonical
transport payload.

## Layering

There are three layers:

1. `buildRequest()`
   Produces the canonical FHIR `Parameters` resource.
2. `buildEntry()`
   Wraps that request in one search entry with explicit operation metadata.
3. `buildBundle()`
   Produces the final `Bundle` with `type = search`.

## High-level search params

The editor is intentionally claim-oriented:

- `setSearchParamSender(...)`
- `setSearchParamRecipient(...)`
- `setSearchParamCategory(...)`
- `setSearchParamTopic(...)`
- `setPeriodStart(...)`
- `setPeriodEnd(...)`
- `setPaginationCount(...)`
- `setPageNumber(...)`

This means callers can keep using canonical `CommunicationClaim.*` keys rather
than inventing ad-hoc transport names.

## Retention safety rail

Communication retention is controlled by:

- `COMMUNICATION_RETENTION_DISABLED=false`

Default behavior:

- `false` or unset: retention stays enabled and purge flows should skip
  communication deletion
- `true`: retention is disabled and purge flows may delete communications

Why the default is conservative:

- medical/clinical communications can be relevant for complaints, regulatory
  audits, malpractice investigations, or legal threats
- the right to erasure is not absolute when retention is necessary for legal
  claims, legal obligations, or health-care delivery

References used for compliance/audit justification:

- ICO storage limitation:
  https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/storage-limitation/
- ICO right to erasure:
  https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-erasure/

## Test coverage

See:

- `__tests__/101-communication-search-editor.test.ts`
- `__tests__/utils-communication-participant-search.test.ts`

The first one covers the editor step by step. The second one covers normalization,
matching semantics, period controls, wildcard handling, and pagination.
