## Summary

This MR adds the first shared Observation local-first foundation in
`gdc-common-utils-ts`, focused on vital signs, bundle editing, and per-section
vault persistence.

It includes:
- Observation flat-claims contract cleanup and extension
- preferred Observation FHIR R4 converter renames
- Observation/vital-sign indexing profiles
- `IndividualBundleVault` for per-individual section persistence
- high-level `BundleEditor` support for `asVitalSign()` and `asObservation()`
- reusable examples, docs, and tests

## Main Changes

### Observation claims and conversion
- added richer Observation claims in:
  - `src/models/interoperable-claims/observation-claims.ts`
- clarified category vs coded value semantics:
  - `Observation.category` carries classification such as `vital-signs`
  - `Observation.value-concept-*` carries coded result values
- normalized new Observation quantity/composite claims to non-contextualized names
- renamed preferred converter helpers:
  - `observationFromFlatToFhirR4`
  - `observationToFlatFhirR4`
- kept compatibility aliases for the previous names

### Observation categories and vital signs
- added canonical Observation category descriptors in:
  - `src/constants/observation-category.ts`
- aligned vital-sign constants and examples
- added reusable vital-sign examples and bundle-entry builders in:
  - `src/examples/vital-signs.ts`

### Local vault and section persistence
- added:
  - `src/utils/individual-bundle-vault.ts`
  - `src/constants/individual-sections.ts`
- supports per-section persistence using `<individualId>_<section>`
- persists section manifest/composition state
- builds `indexed.attributes` from shared indexable-claim profiles

### Indexing
- extended `src/models/indexing.ts`
- added hierarchical Observation index profiles:
  - `AllowedIndexableClaims[Observation].General`
  - `AllowedIndexableClaims[Observation].VitalSigns`
- added composite-observation indexing primitives:
  - `Observation.component-tags`
  - `Observation.component-code-values`
  - `Observation.component-names`
  - `Observation.score-total-number`
  - `Observation.bp-systolic-number`
  - `Observation.bp-diastolic-number`

### Bundle editor
- extended `src/utils/bundle-editor.ts` with:
  - `ObservationComponentEntryEditor`
  - `VitalSignEntryEditor`
  - `ObservationEntryEditor`
  - `bundle.newEntry().asVitalSign()`
  - `bundle.newEntry().asObservation()`

### Docs and tests
- added docs:
  - `docs/OBSERVATION.md`
  - `docs/101-VITAL_SIGN_ENTRY_EDITOR.md`
- added tests:
  - `__tests__/101-vital-sign-entry-editor.test.ts`
  - `__tests__/convert-observation.test.ts`
  - `__tests__/examples-vital-signs.test.ts`
  - `__tests__/individual-bundle-vault.test.ts`
  - `__tests__/models-indexing.test.ts`

## Testing

Executed:
- `npm test -- --runTestsByPath __tests__/101-vital-sign-entry-editor.test.ts __tests__/models-indexing.test.ts`
- `npm test -- --runTestsByPath __tests__/models-indexing.test.ts __tests__/convert-observation.test.ts __tests__/individual-bundle-vault.test.ts`
- `npm test -- --runTestsByPath __tests__/101-vital-sign-entry-editor.test.ts __tests__/models-indexing.test.ts __tests__/convert-observation.test.ts __tests__/individual-bundle-vault.test.ts`

## Known Follow-ups

Not closed yet in this MR:
- full IPS document import distribution for all Observation composite cases
- configurable HMAC wiring in `IndividualBundleVault`
- export by selected sections to full FHIR document bundles
- R5 export path
- richer composite Observation profiles such as APGAR/Glasgow beyond the initial
  blood-pressure parent-index pattern
