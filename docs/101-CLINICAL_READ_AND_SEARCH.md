# Clinical Read And Search 101

This is the frontend/integrator guide for the most common read-side clinical
flows.

Use this when you need to understand:

- how a frontend asks for an IPS summary or filtered sections
- how a frontend builds a communication-attached bundle for clinical content
- how the shared helpers hide the lower-level search/reference wiring

Read in this order:

1. [101-LIFECYCLE.md](./101-LIFECYCLE.md)
2. this file
3. [101-COMMUNICATION_LAYERING.md](./101-COMMUNICATION_LAYERING.md)
   if you need to understand why `Communication` appears in the flow

## Two Common Frontend Jobs

The two read-side jobs most frontends need are:

1. request or reconstruct an IPS summary
2. build or inspect one clinical bundle carried in `Communication`

## IPS Summary Search

The shortest teaching reference is:

- [__tests__/101-communication-search-reference.test.ts](../__tests__/101-communication-search-reference.test.ts)

That test shows the intended frontend path:

1. the app knows the subject
2. the app knows the requester
3. the app asks the shared helper to build the IPS summary request
4. the helper hides the internal flattening of Parameters into a search reference

The important frontend concept is:

- "request IPS for this subject, maybe with section filters"

not:

- "manually compose the internal `_search` reference string"

## Clinical Bundle Editing

The shortest teaching reference is:

- [__tests__/101-ips-bundle-editor.test.ts](../__tests__/101-ips-bundle-editor.test.ts)

That test shows the intended editor path:

1. create a communication-attached bundle session
2. build one medication statement with semantic setters
3. upsert it into the bundle
4. save and release the entry
5. later inspect the carried bundle content

This is the same broad pattern as other frontend flows:

- semantic editing first
- lower-level transport later

## What The Frontend Usually Needs To Keep

A frontend usually cares about:

- subject
- requester
- section filters
- which entries exist in the returned bundle
- how to show medication/clinical summaries in UI

It usually does not need to start from:

- raw querystring assembly
- internal `_search` path generation
- backend route wiring

## Related Shared Material

- [101-IPS_BUNDLE.md](./101-IPS_BUNDLE.md)
- [101-VITAL_SIGN_ENTRY_EDITOR.md](./101-VITAL_SIGN_ENTRY_EDITOR.md)
- [101-BUNDLE_EDITOR_READER.md](./101-BUNDLE_EDITOR_READER.md)
