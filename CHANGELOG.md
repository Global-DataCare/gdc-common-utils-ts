# Changelog

All notable changes to `gdc-common-utils-ts` will be documented in this file.

## [Unreleased]

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
