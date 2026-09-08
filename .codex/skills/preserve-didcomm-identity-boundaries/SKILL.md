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
6. Derive FHIR provenance from the source event, not from transport. For a
   member/caregiver flow, use the individual subject as `Composition.author`
   when the member records a fact dictated or created by that individual; use
   the registered `RelatedPerson` assignment when the member created it. The
   same RelatedPerson remains the personal `Composition.attester` in both
   cases, so author and attester may intentionally coincide. Apply the
   equivalent owner-versus-creator choice to organization/PractitionerRole
   flows.
7. Preserve the imported or generated actor `urn:uuid` plus a distinct
   assignment `urn:uuid`, owner and governed role. Emit ONESELF as the existing
   Patient, an individual member assignment as RelatedPerson, or a professional
   assignment as PractitionerRole plus its Practitioner. A new assignment
   gets a new UUID without changing the actor UUID. Email, telephone, OIDC
   `sub`, DCR `client_id`, operational actor DIDs and `kid` remain private
   channel aliases and never become the exported clinical author or attester.
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
4. Cross-link the Node BFF clinical-writes 101 and the GW authenticated-author
   101; keep one concise Composition/Bundle summary discoverable from each
   repository README.
5. Run direct FHIR and DIDComm transport tests. A mock unit test does not
   replace a real local boundary test.
6. Complete `test -> local-network -> test-network -> network` in that order.
   Do not publish, build an image or deploy while a required live E2E is
   skipped or failing.

## Mandatory release authorization continuity

For any release chain that requires npm authorization, make at most three
attempts and keep each command session and browser window alive for up to five
minutes. Never end the turn or imply continued work while a window is pending.
After all three attempts fail, keep the release unpublished and continue the
local `test` stage with an immutable `npm pack` tarball. Never commit a
`file:`, Git, workspace or vendored tarball dependency.

Follow the canonical contract in
[`docs/LOCAL_FIRST_RELEASE_CONTRACT.md`](../../../docs/LOCAL_FIRST_RELEASE_CONTRACT.md):

- Do not attempt `npm publish` until every affected local `test` gate is
  green, including unit, integration, local services, real UI and Playwright.
- An npm publish or authorization failure must never stop the `test` stage.
- Continue unit, integration, local service, UI and Playwright gates with the
  immutable tarball installed `--no-save` on pushed but unmerged branches.
- The `npm pack` tarball is temporary: install it `--no-save`, then restore
  the registry dependency and lockfile before committing dependency state.
- After a failure, resume only the smallest failed gate; do not repeat a green
  gate unless the fix changed its boundary, it creates required state, or the
  environment is no longer trustworthy.
- Resume the failed gate; rerun a predecessor only for required state, a
  changed earlier boundary or an untrustworthy environment.
- After publication, install the exact registry version and run only the minimal
  install/export smoke; do not repeat the green local matrix unless the
  published artifact differs from the tested tarball or invalidates that
  evidence.
- Missing exact registry publication blocks only consumer merge, image build,
  `local-network`, `test-network`/staging and `network` promotion.
- A gateway consumer installs the exact registry version before its merge,
  image build and `local-network`. A portal consumer may retain the immutable
  tarball on its pushed, unmerged branch throughout `local-network`; after
  `local-network` is green, it installs the exact registry version and runs
  only the artifact smoke before its merge and staging.
- Publish only after the local matrix is green, install the exact registry
  version in the gateway before `local-network`, and install it in portals
  before staging.
- Registry order is dependency publish and verification, then consumer install
  and lockfile pin, then package merge, consumer merge, image build and deploy.
- Every test file's first line must be a `Flow contract:` comment linking this
  policy. Apply TDD red -> green -> refactor: red must fail because the
  production behavior is absent or wrong; green must prove the production
  contract. A skip, accepted error, placeholder, pending setup, fixture-only UI
  or mock replacing a real boundary is never green.
- Reuse canonical types and terminology from HL7/FHIR, LOINC, SNOMED CT,
  ICD-10, WHO ATC, Schema.org or the applicable governed standard before
  inventing a local type, enum, code, identifier or vocabulary.
- Put missing reusable types in the versioned domain data package or
  `common-utils`, with tests in that owning shared package, before downstream
  use.
- Reuse canonical fixtures, builders, claims, identifiers and vocabulary from
  the versioned domain data package (`<version>-data` or
  `<version>-data-utils`) or `common-utils`; no duplicated literals are
  allowed. If the reusable datum does not exist, add it first to its owning
  shared package with tests and consume that export downstream.
