# 101: consent-scoped access for an invited individual member

An invitation establishes how an authenticated person may become related to an
individual. It does not grant clinical access by itself. The controller first
persists the relationship and active Consent; after invitation acceptance, the
trusted GW derives the SMART token scope from that authoritative state.

The executable example is
`__tests__/101-individual-member-smart-scopes.test.ts`. It deliberately imports
the shared subject, actor, role, purpose, section registry and Consent fixture:
tests and consumers must not repeat those values as private literals.

```ts
import {
  HealthcareConsentPurposes,
  HealthcareSummarySections,
} from 'gdc-common-utils-ts/constants/healthcare'
import {
  EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL,
  EXAMPLE_CONSENT_ACCESS_RULES,
  EXAMPLE_CONSENT_ACCESS_SUBJECT,
} from 'gdc-common-utils-ts/examples/consent-access'
import { EXAMPLE_RELATED_PERSON_ROLE } from 'gdc-common-utils-ts/examples/shared'
import {
  buildSmartCompositionReadScope,
  deriveGrantedSmartScopes,
} from 'gdc-common-utils-ts/utils/smart-scope'

const requestedScope = buildSmartCompositionReadScope({
  subjectDid: EXAMPLE_CONSENT_ACCESS_SUBJECT,
  sections: Object.values(HealthcareSummarySections)
    .map((section) => section.attributeValue),
})

const grant = deriveGrantedSmartScopes(
  [EXAMPLE_CONSENT_ACCESS_RULES.relatedPersonClinicalSections],
  {
    requestedScopes: requestedScope,
    actor: {
      actorKind: 'related-person',
      email: EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL,
    },
    actorRole: EXAMPLE_RELATED_PERSON_ROLE,
    purpose: HealthcareConsentPurposes.Treatment,
  },
)
```

`deriveGrantedSmartScopes(...)` is intentionally a pure policy projection. It
never signs a JWT and its browser-side result is never authority. A GW supplies
the authenticated actor and current Consent rules, signs only
`grant.grantedScopes`, and enforces those same scopes on every read.

The flow is actor-neutral after authentication. A related individual member or
a professional may resolve a card locator and request access through the same
UI component. If an applicable grant already exists, the GW may return the
narrowed token. Otherwise the BFF records a request `Communication` for the
controller; the request itself does not create Consent.

## Communication section contract

For attached `batch` or `collection` Bundles, the clinical section is the
canonical `Communication.topic` claim and native FHIR `Communication.topic`
CodeableConcept. For an attached document Bundle, section placement remains in
the document's `Composition.section` graph.

Claims use one concrete FHIR parameter after the resource type, such as
`Communication.topic` or `Communication.content-reference`. They do not use
camelCase FHIR aliases or nested keys such as
`Communication.payload.contentCodeableConcept.coding`. Schema.org claims are a
separate vocabulary and retain their canonical camelCase names.
