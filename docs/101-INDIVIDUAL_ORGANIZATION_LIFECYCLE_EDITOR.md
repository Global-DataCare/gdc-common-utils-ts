# Individual Organization Lifecycle Editor 101

This is the frontend/integrator guide for the shared
`IndividualOrganizationLifecycleDraft`.

Use this when you need to understand:

- how to build the semantic lifecycle input for one hosted
  `individual/org.schema/Organization`
- how to keep business meaning separate from backend plumbing
- how to hand the built value to a lower SDK/runtime layer later

Read in this order:

1. [101-LIFECYCLE.md](./101-LIFECYCLE.md)
2. this file
3. [101-RESOURCE_IDENTIFIER_AND_OPERATIONS.md](./101-RESOURCE_IDENTIFIER_AND_OPERATIONS.md)
   only after you need the lower-level wrapping details

## Goal

For frontend and portal integrations, the important part is not the current GW
route name. The important part is:

- what record is being targeted
- whether the action is `disable` or `purge`
- which claims identify the hosted individual context

The shared draft lets you build that semantic intent first.

## The Draft

Use:

- `IndividualOrganizationLifecycleDraft`

It is a chainable builder for the business input:

- `setClaims(...)`
- `mergeClaims(...)`
- `setIdentifier(...)`
- `setAlternateName(...)`
- `setOwnerEmail(...)`
- `setOperation(...)`
- `setResourceId(...)`

Read those as frontend-friendly setters for semantic data, not transport
envelope setters.

## Recommended Flow

```ts
import {
  ClaimsOrganizationSchemaorg,
} from 'gdc-common-utils-ts/constants/schemaorg';
import {
  EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE,
} from 'gdc-common-utils-ts/examples';
import {
  IndividualOrganizationLifecycleDraft,
  IndividualOrganizationLifecycleOperations,
} from 'gdc-common-utils-ts';

const draft = new IndividualOrganizationLifecycleDraft()
  .setClaims(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims)
  .setIdentifier(
    String(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.identifier]),
  )
  .setAlternateName(
    String(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.alternateName]),
  )
  .setOwnerEmail(
    String(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.ownerEmail]),
  )
  .setOperation(IndividualOrganizationLifecycleOperations.Disable);

const semanticMessage = draft.toSemanticMessage();
```

Read that example as:

- `setIdentifier(...)`
  - the business identifier of the hosted individual/family record
- `setAlternateName(...)`
  - the friendly or route-facing individual label already used by onboarding
- `setOwnerEmail(...)`
  - the owner/controller email already known by the app
- `setOperation(...)`
  - the business action, not the backend request method

## What The Frontend Should Normally Keep

From the semantic message, a frontend usually only cares about:

- which operation was requested
- which record is being targeted
- which values should be shown in confirmation UI

Example:

```ts
semanticMessage.operation;
semanticMessage.claims[ClaimsOrganizationSchemaorg.identifier];
semanticMessage.claims[ClaimsOrganizationSchemaorg.alternateName];
semanticMessage.claims[ClaimsOrganizationSchemaorg.ownerEmail];
```

## What Happens Later

Later, a lower SDK/runtime layer may wrap that semantic draft into the current
GW contract.

That lower-level wrapping is intentionally not the first thing a frontend
developer needs to learn.

When you do need that detail, the same draft can also materialize the current
GW payload shape through:

- `buildCurrentGwDataEntry()`
- `buildCurrentGwPayload()`

Those are mainly for:

- shared tests
- SDK plumbing
- runtime adapters

## Source Of Truth

Code:

- [src/utils/individual-organization-lifecycle.ts](../src/utils/individual-organization-lifecycle.ts)

Examples:

- [src/examples/lifecycle.ts](../src/examples/lifecycle.ts)

Didactic test:

- [__tests__/101-individual-organization-lifecycle.test.ts](../__tests__/101-individual-organization-lifecycle.test.ts)
