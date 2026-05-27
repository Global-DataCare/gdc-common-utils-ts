# VP Token 101

This document explains the canonical step-by-step flow for building the
`vp_token` used by ICA/GW bootstrap flows.

Use this guide when you need to answer:

- which VC artifacts belong inside the proof
- how to assemble the VP payload
- what exactly gets signed
- how to obtain the compact `header.payload.signature` string
- which SDK field receives that string afterwards

## 0. Security planes

Do not mix these planes when reading or documenting the flow:

- transport plane: deployment-specific channel protection such as mTLS,
  gateway policy, or session auth
- identity/business plane: controller, member, or software/runtime proof
  carried through VC and `vp_token`
- operator/hosting plane: host onboarding routing, trust-network selection,
  and node/operator lifecycle

This document only explains the identity/business proof construction for
`vp_token`.

## 1. What the runtime expects

For legal-organization activation, the Node SDK expects a compact proof string:

- SDK input field: `input.vpToken`
- GW payload field: `body.vp_token`

This is the canonical proof carrier.

Do not pass:

- the organization VC alone
- the representative VC alone
- the DID document alone
- a local database wrapper object that contains several onboarding artifacts

The runtime wants the final compact VP token string.

## 2. Which VCs go into the VP

For the current ICA activation baseline, the VP normally contains:

1. the organization credential
2. the legal representative credential

Shared synthetic examples already exist in:

- [`src/examples/ica-activation-proof.ts`](../src/examples/ica-activation-proof.ts)

This guide assumes the VC artifacts already exist.

It does not create or issue VCs.

Your app/runtime should receive or load existing VC JWTs such as:

- `organizationCredentialJwt`
- `legalRepresentativeCredentialJwt`
- `softwareApplicationCredentialJwt`

depending on the flow being assembled.

For a software/runtime proof:

- the VP should carry the already-issued software/runtime VC from ICA
- the SDK/app should not fabricate that VC locally
- the app may still be responsible for assembling the VP and producing the
  compact `vp_token` string from that existing VC
- the incoming VC may already be:
  - a compact JWT/JWS string
  - a raw JSON string
  - a JSON object that your app loaded from storage or an ICA response

Current helper rule:

- `addVC(...)` and the typed helpers accept all three forms above
- compact JWT/JWS inputs are stored as strings inside `vp.verifiableCredential[]`
- JSON object inputs are stored as JSON objects inside `vp.verifiableCredential[]`
- raw JSON string inputs remain valid for compatibility

Helpers and constants used by the flow live in:

- [`src/utils/vp-token.ts`](../src/utils/vp-token.ts)
- [`src/constants/verifiable-credentials.ts`](../src/constants/verifiable-credentials.ts)

## 3. Build the VP payload

Start from `createVP(...)`, then add the VCs.

```ts
import {
  addLegalRepresentativeCredential,
  addOrganizationCredential,
  createVP,
} from 'gdc-common-utils-ts';

const vpPayload = createVP({
  iss: vpIssuerDid,
  sub: vpSubjectDid,
  aud: vpAudienceDid,
});

addOrganizationCredential(vpPayload, organizationCredentialJwt);
addLegalRepresentativeCredential(vpPayload, legalRepresentativeCredentialJwt);
```

At this point:

- `vpPayload.vp.verifiableCredential[]` contains the appended credentials
- the payload already includes `jti`, `nonce`, `iat`, and `exp` defaults unless
  you override them

If your VC arrives as a JSON object instead of a compact JWT/JWS string:

```ts
addVC(vpPayload, softwareApplicationCredentialJson);
```

If your flow still persists JSON credentials as strings, that remains valid:

```ts
addVC(vpPayload, JSON.stringify(softwareApplicationCredentialJson));
```

Downstream VP decoding supports:

- compact VC strings
- raw JSON VC strings
- direct VC objects

## 4. Prepare the bytes that must be signed

The VP token is a compact JWS/JWT-like string.

That means you do not sign the raw JSON directly. You sign:

- `base64url(header) + "." + base64url(payload)`

Use the helper:

```ts
import { prepareForSignature } from 'gdc-common-utils-ts';

const controllerSigningKeyId = 'did:web:controller.example.org#signing-key-1';

const header = {
  alg: signatureAlg,
  typ: 'JWT',
  kid: controllerSigningKeyId,
};

const prepared = prepareForSignature(header, vpPayload);

console.log(prepared.encodedHeader);
console.log(prepared.encodedPayload);
console.log(prepared.signingInput);
```

If your signer expects raw bytes instead of a string:

```ts
import { prepareBytesForSignature } from 'gdc-common-utils-ts';

const signingBytes = prepareBytesForSignature(header, vpPayload);
```

The `kid` always identifies the signing key used by the current presenter.

That presenter changes by flow:

- legal organization onboarding normally uses a controller-side signing key
- software/runtime trust flows normally use a runtime or device signing key

Recommended variable names:

- `controllerSigningKeyId` for legal onboarding
- `runtimeSigningKeyId` for software/runtime trust flows

## 5. Sign externally

The actual signature step depends on your signer:

- browser wallet
- backend HSM
- mobile secure enclave
- mocked signer in tests

The helper layer intentionally stops before performing the cryptographic
signature so the same payload-building code works across runtimes.

Signing responsibility:

- the SDK/helper layer builds the canonical VP payload
- the SDK/helper layer prepares the exact signing input
- the integrator signs that input with the active presenter key
- the SDK/helper layer does not require local custody of the private key

You must obtain:

- `signatureBase64Url`

Example placeholder:

```ts
const signatureBase64Url = await externalSigner.signBase64Url(prepared.signingInput);
```

## 6. Build the final compact token

Once you have:

- `encodedHeader`
- `encodedPayload`
- `signatureBase64Url`

build the final compact token:

```ts
import { buildVpTokenCompact } from 'gdc-common-utils-ts';

const vpToken = buildVpTokenCompact(
  prepared.encodedHeader,
  prepared.encodedPayload,
  signatureBase64Url,
);
```

Result:

- `vpToken === "header.payload.signature"`

That string is the artifact you persist when you want the final canonical proof.

## 7. Pass it to the SDK

The Node SDK activation call expects exactly that compact string:

```ts
await professionalSdk.activateOrganizationInGatewayFromIcaProof(
  hostOnboardingRoute,
  {
    vpToken,
    controller: controllerBinding,
    service,
    additionalClaims,
  },
);
```

The runtime forwards it as:

```json
{
  "body": {
    "vp_token": "<header.payload.signature>"
  }
}
```

## 8. Extract credentials back from a VP token

When the flow only gives you `vp_token`, use the extraction helpers:

```ts
import {
  getLegalRepresentativeCredentialFromVpToken,
  getOrganizationCredentialFromVpToken,
  getVpCredentials,
} from 'gdc-common-utils-ts';

const allCredentials = getVpCredentials(vpToken);
const organizationCredential = getOrganizationCredentialFromVpToken(vpToken);
const legalRepresentativeCredential = getLegalRepresentativeCredentialFromVpToken(vpToken);
```

## 9. Minimal end-to-end examples

### 9.1 Legal organization activation proof

```ts
import {
  EXAMPLE_ICA_VP_AUDIENCE_DID,
  EXAMPLE_ICA_VP_ISSUER_DID,
  addLegalRepresentativeCredential,
  addOrganizationCredential,
  buildVpTokenCompact,
  createVP,
  EXAMPLE_ICA_LEGAL_REPRESENTATIVE_CREDENTIAL,
  EXAMPLE_ICA_ORGANIZATION_CREDENTIAL,
  prepareForSignature,
} from 'gdc-common-utils-ts';

const sessionContext = {
  controllerDid: EXAMPLE_ICA_VP_ISSUER_DID,
  controllerSigningKeyId: `${EXAMPLE_ICA_VP_ISSUER_DID}#controller-sig-kid`,
};

const onboardingProof = {
  organizationCredential: EXAMPLE_ICA_ORGANIZATION_CREDENTIAL,
  legalRepresentativeCredential: EXAMPLE_ICA_LEGAL_REPRESENTATIVE_CREDENTIAL,
};

const vpPayload = createVP({
  iss: sessionContext.controllerDid,
  sub: sessionContext.controllerDid,
  aud: EXAMPLE_ICA_VP_AUDIENCE_DID,
});

addOrganizationCredential(
  vpPayload,
  onboardingProof.organizationCredential,
);
addLegalRepresentativeCredential(
  vpPayload,
  onboardingProof.legalRepresentativeCredential,
);

const header = {
  alg: 'ES384',
  typ: 'JWT',
  kid: sessionContext.controllerSigningKeyId,
};

const prepared = prepareForSignature(header, vpPayload);
const signatureBase64Url = await signer.signBase64Url(prepared.signingInput);

const vpToken = buildVpTokenCompact(
  prepared.encodedHeader,
  prepared.encodedPayload,
  signatureBase64Url,
);
```

### 9.2 Software/runtime communication proof

```ts
import {
  addVC,
  buildVpTokenCompact,
  createVP,
  prepareForSignature,
} from 'gdc-common-utils-ts';

const runtimeContext = {
  runtimeDid,
  runtimeSigningKeyId: `${runtimeDid}#communication-signing-key`,
  hostOperatorDid,
};

const vpPayload = createVP({
  iss: runtimeContext.runtimeDid,
  sub: runtimeContext.runtimeDid,
  aud: runtimeContext.hostOperatorDid,
});

addVC(vpPayload, softwareApplicationCredential);

const header = {
  alg: signatureAlg,
  typ: 'JWT',
  kid: runtimeContext.runtimeSigningKeyId,
};

const prepared = prepareForSignature(header, vpPayload);
const signatureBase64Url = await runtimeSigner.signBase64Url(prepared.signingInput);

const runtimeVpToken = buildVpTokenCompact(
  prepared.encodedHeader,
  prepared.encodedPayload,
  signatureBase64Url,
);
```

## 10. Common mistakes

- Persisting only the organization VC and later trying to pass that VC string
  as `vpToken`
- Persisting only the representative VC and assuming the runtime can rebuild the
  VP implicitly
- Creating a brand new VC in app code when the flow actually requires a VC that
  was already issued by ICA
- Assuming `addVC(...)` only accepts compact VC JWT strings
- Forgetting that JSON object VCs and raw JSON VC strings are both supported,
  and then adding app-side format conversion that the helper no longer needs
- Signing the raw JSON instead of `base64url(header).base64url(payload)`
- Passing local field names such as `icaProof`, `proofToken`, or
  `termsVerificationJwt` straight into the SDK without mapping them to the
  canonical `vpToken` input
- Treating `controller.*` as if it replaced `vp_token`
- Reusing controller-oriented variable names for runtime/software trust flows,
  or runtime-oriented names for controller onboarding flows

## 11. Where to link from other docs

When another guide needs the proof-building details, link this file instead of
repeating the whole procedure inline.

Recommended short link text:

- `VP_TOKEN_101.md`
