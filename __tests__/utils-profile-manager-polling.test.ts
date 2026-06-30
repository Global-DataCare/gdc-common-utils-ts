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

describe('utils/profile-manager-mem polling', () => {
  it('supports submit accepted first and completed later through poll', async () => {
    const senderWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    const gatewayWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    await gatewayWallet.provisionKeys(EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID);
    const senderManager = new ProfileManagerMem({
      profile: {
        profileId: EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID,
        did: EXAMPLE_PROFILE_MANAGER_MEM_DID,
        displayName: EXAMPLE_PROFILE_MANAGER_MEM_DISPLAY_NAME,
      },
      wallet: senderWallet,
      transport: {
        submit: async () => ({
          accepted: true,
          locationUrl: '/jobs/job-001',
        }),
        poll: async ({ message }) => {
          expect(message.locationUrl).toBe('/jobs/job-001');
          const senderKeys = await senderWallet.getPublicKeys!(EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID);
          return {
            pending: false,
            completed: true,
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
    await senderManager.queueMessage({
      payload: EXAMPLE_PROFILE_MANAGER_MEM_REQUEST_PAYLOAD,
      priority: EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_NORMAL,
      recipientEncryptionJwk: gatewayKeys.encryptionJwk,
    });

    const submitted = await senderManager.submitNextPendingMessage(gatewayKeys.encryptionJwk);
    expect(submitted.pending).toBe(true);
    const historyAfterSubmit = await senderManager.listOutboxHistory();
    expect(historyAfterSubmit[0].transportStatus).toBe('submitted');
    expect(historyAfterSubmit[0].locationUrl).toBe('/jobs/job-001');

    const polled = await senderManager.pollSubmittedMessage(historyAfterSubmit[0].id);
    expect(polled.pending).toBe(false);
    expect(polled.response?.content).toEqual(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD);
    expect(polled.record.transportStatus).toBe('completed');
    expect(polled.record.responseThid).toBe(String(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD.thid));
  });
});

