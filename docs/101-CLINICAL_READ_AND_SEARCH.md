# Clinical Read And Search 101

> 101 note
> - Teach the actor-facade read operation and the public readers.
> - Do not present ingestion, raw claims or query-string assembly as the read path.

This is the frontend/integrator guide for reading the clinical data currently
available for an individual.

Read in this order:

1. [101-LIFECYCLE.md](./101-LIFECYCLE.md)
2. this file
3. [101-COMMUNICATION_LAYERING.md](./101-COMMUNICATION_LAYERING.md)
   only when transport details are relevant

## Canonical Read Job

The application flow is:

1. call the actor facade `requestClinicalSummary(...)`
2. receive one `ClinicalSummaryReadResult`
3. paint the returned Bundle without another network request

The runtime represents the operation as:

`Communication -> Subject/$summary -> FHIR Parameters -> Bundle document`

The Communication has two native FHIR payloads: the operation
`contentReference` and the attached `Parameters`. They are parts of the same
request, not two Communications and not clinical data to ingest.

## Request The Available Summary

The high-level call is owned by `gdc-sdk-node-ts` and `gdc-sdk-front-ts`:

```ts
const summary = await individualSdk.requestClinicalSummary(tenantContext, {
  subjectId,
  requesterId,
  // Omit filterSections to request every available section.
  filterSections: [allergySection],
});
```

`summary` is a `ClinicalSummaryReadResult`:

- `summary.operation`: submit/poll evidence
- `summary.bundle`: authoritative returned FHIR document
- `summary.reader`: `BundleReader` for sections, references and Bundle entries
- `summary.document`: `FhirDocumentFacade` for resources and combined filters

`LifecycleResultReader` is not used to read the clinical document. It inspects
command results, statuses and issues.

## Consume Sections

```ts
const sections = summary.reader.getDocumentSections();
const sectionCount = summary.reader.getDocumentSectionCount();

const allergyCount =
  summary.reader.getDocumentSectionResourceCount(allergySection);
const allergyReferences =
  summary.reader.getDocumentSectionResourceReferences(allergySection);
```

An unknown or absent section returns:

- `undefined` from `getDocumentSectionByCode(...)`
- `0` from `getDocumentSectionResourceCount(...)`
- `[]` from the references/IDs/entries methods

## Obtain The Resources Of One Section

Use the structural reader when the caller needs Bundle IDs, `fullUrl` or full
entries:

```ts
const allergyIds = summary.reader.getDocumentSectionResourceIds(
  allergySection,
  { resourceTypes: [ResourceTypesFhirR4.AllergyIntolerance] },
);

const allergyEntries = summary.reader.getDocumentSectionResourceEntries(
  allergySection,
  {
    resourceTypes: [ResourceTypesFhirR4.AllergyIntolerance],
    dateFrom: '2026-01-01',
    dateTo: '2026-12-31',
  },
);
```

Use the document facade when the caller wants resolved FHIR resources:

```ts
const filter = {
  sections: [allergySection],
  types: [ResourceTypesFhirR4.AllergyIntolerance],
  date: { start: '2026-01-01', end: '2026-12-31' },
};

const resources = summary.document.getResourcesByFilter(filter);
const visibleCount = summary.document.getResourceCount(filter);
```

Both calls are local reads over `summary.bundle`; neither performs a new GW
request.

## Other Local Queries

```ts
const allResources = summary.document.getResources();
const allAllergies =
  summary.document.getResources(ResourceTypesFhirR4.AllergyIntolerance);
const datedAllergies = summary.document.getByDates(
  ResourceTypesFhirR4.AllergyIntolerance,
  '2026-01-01',
  '2026-12-31',
);
const matchingText = summary.document.getContainingTextOrDisplay(
  ResourceTypesFhirR4.AllergyIntolerance,
  'ibuprofeno',
);
```

## Executable References

- Common section navigation and filters:
  [__tests__/101-communication-medication-document.test.ts](../__tests__/101-communication-medication-document.test.ts)
- Node facade request and UI-style consumption:
  `gdc-sdk-node-ts/tests/101-individual-summary-communication.test.mjs`
- Complete SDK lifecycle:
  `gdc-sdk-node-ts/docs/101-SDK_END_TO_END.md`, section 7.13
- UHC UNID screen using the same Bundle semantics:
  `custom/uhc-unidonline-next/src/components/portal/IpsClinicalViewer.tsx`

For authoring and ingestion, which is a different lifecycle, continue with
[101-IPS_BUNDLE.md](./101-IPS_BUNDLE.md).
