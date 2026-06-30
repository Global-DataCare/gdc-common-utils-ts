import { createHash, randomBytes, randomUUID } from 'crypto';
import { describe, expect, it } from '@jest/globals';
import { CryptographyService } from '../src/CryptographyService';
import type { ICryptoHelper } from '../src/interfaces/ICryptoHelper';
import { CommunicationCategoryCodes } from '../src/constants/communication.js';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import {
  EXAMPLE_DIDCOMM_ACK_BODY_OK_KEY,
  EXAMPLE_DIDCOMM_ACK_BODY_RECEIVED_MEDICATION_IDENTIFIER_KEY,
  EXAMPLE_DIDCOMM_ACK_TYPE,
  EXAMPLE_DIDCOMM_BUNDLE_ENTRY_CONTEXT,
  EXAMPLE_DIDCOMM_COMMUNICATION_AUD,
  EXAMPLE_DIDCOMM_COMMUNICATION_ATTACHMENT_CONTEXT,
  EXAMPLE_DIDCOMM_COMMUNICATION_ISS,
  EXAMPLE_DIDCOMM_COMMUNICATION_JTI,
  EXAMPLE_DIDCOMM_REPLY_AUD,
  EXAMPLE_DIDCOMM_REPLY_JTI,
  EXAMPLE_DIDCOMM_COMMUNICATION_THID,
} from '../src/examples/communication-didcomm-payload.js';
import {
  EXAMPLE_PROFILE_MANAGER_MEM_DID,
  EXAMPLE_PROFILE_MANAGER_MEM_DISPLAY_NAME,
  EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_DID,
  EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_DISPLAY_NAME,
  EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID,
  EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_EMERGENCY,
  EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID,
} from '../src/examples/profile-manager-mem.js';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_MEDICATION_STATEMENT_CODE,
  EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
  EXAMPLE_MEDICATION_STATEMENT_STATUS,
  EXAMPLE_MEDICATION_STATEMENT_TEXT,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared.js';
import { CommunicationAttachedBundleSession } from '../src/utils/communication-attached-bundle-session.js';
import {
  buildDidcommPayloadFromCommunicationClaims,
  decodeAttachedBundleFromCommunicationClaims,
  getFirstCommunicationClaimsFromDidcommPayload,
} from '../src/utils/communication-didcomm-payload.js';
import { ProfileManagerMem } from '../src/utils/profile-manager-mem.js';
import { WalletMem } from '../src/utils/wallet-mem.js';
import { BundleReader } from '../src/utils/bundle-reader.js';

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

describe('101: communication bundle through profile manager and wallet', () => {
  it('teaches the end-to-end path from clinical bundle editing to DIDComm pack/unpack and bundle readback', async () => {
    /**
     * Teaching goal:
     * - show the real low-level path an app/BFF can use without actor facades
     * - show what belongs to frontend clinical editing vs BFF DIDComm wrapping
     * - clarify why the outer `Communication` uses `FHIR_R4` while the inner
     *   bundle-entry claims use `FHIR_API`
     * - author a medication entry through `CommunicationAttachedBundleSession`
     * - wrap the resulting `Communication` claims as DIDComm batch payload
     * - let the BFF/runtime layer encrypt and send it through `ProfileManagerMem`
     * - decode the payload on the receiver side and read the attached bundle
     *
     * Escape hatch note:
     * - direct `WalletMem.pack/unpack` exists for raw transport tests
     * - the main tutorial path here is profile -> message manager -> decoded
     *   communication bundle
     */
    const senderWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    const gatewayWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    await gatewayWallet.provisionKeys(EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID);

    const session = new CommunicationAttachedBundleSession({
      communicationClaims: {
        '@context': EXAMPLE_DIDCOMM_COMMUNICATION_ATTACHMENT_CONTEXT,
        [CommunicationClaim.Identifier]: EXAMPLE_COMMUNICATION_IDENTIFIER,
        [CommunicationClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [CommunicationClaim.Category]: CommunicationCategoryCodes.Notification.claim,
      },
    });

    // Step 1.
    // Frontend/app responsibility:
    // edit the clinical payload and persist it in one Communication attachment.
    // Context rule:
    // - outer `Communication` claims stay `FHIR_R4`
    // - inner `resource.meta.claims` rows stay `FHIR_API`
    // This split is intentional: transport shell outside, reusable neutral
    // claim vocabulary inside.
    session.upsertActiveMedicationStatementEntry({
      claims: {
        '@context': EXAMPLE_DIDCOMM_BUNDLE_ENTRY_CONTEXT,
        [MedicationStatementClaim.Identifier]: EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
        [MedicationStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [MedicationStatementClaim.Status]: EXAMPLE_MEDICATION_STATEMENT_STATUS,
        [MedicationStatementClaim.Code]: EXAMPLE_MEDICATION_STATEMENT_CODE,
        [MedicationStatementClaim.MedicationText]: EXAMPLE_MEDICATION_STATEMENT_TEXT,
      },
      fullUrl: `urn:uuid:${EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER}`,
    });
    session.saveAndReleaseActiveEntry();

    // Step 2.
    // BFF/runtime responsibility:
    // wrap the final Communication claims as DIDComm plaintext JSON before
    // crypto. In one plain/FHIR-compat mode this payload can travel as-is.
    // In the normal proxy mode this payload becomes the input to wallet pack/encrypt.
    // Semantics:
    // - BFF first wraps `Bundle` inside `Communication`
    // - then wraps `Communication` inside DIDComm plaintext JSON
    const didcommPayload = buildDidcommPayloadFromCommunicationClaims({
      communicationClaims: session.getCommunicationClaims(),
      iss: EXAMPLE_DIDCOMM_COMMUNICATION_ISS,
      aud: EXAMPLE_DIDCOMM_COMMUNICATION_AUD,
      jti: EXAMPLE_DIDCOMM_COMMUNICATION_JTI,
      thid: EXAMPLE_DIDCOMM_COMMUNICATION_THID,
    });
    // Step 3.
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

          expect(reader.getEntryClaimsByArrayIndex(0)[MedicationStatementClaim.Identifier]).toBe(EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER);

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
                    reader.getEntryClaimsByArrayIndex(0)[MedicationStatementClaim.Identifier],
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
    const submitted = await senderManager.submitNextPendingMessage(gatewayKeys.encryptionJwk);
    expect((submitted.response?.content as Record<string, unknown>)['thid']).toBe(EXAMPLE_DIDCOMM_COMMUNICATION_THID);
    expect(
      ((submitted.response?.content as Record<string, unknown>)['body'] as Record<string, unknown>)[
        EXAMPLE_DIDCOMM_ACK_BODY_RECEIVED_MEDICATION_IDENTIFIER_KEY
      ],
    ).toBe(EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER);
  });
});
