# Narrative Alignment Contract

This is the master contract for all 101-style docs, tests, snippets, and example payload walkthroughs that teach the end-to-end GDC story.

If a file teaches a local app/BFF, SDK, or GW step, it must still explain the full story around that step. No example should read like the whole architecture when it only shows one slice of it.

## Required story order

Every 101 explanation must present the story in this order, even if some steps are mocked in the local repo:

1. Login or authentication bootstrap.
2. loadProfile(...) or the equivalent runtime unlock step.
3. Loaded-profile workspace creation.
4. Wallet/key material selection from the loaded profile.
5. Security mode decision:
   - FHIR compatibility
   - didcomm-plain+json
   - strict FAPI JWE/JAR/JARM
6. If FHIR is used, name the version explicitly.
7. If strict mode is used, state which profile-owned keys are used for signing and encryption.
8. Only then explain the local route, queue, manager, payload, or helper behavior under test.

## Canonical security narrative

- FHIR compatibility is a compatibility path, not the default story unless the example is intentionally about FHIR-shaped interoperability.
- didcomm-plain+json is an explicit transport choice.
- strict mode means the loaded profile and its wallet material determine the outbound signed/encrypted envelope.
- if the example uses FAPI JWE/JAR/JARM, say so directly and say where the envelope was created.
- if the profile exposes PQC-capable keys, say that those profile-owned keys are the ones used for the envelope.

## What each repository owns

### gdc-common-utils-ts
Use this repo to teach:
- login and user-story bootstrap
- the user-facing payload building story
- canonical claim construction
- examples that show how a developer starts from the front-story

Common-utils should not teach gateway internals. It should teach the payload and runtime entry point that precedes GW.

### gdc-sdk-core-ts
Use this repo to teach:
- shared neutral helpers
- canonical contract primitives
- reusable example fixtures and models

### gdc-sdk-node-ts and gdc-sdk-front-ts
Use these repos to teach:
- loadProfile(...)
- loaded-profile wallet and key selection
- runtime-dependent envelope creation
- how the application decides whether it will send FHIR, plain DIDComm, or strict FAPI JWE/JAR/JARM

These repos are where the example should show the transition from profile to working envelope.

### gwtemplate-node-ts
Use this repo to teach:
- what the gateway actually accepts on the wire
- how requests are decoded, queued, validated, and answered
- which canonical route contracts are exposed
- what compatibility modes are tolerated

GW docs and tests must not imply that the gateway itself performs the upstream profile bootstrap.

## Writing rule for tests, snippets, and docs

Every teaching file must answer:
- What was mocked?
- Where does the real implementation live upstream?
- Why is this local example still useful?
- Is this canonical behavior or compatibility behavior?
- Which layer decides the transport/security mode?
- If the example is FHIR-shaped, what version is it?

If any answer is missing, the example is incomplete for 101 purposes.