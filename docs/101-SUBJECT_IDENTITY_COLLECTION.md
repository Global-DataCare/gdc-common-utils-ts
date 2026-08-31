# 101: Private identities and one public unified card

## The idea

`Subject` is a collection, not a replacement for `Person` or `Animal`.
Different identity records can describe the same subject and point to the same
stable public card:

```text
Person (national ID) ---sameAs---+
Person (health ID) -----sameAs---+--> public unified card
Animal (microchip) -----sameAs---+
```

Each identity remains a semantic resource inside a `Bundle`. Its private
identifier type, jurisdiction and value live in `resource.meta.claims`. The collection
can therefore encrypt and index the complete entry without exposing the raw
identifier in Fabric.

## Write one identity

```ts
import { buildSubjectIdentityBundleEntry } from
  'gdc-common-utils-ts/utils/subject-identity';
import { EXAMPLE_ANIMAL_CARD_URI } from
  'gdc-common-utils-ts/examples/shared';

const microchipIdentity = buildSubjectIdentityBundleEntry({
  subjectKind: 'animal',
  cardId: EXAMPLE_ANIMAL_CARD_URI,
  codingSystem: 'urn:iso:std:iso:11784-11785',
  jurisdiction: '', // global lookup keeps the middle component explicitly empty
  codeValue: '981020000123456',
});
```

The result is an `Animal` entry whose `org.schema.Animal.sameAs` is the public
card. For a human the same helper creates `Person` claims. `Place` is reserved
for a future property/building health profile.

## Distributed lookup

The public lookup key is:

```text
urn:multibase:<SHA3-384-multihash(type|jurisdiction-or-empty|value)>
```

Fabric may return the stable card identifier and the provider/index service.
Possession of that exact identifier enables discovery; it never grants access
to the card's protected contents. Consent, authentication and purpose checks
remain separate.

## Privacy and audit invariants

- Never place the raw code value, email, telephone, DIDComm token or tenant
  secret in a ledger payload or event.
- Treat `sameAs` as the stable public card link, not as the private identifier
  hash.
- Reuse the existing human `type|jurisdiction|value` canonicalization. For a
  globally readable microchip, keep the empty jurisdiction explicitly as
  `urn:iso:std:iso:11784-11785||981020000123456`.
- Store semantic resources and all claims in encrypted tenant storage.
- Index only through the configured protected-index adapter.
- A ledger deletion removes current resolution; immutable transaction history
  remains an audit fact and must not contain the raw identifier.
- A successful lookup identifies where a card can be found, not who may read
  it.

Executable coverage lives in
[`__tests__/subject-identity.test.ts`](../__tests__/subject-identity.test.ts).
