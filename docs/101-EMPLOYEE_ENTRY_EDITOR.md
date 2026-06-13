# Employee Entry Editor 101

This is the canonical editor-level document for employee bundle construction.

Use this document when you need to understand:

- `BundleEditor`
- `BundleEntryEditor`
- `EmployeeEntryEditor`
- how `create`, `search`, `disable`, and `purge` are shaped as bundles

Read this before the higher-level employee flow notes in other SDKs:

- [gdc-sdk-core-ts/docs/101-EMPLOYEES.md](https://github.com/Global-DataCare/gdc-sdk-core-ts/blob/main/docs/101-EMPLOYEES.md)
- [gdc-sdk-front-ts/docs/101-SDK_INTEGRATION.md](https://github.com/Global-DataCare/gdc-sdk-front-ts/blob/main/docs/101-SDK_INTEGRATION.md)

For the shortest executable references, open:

- [__tests__/101-employee-examples.test.ts](https://github.com/Global-DataCare/gdc-common-utils-ts/blob/main/__tests__/101-employee-examples.test.ts)
- [__tests__/101-bundle-reader.test.ts](https://github.com/Global-DataCare/gdc-common-utils-ts/blob/main/__tests__/101-bundle-reader.test.ts)
- [src/utils/employee.ts](https://github.com/Global-DataCare/gdc-common-utils-ts/blob/main/src/utils/employee.ts)

If you are a frontend developer, this is the document that should teach you the
actual `get...()` / `set...()` chainable editing path for employee bundle
entries.

The intended loop is:

1. build one entry with chainable setters
2. materialize the final bundle with `build()`
3. hand that value to a lower SDK/runtime/backend layer
4. read the response later with `BundleReader` or `readEmployeeSearchResults(...)`

## One Naming Trap

`setBundleOperation(...)` is easy to confuse with the lower-level
`entry.request.method` used inside a FHIR-style bundle.

They are not the same thing.

- `setBundleOperation(EmployeeBundleOperations.disable)`
  means:
  - "this bundle is trying to disable an employee"
- `entry.request.method`
  means:
  - "which lower-level request method does the current backend contract expect
    inside the built entry?"

For example, today:

- employee `disable`
  - business action: `disable`
  - current GW entry request method: `DELETE`
- employee `purge`
  - business action: `purge`
  - current GW entry request method: `POST`
- employee `search`
  - business action: `search`
  - current GW entry request method: `POST` with `Parameters`

So teach the concepts in this order:

1. business action with `setBundleOperation(...)`
2. semantic claims edited in the entry
3. only later, the concrete request method emitted by the current runtime

## Goal

Keep bundle mechanics in `common-utils` and keep runtime or actor questions out
of the editor layer.

- `BundleEditor`
  - owns the bundle
  - owns the declared bundle operation
  - owns entry creation, opening, and final materialization
- `BundleEntryEditor`
  - owns generic active-entry editing
- `EmployeeEntryEditor`
  - owns employee-specific editing on the active entry

## Recommended Flow

Teach the flow in this order:

```ts
import { BundleEditor } from 'gdc-common-utils-ts/utils/bundle-editor';
import {
  EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE,
  EXAMPLE_PROVIDER_ORGANIZATION_DID,
} from 'gdc-common-utils-ts/examples';
import { ClaimsPersonSchemaorg } from 'gdc-common-utils-ts/constants/schemaorg';
import {
  EmployeeBundleOperations,
  EmployeeResourceTypes,
} from 'gdc-common-utils-ts/utils/employee';

const bundle = new BundleEditor()
  .setBundleOperation(EmployeeBundleOperations.create)
  .setAllowedResourceType(EmployeeResourceTypes.employee);

const employeeEntry = bundle
  .newEntry()
  .asEmployee()
  .setEmail(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.email)
  .setRole(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.role)
  .addClaim(ClaimsPersonSchemaorg.memberOf, EXAMPLE_PROVIDER_ORGANIZATION_DID);

const generatedEmployeeIdentifier = employeeEntry.getIdentifier();

employeeEntry.doneEntry();

const employeeCreateBatchBundle = bundle.build();
```

Read that example as:

- `bundle`
  - is the main editor object
- `newEntry()`
  - opens one active entry inside that bundle
- `asEmployee()`
  - switches that active entry to employee-specific editing
- `doneEntry()`
  - closes the active entry and returns control to the bundle
- `build()`
  - materializes the final bundle object from the editor state in memory

`build()` does not:

- send anything
- sign anything
- wrap DIDComm
- convert to another standard

It only returns the final bundle payload.

For employee search/list screens, the readback path is:

1. build the search request with `BundleEditor` or `buildEmployeeSearchBundle(...)`
2. let a lower SDK/runtime/backend layer submit it
3. read returned employee rows with `readEmployeeSearchResults(...)`
4. optionally resolve one exact record with `findEmployeeSearchResult(...)`

That keeps `resource.meta.claims` and mixed GW wrapper shapes out of the
frontend screen code.

## Generic Entry Editing

The active entry supports the generic API first:

- `setClaim(...)`
- `getClaim(...)`
- `addClaim(...)`
- `removeClaim(...)`
- `setResourceId(...)`
- `getResourceId()`
- `setFullUrl(...)`
- `getFullUrl()`
- `doneEntry()`

Then `asEmployee()` exposes employee-specific helpers:

- `setIdentifier(...)`
- `getIdentifier()`
- `ensureIdentifier()`
- `setEmail(...)`
- `getEmail()`
- `setRole(...)`
- `getRole()`
- `setWorksFor(...)`
- `setMemberOf(...)`
- `setMemberOfOrgTaxId(...)`

Alternative explicit-claim example:

```ts
import { BundleEditor } from 'gdc-common-utils-ts/utils/bundle-editor';
import {
  EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE,
  EXAMPLE_PROVIDER_ORGANIZATION_DID,
} from 'gdc-common-utils-ts/examples';
import { ClaimsPersonSchemaorg } from 'gdc-common-utils-ts/constants/schemaorg';
import {
  EmployeeBundleOperations,
  EmployeeResourceTypes,
} from 'gdc-common-utils-ts/utils/employee';

const bundle = new BundleEditor()
  .setBundleOperation(EmployeeBundleOperations.create)
  .setAllowedResourceType(EmployeeResourceTypes.employee);

const employeeEntry = bundle
  .newEntry()
  .asEmployee()
  .setClaim(ClaimsPersonSchemaorg.email, EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.email)
  .setClaim(ClaimsPersonSchemaorg.hasOccupationalRoleValue, EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.role)
  .addClaim(ClaimsPersonSchemaorg.memberOf, EXAMPLE_PROVIDER_ORGANIZATION_DID);

employeeEntry.doneEntry();

const employeeCreateBatchBundle = bundle.build();
```

## Homogeneous Employee Bundles

Employee bundles are operational `batch` bundles, not document bundles.

That means:

- no `Composition`
- no sections
- no heterogeneous clinical resources mixed in

For employee, use:

- `setAllowedResourceType(EmployeeResourceTypes.employee)`

That keeps the bundle homogeneous and prevents accidental mixing with unrelated
resource editors.

## Create

Create several employees one by one in the same bundle:

```ts
import { BundleEditor } from 'gdc-common-utils-ts/utils/bundle-editor';
import {
  EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE,
  EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE,
} from 'gdc-common-utils-ts/examples';
import {
  EmployeeBundleOperations,
  EmployeeResourceTypes,
} from 'gdc-common-utils-ts/utils/employee';

const employeeCreateBatchBundle = new BundleEditor()
  .setBundleOperation(EmployeeBundleOperations.create)
  .setAllowedResourceType(EmployeeResourceTypes.employee)
  .newEntry(EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.identifier)
  .asEmployee()
  .setEmail(EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.email)
  .setRole(EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.role)
  .doneEntry()
  .newEntry(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier)
  .asEmployee()
  .setEmail(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.email)
  .setRole(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.role)
  .doneEntry()
  .build();
```

## Search

Search is built as its own bundle operation:

```ts
import { BundleEditor } from 'gdc-common-utils-ts/utils/bundle-editor';
import { EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE } from 'gdc-common-utils-ts/examples';
import {
  EmployeeBundleOperations,
  EmployeeResourceTypes,
} from 'gdc-common-utils-ts/utils/employee';

const bundle = new BundleEditor()
  .setBundleOperation(EmployeeBundleOperations.search)
  .setAllowedResourceType(EmployeeResourceTypes.employee);

bundle
  .newEntry()
  .asEmployee()
  .setEmail(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.email)
  .setRole(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.role)
  .doneEntry();

const employeeSearchBundle = bundle.build();
```

Operational search rules:

- `email + role`
  - recommended exact operational lookup
- `email`
  - returns all active employee profiles for that mailbox
- `role`
  - returns all active employee profiles for that role
- no filters
  - returns all employees
- `identifier`
  - targets one exact technical or historical profile

## Disable

Disable is its own bundle operation:

```ts
import { BundleEditor } from 'gdc-common-utils-ts/utils/bundle-editor';
import { EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE } from 'gdc-common-utils-ts/examples';
import {
  EmployeeBundleOperations,
  EmployeeResourceTypes,
} from 'gdc-common-utils-ts/utils/employee';

const bundle = new BundleEditor()
  .setBundleOperation(EmployeeBundleOperations.disable)
  .setAllowedResourceType(EmployeeResourceTypes.employee);

bundle
  .newEntry(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier)
  .asEmployee()
  .doneEntry();

const employeeDisableBatchBundle = bundle.build();
```

Current live contract:

- disable = `_batch` + inner `request.method = DELETE`
- business meaning = soft delete
- it does not release the license

## Purge

Purge is also built as a bundle operation, but it is semantically distinct from
disable:

```ts
import { BundleEditor } from 'gdc-common-utils-ts/utils/bundle-editor';
import { EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE } from 'gdc-common-utils-ts/examples';
import {
  EmployeeBundleOperations,
  EmployeeResourceTypes,
} from 'gdc-common-utils-ts/utils/employee';

const bundle = new BundleEditor()
  .setBundleOperation(EmployeeBundleOperations.purge)
  .setAllowedResourceType(EmployeeResourceTypes.employee);

bundle
  .newEntry(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier)
  .asEmployee()
  .doneEntry();

const employeePurgeBundle = bundle.build();
```

Purge rules:

- selector should be the exact `identifier`
- purge is terminal for that technical profile
- purge releases the license

## Identifier Generation

If an entry requires an identifier and none is provided:

- the employee entry editor can generate one
- the generated value is then available through `getIdentifier()`

The editor keeps these values aligned:

- `entry.fullUrl`
- `resource.id`
- `resource.meta.claims[org.schema.Person.identifier]`

## Reader Side

Use `BundleReader` for:

- response bundles
- stored bundles
- bundle totals
- per-entry diagnostics
- per-entry status inspection

See:

- [101-BUNDLE_EDITOR_READER.md](./101-BUNDLE_EDITOR_READER.md)
- [__tests__/101-bundle-reader.test.ts](https://github.com/Global-DataCare/gdc-common-utils-ts/blob/main/__tests__/101-bundle-reader.test.ts)
