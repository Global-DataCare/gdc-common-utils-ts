# Individual Onboarding PDF Request 101

This document explains the canonical request shape for the individual
controller flow that asks GW CORE to prepare an onboarding PDF draft.

Current scope:

- individual controller only
- one PDF per request
- payload contract is claims-first
- the request and response resource is `DocumentReference`
- the PDF travels as a `DocumentReference` entry inside a `Bundle`

Do not start from DIDComm attachments for this flow.

The business payload is the bundle below. Another layer may later transport it
through DIDComm, FAPI, polling, or plain HTTP.

## What The Frontend Already Has

The frontend screen usually has:

- `id_token`
- route context:
  - `tenantId`
  - `jurisdiction`
  - `sector`
- `kyc`
- `formFields`
- `template`

The frontend does not need to hand-build raw
`DocumentReference.content[0].attachment.data`.

Use the shared onboarding facade and builders instead.

`BundleEditor` can also carry this request shape, but the preferred starting
point for new frontend code is the onboarding helper surface because it is
already wired to the individual-controller semantics.

## Canonical Output

The canonical PDF container is:

- `Bundle`
- `body.data[0]`
- `type = "DocumentReference"`
- `resource.resourceType = "DocumentReference"`
- `resource.meta.claims[DocumentReferenceClaim.ContentData] = <pdf base64>`

The same `DocumentReference` contract is used:

- in the request route
- in the response route
- in later optional FHIR projection

Important:

- base64 belongs in `DocumentReferenceClaim.ContentData`
- `resource.content[0].attachment.data` is only a later FHIR projection

## Lowest-Friction Frontend Path

```ts
import { createIndividualOnboardingFacade } from 'gdc-sdk-core-ts';
import {
  EXAMPLE_CONSENT_ATTACHMENT_DATA_BASE64,
  EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_SUBJECT_DID,
} from 'gdc-common-utils-ts/examples';

const onboarding = createIndividualOnboardingFacade();

const requestBundle = onboarding.buildPdfDraftRequestBundle({
  subject: EXAMPLE_SUBJECT_DID,
  contentData: EXAMPLE_CONSENT_ATTACHMENT_DATA_BASE64,
  identifier: EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  contentType: EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
});
```

`requestBundle` is the business payload that the individual-controller route
should send to GW CORE for the onboarding PDF draft operation.

Canonical route:

- `POST /{tenantId}/cds-{jurisdiction}/v1/{sector}/individual/pdf/DocumentReference/_create`

## If You Really Need The Generic BundleEditor

This is valid, but lower-level:

```ts
import { BundleEditor } from 'gdc-sdk-core-ts';
import { ResourceTypesFhirR4 } from 'gdc-common-utils-ts/constants';
import { DocumentReferenceClaim } from 'gdc-common-utils-ts/models/interoperable-claims/document-reference-claims';

const bundle = new BundleEditor()
  .setBundleOperation('create')
  .setAllowedResourceType(ResourceTypesFhirR4.DocumentReference);

bundle
  .newEntry()
  .setClaim(DocumentReferenceClaim.Subject, subjectDid)
  .setClaim(DocumentReferenceClaim.ContentData, pdfBase64)
  .setClaim(DocumentReferenceClaim.ContentType, 'application/pdf')
  .doneEntry();

const genericRequestBundle = bundle.buildJsonApi();
```

Prefer the onboarding-specific helper unless you are extending a generic bundle
authoring screen.

## When KYC And Form Fields Are Also Needed

Use the facade draft flow first:

```ts
import { createIndividualOnboardingFacade } from 'gdc-sdk-core-ts';

const onboarding = createIndividualOnboardingFacade();

const draft = onboarding.buildDraft({
  kyc,
  formFields,
  template,
  pdf: {
    subject: subjectDid,
    contentData: pdfBase64,
    identifier: documentIdentifier,
    contentType: 'application/pdf',
  },
});
```

This returns:

- `draft.formFields`
- `draft.claims`
- `draft.documentReference`
- `draft.data`
- `draft.bundle`
- `draft.validation`

## Why This Is Wired Only To The Individual Controller

This helper is intentionally specific to the current actor:

- individual controller onboarding PDF

Future flows should use separate helpers, for example:

- legal-organization controller onboarding PDF

Do not overload the same helper with different actor semantics.
