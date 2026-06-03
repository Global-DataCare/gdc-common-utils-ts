import { describe, test } from '@jest/globals';

describe('TODO diagnostic report integration', () => {
  test.todo(
    'add DiagnosticReport claim helpers with get/set/add/remove for list-valued search-param claims',
  );

  test.todo(
    'add focused helpers for DiagnosticReport.contained-documents and presented-form attachment fields',
  );

  test.todo(
    'keep helper names aligned with DiagnosticReportSearchParamNames and reuse shared claim keys from common-utils in every repo',
  );

  test.todo(
    'add CommunicationAttachedBundleSession.upsertActiveDiagnosticReportEntry(...) with identifier-based upsert semantics',
  );

  test.todo(
    'add bundle-editor coverage for linked DocumentReference ids stored in DiagnosticReport.contained-documents',
  );

  test.todo(
    'cover GW Core extraction helpers against the same DiagnosticReport shared claims before enabling IPS authoring examples',
  );
});
