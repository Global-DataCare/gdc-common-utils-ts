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
} from '../src';

describe('101: employee examples', () => {
  it('documents that one email can map to more than one active employee role', () => {
    const activeRecordsForSharedEmail = EXAMPLE_EMPLOYEE_DIRECTORY_RECORDS.filter(
      (record) => record.email === ExampleEmployeeEmails.SharedProfessional && record.status === 'active',
    );

    expect(activeRecordsForSharedEmail).toEqual([
      EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE,
      EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE,
    ]);
  });

  it('documents that identifier addresses one technical profile including historical purged profiles', () => {
    const claims = buildExampleEmployeeClaims(EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL);

    expect(claims[ClaimsPersonSchemaorg.identifier]).toBe(EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.identifier);
    expect(claims[ClaimsPersonSchemaorg.email]).toBe(ExampleEmployeeEmails.SharedProfessional);
    expect(claims[ClaimsPersonSchemaorg.hasOccupationalRoleValue]).toBe(EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.role);
  });

  it('builds employee batch entries from method + claims without exposing resource.meta.claims details to callers', () => {
    const claims = buildExampleEmployeeClaims(EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE);
    const entry = buildEmployeeBatchEntry({
      method: EmployeeBundleMethods.create,
      claims,
      resourceId: EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.identifier,
    });

    expect(entry.type).toBe(EmployeeBatchEntryTypes.create);
    expect(entry.request.method).toBe(EmployeeBundleMethods.create);
    expect(entry.resource.meta.claims).toEqual(claims);
  });

  it('builds employee search bundles from claims without exposing bundle internals to callers', () => {
    const bundle = buildEmployeeSearchBundle({
      claims: {
        [ClaimsPersonSchemaorg.email]: ExampleEmployeeEmails.SharedProfessional,
      },
    });

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

  it('builds employee purge bundles from one identifier without exposing raw entry assembly to callers', () => {
    const bundle = buildEmployeePurgeBundle({
      identifier: EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.identifier,
    });

    expect(bundle.entry[0].type).toBe(EmployeeBatchEntryTypes.purge);
    expect(bundle.entry[0].request.method).toBe(EmployeeBundleMethods.purge);
    expect(bundle.entry[0].resource.id).toBe(EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.identifier);
    expect(bundle.entry[0].resource.meta.claims).toEqual({
      '@context': 'org.schema',
      [ClaimsPersonSchemaorg.identifier]: EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL.identifier,
    });
  });

  it('builds employee bundles through one generic bundle editor plus one employee entry editor', () => {
    const createBundle = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(EmployeeResourceTypes.employee)
      .newEntry()
      .asEmployee()
      .setEmail(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.email)
      .setRole(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.role)
      .doneEntry()
      .build();

    expect(createBundle.entry[0]).toMatchObject({
      request: { method: EmployeeBundleMethods.create },
      resource: {
        id: expect.stringMatching(/^urn:uuid:/),
      },
    });

    const searchBundle = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.search)
      .setAllowedResourceType(EmployeeResourceTypes.employee)
      .newEntry()
      .asEmployee()
      .setEmail(ExampleEmployeeEmails.SharedProfessional)
      .doneEntry()
      .build();

    expect(searchBundle.entry[0]).toMatchObject({
      request: {
        method: EmployeeBundleMethods.search,
        url: EmployeeBundleRoutes.search,
      },
    });

    const createBundleReader = new BundleReader(createBundle).openEntry(0);
    expect(createBundleReader.getTotalOperations()).toBe(1);
    expect(createBundleReader.getEntryResponseStatus()).toBeUndefined();
  });
});
