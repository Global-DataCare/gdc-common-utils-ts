# 101 — Federated SMART authorization and verifiable presentations

This guide fixes the names and nesting used from professional presentation to
cross-custodian data retrieval. It is written for BFF, EHR and security-audit
teams; gateway routing, ledger channels and smart-contract names are outside
this contract.

## One end-to-end vocabulary

- `professionalCredential`: the original issuer-signed professional VC;
- `professionalPresentation`: the presentation containing that credential;
- `vp_token`: the OpenID4VP transport parameter carrying the presentation;
- `indexProvider`: the provider associated with the individual's distributed
  index and therefore the token audience;
- `issuingTenant`: any available trusted data-space tenant that issues the
  token; it does not need to host an index;
- `indexSmartToken`: the federated bearer issued by `issuingTenant` for
  `indexProvider`;
- `tenantVerificationResponse`: the signed RFC 9701 introspection response
  accepted by the EHR;
- `token_introspection.vp_token`: the presentation evidence carried by that
  response.

The same original `professionalCredential` is preserved throughout. A
Clearing House does not mint a replacement professional VC.

## Step 1 — Present professional evidence

`vp_token` is the OpenID4VP transport parameter. The verifier creates a fresh
transaction nonce and the presentation is bound to that nonce and verifier.
The OAuth `client_assertion` authenticates the OAuth client and its registered
device key; it is not the OpenID4VP presentation container.

During compatibility, an installed API may still accept a sibling
`body.vp_token`. A private `client_assertion.vp` member must not be described as
canonical OpenID4VP. If both legacy and new sources are temporarily accepted,
they must identify the same presentation and a mismatch fails closed.

## Step 2 — Read a JOSE presentation correctly

For VC Data Model 2.0, the compact token uses media type
`application/vp+jwt` (normally JOSE `typ=vp+jwt`). Its JWT Claims Set is the
Verifiable Presentation itself and MUST NOT contain a wrapper claim named
`vp`.

```ts
const verifiedJwtPayload = await verifyCompactVp(vpToken);
const { presentation, format } =
  readVerifiablePresentationJwtPayload(verifiedJwtPayload);

// format === 'vc-data-model-2.0' for the canonical direct payload.
// format === 'legacy-jwt-vp' only for an explicitly measured old payload.vp.
```

The historical `payload.vp` form remains readable during migration, but is not
emitted by new VC 2.0 code. Transport name `vp_token`, JOSE media type and VP
payload shape are three separate layers.

## Step 3 — Resolve the individual index provider

The professional does not need to know the index provider. The BFF first
normalizes one governed identifier under its coding system and jurisdiction. It calls
`buildSubjectIdentifierAssetId(...)` to derive the opaque
`urn:multibase:<SHA3-384-multihash>` lookup key. The raw identifier is never
written to Fabric.

Fabric returns only `indexProviderDid`, the provider's resolvable `did:web`.
DID resolution supplies the provider service endpoint. The BFF then sends the
same opaque lookup asset id to that protected provider endpoint. Only after
authentication and policy evaluation may the provider return the stable
subject/card identity and the scoped distributed index. Discovery identifies
where the index belongs; it grants no access and exposes no card in Fabric.

The protected identity entry keeps its private identifier and points through
`sameAs` to the stable subject/card identity returned by the provider. `sameAs`
does not contain a telephone, email, legal identifier or opaque Fabric lookup
key. `Person`/`Animal`, the stable card URI, a hosted private individual DID and
the ledger asset id remain distinct identifiers with distinct purposes.

```ts
const subjectLookupAssetId = buildSubjectIdentifierAssetId({
  codingSystem: identifier.codingSystem,
  jurisdiction: identifier.jurisdiction,
  codeValue: identifier.value,
});
```

The ledger lookup, protected provider lookup and token issuance are explicit
application steps. A future high-level SDK facade may compose them, but it must
preserve the intermediate `indexProviderDid`, use it as `aud`, and never infer
the provider from the issuing tenant.

### Current availability

Common Utils currently provides the canonical opaque-key and provider-only
payload builders/readers. The GW read endpoint and high-level SDK orchestration
are not yet available, so this guide deliberately does not show a fictional SDK
method. Governed card and legal identifiers have a global lookup profile;
email and telephone are not yet global Fabric lookup profiles. Their
normalization and resistance to low-entropy enumeration require a separately
tested privacy profile before they can be enabled.

## Step 4 — Ask an available tenant to issue the token

The professional may use its own tenant or another available trusted tenant.
The available issuing tenant does not need to host an index and need not equal
the resolved `indexProvider`. It validates the presentation and issues
`indexSmartToken` with:

- `iss` equal to the available `issuingTenant`;
- `aud` equal to the resolved `indexProvider`, always;
- the exact SMART scope requested;
- a short expiry and unique `jti`;
- sufficient self-contained or replicated presentation evidence for a
  Clearing House to verify it independently.

`aud` is always the resolved index provider. It does not change when a fallback
tenant issues the token and it is not a list of custodians. The receiving EHR
is deliberately not the token audience. The same token can be forwarded to
every EHR named by the subject's index.

This is an explicit federated SMART profile and not an RFC 9068 `at+jwt`:
RFC 9068 requires `aud` to identify the consuming resource server. An
implementation must not put `typ=at+jwt` on `indexSmartToken` or claim strict
RFC 9068 conformance. Its JOSE `typ` must be a collision-resistant identifier
published by the governed federation profile; shared code must not invent an
unregistered media type.

“Any tenant” means any tenant whose membership and signing keys can be verified
under the data-space trust policy. It never means an arbitrary Internet issuer
and it never changes the resolved index-provider audience.

## Step 5 — Verify before an EHR releases data

The professional or index provider forwards the original `indexSmartToken` to
an EHR. The EHR holds the request and sends the token to an available Clearing
House. Its own tenant is preferred, but another trusted tenant can provide the
same service during an outage.

The Clearing House verifies provider signature and membership, token expiry and
replay, the original professional credential, current assignment, licence,
employee–key binding, signing-key status and the applicable Consent or governed
emergency policy.

The signed RFC 9701 JWT contains an RFC 7662 result in
`token_introspection`. This profile may carry the original presentation as
`token_introspection.vp_token`; that member is an explicitly documented
introspection extension, not a field defined by RFC 7662 or RFC 9701. The
outer tenant signature and audience bind the decision to the calling EHR. The
inner presentation retains its original holder binding and is not represented
as a newly issued VC.

```ts
const tenantVerificationResponse =
  await ehrTenant.verifyFederatedSmartToken({ token: indexSmartToken });

if (!tenantVerificationResponse.active) denyAccess();
releaseOnly(tenantVerificationResponse.scope);
```

## Step 6 — Represent emergency authority without private JWT fields

Emergency access uses the standard RFC 9396 `authorization_details` container.
The shared builder emits only its common member names: `type`, `actions`,
`datatypes`, `identifier` and `privileges`. `BTG` is the HL7 v3 ActReason
override privilege. The persisted FHIR `Consent` uses the governed emergency
treatment purpose (`ETREAT`) and the access event is recorded as FHIR
`AuditEvent` plus hash-minimized ledger evidence.

RFC 9396 requires each authorization-detail profile to own a
collision-resistant `type` URI. Common Utils does not invent that URI: the
applicable domain profile supplies its governed and versioned value.

```ts
const authorizationDetails = buildFhirEmergencyAuthorizationDetails({
  authorizationDetailType: emergencyAuthorizationDetailType,
  subject: subjectDid,
  scopes: grantedSmartScopes,
});
```

Do not emit `emergency`, `emergency_consent_id`,
`emergency_consent_expires_at`, `break_glass_authorization_id` or
`break_glass_incident_id` as the canonical bearer contract. Consent, incident
and audit identifiers remain protected server-side evidence correlated by the
token `jti`. Legacy readers may support the old fields only through an explicit
deprecation window with telemetry.

## Standards boundary

- RFC 7523: OAuth JWT client authentication;
- OpenID4VP 1.0: presentation request, holder binding and `vp_token` response;
- VC Data Model 2.0 plus VC-JOSE-COSE: direct `application/vp+jwt` payload;
- SMART App Launch: scopes and protected FHIR access;
- RFC 7662: token introspection result;
- RFC 9701: signed JWT introspection response;
- RFC 9396: structured `authorization_details`;
- HL7 v3 ActReason and FHIR Consent/AuditEvent: emergency purpose, override and
  audit evidence.

The provider-audience token, federated introspection proxy and embedded
`token_introspection.vp_token` are data-space profile extensions. Calling them
extensions explicitly is part of interoperability, not a reduction of it.
