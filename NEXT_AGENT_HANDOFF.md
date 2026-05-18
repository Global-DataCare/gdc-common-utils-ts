# NEXT AGENT HANDOFF - gdc-common-utils-ts

## Objective
Centralize all flat interoperable claim contracts and bidirectional conversion helpers in this repo.

## Why
Claims are still partially scattered across other repos/legacy utility sets; canonical ownership must be here.

## Mandatory Scope
1. Claims catalogs for each resource family must live under `src/models/interoperable-claims/*`.
2. Converters from flat claims -> FHIR resource and FHIR resource -> flat claims must be standardized here.
3. Keep JSDoc complete for all exported conversion utilities.

## TDD Work Plan
1. Add failing tests for missing resource families used in IPS indexing/retrieval:
- MedicationStatement
- AllergyIntolerance
- Condition
- Device/DeviceUseStatement (as used by current GW profile)
- DocumentReference
2. Implement minimal converters.
3. Add roundtrip tests (flat -> FHIR -> flat) with canonical claim key assertions.

## Acceptance Criteria
- New converters exported from `src/utils/index.ts`.
- Claim keys documented in claim catalogs.
- No claim-key drift vs GW/SDK docs.
- `npm run typecheck`, `npm test`, `npm run build` all pass.

## Coordination Notes
- GW and SDK must consume these converters; do not duplicate conversion logic there.
- Keep compatibility aliases explicit and deprecated when needed.
