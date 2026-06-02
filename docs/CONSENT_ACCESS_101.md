# Consent Access 101

This guide defines the shared consent-access evaluation model used across:

- `gdc-common-utils-ts`
- `gdc-sdk-core-ts`
- `gdc-sdk-node-ts`
- `gdc-sdk-front-ts`
- `gwtemplate-node-ts`

It does not reopen bootstrap decisions around `_activate`, `vp_token`,
`controller.*`, `owner`, or legal representative semantics.

It also does not replace the broader SDK flow documentation for:

- organization onboarding
- employee invitation / activation
- individual onboarding
- relationship invitation / acceptance
- clinical import/search flows

But it is one of the core building blocks those flows depend on.

## 0. Editing Consents Inside A Communication Bundle

If frontend/backend is creating or editing real `Consent` resources, keep the
mental model simple:

- the permission lives as a `Consent` resource with `meta.claims`
- one or more `Consent` resources live inside a `Bundle`
- that bundle can be carried inside a `Communication`
- `bundleEditor` is the in-memory editing unit
- `get/set/add/remove` claim helpers are the only API needed to edit one
  selected consent

Executable step-by-step reference:

- [__tests__/101-consent-bundle-editor.test.ts](../__tests__/101-consent-bundle-editor.test.ts)
- [HEALTHCARE_ROLES_I18N_101.md](./HEALTHCARE_ROLES_I18N_101.md)

Short path:

```ts
import { CommunicationBundleSession } from 'gdc-common-utils-ts/utils/communication-bundle-session';
import { CommunicationCategoryCodes } from 'gdc-common-utils-ts/constants/communication';
import { ConsentDecisions } from 'gdc-common-utils-ts/models/consent-rule';
import {
  addSectionList,
  setConsentDecision,
  setConsentIdentifier,
  setConsentSubject,
  setPurposeList,
  setActorRoleList,
  setSectionList,
} from 'gdc-common-utils-ts/utils/consent-claim-helpers';
import {
  setCommunicationCategory,
  setCommunicationIdentifier,
  setCommunicationSubject,
} from 'gdc-common-utils-ts/utils/communication-claim-helpers';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_CONSENT_IDENTIFIER,
  EXAMPLE_SUBJECT_DID,
} from 'gdc-common-utils-ts/examples/shared';
import {
  HealthcareActorRoles,
  HealthcareBasicSections,
  HealthcareConsentPurposes,
} from 'gdc-common-utils-ts/constants/healthcare';
let communicationClaims = { '@context': 'org.hl7.fhir.r4' };
communicationClaims = setCommunicationIdentifier(
  communicationClaims,
  EXAMPLE_COMMUNICATION_IDENTIFIER,
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

let consentClaims = { '@context': 'org.hl7.fhir.api' };
consentClaims = setConsentIdentifier(
  consentClaims,
  EXAMPLE_CONSENT_IDENTIFIER,
);
consentClaims = setConsentSubject(
  consentClaims,
  EXAMPLE_SUBJECT_DID,
);
consentClaims = setConsentDecision(
  consentClaims,
  ConsentDecisions.Permit,
);

bundleEditor.upsertActiveConsentEntry({
  claims: consentClaims,
  fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
});

const activeConsentClaims = {
  ...(bundleEditor.getActiveEntry()?.resource?.meta?.claims || {}),
};

// Edit the same Consent claim set that came from the selected bundle entry.
// This is not a second Consent object.
let editedConsentClaims = setPurposeList(activeConsentClaims, [HealthcareConsentPurposes.Treatment]);
editedConsentClaims = setActorRoleList(editedConsentClaims, [HealthcareActorRoles.GeneralistMedicalPractitioner]);
editedConsentClaims = setSectionList(editedConsentClaims, [
  HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
]);
editedConsentClaims = addSectionList(editedConsentClaims, [
  HealthcareBasicSections.Results.attributeValue,
]);

bundleEditor.patchActiveEntryClaims(editedConsentClaims);
bundleEditor.saveAndReleaseActiveEntry();
```

This is the preferred 101 flow when:

- a `Communication` already arrived with a permissions bundle
- frontend creates a new permissions bundle to send later
- the user selects one consent and edits its claims directly

Only after that, another layer may place the resulting `Communication` in a
draft/outbox or send it.

Mental model:

- `activeConsentClaims` = the currently selected consent claims as read from the bundle
- `editedConsentClaims` = the same consent after applying setters/adders
- `bundleEditor.patchActiveEntryClaims(...)` writes that edited version back into
  the same active `Consent` entry

Role and section catalogs used in consent editing:

- roles come from `HealthcareActorRoles` and the sector-aware role catalogs
- sections come from `HealthcareBasicSections`
- localization should use the catalog `i18nKey`, not the stored claim value

## Documentation Rules For Consent Examples

These rules exist so developers and AI agents do not repeat the same mistakes.

### Use canonical semantic names

Prefer:

- `subjectDid`
- `professionalDid`
- `orgControllerDid`
- `individualControllerDid`
- `emailProfessional`
- `emailControllerOrg`
- `emailControllerIndividual`
- `emailRelatedPerson`

Legacy aliases such as `EXAMPLE_CONSENT_ACCESS_SUBJECT` may remain only for
compatibility, not as the preferred names in new docs.

### Prefer shared constants over raw literals

Use:

- `HealthcareActorRoles`
- `HealthcareConsentPurposes`
- `HealthcareBasicSections`

Do not teach new flows from inline literals like:

- `'TREAT'`
- `'professional'`
- `'medications'`

unless the purpose of the snippet is to document the literal contract itself.

### Teach where values come from

A consent example should always make clear whether a value comes from:

- the subject DID already selected in the UI/runtime
- the invited or requesting actor identity
- a prior onboarding step
- a previous SDK call result

### Build the subject DID, do not invent it manually

When docs need to show subject DID construction, prefer `buildIndividualDidWeb(...)`
instead of handwritten `did:web` concatenation.

## Where This Fits In The Bigger Flow Map

Consent access is not an isolated feature. It sits inside these broader flows:

- organization controller creates employees and issues access-enabling bootstrap material
- individual controller creates or updates permissions for:
  - professional
  - related person
  - caregiver or other allowed actor
- a professional or related person later requests access to the individual
- the SDK evaluates whether that access is already covered
- if not covered, the SDK builds a canonical permission-request `Communication`
- once access exists, actors may read or write only the sections/actions covered

This means the 101 must be read together with:

- `gdc-common-utils-ts/src/examples/organization-controller.ts`
- `gdc-common-utils-ts/src/examples/individual-controller.ts`
- `gdc-common-utils-ts/src/examples/professional.ts`
- `gdc-common-utils-ts/src/examples/related-person.ts`

## Goal

Given:

- one subject
- one requesting actor
- actor role
- purpose
- requested sections
- requested resource types when present
- all active consent rules for the subject

determine:

- allowed
- denied
- partially allowed
- what is missing
- whether an explicit deny overrides a broader allow

## Canonical target kinds

Direct actor target:

- email
- `did:web`
- phone only when a sector/runtime explicitly enables it

Organizational target:

- `did:web`
- organization URL normalized to `did:web:<host>`
- email domain only as fallback normalization

Jurisdiction target:

- country/jurisdiction code such as `ES`

Related person:

- same direct-selector support model as other actor-specific matches

## Active consent aggregation

Always evaluate the full set of active consent rules for the subject.

Shared helper:

- [`groupActiveConsentsByTarget(...)`](../src/utils/consent.ts)

Grouped views exposed today:

- actor-specific target
- organization target
- jurisdiction target
- phone-extension target

## Precedence

Evaluation precedence is:

1. explicit deny for a concrete email
2. explicit permit for a concrete email
3. organization-scoped permit/deny
4. jurisdiction-scoped permit/deny
5. default deny

This is evaluated per requested section and optional resource type.

## Shared contracts

Models:

- [`ConsentRule`](../src/models/consent-rule.ts)
- [`NormalizedConsentTarget`](../src/models/consent-access.ts)
- [`ConsentCoverageRequest`](../src/models/consent-access.ts)
- [`EffectiveAccessEvaluation`](../src/models/consent-access.ts)
- [`MissingPermissionSet`](../src/models/consent-access.ts)
- [`ActiveConsentView`](../src/models/consent-access.ts)

Helpers:

- [`normalizeConsentTarget(...)`](../src/utils/consent.ts)
- [`resolveConsentActor(...)`](../src/utils/consent.ts)
- [`isConsentRuleActive(...)`](../src/utils/consent.ts)
- [`groupActiveConsentsByTarget(...)`](../src/utils/consent.ts)
- [`evaluateConsentCoverage(...)`](../src/utils/consent.ts)

## Source-of-truth examples

Reusable examples live in:

- [`src/examples/consent-access.ts`](../src/examples/consent-access.ts)
- [`src/examples/professional.ts`](../src/examples/professional.ts)
- [`src/examples/related-person.ts`](../src/examples/related-person.ts)

Covered matrix:

- physician by email and role for continuous care
- physician by email and role for emergencies
- physician by organization and role
- physician by jurisdiction and role
- nurse by organization
- paramedic by jurisdiction
- explicit deny for one physician email inside an allowed organization
- related person specific target
- revoked consent with no remaining fallback

Phone remains documented as pending extension unless a sector-specific
contract closes it explicitly.

## SDK usage

`gdc-sdk-core-ts` builds on these helpers to expose:

- grouped controller views
- requested-access evaluation
- missing-permission extraction
- canonical permission-request `Communication` creation
- canonical permission-request lookup query creation

Downstream runtime packages then use that shared layer for:

- permission management screens and APIs
- invitation and acceptance flows
- notification flows
- write-access gating for imports into the subject index
- SMART access gating for document retrieval

## Permission request `Communication`

When coverage is missing, the SDK should build a canonical `Communication`
for the subject controller.

Canonical retrieval identifiers:

- `Communication.identifier`
- `thid`
- `DocumentReference.contenthash` as `z<base58>` CID when present

Push/email/SMS are notification channels around this canonical
`Communication`, not the main contract.

Important policy note:

- do not auto-create a synthetic default consent during individual creation
- subject-controller self-access should be handled by runtime/business policy
- employee and related-person access should rely on explicit consent or an
  equivalent member policy

## What This 101 Does Not Yet Cover By Itself

This document does not by itself define:

- employee activation runtime
- invitation OTP providers
- relationship PIN storage
- GW routing details
- UNID reminder runtime

Those belong to the corresponding runtime or extension packages, but they must
consume this consent model instead of duplicating it.
