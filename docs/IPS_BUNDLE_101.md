# IPS Bundle 101

This is the canonical 101 for IPS work in the shared SDK family.

Use this document when a developer needs to do one of these things:

- request an IPS document from the index service
- build or edit an IPS-style bundle carried in `Communication.content-attachment-data`
- read `resource.meta.claims` and group the result by IPS sections in frontend code

Use this together with:

- [src/utils/communication-bundle-session.ts](../src/utils/communication-bundle-session.ts)
- [src/utils/clinical-resource-view.ts](../src/utils/clinical-resource-view.ts)
- [src/examples/ips-bundle.ts](../src/examples/ips-bundle.ts)
- [__tests__/101-communication-search-reference.test.ts](../__tests__/101-communication-search-reference.test.ts)
- [__tests__/101-ips-bundle-editor.test.ts](../__tests__/101-ips-bundle-editor.test.ts)
- [__tests__/101-medication-claim-helpers.test.ts](../__tests__/101-medication-claim-helpers.test.ts)
- [MEDICATION_STATEMENT_CLAIMS_101.md](./MEDICATION_STATEMENT_CLAIMS_101.md)
- [gdc-sdk-core-ts/docs/IPS_COMMUNICATION_OUTBOX_101.md](https://github.com/Global-DataCare/gdc-sdk-core-ts/blob/main/docs/IPS_COMMUNICATION_OUTBOX_101.md)

## What Lives Where

Keep the split simple:

- `gdc-common-utils-ts`
  is the canonical place for:
  - `Communication.content-reference`
  - summary operation request parameters
  - IPS request reference path/url builders
  - `bundleEditor`
  - flat `meta.claims`
- `gdc-sdk-core-ts`
  takes the already-built `Communication` and moves it into draft/outbox

If a developer first needs to understand the IPS request or IPS bundle shape,
this is the document to read first.

## 0. Requesting The IPS Document

In this architecture, requests to the index service are not sent as direct REST
calls from the app contract.

They travel inside a `Communication` so the request remains auditable as a
clinical/operational interaction, regardless of whether the original channel
was web, app, call center, assistant, or messaging.

Current preferred request shape:

- the `Communication` carries the relative index search path in
  `Communication.content-reference`
- today that URL points to `individual/org.hl7.fhir.r4/Bundle/_search?...`
- that URL is generated from a semantic parameter array first, then flattened

Future shape kept as `TODO` only:

- `CommunicationRequestOperationWithAttachedParameters`
- intended for a future `individual/org.hl7.fhir.r4/Patient/$summary`
- reference:
  https://hl7.org.au/fhir/ps/1.0.0-preview/generation-and-access.html

When the frontend wants the IPS document for an individual, the request should
be anchored to the document type first.

Canonical IPS discriminator:

- `Composition.type = http://loinc.org|60591-5`

Official HL7 IPS profile:

- https://build.fhir.org/ig/HL7/fhir-ips/StructureDefinition-Composition-uv-ips.html

Practical rule for the current `Bundle` search flow:

- if no sections are specified, request the full IPS document
- if sections are specified, request the IPS document constrained to those sections
- `filterSections` is optional in
  `createSummaryOperationRequestParameters(subjectId, filterSections?)`

### Short Path

Executable step-by-step reference:

- [__tests__/101-communication-search-reference.test.ts](../__tests__/101-communication-search-reference.test.ts)

Use this first. Frontend code builds the relative IPS search path once, then
passes that path into the low-level `Communication` helper when needed. The
IPS-specific short helper does that work internally.

```ts
import { communication } from 'gdc-common-utils-ts/utils/communication-bundle-document-request';
import {
  EXAMPLE_PROFESSIONAL_DID,
  EXAMPLE_SUBJECT_DID,
} from 'gdc-common-utils-ts/examples/shared';

const communicationClaims = communication.newIpsSummarySearchCommunication({
  subjectId: EXAMPLE_SUBJECT_DID,
  requesterId: EXAMPLE_PROFESSIONAL_DID,
});
```

This is the only helper that the `common-utils` 101 needs to teach.

If a current transport/runtime flow still wraps that `Communication` into
DIDComm, that belongs to the next SDK layer and is documented there.

Those short helpers already call internally:

- `createSummaryOperationRequestParameters(...)`
- `createSummaryOperationRequestReferencePath(...)`

If frontend/runtime should not request the full IPS, pass `filterSections`.
That is the normal path when:

- the UI only needs a few sections
- the actor is not allowed to read the whole IPS
- consent/policy evaluation returned only a subset of allowed sections

If you already built the relative search path yourself and only need to wrap it
into `Communication` claims, use:

```ts
import {
  BundleDocumentRequesterKinds,
  communication,
} from 'gdc-common-utils-ts/utils/communication-bundle-document-request';
import { EXAMPLE_PROFESSIONAL_DID, EXAMPLE_SUBJECT_DID } from 'gdc-common-utils-ts/examples/shared';

const claims = communication.newSearchWithReferenceUrl({
  subjectDid: EXAMPLE_SUBJECT_DID,
  sender: EXAMPLE_PROFESSIONAL_DID,
  requesterKind: BundleDocumentRequesterKinds.Employee,
  summaryOperationRequestReferencePath:
    'individual/org.hl7.fhir.r4/Bundle/_search?type=document&composition.subject=<subject>&composition.type=http://loinc.org|60591-5',
});
```

### Audit Layer

These are the internal explicit steps behind the short path:

```ts
import {
  createSummaryOperationRequestParameters,
  createSummaryOperationRequestReferencePath,
  createSummaryOperationRequestReferenceUrl,
} from 'gdc-common-utils-ts/utils/communication-bundle-document-request';
import { EXAMPLE_INDEX_PROVIDER_SECTOR_DID_WEB, EXAMPLE_SUBJECT_DID } from 'gdc-common-utils-ts/examples/shared';

const summaryOperationRequestParameters =
  createSummaryOperationRequestParameters(EXAMPLE_SUBJECT_DID);

const summaryOperationRequestReferencePath =
  createSummaryOperationRequestReferencePath(summaryOperationRequestParameters);

const summaryOperationRequestReferenceUrl =
  createSummaryOperationRequestReferenceUrl({
    providerSectorDidWeb: EXAMPLE_INDEX_PROVIDER_SECTOR_DID_WEB,
    summaryOperationRequestReferencePath,
  });
```

The semantic parameter layer looks like this:

```json
{
  "parameter": [
    { "name": "subject", "type": "string", "value": "EXAMPLE_SUBJECT_DID" },
    { "name": "document-type", "type": "token", "system": "http://loinc.org", "value": "60591-5" }
  ]
}
```

That `Communication.content-reference` is generated as a relative search URL
such as:

```txt
individual/org.hl7.fhir.r4/Bundle/_search?type=document&composition.subject=<EXAMPLE_SUBJECT_DID>&composition.type=http://loinc.org|60591-5
```

Use lowercase FHIR search parameter names in the URL:

- `composition.subject`
- `composition.type`
- `composition.section`

Do not use:

- `Composition.subject`
- `Composition.type`

Typical auditable request patterns:

- individual controller asks for the full IPS:
  `createSummaryOperationRequestParameters(...) -> createSummaryOperationRequestReferencePath(...) -> communication.newIpsSummarySearchCommunication(...)`
- doctor/professional asks for specific sections:
  `createSummaryOperationRequestParameters(..., filterSections) -> createSummaryOperationRequestReferencePath(...) -> communication.newIpsSummarySearchCommunication(...)`

In the section-scoped case, each requested section becomes one
`composition.section=...` search parameter in `Communication.content-reference`.
That is the mechanism to align the request with section-scoped permissions.

Those section-scoped requests are what later allow the runtime to return the
document grouped by `Composition.section`, including future linked
`DocumentReference` entries referenced from `MedicationStatement.contained-documents`
or other resources.

Policy note:

- do not auto-create a default consent when the individual is created just to
  make this helper work
- controller self-access should be handled by runtime/business policy
- employee and related-person requests should rely on explicit consent or
  equivalent member policy outside this low-level helper

## 1. First: Medication Claims

If the developer first needs to build one `MedicationStatement` claim set,
start with the dedicated medication 101:

- [MEDICATION_STATEMENT_CLAIMS_101.md](./MEDICATION_STATEMENT_CLAIMS_101.md)
- [__tests__/101-medication-claim-helpers.test.ts](../__tests__/101-medication-claim-helpers.test.ts)

That 101 explains the simple `get/set` path for fields such as:

- `identifier`
- `subject`
- `status`
- `effective`
- `medication-text`
- dose/timing/PRN fields

This IPS document then picks up from the next step: putting those clinical
claims into an IPS-style bundle.

## 2. Put IPS Resources Into A Communication Bundle

Once resource claims already exist, `bundleEditor` is the in-memory unit that:

- creates or loads the bundle carried by the `Communication`
- upserts resources such as `MedicationStatement`, `Condition`, and `AllergyIntolerance`
- saves the updated bundle back into `Communication.content-attachment-data`

Executable step-by-step reference:

- [__tests__/101-ips-bundle-editor.test.ts](../__tests__/101-ips-bundle-editor.test.ts)

Shortest path:

```ts
import { CommunicationCategoryCodes } from 'gdc-common-utils-ts/constants/communication';
import { HealthcareBasicSections } from 'gdc-common-utils-ts/constants/healthcare';
import {
  EXAMPLE_COMMUNICATION_UUID,
  EXAMPLE_MEDICATION_STATEMENT_UUID,
  EXAMPLE_SUBJECT_DID,
} from 'gdc-common-utils-ts/examples/shared';
import {
  setCommunicationCategory,
  setCommunicationIdentifier,
  setCommunicationSubject,
} from 'gdc-common-utils-ts/utils/communication-claim-helpers';
import { CommunicationBundleSession } from 'gdc-common-utils-ts/utils/communication-bundle-session';
import {
  setMedicationCategoryList,
  setMedicationIdentifier,
  setMedicationSubject,
} from 'gdc-common-utils-ts/utils/medication-claim-helpers';

let communicationClaims = { '@context': 'org.hl7.fhir.r4' };
communicationClaims = setCommunicationIdentifier(
  communicationClaims,
  EXAMPLE_COMMUNICATION_UUID,
);
communicationClaims = setCommunicationSubject(
  communicationClaims,
  EXAMPLE_SUBJECT_DID,
);
communicationClaims = setCommunicationCategory(
  communicationClaims,
  CommunicationCategoryCodes.Notification.attributeValue,
);

const bundleEditor = new CommunicationBundleSession({ communicationClaims });

let medicationClaims = { '@context': 'org.hl7.fhir.api' };
medicationClaims = setMedicationIdentifier(
  medicationClaims,
  EXAMPLE_MEDICATION_STATEMENT_UUID,
);
medicationClaims = setMedicationSubject(
  medicationClaims,
  EXAMPLE_SUBJECT_DID,
);
medicationClaims = setMedicationCategoryList(medicationClaims, [
  HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
]);

bundleEditor.upsertActiveMedicationStatementEntry({
  claims: medicationClaims,
  fullUrl: `urn:uuid:${EXAMPLE_MEDICATION_STATEMENT_UUID}`,
});
bundleEditor.saveAndReleaseActiveEntry();
```

Mental model:

- `MedicationStatement` still lives as `resource.meta.claims`
- `bundleEditor` stores that resource in the bundle
- the bundle is serialized back into `Communication.content-attachment-data`

Simple example with medication linked documents:

```ts
import { MedicationStatementClaim } from 'gdc-common-utils-ts/models/interoperable-claims/medication-statement-claims';
import {
  addMedicationContainedDocumentIdentifierList,
  getMedicationContainedDocumentIdentifierList,
  setMedicationContainedDocumentIdentifierList,
} from 'gdc-common-utils-ts/utils/medication-claim-helpers';
import {
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY,
  EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
  EXAMPLE_MEDICATION_STATEMENT_STATUS,
  EXAMPLE_MEDICATION_STATEMENT_TEXT,
  EXAMPLE_SUBJECT_DID,
} from 'gdc-common-utils-ts/examples/shared';

let claims = {
  '@context': 'org.hl7.fhir.api',
  [MedicationStatementClaim.Identifier]: EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
  [MedicationStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
  [MedicationStatementClaim.Status]: EXAMPLE_MEDICATION_STATEMENT_STATUS,
  [MedicationStatementClaim.MedicationText]: EXAMPLE_MEDICATION_STATEMENT_TEXT,
};

claims = setMedicationContainedDocumentIdentifierList(claims, [EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER]);
claims = addMedicationContainedDocumentIdentifierList(claims, [EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY]);

const documentIds = getMedicationContainedDocumentIdentifierList(claims);
// ['docref-001', 'docref-002']
```

Important:

- these helpers mutate claim values
- they do not insert anything into a bundle by themselves
- today, `MedicationStatement` scalar fields such as `identifier`, `status`, `medication-text`, or `effective`
  are still assigned directly in the claims object

## 2. Then: Add Data To An IPS Bundle In Memory

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
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
  EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_URL,
  EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE,
  EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
  EXAMPLE_MEDICATION_STATEMENT_STATUS,
  EXAMPLE_MEDICATION_STATEMENT_TEXT,
  EXAMPLE_SUBJECT_DID,
} from 'gdc-common-utils-ts/examples/shared';

const bundleEditor = new CommunicationBundleSession({
  communicationClaims: {
    '@context': 'org.hl7.fhir.r4',
    [CommunicationClaim.Identifier]: EXAMPLE_COMMUNICATION_IDENTIFIER,
    [CommunicationClaim.Subject]: EXAMPLE_SUBJECT_DID,
    [CommunicationClaim.Category]: CommunicationCategoryCodes.Notification.claim,
  },
});

bundleEditor.upsertActiveMedicationStatementEntry({
  claims: {
    '@context': 'org.hl7.fhir.api',
    [MedicationStatementClaim.Identifier]: EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
    [MedicationStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
    [MedicationStatementClaim.Status]: EXAMPLE_MEDICATION_STATEMENT_STATUS,
    [MedicationStatementClaim.MedicationText]: EXAMPLE_MEDICATION_STATEMENT_TEXT,
    [MedicationStatementClaim.Effective]: EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE,
  },
  fullUrl: EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
});

bundleEditor.upsertActiveConditionEntry({
  claims: {
    '@context': 'org.hl7.fhir.api',
    [ConditionClaim.Identifier]: 'cond-001',
    [ConditionClaim.Subject]: EXAMPLE_SUBJECT_DID,
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
    [AllergyIntoleranceClaim.Subject]: EXAMPLE_SUBJECT_DID,
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

Current practical pattern:

1. use claim helpers only where they already exist
2. call `bundleEditor.upsertActive...Entry({ claims, fullUrl })`

`bundleEditor` is document-level editing.
For `MedicationStatement`, those helpers are currently list-oriented only.
Scalar fields such as `identifier`, `status`, `medication-text`, and `effective`
are still authored inline in the claims object.

## 2.1 Linked Attachments Inside The Same Bundle

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
    [MedicationStatementClaim.Identifier]: EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
    [MedicationStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
    [MedicationStatementClaim.Status]: EXAMPLE_MEDICATION_STATEMENT_STATUS,
    [MedicationStatementClaim.MedicationText]: EXAMPLE_MEDICATION_STATEMENT_TEXT,
  },
  fullUrl: EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
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

## 3. Read `meta.claims` For Frontend Cards

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

## 4. Filter Resources By IPS Section

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

## 5. Read A Real FHIR R4 IPS Bundle

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

## 6. Search Param Names vs Claim Keys

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
