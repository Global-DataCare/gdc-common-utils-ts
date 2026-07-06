/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { createHash, randomBytes, randomUUID } from 'crypto';
import { describe, expect, it } from '@jest/globals';
import { CryptographyService } from '../src/CryptographyService';
import type { ICryptoHelper } from '../src/interfaces/ICryptoHelper';
import { CommunicationCategoryCodes } from '../src/constants/communication.js';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims.js';
import { DocumentReferenceClaim } from '../src/models/interoperable-claims/document-reference-claims.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import {
  BundleEntryClaimsContext,
  CommunicationClaimsContext,
} from '../src/models/communication-attached-bundle-session.js';
import {
  EXAMPLE_DIDCOMM_ACK_BODY_OK_KEY,
  EXAMPLE_DIDCOMM_ACK_BODY_RECEIVED_DOCUMENT_IDENTIFIER_KEY,
  EXAMPLE_DIDCOMM_ACK_BODY_RECEIVED_MEDICATION_IDENTIFIER_KEY,
  EXAMPLE_DIDCOMM_ACK_TYPE,
  EXAMPLE_DIDCOMM_COMMUNICATION_AUD,
  EXAMPLE_DIDCOMM_COMMUNICATION_ISS,
  EXAMPLE_DIDCOMM_COMMUNICATION_JTI,
  EXAMPLE_DIDCOMM_COMMUNICATION_THID,
  EXAMPLE_DIDCOMM_REPLY_AUD,
  EXAMPLE_DIDCOMM_REPLY_JTI,
} from '../src/examples/communication-didcomm-payload.js';
import {
  EXAMPLE_PROFILE_MANAGER_MEM_DID,
  EXAMPLE_PROFILE_MANAGER_MEM_DISPLAY_NAME,
  EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_DID,
  EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID,
  EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_EMERGENCY,
  EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID,
} from '../src/examples/profile-manager-mem.js';
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
import { BundleReader } from '../src/utils/bundle-reader.js';
import {
  buildDidcommPayloadFromCommunicationClaims,
  decodeAttachedBundleFromCommunicationClaims,
  getFirstCommunicationClaimsFromDidcommPayload,
} from '../src/utils/communication-didcomm-payload.js';
import { ProfileManagerMem } from '../src/utils/profile-manager-mem.js';
import { WalletMem } from '../src/utils/wallet-mem.js';

const cryptoHelper: ICryptoHelper = {
  async getRandomBytes(byteCount: number): Promise<Uint8Array> {
    return randomBytes(byteCount);
  },
  async digestString(data: string, algorithm: string): Promise<string> {
    const normalized = String(algorithm).replace('-', '').toLowerCase();
    return createHash(normalized).update(data).digest('hex');
  },
  randomUUID(): string {
    return randomUUID();
  },
};

describe('101: communication DocumentReference through profile manager and wallet', () => {
  it('teaches the end-to-end path for one medication bundle entry linked to one DocumentReference carried inside Communication', async () => {
    /**
     * Teaching goal:
     * - show the split between frontend clinical authoring and BFF DIDComm wrapping
     * - clarify the context split:
     *   outer `Communication` = `FHIR_R4`
     *   inner bundle-entry claims = `FHIR_API`
     * - author one medication entry and one linked DocumentReference in the same attached bundle
     * - wrap the final Communication claims as DIDComm plaintext JSON on the BFF side
     * - let the wallet/profile runtime pack, encrypt, send, decrypt, and decode
     * - prove that the GW-like side can read both the medication and the linked document back
     *
     * Escape hatch note:
     * - direct `WalletMem.pack/unpack` remains useful for transport-only tests
     * - the main tutorial path here is frontend bundle authoring -> BFF wrap -> GW-like readback
     */
    const senderWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    const gatewayWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    await gatewayWallet.provisionKeys(EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID);

    const session = new CommunicationAttachedBundleSession({
      communicationClaims: {
        '@context': CommunicationClaimsContext,
        [CommunicationClaim.Identifier]: EXAMPLE_COMMUNICATION_IDENTIFIER,
        [CommunicationClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [CommunicationClaim.Category]: CommunicationCategoryCodes.Notification.claim,
      },
    });

    // Step 1.
    // Frontend/app responsibility:
    // build the clinical payload that will later travel inside one Communication attachment.
    // Context rule:
    // - the attachment container is still one FHIR `Communication`, so it uses `FHIR_R4`
    // - the authored bundle rows are stored as neutral `FHIR_API` claims for reuse
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

    // Step 2.
    // BFF/runtime responsibility:
    // convert the final Communication claims into DIDComm plaintext JSON.
    // In plain/FHIR-compat mode this object can travel as-is.
    // In the normal secure path it becomes the wallet pack/encrypt input.
    // Semantics:
    // - first: clinical `Bundle` is already embedded in `Communication`
    // - second: the BFF wraps that `Communication` inside DIDComm plaintext JSON
    const didcommPayload = buildDidcommPayloadFromCommunicationClaims({
      communicationClaims: session.getCommunicationClaims(),
      iss: EXAMPLE_DIDCOMM_COMMUNICATION_ISS,
      aud: EXAMPLE_DIDCOMM_COMMUNICATION_AUD,
      jti: EXAMPLE_DIDCOMM_COMMUNICATION_JTI,
      thid: EXAMPLE_DIDCOMM_COMMUNICATION_THID,
    });

    // Step 3.
    // Runtime responsibility:
    // queue, encrypt, submit, decrypt the response, and expose decoded payloads.
    const senderManager = new ProfileManagerMem({
      profile: {
        profileId: EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID,
        did: EXAMPLE_PROFILE_MANAGER_MEM_DID,
        displayName: EXAMPLE_PROFILE_MANAGER_MEM_DISPLAY_NAME,
      },
      wallet: senderWallet,
      transport: {
        submit: async ({ envelope }) => {
          const decoded = await gatewayWallet.unpack!(envelope, EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID);
          const communicationClaims = getFirstCommunicationClaimsFromDidcommPayload(decoded.content as any);
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
            reader.getEntryClaimsByArrayIndex(documentReferenceEntryIndex as number)[DocumentReferenceClaim.ContentType],
          ).toBe(EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF);
          expect(
            reader.getEntryClaimsByArrayIndex(documentReferenceEntryIndex as number)[DocumentReferenceClaim.Location],
          ).toBe(EXAMPLE_DOCUMENT_REFERENCE_URL);

          const senderKeys = await senderWallet.getPublicKeys!(EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID);
          return {
            accepted: true,
            responseEnvelope: await gatewayWallet.pack!(
              {
                iss: EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_DID,
                aud: EXAMPLE_DIDCOMM_REPLY_AUD,
                jti: EXAMPLE_DIDCOMM_REPLY_JTI,
                thid: EXAMPLE_DIDCOMM_COMMUNICATION_THID,
                type: EXAMPLE_DIDCOMM_ACK_TYPE,
                body: {
                  [EXAMPLE_DIDCOMM_ACK_BODY_OK_KEY]: true,
                  [EXAMPLE_DIDCOMM_ACK_BODY_RECEIVED_MEDICATION_IDENTIFIER_KEY]:
                    reader.getEntryClaimsByArrayIndex(medicationEntryIndex as number)[MedicationStatementClaim.Identifier],
                  [EXAMPLE_DIDCOMM_ACK_BODY_RECEIVED_DOCUMENT_IDENTIFIER_KEY]:
                    reader.getEntryClaimsByArrayIndex(documentReferenceEntryIndex as number)[DocumentReferenceClaim.Identifier],
                },
              },
              senderKeys.encryptionJwk,
              EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID,
            ),
          };
        },
      },
    });
    await senderManager.initialize();
    const gatewayKeys = await gatewayWallet.getPublicKeys!(EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID);
    await senderManager.queueMessage({
      payload: didcommPayload as unknown as Record<string, unknown>,
      priority: EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_EMERGENCY,
      recipientEncryptionJwk: gatewayKeys.encryptionJwk,
    });

    // Step 4.
    // App/BFF responsibility after send:
    // inspect the decoded ack and correlate it with the original thread/message intent.
    const submitted = await senderManager.submitNextPendingMessage(gatewayKeys.encryptionJwk);
    const responseContent = submitted.response?.content as Record<string, unknown>;
    const responseBody = responseContent.body as Record<string, unknown>;

    expect(responseContent.thid).toBe(EXAMPLE_DIDCOMM_COMMUNICATION_THID);
    expect(responseBody[EXAMPLE_DIDCOMM_ACK_BODY_OK_KEY]).toBe(true);
    expect(responseBody[EXAMPLE_DIDCOMM_ACK_BODY_RECEIVED_MEDICATION_IDENTIFIER_KEY])
      .toBe(EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER);
    expect(responseBody[EXAMPLE_DIDCOMM_ACK_BODY_RECEIVED_DOCUMENT_IDENTIFIER_KEY])
      .toBe(EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER);
  });
});
