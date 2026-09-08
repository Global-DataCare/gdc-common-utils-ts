# Subject identity audit contract

## Audited boundary

The neutral Subject collection associates a private semantic identity with one
stable public unified card. Supported identity resources are `Person` and
`Animal`; `Place` is reserved for future property health/history use.

## Data placement

| Data | Placement | Public |
|---|---|---:|
| Complete Person/Animal claims | Encrypted tenant Subject collection | No |
| Protected database search attributes | Configured protected index | No |
| SHA3-384 multihash of `type|jurisdiction-or-empty|value` | Fabric lookup key | Yes |
| Index provider `did:web` | Fabric payload | Yes |
| Stable unified card identifier | Encrypted provider index | No |
| Provider code or duplicated discovery domain | Not stored | No |
| Raw identifier value | Never in Fabric payload/event | No |
| PDQm input `Patient` | Authenticated provider request | No |

## Required evidence

An implementation is conformant only when tests prove:

1. Person and Animal entries keep their semantic resource types.
2. `sameAs` equals the stable public card identifier.
3. Asset derivation is deterministic over the exact documented token.
4. Ledger payloads contain only `indexProviderDid` and no card or raw code value.
5. Current-state deletion prevents subsequent lookup.
6. Provider discovery does not bypass authentication or Consent checks on the
   subsequent PDQm `POST Patient/$match` request.
7. Logs, errors and events redact private identifier values.
8. The Fabric opaque key is not forwarded to the provider; the authenticated
   request contains one FHIR `Parameters` resource and the response is a FHIR
   search `Bundle`.

## Compatibility finding

The earlier convention that stored identifier-derived aliases in
`Organization.sameAs` is legacy. New implementations must derive lookup keys
from identity claims and reserve `sameAs` for the public card association.
