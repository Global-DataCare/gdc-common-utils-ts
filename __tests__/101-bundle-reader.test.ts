import {
  BundleEditor,
  BundleReader,
  EmployeeBatchEntryTypes,
  EmployeeBundleMethods,
  EmployeeBundleOperations,
  EmployeeResourceTypes,
  EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE,
} from '../src';

describe('101: bundle reader', () => {
  it('reads one response bundle entry status and diagnostics without resource-specific transport logic', () => {
    const requestBundle = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(EmployeeResourceTypes.employee)
      .newEntry(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier)
      .asEmployee()
      .setEmail(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.email)
      .setRole(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.role)
      .doneEntry()
      .build();

    const responseBundle = {
      resourceType: requestBundle.resourceType,
      type: requestBundle.type,
      entry: [
        {
          ...requestBundle.entry[0],
          response: {
            status: '409',
            outcome: {
              issue: [
                {
                  severity: 'error',
                  diagnostics: 'Employee must be disabled before purge.',
                },
              ],
            },
          },
        },
        {
          type: EmployeeBatchEntryTypes.purge,
          request: { method: EmployeeBundleMethods.purge },
          resource: requestBundle.entry[0].resource,
          response: {
            status: '200',
            outcome: {
              issue: [
                {
                  severity: 'success',
                  diagnostics: 'Purged.',
                },
              ],
            },
          },
        },
      ],
    };

    const failingEntryReader = new BundleReader(responseBundle).openEntry(0);
    expect(failingEntryReader.getBundleType()).toBe(requestBundle.type);
    expect(failingEntryReader.getTotalOperations()).toBe(2);
    expect(failingEntryReader.getTotalSuccessfulOperations()).toBe(1);
    expect(failingEntryReader.getTotalErrorOperations()).toBe(1);
    expect(failingEntryReader.getEntryResponseStatus()).toBe('409');
    expect(failingEntryReader.getIssueSeverities()).toEqual(['error']);
    expect(failingEntryReader.getIssueDiagnostics()).toEqual(['Employee must be disabled before purge.']);
  });
});
