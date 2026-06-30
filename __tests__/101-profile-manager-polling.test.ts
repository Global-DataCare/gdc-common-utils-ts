import { createHash, randomBytes, randomUUID } from 'crypto';
import { describe, expect, it } from '@jest/globals';
import { CryptographyService } from '../src/CryptographyService';
import type { ICryptoHelper } from '../src/interfaces/ICryptoHelper';
import {
  EXAMPLE_PROFILE_MANAGER_MEM_DID,
  EXAMPLE_PROFILE_MANAGER_MEM_DISPLAY_NAME,
  EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID,
  EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_NORMAL,
  EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID,
  EXAMPLE_PROFILE_MANAGER_MEM_REQUEST_PAYLOAD,
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

describe('101: profile manager async polling step by step', () => {
  it('teaches the asynchronous GW-style flow: submit accepted now, response later by poll', async () => {
    /**
     * Teaching goal:
     * - show the next step after queue + immediate response
     * - model one GW-style async flow where submit only returns a location
     * - complete the interaction later through `pollSubmittedMessage(...)`
     */
    const wallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    const gatewayWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    const manager = new ProfileManagerMem({
      profile: {
        profileId: EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID,
        did: EXAMPLE_PROFILE_MANAGER_MEM_DID,
        displayName: EXAMPLE_PROFILE_MANAGER_MEM_DISPLAY_NAME,
      },
      wallet,
      transport: {
        submit: async () => ({
          accepted: true,
          locationUrl: '/jobs/job-async-001',
        }),
        poll: async () => ({
          pending: true,
        }),
      },
    });

    // Step 1.
    await gatewayWallet.provisionKeys(EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID);
    await manager.initialize();
    const gatewayKeys = await gatewayWallet.getPublicKeys!(EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID);
    await manager.queueMessage({
      payload: EXAMPLE_PROFILE_MANAGER_MEM_REQUEST_PAYLOAD,
      priority: EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_NORMAL,
      recipientEncryptionJwk: gatewayKeys.encryptionJwk,
    });

    // Step 2.
    const submitted = await manager.submitNextPendingMessage(gatewayKeys.encryptionJwk);
    expect(submitted.pending).toBe(true);
    const history = await manager.listOutboxHistory();
    expect(history[0].locationUrl).toBe('/jobs/job-async-001');

    // Step 3.
    const pollResult = await manager.pollSubmittedMessage(history[0].id);
    expect(pollResult.pending).toBe(true);
    expect(pollResult.record.transportStatus).toBe('submitted');
  });
});
