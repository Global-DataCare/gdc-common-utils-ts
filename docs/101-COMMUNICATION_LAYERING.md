# Communication Layering 101

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
