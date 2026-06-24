# VP Token 101

This guide explains the high-level controller/legal-onboarding flow for one
`vp_token`.

Start from the integrator view:

1. create one signer for the controller side
2. assemble the VP payload with the ICA-issued credentials
3. prepare the exact signing bytes
4. let the wallet/KMS sign those bytes
5. compact the final `vp_token`

If you need lower-level JOSE details, those helpers still exist, but they are
not the main 101 entry point.

Related guide:

- [`101-ID_TOKEN.md`](./101-ID_TOKEN.md) for identity-authenticated `id_token`

## Quick summary

Create one signer:

```ts
const signer = await createJwtSigner({
  alg: 'ES384',
  seed: 'organization-controller-seed-001', // optional
  purpose: 'organization-controller',
});
```

Key-id rule:

- `getKid()` always returns the RFC 9278 JWK thumbprint URI
- the compact VP header uses that same thumbprint URI as `kid`

Then assemble the VP payload:

```ts
const vpPayload = createVP({
  iss: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
  sub: EXAMPLE_ORGANIZATION_TAX_ID,
  aud: EXAMPLE_PRESENTATION_AUDIENCE_HOST_ID,
});

addOrganizationCredential(
  vpPayload,
  EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL,
);
addLegalRepresentativeCredential(
  vpPayload,
  EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL,
);
```

Prepare the signing input:

```ts
const prepared = signer.prepareJwt({
  payload: vpPayload,
  header: {
    kid: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
  },
});
```

And compact the final JWT after the external signer returns the detached
signature:

```ts
const vpToken = signer.buildCompact(
  'external-kms-signature-base64url',
  prepared,
);
```

The executable didactic tests live in:

- [`__tests__/101-vp-token.test.ts`](../__tests__/101-vp-token.test.ts)
- [`__tests__/101-deterministic-signers.test.ts`](../__tests__/101-deterministic-signers.test.ts)

## Which credentials belong inside the VP

For legal organization onboarding, the current baseline is:

1. organization credential
2. legal representative credential

Those shared synthetic examples already exist in:

- [`src/examples/ica-activation-proof.ts`](../src/examples/ica-activation-proof.ts)

This 101 assumes the VCs already exist. It does not issue them.

## Deterministic vs random

The signer contract is the same as for `id_token`:

- `seed` present => deterministic signer
- `seed` absent => random signer

That makes the same high-level API usable for:

- reproducible tests
- local demos
- real wallet/BFF preparation code

## Supported signer families

The VP flow can use:

- classical EC:
  - `ES384`
  - `ES256K`
- post-quantum:
  - `ML-DSA-44`
  - `ML-DSA-65`
  - `ML-DSA-87`

For post-quantum, provide the shared cryptography engine:

```ts
const signer = await createJwtSigner({
  alg: 'ML-DSA-44',
  purpose: 'organization-controller',
  seed: 'pq-controller-seed-001',
  cryptography,
});
```

## What is intentionally low-level and not 101

These remain valid shared helpers, but they are plumbing:

- `createVP(...)`
- `addOrganizationCredential(...)`
- `addLegalRepresentativeCredential(...)`
- `prepareForSignature(...)`
- `prepareBytesForSignature(...)`
- `buildVpTokenCompact(...)`

Use them when you need direct control. Use `createJwtSigner(...)` plus the VP
payload helpers when teaching or integrating the end-to-end proof flow.
