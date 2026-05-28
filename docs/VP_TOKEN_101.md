# VP Token 101

This document explains the canonical step-by-step flow for building the
`vp_token` used by ICA/GW bootstrap flows.

Use this guide when you need to answer:

- which VC artifacts belong inside the proof
- how to assemble the VP payload
- what exactly gets signed
- how to obtain the compact `header.payload.signature` string
- which SDK field receives that string afterwards

## Quick summary

For legal organization onboarding, the sequence is:

1. Load the already-issued ICA credentials:
   - organization VC
   - legal representative VC
2. Create the VP payload with `createVP(...)` using:
   - `iss`: organization-controller signing key id
   - `sub`: organization tax ID
   - `aud`: target host operator id
3. Append the two credentials:
   - `addOrganizationCredential(...)`
   - `addLegalRepresentativeCredential(...)`
4. Prepare the exact JWS input that an external KMS must sign:
   - `prepareForSignature(...)` gives `encodedHeader`, `encodedPayload`, and `signingInput`
   - `prepareBytesForSignature(...)` gives the UTF-8 bytes of that same `header.payload`
5. Ask the external KMS to sign that input.
6. Build the final compact VP JWT with `buildVpTokenCompact(...)`.
7. Pass the resulting string to the SDK as `vpToken`.

The full Jest sequence lives in:

- [`__tests__/vp-token-101.test.ts`](../__tests__/vp-token-101.test.ts)
- [`__tests__/101-vp-token.test.ts`](../__tests__/101-vp-token.test.ts)

## 0. Security planes

Do not mix these planes when reading or documenting the flow:

- transport plane: deployment-specific channel protection such as mTLS,
  gateway policy, or session auth
- identity/business plane: controller, member, or app-service proof
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

## 2. Choose the proof flow first

Before deciding which VC goes into the VP, decide which trust flow you are
implementing.

### 2.1 Legal organization onboarding

Use this flow when:

- a legal organization is registering in a hosting operator
- the proof must identify the organization and its legal representative
- you are calling legal-organization activation such as `_activate`

This flow is relevant for most tenant onboarding integrations.

### 2.2 Software application communication proof

Use this flow when:

- the portal backend, app, or device software itself must be recognized as an
  authorized participant application
- the proof must identify the software/application, not the legal
  representative
- you are modeling a `SoftwareApplication` credential bound to a communication
  signing key

If your current integration only needs legal-organization onboarding, skip this
software/application flow for now.

## 3. Which VCs go into the VP

### 3.1 Legal organization onboarding VP

For the current ICA activation baseline, the VP normally contains:

1. the organization credential
2. the legal representative credential

Shared synthetic examples already exist in:

- [`src/examples/ica-activation-proof.ts`](../src/examples/ica-activation-proof.ts)

This guide assumes the VC artifacts already exist.

It does not create or issue VCs.

Your app should receive or load existing VC JWTs such as:

- `organizationCredentialJwt`
- `legalRepresentativeCredentialJwt`

For this legal onboarding VP, the presenter is the controller/legal
representative side.

Important distinction:

- the current shared fixtures use synthetic wallet-signing and host envelope ids
- the actual business anchor of the onboarding subject is the organization
  `taxID` carried inside the organization credential
- the organization does not necessarily have a DID document published in the
  hosting operator yet at this stage
- the controller does not necessarily have a stable organization-bound DID in
  the hosting operator yet either

So, for legal onboarding, keep these two layers separate:

1. presentation envelope
   who signed or presented the VP, and who must verify it
2. business subject
   which organization is being registered

Current shared fixture values from
[`src/examples/ica-activation-proof.ts`](../src/examples/ica-activation-proof.ts):

```ts
const legalOnboardingVpPayload = createVP({
  iss: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
  sub: EXAMPLE_ORGANIZATION_TAX_ID,
  aud: EXAMPLE_PRESENTATION_AUDIENCE_HOST_ID,
});
```

Those fixture values currently mean:

- `iss`
  synthetic wallet signing key id used as the presentation issuer in the
  example VP envelope
- `sub`
  organization tax ID used as the onboarding business subject in the example
  fixture
- `aud`
  synthetic host/operator verifier id used in the example fixture

Do not over-read those fixture values as business truth. What matters for the
current onboarding payload is:

- the organization identity is proven by the embedded organization credential
- the business anchor is the organization `taxID`
- the representative binding is proven by the embedded representative
  credential, especially `hasCredential.material`

Profile note for public cryptographic material:

- `Organization.hasCredential.material`
  public cryptographic material of the organization
- `Person.hasCredential.material`
  public cryptographic material of the controller/person
- `SoftwareApplication.material`
  public cryptographic material of the software application

When those identifiers are expressed as JWK thumbprints:

- RFC 7638 defines the canonical thumbprint calculation over the public
  signing / verification JWK
- RFC 9278 defines the canonical URN representation
  `urn:ietf:params:oauth:jwk-thumbprint:sha-256:<base64url>`

So the safest current reading is:

- `organizationControllerSigningKeyId`
  the controller-side wallet key that signs the VP JWS header (`kid`)
- `presentationSubjectTaxId`
  the organization tax ID carried by the organization credential
- `presentationAudienceHostId`
  the hosting operator / GW verifier identity

If your integration already knows the concrete envelope values expected by your
ICA/GW profile, use those values there. If not, follow the existing fixture
shape but do not confuse:

- JWS header `kid`
- VP envelope fields such as `iss/sub/aud`
- organization tax ID from the embedded VC

### 3.2 Software application communication VP

Your app should receive or load the already-issued software/application VC such
as:

- `softwareApplicationCredentialJwt`

For an app-service proof:

- the VP should carry the already-issued software/application VC from ICA
- the SDK/app should not fabricate that VC locally
- the app may still be responsible for assembling the VP and producing the
  compact `vp_token` string from that existing VC
- the human/controller signature belongs to the earlier ICA registration step
  that bound the portal/app-service key material into the issued VC; it should
  not be re-used as the operational signer for every later app-service proof
- in this profile, `SoftwareApplication.material` carries the public
  cryptographic material of the software application, typically the
  communication signing key id
- the incoming VC may already be:
  - a compact JWT/JWS string
  - a raw JSON string
  - a JSON object that your app loaded from storage or an ICA response

Minimal mockable JSON shape for that ICA-issued VC:

```ts
const appServiceDid = process.env.APP_SERVICE_DID || '';
const appServiceName = process.env.APP_SERVICE_NAME || '';
const appServiceUrl = process.env.APP_SERVICE_URL || '';
const participantDid = process.env.PARTICIPANT_DID || '';
const icaDid = process.env.ICA_DID || '';
const didWebPortalCommunicationSigningKeyId =
  process.env.DID_WEB_PORTAL_COMMUNICATION_SIGNING_KEY_ID || '';

const softwareApplicationCredentialJson = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://schema.org',
  ],
  type: ['VerifiableCredential', 'SoftwareApplicationCredential'],
  issuer: icaDid,
  credentialSubject: {
    '@type': 'SoftwareApplication',
    id: appServiceDid,
    name: appServiceName,
    url: appServiceUrl,
    sameAs: participantDid,
    material: didWebPortalCommunicationSigningKeyId,
  },
};
```

Use this only as a temporary mock when ICA software/application registration is not
implemented yet. Once ICA issues the real credential, load that VC instead of
constructing one locally.

Important:

- `@type: "SoftwareApplication"` is standard Schema.org typing
- `material` in this profile is the public cryptographic material of the
  software application, used for communication-key binding

Current helper rule:

- `addVC(...)` and the typed helpers accept all three forms above
- compact JWT/JWS inputs are stored as strings inside `vp.verifiableCredential[]`
- JSON object inputs are stored as JSON objects inside `vp.verifiableCredential[]`
- raw JSON string inputs remain valid for compatibility

Helpers and constants used by the flow live in:

- [`src/utils/vp-token.ts`](../src/utils/vp-token.ts)
- [`src/constants/verifiable-credentials.ts`](../src/constants/verifiable-credentials.ts)

## 4. Build the VP payload

Do not mix the legal onboarding credentials with the software/application
credential in the same VP.

Use one VP shape per trust flow.

### 4.1 Legal organization activation VP

```ts
import {
  addLegalRepresentativeCredential,
  addOrganizationCredential,
  EXAMPLE_ORGANIZATION_TAX_ID,
  EXAMPLE_PRESENTATION_AUDIENCE_HOST_ID,
  EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
  createVP,
} from 'gdc-common-utils-ts';

const vpPayload = createVP({
  iss: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
  sub: EXAMPLE_ORGANIZATION_TAX_ID,
  aud: EXAMPLE_PRESENTATION_AUDIENCE_HOST_ID,
});

addOrganizationCredential(vpPayload, organizationCredentialJwt);
addLegalRepresentativeCredential(vpPayload, legalRepresentativeCredentialJwt);
```

At this point:

- `vpPayload.vp.verifiableCredential[]` contains the legal onboarding
  credentials
- the payload already includes `jti`, `nonce`, `iat`, and `exp` defaults unless
  you override them

### 4.2 App-service proof VP

```ts
import { addVC, createVP } from 'gdc-common-utils-ts';

const appServiceContext = {
  appServiceDid,
  hostOperatorId,
};

const appServiceVpPayload = createVP({
  iss: appServiceContext.appServiceDid,
  sub: appServiceContext.appServiceDid,
  aud: appServiceContext.hostOperatorId,
});

addVC(appServiceVpPayload, softwareApplicationCredentialJson);
```

If your flow still persists the software/application VC as a JSON string, that
remains valid:

```ts
addVC(appServiceVpPayload, JSON.stringify(softwareApplicationCredentialJson));
```

At this point:

- `appServiceVpPayload.vp.verifiableCredential[]` contains the software/application
  credential only

Downstream VP decoding supports:

- compact VC strings
- raw JSON VC strings
- direct VC objects

## 5. Prepare the bytes that must be signed

The VP token is a compact JWS/JWT-like string.

That means you do not sign the raw JSON directly. You sign:

- `base64url(header) + "." + base64url(payload)`

Use the helper:

```ts
import {
  ClassicalJoseSignatureAlgorithms,
  prepareForSignature,
} from 'gdc-common-utils-ts';

const organizationControllerSigningKeyId =
  process.env.PRESENTATION_SIGNER_KEY_ID
  || 'urn:ietf:params:oauth:jwk-thumbprint:sha-256:Q0ZfM0V4YW1wbGVUaHVtYnByaW50X2Jhc2U2NHVybA';

const header = {
  alg: ClassicalJoseSignatureAlgorithms.Es384,
  typ: 'JWT',
  kid: organizationControllerSigningKeyId,
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

If your key-management layer uses RFC 7638 JWK thumbprints as `kid`, prefer the
normalized form:

- `urn:ietf:params:oauth:jwk-thumbprint:sha-256:<base64url>`

Meaning:

- RFC 7638 defines the canonical thumbprint calculation over the public JWK
  members of the signing / verification key
- in practice, this is the canonical hash-derived identifier of the public
  signing key material
- RFC 9278 defines the standardized URN form used to represent that thumbprint
  as an identifier string

So, when this guide says that a controller, organization, or software
application key id may be carried in `kid` or `material`, the intended value is:

- the public signing / verification JWK thumbprint as defined by RFC 7638
- represented canonically as the RFC 9278 URN
  `urn:ietf:params:oauth:jwk-thumbprint:sha-256:<base64url>`

In `gdc-common-utils-ts`, the exported prefix constant is:

- `UrnPrefixes.JwkThumbprintSha256KeyId`

That presenter changes by flow:

- legal organization onboarding normally uses a controller-side signing key
- app-service trust flows normally use an app-service or device signing key

Recommended variable names:

- `organizationControllerSigningKeyId` or `controllerWalletSigningKeyId` for legal onboarding
- `appServiceSigningKeyId` for app-service trust flows

## 6. Sign externally

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

## 7. Build the final compact token

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

## 8. Pass it to the SDK

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

## 9. Extract credentials back from a VP token

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

## 10. Minimal end-to-end examples

### 10.1 Legal organization activation proof

```ts
import {
  ClassicalJoseSignatureAlgorithms,
  EXAMPLE_ORGANIZATION_TAX_ID,
  EXAMPLE_PRESENTATION_AUDIENCE_HOST_ID,
  EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
  addLegalRepresentativeCredential,
  addOrganizationCredential,
  buildVpTokenCompact,
  createVP,
  EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL,
  EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL,
  prepareForSignature,
} from 'gdc-common-utils-ts';

const sessionContext = {
  organizationControllerSigningKeyId: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
  hostOperatorId: EXAMPLE_PRESENTATION_AUDIENCE_HOST_ID,
  organizationTaxId: EXAMPLE_ORGANIZATION_TAX_ID,
};

const onboardingProof = {
  organizationCredential: EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL,
  legalRepresentativeCredential: EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL,
};

const vpPayload = createVP({
  iss: sessionContext.organizationControllerSigningKeyId,
  sub: sessionContext.organizationTaxId,
  aud: sessionContext.hostOperatorId,
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
  alg: ClassicalJoseSignatureAlgorithms.Es384,
  typ: 'JWT',
  kid: sessionContext.organizationControllerSigningKeyId,
};

const prepared = prepareForSignature(header, vpPayload);
const signatureBase64Url = await signer.signBase64Url(prepared.signingInput);

const vpToken = buildVpTokenCompact(
  prepared.encodedHeader,
  prepared.encodedPayload,
  signatureBase64Url,
);
```

### 10.2 App-service communication proof

```ts
import {
  addVC,
  buildVpTokenCompact,
  createVP,
  prepareForSignature,
} from 'gdc-common-utils-ts';

const appServiceContext = {
  appServiceDid,
  appServiceSigningKeyId: `${appServiceDid}#communication-signing-key`,
  hostOperatorId,
};

const vpPayload = createVP({
  iss: appServiceContext.appServiceDid,
  sub: appServiceContext.appServiceDid,
  aud: appServiceContext.hostOperatorId,
});

addVC(vpPayload, softwareApplicationCredential);

const header = {
  alg: signatureAlg,
  typ: 'JWT',
  kid: appServiceContext.appServiceSigningKeyId,
};

const prepared = prepareForSignature(header, vpPayload);
const signatureBase64Url = await appServiceSigner.signBase64Url(prepared.signingInput);

const appServiceVpToken = buildVpTokenCompact(
  prepared.encodedHeader,
  prepared.encodedPayload,
  signatureBase64Url,
);
```

## 11. Common mistakes

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

## 12. Where to link from other docs

When another guide needs the proof-building details, link this file instead of
repeating the whole procedure inline.

Recommended short link text:

- `VP_TOKEN_101.md`
