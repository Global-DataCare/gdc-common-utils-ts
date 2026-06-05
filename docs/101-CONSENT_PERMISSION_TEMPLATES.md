# 101 Consent Permission Templates

## Goal

There must be one shared permission-template layer that can serve all of these
use cases:

- frontend UI
- permission request creation for the individual controller
- manual permission granting by the individual controller
- final persistence into consent/access rules
- documentation and pre-validation

This layer does not replace the current consent claim contract. It feeds it.
Transformation into claims or FHIR `Consent` entries should happen in
`ConsentAccessEditor` or an adjacent shared layer in `gdc-common-utils-ts`.

## Required Use Cases

### 1. Frontend UI

The same template layer must support:

- showing available options
- hiding tools/actions that are not allowed
- disabling tools/actions that are visible but not usable
- adapting screens by:
  - actor
  - sector
  - professional role or personal relationship

Example:

- a hospital administrator may see "search documents"
- that same role should not see "read full clinical content"
- a physician may see full clinical read capabilities

### 2. Permission Request Creation

The same template layer must support:

- the professional choosing a role
- the frontend loading the recommended template
- generating a pre-filled request with:
  - resources
  - sections
  - access type
  - suggested SMART scopes

The request should start from a reasonable sector template, not from scratch.

### 3. Manual Granting By The Individual Controller

The same template layer must support:

- the individual controller choosing:
  - sector
  - role
- the system proposing the default template
- the controller then being able to:
  - accept it as-is
  - adjust it
  - restrict it further

This is the real value:

- one base table
- reused by UI, request creation, and manual granting

## Functional Flow

### 1. Base Catalog

The shared catalog should contain:

- `actorType`
- `sector`
- `roleId` or `relationshipCode`
- recommended permissions
- resources and sections
- suggested SMART scopes
- flags such as `metadataOnly`

### 2. Role Selection

In the frontend:

- the user or system resolves `sector + role`
- the recommended template is loaded
- that template can already be used to:
  - drive UI visibility
  - hide invalid actions
  - prepare permission requests

### 3. Permission Preview

Before requesting or granting:

- the user should see a clear summary:
  - can search/list
  - can read
  - can create
  - over which resources
  - over which sections
- if `metadataOnly` applies, it must be stated explicitly

### 4. Request To The Individual Controller

- the frontend generates a request from the template
- the individual controller receives a structured permission draft

### 5. Manual Editing By The Individual Controller

The controller may:

- accept
- restrict
- widen if policy allows it
- save as a preset

### 6. Final Persistence

The stored artifact must be the final decision, not merely "the template":

- targets
- CRUD/scopes
- actors
- roles
- purposes
- metadata-only vs full content
- effective SMART scopes
- optional temporal or contextual limits

## Ownership By Repository

- `gdc-common-utils-ts`
  - types
  - base catalog
  - resolution helpers
  - `ConsentAccessEditor`
  - `BundleEditor` / `BundleReader`
  - `EmployeeEntryEditor`
  - future editors such as `ConsentEntryEditor`, `RelatedPersonEntryEditor`, `Ips...`
- `gdc-sdk-core-ts`
  - neutral effective-template resolution logic
  - actor-facing capability/surface mapping
- `gdc-sdk-front-ts`
  - UI
  - app overrides
  - request/grant forms
- `gdc-sdk-node-ts`
  - runtime enforcement when applicable

## Resolution Order

1. SDK base template
2. organization/app override
3. case-specific adjustment
4. final persisted consent/permission

## Canonical Role And Relationship Identity

Do not use free-text labels as canonical keys.

Professional or staff identities:

- use `sector + ISCO-08 code`

Personal relationships:

- use `sector + HL7 v3-RoleCode` or the relationship-family role system in use

Examples:

- `health-care_isco-08_221`
- `health-care_isco-08_2211`
- `individual_v3-RoleCode_MTH`

## Simple Internal Permission Shape

The base config may be expressed as:

- key: `<sector>_<codingSystem>_<code>`
- value: `<target>.<ops>`

Examples:

- `health-care_isco-08_221=DocumentReference.sr,MedicationStatement.sr,Observation.sr,LOINC|60591-5.sr`
- `health-care_isco-08_2211=DocumentReference.sr,MedicationStatement.sr,Observation.sr,LOINC|60591-5.sr`
- `individual_v3-RoleCode_MTH=DocumentReference.sr,Observation.s`

`ops`:

- `s` = search/list metadata
- `r` = read full content
- `c` = create
- `u` = update
- `d` = delete

## Canonical Consent Mental Model

The main mental model should not be `Consent.action/category/resourceType`.
It should be:

- `decision`
- `purposes[]`
- `targets[]`
- `actors[]`
- `roles[]`

That canonical model is then exported into the current claim contract.

## Current Consent Editor Classification Contract

Already established:

- `getDecision()`
- `getTargetsClassified()`
- `getActorsClassified()`

Also implemented now:

- `getPurposesClassified()`
- `getSelectedPurposes()`
- `setSelectedPurposes(...)`
- `addPurposes(...)`
- `removePurposes(...)`
- `getRolesClassified()`
- `getSelectedRoles()`
- `setSelectedRoles(...)`
- `addRoles(...)`
- `removeRoles(...)`

## Classified Targets

The public API should use `target`, not `section`, as the top-level concept.

```ts
type ConsentTargetKind =
  | 'section'
  | 'resource-type';
```

For LOINC, do not introduce a separate public `document-type` target kind.
LOINC-backed targets should remain `section`, with a family:

```ts
type ConsentSectionFamily =
  | 'core-section'
  | 'kind-of-document'
  | 'type-of-service'
  | 'subject-matter-domain';
```

Shape:

```ts
type ClassifiedConsentTarget = {
  target: {
    kind: ConsentTargetKind;
    code: string;
    display?: string;
    sectionFamily?: ConsentSectionFamily;
  };
  scopes: Array<{
    code: 'c' | 'r' | 'u' | 'd' | 's';
    display?: string;
  }>;
};
```

## Section Taxonomy

- `core-section`
  - IPS and clinical-summary core sections
- `kind-of-document`
  - LOINC document-kind hierarchy
- `type-of-service`
  - LOINC type-of-service hierarchy
- `subject-matter-domain`
  - LOINC specialty/domain hierarchy
- `resource-type`
  - `DocumentReference`, `Observation`, etc.

## LOINC Usage

The SDK should not try to mirror the whole LOINC ontology as a rigid hierarchy.
It should reuse LOINC as a practical classification source.

Example:

- `type-of-service` may be used directly as a reusable classification family
- it does not need to become a mandatory sub-tree of another target kind

## Frontend Picker Helpers

The frontend should not manipulate raw `Consent.action`,
`Consent.category`, or `Consent.resourceType` directly.

Catalog helpers:

- `getCoreSectionOptions()`
- `getKindOfDocumentOptions()`
- `getTypeOfServiceOptions()`
- `getSubjectMatterDomainOptions()`
- `getResourceTypeOptions()`

Current selection helpers:

- `getSelectedCoreSections()`
- `getSelectedKindOfDocuments()`
- `getSelectedTypeOfServices()`
- `getSelectedSubjectMatterDomains()`
- `getSelectedResourceTypes()`

Set/replace helpers:

- `setSelectedCoreSections(...)`
- `setSelectedKindOfDocuments(...)`
- `setSelectedTypeOfServices(...)`
- `setSelectedSubjectMatterDomains(...)`
- `setSelectedResourceTypes(...)`

Incremental add/remove helpers:

- `addCoreSections(...)`
- `removeCoreSections(...)`
- `addKindOfDocuments(...)`
- `removeKindOfDocuments(...)`
- `addTypeOfServices(...)`
- `removeTypeOfServices(...)`
- `addSubjectMatterDomains(...)`
- `removeSubjectMatterDomains(...)`
- `addResourceTypes(...)`
- `removeResourceTypes(...)`

## Classified Actors

Recommended public shape:

```ts
getActorsClassified(): {
  jurisdictions: Array<{
    code: string;
    display?: string;
  }>;
  organizations: Array<{
    domain: string;
    display?: string;
    departments: Array<{
      code: string;
      display?: string;
    }>;
    locations: Array<{
      code: string;
      display?: string;
    }>;
  }>;
  users: Array<{
    email?: string;
    phone?: string;
    role?: {
      codingSystem: string;
      code: string;
      display?: string;
    };
  }>;
};
```

This must support:

- one or more professional emails
- one or more phones
- one or more organization `did:web` identifiers
- one or more departments
- one or more locations
- one or more ISO 3166 jurisdictions

## Purposes

Purposes are first-class data and must survive:

- request creation
- manual editing
- export to claims/FHIR `Consent`
- import back from claims/FHIR `Consent`

## Roles

Roles must also be explicit lists:

- professional roles by sector
- personal or legal relationship roles

Helpers:

- `getAvailableProfessionalRolesBySector(...)`
- `getAvailableRelationshipRoles(...)`
- `getSelectedRoles()`
- `setSelectedRoles(...)`
- `addRoles(...)`
- `removeRoles(...)`

These feed both:

- frontend UI
- permission generation
- tool visibility/enablement logic

## Tool Visibility By Role And Sector

The same template layer must drive:

- show tool
- hide tool
- disable tool

according to:

- actor
- sector
- professional or personal role

Example:

- hospital administrative staff:
  - may list documents
  - may not read full clinical content
- physician:
  - may read full clinical content
- firefighter, police, flight staff, veterinarian, etc.:
  - should have sector-specific templates by role code

## Core TypeScript Types

The public model should cover at least:

- `RolePermissionTemplate`
- `ResolvedPermissionProfile`
- `PermissionGrantRequestDraft`
- `PermissionGrantDecision`

These must cover:

- `purposes[]`
- `targets[]`
- `actors[]`
- `roles[]`
- `metadataOnly`
- `sectionFamily`
- overrides

## Required Import/Export Layer

There must be a transformation layer between:

- frontend permission template
- canonical editor model
- persisted claims
- FHIR `Consent` bundle entries

Current names in this repo:

- `importPermissionTemplate(...)`
- `exportConsentClaims(...)`
- `exportConsentEntries(...)`
- `importConsentClaims(...)`
- `importConsentEntry(...)`

## Executable Flow Today

The current executable flow already covered in examples/tests is:

- build a draft with `purposes`, `actorIdentifiers`, `roles`, `targets`
- export it into the current consent claim contract
- persist one or more `Consent` entries in a `Communication`-attached bundle
- reload that bundle and reclassify the saved permissions for frontend display

Executable references:

- `__tests__/101-consent-template-bundle-editor.test.ts`
- `__tests__/101-consent-bundle-editor.test.ts`
- `__tests__/101-consent-permission-bundle-readwrite.test.ts`
- `src/examples/communication-attached-bundle-session.ts`
  - `buildConsentPermissionTemplateImportExportSessionExample()`
  - `buildSeparateConsentPermissionBundleExample()`

The preferred 101 flow is `__tests__/101-consent-template-bundle-editor.test.ts`:

- build the `Bundle` first with `BundleEditor`
- edit each `Consent` entry with `ConsentAccessEditor`
- apply permission templates before export to consent claims
- read the same bundle back for frontend rendering

The separated-permission helper-oriented roundtrip is intentionally documented
in `__tests__/101-consent-permission-bundle-readwrite.test.ts`, step by step,
using the same public APIs frontend/backend code is expected to call:

- `resolvePermissionTemplate(...)`
- `importPermissionTemplate(...)`
- `exportConsentEntry(...)`
- `createConsentAccessEditor(...)`
- `upsertActiveConsentEntry(...)`

That test documents the frontend case where permissions are edited
independently and then stored together in the same bundle:

- one `Consent` for a professional email with role `ISCO-08|2211`
- one `Consent` for one organization `did:web`
- one `Consent` for jurisdictions `ES` and `PT`

It covers both sides:

- creation of each permission as a separate `Consent`
- later readback of the same bundle for frontend rendering

The final transport wrapping is complementary, not primary:

- the bundle can then be wrapped into `Communication`
- that wrapping step is asserted in `__tests__/101-consent-bundle-editor.test.ts`
- backend and GW CORE should consume the wrapped `Communication`, but frontend
  and backend permission authoring should keep the bundle-building logic
  independent from that transport step

## Minimum Test Coverage In Common Utils

At minimum, the shared package should cover:

- one template -> one consent entry
- one template -> several consent entries
- several professional emails
- several organization `did:web` identifiers
- several departments
- several locations
- several ISO 3166 jurisdictions
- `permit`
- `deny`
- multiple `purposes`
- multiple `roles`
- multiple `targets`
- multiple `resource-types`
- `core-section` classification
- `kind-of-document` classification
- `type-of-service` classification
- `subject-matter-domain` classification

## Current Status

Already implemented:

- canonical section families in `healthcare.ts`
- `ConsentAccessEditor.getDecision()`
- `ConsentAccessEditor.getTargetsClassified()`
- `ConsentAccessEditor.getActorsClassified()`
- section family-aware picker/read helpers
- explicit purpose and role list helpers
- permission-template catalog primitives
- import/export helpers between templates and consent claims/entries
- focused deterministic tests

## Current Next Step For Live Validation

The next real validation step is not more local unit wiring. It is live GW CORE
verification:

1. create a permission bundle from templates
2. persist it in backend
3. read it back
4. confirm frontend-facing classified rendering from the stored bundle
