import { createHash, randomBytes, randomUUID } from 'crypto';
import { describe, expect, it } from '@jest/globals';
import { CryptographyService } from '../src/CryptographyService';
import type { ICryptoHelper } from '../src/interfaces/ICryptoHelper';
import {
  EXAMPLE_PROFILE_MANAGER_MEM_DID,
  EXAMPLE_PROFILE_MANAGER_MEM_DISPLAY_NAME,
  EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_DID,
  EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_DISPLAY_NAME,
  EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID,
  EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_EMERGENCY,
  EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_NORMAL,
  EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID,
  EXAMPLE_PROFILE_MANAGER_MEM_REQUEST_PAYLOAD,
  EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD,
} from '../src/examples/profile-manager-mem';
import { ProfileManagerMem } from '../src/utils/profile-manager-mem';
import { WalletMem } from '../src/utils/wallet-mem';

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

describe('101: profile manager mem step by step', () => {
  it('teaches how one BFF-like profile manager composes wallet, queue, transport proxy, and decoded thread responses', async () => {
    /**
     * Teaching goal:
     * - show the profile-level orchestration layer that stays below actor
     *   facades but above the raw wallet
     * - keep emergency queue ordering visible from the start
     * - prove that the same manager can queue, submit, and recover one decoded
     *   response by `thid`
     */
    const senderWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    const gatewayWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });

    // Step 1.
    await gatewayWallet.provisionKeys(EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID);
    const senderManager = new ProfileManagerMem({
      profile: {
        profileId: EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID,
        did: EXAMPLE_PROFILE_MANAGER_MEM_DID,
        displayName: EXAMPLE_PROFILE_MANAGER_MEM_DISPLAY_NAME,
      },
      wallet: senderWallet,
      transport: {
        submit: async ({ envelope }) => {
          const decodedRequest = await gatewayWallet.unpack!(envelope, EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID);
          expect(decodedRequest.content).toEqual(EXAMPLE_PROFILE_MANAGER_MEM_REQUEST_PAYLOAD);
          const senderKeys = await senderWallet.getPublicKeys!(EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID);
          return {
            accepted: true,
            responseEnvelope: await gatewayWallet.pack!(
              EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD,
              senderKeys.encryptionJwk,
              EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID,
            ),
          };
        },
      },
    });
    await senderManager.initialize();
    const gatewayKeys = await gatewayWallet.getPublicKeys!(EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID);

    // Step 2.
    await senderManager.queueMessage({
      payload: EXAMPLE_PROFILE_MANAGER_MEM_REQUEST_PAYLOAD,
      priority: EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_NORMAL,
      recipientEncryptionJwk: gatewayKeys.encryptionJwk,
    });
    await senderManager.queueMessage({
      payload: EXAMPLE_PROFILE_MANAGER_MEM_REQUEST_PAYLOAD,
      priority: EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_EMERGENCY,
      recipientEncryptionJwk: gatewayKeys.encryptionJwk,
    });

    const queued = await senderManager.listQueuedMessages();
    expect(queued[0].priority).toBe(EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_EMERGENCY);

    // Step 3.
    const submission = await senderManager.submitNextPendingMessage(gatewayKeys.encryptionJwk);
    expect(submission.response?.content).toEqual(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD);
    expect(
      (await senderManager.readResponseByThreadId(String(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD.thid)))?.content,
    ).toEqual(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD);
    expect((await senderManager.listOutboxHistory())).toHaveLength(1);
  });
});
