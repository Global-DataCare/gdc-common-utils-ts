# TODO - Bundle Change MVP

Authoritative plan: `../gdc-sdk-core-ts/docs/MVP_BUNDLE_CHANGE_RECONCILIATION_PLAN.md`.

## P0 - Before shared runtime changes

- [ ] Add JSDoc to `BundleEditor` stating that it builds only the current
  `changesBundle`; it never owns or updates a frontend display copy.
- [ ] Add a 101 test proving that a local/display Bundle and the one-or-many
  resource changes Bundle remain separate objects.
- [ ] Keep typed Consent, RelatedPerson and clinical editors compatible; do
  not introduce per-resource public `upsert*` authoring APIs.
- [ ] Document stable identifier requirements used later to correlate a GW
  response with submitted new/modified resources.

