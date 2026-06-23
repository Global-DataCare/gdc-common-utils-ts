# 101 Clinical IPS

This is the shortest high-level entry point for developers who receive one IPS
and want to use the shared SDK helpers immediately.

Use this document to learn:

- what to read with `ipsBundleReader`
- what to edit with `BundleEditor`
- which shared constants and fixtures to use
- which APIs are high-level and which are only fallback

Do not hardcode clinical literals in docs or tests. Use shared constants and
shared example data from `gdc-common-utils-ts`.

## What You Use Today

- `HealthcareBasicSections.*`
- shared IPS fixtures such as `buildIpsClinicalHistoryBundleExample()`
- `ipsBundleReader` for reading
- `BundleEditor` and typed entry editors for editing
- `setClaim(...)` / `getClaim(...)` only as fallback escape hatches
- [REFERENCE-CLINICAL-IPS-API.md](./REFERENCE-CLINICAL-IPS-API.md) for the
  complete shared API/claim matrix, including `TODO` coverage

Technical persistence helpers and internal bundle session APIs are intentionally
left out of this 101. Keep those in JSDoc, code comments, and reference docs.

## Create One IPS Bundle Reader

```ts
import { createFhirDocumentFacade } from 'gdc-sdk-core-ts';
import { buildIpsClinicalHistoryBundleExample } from 'gdc-common-utils-ts';

const { bundleInMemory } = buildIpsClinicalHistoryBundleExample();

// In this guide we call this the IPS bundle reader.
const ipsBundleReader = createFhirDocumentFacade(bundleInMemory);
```

## Shared Section Constants

Use these only when the caller truly wants to limit one query to one or more
selected sections.

```ts
import { HealthcareBasicSections } from 'gdc-common-utils-ts';

const allergySection =
  HealthcareBasicSections.AllergiesAndIntolerances.attributeValue;

const medicationSection =
  HealthcareBasicSections.HistoryOfMedicationUse.attributeValue;

const conditionSection =
  HealthcareBasicSections.ProblemList.attributeValue;

const vitalSignsSection =
  HealthcareBasicSections.VitalSigns.attributeValue;
```

## IPS Reader API

| API | Kind | Input | Output | Scope | Exists today? | Notes |
|---|---|---|---|---|---|---|
| `ipsBundleReader.getSections()` | read | none | section list | all IPS | yes | discover the sections present in the IPS |
| `ipsBundleReader.getSectionCounts({ sections? })` | read | section selector | section counts | all IPS | yes/target | counts by section and resource type |
| `ipsBundleReader.getEntries({ sections?, resourceTypes?, start?, end?, searchText?, count?, page?, offset? })` | read | generic entry filter | bundle entries | all IPS | yes/target | returns `fullUrl + resource` |
| `ipsBundleReader.getResources({ sections?, resourceType?, start?, end?, searchText?, count?, page?, offset? })` | read | generic query | resources | all IPS | yes/compat | compatibility path only |
| `ipsBundleReader.getAllergies({ sections?, clinicalStatus?, verificationStatus?, criticality?, start?, end?, count?, page?, offset? })` | read | allergy filter | bundle entries | allergies | yes/target | filtered entries with `fullUrl` and `resource` |
| `ipsBundleReader.getConditions({ sections?, clinicalStatus?, verificationStatus?, severity?, start?, end?, count?, page?, offset? })` | read | condition filter | bundle entries | conditions | yes/target | filtered entries with `fullUrl` and `resource` |
| `ipsBundleReader.getMedications({ sections?, status?, start?, end?, count?, page?, offset? })` | read | medication filter | bundle entries | medications | yes/target | filtered entries with `fullUrl` and `resource` |
| `ipsBundleReader.getVitalSigns({ sections?, code?, start?, end?, count?, page?, offset? })` | read | vital-sign filter | bundle entries | vital signs | yes/target | filtered entries with `fullUrl` and `resource` |
| `ipsBundleReader.getLocalTextAndIntDisplay(resourceOrEntry)` | render | resource or entry | label DTO | all IPS | yes | UI-ready label |
| `ipsBundleReader.getXhtmlOrDerived(resourceOrEntry)` | render | resource or entry | xhtml | all IPS | yes | prefers stored `text.div`, derives when needed |
| `ipsBundleReader.getNarrative(resourceOrEntry)` | render | resource or entry | narrative DTO | all IPS | yes | UI-ready narrative |

## Read Sections And Summary

```ts
const sections = ipsBundleReader.getSections();

const fullCounts = ipsBundleReader.getSectionCounts({
  sections: [],
});
```

`getSectionCounts(...)` returns counts only. It does not return entries or
resources.

## Section Selector Rule

Use `sections?: readonly string[]` everywhere.

- `sections === undefined` means all sections
- `sections.length === 0` means all sections
- otherwise only the listed sections are included

Examples:

```ts
ipsBundleReader.getResources({ sections: undefined });
ipsBundleReader.getResources({ sections: [] });
ipsBundleReader.getResources({ sections: [allergySection] });
```

## Read By Family

```ts
const allergies = ipsBundleReader.getAllergies({
  clinicalStatus: ['active'],
  verificationStatus: ['confirmed'],
});

const conditions = ipsBundleReader.getConditions({
  clinicalStatus: ['active'],
});

const medications = ipsBundleReader.getMedications({
  status: ['active'],
});

const vitalSigns = ipsBundleReader.getVitalSigns();
```

## Filter By Dates

```ts
const recentMedications = ipsBundleReader.getMedications({
  start: '2026-01-01',
  end: '2026-12-31',
});
```

## Render Labels And Narrative

```ts
const firstMedication = ipsBundleReader.getMedications({
  count: 1,
  page: 1,
})[0];

const label = ipsBundleReader.getLocalTextAndIntDisplay(firstMedication);
const xhtml = ipsBundleReader.getXhtmlOrDerived(firstMedication);
const narrative = ipsBundleReader.getNarrative(firstMedication);
const fullUrl = firstMedication.fullUrl;
const claims = firstMedication.resource?.meta?.claims;
```

## Limit Queries To Selected Sections

Only introduce `sections` when the caller truly wants a subset of the IPS.

```ts
const selectedResources = ipsBundleReader.getResources({
  sections: [allergySection, medicationSection],
});

const selectedMedicationEntries = ipsBundleReader.getMedications({
  sections: [medicationSection],
  status: ['active'],
});
```

## Reading And Editing Are Different

`ipsBundleReader` is read-only.

Use `BundleEditor` or typed entry editors when you want to add or update
clinical entries. After editing, recreate or refresh the reader.

```ts
const updatedBundle = editor.build();
const updatedIpsBundleReader = createFhirDocumentFacade(updatedBundle);
```

## What Still Remains Fallback Or TODO

High-level reading exists today, but some editor/query surface is still growing.

Still fallback:

- `setClaim(...)`
- `getClaim(...)`

Still desirable upstream:

- `asAllergy()`
- `asMedicationStatement()`
- `asCondition()`
- more typed high-level entry editors for the rest of the IPS families

## Reference Split

This 101 is intentionally short.

Use separate docs for deeper detail:

- `101-IPS_BUNDLE.md`
- `101-BUNDLE_EDITOR_READER.md`
- `REFERENCE-CLINICAL-IPS-API.md`
- `101-VITAL_SIGN_ENTRY_EDITOR.md`
- future section-specific docs such as:
  - allergies
  - medications
  - conditions
  - vital signs
  - immunizations
  - observations
  - procedures
  - diagnostic reports
