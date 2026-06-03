import {
  buildExampleEmployeeClaims,
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
});
