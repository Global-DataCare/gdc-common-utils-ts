import { describe, expect, it } from '@jest/globals';
import { CommunicationCategoryCodes } from '../src/constants/communication.js';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims.js';
import { DocumentReferenceClaim } from '../src/models/interoperable-claims/document-reference-claims.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import {
  BundleEntryClaimsContext,
  CommunicationClaimsContext,
} from '../src/models/communication-attached-bundle-session.js';
import {
  EXAMPLE_DIDCOMM_COMMUNICATION_AUD,
  EXAMPLE_DIDCOMM_COMMUNICATION_ENTRY_TYPE,
  EXAMPLE_DIDCOMM_COMMUNICATION_ISS,
  EXAMPLE_DIDCOMM_COMMUNICATION_JTI,
  EXAMPLE_DIDCOMM_COMMUNICATION_THID,
} from '../src/examples/communication-didcomm-payload.js';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
  EXAMPLE_DOCUMENT_REFERENCE_DATE,
  EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_URL,
  EXAMPLE_MEDICATION_STATEMENT_CODE,
  EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
  EXAMPLE_MEDICATION_STATEMENT_STATUS,
  EXAMPLE_MEDICATION_STATEMENT_TEXT,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared.js';
import { CommunicationAttachedBundleSession } from '../src/utils/communication-attached-bundle-session.js';
import {
  buildDidcommPayloadFromCommunicationClaims,
  CommunicationDidcommEntryTypes,
  decodeAttachedBundleFromCommunicationClaims,
  getFirstCommunicationClaimsFromDidcommPayload,
} from '../src/utils/communication-didcomm-payload.js';
import { BundleReader } from '../src/utils/bundle-reader.js';

describe('utils/communication-didcomm-payload', () => {
  it('keeps the shared example entry type aligned with the canonical DIDComm communication type catalog', () => {
    expect(EXAMPLE_DIDCOMM_COMMUNICATION_ENTRY_TYPE).toBe(CommunicationDidcommEntryTypes.AttachedBundle);
  });

  it('wraps one communication-attached medication bundle as a DIDComm-style payload and decodes the attached bundle back', () => {
    const session = new CommunicationAttachedBundleSession({
      communicationClaims: {
        '@context': CommunicationClaimsContext,
        [CommunicationClaim.Identifier]: EXAMPLE_COMMUNICATION_IDENTIFIER,
        [CommunicationClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [CommunicationClaim.Category]: CommunicationCategoryCodes.Notification.claim,
      },
    });

    session.upsertActiveMedicationStatementEntry({
      claims: {
        '@context': BundleEntryClaimsContext,
        [MedicationStatementClaim.Identifier]: EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
        [MedicationStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [MedicationStatementClaim.Status]: EXAMPLE_MEDICATION_STATEMENT_STATUS,
        [MedicationStatementClaim.Code]: EXAMPLE_MEDICATION_STATEMENT_CODE,
        [MedicationStatementClaim.MedicationText]: EXAMPLE_MEDICATION_STATEMENT_TEXT,
      },
      fullUrl: `urn:uuid:${EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER}`,
    });
    session.saveAndReleaseActiveEntry();

    const payload = buildDidcommPayloadFromCommunicationClaims({
      communicationClaims: session.getCommunicationClaims(),
      iss: EXAMPLE_DIDCOMM_COMMUNICATION_ISS,
      aud: EXAMPLE_DIDCOMM_COMMUNICATION_AUD,
      jti: EXAMPLE_DIDCOMM_COMMUNICATION_JTI,
      thid: EXAMPLE_DIDCOMM_COMMUNICATION_THID,
    });

    const communicationClaims = getFirstCommunicationClaimsFromDidcommPayload(payload);
    const attachedBundle = decodeAttachedBundleFromCommunicationClaims(communicationClaims);
    const reader = new BundleReader(attachedBundle);

    expect(payload.body.data[0].resource.resourceType).toBe(ResourceTypesFhirR4.Communication);
    expect(communicationClaims[CommunicationClaim.Identifier]).toBe(EXAMPLE_COMMUNICATION_IDENTIFIER);
    expect(reader.getEntryClaimsByArrayIndex(0)[MedicationStatementClaim.Identifier]).toBe(EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER);
  });

  it('wraps one communication-attached medication bundle with one linked DocumentReference and decodes both entries back', () => {
    const session = new CommunicationAttachedBundleSession({
      communicationClaims: {
        '@context': CommunicationClaimsContext,
        [CommunicationClaim.Identifier]: EXAMPLE_COMMUNICATION_IDENTIFIER,
        [CommunicationClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [CommunicationClaim.Category]: CommunicationCategoryCodes.Notification.claim,
      },
    });

    session.upsertActiveMedicationStatementEntry({
      claims: {
        '@context': BundleEntryClaimsContext,
        [MedicationStatementClaim.Identifier]: EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
        [MedicationStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [MedicationStatementClaim.Status]: EXAMPLE_MEDICATION_STATEMENT_STATUS,
        [MedicationStatementClaim.Code]: EXAMPLE_MEDICATION_STATEMENT_CODE,
        [MedicationStatementClaim.MedicationText]: EXAMPLE_MEDICATION_STATEMENT_TEXT,
      },
      fullUrl: `urn:uuid:${EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER}`,
    });
    session.addContainedDocumentToActiveEntry({
      identifier: EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
      attachmentContentType: EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
      attachmentUrl: EXAMPLE_DOCUMENT_REFERENCE_URL,
      description: EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION,
      date: EXAMPLE_DOCUMENT_REFERENCE_DATE,
    });
    session.saveAndReleaseActiveEntry();

    const payload = buildDidcommPayloadFromCommunicationClaims({
      communicationClaims: session.getCommunicationClaims(),
      iss: EXAMPLE_DIDCOMM_COMMUNICATION_ISS,
      aud: EXAMPLE_DIDCOMM_COMMUNICATION_AUD,
      jti: EXAMPLE_DIDCOMM_COMMUNICATION_JTI,
      thid: EXAMPLE_DIDCOMM_COMMUNICATION_THID,
    });

    const communicationClaims = getFirstCommunicationClaimsFromDidcommPayload(payload);
    const attachedBundle = decodeAttachedBundleFromCommunicationClaims(communicationClaims);
    const reader = new BundleReader(attachedBundle);
    const medicationEntryIndex = reader.getEntryIndexByIdentifier(EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER);
    const documentReferenceEntryIndex = reader.getEntryIndexByIdentifier(EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER);

    expect(medicationEntryIndex).toBeDefined();
    expect(documentReferenceEntryIndex).toBeDefined();
    expect(
      reader.getEntryClaimsByArrayIndex(medicationEntryIndex as number)[MedicationStatementClaim.ContainedReferenceList],
    ).toBe(EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER);
    expect(
      reader.getEntryClaimsByArrayIndex(documentReferenceEntryIndex as number)[DocumentReferenceClaim.Identifier],
    ).toBe(EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER);
    expect(
      reader.getEntryClaimsByArrayIndex(documentReferenceEntryIndex as number)[DocumentReferenceClaim.ContentType],
    ).toBe(EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF);
  });

  it(`fails to decode one attached bundle when ${CommunicationClaim.ContentAttachmentData} is missing`, () => {
    expect(() => decodeAttachedBundleFromCommunicationClaims({
      [CommunicationClaim.Identifier]: EXAMPLE_COMMUNICATION_IDENTIFIER,
    })).toThrow(
      `decodeAttachedBundleFromCommunicationClaims requires ${CommunicationClaim.ContentAttachmentData}.`,
    );
  });
});
