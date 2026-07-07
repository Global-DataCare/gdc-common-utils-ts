# Communication Layering 101

> 101 note
> - Teach here: the highest-level public `common-utils` helper available for this topic.
> - Do not present raw `meta.claims`, `upsert*`, or pack/unpack as the main path unless the topic itself is transport.
> - Read [101-README.md](./101-README.md) for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.


This is the canonical explanation of how communication payloads are layered
across the GDC repositories.

Read this first if you are confused by any of these terms:

- DIDComm message
- `body`
- `BundleJsonApi`
- `entry.type`
- `resource.resourceType`
- FHIR `Communication`
- `CommMsgExtended`
- `resource.meta.claims`

This document is the source of truth for:

- `gdc-common-utils-ts`
- `gdc-sdk-core-ts`
- `gdc-sdk-node-ts`
- `gdc-sdk-front-ts`
- `gwtemplate-node-ts`

## What This 101 Teaches

This `101` teaches the highest-level public communication layering concepts
owned by `gdc-common-utils-ts`:

- how business payloads become `Communication`
- how to edit that outer `Communication` with communication-level setters/getters
- how `Communication` becomes DIDComm-style transport content
- how to keep FHIR shape and canonical claims distinct
- how to recognize the package boundary before runtime/controller orchestration
- the step-by-step document authoring story itself lives in the IPS editor
  walkthroughs, not in the claims-aggregator helper

Public teaching rule:

- local readers in this repo show how one already-received payload is opened
- the bundle-authoring walkthrough is covered by
  `101-ips-bundle-editor.test.ts` and `101-ips-family-entry-editors.test.ts`
- backend searches are a separate public story and must be taught with FHIR
  search parameters such as `Composition.section`
- any `meta.claims`, indexed attributes, or derived section tags belong to
  architecture/implementation, not to the beginner search story

Secure transport note:

- the secure GW/FAPI path uses encrypted DIDComm submission when the runtime
  has the recipient encryption key
- in `strict` mode, that encrypted path is mandatory: no recipient encryption
  JWK means fail fast instead of falling back to plaintext
- JAR/JARM belongs to the authorization-request / authorization-response
  security layer around the flow; it is not the same thing as the business
  payload model in `Communication`

Use these executable references together with this document:

- [__tests__/101-ips-bundle-editor.test.ts](../__tests__/101-ips-bundle-editor.test.ts)
- [__tests__/101-ips-family-entry-editors.test.ts](../__tests__/101-ips-family-entry-editors.test.ts)
- [__tests__/101-communication-profile-wallet-e2e.test.ts](../__tests__/101-communication-profile-wallet-e2e.test.ts)
- [__tests__/101-communication-medication-document.test.ts](../__tests__/101-communication-medication-document.test.ts)
- [__tests__/101-communication-document-reference-profile-wallet-e2e.test.ts](../__tests__/101-communication-document-reference-profile-wallet-e2e.test.ts)

Main common-utils tutorial order:

1. `ProfileManagerMem`
2. wallet/profile session behavior
3. typed bundle setters/getters (`BundleEditor`, typed entry editors)
4. attach that bundle to `Communication` with `CommunicationEditor`
5. DIDComm/plain transport details only after that

Normal runtime ownership:

- the normal case is that the user profile runtime owns the crypto for its own
  messages
- after one profile is loaded/unlocked, that profile wallet encrypts outbound
  messages and decrypts inbound replies
- this can run inside a BFF or a native/web client shell, but it is still the
  user-profile runtime path
- a separate proxy/service wallet is optional and should be explained as a
  second actor, not as the default path

## What This 101 Does Not Teach

This file is not the main tutorial for:

- actor/controller facades
- route context and submit/poll orchestration
- full backend runtime flows

Those belong to higher SDK layers:

- [gdc-sdk-core-ts/tests/101-communication-ips-search-outbox.test.mjs](https://github.com/Global-DataCare/gdc-sdk-core-ts/blob/main/tests/101-communication-ips-search-outbox.test.mjs)
- [gdc-sdk-core-ts/tests/101-employees.test.mjs](https://github.com/Global-DataCare/gdc-sdk-core-ts/blob/main/tests/101-employees.test.mjs)
- [gdc-sdk-node-ts/tests/101-organization-controller-lifecycle.test.mjs](https://github.com/Global-DataCare/gdc-sdk-node-ts/blob/main/tests/101-organization-controller-lifecycle.test.mjs)
- [gdc-sdk-node-ts/docs/101-SDK_INTEGRATION.md](https://github.com/Global-DataCare/gdc-sdk-node-ts/blob/main/docs/101-SDK_INTEGRATION.md)

Tutorial rule:

- in `common-utils` 101 material, start from the highest-level public helper
  available in this repo
- for profile/transport teaching, prefer:
  `typed bundle setters -> attach to Communication -> DIDComm/plain -> ProfileManagerMem`
- if a snippet must drop to raw `meta.claims`, `upsert*`, or wallet
  pack/unpack, mark that path as fallback/advanced rather than the main mental
  model
- if a proxy/service wallet appears, name it explicitly as optional
  infrastructure and keep the user-profile wallet as the main actor

For the target shared editing/reading model used on top of those layers, read
also:

- [101-BUNDLE_EDITOR_READER.md](./101-BUNDLE_EDITOR_READER.md)

## One Sentence Summary

The client-facing contract is:

- claims-first
- FHIR-shaped
- carried inside a DIDComm-style transport envelope

It is not:

- pure FHIR on the wire
- pure JSON:API on the wire
- `CommMsgExtended` sent directly by new clients

## Two Canonical Wrapping Cases

There are two different stories, and mixing them is what usually confuses
new readers.

### 1. Individual Index Data

This is the canonical case for clinical data that belongs to one individual
index.

Shape:

1. build one inner clinical document `Bundle` in the dedicated bundle-editor
   walkthrough, or reuse a shared fixture only as a setup shortcut
2. build one outer delivery `Communication`
3. attach that bundle to that `Communication`
4. wrap that `Communication` in DIDComm/plain transport

Important details:

- in the shared 101 path, the outer `Communication` should be taught through
  communication-level getters/setters, not through ad-hoc `communicationClaims`
  object mutation
- today that public surface is
  `new CommunicationEditor().setCommunication...().setAttachedBundle(...)`
- `buildBundleDocumentFromClaims(...)` is still useful as a secondary setup
  helper for transport tests, but it is not the canonical beginner authoring
  surface
- the transport body is batch-shaped as `body.data[]`
- the current shared helper
  `buildDidcommPayloadFromCommunicationClaims(...)` wraps one
  `Communication` per call
- for current individual-index clinical/document tutorials, the correct
  default path is one `Bundle.type=document` with `Composition` first entry
- each clinical entry must be classifiable into one section so
  `Composition.section[]` can reference it coherently
- document authorship and provenance are not one single field:
  document-level authors belong on `Composition.author`, while each resource
  keeps its own provenance field such as `MedicationStatement.source`,
  `AllergyIntolerance.recorder`, `Condition.recorder`,
  `DiagnosticReport.performer`, or `DocumentReference.author`
- the executable reference is:
  [__tests__/101-communication-medication-document.test.ts](../__tests__/101-communication-medication-document.test.ts)

Newbie teaching rule:

- do not start with "bundle of Communications"
- first teach:
  one document bundle -> one delivery `Communication` -> one DIDComm/plain payload
- only introduce batches of multiple `Communication` resources later, when the
  reader already distinguishes delivery envelope from clinical content
- so the beginner mental model today is:
  one `Communication` carrying one attached bundle, transported in one
  DIDComm/plain payload
- if a transport example needs a ready-made bundle, treat that bundle as a
  fixture and not as the primary authoring path
- and be precise about the attached bundle itself:
  for current clinical individual-index use cases it should be
  `Bundle.type=document` with `Composition` entry `0`
- and be equally precise about search:
  local attached-bundle reading is not the same thing as GW search
- if the tutorial is about backend search, teach:
  `Composition.section=loinc-1,loinc-2`
  rather than local claim navigation

### 2. Employee Or Organization Batch Data

This is the canonical case for employee lifecycle and similar organization-side
batch operations.

Shape:

1. build one direct `Bundle`
2. submit that bundle directly
3. do not add an outer `Communication` unless a higher product flow explicitly
   requires it

Important detail:

- employee create/search/disable/purge examples are direct bundle stories, not
  individual-index `Communication` stories

### 3. Vital Signs Measurement Batch

This is the special case for high-frequency clinical measurements.

Shape:

1. build one `Bundle` of `Observation` entries with `type=batch`
2. let the bundle update the individual index when the backend accepts it
3. keep blockchain certification as a separate decision
4. if the batch is wrapped in `Communication`, include the Vital Signs section
   signal so the backend knows which IPS section the batch belongs to

Important details:

- this is not the same as a document bundle
- the batch hash/CID is the certification unit, not each individual sample
- the Communication wrapper, if used, should carry the section signal such as
  `HealthcareBasicSections.VitalSigns` / the equivalent LOINC code for routing
- the batch can be shared, indexed, or later sealed as one package
- do not teach this as a per-observation blockchain write path

## The Four Layers

### 1. Transport Envelope

The outermost object is the DIDComm/FAPI-style envelope.

Relevant type:

- `IDecodedDidcommPayload`

Main fields:

- `iss`
- `aud`
- `jti`
- `thid`
- `type`
- `body`

Important rule:

- this `type` is the envelope/protocol type
- it is not the FHIR resource type
- it is not the internal GW entry type

## 2. Batch Payload Layer

The `body` often carries a project-specific batch container.

Relevant type:

- `BundleJsonApi`

This is a hybrid business container used by GW CORE and SDK flows.

Important rule:

- `BundleJsonApi` is not standard FHIR `Bundle` by itself
- it is the gateway batch/request-response container

Typical shape:

```ts
{
  resourceType: 'Bundle',
  type: 'batch',
  data: [ ... ]
}
```

or sometimes:

```ts
{
  resourceType: 'Bundle',
  type: 'batch',
  entry: [ ... ]
}
```

Both shapes exist for compatibility in current flows.

## 3. Entry Layer

Each item in `body.data[]` or `body.entry[]` is a project entry.

Relevant types:

- `BundleEntry`
- `BundleEntryRequest`
- `BundleEntryResponse`

Important rule:

- `entry.type` is not a FHIR field
- it comes from the project batch-entry convention
- it identifies an internal business/message kind

So this is valid in the current project:

```ts
{
  type: 'Communication-request-search-with-reference-url-v1.0',
  resource: {
    resourceType: 'Communication',
    meta: { claims: { ... } }
  }
}
```

But developers must not confuse:

- `entry.type`
with
- `resource.resourceType`

They are different things.

## 4. Resource Layer

Inside the entry, the `resource` is the actual FHIR-like resource being carried.

Examples:

- `Communication`
- `Composition`
- `Consent`
- `Observation`

Important rule:

- the resource is FHIR-shaped
- but the project is claims-first
- `resource.meta.claims` is the canonical business contract

That means new clients should think:

- author the canonical claims
- place them in `resource.meta.claims`
- keep the resource FHIR-shaped enough for projection/interop

Not:

- “I must first build perfect FHIR R4 and only then the GW can accept it”

## What A Client Should Usually Send

For a communication flow, the recommended client payload is:

- DIDComm-style envelope
- `body` carrying a batch container
- one entry whose `resource.resourceType` is `Communication`
- canonical claims in `resource.meta.claims`

This is the main beginner mental model.

## What `CommMsgExtended` Is

`CommMsgExtended` is an internal canonical messaging representation used inside
gateway processing.

Important rule:

- `CommMsgExtended` is not the main payload new clients should construct
- the GW may derive it internally from a FHIR-like `Communication`

So the current flow is usually:

- client sends FHIR-like `Communication`
- GW processes it
- GW may convert it internally to `CommMsgExtended`

Not:

- client must send `CommMsgExtended` directly

## Why `resource.meta.claims` Matters

The project is claims-first.

That means:

- `resource.meta.claims` is the canonical source of business semantics
- visible FHIR fields may be normalized from those claims
- internal projections may also be derived from those claims

This is why the project can accept FHIR-like resources without requiring
perfect pure-FHIR authoring first.

Short rule:

- canonical business truth = `resource.meta.claims`
- FHIR shape = interoperable carrier/projection shape

## Current Recommended Mental Model

When building a new flow, think in this order:

1. Which resource is this really?
2. What are the canonical claims?
3. Which entry carries that resource?
4. Which batch container carries those entries?
5. Which DIDComm envelope carries that batch payload?

## What GW CORE Expects Today

GW CORE expects, in most SDK-facing flows:

- a DIDComm/FAPI-style outer envelope
- a project batch body (`BundleJsonApi`)
- entries that carry FHIR-like resources
- canonical claims in `resource.meta.claims`

It does not primarily expect:

- pure FHIR REST payloads with no project envelope
- `CommMsgExtended` directly from frontend/backend integrators

## Communication-Specific Rule

For `Communication` flows:

- the client usually sends a FHIR-like `Communication`
- the GW may convert that to `CommMsgExtended` internally
- attached bundles/resources may travel inside the `Communication.payload`

So:

- external contract for new developers = `Communication` FHIR-like
- internal GW representation = may become `CommMsgExtended`

## Read This Next

After this file:

- IPS request flow:
  [101-IPS_BUNDLE.md](./101-IPS_BUNDLE.md)
- consent editing:
  [101-CONSENT_ACCESS.md](./101-CONSENT_ACCESS.md)
- sdk-core communication staging:
  [gdc-sdk-core-ts/docs/101-CONSENT_COMMUNICATION.md](https://github.com/Global-DataCare/gdc-sdk-core-ts/blob/main/docs/101-CONSENT_COMMUNICATION.md)
- sdk-core IPS outbox:
  [gdc-sdk-core-ts/docs/101-IPS_COMMUNICATION_OUTBOX.md](https://github.com/Global-DataCare/gdc-sdk-core-ts/blob/main/docs/101-IPS_COMMUNICATION_OUTBOX.md)
