# ID Token 101

This document explains the canonical step-by-step flow for building the
compact `id_token` used by frontend/BFF/native identity-authenticated flows.

Use this guide when you need to answer:

- which claims belong in the token
- what exactly gets signed
- how to prepare the external KMS/HSM signing bytes
- how to assemble the final compact `header.payload.signature` string
- how this differs from the `vp_token` proof flow

References:

- RFC 7515, JSON Web Signature (JWS)
- RFC 7519, JSON Web Token (JWT)
- OpenID Connect Core 1.0
- RFC 5322, email address syntax (referenced by the common `email` claim)

## Quick summary

For identity-authenticated controller/BFF flows, the sequence is:

1. Decide whether you are in:
   - `demo/local`: unsigned compact JWT shell is acceptable
   - `production`: external signing by KMS/HSM/trusted issuer is required
2. Build the protected header:
   - `alg`
   - `typ: JWT`
   - `kid`
3. Build the payload with at least:
   - `iss`
   - `sub`
   - `aud`
   - `exp`
   - `iat`
   - `email`
4. Prepare the canonical compact signing input:
   - `prepareJwtForSignature(...)`
   - `prepareJwtBytesForSignature(...)`
5. Ask the external signer to sign those exact bytes.
6. Assemble the final token with `buildJwtCompact(...)`.

The executable didactic test lives in:

- [`__tests__/101-id-token.test.ts`](../__tests__/101-id-token.test.ts)

## Demo vs production

### Demo/local

Use:

- `buildUnsignedJwt(...)`

This produces:

- `base64url(header).base64url(payload).`

The signature part is intentionally empty, which is useful for:

- local demos
- Expo/native prototyping
- backend smoke tests when the runtime explicitly allows insecure bearer mode

### Production

Use:

- `prepareJwtForSignature(...)`
- `prepareJwtBytesForSignature(...)`
- `buildJwtCompact(...)`

The caller is responsible for the real signature step, typically through:

- an HSM
- a cloud KMS
- a trusted backend signer
- an external OIDC / OpenID Connect issuer

## Relationship with `vp_token`

Do not confuse the two proof types:

- `vp_token`
  proves business/legal onboarding evidence, often coming from ICA-backed VC
  material and signed by the organization/controller side
- `id_token`
  proves authenticated identity claims such as `email`, normally signed by a
  trusted issuer or trusted backend/BFF identity plane

They both use compact JOSE/JWT mechanics, but they belong to different trust
planes.

## Shared helpers

The common-utils package now exposes these JWT helpers:

- `buildUnsignedJwt(...)`
- `prepareJwtForSignature(...)`
- `prepareJwtBytesForSignature(...)`
- `buildJwtCompact(...)`

And the equivalent `vp_token`-specific helpers remain available in:

- [`docs/101-VP_TOKEN.md`](./101-VP_TOKEN.md)

