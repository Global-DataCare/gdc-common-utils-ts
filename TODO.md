# TODO - gdc-common-utils-ts

Canonical roadmap references:
- `TODO_ROADMAP.md`
- `TODO_INTEROPERABLE_CLAIM_CATALOG.md`
- `docs/DATASPACE_DISCOVERY_ROADMAP.md`

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
6. Add canonical consent-management primitives used by frontend, GW, and SDK layers:
   - grouped consent draft DTOs for `professional`, `organization`, `department`, `office`, `related-person`, and `individual` targets
   - atomic-rule expansion from grouped consent input
   - actor-target normalization by `email`, `phone`, and `did:web`
   - professional-role cardinality rules (`professional` target -> one role, organizational targets -> many roles split into atomic rules)
   - semantic diff helpers between original and updated consent drafts
   - deterministic hashing inputs for added/removed/disabled/reactivated atomic rules
7. Add canonical consent query/filter helpers for frontend-managed collections:
   - filter/group by actor type
   - filter by professional selector (`email`, `phone`)
   - filter by `did:web` target
   - filter/group active vs disabled consent entries
8. Add canonical clinical import builders for "Agregar datos" flows:
   - draft DTOs for `document + section + clinical date + code.display + target resource type`
   - meta-claim builders by FHIR resource family
   - validation helpers for minimum import metadata before GW submission
   - interoperable payload helpers that preserve enough metadata for later FHIR R4 / IPS consolidation
9. Add canonical `RelatedPerson` classification/filter helpers:
   - distinguish professional invitations vs individual/family contacts
   - emergency-contact detection from category/coding (`EMER` or equivalent canonical claim)
   - helper predicates for professional `did:web` targets vs individual/family targets
   - grouped view DTOs for UI tables and filtered queries
10. Add canonical unified-view / IPS resource helpers:
   - section-aware resource classification and filtering
   - clinical-date extraction/filtering across supported resource families
   - `code.text` extraction helpers with deterministic fallback rules
   - XHTML reuse when a resource already carries narrative/content
   - XHTML generation from `meta.claims` when narrative is missing
   - shared render-input DTOs for `resource type + code text + dates + section + summary fields`
11. Start dataspace discovery foundation:
   - EU coverage helpers
   - semantic `credentialSubject` parsing
   - flattened `meta.claims` projection helpers
   - parameterized examples without hardcoded business identities
12. Finish onboarding/discovery claim cleanup:
   - keep `org.schema.Service.serviceType` limited to canonical technical capabilities such as `organization/Composition.cruds`
   - keep `org.schema.Service.additionalType` limited to compact HL7 `ActReason` values such as `http://terminology.hl7.org/CodeSystem/v3-ActReason|METAMGT,HRESCH`
   - stop copying onboarding provider locator/domain values into `Service.serviceType` and `Order.orderedItem.serviceType`
   - add a separate canonical claim/field for provider locator or provider base URL
   - update onboarding docs/examples to serialize only the new separation while preserving read compatibility for legacy payloads
13. Keep repo scope boundaries explicit:
   - do not define concrete Fabric channel names here
   - do not define veterinary network taxonomy here
   - do not define concrete regional rollout naming here
   - leave veterinary taxonomy ownership to `uhc-sdk-core-ts`
14. Keep `101-*` tests aligned with public editing surfaces:
   - future `101` coverage should prefer `BundleEditor`-driven flows and public builders
   - do not grow new `101` tests around internal/private helper functions as the primary entry point

## NEXT
1. Introduce formal validator adapter examples for strict FHIR profile checks in CI.
2. Add explicit tests for alias deprecation paths (when legacy keys are accepted).
3. Extend canonicalization docs with multibase/multicodec decision table.
4. Extract reusable query DTO examples for consent views, related-person views, and clinical-import drafts.

## LATER
1. Multi-attachment indexed claims pattern (`attachment[i]`) with deterministic encoding conventions.
2. Additional FHIR versions/profiles through adapter registry.
