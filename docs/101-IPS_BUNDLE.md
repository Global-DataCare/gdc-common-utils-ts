# IPS Bundle 101

> 101 note
> - Teach here: the highest-level public `common-utils` helper available for this topic.
> - Do not present raw `meta.claims`, `upsert*`, or pack/unpack as the main path unless the topic itself is transport.
> - Read [101-README.md](./101-README.md) for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.


This is the high-level shared guide for IPS work in the GDC SDK family.

Use this when a developer needs to:

- request an IPS summary or one IPS subset
- read one IPS returned from backend/index flows
- build one IPS-style bundle locally with shared editors
- understand where high-level reading stops and technical plumbing begins

Read this together with:

- [101-CLINICAL-IPS.md](./101-CLINICAL-IPS.md)
- [REFERENCE-CLINICAL-IPS-API.md](./REFERENCE-CLINICAL-IPS-API.md)
- [101-BUNDLE_EDITOR_READER.md](./101-BUNDLE_EDITOR_READER.md)
- [101-VITAL_SIGN_ENTRY_EDITOR.md](./101-VITAL_SIGN_ENTRY_EDITOR.md)
- [101-MEDICATION_STATEMENT_CLAIMS.md](./101-MEDICATION_STATEMENT_CLAIMS.md)

## Purpose

Keep the IPS mental model simple:

- request one IPS through shared request helpers
- read that IPS with `ipsBundleReader`
- edit bundle entries with shared editors and chainable `set...` / `get...`
- keep technical persistence/session helpers out of the main onboarding path

This 101 does not teach internal bundle-session persistence method names.

Those lower-level APIs remain real, but they belong in:

- JSDoc
- code comments
- technical reference docs
- focused tests next to the code

## What Lives Where

- `gdc-common-utils-ts`
  - shared constants
  - shared example IPS data
  - shared bundle editors/readers
  - chainable claim helpers
- `gdc-sdk-core-ts`
  - high-level IPS reader creation and bundle traversal
- `gdc-sdk-node-ts`
  - orchestration helpers over the shared reader

## 1. Request One IPS

The shortest shared entry point is one request helper that prepares the
`Communication` request shape for you.

```ts
import { communication } from 'gdc-common-utils-ts/utils/communication-bundle-document-request';
import {
  EXAMPLE_PROFESSIONAL_DID,
  EXAMPLE_SUBJECT_DID,
} from 'gdc-common-utils-ts/examples/shared';

const communicationClaims = communication.setRequestSummaryOperation({
  subjectId: EXAMPLE_SUBJECT_DID,
  requesterId: EXAMPLE_PROFESSIONAL_DID,
});
```

That is the 101 path: `Communication.content-reference` selects
`Subject/$summary` and `Communication.content-attachment-data` carries the FHIR
`Parameters` resource. The runtime executes this through
`requestClinicalSummary(...)`; it must not call an ingestion method or invoke
the `$summary` HTTP route directly. `$summary` is GW's internal operation name;
the runtime submits the containing Communication.

When rendered as a native FHIR projection, those two flat claims become two
elements of the same `Communication.payload[]` array:

```ts
payload: [
  { contentReference: { reference: 'Subject/$summary' } },
  {
    contentAttachment: {
      contentType: 'application/fhir+json',
      data: '<base64 FHIR Parameters>',
    },
  },
]
```

This is one read request in one Communication. It is not two Communications,
and the attachment is request criteria, not a clinical Bundle to ingest.

If a caller later needs the lower-level search path builders or operation-style
request serialization, those belong in deeper docs and code references, not in
the first onboarding flow.

## 2. Read One IPS

The high-level reading path is documented in:

- [101-CLINICAL-IPS.md](./101-CLINICAL-IPS.md)

The reader hierarchy is:

- `BundleReader` in `gdc-common-utils-ts` owns generic Bundle structure,
  Composition sections, counts, references and entry resolution
- `FhirDocumentFacade` in `gdc-sdk-core-ts` owns clinical resource retrieval and
  combined section/type/date filtering
- `LifecycleResultReader` owns command/search outcome statuses and issues; it
  does not read the clinical document
- Node/Front actor facades return the same `ClinicalSummaryReadResult`
- extension packages reuse those readers and may add product-owned projections

`ClinicalSummaryReadResult` always has four fields: `operation` for transport
and polling evidence, `bundle` for the authoritative FHIR document,
`reader` for structural navigation and `document` for clinical resource
queries.

Shortest path:

```ts
import { createFhirDocumentFacade } from 'gdc-sdk-core-ts';
import { buildIpsClinicalHistoryBundleExample } from 'gdc-common-utils-ts';

const { bundleInMemory } = buildIpsClinicalHistoryBundleExample();
const document = createFhirDocumentFacade(bundleInMemory);

const sections = document.getSections();
const medicationView = document
  .filterBySections([
    HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
  ])
  .filterByTypes([ResourceTypesFhirR4.MedicationStatement])
  .filterByClinicalDateRange('2026-01-01', '2026-12-31');
const medications = medicationView.getResources();
const medicationCount = medicationView.getResourceCount();
```

For generic structural navigation over the same returned Bundle:

```ts
const reader = new BundleReader(bundleInMemory);
const sectionCount = reader.getDocumentSectionCount();
const medicationReferences = reader.getDocumentSectionResourceReferences(
  HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
);
const medicationEntries = reader.getDocumentSectionResourceEntries(
  HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
);
```

## 3. Build Or Edit One IPS Bundle

For a 101, think in terms of chainable editors and claim helpers.

Start from:

- `BundleEditor`
- `BundleEntryEditor`
- resource-specific entry editors when available
- `BundleEditor.setBundleType('document')` for individual clinical documents

### Keep the write actor and exported FHIR author connected

Direct clinical writes keep using the operational actor selected by the
authenticated profile: `sender` and the locally authored
`Composition.author` are that profile `actorDid`. Email, telephone, OIDC
subjects, DCR client ids and key ids never replace it.

When exporting the resulting document as FHIR IPS, resolve that operational
DID through the actor's protected profile binding and use
`buildFhirIpsCreatorAuthor(...)` to add the ordinary author resources:

```ts
import {
  buildFhirIpsCreatorAuthor,
  FhirIpsCreatorKinds,
} from 'gdc-common-utils-ts';

const creator = buildFhirIpsCreatorAuthor({
  kind: FhirIpsCreatorKinds.Professional,
  actorIdentifier: practitionerIdentifier,
  authorIdentifier: practitionerRoleIdentifier,
  organizationReference: providerDid,
  role: professionalRole,
});

composition.author = [{ reference: creator.authorReference }];
bundle.entry.push(...creator.entries);
```

The protected profile binding stores two imported or locally generated
`urn:uuid` values: `actorIdentifier` for the person/member and
`authorIdentifier` for the concrete role or relationship assignment. It also
stores the assignment owner and its governed role. Verified email/telephone,
DCR clients, keys and operational actor DIDs are aliases that resolve that
binding; they are not FHIR identifiers.

An imported IPS keeps its original FHIR graph. In the shared all-sections IPS,
`Composition.author` and `Composition.custodian` both reference the authoring
`Organization`, while `Composition.attester.party` references the
`PractitionerRole` that attested the document. The canonical flat projection
therefore keeps those roles distinct:

```ts
import {
  CompositionClaim,
  compositionFhirR4ToFlat,
} from 'gdc-common-utils-ts';

const claims = compositionFhirR4ToFlat(composition);

claims[CompositionClaim.Author];       // CSV of author references
claims[CompositionClaim.Custodian];    // one Organization reference
claims[CompositionClaim.Attester];     // CSV of attester.party references
claims[CompositionClaim.AttesterMode]; // positionally aligned R4 modes
claims[CompositionClaim.AttesterTime]; // positionally aligned attestation times
```

The attester reference identifies the FHIR attesting party. When it targets a
`PractitionerRole`, resolve that resource to its `Practitioner` and
`Organization`; do not reinterpret the role reference itself as the employee
or as the transport sender.

Use `buildClinicalCreatorPermissionActor(binding)` when a Consent permission
must address that exact assignment. It returns the assignment `urn:uuid` and
the governed role separately, so changing phone, email or device cannot change
the permission identity.

A professional export references the assignment as PractitionerRole and
includes its Practitioner. An individual member references the relationship
assignment as RelatedPerson while retaining the member UUID in
`RelatedPerson.identifier`. ONESELF references the existing Patient/subject
entry. A later contract or relationship receives another author UUID without
changing the person's actor UUID. This export mapping does not change
`updateClinicalSummary(...)`, clone imported documents or source-authored IPS
provenance.

### Coded names and languages

For every coded clinical resource, keep these values separate:

- `<ResourceType>.code`: `system|code`, the terminology identity and lookup key.
- `<ResourceType>.code-text`: the manual/local label, projected to
  `CodeableConcept.text`; its language is `<ResourceType>.language`.
- `<ResourceType>.code-display`: the English/international display, projected
  to `Coding.display`.

The UI uses local text when its locale matches the resource language, English
display for English, and a terminology translation resolved from `system|code`
for another locale. If translation is unavailable it falls back to display and
then local text. It must never show `system|code` as the clinical name or copy
that token into an editable name field.

These companions depend on the FHIR target datatype, not merely on a `token`
search type. A CodeableConcept supports both text and display; Coding supports
display but not CodeableConcept.text; primitive code, Identifier, ContactPoint
and boolean token searches do not automatically gain either suffix.

A short FHIR API claim contains exactly one dot, for example
`MedicationStatement.adherence`. Dotted strings such as `adherence.code` or
`medication.concept` are HL7 FHIRPath expressions that explain the native JSON
mapping; they are never SearchParameter names or `resource.meta.claims` keys.

MedicationStatement is deliberately non-obvious: `code` searches
`medication.concept`, while `medication` is a reference search over
`medication.reference`. In R5, `adherence` is another token search whose HL7
expression targets `adherence.code`. Immunization instead names its medication concept search
`vaccine-code`.

The generic path is documented in:

- [101-BUNDLE_EDITOR_READER.md](./101-BUNDLE_EDITOR_READER.md)

The family-specific shared API coverage and missing typed helpers are tracked
in:

- [REFERENCE-CLINICAL-IPS-API.md](./REFERENCE-CLINICAL-IPS-API.md)

Shortest generic editing shape:

```ts
import {
  BundleEditor,
  BundleEditableResourceTypes,
  BundleTypes,
  HealthcareBasicSections,
} from 'gdc-common-utils-ts';

const bundle = new BundleEditor()
  .setBundleOperation('create')
  .setBundleType(BundleTypes.document)
  .setCompositionSubject(subjectDid)
  .setCompositionType('http://loinc.org|60591-5')
  .setCompositionTitle('IPS-style document')
  .setCompositionDate('2026-07-06T10:15:00Z')
  .setCompositionAuthorList([subjectDid])
  .newEntryAs(BundleEditableResourceTypes.observation, 'entry-001')
  .setClaim('Observation.identifier', 'urn:uuid:entry-001')
  .setClaim('Observation.category', HealthcareBasicSections.VitalSigns.attributeValue)
  .doneEntry()
  .buildDocument();
```

That generic shape is only the baseline.

The preferred target surface is resource-specific, for example:

- `asAllergy().setIdentifier(...).setSubject(...).setClinicalStatus(...)`
- `asMedicationStatement().setIdentifier(...).setSubject(...).setEffective(...)`
- `asCondition().setIdentifier(...).setSubject(...).setOnsetDateTime(...)`
- `asVitalSign().setVitalSignType(...).setValueQuantity(...)`
- `asObservation().setCodeTextLocal(...).setValueQuantityNumber(...).setValueQuantityUnit(...).setSectionList([HealthcareBasicSections.Results.attributeValue])`

Use `Observation` for a scalar laboratory result (name/code, value, unit,
status and effective date). Use `DiagnosticReport` as an optional report/panel
that references one or more Observations; it is not a replacement for the
Observation value. Both editors can assign Composition sections through
`setSectionList(...)`.

For the concrete medication-document story, use:

- [../__tests__/101-communication-medication-document.test.ts](../__tests__/101-communication-medication-document.test.ts)

When rendering one received IPS/document bundle in a frontend, iterate visible
resources rather than raw entries when contained children were imported into the
flat claims view:

```ts
const entryCount = ipsBundleReader.getEntryCount();
const visibleResourceCount = ipsBundleReader.getVisibleResourceCount();
const firstVisibleEntryIndex = ipsBundleReader.getVisibleEntryIndexByPosition(0);
```

Use `getEntryCount()` for audit/debug totals. Use `getVisibleResourceCount()`
and the visible-index helpers for UI traversal.

When those typed helpers are still missing, the gap stays explicit in:

- [REFERENCE-CLINICAL-IPS-API.md](./REFERENCE-CLINICAL-IPS-API.md)

## 4. Shared Rules

- do not hardcode section literals in docs or tests
- do not hardcode clinical literals in docs or tests when a shared constant
  already exists
- if a clinical literal still lacks a shared constant, add it first in
  `gdc-common-utils-ts` following the canonical FHIR/HL7 value
- use shared constants such as `HealthcareBasicSections.*`
- use typed/shared constants and fixtures in snippets instead of ad-hoc strings
- keep fixtures/tests reusable and shared across packages when the contract is
  intended to be canonical
- do not invent date/search names when FHIR already defines one
- prefer `effective`, `onset-datetime`, `date`, `clinical-status`,
  `verification-status`, and the other canonical FHIR names
- keep `setClaim(...)` / `getClaim(...)` as fallback escape hatches, not the
  primary teaching path
- keep `sections` for advanced examples only, not the default teaching story
- keep internal query objects internal; public onboarding should stay explicit
  and readable
- treat IPS `subject` as contextual/readonly in the happy path, not as one
  repetitive per-entry setter

## 5. What This 101 Does Not Teach

This 101 intentionally does not teach:

- internal bundle session persistence methods
- internal bundle persistence method names
- technical transport wrapping details
- backend route wiring

Those details remain important, but they are not the first thing an integrator
should learn.

## 6. Executable References

- [__tests__/101-communication-search-reference.test.ts](../__tests__/101-communication-search-reference.test.ts)
- [__tests__/101-ips-bundle-editor.test.ts](../__tests__/101-ips-bundle-editor.test.ts)
- [__tests__/101-medication-claim-helpers.test.ts](../__tests__/101-medication-claim-helpers.test.ts)
- [src/utils/communication-attached-bundle-session.ts](../src/utils/communication-attached-bundle-session.ts)
- [src/utils/clinical-resource-view.ts](../src/utils/clinical-resource-view.ts)

Use the tests above as executable proof, but keep the code/JSDoc as the place
for plumbing details rather than turning those details into onboarding
narrative.
