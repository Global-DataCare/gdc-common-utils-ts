import {
  buildEmployeeBatchEntry,
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
      method: 'POST',
      claims,
      resourceId: 'employee-controller-active-001',
    });

    expect(entry.type).toBe('Employee-create-request-v1.0');
    expect(entry.request.method).toBe('POST');
    expect(entry.resource.meta.claims).toEqual(claims);
  });

  it('builds employee search bundles from claims without exposing bundle internals to callers', () => {
    const bundle = buildEmployeeSearchBundle({
      claims: {
        [ClaimsPersonSchemaorg.email]: ExampleEmployeeEmails.SharedProfessional,
      },
    });

    expect(bundle.entry[0].request.method).toBe('POST');
    expect(bundle.entry[0].request.url).toBe('Employee/_search');
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
});
