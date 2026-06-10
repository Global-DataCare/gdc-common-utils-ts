# Individual Onboarding PDF Request 101

This document explains the only contract that really matters for the current
GW CORE onboarding PDF draft flow:

- the backend finally consumes `resource.meta.claims`
- `kyc`, `formFields`, and helper facades are only auxiliary inputs

Current scope:

- individual controller only
- one PDF per request
- request and response resource type: `DocumentReference`
- PDF draft route:
  - `POST /{tenantId}/cds-{jurisdiction}/v1/{sector}/individual/pdf/DocumentReference/_create`

## What GW CORE Ultimately Expects

The important business payload is the final flat claim set in:

- `body.data[0].resource.meta.claims`

For the current individual onboarding flow, the meaningful claims are:

- `Organization.*`
- `Organization.owner.*`
- `Organization.member.*`
- `Person.*`
- `Service.*`
- `Order.*`

Examples:

- `org.schema.Organization.alternateName`
- `org.schema.Organization.owner.alternateName`
- `org.schema.Organization.owner.email`
- `org.schema.Organization.owner.telephone`
- `org.schema.Organization.member.birthDate`
- `org.schema.Organization.member.role`
- `org.schema.Person.givenName`
- `org.schema.Person.identifier.value`
- `org.schema.Service.serviceType`
- `org.schema.Order.orderedItem.serviceType`

Semantic split:

- `Organization.*`: the indexed individual organization, including the visible
  nickname used in the product
- `Organization.owner.*`: controller operational/binding data
  such as nickname, email, telephone, and binding identifier
- `Organization.member.*`: reserved for the legal identity of the indexed subject (first member is "ONESELF")
- `Person.*`: legal identity of the controller / legal representative
- `Service.*` and `Order.*`: service selection and contractual acceptance

Important restriction:

- do not put nickname, email, or telephone into `Organization.member.*`
- do not put nickname, email, or telephone into `Person.*`

## Mental Model For Frontend Developers

Think in this order:

1. The app has KYC data.
2. The app has editable form fields.
3. Both are converted into final `org.schema` claims.
4. The app can read or override those claims.
5. The request sent to GW CORE already carries the final claims in
   `resource.meta.claims`.

So the frontend does not need to think first about:

- `createIndividualOnboardingFacade()`
- raw `DocumentReference.content[0].attachment.data`
- internal SDK plumbing

It should think first about:

- final onboarding claims
- then the request `Bundle`

## What The Shared Editor Validates Today

The shared editor already exposes:

- `newIndividual.validate()`

Current validation scope:

- required controller nickname rules
- at least one contact channel
- `subjectDateOfBirth` and `controllerDateOfBirth`
  - accepted formats: `YYYY` or `YYYY-MM-DD`
  - future values are rejected
- `docDate`
  - accepted format: `YYYY-MM-DD`
  - future values are rejected
  - non-today values currently raise a warning, not an error
- `serviceProviderDomain`
  - must be a provider base locator without scheme
  - accepted shapes:
    - `service.provider.example`
    - `hosting.example.com/acme-id/cds-es/v1/health-care`

Current non-goals:

- no closed shared enum yet for all supported `serviceProviderDomain` values
- no tenant-specific policy enforcement yet for “docDate must be exactly today”
- no server-side authorization checks in the editor itself

That means production tenants may still apply stricter rules in GW CORE or in
their portal/backend.

## Step 1: Start From The Shared Onboarding Editor

```ts
import { createIndividualOnboardingEditor } from 'gdc-common-utils-ts/utils';

const newIndividual = createIndividualOnboardingEditor()
  .setKyc({
    profile: kycProfile,
    individualAlternateName: 'doraemon',
    individualBirthDate: '1990',
    controllerEmail: 'jane.doe@example.com',
  }, {
    self: false,
    controllerAlternateName: 'controller-visible-name',
  });

const fieldsAfterKyc = newIndividual.getFormFields();
const claimsAfterKyc = newIndividual.buildClaims();
const validationAfterKyc = newIndividual.validate();
```

After this step, the app already has:

- editable onboarding `formFields`
- final `claims` it can inspect and render

For example:

- `claimsAfterKyc['org.schema.Organization.alternateName']`
- `claimsAfterKyc['org.schema.Organization.owner.email']`
- `claimsAfterKyc['org.schema.Person.identifier.value']`

## Step 2: Complete The Missing Form Fields

The same editor continues the wizard flow:

```ts
newIndividual
  .setControllerPhone('+34000000001')
  .setSubjectAlternateName('doraemon')
  .setSubjectPhone('+34000000002')
  .setSubjectBirthDate('1990')
  .setConsentDate('2026-06-09')
  .setServiceProviderDomain('service.provider.example');

const finalFormFields = newIndividual.getFormFields();
const finalClaims = newIndividual.buildClaims();
const finalValidation = newIndividual.validate();
```

This is the recommended frontend/backend editing pattern.

Use `finalValidation` before building the request:

- `finalValidation.ok === true` means there are no current client-side errors
- `finalValidation.warnings` still deserves attention
- `finalValidation.errors` should block the submit button

## Step 3: Manual Merge Is Still Available

If a caller does not want the editor, the lower-level helper still exists:

```ts
import { mergeIndividualOrganizationClaims } from 'gdc-common-utils-ts/utils';

const merged = mergeIndividualOrganizationClaims({
  kyc: {
    profile: kycProfile,
    individualAlternateName: 'doraemon',
    individualBirthDate: '1990',
    controllerEmail: 'jane.doe@example.com',
  },
  formFields: finalFormFields,
});

const sameFinalClaims = merged.claims;
```

Merge rule:

- explicit base claims
- then KYC-derived claims
- then form-derived claims

And only non-empty form values should overwrite previous values.

That means:

- a real form value overrides KYC
- `''` should not wipe a previous valid claim

## Step 4: Read Or Patch The Final Claims

At this point the app can render or patch the final claims before sending the
request:

```ts
const finalClaims = {
  ...finalClaims,
  'org.schema.Organization.owner.alternateName': 'controller-visible-name',
  'org.schema.Organization.owner.telephone': '+34000000001',
  'org.schema.Organization.alternateName': 'doraemon',
};
```

This is the useful frontend level.

The chainable editor above is the preferred helper surface. Any SDK facade
should wrap that editor instead of redefining business rules.

## About `serviceProviderDomain`

`serviceProviderDomain` is the provider base locator selected during
autodiscovery and written into the onboarding form.

It may be:

- a public provider domain:
  - `service.provider.example`
- or a hosted `did:web` base without scheme:
  - `hosting.example.com/acme-id/cds-es/v1/health-care`

The outbox later resolves the corresponding DID document and derives the real
request base URL for operations such as:

- individual onboarding PDF draft
- individual organization registration
- employee bundle submission
- communication to the selected index provider

Current compatibility mapping still copies this value into:

- `org.schema.Service.serviceType`
- `org.schema.Order.orderedItem.serviceType`

Important:

- today there is no shared closed enum of all valid values
- it is not the same thing as `tenantId`
- it is not the same thing as `Service.serviceType` semantics
- it is not the same thing as `Service.additionalType` / purposes
- until this is fully split in the contract, the editor only validates the
  locator shape, not the final routing/business metadata published by the provider

## Step 5: Build The PDF Draft Request

The PDF draft request remains a `DocumentReference` bundle entry, but the
important part is that the final claims are already present:

```ts
import {
  buildIndividualOnboardingPdfDraftRequestBundle,
} from 'gdc-common-utils-ts/utils';

const requestBundle = buildIndividualOnboardingPdfDraftRequestBundle({
  subject: subjectDid,
  contentData: templatePdfBase64,
  contentType: 'application/pdf',
  identifier: 'individual-onboarding-template',
  claims: finalClaims,
});
```

The resulting request entry should look conceptually like this:

- `type = "DocumentReference"`
- `resource.resourceType = "DocumentReference"`
- `resource.meta.claims = finalClaims + document-reference claims`

## Response Contract

GW CORE returns another `DocumentReference`.

The filled PDF travels in:

- `resource.meta.claims[DocumentReferenceClaim.ContentData]`

Not in:

- `resource.content[0].attachment.data`

That FHIR path is only a later projection if another system asks for a FHIR
response shape.

## About SDK Core And SDK Front

`sdk-core` and `sdk-front` may expose nicer helpers for the actor flow, but
those are secondary layers.

The primary contract to understand is still:

1. derive final `IndividualOrganization` claims
2. inspect or patch them
3. send them in `resource.meta.claims`
4. receive the filled PDF as `DocumentReferenceClaim.ContentData`

That is the stable business story the frontend developer should learn first.

## Demo vs Production

Current practical split:

- demo/development:
  - the portal/backend may validate OTP outside GW CORE
  - then submit the final onboarding bundle to GW CORE with the same controller
    `id_token`
  - no real PDF signature is required for that demo path

- production:
  - the authenticated controller session is expected to carry a valid
    end-user `id_token`
  - `controllerEmail` in form fields / final claims should be consistent with
    that authenticated controller identity
  - OTP delivery/verification may still happen in the portal/backend layer, but
    that runtime identity policy must be enforced there explicitly
