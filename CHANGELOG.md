# Changelog

All notable changes to `gdc-common-utils-ts` will be documented in this file.

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
- Clarified `docs/VP_TOKEN_101.md` around:
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
- Updated `docs/VP_TOKEN_101.md` so legal-organization and software/runtime VP
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
- Added `docs/VP_TOKEN_101.md` as the canonical step-by-step guide for building
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
  - `docs/LIFECYCLE_101.md`
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
- Added `docs/CONSENT_ACCESS_101.md` as the shared cross-repository guide for dynamic consent evaluation.

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
