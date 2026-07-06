/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import {
  BundleEditor,
  BundleReader,
  EmployeeBatchEntryTypes,
  EmployeeBundleMethods,
  EmployeeBundleOperations,
  EmployeeResourceTypes,
  EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE,
  EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE,
  IssueSeverity,
} from '../src';

describe('101: bundle response analysis', () => {
  it('shows how a frontend screen analyzes one returned bundle to decide if submission succeeded or needs user attention', () => {
    // Teaching goal:
    // - the frontend has already sent one bundle with several operations
    // - backend returns one response bundle
    // - the screen must decide:
    //   - whether the response is structurally complete
    //   - whether all operations succeeded
    //   - whether there are warnings or errors
    //   - which operations need to be shown in the error/warning list
    //   - which diagnostics message to render in summary and detail views

    // Step 1.
    // Build the outgoing request bundle exactly like the frontend would submit it.
    const requestBundle = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(EmployeeResourceTypes.employee)
      .newEntry(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier)
      .asEmployee()
      .setEmail(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.email)
      .setRole(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.role)
      .doneEntry()
      .newEntry(EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.identifier)
      .asEmployee()
      .setEmail(EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.email)
      .setRole(EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.role)
      .doneEntry()
      .newEntry('purge-target')
      .asEmployee()
      .setEmail(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.email)
      .setRole(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.role)
      .doneEntry()
      .build();

    // Step 2.
    // Simulate the response bundle returned by backend/transport.
    // It contains:
    // - one fully successful operation
    // - one warning that still needs user visibility
    // - one hard error that blocks success
    const responseBundle = {
      resourceType: requestBundle.resourceType,
      type: requestBundle.type,
      entry: [
        {
          id: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
          ...requestBundle.entry[0],
          response: {
            status: '201',
            outcome: {
              issue: [
                {
                  severity: IssueSeverity.Information,
                  diagnostics: 'Doctor profile created.',
                },
              ],
            },
          },
        },
        {
          id: EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.identifier,
          ...requestBundle.entry[1],
          response: {
            status: '202',
            outcome: {
              issue: [
                {
                  severity: IssueSeverity.Warning,
                  diagnostics: 'Controller profile saved but pending secondary review.',
                },
              ],
            },
          },
        },
        {
          id: 'purge-target',
          type: EmployeeBatchEntryTypes.purge,
          request: { method: EmployeeBundleMethods.purge },
          resource: requestBundle.entry[2].resource,
          response: {
            status: '409',
            outcome: {
              issue: [
                {
                  severity: IssueSeverity.Error,
                  diagnostics: 'Purge rejected because the employee is still active.',
                },
              ],
            },
          },
        },
      ],
    };

    // Step 3.
    // The screen first checks whether the response is structurally complete:
    // every sent operation should come back as one response entry.
    const sentOperations = requestBundle.entry.length;
    const returnedOperations = responseBundle.entry.length;
    expect(sentOperations).toBe(3);
    expect(returnedOperations).toBe(sentOperations);

    // Step 4.
    // The screen then asks the generic reader for one normalized analysis.
    const reader = new BundleReader(responseBundle);
    const responseAnalysis = reader.getResponseAnalysis();
    const problematicEntries = reader.getEntriesWithWarningOrErrorIssues();

    // Step 5.
    // Frontend decision:
    // this submission is not "all good" because there are warnings/errors,
    // even though one operation succeeded.
    expect(reader.hasWarnings()).toBe(true);
    expect(reader.hasErrors()).toBe(true);
    expect(responseAnalysis.successfulOperations).toBe(1);
    expect(responseAnalysis.errorOperations).toBe(2);

    // Step 6.
    // The screen summary/banner can show:
    // - total operations sent/returned
    // - whether warnings or errors exist
    // - all diagnostics texts gathered from the bundle
    // - the identifiers grouped by severity, so later the UI can reopen those
    //   same resources one by one from the warning/error list.
    expect(responseAnalysis).toEqual(expect.objectContaining({
      totalOperations: 3,
      successfulOperations: 1,
      errorOperations: 2,
      hasWarnings: true,
      hasErrors: true,
      issueDiagnostics: [
        'Doctor profile created.',
        'Controller profile saved but pending secondary review.',
        'Purge rejected because the employee is still active.',
      ],
      severityBuckets: {
        fatal: { entryIndexes: [], identifiers: [], identifierList: '' },
        error: {
          entryIndexes: [2],
          identifiers: ['purge-target'],
          identifierList: 'purge-target',
        },
        warning: {
          entryIndexes: [1],
          identifiers: [EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.identifier],
          identifierList: EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.identifier,
        },
        information: {
          entryIndexes: [0],
          identifiers: [EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier],
          identifierList: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
        },
        success: { entryIndexes: [], identifiers: [], identifierList: '' },
      },
    }));

    // Step 7.
    // The screen can render only the operations that need user attention:
    // warnings + errors, while keeping success/info entries out of the
    // main problem list.
    expect(problematicEntries).toEqual([
      expect.objectContaining({
        index: 1,
        identifier: EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.identifier,
        responseStatus: '202',
        severity: IssueSeverity.Warning,
        issueDiagnostics: ['Controller profile saved but pending secondary review.'],
      }),
      expect.objectContaining({
        index: 2,
        identifier: 'purge-target',
        responseStatus: '409',
        severity: IssueSeverity.Error,
        issueDiagnostics: ['Purge rejected because the employee is still active.'],
      }),
    ]);

    // Step 8.
    // When the user opens one problematic row, the screen can fetch the exact
    // detail diagnostics for that operation.
    const selectedProblem = new BundleReader(responseBundle).openEntry(2);
    expect(selectedProblem.getEntryResponseStatus()).toBe('409');
    expect(selectedProblem.getIssueSeverities()).toEqual([IssueSeverity.Error]);
    expect(selectedProblem.getIssueDiagnostics()).toEqual([
      'Purge rejected because the employee is still active.',
    ]);

    // Step 9.
    // Final didactic proof:
    // the frontend has everything it needs to decide:
    // - response complete vs incomplete
    // - fully successful vs mixed vs failing
    // - summary message vs detailed problem list
    expect(reader.getBundleIssueDiagnostics()).toEqual(responseAnalysis.issueDiagnostics);

    // TODO(frontend response-analysis 101):
    // Add one case where returned entry count is lower than sent entry count.
    // Frontend use case:
    // - the submission may be partially processed or malformed
    // - the screen must show "response incomplete" separately from business errors
    //
    // TODO(frontend response-analysis 101):
    // Add one case where the backend returns only status codes without issue text.
    // Frontend use case:
    // - the screen still needs a fallback summary even when diagnostics are missing
    //
    // TODO(gw-core contract):
    // Prove against one real GW CORE response that `entry.id` is returned and
    // matches the canonical resource identifier, because frontend follow-up
    // actions depend on `responseAnalysis.severityBuckets.*.identifierList`.
  });
});
