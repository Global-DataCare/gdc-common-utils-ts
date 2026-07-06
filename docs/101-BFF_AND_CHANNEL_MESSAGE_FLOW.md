# BFF And Channel Message Flow 101

> 101 note
> - Use this file when you need the simplest mental model for message ownership.
> - Read it together with [101-profile-manager-mem.test.ts](../__tests__/101-profile-manager-mem.test.ts) and [101-communication-profile-wallet-e2e.test.ts](../__tests__/101-communication-profile-wallet-e2e.test.ts).

## One-Sentence Story

The normal case is:

`user profile runtime builds the payload -> user profile wallet encrypts and sends -> BFF/channel service forwards/orchestrates -> GW receives and processes`

## Three Actors

### 1. User Profile Runtime

This is the main actor in the beginner story.

It normally owns:

- the unlocked user profile
- the user wallet/session
- encrypting outbound messages
- decrypting inbound replies
- keeping decoded replies by `thid`

In `common-utils`, this story appears in:

- [101-profile-manager-mem.test.ts](../__tests__/101-profile-manager-mem.test.ts)

### 2. BFF Or Channel Service

This is the application/service actor around the user runtime.

It may own:

- local outbox orchestration for several user profiles
- priority and retry policy
- route selection
- logging/audit
- optional service-side wallet/runtime

Important rule:

- a service wallet is optional infrastructure
- it must not replace the beginner mental model of "the user profile wallet encrypts/decrypts its own messages"

### 3. GW CORE

GW owns the server-side processing after reception.

It owns:

- endpoint acceptance
- internal async processing
- submit/poll contracts
- indexing/search/storage behavior

It does not own:

- the caller-side priority queue before submission
- the caller-side unlocked profile wallet

## Two Different Queues

Do not mix these:

1. local outbox/queue before GW submission
2. GW async processing after reception

Beginner rule:

- the sender decides what leaves first
- GW decides what happens after it arrives

## Which 101 Teaches What

- payload authoring only:
  [101-communication-profile-wallet-e2e.test.ts](../__tests__/101-communication-profile-wallet-e2e.test.ts)
- local profile queue/send/read-reply:
  [101-profile-manager-mem.test.ts](../__tests__/101-profile-manager-mem.test.ts)
- higher backend runtime/orchestration:
  [gdc-sdk-node-ts/tests/101-backend-profile-runtime.test.mjs](https://github.com/Global-DataCare/gdc-sdk-node-ts/blob/main/tests/101-backend-profile-runtime.test.mjs)

## Frontend Rule

Teach the frontend/BFF path in this order:

1. decode one DIDComm/plain payload into one `Communication`
2. show `Communication` metadata such as identifier, subject, topic, text, and attachment kind
3. open the attached payload and read that bundle/document/file
4. for the current health use cases, prefer one document bundle with
   `Composition` first entry, authored in the IPS bundle-editor tutorial
5. only after that, move to higher SDK submit/poll orchestration

Do not teach frontend readers to reproduce backend search semantics locally.

Backend search must be explained separately with public FHIR search parameters,
for example:

- `Composition.section=10160-0,48765-2`

Internal indexing, `meta.claims`, and derived attributes belong to the backend
implementation story, not to the beginner frontend story.
