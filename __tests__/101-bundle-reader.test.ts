import {
  BundleEditor,
  BundleReader,
  type BundleReaderEntrySummary,
  EmployeeBatchEntryTypes,
  EmployeeBundleMethods,
  EmployeeBundleOperations,
  EmployeeResourceTypes,
  EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE,
  IssueSeverity,
} from '../src';

describe('101: bundle reader', () => {
  it('gives frontend-ready bundle outcome summaries, issue messages, and filtered problematic entries', () => {
    // Teaching goal:
    // - the app has already submitted one batch bundle
    // - it later receives a response bundle from transport/backend
    // - the frontend needs a bundle-level summary, not only one opened entry
    // - the frontend must be able to:
    //   - know whether the bundle contains warnings/errors
    //   - show general issue messages
    //   - iterate problematic operations one by one
    //   - filter warnings+errors instead of showing success/info noise
    //
    // Frontend use case explained:
    // - one screen shows a general banner like:
    //   "1 operation completed, 1 warning, 1 error"
    // - below that, the UI lists only the operations that need attention
    // - when the user clicks one problematic operation, the UI opens its
    //   detailed diagnostics
    // - success/info-only entries usually stay hidden from the main error list

    // Step 1.
    // Build one outgoing request bundle exactly like the app would send it.
    const requestBundle = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(EmployeeResourceTypes.employee)
      .newEntry(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier)
      .asEmployee()
      .setEmail(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.email)
      .setRole(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.role)
      .doneEntry()
      .build();

    // Step 2.
    // Simulate the response bundle that comes back from backend/transport with:
    // - one success/info operation
    // - one warning operation
    // - one failing/error operation
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
                  diagnostics: 'Employee created.',
                },
              ],
            },
          },
        },
        {
          id: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
          type: EmployeeBatchEntryTypes.purge,
          request: { method: EmployeeBundleMethods.purge },
          resource: requestBundle.entry[0].resource,
          response: {
            status: '202',
            outcome: {
              issue: [
                {
                  severity: IssueSeverity.Warning,
                  diagnostics: 'Purge accepted but pending historical cleanup.',
                },
              ],
            },
          },
        },
        {
          id: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
          type: EmployeeBatchEntryTypes.purge,
          request: { method: EmployeeBundleMethods.purge },
          resource: requestBundle.entry[0].resource,
          response: {
            status: '409',
            outcome: {
              issue: [
                {
                  severity: IssueSeverity.Error,
                  diagnostics: 'Employee must be disabled before purge.',
                },
              ],
            },
          },
        },
      ],
    };

    // Step 3.
    // The frontend opens the whole bundle response and first computes a general
    // summary for banners, toast messages, and screen-level status.
    const reader = new BundleReader(responseBundle);
    const summaries = reader.getEntrySummaries();
    const problematicEntries = reader.getEntriesWithWarningOrErrorIssues();
    const responseAnalysis = reader.getResponseAnalysis();

    // Step 4.
    // Final didactic proof:
    // the generic reader exposes bundle-level and entry-level outcome facts
    // without hardcoding employee transport details in the caller.
    expect(reader.getBundleType()).toBe(requestBundle.type);
    expect(reader.getTotalOperations()).toBe(3);
    expect(reader.getTotalSuccessfulOperations()).toBe(1);
    expect(reader.getTotalErrorOperations()).toBe(2);
    expect(reader.hasWarnings()).toBe(true);
    expect(reader.hasErrors()).toBe(true);
    expect(reader.getBundleIssueSeverities()).toEqual([
      IssueSeverity.Information,
      IssueSeverity.Warning,
      IssueSeverity.Error,
    ]);
    expect(reader.getBundleIssueDiagnostics()).toEqual([
      'Employee created.',
      'Purge accepted but pending historical cleanup.',
      'Employee must be disabled before purge.',
    ]);

    // Step 5.
    // The frontend can iterate every operation with a normalized summary.
    expect(summaries).toEqual([
      expect.objectContaining<Partial<BundleReaderEntrySummary>>({
        index: 0,
        identifier: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
        responseStatus: '201',
        severity: IssueSeverity.Information,
        issueDiagnostics: ['Employee created.'],
      }),
      expect.objectContaining<Partial<BundleReaderEntrySummary>>({
        index: 1,
        identifier: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
        responseStatus: '202',
        severity: IssueSeverity.Warning,
        issueDiagnostics: ['Purge accepted but pending historical cleanup.'],
      }),
      expect.objectContaining<Partial<BundleReaderEntrySummary>>({
        index: 2,
        identifier: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
        responseStatus: '409',
        severity: IssueSeverity.Error,
        issueDiagnostics: ['Employee must be disabled before purge.'],
      }),
    ]);

    // Step 6.
    // The frontend can filter the entries that actually need user attention:
    // warnings + errors, but not information/success.
    expect(problematicEntries).toEqual([
      expect.objectContaining<Partial<BundleReaderEntrySummary>>({
        index: 1,
        severity: IssueSeverity.Warning,
      }),
      expect.objectContaining<Partial<BundleReaderEntrySummary>>({
        index: 2,
        severity: IssueSeverity.Error,
      }),
    ]);

    // Step 7.
    // The opened-entry path still works for detail screens once the user clicks
    // one problematic operation from the filtered list.
    const failingEntryReader = new BundleReader(responseBundle).openEntry(2);
    expect(failingEntryReader.getEntryResponseStatus()).toBe('409');
    expect(failingEntryReader.getIssueSeverities()).toEqual([IssueSeverity.Error]);
    expect(failingEntryReader.getIssueDiagnostics()).toEqual(['Employee must be disabled before purge.']);

    // Step 8.
    // One frontend-friendly response analysis is available for banners or
    // screen-level result cards. Each severity bucket also keeps the resource
    // identifiers that the UI can use to reopen problematic rows later.
    expect(responseAnalysis).toEqual(expect.objectContaining({
      totalOperations: 3,
      successfulOperations: 1,
      errorOperations: 2,
      hasWarnings: true,
      hasErrors: true,
      issueDiagnostics: [
        'Employee created.',
        'Purge accepted but pending historical cleanup.',
        'Employee must be disabled before purge.',
      ],
      severityBuckets: {
        fatal: { entryIndexes: [], identifiers: [], identifierList: '' },
        error: {
          entryIndexes: [2],
          identifiers: [EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier],
          identifierList: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
        },
        warning: {
          entryIndexes: [1],
          identifiers: [EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier],
          identifierList: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
        },
        information: {
          entryIndexes: [0],
          identifiers: [EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier],
          identifierList: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
        },
        success: { entryIndexes: [], identifiers: [], identifierList: '' },
      },
    }));

    // TODO(frontend bundle-reader 101):
    // Add one case where response statuses are mixed but one entry has no
    // outcome.issue at all. Frontend use case:
    // - some backends only send HTTP-like status per operation
    // - the UI still needs a sensible summary even without diagnostics text
    //
    // TODO(frontend bundle-reader 101):
    // Add one case where one entry has several issues with mixed severities.
    // Frontend use case:
    // - the UI needs one representative severity for badges/colors
    // - but it must still show every diagnostics message in the detail drawer
    //
    // TODO(gw-core contract):
    // Prove against one real GW CORE response that `entry.id` is returned and
    // matches the canonical resource identifier, so frontend code can safely use
    // `responseAnalysis.severityBuckets.*.identifierList` to reopen resources.
  });

  it('accepts either entry[].id or data[].id as the practical response identifier source', () => {
    // Teaching goal:
    // the frontend may receive bundle-like responses in FHIR `entry[]` form or
    // JSON:API-style `data[]` form, and the reader should expose the same
    // identifier analysis in both cases.

    // Step 1.
    // Build one JSON:API-style bundle payload using `data[]` and `data[].id`.
    const jsonApiLikeResponse = {
      resourceType: 'Bundle',
      type: 'batch',
      data: [
        {
          id: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
          resource: {
            resourceType: EmployeeResourceTypes.employee,
            meta: {
              claims: {
                'org.schema.identifier': EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
              },
            },
          },
          response: {
            status: '409',
            outcome: {
              issue: [
                {
                  severity: IssueSeverity.Error,
                  diagnostics: 'Employee already exists.',
                },
              ],
            },
          },
        },
      ],
    };

    // Step 2.
    // Analyze it exactly like any other response bundle.
    const responseAnalysis = new BundleReader(jsonApiLikeResponse).getResponseAnalysis();

    // Step 3.
    // Final didactic proof:
    // `data[].id` is accepted as the canonical identifier source for later UI follow-up.
    expect(responseAnalysis.severityBuckets.error.identifierList).toBe(
      EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
    );
  });
});
