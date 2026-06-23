# Reference Clinical IPS API

This reference complements [101-CLINICAL-IPS.md](./101-CLINICAL-IPS.md).

Purpose:

- list the shared IPS claim surface that integrators should expect
- show the preferred high-level `get/set` names where they already exist or
  should exist
- keep one visible `TODO` column so missing helpers remain explicit
- preserve the canonical FHIR search/date parameter names such as
  `effective`, `onset-datetime`, and `performed-datetime`

Rules:

- do not invent new date/search names when FHIR already defines one
- use shared section constants, not raw LOINC literals, in code examples
- `Exists today?` describes current public shared API availability
- `TODO` describes what still needs to be added as typed high-level surface
- in `101` docs, do not default every family snippet to `sections`
- keep `sections` for explicit advanced filtering examples only
- keep internal query objects internal; human-facing docs should show explicit
  parameters or shared typed aliases

## Shared Entry Claim Matrix

| Claim | High-level set | High-level get | IPS section(s) | Canonical search/date field | Exists today? | TODO | Notes |
|---|---|---|---|---|---|---|---|
| `AllergyIntolerance.identifier` | `setIdentifier(...)` | `getIdentifier()` | `HealthcareBasicSections.AllergiesAndIntolerances.attributeValue` | `identifier` | no | yes | common typed setter/getter still missing |
| `AllergyIntolerance.subject` | `setSubject(...)` | `getSubject()` | `HealthcareBasicSections.AllergiesAndIntolerances.attributeValue` | `patient` / `subject` | no | yes | common typed setter/getter still missing |
| `AllergyIntolerance.code` | `setCode(...)` | `getCode()` | `HealthcareBasicSections.AllergiesAndIntolerances.attributeValue` | `code` | no | yes | allergen code |
| `AllergyIntolerance.category` | `setSection(...)` / `setCategory(...)` | `getSection()` / `getCategory()` | `HealthcareBasicSections.AllergiesAndIntolerances.attributeValue` | `category` | no | yes | prefer one semantic section helper |
| `AllergyIntolerance.clinical-status` | `setClinicalStatus(...)` | `getClinicalStatus()` | `HealthcareBasicSections.AllergiesAndIntolerances.attributeValue` | `clinical-status` | no | yes | standard FHIR search field |
| `AllergyIntolerance.verification-status` | `setVerificationStatus(...)` | `getVerificationStatus()` | `HealthcareBasicSections.AllergiesAndIntolerances.attributeValue` | `verification-status` | no | yes | standard FHIR search field |
| `AllergyIntolerance.criticality` | `setCriticality(...)` | `getCriticality()` | `HealthcareBasicSections.AllergiesAndIntolerances.attributeValue` | `criticality` | no | yes | standard FHIR search field |
| `AllergyIntolerance.onset-datetime` | `setOnsetDateTime(...)` | `getOnsetDateTime()` | `HealthcareBasicSections.AllergiesAndIntolerances.attributeValue` | `onset-datetime` | no | yes | standard FHIR search field |
| `AllergyIntolerance.recorder` | `setRecorder(...)` | `getRecorder()` | `HealthcareBasicSections.AllergiesAndIntolerances.attributeValue` | `recorder` | no | yes | optional but common |
| `MedicationStatement.identifier` | `setIdentifier(...)` | `getIdentifier()` | `HealthcareBasicSections.HistoryOfMedicationUse.attributeValue` | `identifier` | no | yes | common typed setter/getter still missing |
| `MedicationStatement.subject` | `setSubject(...)` | `getSubject()` | `HealthcareBasicSections.HistoryOfMedicationUse.attributeValue` | `subject` / `patient` | no | yes | common typed setter/getter still missing |
| `MedicationStatement.category` | `setSection(...)` / `setCategory(...)` | `getSection()` / `getCategory()` | `HealthcareBasicSections.HistoryOfMedicationUse.attributeValue` | `category` | no | yes | keeps section assignment semantic |
| `MedicationStatement.status` | `setStatus(...)` | `getStatus()` | `HealthcareBasicSections.HistoryOfMedicationUse.attributeValue` | `status` | no | yes | standard FHIR search field |
| `MedicationStatement.code` | `setCode(...)` | `getCode()` | `HealthcareBasicSections.HistoryOfMedicationUse.attributeValue` | `code` | no | yes | use when coding exists |
| `MedicationStatement.medication-text` | `setMedicationText(...)` | `getMedicationText()` | `HealthcareBasicSections.HistoryOfMedicationUse.attributeValue` | `medication` | no | yes | especially important for UX |
| `MedicationStatement.effective` | `setEffective(...)` | `getEffective()` | `HealthcareBasicSections.HistoryOfMedicationUse.attributeValue` | `effective` | no | yes | standard FHIR search field |
| `MedicationStatement.dosage-instruction` | `setDosageInstruction(...)` | `getDosageInstruction()` | `HealthcareBasicSections.HistoryOfMedicationUse.attributeValue` | n/a | no | yes | common app-facing text |
| `MedicationStatement.note` | `setNote(...)` | `getNote()` | `HealthcareBasicSections.HistoryOfMedicationUse.attributeValue` | n/a | no | yes | optional |
| `Condition.identifier` | `setIdentifier(...)` | `getIdentifier()` | problem sections | `identifier` | no | yes | common typed setter/getter still missing |
| `Condition.subject` | `setSubject(...)` | `getSubject()` | problem sections | `subject` / `patient` | no | yes | common typed setter/getter still missing |
| `Condition.code` | `setCode(...)` | `getCode()` | problem sections | `code` | no | yes | diagnosis code |
| `Condition.category` | `setSection(...)` / `setCategory(...)` | `getSection()` / `getCategory()` | current/past problem sections | `category` | no | yes | one problem family may map to several sections |
| `Condition.clinical-status` | `setClinicalStatus(...)` | `getClinicalStatus()` | problem sections | `clinical-status` | no | yes | standard FHIR search field |
| `Condition.verification-status` | `setVerificationStatus(...)` | `getVerificationStatus()` | problem sections | `verification-status` | no | yes | standard FHIR search field |
| `Condition.severity` | `setSeverity(...)` | `getSeverity()` | problem sections | `severity` | no | yes | standard FHIR search field |
| `Condition.onset-datetime` | `setOnsetDateTime(...)` | `getOnsetDateTime()` | problem sections | `onset-datetime` | no | yes | standard FHIR search field |
| `Condition.recorder` | `setRecorder(...)` | `getRecorder()` | problem sections | `recorder` | no | yes | optional |
| `Immunization.identifier` | `setIdentifier(...)` | `getIdentifier()` | `HealthcareBasicSections.Immunizations.attributeValue` | `identifier` | no | yes | common typed setter/getter still missing |
| `Immunization.subject` | `setSubject(...)` | `getSubject()` | `HealthcareBasicSections.Immunizations.attributeValue` | `patient` | no | yes | common typed setter/getter still missing |
| `Immunization.vaccine-code` | `setVaccineCode(...)` | `getVaccineCode()` | `HealthcareBasicSections.Immunizations.attributeValue` | `vaccine-code` | no | yes | standard FHIR search field |
| `Immunization.occurrence` / `Immunization.date` | `setOccurrenceDateTime(...)` / `setDate(...)` | `getOccurrenceDateTime()` / `getDate()` | `HealthcareBasicSections.Immunizations.attributeValue` | `date` | no | yes | keep standard FHIR search param `date` |
| `Immunization.status` | `setStatus(...)` | `getStatus()` | `HealthcareBasicSections.Immunizations.attributeValue` | `status` | no | yes | standard FHIR search field |
| `Immunization.performer` | `setPerformer(...)` | `getPerformer()` | `HealthcareBasicSections.Immunizations.attributeValue` | `performer` | no | yes | optional |
| `Immunization.note` | `setNote(...)` | `getNote()` | `HealthcareBasicSections.Immunizations.attributeValue` | n/a | no | yes | optional |
| `Procedure.identifier` | `setIdentifier(...)` | `getIdentifier()` | `HealthcareBasicSections.Procedures.attributeValue` | `identifier` | no | yes | common typed setter/getter still missing |
| `Procedure.subject` | `setSubject(...)` | `getSubject()` | `HealthcareBasicSections.Procedures.attributeValue` | `subject` / `patient` | no | yes | common typed setter/getter still missing |
| `Procedure.code` | `setCode(...)` | `getCode()` | `HealthcareBasicSections.Procedures.attributeValue` | `code` | no | yes | primary procedure code |
| `Procedure.status` | `setStatus(...)` | `getStatus()` | `HealthcareBasicSections.Procedures.attributeValue` | `status` | no | yes | standard FHIR search field |
| `Procedure.performed-datetime` | `setPerformedDateTime(...)` | `getPerformedDateTime()` | `HealthcareBasicSections.Procedures.attributeValue` | `date` / `performed` | no | yes | keep standard FHIR date search semantics |
| `DiagnosticReport.identifier` | `setIdentifier(...)` | `getIdentifier()` | result/report sections | `identifier` | no | yes | common typed setter/getter still missing |
| `DiagnosticReport.subject` | `setSubject(...)` | `getSubject()` | result/report sections | `subject` / `patient` | no | yes | common typed setter/getter still missing |
| `DiagnosticReport.code` | `setCode(...)` | `getCode()` | result/report sections | `code` | no | yes | study/report code |
| `DiagnosticReport.effective-datetime` | `setEffectiveDateTime(...)` | `getEffectiveDateTime()` | result/report sections | `date` | no | yes | keep standard FHIR date search semantics |
| `DiagnosticReport.conclusion` | `setConclusion(...)` | `getConclusion()` | result/report sections | `conclusion` | no | yes | app summary field |
| `Observation.identifier` | `setIdentifier(...)` | `getIdentifier()` | results / other | `identifier` | partial | yes | observation typed editor exists, but claim matrix is incomplete |
| `Observation.subject` | `setSubject(...)` | `getSubject()` | results / other | `subject` / `patient` | partial | yes | observation typed editor exists, but claim matrix is incomplete |
| `Observation.category` | `setSection(...)` / `setCategory(...)` | `getSection()` / `getCategory()` | depends | `category` | partial | yes | do not infer section when source document omitted it |
| `Observation.code` | `setCode(...)` | `getCode()` | depends | `code` | partial | yes | observation typed editor exists |
| `Observation.effective-datetime` | `setEffectiveDateTime(...)` | `getEffectiveDateTime()` | depends | `date` | partial | yes | keep standard FHIR date search semantics |
| `Observation.value-quantity-value` | `setValueQuantity(...)` | `getValueQuantity()` | depends | value-quantity | partial | yes | quantity helper exists only partially today |
| `Observation.value-quantity-unit` | `setValueQuantity(...)` | `getValueQuantity()` | depends | value-quantity | partial | yes | quantity helper exists only partially today |
| `Observation.interpretation` | `setInterpretation(...)` | `getInterpretation()` | depends | `interpretation` | no | yes | optional |

## Vital Signs Matrix

| Vital sign type | Claim | High-level set | High-level get | Unit/value rule | Exists today? | TODO | Notes |
|---|---|---|---|---|---|---|---|
| Heart rate | `Observation.code` | `setVitalSignType(VitalSignsCodes.HeartRate, VitalSignsUnits.BeatsPerMinute)` | `getVitalSignType()` | fixed code + unit | partial | yes | via `asVitalSign()` |
| Heart rate | `Observation.value-quantity-value` | `setValueQuantity(...)` | `getValueQuantity()` | bpm numeric | partial | yes | |
| Body temperature | `Observation.code` | `setVitalSignType(VitalSignsCodes.BodyTemperature, VitalSignsUnits.Celsius)` | `getVitalSignType()` | fixed code + unit | partial | yes | via `asVitalSign()` |
| Body temperature | `Observation.value-quantity-value` | `setValueQuantity(...)` | `getValueQuantity()` | Celsius numeric | partial | yes | |
| Respiratory rate | `Observation.code` | `setVitalSignType(VitalSignsCodes.RespiratoryRate, VitalSignsUnits.RespirationsPerMinute)` | `getVitalSignType()` | fixed code + unit | partial | yes | via `asVitalSign()` |
| Respiratory rate | `Observation.value-quantity-value` | `setValueQuantity(...)` | `getValueQuantity()` | rpm numeric | partial | yes | |
| Oxygen saturation | `Observation.code` | `setVitalSignType(VitalSignsCodes.OxygenSaturation, VitalSignsUnits.Percent)` | `getVitalSignType()` | fixed code + unit | partial | yes | via `asVitalSign()` |
| Oxygen saturation | `Observation.value-quantity-value` | `setValueQuantity(...)` | `getValueQuantity()` | percent numeric | partial | yes | |
| Body weight | `Observation.code` | `setVitalSignType(VitalSignsCodes.BodyWeight, VitalSignsUnits.Kilogram)` | `getVitalSignType()` | fixed code + unit | partial | yes | via `asVitalSign()` |
| Body weight | `Observation.value-quantity-value` | `setValueQuantity(...)` | `getValueQuantity()` | kg numeric | partial | yes | |
| Body height | `Observation.code` | `setVitalSignType(VitalSignsCodes.BodyHeight, VitalSignsUnits.Centimeter)` | `getVitalSignType()` | fixed code + unit | partial | yes | via `asVitalSign()` |
| Body height | `Observation.value-quantity-value` | `setValueQuantity(...)` | `getValueQuantity()` | cm numeric | partial | yes | |
| BMI | `Observation.code` | `setVitalSignType(VitalSignsCodes.BodyMassIndex, VitalSignsUnits.KilogramPerSquareMeter)` | `getVitalSignType()` | fixed code + unit | partial | yes | via `asVitalSign()` |
| BMI | `Observation.value-quantity-value` | `setValueQuantity(...)` | `getValueQuantity()` | kg/m2 numeric | partial | yes | |
| Blood pressure | `Observation.code` | `setVitalSignType(VitalSignsCodes.BloodPressure, VitalSignsUnits.MillimeterOfMercury)` | `getVitalSignType()` | panel | partial | yes | panel resource |
| Blood pressure systolic | `Observation.component-systolic-value` | `setSystolic(...)` | `getSystolic()` | mmHg numeric | no | yes | desired specific helper |
| Blood pressure systolic | `Observation.component-systolic-unit` | `setSystolic(...)` | `getSystolic()` | mmHg | no | yes | desired specific helper |
| Blood pressure diastolic | `Observation.component-diastolic-value` | `setDiastolic(...)` | `getDiastolic()` | mmHg numeric | no | yes | desired specific helper |
| Blood pressure diastolic | `Observation.component-diastolic-unit` | `setDiastolic(...)` | `getDiastolic()` | mmHg | no | yes | desired specific helper |

## Reader / Query Matrix

| Method | Input | Output | Filters | Layer | Exists today? | TODO | Notes |
|---|---|---|---|---|---|---|---|
| `getSections()` | none | section list | none | `sdk-core` | yes | no | IPS traversal baseline |
| `getSectionResources(section, type?)` | section + optional type | resources | section / type | `sdk-core` | yes | no | low-level section helper |
| `getByDates(type, start, end)` | resource type + dates | resources | date | `sdk-core` | yes | no | generic low-level date helper |
| `getResources({ sections, resourceType, start, end, searchText, count, page, offset })` | query object | resources | generic | `sdk-core` | yes/target | no | preferred generic query API |
| `getSectionCounts({ sections })` | sections | counts | section | `sdk-core` / `sdk-node` | yes/target | no | preferred count API |
| `getSectionSummary({ sections })` | sections | counts | section | `sdk-core` / `sdk-node` | yes/compat | yes | compatibility alias; prefer `getSectionCounts(...)` |
| `getEntries({ sections, resourceTypes, start, end, searchText, count, page, offset })` | query object | bundle entries | generic | `sdk-core` / `sdk-node` | yes/target | no | returns `fullUrl + resource` |
| `getAllergies(...)` | semantic query | bundle entries | section/date/status/criticality | `sdk-core` / `sdk-node` | yes/target | no | family-specific entries |
| `getConditions(...)` | semantic query | bundle entries | section/date/status/severity | `sdk-core` / `sdk-node` | yes/target | no | family-specific entries |
| `getMedications(...)` | semantic query | bundle entries | section/date/status | `sdk-core` / `sdk-node` | yes/target | no | family-specific entries |
| `getVitalSigns(...)` | semantic query | bundle entries | section/date/code | `sdk-core` / `sdk-node` | yes/target | no | family-specific entries |
| `getLocalTextAndIntDisplay(resourceOrEntry)` | resource or entry | label DTO | none | `common-utils` / `sdk-core` | yes | no | render helper |
| `getXhtmlOrDerived(resourceOrEntry)` | resource or entry | xhtml | none | `common-utils` / `sdk-core` | yes | no | render helper |
| `getNarrative(resourceOrEntry)` | resource or entry | narrative DTO | none | `common-utils` / `sdk-core` | yes | no | render helper |

## Remaining IPS Families To Expand

The complete IPS matrix should still gain explicit rows for:

- `CarePlan`
- `Flag`
- `ClinicalImpression`
- `Device`
- `Encounter`
- `Coverage`
- `DocumentReference`
- `Medication` when used separately from `MedicationStatement`

## Context-Derived IPS Editor Rules

The next agent must preserve these editor rules:

- `subject` should be treated as context-derived inside one IPS editor/reader
- `subject` should not be taught as one repeated primary setter in IPS happy
  paths
- `Composition.subject` or one explicit readonly constructor/open parameter
  should own subject identity for the whole IPS
- entry-level `setSubject(...)` may remain as low-level compatibility/fallback,
  but not as the preferred IPS editor story

That means the table above is still intentionally incomplete from the IPS
editor perspective: some generic claim rows exist, but they must later be
classified as:

- `Primary IPS editor method`
- `Context-derived automatically`
- `Low-level / fallback only`

## Missing Editor Matrix Work

The reader matrix is now in much better shape than the editor matrix.

Still missing for a complete IPS editor story:

- canonical `IpsBundleEditor`
- readonly subject context in the editor instance
- `toFhirR4()`
- `fromFhirR4()`
- family-specific editor entry points such as:
  - `asAllergy()`
  - `asMedicationStatement()`
  - `asCondition()`
  - `asImmunization()`
  - `asProcedure()`
  - `asDiagnosticReport()`
- explicit typed get/set coverage for the remaining IPS families:
  - `Patient`
  - `Practitioner`
  - `Organization`
  - `PractitionerRole`
  - `Device`
  - `DeviceUseStatement`
  - `ImagingStudy`
  - `Specimen`
  - `CarePlan`
  - `Flag`
  - `ClinicalImpression`
  - `Encounter`
  - `Coverage`
  - `DocumentReference`

## Real-World IPS Example Alignment

The next agent should align the snippets and remaining matrix work with these
official HL7 IPS references:

- https://build.fhir.org/ig/HL7/fhir-ips/en/examples.html
- https://build.fhir.org/ig/HL7/fhir-ips/en/Bundle-IPS-examples-Bundle-01.html

That alignment should drive:

- richer high-level snippets
- additional typed editor methods
- additional example fixtures/tests
- decisions about which resource families are mandatory in the first complete
  IPS editor milestone

## Preserve These Thread Decisions

The next agent should not regress these choices:

- prefer `ipsBundleReader` in docs over `facade`
- prefer `getSectionCounts(...)` over `getSectionSummary(...)`
- keep family getters entry-first, not resource-only
- keep `fullUrl + resource` available in returned clinical entries
- keep `subject` readonly and context-derived in IPS editor happy paths
- keep `101` docs free of `upsert...` and other plumbing-first API stories
