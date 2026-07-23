import {
  DocumentTypeLoincOntology,
  HealthcareActorRoles,
  HealthcareBasicSections,
  HealthcareDocumentTypes,
} from '../src/constants/healthcare';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims';
import {
  BundleDocumentRequesterKinds,
  BundleDocumentRequestMessageTypes,
  buildBundleSearchReferenceUrl,
  buildBundleDocumentRequestCommunicationClaims,
  buildBundleDocumentRequestCommunicationPayload,
  buildBundleDocumentRequestCommunicationResourceFhirR4,
  communication,
  createDidcommSearchWithReferenceUrlMessage,
  createSummaryOperationRequestParameters,
  createSummaryOperationRequestParametersResource,
  createSummaryOperationRequestReferencePath,
  createSummaryOperationRequestReferenceUrl,
  IpsSummaryParameterNames,
  SummaryOperationCommunicationDefaults,
} from '../src/utils/communication-bundle-document-request';
import {
  EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_INDEX_PROVIDER_SECTOR_DID_WEB,
  EXAMPLE_IPS_BUNDLE_REFERENCE_ABSOLUTE_URL,
  EXAMPLE_IPS_BUNDLE_REFERENCE_URL,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared';

describe('utils/communication-bundle-document-request', () => {
  it('builds a canonical IPS full-document request from the subject controller', () => {
    const summaryOperationRequestParameters = createSummaryOperationRequestParameters(EXAMPLE_SUBJECT_DID);
    const claims = buildBundleDocumentRequestCommunicationClaims({
      subjectDid: EXAMPLE_SUBJECT_DID,
      sender: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
      requesterKind: BundleDocumentRequesterKinds.Controller,
      requesterIdentifier: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
      requesterRole: HealthcareActorRoles.Controller,
      documentType: DocumentTypeLoincOntology.IPS,
    });

    expect(claims[CommunicationClaim.Subject]).toBe(EXAMPLE_SUBJECT_DID);
    expect(claims[CommunicationClaim.Sender]).toBe(EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL);
    expect(claims[CommunicationClaim.ContentReference]).toBe(
      createSummaryOperationRequestReferencePath(summaryOperationRequestParameters),
    );
    expect(summaryOperationRequestParameters).toEqual([
      {
        name: IpsSummaryParameterNames.Subject,
        type: 'string',
        value: EXAMPLE_SUBJECT_DID,
      },
      {
        name: IpsSummaryParameterNames.DocumentType,
        type: 'token',
        system: 'http://loinc.org',
        value: '60591-5',
      },
    ]);
  });

  it('builds a section-scoped IPS request from a doctor/professional', () => {
    const sections = [
      HealthcareBasicSections.AllergiesAndIntolerances.attributeValue,
      HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
    ];
    const summaryOperationRequestParameters = createSummaryOperationRequestParameters(EXAMPLE_SUBJECT_DID, sections);
    const claims = buildBundleDocumentRequestCommunicationClaims({
      subjectDid: EXAMPLE_SUBJECT_DID,
      sender: EXAMPLE_EMAIL_PROFESSIONAL,
      requesterKind: BundleDocumentRequesterKinds.Employee,
      requesterIdentifier: EXAMPLE_EMAIL_PROFESSIONAL,
      requesterRole: HealthcareActorRoles.GeneralistMedicalPractitioner,
      recipient: ['did:web:index.example.org', 'did:web:controller.example.org'],
      documentType: DocumentTypeLoincOntology.IPS,
      sections,
    });

    expect(claims[CommunicationClaim.Recipient]).toBe('did:web:index.example.org,did:web:controller.example.org');
    expect(claims[CommunicationClaim.ContentReference]).toBe(
      createSummaryOperationRequestReferencePath(summaryOperationRequestParameters),
    );
  });

  it('uses omission for all sections and rejects the SMART wildcard as a summary filter', () => {
    expect(createSummaryOperationRequestParameters(EXAMPLE_SUBJECT_DID)).toHaveLength(2);
    expect(() => createSummaryOperationRequestParameters(
      EXAMPLE_SUBJECT_DID,
      ['*'],
    )).toThrow(/omit filterSections.*all available sections/i);
  });

  it('builds a FHIR R4 Communication resource and wrapped payload from the same claims', () => {
    const input = {
      subjectDid: EXAMPLE_SUBJECT_DID,
      sender: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
      requesterKind: BundleDocumentRequesterKinds.Controller,
      requesterIdentifier: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
      requesterRole: HealthcareActorRoles.Controller,
      documentType: DocumentTypeLoincOntology.IPS,
      thid: 'bundle-document-request-thread-001',
    };

    const resource = buildBundleDocumentRequestCommunicationResourceFhirR4(input);
    const payload = buildBundleDocumentRequestCommunicationPayload(input);

    expect(resource.resourceType).toBe('Communication');
    expect((resource as any).meta.claims[CommunicationClaim.ContentReference]).toBe(EXAMPLE_IPS_BUNDLE_REFERENCE_URL);
    expect(payload.thid).toBe('bundle-document-request-thread-001');
    expect(payload.body.data[0]?.type).toBe(
      BundleDocumentRequestMessageTypes.CommunicationRequestSearchWithReferenceUrl,
    );
    expect(payload.body.data[0]?.meta.claims[CommunicationClaim.Subject]).toBe(EXAMPLE_SUBJECT_DID);
  });

  it('exposes the preferred developer-facing communication helpers', () => {
    const claims = communication.newSearchWithReferencePath({
      subjectDid: EXAMPLE_SUBJECT_DID,
      sender: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
      requesterKind: BundleDocumentRequesterKinds.Controller,
      requesterIdentifier: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
      requesterRole: HealthcareActorRoles.Controller,
      documentType: DocumentTypeLoincOntology.IPS,
      summaryOperationRequestReferencePath: createSummaryOperationRequestReferencePath(
        createSummaryOperationRequestParameters(EXAMPLE_SUBJECT_DID),
      ),
    });

    expect(claims[CommunicationClaim.ContentReference]).toBe(EXAMPLE_IPS_BUNDLE_REFERENCE_URL);

    const summaryOperationClaims = communication.setRequestSummaryOperation({
      subjectId: EXAMPLE_SUBJECT_DID,
      requesterId: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
    });

    expect(summaryOperationClaims[CommunicationClaim.ContentReference]).toBe(
      SummaryOperationCommunicationDefaults.OperationPath,
    );
    expect(summaryOperationClaims[CommunicationClaim.ContentAttachmentType]).toBe(
      SummaryOperationCommunicationDefaults.AttachmentType,
    );
    expect(summaryOperationClaims[CommunicationClaim.ContentAttachmentTitle]).toBe(
      SummaryOperationCommunicationDefaults.AttachmentTitle,
    );
    expect(
      JSON.parse(
        Buffer.from(
          String(summaryOperationClaims[CommunicationClaim.ContentAttachmentData] || ''),
          'base64',
        ).toString('utf8'),
      ),
    ).toEqual(
      createSummaryOperationRequestParametersResource(
        createSummaryOperationRequestParameters(EXAMPLE_SUBJECT_DID),
      ),
    );
  });

  it('keeps the direct bundle-search helper aligned with the parameter-based flattening', () => {
    const sections = [HealthcareBasicSections.HistoryOfMedicationUse.attributeValue];
    const summaryOperationRequestParameters = createSummaryOperationRequestParameters(EXAMPLE_SUBJECT_DID, sections);

    expect(
      buildBundleSearchReferenceUrl({
        subjectDid: EXAMPLE_SUBJECT_DID,
        documentTypeAttributeValue: HealthcareDocumentTypes.IPS.attributeValue,
        sections,
      }),
    ).toBe(createSummaryOperationRequestReferencePath(summaryOperationRequestParameters));
  });

  it('builds the full GW CORE request url from provider sector did + reference path', () => {
    expect(createSummaryOperationRequestReferenceUrl({
      providerSectorDidWeb: EXAMPLE_INDEX_PROVIDER_SECTOR_DID_WEB,
      summaryOperationRequestReferencePath: EXAMPLE_IPS_BUNDLE_REFERENCE_URL,
    })).toBe(EXAMPLE_IPS_BUNDLE_REFERENCE_ABSOLUTE_URL);
  });

  it('builds a short-path didcomm payload from subjectId + requesterId', () => {
    const payload = createDidcommSearchWithReferenceUrlMessage({
      subjectId: EXAMPLE_SUBJECT_DID,
      requesterId: 'did:web:api.acme.org:employee:doctor.oncall@example.org:ISCO-08|2211',
      providerSectorDidWeb: EXAMPLE_INDEX_PROVIDER_SECTOR_DID_WEB,
    });

    expect(payload.body.data[0]?.meta.claims[CommunicationClaim.Subject]).toBe(EXAMPLE_SUBJECT_DID);
    expect(payload.body.data[0]?.meta.claims[CommunicationClaim.Sender]).toBe(
      'did:web:api.acme.org:employee:doctor.oncall@example.org:ISCO-08|2211',
    );
    expect(payload.body.data[0]?.meta.claims[CommunicationClaim.ContentReference]).toBe(
      EXAMPLE_IPS_BUNDLE_REFERENCE_URL,
    );
    expect(payload.body.data[0]?.type).toBe(
      BundleDocumentRequestMessageTypes.CommunicationRequestSearchWithReferenceUrl,
    );
  });

  it('creates IPS summary search claims without requiring a prebuilt reference path', () => {
    const claims = communication.newIpsSummarySearchCommunication({
      subjectId: EXAMPLE_SUBJECT_DID,
      requesterId: EXAMPLE_EMAIL_PROFESSIONAL,
    });

    expect(claims[CommunicationClaim.ContentReference]).toBe(EXAMPLE_IPS_BUNDLE_REFERENCE_URL);
  });
});
