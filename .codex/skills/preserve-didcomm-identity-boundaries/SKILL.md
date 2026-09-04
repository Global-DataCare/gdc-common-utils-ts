---
name: preserve-didcomm-identity-boundaries
description: Preserve and explain the canonical DIDComm, FAPI, DCR, SMART and FHIR IPS creator-identity separation across shared utils, SDKs, gateways, tests, Swagger examples and portal snippets. Use for from, iss, kid, sub, Communication.sender, Composition.author, stable creator UUIDs, stable contact aliases, DCR keys, SMART scopes, IPS export or transport-profile changes.
---

# Preserve DIDComm Identity Boundaries

## Source of truth

Use `gdc-common-utils-ts` models, builders and examples. Do not duplicate
identity strings in consumers. Start with:

- `src/models/confidential-message.ts`
- `src/examples/didcomm-identity.ts`
- `docs/101-DIDCOMM-IDENTITY-BOUNDARY.md`
- `__tests__/101-didcomm-identity-boundary.test.ts`

## Required contract

1. Direct DIDComm/FAPI request: `from = iss = sender DID`.
2. `meta.jws.protected.kid` identifies the signing key; it is not the actor.
3. DCR client acting for a person: `from = iss = client/device DID`, while
   SMART `body.sub = actor DID` and `scope` limits the subject data.
4. Raw email, telephone and card ids never become canonical `from` values.
   Use shared stable-identifier and DID builders.
5. FHIR JSON transport carries `Communication`/`Bundle` only. Authentication
   stays in HTTP Authorization. `Communication.sender` is not transport proof.
6. Keep direct clinical writes unchanged: `sender = profile.actorDid`, the
   transport projects that value to DIDComm `from`/`iss`, `recipient` is the
   real provider tenant DID and locally authored `Composition.author` is the
   same profile actor DID.
7. Resolve that operational DID only at FHIR IPS export time. Preserve the
   imported or generated actor `urn:uuid` plus a distinct assignment
   `urn:uuid`, owner and governed role. Emit ONESELF as the existing Patient,
   an individual member assignment as RelatedPerson, or a professional
   assignment as PractitionerRole plus its Practitioner. A new contract gets
   a new assignment UUID without changing the actor UUID. Email, telephone,
   OIDC `sub`, DCR `client_id`, operational actor DIDs and `kid` remain private
   channel aliases and never become the exported clinical author.
8. Consent permissions for a bound clinical creator use the assignment UUID
   plus its separate governed role. Do not calculate new permission identity
   from a replaceable phone number, email address, DCR client or key.

## Change procedure

Treat branch closure as indivisible. One behavior, flow or release-discipline
branch owns one patch release; do not start another fix/feature branch until
all required tests and no-skip live gates, changelog, package and lockfile
patch, branch push, registry publication and clean-install verification,
explicit merge, pushed `main`, matching refs and clean worktree are complete.
Publish reusable dependencies from the lowest changed package upward and pin
only exact registry versions already verified for integrity and exports.

1. Add the smallest failing contract test before implementation.
2. Reuse examples exported by `gdc-common-utils-ts/examples` in every SDK, GW
   and portal test; do not introduce copied literals.
3. Keep JSDoc, the high-level commented snippet, Swagger and README links in
   sync with the executable fixture.
4. Run direct FHIR and DIDComm transport tests. A mock unit test does not
   replace a real local boundary test.
5. Complete `test -> local-network -> test-network -> network` in that order.
   Do not publish, build an image or deploy while a required live E2E is
   skipped or failing.
