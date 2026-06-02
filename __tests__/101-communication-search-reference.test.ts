import { HealthcareBasicSections } from '../src/constants/healthcare';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims';
import {
  communication,
  createSummaryOperationRequestParameters,
  createSummaryOperationRequestReferencePath,
  createSummaryOperationRequestReferenceUrl,
} from '../src/utils/communication-bundle-document-request';
import {
  EXAMPLE_INDEX_PROVIDER_SECTOR_DID_WEB,
  EXAMPLE_IPS_BUNDLE_REFERENCE_ABSOLUTE_URL,
  EXAMPLE_IPS_BUNDLE_REFERENCE_URL,
  EXAMPLE_PROFESSIONAL_DID,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared';

describe('101: IPS summary search Communication', () => {
  it('documents the step-by-step IPS search flow used by frontend code today', () => {
    // Step 1.
    // Frontend/runtime already knows:
    // - which individual is being requested
    // - who the requester is
    const subjectId = EXAMPLE_SUBJECT_DID;
    const requesterId = EXAMPLE_PROFESSIONAL_DID;

    // Step 2.
    // Use the short helper to create the auditable FHIR Communication claims.
    // This helper internally creates the semantic Parameters and flattens them
    // into Communication.content-reference.
    const communicationClaims = communication.newIpsSummarySearchCommunication({
      subjectId,
      requesterId,
    });

    // Step 3.
    // Audit/debug layer: the explicit internal steps remain available and must
    // produce the exact same relative search path.
    const summaryOperationRequestParameters =
      createSummaryOperationRequestParameters(subjectId);

    const summaryOperationRequestReferencePath =
      createSummaryOperationRequestReferencePath(summaryOperationRequestParameters);

    // Step 4.
    // Runtime/backend layer: when the portal backend wants to call the provider
    // GW CORE endpoint directly, it resolves the full absolute URL from the
    // provider sector DID plus the relative content-reference path.
    const summaryOperationRequestReferenceUrl =
      createSummaryOperationRequestReferenceUrl({
        providerSectorDidWeb: EXAMPLE_INDEX_PROVIDER_SECTOR_DID_WEB,
        summaryOperationRequestReferencePath,
      });

    // Step 5.
    // Assertions: every layer must agree on the same IPS search target.
    expect(summaryOperationRequestParameters).toEqual([
      {
        name: 'subject',
        type: 'string',
        value: EXAMPLE_SUBJECT_DID,
      },
      {
        name: 'document-type',
        type: 'token',
        system: 'http://loinc.org',
        value: '60591-5',
      },
    ]);
    expect(summaryOperationRequestReferencePath).toBe(EXAMPLE_IPS_BUNDLE_REFERENCE_URL);
    expect(communicationClaims[CommunicationClaim.ContentReference]).toBe(
      EXAMPLE_IPS_BUNDLE_REFERENCE_URL,
    );
    expect(summaryOperationRequestReferenceUrl).toBe(
      EXAMPLE_IPS_BUNDLE_REFERENCE_ABSOLUTE_URL,
    );
  });

  it('documents the step-by-step IPS search flow with optional section filters', () => {
    // Step 1.
    // The requester asks only for specific IPS sections instead of the full summary.
    // This is the path to use when:
    // - frontend wants to limit the response to a smaller view
    // - the requester does not have permission for all IPS sections
    // - consent/policy evaluation already returned the allowed sections subset
    const subjectId = EXAMPLE_SUBJECT_DID;
    const requesterId = EXAMPLE_PROFESSIONAL_DID;
    const filterSections = [HealthcareBasicSections.HistoryOfMedicationUse.attributeValue];

    // Step 2.
    // The short helper still hides the flattening details from frontend code.
    const communicationClaims = communication.newIpsSummarySearchCommunication({
      subjectId,
      requesterId,
      filterSections,
    });

    // Step 3.
    // The explicit audit layer must produce the same section-scoped path.
    const summaryOperationRequestParameters =
      createSummaryOperationRequestParameters(subjectId, filterSections);

    const summaryOperationRequestReferencePath =
      createSummaryOperationRequestReferencePath(summaryOperationRequestParameters);

    // Step 4.
    // Assertions: the optional section becomes composition.section in the search path.
    // This is how the request stays aligned with section-scoped permissions.
    expect(summaryOperationRequestParameters).toEqual([
      {
        name: 'subject',
        type: 'string',
        value: EXAMPLE_SUBJECT_DID,
      },
      {
        name: 'document-type',
        type: 'token',
        system: 'http://loinc.org',
        value: '60591-5',
      },
      {
        name: 'section',
        type: 'string',
        value: HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
      },
    ]);
    expect(summaryOperationRequestReferencePath).toBe(
      `${EXAMPLE_IPS_BUNDLE_REFERENCE_URL}&composition.section=${HealthcareBasicSections.HistoryOfMedicationUse.attributeValue}`,
    );
    expect(communicationClaims[CommunicationClaim.ContentReference]).toBe(
      summaryOperationRequestReferencePath,
    );
  });
});
