# AGENTS.md - gdc-common-utils-ts

## Purpose
`gdc-common-utils-ts` is the canonical shared layer for claim catalogs, conversion helpers, canonicalization/hash/CID utilities, and validator adapters used by GW and SDKs.

Primary references in this repo:
- `README.md`
- `docs/normalization-spec.md`
- `docs/clinical-sections-workbook-ehds-crosswalk.md`

## Hard Rules (Project-Specific)
1. Canonical interoperable claim keys are defined here first.
2. Any new/renamed claim must be reflected in:
- `src/models/interoperable-claims/*`
- associated tests
- docs/README snippets when externally relevant.
3. Do not encode business orchestration logic from GW/SDK in this repo.
4. Public exports require JSDoc and deterministic tests.
5. CID/hash behavior must state clearly:
- canonical input
- hash algorithm
- multicodec/multibase assumptions
- compatibility constraints.
6. Activation controller policy is centralized here:
- a legal representative keeps an ISCO-08 occupation in the separate `LegalRepresentativeCredential`;
- controller authority is bare `RESPRSN` in `ServiceControllerCredential.credentialSubject.owner.additionalType`;
- the controller VC may additionally carry an independently coded ISCO-08 occupation;
- legacy representative-bound role tokens may be normalized for compatibility but must not become canonical examples.
7. Shared response fixtures and readers preserve the primary-document boundary:
- DIDComm `body` is the FHIR-like/JSON primary Bundle;
- successful search matches live at `body.data[].resource` (or FHIR `entry[].resource`);
- never author a nested `{ total, data }` list inside `BundleEntry.resource`;
- shared examples own governed identifiers and wire values so consumers do not repeat literals.

## Communication + DocumentReference Rules
1. Distinguish FHIR native model vs atomic conversion profile:
- FHIR Communication can be multi-payload/multi-note.
- Atomic profile may constrain 1 payload + 1 note per logical unit.
2. For DocumentReference claims vocabulary, prefer:
- `DocumentReference.identifier` for logical business identifier
- `DocumentReference.contenthash` for content hash/CID
- `DocumentReference.contenttype`, `DocumentReference.contentdata` as needed.
3. Backward compatibility aliases are temporary and must include deprecation note.

## TDD Policy
Mandatory sequence:
1. Add failing test.
2. Implement minimum to pass.
3. Refactor without behavior change.

No change is accepted without tests for:
- positive path
- at least one negative/validation path
- compatibility behavior when aliases are supported.

## 101 Tutorial Policy
Any test labeled `101` must read like an executable tutorial.

Required structure:
1. Start with a `Teaching goal` comment block.
2. Use explicit `Step 1.`, `Step 2.`, ... comments for the main flow.
3. Explain app/user intent, not only helper plumbing.
4. State clearly when a low-level helper path is an escape hatch and not the main tutorial path.

Reject `101` tests that only prove internals but do not teach the intended app flow.

## Quality Gates
Run before merge:
- `npm run typecheck`
- `npm test -- --watchman=false`
- `npm run build`

## Current Canonical Security Contract (Activation)
1. The legal representative subject must be identified and `memberOf.taxID` must match the organization tax identifier.
2. The controller VC `provider.taxID` must match the organization tax identifier.
3. `credentialSubject.owner.additionalType` must resolve to bare `RESPRSN`.
4. `credentialSubject.owner.hasCredential.material` must bind the controller key.
5. The older representative-bound `RESPRSN` and `hasCredential` shape remains compatibility-only.

Implementation reference:
- `src/utils/activation-policy.ts`

## Release Discipline
- Branch closure is indivisible. One behavior, flow or release-discipline
  branch owns one patch release. Do not open another fix/feature branch until
  red-green TDD where behavior changes, all required no-skip gates, changelog,
  package and lockfile patch, branch push, npm publication and clean-install
  verification, explicit merge, pushed `main`, matching refs and a clean
  worktree are complete.
- Publish a dependency chain from the lowest changed package upward. A consumer
  may pin only the exact registry version already verified for integrity and
  exports; Git, file, workspace and vendored substitutes are forbidden.
- Promote cumulatively through
  `test -> local-network -> test-network -> network`; no later environment
  substitutes for an earlier gate.
- Update `CHANGELOG.md` under `Unreleased` with concrete bullets.
- Keep SemVer discipline for public API behavior changes.
- Publish only when `prepublishOnly` gates pass.

## Coordination Boundaries
- GW endpoint semantics live in `gwtemplate-node-ts` docs/tests.
- SDK orchestration semantics live in `dataspace-client-sdk-node` docs/tests.
- This repo owns canonical reusable primitives and claim vocabulary.
