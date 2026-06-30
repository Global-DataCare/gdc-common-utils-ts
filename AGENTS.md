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
6. Activation representative policy is centralized here:
- canonical legal-representative occupation claim is `credentialSubject.hasOccupation.identifier.value`.
- canonical code value for responsible party is `RESPRSN`.
- legacy role token formats (for compatibility) may be normalized but must not become canonical examples.

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
1. Representative DID must be `did:web`.
2. `memberOf.taxID` must match organization tax identifier.
3. `hasOccupation.identifier.value` must resolve to `RESPRSN` after normalization.
4. `hasCredential.material` must be present.

Implementation reference:
- `src/utils/activation-policy.ts`

## Release Discipline
- Update `CHANGELOG.md` under `Unreleased` with concrete bullets.
- Keep SemVer discipline for public API behavior changes.
- Publish only when `prepublishOnly` gates pass.

## Coordination Boundaries
- GW endpoint semantics live in `gwtemplate-node-ts` docs/tests.
- SDK orchestration semantics live in `dataspace-client-sdk-node` docs/tests.
- This repo owns canonical reusable primitives and claim vocabulary.
