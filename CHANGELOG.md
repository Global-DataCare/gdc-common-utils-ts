# Changelog

All notable changes to `gdc-common-utils-ts` will be documented in this file.

## [2.0.13] - 2026-06-27

### Added
- Added explicit package-boundary guidance so `gdc-common-utils-ts` stays
  limited to shared runtime-neutral primitives while higher-layer wallet
  contracts and Node runtime adapters live in `gdc-sdk-core-ts` and
  `gdc-sdk-node-ts` respectively:
  - `ARCHITECTURE.md`
  - `README.md`
- Standardized the shared professional actor DID fixtures/helpers around the
  canonical employee DID shape with one hashed email-derived identifier
  segment:
  - `did:web:<host>:employee:z<multibase-sha384(email)>:<role>`
  This keeps the stable actor identifier pseudonymous while preserving the
  `did:web` envelope and the role segment used by GW consent matching:
  - `src/utils/did.ts`
  - `src/examples/shared.ts`
  - `src/utils/actor.ts`

### Validation
- `npm run typecheck`
- `npm run build`

## [2.0.12] - 2026-06-24

### Changed
- Kept the high-level JWT signer façade and `101` docs introduced after
  `2.0.11`, including deterministic/random signer creation for `id_token` and
  `vp_token` flows:
  - `src/utils/jwt-signer.ts`
  - `src/utils/deterministic-jwk.ts`
  - `docs/101-ID_TOKEN.md`
  - `docs/101-VP_TOKEN.md`
  - `__tests__/101-id-token.test.ts`
  - `__tests__/101-vp-token.test.ts`
  - `__tests__/101-deterministic-signers.test.ts`

### Fixed
- Corrected the shared Consent attachment claim key from
  `Consent.attachment-contentType` to the canonical lowercase
  `Consent.attachment-contenttype` so downstream generated examples and OpenAPI
  payloads no longer leak camelCase in FHIR-style claim names.

### Validation
- `npm run typecheck`
- `npm test -- --watchman=false __tests__/101-id-token.test.ts __tests__/101-vp-token.test.ts __tests__/101-deterministic-signers.test.ts`
- `npm run build`

## [2.0.11] - 2026-06-24

### Added
- Added a shared high-level JWT signer façade for BFF/controller/app flows so
  integrators can create deterministic or random signers without starting from
  low-level JOSE plumbing:
  - `src/utils/jwt-signer.ts`
  - `src/utils/deterministic-jwk.ts`

### Changed
- Reframed the `101` guides so `id_token` and `vp_token` now teach the
  integrator-facing high-level flow first, using `createJwtSigner(...)`,
  instead of starting from low-level signing helpers:
  - `docs/101-ID_TOKEN.md`
  - `docs/101-VP_TOKEN.md`
- Standardized the high-level signer contract so the exposed key identifier is
  always the RFC 9278 JWK thumbprint URI, including the prepared JWT header
  `kid`.
- Added deterministic signer examples and regression coverage for:
  - legacy EC signers (`ES384`, `ES256K`)
  - post-quantum deterministic signer flows already backed by the shared
    cryptography engine (`ML-DSA-*`)

### Validation
- `npm run typecheck`
- `npm test -- --watchman=false __tests__/101-id-token.test.ts __tests__/101-vp-token.test.ts __tests__/101-deterministic-signers.test.ts`

## [2.0.10] - 2026-06-24

### Changed
- Added generic externally-signed JWT helpers so BFF/native flows can prepare compact `header.payload` signing input bytes for KMS/HSM signing and then assemble the final compact JWT string, reusing the same pattern already used by `vp_token`.
- Added didactic `101` coverage and documentation for `id_token` construction, including links between the `vp_token` and `id_token` guides and references to JOSE/JWT/OpenID standards.
- Refactored `vp_token` helpers to reuse the new generic JWT signing primitives instead of maintaining a parallel local implementation.

### Validation
- `npm run typecheck`
- `npm test -- --watchman=false __tests__/utils-jwt.test.ts __tests__/101-vp-token.test.ts __tests__/101-id-token.test.ts`

## [2.0.9] - 2026-06-23

### Changed
- Updated the shared employee/controller device-activation example so the DCR payload now matches the current GW CORE contract: `application_type: native`, explicit `redirect_uris`, controller `jwks`, and minimum `ext_device_info`.
- Added regression coverage that keeps the shared DCR example aligned with the downstream `_issue -> _exchange -> _dcr` recovery flow used by the SDK chain.

### Validation
- `npm run typecheck`
- `npm test -- --watchman=false __tests__/101-license-examples.test.ts`
- `npm run build`

## [2.0.8] - 2026-06-23

### Changed
- Reframed the shared clinical/IPS onboarding docs so the `101` path teaches
  high-level `ipsBundleReader` and chainable editor flows instead of technical
  persistence plumbing, and centralized the canonical IPS claim/method matrix
  in:
  - `docs/101-CLINICAL-IPS.md`
  - `docs/101-IPS_BUNDLE.md`
  - `docs/REFERENCE-CLINICAL-IPS-API.md`
  - `docs/101-BUNDLE_EDITOR_READER.md`
  - `README.md`
- Removed `upsert...` terminology from the `101` onboarding narrative in the
  shared docs where frontend/integrator readers should learn create/update
  flows first, keeping those lower-level names in code/JSDoc/tests instead:
  - `docs/101-CLINICAL_READ_AND_SEARCH.md`
  - `docs/101-CONSENT_EDITOR_AND_READBACK.md`
  - `docs/101-CONSENT_ACCESS.md`
  - `docs/101-CONSENT_PERMISSION_TEMPLATES.md`
  - `docs/101-RELATED_PERSON_EDITOR.md`
- Formalized the shared IPS documentation/editorial contract around canonical
  reusable constants, fixtures, and subject context, and documented that the
  remaining gap is the typed IPS editor/family surface rather than onboarding
  discipline:
  - `src/constants/clinical-statuses.ts`
  - `__tests__/constants-clinical-statuses.test.ts`
  - `docs/101-IPS_BUNDLE.md`
  - `NEXT_AGENT_HANDOFF.md`
- Added a typed IPS bundle entry editor surface in shared `src` so tests and
  downstream SDK flows can stage clinical resources with chainable business
  methods instead of low-level `setClaim(...)` plumbing:
  - `src/utils/bundle-editor.ts`
  - `src/examples/shared.ts`
  - `__tests__/101-ips-family-entry-editors.test.ts`
- Expanded the typed IPS editor coverage across the main IPS family set,
  including allergy, condition, medication, document reference, immunization,
  procedure, diagnostic report, observation panels, and supporting resources
  such as care plan, flag, clinical impression, device, device use statement,
  encounter, and coverage.
- Split canonical coded concepts from human/local labels for immunization and
  procedure entries by adding explicit `code-text` / `code-display` claims and
  roundtrip conversion support, while keeping clinical notes as actual FHIR
  note content:
  - `src/models/interoperable-claims/immunization-claims.ts`
  - `src/models/interoperable-claims/procedure-claims.ts`
  - `src/convert/convert-immunization.ts`
  - `src/convert/convert-procedure.ts`

### Validation
- `npm run typecheck`
- `npm test -- --watchman=false`
- `npm run build`

## [2.0.6] - 2026-06-19

### Changed
- Renamed the shared DIDComm plaintext transport media type from
  `application/didcomm-plaintext+json` to the canonical
  `application/didcomm-plain+json` in:
  - `src/utils/didcomm-submit.ts`
  - `src/utils/activation-request.ts`
- Updated the shared tests to assert the canonical media type:
  - `__tests__/utils-didcomm-submit.test.ts`
  - `__tests__/utils-activation-request.test.ts`

## [2.0.5] - 2026-06-18

### Added
- Added shared legal-organization onboarding utilities so host/BFF/GW flows
  can reuse one canonical contract for:
  - verification transaction request/entry extraction
  - onboarding editor helpers
  - organization DID binding examples
  - family/organization summary projections
  - professional SMART profile helpers
  in:
  - `src/utils/legal-organization-verification-transaction.ts`
  - `src/utils/legal-organization-onboarding-editor.ts`
  - `src/utils/organization-did-binding.ts`
  - `src/utils/family-organization-summary.ts`
  - `src/utils/professional-smart.ts`
  - `src/examples/legal-organization-verification-transaction.ts`
  - `src/examples/organization-did-binding.ts`
  - `__tests__/utils-legal-organization-verification-transaction.test.ts`
  - `__tests__/utils-legal-organization-onboarding-editor.test.ts`
  - `__tests__/utils-organization-did-binding.test.ts`
  - `__tests__/101-family-organization-summary.test.ts`
  - `__tests__/utils-professional-smart.test.ts`
- Added shared clinical/response bundle inspection helpers so downstream SDKs
  stop reimplementing common bundle traversal and response parsing:
  - `src/utils/clinical-bundle-summary.ts`
  - `src/utils/bundle-reader.ts`
  - `__tests__/utils-clinical-bundle-summary.test.ts`
  - `__tests__/utils-bundle-reader-response.test.ts`

### Changed
- Centralized DIDComm submit vocabulary under shared constants/types so submit
  kind, communication mode, submission reason, and content type can be derived
  from one source of truth instead of local string literals:
  - `src/utils/didcomm-submit-policy.ts`
  - `src/utils/didcomm-submit.ts`
- Expanded the shared example/export surface for employee/controller/ICA
  response fixtures and related-person readers:
  - `src/examples/employee.ts`
  - `src/examples/ica-verify-response.ts`
  - `src/examples/individual-controller.ts`
  - `src/examples/shared.ts`
  - `src/examples/index.ts`
  - `src/utils/related-person-list.ts`
  - `src/constants/verifiable-credentials.ts`
  - `src/utils/index.ts`
- Updated the package guidance so consumers know these onboarding/profile
  builders belong in shared utilities while transport/runtime execution stays
  in SDK/GW packages:
  - `README.md`

### Testing
- `npm run build`

## [2.0.4] - 2026-06-18

### Changed
- Extended the shared ICA `_verify-response` success example so the emitted
  OrganizationCredential includes canonical sector authorization in
  `credentialSubject.makesOffer.category`:
  - `src/examples/ica-verify-response.ts`

## [2.0.3] - 2026-06-17

### Added
- Added a canonical shared bundle contract for the first legal-organization
  onboarding transaction that asks GW CORE to forward signed PDF evidence to
  ICA `_verify`, including the explicit controller business binding key,
  optional organization signing key, and representative payload:
  - `src/utils/legal-organization-verification-transaction.ts`
  - `src/examples/legal-organization-verification-transaction.ts`
  - `__tests__/utils-legal-organization-verification-transaction.test.ts`
- Added reusable shared example constants for legal-organization verification
  transaction fixtures so downstream SDKs and GW examples stop re-inventing
  legal name, tax id, and signed-PDF attachment URLs:
  - `src/examples/shared.ts`

### Changed
- Re-exported the new legal-organization verification transaction helpers and
  examples from the public shared surfaces:
  - `src/utils/index.ts`
  - `src/examples/index.ts`
- Clarified in the package guidance that shared onboarding builders own the
  business payload contract, while runtime packages own the transport-specific
  `fetch`, polling, and crypto execution layers:
  - `README.md`

### Validation
- `npm run typecheck`
- `npm test -- --watchman=false --runInBand __tests__/utils-legal-organization-verification-transaction.test.ts`

## [2.0.2] - 2026-06-16

### Added
- Added a canonical ICA `_verify-response` success example module so Swagger,
  SDK tests, and downstream docs can import one shared response shape instead
  of re-hardcoding response payload fragments inline:
  - `src/examples/ica-verify-response.ts`

### Changed
- Re-exported the new ICA `_verify-response` example from the shared examples
  surface:
  - `src/examples/index.ts`
- Documented the representative controller key-binding continuity example using
  `credentialSubject.hasCredential.material` in the shared ICA response
  fixtures, aligned with the RFC 7638 / RFC 9278 thumbprint helper contract.

## [2.0.1] - 2026-06-16

### Added
- Added canonical RFC 7638 / RFC 9278 JWK thumbprint helpers to the public
  shared utils surface so GW and SDK layers can derive the exact same
  representative/controller key-binding material without local reimplementation:
  - `src/utils/jwk-thumbprint.ts`
  - `src/utils/index.ts`
- Added a shared `DidcommPlaintextTransportMetadata` type plus the
  `buildDidcommPlaintextTransportMetadata(...)` helper so high-level SDK/BFF
  layers can build the exact plaintext transport fallback shape that GW
  consumes in demo flows:
  - `src/models/identity-bootstrap.ts`
  - `src/utils/activation-request.ts`
- Added reusable legal-organization onboarding validation/schema helpers so SDK
  forms, assistants, and BFF preparation flows can enforce the canonical
  `identifier.value` / `taxID` requirement and optional
  `allowExplicitAlternateNameForTenantId` rule before calling GW:
  - `src/utils/legal-organization-onboarding.ts`
  - `__tests__/utils-legal-organization-onboarding.test.ts`
- Added shared profile-runtime constants/examples so downstream SDKs stop
  re-inlining app-type, runtime-class, key-access, and connection-secret test
  values:
  - `src/constants/profile-runtime.ts`
  - `src/examples/profile-runtime.ts`

### Changed
- Documented and tested the plaintext activation transport fallback so high-level
  activation helpers can mirror controller communication key metadata into
  `meta.jws.protected` / `meta.jwe.header` only when no real JOSE envelope is
  present on the wire:
  - `src/utils/activation-request.ts`
  - `__tests__/utils-activation-request.test.ts`
- Clarified that `meta.jws.protected` in plaintext is technical transport
  compatibility fallback and does not replace the canonical activation-time
  `controller.publicKeyJwk` / `controller.jwks` contract.
- Re-exported the new profile-runtime constants/examples and aligned
  organization-controller/frontend-session examples with the canonical shared
  activation and profile-runtime vocabulary:
  - `src/constants/index.ts`
  - `src/examples/index.ts`
  - `src/examples/frontend-session.ts`
  - `src/examples/organization-controller.ts`
- Expanded shared JWK typing/JSDoc so RFC 7638 thumbprint behavior is explicit
  for ML-DSA, ML-KEM, classic EC, and `secp256k1`-style curves:
  - `src/interfaces/Cryptography.types.ts`
- Refined shared package architecture/contribution docs so runtime-neutral
  profile/outbox/queue/vault shapes stay in `common-utils` while concrete
  runtime behavior remains downstream:
  - `ARCHITECTURE.md`
  - `CONTRIBUTING.md`
  - `README.md`

### Validation
- `npm run build`
- `npm test -- --runInBand __tests__/utils-activation-request.test.ts`

## [2.0.0] - 2026-06-15

### Added
- Added canonical architecture and contribution rules for the v2 shared layer,
  including:
  - `ARCHITECTURE.md`
  - `CONTRIBUTING.md`
- Added a dedicated organization lifecycle helper surface in:
  - `src/utils/organization-lifecycle.ts`
  - `__tests__/101-organization-lifecycle.test.ts`

### Changed
- Standardized the shared lifecycle surface around canonical high-level
  `Editor` and `State` terminology instead of `Draft` for non-provisional
  lifecycle semantics:
  - `src/utils/individual-organization-lifecycle.ts`
  - `src/examples/lifecycle.ts`
  - `docs/101-INDIVIDUAL_ORGANIZATION_LIFECYCLE_EDITOR.md`
  - `__tests__/101-individual-organization-lifecycle.test.ts`
- Standardized shared operation/search helpers so technical internal state uses
  `State` and `getState()` instead of `Draft` and `getDraft()` where the domain
  is not modeling a provisional artifact:
  - `src/utils/interoperable-resource-operation.ts`
  - `src/utils/communication-search-editor.ts`
  - `src/utils/license-commercial-search.ts`
  - `src/utils/license-list-search.ts`
  - `src/utils/license-offer-order.ts`
  - `src/utils/index.ts`
  - `__tests__/101-interoperable-resource-operation.test.ts`
  - `__tests__/101-license-list-search.test.ts`
- Documented the v2 ownership rule that canonical high-level `get...` /
  `set...` methods on shared semantic classes must be introduced in
  `gdc-common-utils-ts` before being wrapped by downstream SDK layers.
- Documented the v2 naming rule that operation families keep the operation
  prefix first and specialize toward the end, e.g. `prepareSearch...` and
  `prepareLifecycle...`.

### Breaking
- Lifecycle and shared helper callers must consume the v2 `Editor` / `State`
  surface rather than the old `Draft` naming when the domain is not
  semantically provisional.
- Downstream SDK layers should now treat `gdc-common-utils-ts` as the canonical
  source of high-level shared `get...` / `set...` methods before introducing
  role/profile/runtime wrappers.

## [1.24.3] - 2026-06-15

### Changed
- Clarified controller binding examples so email-based `sameAs` values use the
  canonical ICA/GW hash form `urn:multibase:z...` instead of `mailto:...`:
  - `src/utils/activation-request.ts`
  - `__tests__/utils-activation-request.test.ts`
- Added an explicit security note around the hosted activation fallback:
  claims-side raw email is only a demo/local bootstrap convenience; production
  flows should send signed `person.email` to ICA so the issued representative
  VC already carries the canonical hashed `credentialSubject.sameAs`.

## [1.24.2] - 2026-06-15

### Added
- Added shared ICA-compatible `sameAs` helpers copied and synchronized from
  `dataspace-ica-ts` so BFF/backend callers can compute the exact same
  controller alias normalization before calling GW/ICA:
  - `src/utils/same-as.ts`
  - `__tests__/utils-same-as.test.ts`
- Added reusable `Communication/_search` helpers, fixtures, and step-by-step
  tests so GW/SDK callers can reuse one canonical shared contract instead of
  handcrafting `Parameters` rows:
  - `src/utils/communication-participant-search.ts`
  - `src/utils/communication-participant-search-test-data.ts`
  - `__tests__/utils-communication-participant-search.test.ts`
- Added a high-level `CommunicationSearchEditor` that can build:
  - `buildRequest()`
  - `buildEntry()`
  - `buildBundle()`
  while keeping app-facing semantics at the fluent-editor layer:
  - `src/utils/communication-search-editor.ts`
  - `__tests__/101-communication-search-editor.test.ts`
  - `docs/101-COMMUNICATION_SEARCH_EDITOR.md`
- Added reusable communication-retention policy helpers centered on the
  conservative default `COMMUNICATION_RETENTION_DISABLED=false`:
  - `src/utils/communication-retention-policy.ts`

### Changed
- Documented the canonical BFF activation pattern for hosted organization
  onboarding when the ICA PDF/VC omitted representative email/`sameAs`:
  normalize `controller.sameAs` with the shared helper and keep the raw email
  in activation claims for GW admin bootstrap:
  - `src/utils/activation-request.ts`
  - `__tests__/utils-activation-request.test.ts`
- Tightened activation-policy validation so hosted activation proofs can reject
  verifiable credentials that are semantically present but not authorized for
  the requested category/service-type combination, and refreshed the shared ICA
  proof examples/tests accordingly:
  - `src/utils/activation-policy.ts`
  - `src/examples/ica-activation-proof.ts`
  - `src/examples/shared.ts`
  - `__tests__/utils-activation-policy.test.ts`
- Extended the shared search transport helper so search bundles can declare
  canonical business-level bundle types such as `search` and
  `search-response` instead of always defaulting to `batch`:
  - `src/utils/fhir-search.ts`
- Re-exported the new communication search editor and retention-policy helpers
  from the public utils surface:
  - `src/utils/index.ts`

### Validation
- `npm test -- --watchman=false 101-communication-search-editor.test.ts utils-communication-participant-search.test.ts`

## [1.24.1] - 2026-06-14

### Changed
- Extended the shared confidential-storage contract with lightweight public
  runtime metadata that can stay outside encrypted `content` when a runtime
  needs safe lookup or lifecycle hints without hydrating the protected JWE:
  - `AuditInfo.disposition`
  - `PublicInfo`
  - `ConfidentialStorageDoc.public`
- Documented the intended use of that public projection directly in the shared
  model JSDoc so downstream runtimes do not treat it as a second canonical
  payload and only use it for deployment-safe routing/gating markers.

### Testing
- `npm version 1.24.1 --no-git-tag-version`

## [1.24.0] - 2026-06-13

### Added
- Added canonical actor-capability documentation and metadata helpers in:
  - `src/constants/actor-session.ts`
  - `__tests__/actor-session-capabilities.test.ts`
- Added canonical data-authorization capability vocabulary and examples in:
  - `src/constants/data-capabilities.ts`
  - `__tests__/data-capabilities.test.ts`
- Added activation-policy authorization helpers for ICA-issued service
  `category` and `serviceType` checks in:
  - `src/utils/activation-policy.ts`
  - `src/examples/ica-activation-proof.ts`
  - `__tests__/utils-activation-policy.test.ts`
- Added hosted provider, provider-sector, individual, and member DID helpers in:
  - `src/utils/did.ts`
  - `__tests__/utils-did-extra.test.ts`
  - `__tests__/utils-did-resolution.test.ts`
- Added confidential-storage blob persistence contracts, hydration helpers, and
  deterministic fixtures in:
  - `src/models/confidential-storage.ts`
  - `src/utils/confidential-storage-persistence.ts`
  - `src/utils/confidential-storage-test-data.ts`
  - `__tests__/confidential-storage-persistence.test.ts`
  - `__tests__/confidential-storage-test-data.test.ts`
- Added family-registration test-data builders and deep undefined sanitization
  helpers in:
  - `src/utils/family-registration-test-data.ts`
  - `src/utils/object-sanitize.ts`
  - `__tests__/family-registration-test-data.test.ts`
  - `__tests__/object-sanitize.test.ts`
- Added tenant lifecycle request constants and organization-registry service
  capability tokens in:
  - `src/constants/lifecycle.ts`
  - `src/constants/service-capabilities.ts`
  - `src/examples/lifecycle.ts`
  - `__tests__/service-capabilities.test.ts`

### Changed
- Renamed host capability tokens to the canonical `Hosting...` family, expanded
  tenant and host lifecycle capabilities, and exposed shared per-capability
  programming hints in:
  - `src/constants/actor-session.ts`
- Aligned related-person claims and readers around the canonical
  `RelatedPerson.identifier.value` key while keeping the legacy
  `RelatedPerson.identifier` alias for backward compatibility in:
  - `src/models/interoperable-claims/related-person-claims.ts`
  - `src/claims/claims-helpers-related-person.ts`
  - `src/utils/related-person-list.ts`
  - `src/examples/related-person.ts`
  - `__tests__/101-related-person-list-reader.test.ts`
- Clarified interoperable claim examples so Observation and Invoice subject
  references use the new hosted individual DID shape in:
  - `src/models/interoperable-claims/observation-claims.ts`
  - `src/models/interoperable-claims/invoice-claims.ts`
- Re-exported the new persistence, test-data, and sanitization helpers from the
  public utils surface in:
  - `src/utils/index.ts`
  - `src/constants/index.ts`

### Testing
- `npm run typecheck`
- `npm test -- --watchman=false`
- `npm run build`

## [1.23.0] - 2026-06-13

### Added
- Added canonical claims-first invoice and charge-item contracts in:
  - `src/models/interoperable-claims/invoice-claims.ts`
- Added invoice editor support for invoice-level claims and repeated charge-item
  claim rows, including contextualized variants, in:
  - `src/utils/invoice-bundle.ts`
- Added shared invoice/charge-item fixtures and executable teaching coverage in:
  - `src/examples/invoice.ts`
  - `src/examples/shared.ts`
  - `__tests__/101-invoice-claims.test.ts`
- Added a frontend-oriented guide for invoice and charge-item claims in:
  - `docs/101-INVOICE_AND_CHARGEITEM_CLAIMS.md`

### Changed
- Embedded canonical `meta.claims` into generated FHIR invoice resources and
  widened shared FHIR document typings so invoice/document/communication
  resources can carry claims metadata in:
  - `src/models/fhir-documents.ts`
  - `src/utils/invoice-bundle.ts`
- Re-exported interoperable claims through the package index and linked the new
  invoice guide from the existing license/order/invoice teaching materials in:
  - `src/models/interoperable-claims.ts`
  - `src/models/interoperable-claims/index.ts`
  - `docs/101-LICENSE_OFFERS_ORDERS_AND_LISTS.md`

### Testing
- `npm run typecheck`
- `npm test -- --watchman=false --runInBand __tests__/101-invoice-claims.test.ts`
- `npm run build`

## [1.22.0] - 2026-06-13

### Added
- Added a shared invoice bundle contract for commercial/order readback in:
  - `src/utils/invoice-bundle.ts`
  - `src/examples/invoice.ts`
- Added canonical FHIR `Invoice` support to the shared document surface in:
  - `src/constants/fhir-resource-types.ts`
  - `src/models/fhir-documents.ts`

### Changed
- Re-exported the invoice bundle helpers from the public examples/utils entry
  points so downstream GW CORE and SDK packages can reuse the same high-level
  fixtures and readers without new literals.

### Testing
- `npm run build`

## [1.21.0] - 2026-06-12

### Added
- Added claims-first Observation authoring, conversion, and indexing groundwork in:
  - `src/models/interoperable-claims/observation-claims.ts`
  - `src/convert/convert-observation.ts`
  - `src/models/indexing.ts`
  - `src/constants/observation-category.ts`
  - `src/constants/vital-signs.ts`
- Added reusable observation and vital-sign example fixtures in:
  - `src/examples/shared.ts`
  - `src/examples/vital-signs.ts`
- Added an individual-local bundle vault for sectioned persistent storage in:
  - `src/utils/individual-bundle-vault.ts`
  - `src/constants/individual-sections.ts`
- Added high-level vital-sign editor coverage and supporting examples in:
  - `__tests__/101-vital-sign-entry-editor.test.ts`
  - `__tests__/examples-vital-signs.test.ts`
- Added observation/indexing/vault coverage in:
  - `__tests__/convert-observation.test.ts`
  - `__tests__/models-indexing.test.ts`
  - `__tests__/individual-bundle-vault.test.ts`
- Added observation and vital-sign editor documentation in:
  - `docs/OBSERVATION.md`
  - `docs/101-VITAL_SIGN_ENTRY_EDITOR.md`
- Added a canonical interoperable operation helper that formalizes:
  - `resource.identifier` as the business/interoperable locator
  - `resource.id` as internal/runtime state
  - `resource.meta.claims` as the canonical processing shape
- Added shared lifecycle result readers for bundle-like responses, including:
  - `src/utils/lifecycle-result-reader.ts`
  - `src/utils/consent-lifecycle-result-reader.ts`
- Added an `IndividualOrganizationLifecycleDraft` flow for hosted
  family/individual disable and purge payload authoring in:
  - `src/utils/individual-organization-lifecycle.ts`
- Added shared license list/search and offer/order helpers for stable UI/SDK
  preview and summary readback in:
  - `src/utils/license-list-search.ts`
  - `src/utils/license-commercial-search.ts`
  - `src/utils/license-offer-order.ts`
- Added a reusable GW CORE route/path builder in:
  - `src/utils/gw-core-path.ts`
- Added related-person helpers for active-state normalization and list readback
  in:
  - `src/utils/related-person-list.ts`
- Added new shared lifecycle/interoperability constants in:
  - `src/constants/lifecycle.ts`
- Added new high-level lifecycle/readback 101 coverage in:
  - `__tests__/101-consent-lifecycle-result-reader.test.ts`
  - `__tests__/101-individual-organization-lifecycle.test.ts`
  - `__tests__/101-interoperable-resource-operation.test.ts`
  - `__tests__/101-license-commercial-search.test.ts`
  - `__tests__/101-license-list-search.test.ts`
  - `__tests__/101-license-offer-order-editor.test.ts`
  - `__tests__/101-lifecycle-result-reader.test.ts`
  - `__tests__/101-related-person-list-reader.test.ts`
- Added new front-oriented 101 guides in:
  - `docs/101-CLINICAL_READ_AND_SEARCH.md`
  - `docs/101-CONSENT_EDITOR_AND_READBACK.md`
  - `docs/101-INDIVIDUAL_ORGANIZATION_LIFECYCLE_EDITOR.md`

### Changed
- Centralized more shared example/runtime values so downstream repos can reuse
  canonical fixtures instead of repeating literals in:
  - `src/examples/license.ts`
  - `src/examples/shared.ts`
  - `src/constants/Schemas.ts`
  - `src/models/urlPath.ts`
  - `docs/101-LICENSE_OFFERS_ORDERS_AND_LISTS.md`
  - `docs/101-RELATED_PERSON_EDITOR.md`
  - `docs/101-RESOURCE_IDENTIFIER_AND_OPERATIONS.md`
  - `docs/LIFECYCLE_TECHNICAL_ROADMAP.md`

### Changed
- Renamed the preferred Observation converter API so the concrete FHIR version suffix stays at the end of the helper name:
  - `observationFromFlatToFhirR4`
  - `observationToFlatFhirR4`
  while keeping compatibility aliases for the older names.
- Clarified the Observation flat-claims contract so:
  - `Observation.category` carries classification values such as `vital-signs`
  - `Observation.value-concept-*` carries coded result values
  - newly added Observation quantity/composite claims use the non-contextualized form consistently.
- Extended bundle/document conversion and bundle-session helpers with Observation-aware handling so Observation claims can be staged and rebuilt through the shared bundle infrastructure.
- Extended `BundleEditor` with:
  - `asVitalSign()`
  - `asObservation()`
  - `ObservationComponentEntryEditor`
  - `VitalSignEntryEditor`
  - `ObservationEntryEditor`
- Added parent-observation composite indexing primitives for future composite Observation profiles, including:
  - `Observation.component-tags`
  - `Observation.component-code-values`
  - `Observation.component-names`
  - `Observation.score-total-number`
  - `Observation.bp-systolic-number`
  - `Observation.bp-diastolic-number`
- Updated the package README examples to use the renamed Observation converter helpers.
- Captured the current package dependency/worktree state in:
  - `package.json`
  - `package-lock.json`
- Added a versioned GitLab merge-request template for this integration branch in:
  - `.gitlab/merge_request_templates/observation-vault-vitalsigns.md`
- Expanded shared examples, exports, docs, and 101 tests so lifecycle,
  license, related-person, and interoperable-resource-operation flows are now
  first-class public surfaces.
- Clarified employee and lifecycle teaching materials in:
  - `docs/101-BUNDLE_EDITOR_READER.md`
  - `docs/101-EMPLOYEE_ENTRY_EDITOR.md`
  - `docs/101-LIFECYCLE.md`
- Extended employee/related-person shared helpers and examples in:
  - `src/claims/claims-helpers-related-person.ts`
  - `src/examples/lifecycle.ts`
  - `src/examples/license.ts`
  - `src/examples/related-person.ts`
  - `src/examples/shared.ts`
  - `src/utils/bundle-editor.ts`
  - `src/utils/employee.ts`
  - `src/utils/index.ts`

### Testing
- `npm run build`
- `npm test -- --runTestsByPath __tests__/101-vital-sign-entry-editor.test.ts __tests__/models-indexing.test.ts`
- `npm test -- --runTestsByPath __tests__/models-indexing.test.ts __tests__/convert-observation.test.ts __tests__/individual-bundle-vault.test.ts`
- `npm test -- --watchman=false --runInBand __tests__/101-related-person-list-reader.test.ts __tests__/101-consent-lifecycle-result-reader.test.ts __tests__/101-lifecycle-result-reader.test.ts`

## [1.20.2] - 2026-06-11

### Added
- Added canonical schema.org `IndividualProduct` licensing claims in:
  - `src/constants/schemaorg.ts`
- Added neutral shared licensing helpers and examples in:
  - `src/utils/license.ts`
  - `src/examples/license.ts`
- Added executable coverage for the shared licensing helpers in:
  - `__tests__/101-license-examples.test.ts`
  - `__tests__/constants-schemaorg-claims.test.ts`

### Changed
- Kept licensing search payloads claims-first for secure HMAC-backed indexing:
  - schema.org selectors stay in `meta.claims`
  - document lifecycle state stays in `meta.status`
  - removed the previously proposed generic `meta.filters`/`includeItems` shape to avoid inventing a parallel search contract
- Added a roadmap rule that future `101-*` tests should validate public `BundleEditor` flows and public builders instead of centering new coverage on internal helper functions.

### Testing
- `npm test -- --runInBand __tests__/constants-schemaorg-claims.test.ts __tests__/101-license-examples.test.ts`

## [1.20.0] - 2026-06-10

### Added
- Added canonical onboarding contracts and helpers for individual PDF draft generation in:
  - `src/models/individual-onboarding.ts`
  - `src/utils/individual-organization-kyc.ts`
  - `src/utils/individual-onboarding-document-reference.ts`
- Added reusable onboarding draft builders for apps/SDKs in:
  - `src/utils/individual-onboarding-editor.ts`
  - `src/utils/individual-organization-claims.ts`
- Added typed identity constants shared across onboarding/KYC/tests in:
  - `src/constants/identity-gender.ts`
  - `src/constants/identity-identifiers.ts`
- Added reusable onboarding/KYC/PDF/document test fixtures in:
  - `src/examples/shared.ts`
- Added a frontend-oriented onboarding PDF request guide in:
  - `docs/101-INDIVIDUAL_ONBOARDING_PDF_REQUEST.md`
- Added executable coverage for the new KYC and claims-first onboarding PDF helpers in:
  - `__tests__/utils-individual-organization-kyc.test.ts`
  - `__tests__/utils-individual-onboarding-document-reference.test.ts`
- Added onboarding editor and final-claims coverage in:
  - `__tests__/101-individual-onboarding-claims.test.ts`
  - `__tests__/utils-individual-onboarding-editor.test.ts`
  - `__tests__/utils-individual-organization-claims.test.ts`

### Changed
- Completed the shared individual PDF field contract so the onboarding form surface is typed in one place, including:
  - explicit controller and subject aliases
  - explicit controller and subject contact channels
  - controller and subject identifier fields
  - controller and subject birth/gender fields
  - `docDate`
  - `serviceProviderDomain`
- Renamed the onboarding self-registration switch to the clearer controller-first field `controllerIsSubject` and aligned the template field list around `controller*` and `subject*` keys.
- Extended the PDF-to-claims mapper so it resolves the newly modeled onboarding fields and keeps the canonical `self` flag typed as boolean.
- Added canonical final-claims builders so onboarding flows can merge:
  - base claims
  - KYC-derived claims
  - controller/subject form fields
  with later explicit form data taking precedence when non-empty.
- Reworked the onboarding claim mapping so:
  - controller identity stays in `Person.*`
  - controller contact stays in `Organization.owner.*`
  - indexed subject identity stays in `Organization.member.*`
- Added onboarding-specific `org.schema` claims for:
  - `Organization.owner.alternateName`
  - `Organization.member.givenName`
  - `Organization.member.familyName`
  - `Organization.member.birthDate`
  - `Organization.member.gender`
  - `Organization.member.identifierType`
  - `Organization.member.identifierValue`
  - `Organization.member.role`
- Updated KYC-to-`org.schema` normalization for individual onboarding so GW CORE and higher SDK layers can reuse one shared controller/member mapping.
- Added claims-first `DocumentReference` draft helpers so onboarding PDFs can travel as:
  - `resource.meta.claims[DocumentReferenceClaim.ContentData]`
  while remaining convertible to FHIR `DocumentReference` later.
- Updated dataspace discovery capability handling so migration can read discovery capabilities from both:
  - `Service.serviceType`
  - `Service.additionalType`
- Added canonical `ActReason` parsing/serialization helpers for
  `Service.additionalType`, including support for the compact shared-system CSV
  form:
  - `http://terminology.hl7.org/CodeSystem/v3-ActReason|METAMGT,HRESCH`
- Tightened dataspace discovery capability parsing so `Service.additionalType`
  only contributes known service capabilities during migration and no longer
  mixes purpose-of-use `ActReason` values into discovery capability sets.
- Reworked onboarding/converter tests to stop hardcoding reusable gender, identifier, signer, and document values inline.

### Testing
- `npm test -- --watchman=false __tests__/utils-individual-form-pdf.test.ts __tests__/utils-individual-organization-kyc.test.ts __tests__/101-individual-onboarding-claims.test.ts __tests__/utils-individual-onboarding-editor.test.ts __tests__/utils-individual-organization-claims.test.ts`
- `npm test -- --watchman=false __tests__/service-capabilities.test.ts __tests__/service-act-reasons.test.ts __tests__/dataspace-discovery.test.ts`
- `npm test -- --watchman=false __tests__/utils-clinical-resource-converters.test.ts __tests__/dataspace-discovery.test.ts`
- `npm run build`

## [1.19.0] - 2026-06-07

### Added
- Added blockchain-oriented consent rule helpers in:
  - `src/utils/consent-blockchain-rules.ts`
  - `src/utils/evidence-blockchain-references.ts`
  - `src/utils/multiformat-profile.ts`
- Added duplicate atomic consent rule detection helpers in:
  - `src/utils/consent-duplicate-rules.ts`
- Added `ConsentAccessEditor` duplicate-conflict readers so frontend/editor
  flows can inspect redundant consent coverage before persistence.
- Added new consent-rule claims for blockchain provenance:
  - `Consent.event-basedon`
  - `Consent.source-reference`

### Changed
- Canonicalized public dataspace service capability usage around `ServiceCapability` with FHIR-aligned persisted values:
  - `ServiceCapability.IndexReader = 'organization/Composition.rs'`
  - `ServiceCapability.IndexProvider = 'organization/Composition.cruds'`
  - `ServiceCapability.DigitalTwinReader = 'organization/ResearchSubject.rs'`
  - `ServiceCapability.DigitalTwinProvider = 'organization/ResearchSubject.cruds'`
- Kept backward compatibility for deprecated persisted values:
  - `indexing.rs`
  - `indexing.cruds`
  - `digitaltwin.rs`
  - `digitaltwin.cruds`
- Updated dataspace discovery examples/tests/docs to teach `ServiceCapability.*` as the public API instead of `ServiceCapabilityToken`.
- Clarified the host-scoped discovery contract so GW host paths now use
  `hostCoverageScope` when available while tenant/provider paths keep
  `jurisdiction`.
- Updated the default hosting-operator authority helper so generated host
  discovery URLs publish `hostCoverageScope` and only fall back to
  `jurisdiction` for backward compatibility.
- Extended `BundleReader` with identifier/index lookup helpers for frontend
  response analysis:
  - `getEntryIdentifierByArrayIndex(...)`
  - `getEntryIndexByIdentifier(...)`
- Updated the bundle-reader `101` and docs so UI code can reopen response rows
  from stored identifiers without relying on remembered array indexes.
- Aligned consent classification coverage with the canonical healthcare section
  taxonomy so IPS (`http://loinc.org|60591-5`) remains classified as
  `kind-of-document` instead of `core-section`.

### Testing
- `npm run typecheck`
- `npm test -- --watchman=false __tests__/utils-consent-blockchain-rules.test.ts __tests__/101-consent-bundle-editor.test.ts __tests__/utils-permission-templates.test.ts`
- `npm test -- --watchman=false __tests__/101-bundle-reader.test.ts`
- `npm test -- --watchman=false __tests__/dataspace-protocol.test.ts __tests__/dataspace-discovery-defaults.101.test.ts`
- `npm test -- --watchman=false __tests__/utils-consent-access-editor-classification.test.ts`
- `npm run build`

## [1.18.0] - 2026-06-05

### Added
- Added canonical `Communication.topic` flat-claim support for communication-attached bundle flows in:
  - `src/models/interoperable-claims/communication-claims.ts`
  - `src/claims/claims-helpers-communication.ts`
  - `src/utils/communication-claim-helpers.ts`
- Added executable consent view-model roundtrip coverage in:
  - `__tests__/101-consent-view-model.test.ts`

### Changed
- Simplified `ConsentViewModel` so frontend-facing consent editing uses `classifiedActors`, `classifiedRoles`, `classifiedPurposes`, and `classifiedTargets` as the public shape while `ConsentAccessEditor` still maps to the canonical flat `Consent` claims on load/save.
- Updated consent bundle examples and `101` coverage so consent `Communication` wrappers carry the consent section topic `LOINC|LP173394-0`.
- Preserved explicit `kind-of-document` target family semantics when rebuilding classified consent targets from persisted flat claims.
- Updated `docs/101-CONSENT_ACCESS.md` to teach the classified consent view-model shape.

### Testing
- `npm test -- --watchman=false __tests__/101-consent-bundle-editor.test.ts __tests__/101-consent-view-model.test.ts`
- `npm run typecheck`
- `npm run build`

## [1.17.0] - 2026-06-04

### Added
- Added canonical permission-template catalog primitives in:
  - `src/models/permission-templates.ts`
  - `src/constants/permission-templates.ts`
  - `src/utils/permission-templates.ts`
- Added deterministic sector-scoped professional role lookups and shared relationship-role lookups for permission-template resolution.
- Added template resolution helpers for canonical and legacy role selectors plus draft generation for permission-grant requests.
- Extended `ConsentAccessEditor` / `CommunicationAttachedBundleSession` with family-aware target catalog and selection helpers, plus purpose and role selection/classification ergonomics for permission-template editing.
- Added executable 101 coverage for separated permission creation/readback in:
  - `__tests__/101-consent-permission-bundle-readwrite.test.ts`
  - `src/examples/communication-attached-bundle-session.ts`

### Testing
- `npm run typecheck`
- `npm test -- --watchman=false __tests__/101-consent-template-bundle-editor.test.ts __tests__/101-consent-bundle-editor.test.ts __tests__/101-consent-permission-bundle-readwrite.test.ts __tests__/utils-consent-access-editor-classification.test.ts __tests__/constants-permission-templates.test.ts __tests__/utils-permission-templates.test.ts __tests__/utils-communication-bundle-document-request.test.ts __tests__/101-communication-search-reference.test.ts __tests__/utils-fhir-search.test.ts`
- `npm run build`

## [1.16.1] - 2026-06-04

### Added
- Added canonical consent-permission template design guidance in:
  - `docs/101-CONSENT_PERMISSION_TEMPLATES.md`
- Added executable coverage for consent classified views in:
  - `__tests__/utils-consent-access-editor-classification.test.ts`
- Added canonical healthcare section family helpers for consent and picker UI:
  - `HealthcareCanonicalSectionFamilies`
  - `getHealthcareSectionFamilyByCode(...)`

### Changed
- Reworked healthcare section taxonomy so the canonical section families are:
  - `core-section`
  - `kind-of-document`
  - `type-of-service`
  - `subject-matter-domain`
  while keeping legacy aliases for compatibility.
- Expanded the healthcare section registry so the clinical summary/core set is
  explicit and the LP workbook families are separated by meaning instead of
  being mixed under generic legacy buckets.
- Updated `ConsentAccessEditor` classified helpers so:
  - `getDecision()` is the canonical reader for permit/deny
  - LOINC targets are normalized as `section`
  - section targets expose `sectionFamily`
  - `document-type` is no longer taught as a separate public target kind in
    consent classified views
- Linked the consent access docs and package README to the new permission
  template planning note so the next implementation block does not depend on
  chat history.

### Testing
- `npm run typecheck`
- `npm test -- --watchman=false __tests__/constants-healthcare-sections.test.ts __tests__/utils-consent-access-editor-classification.test.ts __tests__/101-consent-bundle-editor.test.ts`
- `npm run build`

## [1.16.0] - 2026-06-04

### Added
- Added `BundleEntryEditor` and `EmployeeEntryEditor` on top of the shared
  `BundleEditor` so bundle-level concerns and resource-level concerns stop
  being mixed in the same public API.
- Added the first executable `BundleReader` walkthrough in:
  - `__tests__/101-bundle-reader.test.ts`

### Changed
- Reworked the shared employee editing model so the high-level flow is now:
  - `BundleEditor`
  - `setBundleOperation(...)`
  - `setAllowedResourceType(...)`
  - `newEntry(...).asEmployee()`
  - `doneEntry().build()`
- Kept employee batch bundles homogeneous by requiring an explicit allowed
  resource type and teaching `EmployeeResourceTypes.employee` in docs/tests.
- Removed employee-specific setters from the base `BundleEditor` so the base
  class stays generic and employee semantics live in `EmployeeEntryEditor`.
- Updated the canonical bundle editor / reader `101` and employee tests so
  they explain:
  - bundle vs entry vs resource responsibilities
  - generic claim editing vs employee-specific editing
  - one resource editor per staged entry

### Testing
- `npm run typecheck`
- `npm test -- --watchman=false`
- `npm run build`

## [1.15.0] - 2026-06-04

### Added
- Added the first shared `BundleEditor` foundation in `common-utils`:
  - `src/utils/bundle-editor.ts`
- Added executable employee coverage for the shared editor in:
  - `__tests__/101-employee-examples.test.ts`
- Added canonical bundle editor / reader migration guidance in:
  - `docs/101-BUNDLE_EDITOR_READER.md`

### Changed
- Promoted bundle editing to a shared cross-repo concern owned by
  `gdc-common-utils-ts` instead of leaving employee bundle editing logic
  duplicated in higher SDK layers.
- Added shared employee bundle constants so examples, tests, and higher SDK
  layers stop hardcoding operation and entry literals:
  - `EmployeeBundleOperations`
  - `EmployeeBundleMethods`
  - `EmployeeBundleRoutes`
  - `EmployeeBatchEntryTypes`
- Clarified the `101` documentation layering so:
  - `common-utils` owns the generic bundle editor / reader story
  - `sdk-core` owns the employee business walkthrough
  - `sdk-front` explains Vite/non-confidential vs confidential runtime usage
- Extended the communication-attached consent editor with explicit active-entry
  claim accessors to match the same high-level / low-level teaching pattern as
  employee bundle editing.

### Testing
- `npm run typecheck`
- `npm test -- --watchman=false`
- `npm run build`

## [1.14.10] - 2026-06-02

### Added
- Added executable `101` coverage for the IPS bundle editing path in:
  - `__tests__/101-ips-bundle-editor.test.ts`

### Changed
- Corrected the canonical IPS request path to use:
  - `individual/org.hl7.fhir.r4/Bundle/_search?...`
  instead of the invalid `Bundle?...` form for GW CORE.
- Clarified the IPS and consent `101` guides so:
  - `common-utils` is the canonical place for IPS request construction and IPS
    bundle editing
  - the consent bundle example explains that the edited claims belong to the
    same selected `Consent`, not a second object
- Reduced `common-utils` IPS `101` noise by keeping DIDComm wrapping out of the
  main short path.

### Testing
- `npm test -- --watchman=false`
- `npm run build`

## [1.14.3] - 2026-06-01

### Added
- Added convenience builders for default-first discovery seeding from a single
  domain/IP authority:
  - `buildDefaultIcaRegistrationFromAuthority(...)`
  - `buildDefaultHostingOperatorRegistrationFromAuthority(...)`

### Changed
- Simplified the `default-first` bootstrap docs so integrators can seed ICAs
  and host defaults from authority values instead of manually assembling
  `did:web`, discovery URLs, and full registration objects.

### Testing
- `npm run typecheck`
- `npm test -- --watchman=false __tests__/dataspace-discovery-defaults.101.test.ts __tests__/dataspace-discovery.test.ts __tests__/dataspace-protocol.test.ts`

## [1.14.0] - 2026-06-01

### Added
- Added shared defaults/bootstrap contracts for portal/backend discovery:
  - `DataspaceDiscoverySourceMode`
  - `DefaultIcaRegistration`
  - `DefaultHostingOperatorRegistration`
  - `DataspaceDiscoveryBootstrapInput`
  - `DataspaceDiscoveryBootstrapPlan`
- Added the in-memory defaults registry helpers:
  - `DataspaceDiscoveryDefaultsRegistry`
  - `createDataspaceDiscoveryDefaultsRegistry(...)`
- Added executable `101` coverage for:
  - ICA defaults by `jurisdiction + version + networkType`
  - hosting defaults by `jurisdiction + version + networkType`
  - `defaults-only`
  - `default-first`
  - `internet-first`
- Added copy/paste backend bootstrap documentation in:
  - `docs/101-DATASPACE_DISCOVERY_DEFAULTS.md`

### Changed
- Updated the shared discovery README/docs so portal/backend integrations teach:
  - `networkType` on the host/ICA side
  - `sector` on the tenant/provider side
  - `default-first` as the current unblock-now bootstrap policy

### Testing
- `npm run typecheck`
- `npm test -- --watchman=false __tests__/dataspace-discovery-defaults.101.test.ts __tests__/dataspace-discovery.test.ts __tests__/dataspace-protocol.test.ts`

## [1.12.0] - 2026-05-29

### Added
- Added shared dataspace discovery coverage helpers:
  - `EU_COUNTRY_CODES`
  - `normalizeCountryCode(...)`
  - `isEuCountryCode(...)`
- Added canonical service-discovery Schema.org claim constant:
  - `ClaimsServiceSchemaorg.areaServed`
- Added runtime-neutral dataspace discovery DTOs:
  - `DataspaceCoverageScope`
  - `DataspaceServiceSemanticRecord`
  - `HostingOperatorSemanticRecord`
  - `TenantServiceSemanticRecord`
  - `PublishedProviderCatalogRecord`
- Added shared dataspace discovery parsing helpers:
  - `parseServiceTypeCsv(...)`
  - `parseServiceCategories(...)`
  - `parseAreaServed(...)`
  - `extractDataspaceServiceSemanticRecord(...)`
  - `extractHostingOperatorSemanticRecord(...)`
  - `extractTenantServiceSemanticRecord(...)`
  - `inferCoverageScopeFromCountryCode(...)`
  - `inferCoverageScopeFromCredentialSubject(...)`
- Added parameterized dataspace discovery examples without hardcoded business deployment identities:
  - `buildExampleHostingOperatorCredentialSubject(...)`
  - `buildExampleTenantServiceCredentialSubject(...)`
  - `buildExampleHostingOperatorMetaClaims(...)`
  - `buildExampleTenantServiceMetaClaims(...)`
- Added roadmap documentation for the cross-repo dataspace discovery foundation:
  - `docs/DATASPACE_DISCOVERY_ROADMAP.md`

### Changed
- Updated repository TODO documents so the common-utils package is the
  canonical home for:
  - shared EU coverage logic
  - semantic `credentialSubject` parsing
  - flattened `meta.claims` compatibility projection
  - parameterized dataspace discovery examples

### Testing
- `npm run typecheck`
- `npm test -- --watchman=false __tests__/dataspace-discovery.test.ts __tests__/eu-countries.test.ts __tests__/constants-schemaorg-claims.test.ts`

## [1.11.0] - 2026-05-28

### Added
- Added explicit JOSE signature algorithm typing for VP/JWT helper headers:
  - `ClassicalJoseSignatureAlgorithms`
  - `JoseSignatureAlgorithm`
- Added canonical organization software/key-binding schema.org claim constant:
  - `ClaimsOrganizationSchemaorg.hasCredentialMaterial`
- Added explicit software-application schema.org claim constants:
  - `ClaimsSoftwareApplicationSchemaorg`
- Added self-explanatory focused tests for:
  - JOSE algorithm vocabulary
  - schema.org key-binding claims
  - `101-` VP-token walkthrough

### Changed
- Renamed the VP walkthrough test to `__tests__/101-vp-token.test.ts` so `101`
  tests stay visually grouped.
- Clarified `docs/101-VP_TOKEN.md` around:
  - `Organization.hasCredential.material`
  - `Person.hasCredential.material`
  - `SoftwareApplication.material`
  - RFC 7638 JWK thumbprints and RFC 9278 URN representation
- Simplified the shared ICA legal-onboarding fixture so the representative
  credential now shows the controller signing key id directly in:
  - `credentialSubject.id`
  - `credentialSubject.hasCredential.material`
- Tightened `VpTokenHeader.alg` so examples/tests document supported JOSE
  signing algorithms such as `ES256K`, `ES384`, and `ML-DSA-*`.

### Testing
- `npm run typecheck`
- `npm test -- --watchman=false`
- `npm run build`

## [1.10.0] - 2026-05-27

### Added
- Added clearer service-capability names for tenant activation and discovery:
  - `ServiceCapabilityToken.IndexReader`
  - `ServiceCapabilityToken.IndexProvider`
  - `ServiceCapabilityToken.DigitalTwinReader`
  - `ServiceCapabilityToken.DigitalTwinProvider`
- Added backward-compatible deprecated aliases for the previous token names so
  existing SDK and GW consumers keep working during migration.

### Changed
- Updated `docs/101-VP_TOKEN.md` so legal-organization and software/runtime VP
  flows are documented separately and no longer appear mixed in one payload.
- Added a mockable `SoftwareApplication` VC example with
  `schema.org/SoftwareApplication` semantics and communication-key binding
  guidance for current ICA runtime-proof work.
- Updated shared organization-controller examples to use the clearer capability
  names.

### Testing
- `npm test`
- `npm run typecheck`

## [1.7.1] - 2026-05-27

### Added
- Added `docs/101-VP_TOKEN.md` as the canonical step-by-step guide for building
  ICA/GW `vp_token` proofs, including separate controller-onboarding and
  software/runtime proof examples.

### Changed
- Extended `src/utils/vp-token.ts` so VP builders accept VC inputs as:
  - compact JWT/JWS strings
  - raw JSON strings
  - direct VC JSON objects
- Clarified JSDoc and examples around presenter-specific signing keys such as
  `controllerSigningKeyId` and `runtimeSigningKeyId`.
- Updated README links and VP-token tests to cover mixed compact/JSON VC inputs.

### Testing
- `npm test`
- `npm run typecheck`

## [1.7.0] - 2026-05-26

### Added
- Added canonical service-capability contracts for legal-organization activation:
  - `src/constants/service-capabilities.ts`
  - `ServiceCapability`
  - `ServiceCapabilityToken`
  - capability parse/serialize helpers for `org.schema.Service.serviceType`
- Added canonical activation-proof constants/examples for ICA-backed onboarding:
  - `src/constants/verifiable-credentials.ts`
  - `src/examples/ica-activation-proof.ts`

### Changed
- Reworked shared examples/tests to reduce hardcoded repeated claims and fixture values in favor of imported constants and shared synthetic examples.
- Extended the shared activation-policy representative binding extraction so ICA compatibility accepts:
  - `hasCredential.material`
  - `hasCredential.value`
  - `hasCredential.identifier.value`
- Normalized communication/consent/clinical example surfaces around shared constants and healthcare codings.
- Added explicit code/test guidance comments on touched files to reinforce JSDoc, imported keys, and shared fixture reuse.

### Testing
- `npm run typecheck`
- focused Jest coverage for activation-policy, VP token, communication, consent, FHIR CID, and clinical resource converter suites
- package build verified before publish

## [1.6.0] - 2026-05-25

### Added
- Added canonical lifecycle example surface for cross-repository reuse:
  - `src/examples/lifecycle.ts`
  - `docs/101-LIFECYCLE.md`
  - exported via `examples`, `api-flow-examples`, and `contract-examples`
- Added shared individual onboarding PDF claim derivation helper:
  - `src/utils/individual-form-pdf.ts`
  - `buildClaimsFromIndividualFormPdf(...)`
  - `parseDistinguishedName(...)`
- Added shared unit coverage for individual PDF claim derivation in:
  - `__tests__/utils-individual-form-pdf.test.ts`
- Added canonical organization owner identifier claim constant:
  - `org.schema.Organization.owner.identifier.value`

### Changed
- Clarified and tightened communication identity bootstrap semantics:
  - `initializeCommunicationIdentity(...)` is now the canonical helper name
  - deterministic mode requires explicit `seedMaterial`
  - random mode is the default when no explicit seed is provided
  - kept `initializeCommunicationIdentityFromSeed` as a compatibility alias
- Clarified shared naming/documentation guidance for actor examples:
  - prefer `subjectDid`, `professionalDid`, `orgControllerDid`, and `individualControllerDid`
  - avoid teaching legacy variable names such as `individualDidWeb` as the default semantic names
- Adjusted professional SMART examples so the first tutorial path is read-only by default.
- Moved the English briefing baseline to `docs/BRIEFING_DATASPACE_EN.md`.

### Testing
- Verified package typecheck and build before publication.

## [1.5.1] - 2026-05-24

### Added
- Added shared consent-access models and examples:
  - `ConsentCoverageRequest`
  - `EffectiveAccessEvaluation`
  - `MissingPermissionSet`
  - `ActiveConsentView`
  - reusable consent access matrix examples under `src/examples/consent-access.ts`
- Added `docs/101-CONSENT_ACCESS.md` as the shared cross-repository guide for dynamic consent evaluation.

### Changed
- Extended `src/utils/consent.ts` with shared consent-access helpers for:
  - target normalization
  - actor resolution
  - active-rule grouping
  - effective access evaluation
  - missing-permission explanation
- Clarified consent precedence documentation to describe the first tier as concrete email permit/deny semantics while keeping the existing selector support surface.

### Testing
- Added consent-access matrix coverage in `__tests__/utils-consent.test.ts`, including direct email, organization, jurisdiction, explicit deny, revoked consent, and related-person cases.

## [1.5.0] - 2026-05-23

### Added
- Promoted the shared bootstrap, DID resolution, discovery normalization, and consent example foundations to the next minor release surface.
- Added reusable API flow examples, SMART scope helpers, VP extraction helpers, and the consent access matrix task document as shared package artifacts.

### Changed
- Clarified the separation between transport identity and person/controller signing identity across the shared contracts and JSDoc.
- Standardized canonical bootstrap/discovery constants and `service[]` resolution helpers for GW and SDK consumers.

### Testing
- Verified the release surface with `44/44` passing suites and `199/199` passing tests before publish.

## [1.4.22] - 2026-05-23

### Added
- Added canonical bootstrap contracts for `_activate` and explicit controller key binding:
  - `ControllerBindingInput`
  - `OrganizationBindingInput`
  - `OrganizationActivationRequest`
  - validation issue/result shapes
- Added DID/discovery constants and pure helpers for canonical endpoint resolution:
  - `DidServiceIds`
  - `DidServiceTypes`
  - `DiscoveryCapabilities`
  - DID `service[]` extraction helpers
  - provider/organization DID derivation helpers
- Added normalized identity/result models:
  - `DidResolutionResult`
  - `ResolvedServiceEndpoint`
  - `ActorIdentity`
  - `TransportIdentity`
- Added pure normalization helpers for ICA, node-operator, and service-provider discovery metadata.
- Added shared canonical API flow examples under `src/examples/api-flow-examples.ts`:
  - reusable request examples
  - reusable response examples
  - frontend session/profile examples
  - SMART/bootstrap/discovery-oriented payload builders
- Kept `src/examples/contract-examples.ts` only as a compatibility alias while consumers migrate away from the overloaded `contract` name.

### Changed
- Clarified `communication-identity` JSDoc so technical transport identity is explicitly distinct from person/controller signing identity.
- Added explicit bootstrap claim constants:
  - `controller.did`
  - `controller.sameAs`
  - `controller.publicKeyJwk`
  - `controller.jwks`
  - `organization.publicKeyJwk`
  - `organization.jwks`

### Testing
- Added unit coverage for activation-request validation, DID service resolution, and discovery normalization.

## [1.4.21] - 2026-05-20

### Changed
- MedicationStatement clinical converters aligned to canonical claims and IPS-first capture semantics:
  - keeps `MedicationStatement.effective` as canonical date/time search claim,
  - supports `MedicationStatement.note` as primary captured human text,
  - supports `MedicationStatement.dosage-instruction`,
  - supports `MedicationStatement.medication-text`,
  - supports `MedicationStatement.medication-identifier`,
  - supports `MedicationStatement.medication-serial-number`,
  - supports `MedicationStatement.medication-expiration-date`.
- Mapping now projects medication artifact claims to `MedicationStatement.contained[]` (`Medication`) plus `medicationReference` in FHIR R4.

### Tests
- Expanded roundtrip conversion tests to include canonical medication claims and contained Medication mapping assertions.

### Inventory
- Complete modified file inventory for this branch snapshot:
  - `AGENTS.md`
  - `__tests__/utils-clinical-resource-converters.test.ts`
  - `src/utils/clinical-resource-converters.ts`

## [1.4.20] - 2026-05-18

### Changed
- Documented npm publish authentication flow using `NPM_TOKEN` loaded from `~/.zshrc`.

## [1.4.19] - 2026-05-18

### Changed
- Canonicalized legal-representative occupation extraction to support `credentialSubject.hasOccupation.identifier.value`.
- Kept backward-compatible normalization for legacy role tokens (`|RESPRSN`, `v3-RoleCode|RESPRSN`) while validating against canonical code value.

## [1.4.17] - 2026-05-18

### Added
- Added shared activation representative policy utils in `src/utils/activation-policy.ts`:
  - DID extraction for credentials (`extractDidWebFromCredential`)
  - legal representative policy validation (`validateActivationRepresentativePolicy`)
  - member DID helpers (`buildMemberDidWeb`, `isMemberDidWebUnderOwner`) with canonical `:member:<member-id>:<role>` shape.
- Added tests in `__tests__/utils-activation-policy.test.ts` for representative policy and member DID hierarchy.

## [Unreleased] - 2026-05-06

### Added
- Added VP token builder helpers in `utils/vp-token`:
  - `addVCs(vpPayload, vcs)` for batch VC append
  - `addOrganizationCredential(...)` with VC type guard
  - `addLegalRepresentativeCredential(...)` with VC type guard
- Added canonical schema.org person claims for controller/legal-representative activation flows:
  - `org.schema.Person.memberOf.taxID`
  - `org.schema.Person.hasCredential.material`
- Added unit test coverage for the new claim constants.
- Added canonical DocumentReference claim key:
  - `DocumentReference.contenthash`
  - included in claim specs and FHIR path mapping guidance.
- Added interoperable claim catalogs for:
  - `AllergyIntolerance.*`
  - `Condition.*`
  - `DeviceUseStatement.*`
- Added bidirectional flat-claims converters for:
  - `MedicationStatement`
  - `AllergyIntolerance`
  - `Condition`
  - `DeviceUseStatement`
  - `DocumentReference`
- Added roundtrip and validation tests:
  - `__tests__/utils-clinical-resource-converters.test.ts`

### Changed
- Clarified Communication/DocumentReference conversion profile docs and JSDoc:
  - atomic profile constraints are explicit profile rules (not native FHIR limitations),
  - DocumentReference semantics distinguish logical identifier vs content hash/CID.

### Notes
- These claims are intended to support the ICA -> GW trust chain used in `_activate`:
  - `memberOf.taxID` binds representative to organization (`Organization.identifier.value`).
  - `hasCredential.material` binds the representative signing key used to sign `vp_token`.
