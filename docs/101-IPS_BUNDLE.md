# IPS Bundle 101

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

const communicationClaims = communication.newIpsSummarySearchCommunication({
  subjectId: EXAMPLE_SUBJECT_DID,
  requesterId: EXAMPLE_PROFESSIONAL_DID,
});
```

That is the 101 path.

If a caller later needs the lower-level search path builders or operation-style
request serialization, those belong in deeper docs and code references, not in
the first onboarding flow.

## 2. Read One IPS

The high-level reading path is documented in:

- [101-CLINICAL-IPS.md](./101-CLINICAL-IPS.md)

The reader mental model is:

- `ipsBundleReader.getSections()`
- `ipsBundleReader.getSectionSummary(...)`
- `ipsBundleReader.getResources(...)`
- `ipsBundleReader.getAllergies(...)`
- `ipsBundleReader.getConditions(...)`
- `ipsBundleReader.getMedications(...)`
- `ipsBundleReader.getVitalSigns(...)`
- `ipsBundleReader.getLocalTextAndIntDisplay(...)`
- `ipsBundleReader.getXhtmlOrDerived(...)`
- `ipsBundleReader.getNarrative(...)`

Shortest path:

```ts
import { createFhirDocumentFacade } from 'gdc-sdk-core-ts';
import { buildIpsClinicalHistoryBundleExample } from 'gdc-common-utils-ts';

const { bundleInMemory } = buildIpsClinicalHistoryBundleExample();
const ipsBundleReader = createFhirDocumentFacade(bundleInMemory);

const sections = ipsBundleReader.getSections();
const medications = ipsBundleReader.getMedications();
```

## 3. Build Or Edit One IPS Bundle

For a 101, think in terms of chainable editors and claim helpers.

Start from:

- `BundleEditor`
- `BundleEntryEditor`
- resource-specific entry editors when available

The generic path is documented in:

- [101-BUNDLE_EDITOR_READER.md](./101-BUNDLE_EDITOR_READER.md)

The family-specific shared API coverage and missing typed helpers are tracked
in:

- [REFERENCE-CLINICAL-IPS-API.md](./REFERENCE-CLINICAL-IPS-API.md)

Shortest generic editing shape:

```ts
import {
  BundleEditor,
  HealthcareBasicSections,
  ResourceTypesFhirR4,
} from 'gdc-common-utils-ts';

const bundle = new BundleEditor()
  .setBundleOperation('create')
  .setAllowedResourceType(ResourceTypesFhirR4.Observation)
  .newEntry('entry-001')
  .setClaim('Observation.identifier', 'urn:uuid:entry-001')
  .setClaim(
    'Observation.category',
    HealthcareBasicSections.VitalSigns.attributeValue,
  )
  .doneEntry()
  .build();
```

That generic shape is only the baseline.

The preferred target surface is resource-specific, for example:

- `asAllergy().setIdentifier(...).setSubject(...).setClinicalStatus(...)`
- `asMedicationStatement().setIdentifier(...).setSubject(...).setEffective(...)`
- `asCondition().setIdentifier(...).setSubject(...).setOnsetDateTime(...)`
- `asVitalSign().setVitalSignType(...).setValueQuantity(...)`

When those typed helpers are still missing, the gap stays explicit in:

- [REFERENCE-CLINICAL-IPS-API.md](./REFERENCE-CLINICAL-IPS-API.md)

## 4. Shared Rules

- do not hardcode section literals in docs or tests
- use shared constants such as `HealthcareBasicSections.*`
- do not invent date/search names when FHIR already defines one
- prefer `effective`, `onset-datetime`, `date`, `clinical-status`,
  `verification-status`, and the other canonical FHIR names
- keep `setClaim(...)` / `getClaim(...)` as fallback escape hatches, not the
  primary teaching path

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
