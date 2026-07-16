# Related Person Editor 101

> 101 note
> - Teach here: the highest-level public `common-utils` helper available for this topic.
> - Do not present raw `meta.claims`, `upsert*`, or pack/unpack as the main path unless the topic itself is transport.
> - Read [101-README.md](./101-README.md) for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.


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

## Related Entity Projection

UNID contact and permission screens may use the RelatedPerson lifecycle
container as a related-entity projection. The current demonstrable kinds are:

- a person or professional
- one organization, department, consultation or office

`RelatedPerson.related-entity-type` records the logical kind.
`RelatedPerson.actor-identifier` retains the original public values used by a
Consent rule, such as an email, `tel:+...`, organization `did:web` or other
public identifier. The opaque resource id is used for internal references but
must not replace those public values because the blockchain rule asset id must
remain independently reproducible.

A future set of countries for role-scoped emergency permissions is a SOSChain
flow. It is a country set, not a FHIR Group, and is not part of the current
person/organization demonstration.

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
- optional functional roles
- contact value
- active flag
- lifecycle status
- internal resource id when present

## Create/Update Example

For create/update, the shared canonical example lives in:

- [src/examples/related-person.ts](../src/examples/related-person.ts)

Example:

```ts
import {
  EXAMPLE_BUNDLE_TYPE_BATCH,
  EXAMPLE_INTEROPERABLE_CONTEXT_FHIR_API,
  EXAMPLE_RELATED_PERSON_ROLE,
  InteroperableOperationMethods,
  RelatedPersonClaim,
  ResourceTypesFhirR4,
  setRelatedPersonActive,
  setRelatedPersonIdentifier,
} from 'gdc-common-utils-ts';

const relatedPersonIdentifier = draft.identifier;
const relatedPersonDisplayName = draft.name;
const relatedPersonTelecom = `mailto:${draft.email}`;

let relatedPersonClaims = {
  '@context': EXAMPLE_INTEROPERABLE_CONTEXT_FHIR_API,
};

relatedPersonClaims = setRelatedPersonIdentifier(
  relatedPersonClaims,
  relatedPersonIdentifier,
);
relatedPersonClaims = setRelatedPersonActive(relatedPersonClaims, true);
relatedPersonClaims = {
  ...relatedPersonClaims,
  [RelatedPersonClaim.Patient]: subjectDid,
  [RelatedPersonClaim.Relationship]: EXAMPLE_RELATED_PERSON_ROLE,
  [RelatedPersonClaim.Name]: relatedPersonDisplayName,
  [RelatedPersonClaim.Telecom]: relatedPersonTelecom,
};

const relatedPersonPayload = {
  resourceType: ResourceTypesFhirR4.Bundle,
  type: EXAMPLE_BUNDLE_TYPE_BATCH,
  entry: [{
    request: { method: InteroperableOperationMethods.Post },
    resource: {
      resourceType: ResourceTypesFhirR4.RelatedPerson,
      meta: { claims: relatedPersonClaims },
    },
  }],
};
```

Read that as:

- one bundle payload
- one relationship record entry
- semantic relationship content prepared locally
- ready for the next SDK/runtime layer to wrap or submit

The important teaching point is not the fixture itself. It is the sequence:

1. start one claims object
2. apply shared `get/set` helpers for canonical fields
3. add the remaining semantic relationship values
4. place those claims into one `RelatedPerson` bundle entry
5. pass that payload to the next runtime/backend layer

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

### Relationship is not permission

Keep three concepts separate in every editor and payload:

1. `RelatedPerson.relationship` answers who the related entity is to the
   subject. For an individual-organization member selector use `FAMMEMB` as the
   neutral fallback or one of `WIFE`, `HUSB`, `DOMPART`, `SIS`, `BRO`, `SON`,
   `DAU`, `PRN`, `GRPRN`, `GRNDCHILD`, `GGRPRN`, `FRND`, `NBOR`, `ROOM`.
2. `RelatedPerson.role` is a GDC flat-claim extension, not a native FHIR R4
   property. It may contain comma-separated functional codes represented as an
   array by UI code. `CAREGIVER`, `ECON` and `DEPEN` are current RoleClass
   values; `BILL` and `POWATT` are RoleCode values. `POWATT` is only valid when
   a real power of attorney exists and must not be inferred merely because
   someone is a controller.
3. Consent/access says what that related entity may do. Never store the access
   decision `PERMITTED` as an HL7 relationship.

`DEPEN` is active in `v3-RoleClass` and included by the current FHIR
RelatedPerson relationship ValueSet; the same code is retired only in the
different `v3-RoleCode` system. Its definition still concerns dependency under
a policy or program. Use `GGRPRN` for a gender-neutral great-grandparent;
`GGRFTH` specifically means great-grandfather.

It usually does not need to care first about:

- internal resource ids
- current GW route names
- exact entry request methods

## Readback Example

When one list/search response comes back, read it into UI-neutral rows first.

```ts
import {
  findRelatedPersonListRecord,
  readRelatedPersonListRecords,
} from 'gdc-common-utils-ts';

const records = readRelatedPersonListRecords(responseBody);
const activeRecords = records.filter((record) => record.active === 'true');
const selectedRecord = findRelatedPersonListRecord(responseBody, 'rel-001');

console.log(activeRecords[0]?.name);
console.log(selectedRecord?.telecom);
```

That keeps the component code focused on:

- display name
- relationship
- contact value
- active/inactive state
- business identifier kept for later disable or purge actions

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
