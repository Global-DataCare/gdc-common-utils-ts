---
name: preserve-didcomm-identity-boundaries
description: Preserve and explain the canonical DIDComm, FAPI, DCR and SMART identity separation across shared utils, SDKs, gateways, tests, Swagger examples and portal snippets. Use for from, iss, kid, sub, Communication.sender, stable contact aliases, DCR keys, SMART scopes or transport-profile changes.
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

## Change procedure

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
