# 101 Reading Path

> 101 note
> - Start here when you need the `gdc-common-utils-ts` learning order.
> - This repo owns shared public helpers, editors, readers, profile/wallet primitives, and transport composition.
> - Continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts` for actor/runtime orchestration.

## Read First

1. [101-DIDCOMM-IDENTITY-BOUNDARY.md](./101-DIDCOMM-IDENTITY-BOUNDARY.md)
2. [101-COMMUNICATION_LAYERING.md](./101-COMMUNICATION_LAYERING.md)
3. [101-BFF_AND_CHANNEL_MESSAGE_FLOW.md](./101-BFF_AND_CHANNEL_MESSAGE_FLOW.md)
4. [gdc-sdk-core-ts/docs/101-USER_STORY_CANON.md](https://github.com/Global-DataCare/gdc-sdk-core-ts/blob/main/docs/101-USER_STORY_CANON.md)
5. [101-BUNDLE_EDITOR_READER.md](./101-BUNDLE_EDITOR_READER.md)
6. [101-LIFECYCLE.md](./101-LIFECYCLE.md)
7. [101-INDIVIDUAL-MEMBER-SMART.md](./101-INDIVIDUAL-MEMBER-SMART.md)
8. [101-SUBJECT_IDENTITY_COLLECTION.md](./101-SUBJECT_IDENTITY_COLLECTION.md)

## User Story Start

For a self-managed user in a BFF, web app, or native app, the real story does
not begin with claims editing. It begins with runtime adapters plus
profile/wallet/runtime entry, then one loaded workspace/session, and only then
claims/bundle helpers.

Normal runtime rule:

- the user profile runtime normally encrypts outbound messages and decrypts
  inbound replies itself
- that can happen inside a BFF, a web shell, or a native Expo app after the
  user profile has been loaded/unlocked
- a proxy/service wallet is optional and separate; do not treat it as the
  default user story

Frontend decoding rule:

- first decode one DIDComm/plain payload into one `Communication`
- then show communication metadata and attachment kind
- then open the attached business payload
- explain backend search separately with public FHIR search parameters such as
  `Composition.section`, not with local bundle-reader traversal

Canonical lower-layer path:

```ts
// 1. Author one entry in the dedicated IPS bundle editor tutorial.
//    This README only consumes the finished bundle fixture.
//    If you need a ready-made transport setup helper, use the shared
//    example fixture instead of teaching claims aggregation as the main flow.
const documentBundle = buildExampleMedicationIpsDocumentBundle(...);

// 2. Wrap the finished bundle in one delivery Communication.
const deliverCommunication = new CommunicationEditor(...)
  .setCommunicationIdentifier(...)
  .setCommunicationSubject(...)
  .setCommunicationCategory(...)
  .setAttachedBundle(documentBundle);

// 3. Render the transport payload.
const didcommPayload = buildDidcommPayloadFromCommunicationClaims(...);

// 4. Read one received payload back on the app/BFF side.
const receivedCommunication = CommunicationReader.fromDidcommPayload(didcommPayload);
const receivedDocumentBundleReader = receivedCommunication.getAttachedBundleReader();
```

If you only need a ready-made fixture for a transport test, use
`buildExampleMedicationIpsDocumentBundle(...)` as the secondary setup helper.
Do not teach `buildBundleDocumentFromClaims(...)` as the beginner authoring
surface.

```ts
// Search is a different story.
// Teach it with public FHIR parameters, not local bundle traversal:
// Bundle?type=document&composition.subject=<did>&composition.section=10160-0,48765-2
```

This repo only owns the shared lower layer of that story:

- bundle authoring and reopen/edit roundtrip:
  [__tests__/101-ips-bundle-editor.test.ts](../__tests__/101-ips-bundle-editor.test.ts)
- family entry editors for typed one-by-one authoring:
  [__tests__/101-ips-family-entry-editors.test.ts](../__tests__/101-ips-family-entry-editors.test.ts)
- communication/profile/wallet primitives:
  [__tests__/101-profile-manager-mem.test.ts](../__tests__/101-profile-manager-mem.test.ts)
- communication transport roundtrip through one profile:
  [__tests__/101-communication-profile-wallet-e2e.test.ts](../__tests__/101-communication-profile-wallet-e2e.test.ts)
- transport/readback around one finished clinical document:
  [__tests__/101-communication-medication-document.test.ts](../__tests__/101-communication-medication-document.test.ts)
- employee transport roundtrip through one profile:
  [__tests__/101-employee-profile-wallet-e2e.test.ts](../__tests__/101-employee-profile-wallet-e2e.test.ts)

The higher-level authenticated-user entrypoint lives upstream in `sdk-node`:

- login/load/unlock one protected profile:
  `loadProfile(...)`
- session to actor facade:
  [gdc-sdk-node-ts/tests/101-backend-profile-runtime.test.mjs](https://github.com/Global-DataCare/gdc-sdk-node-ts/blob/main/tests/101-backend-profile-runtime.test.mjs)
- chainable actor workspace after profile load:
  [gdc-sdk-node-ts/tests/101-profile-workspace-runtime.test.mjs](https://github.com/Global-DataCare/gdc-sdk-node-ts/blob/main/tests/101-profile-workspace-runtime.test.mjs)
- backend wallet/session job manager:
  [gdc-sdk-node-ts/tests/101-wallet-backed-job-manager.test.mjs](https://github.com/Global-DataCare/gdc-sdk-node-ts/blob/main/tests/101-wallet-backed-job-manager.test.mjs)

## Main Executable 101 Tests

- [__tests__/101-communication-profile-wallet-e2e.test.ts](../__tests__/101-communication-profile-wallet-e2e.test.ts)
- [__tests__/101-communication-medication-document.test.ts](../__tests__/101-communication-medication-document.test.ts)
- [__tests__/101-employee-examples.test.ts](../__tests__/101-employee-examples.test.ts)
- [__tests__/101-ips-bundle-editor.test.ts](../__tests__/101-ips-bundle-editor.test.ts)
- [__tests__/101-profile-manager-mem.test.ts](../__tests__/101-profile-manager-mem.test.ts)

## Boundary

- Teach here: the highest-level public helper already exported by `common-utils`.
- Fallback only: raw `meta.claims`, `upsert*`, direct wallet pack/unpack.
- Continue upward: `gdc-sdk-core-ts/docs/101-SDK_FLOWS.md`, `gdc-sdk-node-ts/docs/101-SDK_INTEGRATION.md`.
