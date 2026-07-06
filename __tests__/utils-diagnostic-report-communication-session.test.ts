import { describe, expect, it } from '@jest/globals';
import { CommunicationCategoryCodes } from '../src/constants/communication.js';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { Format } from '../src/constants/Schemas.js';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims.js';
import { DiagnosticReportClaim } from '../src/models/interoperable-claims/diagnostic-report-claims.js';
import { DocumentReferenceClaim } from '../src/models/interoperable-claims/document-reference-claims.js';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_DIAGNOSTIC_REPORT_CATEGORY,
  EXAMPLE_DIAGNOSTIC_REPORT_CODE,
  EXAMPLE_DIAGNOSTIC_REPORT_CONTAINED_DOCUMENT_IDENTIFIER,
  EXAMPLE_DIAGNOSTIC_REPORT_DATE,
  EXAMPLE_DIAGNOSTIC_REPORT_ENCOUNTER_REFERENCE,
  EXAMPLE_DIAGNOSTIC_REPORT_IDENTIFIER,
  EXAMPLE_DIAGNOSTIC_REPORT_PERFORMER_REFERENCE,
  EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_CONTENT_TYPE,
  EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_URL,
  EXAMPLE_DIAGNOSTIC_REPORT_RESULT_REFERENCE,
  EXAMPLE_DIAGNOSTIC_REPORT_SPECIMEN_REFERENCE,
  EXAMPLE_DIAGNOSTIC_REPORT_STATUS_FINAL,
  EXAMPLE_DOCUMENT_REFERENCE_DATE,
  EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION,
  EXAMPLE_DOCUMENT_REFERENCE_LOCATION,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared.js';
import { CommunicationAttachedBundleSession } from '../src/utils/communication-attached-bundle-session.js';

describe('utils/diagnostic-report communication session', () => {
  it('upserts one DiagnosticReport entry and supports one linked DocumentReference through contained-documents', () => {
    const session = new CommunicationAttachedBundleSession({
      communicationClaims: {
        '@context': Format.FHIR_R4,
        [CommunicationClaim.Identifier]: EXAMPLE_COMMUNICATION_IDENTIFIER,
        [CommunicationClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [CommunicationClaim.Category]: CommunicationCategoryCodes.Notification.claim,
      },
    });

    session.upsertActiveDiagnosticReportEntry({
      claims: {
        '@context': Format.FHIR_API,
        [DiagnosticReportClaim.Identifier]: EXAMPLE_DIAGNOSTIC_REPORT_IDENTIFIER,
        [DiagnosticReportClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [DiagnosticReportClaim.Status]: EXAMPLE_DIAGNOSTIC_REPORT_STATUS_FINAL,
        [DiagnosticReportClaim.Date]: EXAMPLE_DIAGNOSTIC_REPORT_DATE,
        [DiagnosticReportClaim.Category]: EXAMPLE_DIAGNOSTIC_REPORT_CATEGORY,
        [DiagnosticReportClaim.Code]: EXAMPLE_DIAGNOSTIC_REPORT_CODE,
        [DiagnosticReportClaim.Encounter]: EXAMPLE_DIAGNOSTIC_REPORT_ENCOUNTER_REFERENCE,
        [DiagnosticReportClaim.Performer]: EXAMPLE_DIAGNOSTIC_REPORT_PERFORMER_REFERENCE,
        [DiagnosticReportClaim.Result]: EXAMPLE_DIAGNOSTIC_REPORT_RESULT_REFERENCE,
        [DiagnosticReportClaim.Specimen]: EXAMPLE_DIAGNOSTIC_REPORT_SPECIMEN_REFERENCE,
        [DiagnosticReportClaim.PresentedFormContentType]: EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_CONTENT_TYPE,
        [DiagnosticReportClaim.PresentedFormUrl]: EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_URL,
      },
      fullUrl: `urn:uuid:${EXAMPLE_DIAGNOSTIC_REPORT_IDENTIFIER}`,
    });

    session.addContainedDocumentToActiveEntry({
      identifier: EXAMPLE_DIAGNOSTIC_REPORT_CONTAINED_DOCUMENT_IDENTIFIER,
      attachmentContentType: EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_CONTENT_TYPE,
      attachmentUrl: EXAMPLE_DOCUMENT_REFERENCE_LOCATION,
      description: EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION,
      date: EXAMPLE_DOCUMENT_REFERENCE_DATE,
    });
    session.saveAndReleaseActiveEntry();

    const reportEntries = session.getResourceEntriesByIds([
      EXAMPLE_DIAGNOSTIC_REPORT_IDENTIFIER,
      EXAMPLE_DIAGNOSTIC_REPORT_CONTAINED_DOCUMENT_IDENTIFIER,
    ]);
    const reportEntry = reportEntries.find((entry) => entry.resource?.resourceType === ResourceTypesFhirR4.DiagnosticReport);
    const documentEntry = reportEntries.find((entry) => entry.resource?.resourceType === ResourceTypesFhirR4.DocumentReference);

    expect(reportEntry?.resource?.meta?.claims?.[DiagnosticReportClaim.ContainedReferenceList])
      .toBe(EXAMPLE_DIAGNOSTIC_REPORT_CONTAINED_DOCUMENT_IDENTIFIER);
    expect(documentEntry?.resource?.meta?.claims?.[DocumentReferenceClaim.Identifier])
      .toBe(EXAMPLE_DIAGNOSTIC_REPORT_CONTAINED_DOCUMENT_IDENTIFIER);
    expect(documentEntry?.resource?.meta?.claims?.[DocumentReferenceClaim.Subject]).toBe(EXAMPLE_SUBJECT_DID);
  });
});
