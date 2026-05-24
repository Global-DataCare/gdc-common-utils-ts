# Changelog

All notable changes to `gdc-common-utils-ts` will be documented in this file.

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
