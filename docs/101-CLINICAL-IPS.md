# 101 Clinical IPS

> 101 note
> - Teach the SDK actor facade first.
> - Read the returned Bundle through the public readers.
> - Do not mix readback with ingestion or raw transport wiring.

This guide explains how an application consumes the clinical summary already
available for an individual.

## 1. Request The Summary

From Node or Front SDK application code:

```ts
const summary = await individualSdk.requestClinicalSummary(tenantContext, {
  subjectId,
  requesterId,
  // Optional. Omit this property to request every available section.
  filterSections: [
    HealthcareBasicSections.AllergiesAndIntolerances.attributeValue,
  ],
});
```

The SDK sends one read-only Communication:

`Communication -> Subject/$summary -> attached FHIR Parameters`

The operation returns one `ClinicalSummaryReadResult`. It does not ingest or
project resources.

To request every available section, omit `filterSections`. Do not send `'*'`:
`section=*` is a SMART authorization wildcard, not the `$summary` selector
taught to application code.

## 2. Understand The Result

```ts
summary.operation; // submit/poll evidence
summary.bundle;    // authoritative FHIR Bundle document
summary.reader;    // BundleReader
summary.document;  // FhirDocumentFacade
```

Use `summary.reader` for document structure:

- sections
- section counts
- declared references
- resolved Bundle IDs and entries

Use `summary.document` for clinical resources:

- all resources or one resource type
- combined section/type/date filters
- filtered counts
- text/display lookup
- typed vital-sign helpers

`LifecycleResultReader` reads operation outcomes. It does not navigate the
clinical Bundle.

## 3. List Sections And Counts

```ts
const sections = summary.reader.getDocumentSections();
const numberOfSections = summary.reader.getDocumentSectionCount();

const allergySection =
  HealthcareBasicSections.AllergiesAndIntolerances.attributeValue;

const allergySectionInfo =
  summary.reader.getDocumentSectionByCode(allergySection);
const allergyReferenceCount =
  summary.reader.getDocumentSectionResourceCount(allergySection);
const allergyReferences =
  summary.reader.getDocumentSectionResourceReferences(allergySection);
```

`allergyReferenceCount` is the number of references declared in that
`Composition.section`. It is the natural unfiltered badge for a section.

## 4. Obtain Bundle Entries From One Section

```ts
const allergyIds = summary.reader.getDocumentSectionResourceIds(
  allergySection,
);

const allergyEntries = summary.reader.getDocumentSectionResourceEntries(
  allergySection,
);
```

Use IDs when the UI needs stable selection keys. Use entries when it also needs
`fullUrl`, request/response metadata or the complete Bundle entry wrapper.

The reader also distinguishes top-level UI resources from flattened
`contained[]` children:

```ts
const totalEntryCount = summary.reader.getEntryCount();
const visibleResourceCount = summary.reader.getVisibleResourceCount();
const visibleResourceIds = summary.reader.getVisibleResourceIds();
```

Use the visible helpers for cards and UI navigation. Use all entries for audit,
debugging or rebuilding native FHIR `contained[]`. This is structural
visibility, not the resource's active/inactive clinical status.

## 5. Obtain And Filter FHIR Resources

```ts
const allergyView = summary.document
  .filterBySections([allergySection])
  .filterByTypes([ResourceTypesFhirR4.AllergyIntolerance])
  .filterByClinicalDateRange('2026-01-01', '2026-12-31');

const recentAllergies = allergyView.getResources();
const recentAllergyCount = allergyView.getResourceCount();
```

Resources without a canonical clinical date are excluded when a date filter is
active. Use full ISO timestamps when time-of-day precision matters.

The clinical date range supports both native FHIR temporal shapes:

- `date`, `dateTime` or `instant` values must fall inside the range
- `Period` values must overlap the range
- a date-only upper bound includes the complete selected day

Other local reads:

```ts
const everyDocumentResource = summary.document.getResources();
const everyAllergy = summary.document.getResources(
  ResourceTypesFhirR4.AllergyIntolerance,
);
const allergiesContainingIbuprofen =
  summary.document.getContainingTextOrDisplay(
    ResourceTypesFhirR4.AllergyIntolerance,
    'ibuprofeno',
  );
```

All of these read the already returned Bundle. They do not make another
network request.

## 6. Build A UI View Model

```ts
const sectionCards = toClinicalSectionViews(summary.bundle, {
  locale: currentUserLocale,
  translateCode: terminology.translate,
});

for (const section of sectionCards) {
  renderSection({
    code: section.code,
    title: section.title,
    cards: section.resources,
    unresolvedReferences: section.unresolvedReferences,
  });
}
```

This is the model applications use to render a clinical viewer:

- `Composition.section` decides placement
- each section card displays its current visible resource count
- section/type/text/date filters narrow the in-memory resources

`translateCode` translates terminology labels only. It never translates
`CodeableConcept.text` or `Coding.display`. The lookup key is the exact
primary coded claim for that resource:

| FHIR resource field | Canonical claim |
| --- | --- |
| `Condition.code` | `Condition.code` |
| `AllergyIntolerance.code` | `AllergyIntolerance.code` |
| `MedicationStatement.medicationCodeableConcept` | `MedicationStatement.code` |
| `Observation.code` | `Observation.code` |
| `Flag.code` | `Flag.code` |
| `Procedure.code` | `Procedure.code` |
| `DiagnosticReport.code` | `DiagnosticReport.code` |
| `Immunization.vaccineCode` | `Immunization.vaccine-code` |
| `Device.type` | `Device.type` |
| `DocumentReference.type` | `DocumentReference.type` |
| `CarePlan.category[0]` | `CarePlan.category` when coded |
| `Consent.category[0]` | `Consent.category` |
| `PractitionerRole.code[0]` | `PractitionerRole.code` |

The renderer does not search unrelated coded fields. If the exact claim and
native `coding.system`/`coding.code` are both absent, it does not call
`translateCode`; it falls back to the existing display or local text.

For text filtering in a generic UI, render the returned card DTOs or use
`getContainingTextOrDisplay(...)` for one resource type. Apply the shared
`toClinicalSectionViews(bundle)` projection before any application-owned UI
text filter.

### Local terminology fallback for the MVP

`LocalTerminologyProvider` accepts the established legacy JSON catalog shape:

```ts
const terminology = new LocalTerminologyProvider([{
  language: 'es',
  data: [{
    id: 'http://snomed.info/sct',
    attributes: {
      '44054006': 'Diabetes mellitus tipo 2',
    },
  }],
}]);

const options: ClinicalResourceDisplayOptions = {
  locale: 'es',
  translateCode: createClinicalCodeTranslator(terminology),
};
```

The legacy `data[].id === "ips"` alias is read as
`http://snomed.info/sct`. New catalogs must write the canonical system URI.
Language matching tries the requested locale, its base language and then
English. Missing terms return `undefined`, preserving the normal FHIR
`Coding.display`/`CodeableConcept.text` fallback.

The same provider searches coded form options:

```ts
const options = terminology.search({
  text: 'presion',
  language: 'es-ES',
  jurisdiction: 'ES',
  systems: ['http://loinc.org'],
  limit: 20,
});
```

The form supplies its allowed systems explicitly. The provider does not guess
terminologies by scanning a resource. Catalog loading remains application
owned so a Node BFF can keep large files server-side and an offline frontend
can load only the subsets it needs.

`translateCode` is intentionally synchronous. A future external terminology
service must fetch/cache labels before rendering and can then populate the same
local provider contract.

## 7. Empty And Missing Data

- no sections: `getDocumentSections()` returns `[]`
- missing section: `getDocumentSectionByCode(...)` returns `undefined`
- missing section count: `getDocumentSectionResourceCount(...)` returns `0`
- no matching resources: entry/resource queries return `[]`
- a `$summary` operation that does not return a document Bundle is rejected
  instead of being presented as an empty authoritative summary

## 8. Read And Write Are Different

Read:

```ts
await individualSdk.requestClinicalSummary(...);
```

Author and display the change locally in the UI:

```ts
const submittedBundle = editor.build();
renderBundle(workingCopy.applyOptimisticBundle(submittedBundle));
await portalBff.submitClinicalBundle(submittedBundle);
```

The UI does not ingest or update an index. It edits a disposable in-memory
Bundle/ViewModel and submits the command to its authenticated BFF.

Only the backend/BFF executes the write:

```ts
await backendProfile.sdk.ingestCommunicationAndUpdateIndex(ctx, {
  communicationJob,
});
```

The UI reconciles per-entry GW errors and finally replaces its local projection
with authoritative `requestClinicalSummary(...)` readback.

## Executable References

- `__tests__/101-communication-medication-document.test.ts`
- `gdc-sdk-core-ts/tests/101-clinical-summary-communication.test.mjs`
- `gdc-sdk-node-ts/tests/101-individual-summary-communication.test.mjs`
- `gdc-sdk-node-ts/docs/101-SDK_END_TO_END.md`, section 7.13
