# ID Token 101

> 101 note
> - Teach here: the highest-level public `common-utils` helper available for this topic.
> - Do not present raw `meta.claims`, `upsert*`, or pack/unpack as the main path unless the topic itself is transport.
> - Read [101-README.md](./101-README.md) for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.


This guide explains the high-level flow an integrator actually cares about:

1. create one signer
2. inspect its public identity material
3. prepare one `id_token` signing input
4. let a KMS/HSM/BFF signer sign it
5. assemble the final compact token

If you are looking for low-level JOSE plumbing, that exists too, but it is not
the starting point. Start from `createJwtSigner(...)`.

Related guide:

- [`101-VP_TOKEN.md`](./101-VP_TOKEN.md) for legal-onboarding `vp_token`

References:

- RFC 7515, JSON Web Signature (JWS)
- RFC 7517, JSON Web Key (JWK)
- RFC 7519, JSON Web Token (JWT)
- RFC 7638, JSON Web Key Thumbprint
- RFC 9278, JWK Thumbprint URI
- OpenID Connect Core 1.0

## Quick summary

Use the high-level façade:

```ts
const signer = await createJwtSigner({
  alg: 'ES384',
  seed: 'demo-bff-seed-001', // optional
  purpose: 'virtual-bff',
});
```

Contract:

- `seed` present => deterministic signer
- `seed` absent => random signer

Then:

```ts
const publicJwk = signer.getPublicJwk();
const kid = signer.getKid();
const thumbprint = signer.getThumbprint();
const thumbprintUri = signer.getThumbprintUri();

const prepared = signer.prepareJwt({
  payload: {
    iss: 'did:web:bff.example.org',
    sub: 'controller-sub-001',
    aud: 'gw-production',
    email: 'controller@example.org',
    email_verified: true,
    iat: 1782296400,
    exp: 1782297000,
  },
});

const compact = signer.buildCompact(
  'external-signature-base64url',
  prepared,
);
```

Key-id rule:

- `getKid()` always returns the RFC 9278 JWK thumbprint URI
- this high-level API does not expose arbitrary `kid` aliases
- the prepared JWT header uses that same thumbprint URI as `kid`

The executable didactic tests live in:

- [`__tests__/101-id-token.test.ts`](../__tests__/101-id-token.test.ts)
- [`__tests__/101-deterministic-signers.test.ts`](../__tests__/101-deterministic-signers.test.ts)

## Demo vs production

### Demo/local

Use the same signer façade, but ask it for an unsigned shell:

```ts
const demoToken = signer.buildUnsignedJwt({
  iss: 'did:web:demo-bff.example.org',
  sub: 'controller-sub-001',
  aud: 'gw-local-demo',
  email: 'controller@example.org',
});
```

This returns:

- `base64url(header).base64url(payload).`

The signature part is intentionally empty.

### Production

Use:

- `signer.prepareJwt(...)`
- your real KMS/HSM/BFF signing step
- `signer.buildCompact(...)`

The helper deliberately does not pretend to be the external signer. It prepares
the exact bytes that signer must sign.

## Supported signer families

`createJwtSigner(...)` is intentionally high-level, but not magic. The key
family still matters:

- classical EC signers:
  - `ES384`
  - `ES256K`
- post-quantum signers:
  - `ML-DSA-44`
  - `ML-DSA-65`
  - `ML-DSA-87`

For post-quantum creation, pass the shared cryptography engine:

```ts
const signer = await createJwtSigner({
  alg: 'ML-DSA-44',
  purpose: 'virtual-bff',
  seed: 'pq-demo-seed-001',
  cryptography,
});
```

## What is intentionally low-level and not 101

These are still valid shared helpers, but they are plumbing, not the main 101
entry point:

- `deriveDeterministicEcJwkPair(...)`
- `prepareJwtForSignature(...)`
- `prepareJwtBytesForSignature(...)`
- `buildJwtCompact(...)`

Use those when you need lower-level control. Start from `createJwtSigner(...)`
when teaching or integrating.
