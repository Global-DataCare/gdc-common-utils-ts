# gdc-common-utils-ts

See [ARCHITECTURE.md](./ARCHITECTURE.md) and
[CONTRIBUTING.md](./CONTRIBUTING.md) before adding new shared helpers,
fixtures, or high-level tests.

Short rule:

- if a test/example can reuse a shared type or fixture, it must do so
- do not add ad hoc literals in `101` tests when `gdc-common-utils-ts` can own
  the reusable value instead

## Shared Workspace

Recommended local layout for the shared ICA/GDC repos and fixture PDFs:

```text
~/GITS/gdc-workspace/
  dataspace-ica-ts/
  ica-client-sdk-ts/
  gdc-common-utils-ts/
  examples/
    <example-pdf-1>.pdf
    <example-pdf-2>.pdf
```

This is recommended because:

- cross-repo docs and fixture-based tests often refer to sibling repos
- real PDF examples are expected under `~/GITS/gdc-workspace/examples/`
- keeping a single shared workspace reduces path drift between repos

Employee shared examples live in `src/examples/employee.ts`.
Employee pure helper functions live in `src/utils/employee.ts`.

The canonical employee editor note lives in
[`docs/101-EMPLOYEE_ENTRY_EDITOR.md`](docs/101-EMPLOYEE_ENTRY_EDITOR.md).

Shared TypeScript utilities for GDC client and connector code. This package provides low-level primitives for cryptography, DID/DIDComm-related helpers, and the shared models and interfaces used across SDKs.

It is intentionally not a full backend orchestration layer.

## Prior Work

Part of the FHIR conversion layer in this repository builds on earlier work
from the Universal Health Chain repository:

- `uhc-fhir-utils-ts`
- https://github.com/Universal-Health-Chain/uhc-fhir-utils-ts

The current `src/convert` and `src/claims` layers adapt and extend that prior
work to the claims-first contracts, IPS bundle workflows, and package
boundaries used in `gdc-common-utils-ts`.

## Non-Negotiable Conventions

- FHIR SearchParameter names must use canonical FHIR naming (lowercase, with `-` when defined by FHIR).
- Never use invented camelCase parameter names for FHIR claims/search keys (example: `Communication.part-of` is valid, `Communication.partOf` is not).
- Only define custom names when no canonical FHIR SearchParameter exists.
- `resource.meta.claims` is the canonical project-specific claims container and must be preserved across conversions/transports.
- `resource.meta.claims` is not part of base FHIR; it is a claims-first extension carried by FHIR-like resources in GDC contracts.

## Identity Continuity

For ICA-backed organization activation, the representative/controller proof is
intentionally split into two complementary dimensions:

- `credentialSubject.sameAs`
  public identity continuity, typically an email-derived
  `urn:multibase:z...`
- `credentialSubject.hasCredential.material`
  signing-key continuity, ideally an RFC 9278 JWK-thumbprint URN bound to the
  controller key that signs the VP or was captured during ICA verification

They are not interchangeable:

- `sameAs` does not prove possession of the signing key
- `hasCredential.material` does not by itself prove the expected public alias
  or email continuity

Production-grade flows should prefer ICA-issued representative VCs that carry
both dimensions.

## Legal Organization Verification Transaction

The first host-side legal-organization onboarding step now has one canonical
shared payload builder in this package:

- `buildLegalOrganizationVerificationTransactionBundle(...)`
- `EXAMPLE_LEGAL_ORGANIZATION_VERIFICATION_TRANSACTION_BUNDLE`

This builder owns the business payload only:

- signed PDF evidence attachment references
- `controller.publicKeyJwk` as the controller business binding key
- optional `organization.publicKeyJwk`
- legal representative payload
- `meta.claims` business claims

It intentionally does not own:

- `fetch`
- polling
- JOSE transport execution
- BFF/frontend runtime crypto

Those runtime concerns belong in `gdc-sdk-node-ts`, `gdc-sdk-front-ts`, or GW.

Step by step:

1. ICA verifies the signed PDF and emits the representative VC.
2. ICA projects `credentialSubject.sameAs` from signed email evidence when available.
3. ICA projects `credentialSubject.hasCredential.material` from the captured controller binding key.
4. GW/common-utils enforce key-binding continuity as the hard activation requirement.
5. Higher layers may additionally compare `sameAs` for stronger identity/audit continuity.

## 101 Test Convention

Every `101` test in this repo is expected to be a didactic executable tutorial,
not only a behavior check.

Required shape for `101` tests:

- start with a short `Teaching goal` comment block
- explain the main app/business flow, not only internal plumbing
- use explicit `Step 1.`, `Step 2.`, ... comments for the happy path
- make clear what the user/app already has, what is shown, what is edited,
  what is saved, and what is reloaded
- if a low-level helper path is shown, mark it explicitly as an escape hatch
  and not the primary `101` path

The goal is that a developer can read the test top-to-bottom as tutorial
material without needing chat history or private repo context.

If you need the canonical explanation of how DIDComm envelope, batch body,
entry types, FHIR-like resources, and `resource.meta.claims` fit together,
read first:

- [`docs/101-ID_TOKEN.md`](docs/101-ID_TOKEN.md)
- [`docs/101-COMMUNICATION_LAYERING.md`](docs/101-COMMUNICATION_LAYERING.md)
- [`docs/101-BUNDLE_EDITOR_READER.md`](docs/101-BUNDLE_EDITOR_READER.md)
- [`docs/101-CLINICAL-IPS.md`](docs/101-CLINICAL-IPS.md)
- [`docs/REFERENCE-CLINICAL-IPS-API.md`](docs/REFERENCE-CLINICAL-IPS-API.md)
- [`docs/101-CONSENT_PERMISSION_TEMPLATES.md`](docs/101-CONSENT_PERMISSION_TEMPLATES.md)

## Install

```bash
npm install gdc-common-utils-ts
```

## What It Exports

The published package exposes these entry points through `package.json`:

- Root: `gdc-common-utils-ts`
- `gdc-common-utils-ts/AesManager`
- `gdc-common-utils-ts/CryptographyService`
- `gdc-common-utils-ts/hmac`
- `gdc-common-utils-ts/examples`
- `gdc-common-utils-ts/examples/*`
- `gdc-common-utils-ts/claims`
- `gdc-common-utils-ts/constants`
- `gdc-common-utils-ts/convert`
- `gdc-common-utils-ts/models`
- `gdc-common-utils-ts/utils`
- `gdc-common-utils-ts/interfaces`
- File-level subpaths under `claims/*`, `constants/*`, `models/*`, `utils/*`,
  and `interfaces/*` plus `convert/*`

### Root crypto exports

The package root re-exports the main crypto helpers:

- `AesManager`
- `CryptographyService`
- `computeHmacSha256`
- `computeHmacSha256Base64Url`

Example:

```ts
import { AesManager, CryptographyService, computeHmacSha256Base64Url } from 'gdc-common-utils-ts';
```

### Utilities

The `utils` export exposes reusable helpers for DID and message handling, such as:

- `utils/did` helpers like `generateServiceId`, `normalizeDidWeb`, `createHostedDidWeb`, `buildHostedDidDetails`, and `getBaseUrlFromDidWeb`
- `utils/jwt`
- `utils/content`
- `utils/normalize`
- `utils/fhir-cid` for recursive FHIR canonicalization + CID generation + `meta.versionId` assignment
- `utils/fhir-validator` for adapter-based FHIR validation (`validateFhirResource`, pluggable formal validator)
- conversion, formatting, and multibase helpers

These helpers support DIDComm-style message construction and related transport/data-shaping workflows.

Example:

```ts
import { normalizeDidWeb, generateServiceId } from 'gdc-common-utils-ts/utils/did';
import { fhirResourceToCid, assignCidToFhirResourceVersionId } from 'gdc-common-utils-ts/utils/fhir-cid';
```

### Convert

The `convert` export exposes resource-specific FHIR R4 conversion helpers such as:

- `medicationStatementFlatToFhirR4`
- `medicationStatementFhirR4ToFlat`
- `observationFromFlatToFhirR4`
- `documentReferenceFlatToFhirR4`
- `compositionFlatToFhirR4`

Example:

```ts
import {
  medicationStatementFlatToFhirR4,
  observationToFlatFhirR4,
} from 'gdc-common-utils-ts/convert';
```

### Claims

The `claims` export exposes resource-specific flat claim helpers such as:

- `setMedicationIdentifier`
- `getMedicationCategoryList`
- `setCommunicationCategory`
- `setActorRoleList`
- `addSectionList`

Example:

```ts
import {
  setMedicationIdentifier,
  setMedicationCategoryList,
} from 'gdc-common-utils-ts/claims/claims-helpers-medication-statement';
```

### Models

The `models` export contains the shared data shapes used by the SDKs, including:

- cryptographic and JOSE shapes such as `aes`, `jwe`, `jws`, `jwt`, and `jwk`
- DID and DIDComm-related models such as `did`, `comm`, and `verifiable-credential`
- confidential transport and storage models
- auth, device, response, issue, and FHIR-oriented models

Example:

```ts
import { JweObject, JwtCompactParts } from 'gdc-common-utils-ts/models';
```

## Cross-Repo Task Docs

- [docs/DATASPACE_DISCOVERY_ROADMAP.md](docs/DATASPACE_DISCOVERY_ROADMAP.md)
  - cross-repo contract for dataspace discovery semantics, EU coverage
    inference, shared DTOs, and parameterized examples
- [docs/101-DATASPACE_DISCOVERY_DEFAULTS.md](docs/101-DATASPACE_DISCOVERY_DEFAULTS.md)
  - portal/backend bootstrap guide for `defaults-only`, `default-first`, and
    `internet-first` discovery seeding by `jurisdiction + version + networkType`
- [docs/consent-access-matrix-task.md](docs/consent-access-matrix-task.md)
  - next-step design/task document for active consent aggregation, explicit deny precedence, controller views, permission-request communications, and SMART access evaluation
- [docs/101-CONSENT_PERMISSION_TEMPLATES.md](docs/101-CONSENT_PERMISSION_TEMPLATES.md)
  - canonical design note for role/relationship permission templates, front
    pickers, actor/target/purpose classification, and consent import/export
    planning
- [docs/101-IPS_BUNDLE.md](docs/101-IPS_BUNDLE.md)
  - canonical 101 for requesting IPS, editing IPS-style bundles in `Communication.content-attachment-data`, and reading resources by section
- [docs/101-CLINICAL-IPS.md](docs/101-CLINICAL-IPS.md)
  - shortest high-level onboarding for `ipsBundleReader`, section summaries,
    family queries, and UI-ready narrative helpers
- [docs/REFERENCE-CLINICAL-IPS-API.md](docs/REFERENCE-CLINICAL-IPS-API.md)
  - canonical claim/method matrix with `TODO` coverage for missing typed
    `get...` / `set...` helpers

## Dataspace Protocol And Discovery

Use `gdc-common-utils-ts` as the shared source of truth for DSP route building,
`dspace-version` metadata, and normalized discovery DTOs.

Main entry points:

- [`src/utils/dataspace-protocol.ts`](src/utils/dataspace-protocol.ts)
  - canonical GW CORE path builders for host-scoped and tenant-scoped DSP
    routes
- [`src/utils/dataspace-discovery.ts`](src/utils/dataspace-discovery.ts)
  - semantic extraction, provider filtering, default DTO builders, and the
    copy/paste fetcher harness used by docs/tests
- [`src/utils/dataspace-discovery-defaults.ts`](src/utils/dataspace-discovery-defaults.ts)
  - defaults registry for ICAs and hosting operators plus the backend
    `default-first` bootstrap plan used to unblock portal integration
  - includes authority-based helpers so integrators can seed from a single
    domain/IP instead of manually assembling `did:web` and discovery URLs
- [`src/examples/dataspace-discovery.ts`](src/examples/dataspace-discovery.ts)
  - synthetic provider/operator examples that distinguish discovery URL from
    derived catalog artifact URL
- [`docs/101-DATASPACE_DISCOVERY_DEFAULTS.md`](docs/101-DATASPACE_DISCOVERY_DEFAULTS.md)
  - copy/paste backend bootstrap guide for portal `default-first` rollout
- [`__tests__/dataspace-discovery-defaults.101.test.ts`](__tests__/dataspace-discovery-defaults.101.test.ts)
  - executable defaults-registry examples for ICAs, hosting operators, and
    source-mode behavior
- [`__tests__/dataspace-protocol.test.ts`](__tests__/dataspace-protocol.test.ts)
  - executable path and `dspace-version` examples
- [`__tests__/dataspace-discovery.test.ts`](__tests__/dataspace-discovery.test.ts)
  - executable semantic extraction and filtering examples

Copy/paste example:

```ts
import {
  buildDspaceVersionMetadata,
  buildGwCatalogArtifactPath,
  buildGwDspaceVersionWellKnownPath,
  deriveGwCatalogArtifactUrlFromDspaceVersion,
} from 'gdc-common-utils-ts/utils/dataspace-protocol';
import { HostNetworkTypes } from 'gdc-common-utils-ts/constants/network';

const hostContext = {
  participantId: 'host',
  hostCoverageScope: 'EU',
  jurisdiction: 'ES',
  version: 'v1',
  hostNetwork: HostNetworkTypes.Test,
};

const discoveryPath = buildGwDspaceVersionWellKnownPath(hostContext);
const metadata = buildDspaceVersionMetadata('/host/cds-EU/v1/test/dsp');
const catalogPath = buildGwCatalogArtifactPath(hostContext);
const catalogUrl = deriveGwCatalogArtifactUrlFromDspaceVersion(
  `https://host.example.org${discoveryPath}`,
  metadata,
);
```

## API Index

The canonical API contract should live in JSDoc on exported code. The README acts as a navigable index.

### Shared terminology constants

- [`FhirCodeSystems`](src/constants/fhir-code-systems.ts)
  - Canonical code system URLs such as `Loinc` and `CommunicationCategory`.
  - Use instead of inline system strings like `http://loinc.org`.
- [`ResourceTypesFhirR4`](src/constants/fhir-resource-types.ts)
  - Canonical FHIR R4 `resourceType` names such as `Communication`, `Bundle`, `DocumentReference`, `Observation`, `MedicationStatement`, `Consent`.
  - Use instead of inline resource type strings.
- [`CommunicationCategoryCodes`](src/constants/communication.ts)
  - Canonical `Communication.category` coding descriptors and `<system>|<code>` claims.
- [`ObservationCategoryCodes`, `VitalSignsCodes`, `VitalSignsUnits`](src/constants/vital-signs.ts)
  - Canonical Vital Signs category, code, and UCUM unit descriptors for `Observation`.
- [`HealthcareBasicSections`, `HealthcareAdditionalSections`, `HealthcareAllSections`](src/constants/healthcare.ts)
  - Shared IPS/healthcare document section catalogs.
- [`HealthcareConsentPurposes`, `HealthcareConsentActions`, `HealthcareActorRoles`, `HealthcareActorRoleCodes`](src/constants/healthcare.ts)
  - Shared healthcare authorization and role constants.
- [`EXAMPLE_PROFESSIONAL_ACCESS_SCENARIOS`](src/examples/professional.ts)
  - Reusable professional role/permission examples tying actor role, consent action, SMART scope, and expected FHIR resource types together.
- [`DeviceUserClasses`, `DeviceAppTypes`](src/constants/device.ts)
  - Shared user-class and app/device-type constants used by licensing and SDK flows.
- [`HostNetworkTypes`](src/constants/network.ts)
  - Shared network/environment labels for host discovery/bootstrap.
- [`SmartGatewayScopesFhirR4`](src/constants/smart.ts)
  - Current CORE GW SMART scope literals such as `organization/Consent.cruds`.
  - Treat these as optional elevated scopes. Do not add them to the first read-only tutorial by default.

### Root exports

- [`AesManager`](src/AesManager.ts)
  - AES helper class exported from the package root.
- [`CryptographyService`](src/CryptographyService.ts)
  - Main cryptography service implementation exported from the package root.
- [`computeHmacSha256(...)`, `computeHmacSha256Base64Url(...)`](src/hmac.ts)
  - Low-level HMAC helpers for UTF-8 plaintext and raw key bytes.

### Communication / document utilities

- [`initializeCommunicationIdentity(...)`](src/utils/communication-identity.ts)
  - bootstraps the technical communication profile identity for a device/app/channel runtime
  - do not teach its `entityId` as if it were the legal organization id
  - Derives the technical ML-DSA/ML-KEM communication identity for a device, portal, or app profile and returns JOSE header templates for `meta.jws.protected` and `meta.jwe.header`.
  - Uses explicit `seedMaterial` for deterministic derivation. Without `seedMaterial`, it defaults to random generation. `mode = deterministic` requires `seedMaterial`.
- [`buildOrganizationDidWeb(...)`, `buildProfessionalDidWeb(...)`, `buildIndividualDidWeb(...)`](src/utils/did.ts)
  - Build canonical data-space `did:web` identifiers for hosted organizations, professionals, and individuals/family actors.
- [`buildSmartCompositionReadScope(...)`](src/utils/smart-scope.ts)
  - Builds the current CORE GW pinned SMART root scope for `organization/Composition...` token requests.
  - This is the preferred first scope to teach when the backend only needs subject-scoped read access.
- [`getOrganizationCredentialFromVpToken(...)`, `getLegalRepresentativeCredentialFromVpToken(...)`](src/utils/vp-token.ts)
  - Extract typed VC objects from a VP token when GW/SDK flows carry canonical proof only in `vp_token`.
- [`docs/101-VP_TOKEN.md`](docs/101-VP_TOKEN.md)
  - Step-by-step guide for building the canonical compact `vp_token` string from organization and representative VCs.
- [`validateCommunicationResourceFhirR4(...)`](src/utils/communication-fhir-r4.ts)
  - Validates FHIR R4 `Communication` resources.
- [`transformCommunicationClaimsToResourceFhirR4(...)`](src/utils/communication-fhir-r4.ts)
  - Converts canonical communication claims into FHIR R4 resources.
- [`extractCommunicationClaimsFromResourceFhirR4(...)`](src/utils/communication-fhir-r4.ts)
  - Extracts canonical claims from FHIR R4 `Communication`.
- [`detectAttachmentKind(...)`](src/utils/communication-document-reference.ts)
  - Detects `fhir` / `pdf` / `png` / `jpg` / `binary` from MIME type.
- [`buildDocumentReferenceFromCommunicationPayload(...)`](src/utils/communication-document-reference.ts)
  - Projects a simplified `DocumentReference` from `Communication.payload[0].contentAttachment`.

### Identity bootstrap / discovery utilities

- [`DidServiceIds`, `DidServiceTypes`, `DiscoveryCapabilities`](src/constants/did-services.ts)
  - Canonical DID service ids, service types, and capability names used to publish and resolve `service[]` entries consistently across GW and SDK layers.
- [`ControllerBindingInput`, `OrganizationBindingInput`, `ActivationProofInput`, `OrganizationActivationRequest`](src/models/identity-bootstrap.ts)
  - Canonical bootstrap contracts that explicitly separate person/controller key binding from provider/organization key binding.
  - `vp_token` is the canonical proof carrier; `controller.*` and `organization.*` carry public key binding material for DID publication.
- [`buildControllerBindingInput(...)`, `buildOrganizationBindingInput(...)`](src/utils/activation-request.ts)
  - Build canonical `controller.*` and `organization.*` binding fragments from semantic variables such as `publicSignKey`, `publicKeys`, `did`, `sameAs`, or `url`.
- [`RelationshipChannelInvitationInput`, `RelationshipChannelInvitationSummary`, `RelationshipChannelOtpStartInput`, `RelationshipChannelOtpConfirmInput`](src/models/relationship-access.ts)
  - Shared contracts for controller-driven invitation and acceptance flows between an individual/subject and a related person or professional across phone, email, and app channels.
- [`RelationshipEnrollmentChannels`, `RelationshipSubjectKinds`, `RelationshipAccessActorKinds`, `RelationshipOtpDeliveryChannels`](src/models/relationship-access.ts)
  - Shared constant objects for relationship flows so docs and app code do not hardcode actor kinds or channel labels inline.
- [`RelationshipChannelOtpChallengeSummary`, `RelationshipPinPolicy`, `RelationshipPinSetInput`, `RelationshipPinVerifyInput`, `RelationshipLocalKeyEnvelope`](src/models/relationship-access.ts)
  - Shared OTP, relationship PIN, and offline-first local-key envelope contracts for channel enrollment and subject-scoped local protection.
- [`IdentityBootstrapValidationIssue`, `IdentityBootstrapValidationResult`](src/models/identity-bootstrap.ts)
  - Shared validation result shapes used by bootstrap builders/validators.
- [`buildOrganizationActivationRequest(...)`](src/utils/activation-request.ts)
  - Builds the canonical `_activate` payload with `vp_token` as the primary proof plus optional explicit controller/organization binding data.
- [`validateOrganizationActivationRequest(...)`](src/utils/activation-request.ts)
  - Enforces bootstrap contract priority: canonical `vp_token`, explicit `controller.*` key binding when needed, and legacy credential side-fields only as deprecated compatibility inputs.
- [`resolveDidDocumentServices(...)`](src/utils/did-resolution.ts)
  - Normalizes a DID Document `service[]` block into capability-aware endpoint descriptors.
- [`getDidDocumentService(...)`, `selectServiceEndpoint(...)`](src/utils/did-resolution.ts)
  - Select a DID service entry or its invocable `serviceEndpoint` by `id`, `type`, or logical capability.
- [`getDidDocumentEndpoint(...)`, `getJwksServiceEndpoint(...)`, `getSmartTokenEndpoint(...)`](src/utils/did-resolution.ts)
  - Resolve well-known public/operational endpoints from a DID Document instead of reconstructing them from URL conventions.
- [`getOrganizationDidFromIndividualDid(...)`, `getProviderDidFromSubjectDid(...)`](src/utils/did-resolution.ts)
  - Collapse actor/member DIDs back to their owning organization/provider DID using the current naming conventions.
- [`getActorKindFromDid(...)`](src/utils/did-resolution.ts)
  - Heuristically classify current data-space actor DID patterns into actor kinds.
- [`toDidResolutionResult(...)`](src/utils/did-resolution.ts)
  - Build a reusable DID resolution carrier from a raw DID Document.
- [`normalizeIcaDiscoveryMetadata(...)`, `normalizeNodeOperatorDiscoveryMetadata(...)`, `normalizeServiceProviderEntry(...)`](src/utils/discovery-normalization.ts)
  - Normalize ICA, node-operator, and provider/DCAT-style discovery payloads into a shared DID/discovery shape for higher-level SDK runtime code.

### Shared API flow examples

- [`src/examples/organization-controller.ts`](src/examples/organization-controller.ts)
  - Host onboarding and organization-controller examples such as `_activate`, legal order, employee creation, and employee device activation.
- [`src/examples/individual-controller.ts`](src/examples/individual-controller.ts)
  - Individual-controller examples such as family/subject organization bootstrap, consent, search, communication ingestion, and digital twin flows.
  - CORE canonical examples are email-first and do not require phone-only fields unless an extension layer adds them.
- [`src/examples/professional.ts`](src/examples/professional.ts)
  - Professional/physician runtime access examples such as SMART token and clinical access request payloads.
  - The base token examples are read-only; richer scenario fixtures intentionally add `organization/Consent.cruds`.
- [`src/examples/related-person.ts`](src/examples/related-person.ts)
  - RelatedPerson/family-member examples.
- [`src/examples/frontend-session.ts`](src/examples/frontend-session.ts)
  - Frontend profile/session bootstrap examples.
- [`src/examples/lifecycle.ts`](src/examples/lifecycle.ts)
  - Canonical `enable/disable/delete` lifecycle examples with placeholders and no personal data.
  - This is the source of truth for GW, Swagger, Node SDK, Front SDK, and portal examples.
- [`src/examples/shared.ts`](src/examples/shared.ts)
  - Shared route contexts, controller binding fragments, and reusable helper builders.
  - `tenantId` is modeled as an identifier-like route token (`acme-id`), not as a friendly alternate name.
- [`docs/101-LIFECYCLE.md`](docs/101-LIFECYCLE.md)
  - Copy/paste lifecycle `101` guide with semantic rules and reusable placeholders.
- [`docs/101-HEALTHCARE_ROLES_I18N.md`](docs/101-HEALTHCARE_ROLES_I18N.md)
  - Sector-aware healthcare role catalog and i18n `101` (ISCO-08 + HL7) for FE/BE onboarding.

## Documentation Naming Rules

Prefer these semantic names in docs and examples:

- `subjectDid`
- `professionalDid`
- `orgControllerDid`
- `individualControllerDid`
- `emailProfessional`
- `emailControllerOrg`
- `emailControllerIndividual`
- `emailRelatedPerson`

Avoid teaching new integrations from legacy names such as `individualDidWeb`
when the active runtime variable is really the subject identifier.
- [`src/examples/api-flow-examples.ts`](src/examples/api-flow-examples.ts)
  - Preferred compatibility aggregator for consumers that want one import surface without using the overloaded term `contract`.
- [`src/examples/contract-examples.ts`](src/examples/contract-examples.ts)
  - Legacy compatibility aggregator retained only so older imports keep working while consumers migrate to flow-specific modules or `api-flow-examples`.

### DID / DIDComm utilities

- [`generateServiceId(...)`](src/utils/did.ts)
- [`normalizeDidWeb(...)`](src/utils/did.ts)
- [`createHostedDidWeb(...)`](src/utils/did.ts)
- [`buildHostedDidDetails(...)`](src/utils/did.ts)
- [`getBaseUrlFromDidWeb(...)`](src/utils/did.ts)
- [`submitDidcomm(...)`](src/utils/didcomm-submit.ts)
- [`DidCommMessage`](src/utils/didcomm.ts)
- [`prepareDidCommRequest(...)`](src/utils/didcomm.ts)
- [`includeVpTokenInMessage(...)`](src/utils/didcomm.ts)
- [`includeFileInMessage(...)`](src/utils/didcomm.ts)
- [`getThidFromMessage(...)`](src/utils/didcomm.ts)
- [`getDataResults(...)`](src/utils/didcomm.ts)

### FHIR validation and conversion

- [`registerFhirValidatorAdapter(...)`](src/utils/fhir-validator.ts)
- [`clearFhirValidatorAdapters()`](src/utils/fhir-validator.ts)
- [`listFhirValidatorAdapters()`](src/utils/fhir-validator.ts)
- [`validateFhirResource(...)`](src/utils/fhir-validator.ts)
- [`validateFhirResourceBasic(...)`](src/utils/fhir-validator.ts)
- [`medicationStatementFlatToFhir(...)`](src/utils/clinical-resource-converters.ts)
- [`medicationStatementFhirToFlat(...)`](src/utils/clinical-resource-converters.ts)
- [`allergyIntoleranceFlatToFhir(...)`](src/utils/clinical-resource-converters.ts)
- [`allergyIntoleranceFhirToFlat(...)`](src/utils/clinical-resource-converters.ts)
- [`conditionFlatToFhir(...)`](src/utils/clinical-resource-converters.ts)
- [`conditionFhirToFlat(...)`](src/utils/clinical-resource-converters.ts)
- [`deviceUseStatementFlatToFhir(...)`](src/utils/clinical-resource-converters.ts)
- [`deviceUseStatementFhirToFlat(...)`](src/utils/clinical-resource-converters.ts)
- [`documentReferenceFlatToFhir(...)`](src/utils/clinical-resource-converters.ts)
- [`documentReferenceFhirToFlat(...)`](src/utils/clinical-resource-converters.ts)
- [`extractResources(...)`](src/utils/bundle.ts)
- [`getNextLink(...)`](src/utils/bundle.ts)

### JWT utilities

- [`getPartsJWT(...)`](src/utils/jwt.ts)
- [`decodeHeader(...)`](src/utils/jwt.ts)
- [`decodePayload(...)`](src/utils/jwt.ts)
- [`getDataJWT(...)`](src/utils/jwt.ts)
- [`encodeHeader(...)`](src/utils/jwt.ts)
- [`encodePayload(...)`](src/utils/jwt.ts)
- [`encodeSignature(...)`](src/utils/jwt.ts)
- [`compactJWT(...)`](src/utils/jwt.ts)

### Activation / URL / base conversion utilities

- [`extractCredentialSubject(...)`](src/utils/activation-policy.ts)
- [`normalizeTaxIdentifier(...)`](src/utils/activation-policy.ts)
- [`extractOrganizationTaxId(...)`](src/utils/activation-policy.ts)
- [`extractRepresentativeMemberOfTaxId(...)`](src/utils/activation-policy.ts)
- [`extractRepresentativeRoleCode(...)`](src/utils/activation-policy.ts)
- [`hasRoleCode(...)`](src/utils/activation-policy.ts)
- [`extractRepresentativeCredentialMaterial(...)`](src/utils/activation-policy.ts)
- [`extractDidWebFromCredential(...)`](src/utils/activation-policy.ts)
- [`buildMemberDidWeb(...)`](src/utils/activation-policy.ts)
- [`isMemberDidWebUnderOwner(...)`](src/utils/activation-policy.ts)
- [`validateActivationRepresentativePolicy(...)`](src/utils/activation-policy.ts)
- [`safelyJoinUrl(...)`](src/utils/url.ts)
- [`splitUrl(...)`](src/utils/url.ts)
- [`bytesToHexString(...)`](src/utils/base-convert.ts)
- [`bytesToBase58(...)`](src/utils/base-convert.ts)
- [`base58ToBytes(...)`](src/utils/base-convert.ts)
- [`stringToStdBase64(...)`](src/utils/base-convert.ts)
- [`base64ToBase64Url(...)`](src/utils/base-convert.ts)
- [`stringToBase64Url(...)`](src/utils/base-convert.ts)
- [`base64UrlToBase64(...)`](src/utils/base-convert.ts)
- [`base64OrUrlSafeToBytes(...)`](src/utils/base-convert.ts)
- [`bytesToBase64(...)`](src/utils/base-convert.ts)
- [`bytesToRawBase64UrlSafe(...)`](src/utils/base-convert.ts)

### Consent utilities

- [`normalizePhone(...)`](src/utils/consent.ts)
- [`normalizeIdentifierToken(...)`](src/utils/consent.ts)
- [`resolveActorIdentifier(...)`](src/utils/consent.ts)
- [`resolveSubjectIdentifier(...)`](src/utils/consent.ts)
- [`buildConsentClaimsSimple(...)`](src/utils/consent.ts)
- [`buildConsentClaimsSimpleWithCid(...)`](src/utils/consent.ts)
- [`getPurposes(...)`, `setPurposes(...)`, `addPurposes(...)` and related claim list helpers](src/utils/consent-claim-helpers.ts)
- [`__tests__/utils-consent-claim-helpers.test.ts`](__tests__/utils-consent-claim-helpers.test.ts)

These helpers are the shared base for consent claim construction across GW and SDKs.

### Public module surfaces

- [`src/constants/`](src/constants)
  - Shared constants and code catalogs.
- [`src/utils/`](src/utils)
  - Shared functional helpers used by GW and SDK layers.
- [`src/models/`](src/models)
  - Shared transport, FHIR, DID, consent, and storage models.
- [`src/storage/`](src/storage)
  - Shared vault/storage contracts and in-memory implementation.

### Documentation rule

- Add or update JSDoc on exported functions, classes, and constants first.
- Keep README sections as a linked index to those exports, not as a second source of truth.
- If a function signature changes, update its JSDoc and then refresh the README link/index entry.

### Current bootstrap / discovery status

- Implemented here:
  - Canonical bootstrap payload models for `vp_token`, `controller.*`, and `organization.*`
  - Pure DID `service[]` resolution helpers
  - Pure discovery normalization helpers for ICA, node operators, and provider entries
- Intentionally not implemented here:
  - Network fetch/resolution
  - Runtime cache/state
  - GW/SDK orchestration side effects

### Interfaces

The `interfaces` export contains the shared low-level type contracts and cryptography types, including:

- `ICryptography`
- `ICryptoHelper`
- `Cryptography.types`
- `MlDsa`
- `MlKem`

Wallet contracts and runtime adapters live in higher layers:

- `gdc-sdk-core-ts` owns the runtime-neutral `IWallet` contract
- `gdc-sdk-node-ts` owns concrete Node wallet/runtime adapters

Example:

```ts
import { ICryptography, MlkemPublicJwk } from 'gdc-common-utils-ts/interfaces/Cryptography.types';
```

## Auth-Flow Boundaries

This package provides primitives, not orchestration.

It supports the cryptographic and data-model building blocks needed by higher-level clients, but it does not coordinate the backend auth exchange sequence for:

- `/_dcr`
- `/_code`
- `/_token`
- `/_exchange`

Those request/response flows belong in connector SDKs and backend orchestration layers.

## Relationship To Other SDKs

`gdc-sdk-client-ts` and `dataconv-client-sdk-ts` are consumers of this package, not replacements for it.

## SDK Integration Note

When integrating the converged SDKs:

- use [`initializeCommunicationIdentity(...)`](src/utils/communication-identity.ts) from this package for the technical communication identity bootstrap
- use `gdc-sdk-core-ts` for runtime-neutral communication/document helpers
- use `gdc-sdk-front-ts` or `gdc-sdk-node-ts` for the runtime-specific session and orchestration layer

- Use `gdc-common-utils-ts` when you need shared crypto primitives, DID/DIDComm helpers, and common types
- Use `gdc-sdk-client-ts` or `dataconv-client-sdk-ts` when you need higher-level client orchestration, transport, or API workflows

## Notes

- The package is published as ESM.
- The `files` field only publishes `dist/`, so source imports should use the documented package entry points rather than local file paths.

## Roadmap and Briefing
- `docs/BRIEFING_DATASPACE_EN.md`
