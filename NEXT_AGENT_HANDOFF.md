# NEXT AGENT HANDOFF - CLINICAL IPS / BUNDLE EDITOR-READER

## Objective
Finish the shared IPS clinical surface so developers can:

- read real IPS bundles with high-level entry-first helpers
- edit/build IPS bundles with high-level typed editors
- roundtrip with explicit `toFhirR4()` / `fromFhirR4()` contracts
- follow one canonical set of docs/tests without plumbing drift

This handoff intentionally preserves the exact decisions already made in the
thread so the next agent does not re-open them.

## Already Fixed

### Reader contract

The reader side was intentionally moved to an **entry-first** model.

Use:

- `getEntries(...)`
- `getSectionCounts(...)`
- `getAllergies(...)`
- `getConditions(...)`
- `getMedications(...)`
- `getVitalSigns(...)`

The family-specific getters now return **bundle entries**, not resources only.

That means:

- `fullUrl` is preserved
- `resource` is preserved
- `resource.meta.claims` is preserved when present

Render helpers accept either one entry or one resource:

- `getLocalTextAndIntDisplay(resourceOrEntry)`
- `getXhtmlOrDerived(resourceOrEntry)`
- `getNarrative(resourceOrEntry)`

`getSectionSummary(...)` is not the preferred teaching API anymore.
`getSectionCounts(...)` is the preferred count API.
`getSectionSummary(...)` remains compatibility-only.

### Documentation rules already fixed

- No `upsert...` in `101` onboarding docs.
- No raw section literals such as `LOINC|10160-0` in docs/tests when shared
  constants exist.
- No `voice` ownership wording in `gdc-common-utils-ts`, `gdc-sdk-core-ts`, or
  `gdc-sdk-node-ts`.
- Use `ipsBundleReader` in docs, not `facade`.
- Keep `101` docs high-level and chainable.
- Keep technical plumbing in code/JSDoc/reference/tests, not in the first
  onboarding flow.
- In basic family snippets, do not add `sections` unless section filtering is
  the actual teaching point.
- Keep `sections` only in explicit advanced blocks such as:
  - limiting one generic query to selected sections
  - limiting one family query to selected sections
- Do not teach one public `query` object as the human-facing API shape.
  Internal query objects are fine, but public docs should present explicit
  parameters and already-defined shared types.

### Subject handling decision already fixed

For IPS clinical editing, `subject` should not be one public method the
integrator keeps setting entry by entry.

The correct target model is:

- `subjectId` is internal readonly context of the IPS editor/reader
- subject is derived from:
  - `Composition.subject`
  - the opened IPS bundle
  - or the explicit constructor/open call
- no public `setSubject(...)` in the normal IPS editor happy path

`subject` may still exist in low-level/general tables for compatibility, but it
is **not** a primary IPS editor method.

### API shape decisions already fixed

These decisions should not be reopened:

- `getSectionSummary(...)` is not the preferred public API story
- `getSectionCounts(...)` is the preferred count API story
- `getEntries(...)` is the generic high-level entry API
- family getters should return entries directly:
  - `getAllergies(...)`
  - `getConditions(...)`
  - `getMedications(...)`
  - `getVitalSigns(...)`
- do not split the public API into one confusing pair such as
  `getConditions(...)` versus `getConditionEntries(...)`
- do not teach `entryIndex`, duplicate `claims`, or other wrapper noise when
  `resource.id` and `resource.meta.claims` already exist inside the returned
  entry resource

## Official HL7 IPS references to align with

Do not lose these:

- IPS example index:
  - https://build.fhir.org/ig/HL7/fhir-ips/en/examples.html
- canonical IPS example bundle:
  - https://build.fhir.org/ig/HL7/fhir-ips/en/Bundle-IPS-examples-Bundle-01.html

The example index currently includes at least:

- `AllergyIntolerance`
- `Bundle`
- `Composition`
- `Condition`
- `DeviceUseStatement`
- `Device`
- `DiagnosticReport`
- `Immunization`
- `ImagingStudy`
- `Medication`
- `MedicationRequest`
- `MedicationStatement`
- `Observation`
- `Organization`
- `Patient`
- `Practitioner`
- `PractitionerRole`
- `Procedure`
- `Specimen`

The example bundle shows real document-level IPS behavior such as:

- `Composition`
- `Patient`
- `Practitioner`
- `Organization`
- `Condition`
- multiple sections
- explicit `fullUrl` per entry

The next agent must use those examples as the realism bar for snippets and
table coverage.

## Current docs to preserve

Canonical docs in `gdc-common-utils-ts`:

- [docs/101-CLINICAL-IPS.md](./docs/101-CLINICAL-IPS.md)
- [docs/101-IPS_BUNDLE.md](./docs/101-IPS_BUNDLE.md)
- [docs/REFERENCE-CLINICAL-IPS-API.md](./docs/REFERENCE-CLINICAL-IPS-API.md)
- [docs/101-BUNDLE_EDITOR_READER.md](./docs/101-BUNDLE_EDITOR_READER.md)

Relevant downstream docs:

- `gdc-sdk-node-ts/docs/101-PROFILE-ORCHESTRATION.md`
- GW bridge note:
  - `gwtemplate-node-ts/docs/01-OVERVIEW-AND-GUIDES/101-01.J-SHARED_BUNDLE_ENTRY_EDITORS.md`

Planned additional docs that still need to exist later:

- `101-CLINICAL-IPS-ALLERGIES.md`
- `101-CLINICAL-IPS-MEDICATIONS.md`
- `101-CLINICAL-IPS-CONDITIONS.md`
- `101-CLINICAL-IPS-VITAL-SIGNS.md`
- `101-CLINICAL-IPS-IMMUNIZATIONS.md`
- `101-CLINICAL-IPS-OBSERVATIONS.md`
- `101-CLINICAL-IPS-DIAGNOSTIC-REPORTS.md`
- `101-CLINICAL-IPS-PROCEDURES.md`

## Current tests to preserve

Shared / common-utils:

- `__tests__/101-bundle-ips-all-sections-claims.test.ts`
- `__tests__/101-communication-search-reference.test.ts`
- `__tests__/101-ips-bundle-editor.test.ts`
- `__tests__/101-medication-claim-helpers.test.ts`

SDK core:

- `tests/communication-document-facade.test.mjs`
- `tests/101-communication-ips-document-reader.test.mjs`

SDK node:

- `tests/101-profile-workspace-runtime.test.mjs`

GW:

- `src/__tests__/unit/examples/shared-bundle-entry-editors.test.ts`

## Current repo state / commits already created

`gdc-common-utils-ts`

- `0a3f9e2` docs: streamline 101 clinical bundle onboarding
- `8654e1d` docs: clarify IPS entry-first reader contract
- `04095f6` docs: keep shared helpers channel-neutral

`gdc-sdk-core-ts`

- `82cc05b` feat: return IPS bundle entries from high-level readers

`gdc-sdk-node-ts`

- `7b58f85` docs: point node orchestration to clinical ips reader
- `e17e3ae` feat: expose IPS entry readers in node workspace
- `5582201` docs: keep node orchestration channel-neutral

The next agent must preserve these decisions and build forward from them.

## What is still missing

### 1. IPS clinical editor surface is not complete

The editor side is **not** ready to call complete.

Missing target surface:

- `createIpsBundleEditor(...)`
- `openIpsBundleEditor(...)`
- `getSubjectId()`
- `getComposition()`
- `getSections()`
- `getSectionCounts()`
- `toFhirR4()`
- `fromFhirR4()`

Missing family-level editing entry points:

- `addAllergy()`
- `addMedicationStatement()`
- `addCondition()`
- `addImmunization()`
- `addProcedure()`
- `addDiagnosticReport()`
- `addObservation()`
- `addVitalSign()`
- later possibly:
  - `addPatient()`
  - `addPractitioner()`
  - `addOrganization()`
  - `addPractitionerRole()`
  - `addDevice()`
  - `addDeviceUseStatement()`
  - `addImagingStudy()`
  - `addSpecimen()`

Missing family-level open/edit entry points:

- `openAllergy(...)`
- `openMedicationStatement(...)`
- `openCondition(...)`
- `openImmunization(...)`
- `openProcedure(...)`
- `openDiagnosticReport(...)`
- `openObservation(...)`
- `openVitalSign(...)`

### Public snippet discipline still required

The next agent must keep these snippet rules:

- `101` docs should show chainable `get...` / `set...` usage
- `101` docs should not show plumbing helpers as the normal path
- `101` docs should not show raw FHIR claim names as the primary path when a
  typed setter/getter exists or is being proposed
- do not put `sections` into every snippet by default
- do not inline raw section code literals
- do not use `setSubject(...)` in IPS happy-path snippets
- keep `subject` contextual and readonly at the editor/reader level

### 2. Typed `get/set` editor methods are still incomplete

The reader side is in much better shape than the editor side.

The next agent must complete the table and implementation for the families
already present in `REFERENCE-CLINICAL-IPS-API.md`, especially:

- `AllergyIntolerance`
- `MedicationStatement`
- `Condition`
- `Immunization`
- `Procedure`
- `DiagnosticReport`
- `Observation`
- `VitalSigns`

And then expand explicit rows for:

- `CarePlan`
- `Flag`
- `ClinicalImpression`
- `Device`
- `Encounter`
- `Coverage`
- `DocumentReference`
- `Medication` when used separately from `MedicationStatement`
- `Patient`
- `Practitioner`
- `Organization`
- `PractitionerRole`
- `ImagingStudy`
- `Specimen`

### 3. `subject` and other context-derived fields need table treatment

The table must distinguish:

- `Primary IPS editor methods`
- `Context-derived automatically`
- `Allowed but not primary / fallback`

For example:

- `*.subject`
  - should be marked as context-derived in IPS editor docs
  - should not be taught as a normal repeated setter

The same review should be done for:

- document-level authoring metadata
- composition-level metadata
- possibly identifiers that are auto-generated per entry

### 4. Public doc surface must stay explicit, not generic-query-first

The thread decided that public doc/API teaching should prefer explicit lists and
typed parameters, not internal “query object” storytelling.

So the next agent should keep this distinction:

- internal implementation may use query objects
- public docs should show:
  - explicit `sections`
  - explicit `resourceTypes`
  - explicit filters per family
  - explicit `count/page/offset`

Do not regress to vague “query” wording in docs.

### 5. `toFhirR4()` / `fromFhirR4()` still need a canonical story

This is still missing as a polished IPS editor contract.

The next agent must decide and implement whether:

- `fromFhirR4(bundleDocument)` opens one typed IPS editor
- `toFhirR4()` materializes one FHIR R4 IPS bundle

Minimum expectation:

- one snippet from one FHIR IPS bundle -> editor -> modify -> back to FHIR R4
- one snippet from one empty/new editor -> add entries -> `toFhirR4()`

### 6. Snippets still need stronger alignment with real HL7 IPS examples

The current docs are better, but still not complete enough for:

- `Patient`
- `Practitioner`
- `Organization`
- `PractitionerRole`
- `Condition`
- `MedicationStatement`
- `AllergyIntolerance`
- `Procedure`
- `Observation`
- `Immunization`
- `DiagnosticReport`
- `DeviceUseStatement`
- `Device`

The next agent should derive one “realistic” canonical snippet set from:

- the IPS example bundle
- the example index page

### 7. `REFERENCE-CLINICAL-IPS-API.md` needs full completion

The table already has a strong base, but it still needs:

- all remaining IPS families added explicitly
- all missing typed methods added explicitly
- “context-derived” notes on rows such as `subject`
- explicit marking of what is:
  - implemented
  - compatibility-only
  - TODO
  - not recommended in IPS happy path

## Required design decisions the next agent must preserve

1. `101` docs must stay high-level and chainable.
2. No `upsert...` in `101` onboarding docs.
3. No raw LOINC section literals in snippets/tests when constants exist.
4. Reader families return entries, not resource-only arrays.
5. `getSectionCounts(...)` is preferred over `getSectionSummary(...)`.
6. `getSectionSummary(...)` is compatibility-only.
7. Render helpers accept entry or resource.
8. IPS editor should own readonly subject context internally.
9. `voice` wording must stay out of repos that are not voice-owned.

## Concrete next implementation checklist

### In `gdc-common-utils-ts`

1. Create/finish one canonical `IpsBundleEditor`.
2. Add typed family editors:
   - `asAllergy()`
   - `asMedicationStatement()`
   - `asCondition()`
   - `asImmunization()`
   - `asProcedure()`
   - `asDiagnosticReport()`
   - extend observation/vital-sign editors
3. Add `toFhirR4()` / `fromFhirR4()`.
4. Complete the reference matrix.
5. Add realistic snippets based on HL7 IPS examples.

### In `gdc-sdk-core-ts`

1. Keep the entry-first reader contract stable.
2. If editor-opening helpers are added here, keep them runtime-neutral.
3. Extend tests for additional IPS families beyond the current 4-family focus.

### In `gdc-sdk-node-ts`

1. Keep the workspace exposing the same entry-first surface.
2. Add examples/tests that consume the richer editor once it exists.
3. Keep node docs pointing upstream, not re-documenting internals.

## Final note for the next agent

Do **not** treat the current state as “done”.

Treat it as:

- reader contract stabilized enough to be useful
- docs much better than before
- editor side still materially incomplete for real IPS authoring

The next milestone is **editor completeness plus FHIR roundtrip clarity**.
