import {
  BundleEditor,
  BundleReader,
  EmployeeBatchEntryTypes,
  EmployeeBundleMethods,
  EmployeeBundleOperations,
  EmployeeBundleRoutes,
  EmployeeResourceTypes,
  buildEmployeeBatchEntry,
  buildEmployeePurgeBundle,
  buildExampleEmployeeClaims,
  buildEmployeeSearchBundle,
  ClaimsPersonSchemaorg,
  EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE,
  EXAMPLE_EMPLOYEE_DIRECTORY_RECORDS,
  EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE,
  EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL,
  ExampleEmployeeEmails,
  findEmployeeSearchResult,
  readEmployeeSearchResults,
} from '../src';

describe('101: employee examples', () => {
  it('documents that one email can map to more than one active employee role', () => {
    // Teaching goal:
    // - the app may search employees by shared professional email
    // - one email can legitimately point to more than one active technical profile
    // - callers must not assume email => single employee record

    // Step 1.
    // Filter the directory records by one shared professional email and keep
    // only active profiles.
    const activeRecordsForSharedEmail = EXAMPLE_EMPLOYEE_DIRECTORY_RECORDS.filter(
      (record) => record.email === ExampleEmployeeEmails.SharedProfessional && record.status === 'active',
    );

    // Step 2.
    // Final didactic proof:
    // the app must be prepared to show or disambiguate more than one active profile.
    expect(activeRecordsForSharedEmail).toEqual([
      EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE,
      EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE,
    ]);
  });

  it('documents that identifier addresses one exact employee identity including historical purged profiles', () => {
    // Teaching goal:
    // the exportable employee identifier still addresses one exact business
    // identity/profile lineage, including historical/purged records, even
    // though the internal GW resource id is a separate technical locator.

    // Step 1.
    // Build claims for one historical purged employee profile.
    const claims = buildExampleEmployeeClaims(EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL);

    // Step 2.
    // Final didactic proof:
    // the public/exportable identifier stays specific even when the visible
    // email is shared.
    expect(EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.resourceId).toMatch(/^urn:uuid:/);
    expect(claims[ClaimsPersonSchemaorg.identifier]).toBe(EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.identifier);
    expect(claims[ClaimsPersonSchemaorg.email]).toBe(ExampleEmployeeEmails.SharedProfessional);
    expect(claims[ClaimsPersonSchemaorg.hasOccupationalRoleValue]).toBe(EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.role);
  });

  it('builds employee batch entries from method + claims without exposing resource.meta.claims details to callers', () => {
    // Teaching goal:
    // callers should be able to build one employee batch entry from business
    // inputs without hand-assembling FHIR-like bundle internals.

    // Step 1.
    // Build the employee claims for one controller profile.
    const claims = buildExampleEmployeeClaims(EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE);

    // Step 2.
    // Build one batch entry from method + claims.
    const entry = buildEmployeeBatchEntry({
      method: EmployeeBundleMethods.create,
      claims,
      resourceId: EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.resourceId,
    });

    // Step 3.
    // Final didactic proof:
    // the helper assembles the request metadata and stores claims under
    // resource.meta.claims for the caller.
    expect(entry.type).toBe(EmployeeBatchEntryTypes.create);
    expect(entry.request.method).toBe(EmployeeBundleMethods.create);
    expect(entry.resource.id).toBe(EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.resourceId);
    expect(entry.resource.meta.claims).toEqual(claims);
  });

  it('builds employee search bundles from claims without exposing bundle internals to callers', () => {
    // Teaching goal:
    // the app should be able to ask for an employee search bundle from plain
    // search claims without building Parameters/entry/request wiring itself.

    // Step 1.
    // Build one search bundle from the shared professional email.
    const bundle = buildEmployeeSearchBundle({
      claims: {
        [ClaimsPersonSchemaorg.email]: ExampleEmployeeEmails.SharedProfessional,
      },
    });

    // Step 2.
    // Final didactic proof:
    // the search helper emits the expected search method, route, and Parameters payload.
    expect(bundle.entry[0].request.method).toBe(EmployeeBundleMethods.search);
    expect(bundle.entry[0].request.url).toBe(EmployeeBundleRoutes.search);
    expect(bundle.entry[0].resource).toEqual({
      resourceType: 'Parameters',
      parameter: [
        {
          name: ClaimsPersonSchemaorg.email,
          valueString: ExampleEmployeeEmails.SharedProfessional,
        },
      ],
    });
  });

  it('builds employee purge bundles from identifier plus resource id without exposing raw entry assembly to callers', () => {
    // Teaching goal:
    // the app should be able to request purge from one identifier without
    // handcrafting the underlying batch entry.

    // Step 1.
    // Build the purge bundle from the historical employee identifier.
    const bundle = buildEmployeePurgeBundle({
      identifier: EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.identifier,
      resourceId: EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.resourceId,
    });

    // Step 2.
    // Final didactic proof:
    // purge uses the technical resource id as transport target while
    // preserving the exportable identifier in resource.meta.claims.
    expect(bundle.entry[0].type).toBe(EmployeeBatchEntryTypes.purge);
    expect(bundle.entry[0].request.method).toBe(EmployeeBundleMethods.purge);
    expect(bundle.entry[0].resource.id).toBe(EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.resourceId);
    expect(bundle.entry[0].resource.meta.claims).toEqual({
      '@context': 'org.schema',
      [ClaimsPersonSchemaorg.identifier]: EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.identifier,
    });
  });

  it('builds employee bundles through one generic bundle editor plus one employee entry editor', () => {
    // Teaching goal:
    // - the app can build employee bundles through one generic bundle editor
    // - employee-specific editing lives in the entry editor layer
    // - the same reader can later inspect the built bundle generically

    // Step 1.
    // Build one create bundle through the generic bundle editor and the employee entry editor.
    const createBundle = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(EmployeeResourceTypes.employee)
      .newEntry()
      .asEmployee()
      .setEmail(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.email)
      .setRole(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.role)
      .doneEntry()
      .build();

    // Step 2.
    // Verify the created entry shape that the app/backend transport will see.
    expect(createBundle.entry[0]).toMatchObject({
      request: { method: EmployeeBundleMethods.create },
      resource: {
        id: expect.stringMatching(/^urn:uuid:/),
      },
    });

    // Step 3.
    // Build one search bundle through the same layering model.
    const searchBundle = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.search)
      .setAllowedResourceType(EmployeeResourceTypes.employee)
      .newEntry()
      .asEmployee()
      .setEmail(ExampleEmployeeEmails.SharedProfessional)
      .doneEntry()
      .build();

    // Step 4.
    // Verify the search request shape.
    expect(searchBundle.entry[0]).toMatchObject({
      request: {
        method: EmployeeBundleMethods.search,
        url: EmployeeBundleRoutes.search,
      },
    });

    // Step 5.
    // Final didactic proof:
    // the resulting bundle can be read back through one generic reader without
    // requiring employee-specific transport logic at read time.
    const createBundleReader = new BundleReader(createBundle).openEntry(0);
    expect(createBundleReader.getTotalOperations()).toBe(1);
    expect(createBundleReader.getEntryResponseStatus()).toBeUndefined();
  });

  it('reads employee search results into one neutral frontend-oriented list without exposing raw claim plumbing', () => {
    const responseBody = {
      body: {
        data: EXAMPLE_EMPLOYEE_DIRECTORY_RECORDS.map((record) => ({
          id: `resource:${record.resourceId}`,
          meta: {
            status: record.status,
            claims: buildExampleEmployeeClaims(record),
          },
        })),
      },
    };

    const records = readEmployeeSearchResults(responseBody);

    expect(records).toEqual([
      {
        identifier: EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.identifier,
        email: EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.email,
        role: EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.role,
        worksFor: undefined,
        memberOf: undefined,
        memberOfOrgTaxId: undefined,
        resourceId: `resource:${EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.resourceId}`,
        status: EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.status,
        claims: buildExampleEmployeeClaims(EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE),
      },
      {
        identifier: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
        email: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.email,
        role: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.role,
        worksFor: undefined,
        memberOf: undefined,
        memberOfOrgTaxId: undefined,
        resourceId: `resource:${EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.resourceId}`,
        status: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.status,
        claims: buildExampleEmployeeClaims(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE),
      },
      {
        identifier: EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.identifier,
        email: EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.email,
        role: EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.role,
        worksFor: undefined,
        memberOf: undefined,
        memberOfOrgTaxId: undefined,
        resourceId: `resource:${EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.resourceId}`,
        status: EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.status,
        claims: buildExampleEmployeeClaims(EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL),
      },
    ]);

    expect(findEmployeeSearchResult(
      responseBody,
      EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
    )).toEqual(records[1]);
  });
});
