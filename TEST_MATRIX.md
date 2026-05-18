# TEST_MATRIX - gdc-common-utils-ts

## Goal
Guarantee deterministic shared utilities and claim contracts used by GW/SDK.

## Test Levels
1. Unit (required)
- Claim catalogs and mappings
- Canonicalization/hash/CID utilities
- Conversion helpers and validators

2. Contract (required when claim keys change)
- Verify key names and mapping compatibility
- Verify deprecated aliases (if any) still behave as documented

## Commands
- Full tests: `npm test -- --watchman=false`
- Targeted communication/CID tests:
  - `npm test -- --watchman=false --runInBand __tests__/utils-communication-fhir-r4.test.ts __tests__/utils-fhir-cid.test.ts __tests__/utils-communication-document-reference.test.ts`
- Typecheck: `npm run typecheck`
- Build: `npm run build`

## Current Critical Coverage
- `__tests__/utils-communication-fhir-r4.test.ts`
- `__tests__/utils-fhir-cid.test.ts`
- `__tests__/utils-communication-document-reference.test.ts`

## Exit Criteria
- No failing tests
- No undocumented new claim keys
- No behavior drift between docs/JSDoc/tests
