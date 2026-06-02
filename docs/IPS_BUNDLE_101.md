# IPS Bundle 101

This guide shows the shortest path for two common developer tasks:

- add clinical resources to an IPS-like history bundle carried in `Communication.content-attachment-data`
- read `resource.meta.claims` and build frontend cards grouped by IPS sections

Use this together with:

- [src/utils/communication-bundle-session.ts](../src/utils/communication-bundle-session.ts)
- [src/utils/clinical-resource-view.ts](../src/utils/clinical-resource-view.ts)
- [src/examples/ips-bundle.ts](../src/examples/ips-bundle.ts)
- [gdc-sdk-core-ts/src/communication-document-facade.ts](../../gdc-sdk-core-ts/src/communication-document-facade.ts)

## 1. Add Data To An IPS Bundle In Memory

`CommunicationBundleSession` is the current API type, but in developer docs the better mental model is `bundleEditor`: an in-memory editor for the Bundle carried by a `Communication`.

```ts
import { CommunicationBundleSession } from 'gdc-common-utils-ts/utils/communication-bundle-session';
import { CommunicationClaim } from 'gdc-common-utils-ts/models/interoperable-claims/communication-claims';
import { MedicationStatementClaim } from 'gdc-common-utils-ts/models/interoperable-claims/medication-statement-claims';
import { ConditionClaim } from 'gdc-common-utils-ts/models/interoperable-claims/condition-claims';
import { AllergyIntoleranceClaim } from 'gdc-common-utils-ts/models/interoperable-claims/allergy-intolerance-claims';
import { CommunicationCategoryCodes } from 'gdc-common-utils-ts/constants/communication';
import { HealthcareBasicSections } from 'gdc-common-utils-ts/constants/healthcare';
import {
  EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
  EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_URL,
} from 'gdc-common-utils-ts/examples/shared';

const bundleEditor = new CommunicationBundleSession({
  communicationClaims: {
    '@context': 'org.hl7.fhir.r4',
    [CommunicationClaim.Identifier]: 'comm-ips-001',
    [CommunicationClaim.Subject]: 'did:web:patient.example.org',
    [CommunicationClaim.Category]: CommunicationCategoryCodes.Notification.claim,
  },
});

bundleEditor.upsertActiveMedicationStatementEntry({
  claims: {
    '@context': 'org.hl7.fhir.api',
    [MedicationStatementClaim.Identifier]: 'med-001',
    [MedicationStatementClaim.Subject]: 'did:web:patient.example.org',
    [MedicationStatementClaim.Status]: 'active',
    [MedicationStatementClaim.MedicationText]: 'Ibuprofen 400mg',
    [MedicationStatementClaim.Effective]: '2026-06-01',
  },
  fullUrl: 'urn:uuid:med-001',
});

bundleEditor.upsertActiveConditionEntry({
  claims: {
    '@context': 'org.hl7.fhir.api',
    [ConditionClaim.Identifier]: 'cond-001',
    [ConditionClaim.Subject]: 'did:web:patient.example.org',
    [ConditionClaim.Code]: 'http://snomed.info/sct|44054006',
    [ConditionClaim.Category]: HealthcareBasicSections.ProblemList.attributeValue,
    [ConditionClaim.OnsetDateTime]: '2026-05-20T09:00:00Z',
  },
  fullUrl: 'urn:uuid:cond-001',
});

bundleEditor.upsertActiveAllergyIntoleranceEntry({
  claims: {
    '@context': 'org.hl7.fhir.api',
    [AllergyIntoleranceClaim.Identifier]: 'alg-001',
    [AllergyIntoleranceClaim.Subject]: 'did:web:patient.example.org',
    [AllergyIntoleranceClaim.Code]: 'http://snomed.info/sct|227493005',
    [AllergyIntoleranceClaim.Category]: HealthcareBasicSections.AllergiesAndIntolerances.attributeValue,
    [AllergyIntoleranceClaim.OnsetDateTime]: '2026-05-10T08:00:00Z',
  },
  fullUrl: 'urn:uuid:alg-001',
});

bundleEditor.saveAndReleaseActiveEntry();

const communicationClaims = bundleEditor.getCommunicationClaims();
const bundleInMemory = bundleEditor.getBundleInMemory();
```

Result:

- `communicationClaims[CommunicationClaim.ContentAttachmentData]` contains the serialized bundle
- every resource is stored under `entry.resource.meta.claims`
- `bundleInMemory.data[]` is the frontend-friendly editing source of truth

Better developer pattern:

1. build claims with `set/get/add/remove` helpers for the resource
2. call `bundleEditor.upsertActive...Entry({ claims, fullUrl })`

`bundleEditor` is document-level editing.
`set/get/add/remove` is resource-claims-level editing.

## 1.1 Linked Attachments Inside The Same Bundle

When a clinical resource needs one or more attached files, the recommended bundle pattern is:

- keep the parent resource as the clinical resource (`MedicationStatement`, `Condition`, `AllergyIntolerance`, `Consent`, ...)
- store each attachment as a `DocumentReference` entry inside the same bundle
- link the parent resource to those `DocumentReference.identifier` values through a CSV claim:
  - `MedicationStatement.contained-documents`
  - `Condition.contained-documents`
  - `AllergyIntolerance.contained-documents`
  - `Consent.contained-documents`

That means:

- the claim stores identifiers, not binary payloads
- the actual PDF/JPG/PNG/URL lives in the `DocumentReference` entry claims:
  - `DocumentReference.contenttype`
  - `DocumentReference.contentdata`
  - `DocumentReference.location`

Example:

```ts
bundleEditor.upsertActiveMedicationStatementEntry({
  claims: {
    '@context': 'org.hl7.fhir.api',
    [MedicationStatementClaim.Identifier]: 'med-001',
    [MedicationStatementClaim.Subject]: 'did:web:patient.example.org',
    [MedicationStatementClaim.Status]: 'active',
    [MedicationStatementClaim.MedicationText]: 'Ibuprofen 400mg',
  },
  fullUrl: 'urn:uuid:med-001',
});

bundleEditor.addContainedDocumentToActiveEntry({
  identifier: EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  attachmentContentType: EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
  attachmentUrl: EXAMPLE_DOCUMENT_REFERENCE_URL,
  description: EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION,
});
```

After that:

- the medication claims contain `MedicationStatement.contained-documents = EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER`
- the bundle contains a `DocumentReference` entry with `DocumentReference.identifier = EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER`

To resolve those documents in frontend code:

```ts
import { getMedicationContainedDocumentIdentifierList } from 'gdc-common-utils-ts/utils/medication-claim-helpers';

const medicationClaims = bundleInMemory.data[0].resource.meta.claims;
const documentIds = getMedicationContainedDocumentIdentifierList(medicationClaims);
const documentEntries = bundleEditor.getResourceEntriesByIds(documentIds);
```

If the bundle is already inside a FHIR `Communication`, `gdc-sdk-core-ts` also exposes readers for those `DocumentReference` claims:

```ts
import { getDocumentReferenceClaimsByIdentifiersFromCommunicationDocument } from 'gdc-sdk-core-ts';

const linkedDocumentClaims = getDocumentReferenceClaimsByIdentifiersFromCommunicationDocument(
  communicationResource,
  documentIds,
);
```

## 2. Read `meta.claims` For Frontend Cards

`clinical-resource-view.ts` reads `resource.meta.claims` and returns minimal or expanded UI views.

```ts
import {
  toClinicalResourceCardViews,
  toClinicalResourceCommonViews,
  toClinicalResourceExpandedViews,
} from 'gdc-common-utils-ts/utils/clinical-resource-view';

const cardViews = toClinicalResourceCardViews(bundleInMemory);
const commonViews = toClinicalResourceCommonViews(bundleInMemory);
const expandedViews = toClinicalResourceExpandedViews(bundleInMemory);
```

Each common view contains:

- `title`
- `resourceType`
- `identifier`
- `date`
- `fullUrl`
- `actors`
- `claims`

That `claims` object is the original `resource.meta.claims`, ready for frontend details panels.

## 3. Filter Resources By IPS Section

For section cards, reuse `bundleEditor.getResourceIds(...)`.

```ts
const medicationIds = bundleEditor.getResourceIds({
  sections: [HealthcareBasicSections.HistoryOfMedicationUse.attributeValue],
});

const allergyIds = bundleEditor.getResourceIds({
  sections: [HealthcareBasicSections.AllergiesAndIntolerances.attributeValue],
});

const conditionIds = bundleEditor.getResourceIds({
  sections: [HealthcareBasicSections.ProblemList.attributeValue],
});
```

This works because the bundle query matches section-like claims such as:

- `*.category`
- `*.action`
- `*.purpose`
- `*.section`

## 4. Read A Real FHIR R4 IPS Bundle

If you already have a FHIR R4 `Bundle document`, use the SDK core facade for sections/resources:

```ts
import { createFhirDocumentFacade } from 'gdc-sdk-core-ts';

const fhirDocument = createFhirDocumentFacade(fhirBundle);
const sections = fhirDocument.getSections();
const medications = fhirDocument.getResources('MedicationStatement');
```

And if the FHIR bundle resources also include `resource.meta.claims`, you can pass the FHIR `entry[]` shape directly to card views:

```ts
const cards = toClinicalResourceCardViews(fhirBundle);
```

`toClinicalResourceCardViews(...)`, `toClinicalResourceCommonViews(...)`, and `toClinicalResourceExpandedViews(...)` now accept:

- `BundleJsonApi.data[]`
- FHIR `Bundle.entry[]`

## 5. Search Param Names vs Claim Keys

Keep these layers separate:

- search param name:
  - `code`
  - `subject`
  - `category`
- contextualized claim key:
  - `org.hl7.fhir.api.MedicationStatement.code`
  - `org.hl7.fhir.api.Condition.subject`
  - `org.hl7.fhir.api.AllergyIntolerance.category`

The codebase now keeps this explicit in types:

- `MedicationStatementSearchParamNames`
- `ConditionSearchParamNames`
- `AllergyIntoleranceSearchParamNames`

and their mappings:

- `MedicationStatementSearchParamToClaimKey`
- `ConditionSearchParamToClaimKey`
- `AllergyIntoleranceSearchParamToClaimKey`

That preserves the FHIR search-parameter approach without forcing frontend code to use fully contextualized claim keys as search names.
