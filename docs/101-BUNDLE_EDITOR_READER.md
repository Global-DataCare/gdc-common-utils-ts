# Bundle Editor And Reader 101

> 101 note
> - Teach here: the highest-level public `common-utils` helper available for this topic.
> - Do not present raw `meta.claims`, `upsert*`, or pack/unpack as the main path unless the topic itself is transport.
> - Read [101-README.md](./101-README.md) for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.


This document defines the target migration for shared bundle construction and
bundle reading across the GDC repositories.

It is the canonical design note for:

- `gdc-common-utils-ts`
- `gdc-sdk-core-ts`
- `gdc-sdk-node-ts`
- `gdc-sdk-front-ts`
- `gwtemplate-node-ts`

Read this after:

- [101-COMMUNICATION_LAYERING.md](./101-COMMUNICATION_LAYERING.md)
- [101-LIFECYCLE.md](./101-LIFECYCLE.md)

If you are integrating from a frontend and want the shortest practical path,
read in this order:

1. `101-LIFECYCLE.md`
2. this file
3. one resource-specific editor guide such as `101-EMPLOYEE_ENTRY_EDITOR.md`
4. `101-RESOURCE_IDENTIFIER_AND_OPERATIONS.md` only after that

## Goal

Unify bundle editing and bundle reading in one shared layer so that:

- `employee`
- `consent`
- `ips`

do not each invent their own base editor or bundle reader model.

For frontend work, the key idea is simple:

- use editors to build semantic bundle data locally
- let another layer encapsulate/sign/send that data later
- use readers to understand the returned bundle and paint UI state

Editorial rule for this 101:

- teach chainable `get...` / `set...` editor and reader flows first
- keep technical persistence/import/export/plumbing method names out of the
  primary onboarding story

## Package Boundaries

### `gdc-common-utils-ts`

Owns the generic shared infrastructure:

- `BundleEditor`
- `BundleReader`
- `BundleEntryEditor`
- `EmployeeEntryEditor`
- `ConsentAccessEditor` for consent editing/reading on top of the shared bundle model
- canonical bundle/entry typing
- generic `fullUrl`, `resource.id`, and claim alignment rules

### `gdc-sdk-core-ts`

Owns runtime-neutral orchestration and domain-facing documentation on top of
the shared editor/reader:

- `EmployeeDraft`
- shared business-flow documentation such as `101-EMPLOYEES.md`
- higher-level neutral orchestration where needed

### `gdc-sdk-node-ts` and `gdc-sdk-front-ts`

Own transport/runtime behavior and actor-facing APIs.

They should consume shared bundle helpers instead of redefining them.

## `BundleEditor`

`BundleEditor` is the generic builder for bundle types that clients construct
today.

For the current individual clinical story, the canonical mode is:

- `setBundleType('document')`
- configure `Composition` fields on the same editor
- add/reopen resource entries one by one
- finish with `buildDocument()`

Keep `batch` for flows such as employees and current consent batch-style
payloads.

Important distinction:

- `setBundleOperation(...)` declares the business action the editor is staging
- it does **not** mean the same thing as FHIR `entry.request.method`

Read it like:

- `create`
- `search`
- `disable`
- `purge`

not like:

- `POST`
- `GET`
- `DELETE`
- `PATCH`

Those lower-level request methods are transport details that may be derived
later and may differ by backend contract.

Target shape:

```ts
import {
  EmployeeBundleOperations,
  EmployeeResourceTypes,
} from 'gdc-common-utils-ts/utils/employee';

const bundle = new BundleEditor()
  .setBundleOperation(EmployeeBundleOperations.create)
  .setAllowedResourceType(EmployeeResourceTypes.employee);
```

The editor then manages one active entry at a time:

```ts
bundle.newEntry(resourceId?);
bundle.newEntryAs(resourceType, resourceId?);
bundle.openEntry(resourceIdOrFullUrl);
bundle.build();
bundle.buildDocument();
```

### Identifier Rule

For the default onboarding story, keep one canonical identifier only.

- `newEntryAs(...)` without an explicit id seeds one internal `resource.id` /
  `fullUrl`
- call `ensureIdentifier()` immediately when the entry must also expose the
  public `<ResourceType>.identifier` claim
- after that, keep the same canonical value everywhere

Do not teach `setIdentifier(...)` as the normal path in `101` material.
Reserve it for special import/migration/correlation cases where the caller is
intentionally replacing the canonical value and understands the reference
impact.

`build()` does not send, sign, or translate the payload to another standard.
It only materializes the final bundle object from the editor state currently
held in memory.

For `Bundle.type=document`, prefer `buildDocument()` explicitly in onboarding
examples so the reader understands when the editor is closing a clinical
document with `Composition` first.

### Document Mode

The current newbie-facing document shape is:

```ts
import {
  BundleEditor,
  BundleEditableResourceTypes,
  BundleTypes,
  HealthcareBasicSections,
} from 'gdc-common-utils-ts';

const documentEditor = new BundleEditor()
  .setBundleOperation(EmployeeBundleOperations.create)
  .setBundleType(BundleTypes.document)
  .setCompositionSubject(subjectDid)
  .setCompositionType('http://loinc.org|60591-5')
  .setCompositionTitle('Medication document')
  .setCompositionDate('2026-07-06T10:15:00Z')
  .setCompositionAuthorList([subjectDid]);

documentEditor
  .newEntryAs(BundleEditableResourceTypes.medicationStatement, medicationId)
  .setIdentifier(medicationId)
  .setSubject(subjectDid)
  .setCategoryList([HealthcareBasicSections.HistoryOfMedicationUse.attributeValue])
  .doneEntry();

const bundleDocument = documentEditor.buildDocument();
```

When a resource needs a linked sibling resource in the same document, keep that
work on the same editor:

```ts
documentEditor
  .openEntry(medicationId)
  .asResourceType(BundleEditableResourceTypes.medicationStatement)
  .newContainedResourceAs(
    BundleEditableResourceTypes.documentReference,
    documentReferenceId,
  )
  .setSubject(subjectDid)
  .setContentType('application/pdf')
  .doneEntry();
```

The helper name keeps `contained` for compatibility with the claims model, but
the default clinical attachment story is one visible sibling resource in the
same document section. Only mark it as `contained` when the FHIR export must
rebuild `resource.contained[]`.

### Active Entry Editing

The generic entry editor should expose:

- `setClaim(...)`
- `getClaim(...)`
- `addClaim(...)`
- `removeClaim(...)`
- `setResourceId(...)`
- `getResourceId()`
- `setFullUrl(...)`
- `getFullUrl()`
- `doneEntry()`

Then the entry can be opened as one resource-specific editor:

```ts
const employeeEntry = bundle.newEntry().asEmployee();
```

The recommended teaching order is:

```ts
const bundle = new BundleEditor()
  .setBundleOperation(EmployeeBundleOperations.create)
  .setAllowedResourceType(EmployeeResourceTypes.employee);

const employeeEntry = bundle
  .newEntry()
  .asEmployee()
  .setEmail(...)
  .setRole(...);

employeeEntry.doneEntry();

const builtBundle = bundle.build();
```

`EmployeeEntryEditor` then adds:

- `setIdentifier(...)`
- `getIdentifier()`
- `ensureIdentifier()`

## Visible Resources Vs Total Entries

`BundleReader` now separates:

- total `entry[]` count in the stored bundle
- visible resource count for UI iteration

Use:

```ts
const entryCount = bundleReader.getEntryCount();
const visibleResourceCount = bundleReader.getVisibleResourceCount();
const firstVisibleEntryIndex = bundleReader.getVisibleEntryIndexByPosition(0);
const nextVisibleEntryIndex = bundleReader.getNextVisibleEntryIndex(firstVisibleEntryIndex ?? -1);
```

Why both exist:

- `getEntryCount()` includes every raw entry, including imported children that
  came from one parent resource `contained[]`
- `getVisibleResourceCount()` excludes entries whose claims mark them as
  `<ResourceType>.is-contained`

Frontend iteration should usually follow the visible-resource helpers, not the
raw `entry[]` length, so attached contained children are not rendered as top-
level cards by mistake.
- `setEmail(...)`
- `setRole(...)`
- `setWorksFor(...)`
- `setMemberOf(...)`
- `setMemberOfOrgTaxId(...)`

## `BundleReader`

`BundleReader` is the generic reader for received bundles and stored bundles.

It currently supports:

- opening a bundle
- iterating entries
- opening one entry by index
- reading per-entry status, severities, and diagnostics
- reading bundle totals and aggregate result counts
- returning one frontend-oriented response analysis
- reading either FHIR-style `entry[]` bundles or JSON:API-like `data[]` bundles

### Supported Bundle Queries

Use `BundleReader` when a frontend or SDK caller needs to answer questions such as:

- what bundle type came back
- how many operations came back
- how many operations are fully successful
- whether the response contains warnings or errors
- which diagnostics messages should be shown in a banner or detail drawer
- which individual operations need attention
- which identifiers belong to warning/error rows that the UI may reopen later

Global bundle queries:

- `getBundleType()`
- `getEntries()`
- `getTotalOperations()`
- `getTotalSuccessfulOperations()`
- `getTotalErrorOperations()`
- `hasWarnings()`
- `hasErrors()`
- `getBundleIssueSeverities()`
- `getBundleIssueDiagnostics()`
- `getEntryIdentifierByArrayIndex(index)`
- `getEntryIndexByIdentifier(identifier)`
- `getEntrySummaries()`
- `getEntriesWithWarningOrErrorIssues()`
- `getResponseAnalysis()`

Per-entry queries:

- `openEntry(index)`
- `getEntryResponseStatus()`
- `getIssueSeverities()`
- `getIssueDiagnostics()`

Frontend-oriented result shape:

- `getEntrySummaries()` returns normalized per-entry summaries with:
  - entry index
  - resolved identifier
  - response status
  - collected issue severities
  - collected diagnostics
  - one final representative `severity`
  - `isSuccessful`
- `getResponseAnalysis()` returns:
  - `totalOperations`
  - `successfulOperations`
  - `errorOperations`
  - `hasWarnings`
  - `hasErrors`
  - `issueDiagnostics`
  - `severityBuckets.fatal|error|warning|information|success`
  - per bucket: `entryIndexes`, `identifiers`, `identifierList`

Current target shape:

```ts
const reader = new BundleReader(bundle);

reader.getBundleType();
reader.getEntries();
reader.getTotalOperations();
reader.getTotalSuccessfulOperations();
reader.getTotalErrorOperations();
reader.hasWarnings();
reader.hasErrors();
reader.getBundleIssueSeverities();
reader.getBundleIssueDiagnostics();
reader.getEntryIdentifierByArrayIndex(0);
reader.getEntryIndexByIdentifier('employee-123');
reader.getEntrySummaries();
reader.getEntriesWithWarningOrErrorIssues();
reader.getResponseAnalysis();

reader.openEntry(0);
reader.getEntryResponseStatus();
reader.getIssueSeverities();
reader.getIssueDiagnostics();
```

See also:

- [`__tests__/101-bundle-reader.test.ts`](../__tests__/101-bundle-reader.test.ts)
- [`__tests__/101-bundle-response-analysis.test.ts`](../__tests__/101-bundle-response-analysis.test.ts)

## Supported Types

### Editor-first types

These are the bundle types that should be constructed by `BundleEditor`
initially:

- `batch`
- `document`
- maybe `collection`

Not enabled as editor-first types yet:

- `transaction`
- `message`

### Reader-first types

These are primarily response or read models:

- `batch-response`
- `transaction-response`
- `searchset`
- `history`
- `subscription-notification` when supported

## Domain Adapters

The generic editor/reader stays resource-agnostic. Domain adapters then add the
semantics needed by each business area.

### Employee

Employee adapters live in `gdc-common-utils-ts` and should define:

- create
- search
- disable
- purge

and employee claim helpers such as:

- `setEmail(...)`
- `setRole(...)`
- `setMemberOf(...)`
- `setMemberOfOrgTaxId(...)`

### Consent

Consent adapters also belong in `gdc-common-utils-ts` and should define:

- consent entry helpers
- consent claim helpers
- communication-attached bundle behavior where relevant

### IPS

IPS/document adapters should also belong in `gdc-common-utils-ts` and should define:

- `Composition`-centric helpers
- document entry conventions
- sector/composition alignment rules

## Identifier And URL Alignment

When an entry needs one generated identity, the editor should keep these values
aligned:

- `entry.fullUrl`
- `resource.id`
- canonical claim identifier

For employee today, that canonical claim is:

- `org.schema.Person.identifier`

If an identifier is not provided and the operation requires one, the editor
should generate it and keep it available to the caller through
`getIdentifier()`.

## Why This Migration Exists

Without this split, each flow tends to create its own partial model:

- one-off bundle editor logic
- one-off entry editing logic
- one-off response parsing logic

That increases cognitive load and makes the `101` docs diverge.

The migration target is:

- one generic editor
- one generic reader
- domain adapters on top
- same mental model across employee, consent, and IPS

## Documentation Rule

All `101` docs should explain bundle work in this order:

1. high-level domain adapter
2. active entry editing
3. final `build()` or reader output
4. low-level raw bundle details last

That keeps onboarding focused on business use first, not wire format first.
