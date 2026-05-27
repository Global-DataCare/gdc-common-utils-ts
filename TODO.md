# TODO - gdc-common-utils-ts

Canonical roadmap references:
- `TODO_ROADMAP.md`
- `TODO_INTEROPERABLE_CLAIM_CATALOG.md`

## NOW
1. Complete claim catalog parity for resource families used in GW/SDK core flows.
2. Keep DocumentReference claim vocabulary aligned (`identifier` vs `contenthash`).
3. Maintain strict JSDoc clarity for atomic conversion profile vs native FHIR model.
4. Centralize any remaining scattered flat-claim conversion logic from other repos/util modules into this package.
5. Add canonical shared claims/types for individual-member licensing and related-profile resolution:
   - invitation/activation status vocabulary
   - active relationship summary DTOs
   - normalized `RelatedPerson` claim access for actor/subject/role/status
   - baseline individual-seat semantics (controller auto-consumed first seat, default free 2-seat bundle)

## NEXT
1. Introduce formal validator adapter examples for strict FHIR profile checks in CI.
2. Add explicit tests for alias deprecation paths (when legacy keys are accepted).
3. Extend canonicalization docs with multibase/multicodec decision table.

## LATER
1. Multi-attachment indexed claims pattern (`attachment[i]`) with deterministic encoding conventions.
2. Additional FHIR versions/profiles through adapter registry.
