# Related Person Editor 101

This is the frontend/integrator guide for subject-side relationship records.

Use this when you need to understand:

- how to think about a `RelatedPerson` from the frontend
- how to prepare one create/update bundle payload
- how to think about disable separately from create/update
- where to look for the lower-level operation wrapping only when you really
  need it

Read in this order:

1. [101-LIFECYCLE.md](./101-LIFECYCLE.md)
2. this file
3. [101-RESOURCE_IDENTIFIER_AND_OPERATIONS.md](./101-RESOURCE_IDENTIFIER_AND_OPERATIONS.md)
   only after you need the lower-level wrapping details

## What This Domain Is

`RelatedPerson` is for subject-side relationship data such as:

- caregiver
- guardian
- grandparent
- emergency contact

It is not the same thing as:

- employee lifecycle
- individual organization lifecycle
- consent lifecycle

Keep those domains separate in the UI and in the mental model.

## Frontend Path

The intended path for a frontend is:

1. gather or edit the relationship data
2. build one semantic bundle payload for create/update
3. hand that payload to a lower SDK/runtime/backend layer
4. let that lower layer encapsulate/sign/submit it
5. read the returned bundle or operation result later with shared readers

The frontend usually does **not** need to start from:

- `/_batch`
- `request.method`
- `meta.claims`
- `resource.meta.status`

Those are lower-level transport or runtime details.

## Readback For Lists

When the UI later receives search/list results, use:

- `readRelatedPersonListRecords(...)`
- `findRelatedPersonListRecord(...)`

That keeps mixed wrapper details out of the screen code and gives one neutral
row shape with:

- business identifier
- linked subject
- relationship
- contact value
- active flag
- lifecycle status
- internal resource id when present

## Create/Update Example

For create/update, the shared canonical example lives in:

- [src/examples/related-person.ts](../src/examples/related-person.ts)

Example:

```ts
import { cloneExample } from 'gdc-common-utils-ts/examples';
import * as relatedPersonExamples from 'gdc-common-utils-ts/examples/related-person';

const relatedPersonPayload = cloneExample(
  relatedPersonExamples.EXAMPLE_RELATED_PERSON_UPSERT_BUNDLE_PAYLOAD,
);
```

Read that as:

- one bundle payload
- one relationship record entry
- semantic relationship content prepared locally
- ready for the next SDK/runtime layer to wrap or submit

## Disable Example

Disable is a different concern from create/update.

The frontend should usually think of it as:

- "disable this subject-side relationship"

not as:

- "build a low-level lifecycle resource by hand"

The shared semantic example source lives in:

- [src/examples/related-person.ts](../src/examples/related-person.ts)

Look at:

- `EXAMPLE_RELATED_PERSON_DISABLE_INPUT`
- `EXAMPLE_RELATED_PERSON_DISABLE_LIFECYCLE_RESOURCE`
- `EXAMPLE_RELATED_PERSON_DISABLE_BUNDLE_ENTRY`

The first value is the semantic input.
The later values show how that semantic intent is normalized for shared
runtime/SDK layers.

## What The Frontend Should Usually Keep

A frontend usually cares about:

- who the related person is
- what relationship they have with the subject
- whether the record is active/disabled in business terms
- what identifier to keep in the UI for later actions

It usually does not need to care first about:

- internal resource ids
- current GW route names
- exact entry request methods

## Where To See It Working

Executable teaching references:

- [__tests__/101-interoperable-resource-operation.test.ts](../__tests__/101-interoperable-resource-operation.test.ts)
  - shows the identifier-first disable contract
- [__tests__/101-related-person-list-reader.test.ts](../__tests__/101-related-person-list-reader.test.ts)
  - shows how one frontend can read returned related-person rows back into a list
- [src/examples/related-person.ts](../src/examples/related-person.ts)
  - shared create/update and disable fixtures

If you later need the runtime-oriented wrapping details, continue with:

- [101-RESOURCE_IDENTIFIER_AND_OPERATIONS.md](./101-RESOURCE_IDENTIFIER_AND_OPERATIONS.md)
