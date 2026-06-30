import { createHash, randomBytes, randomUUID } from 'crypto';
import { describe, expect, it } from '@jest/globals';
import { CryptographyService } from '../src/CryptographyService';
import type { ICryptoHelper } from '../src/interfaces/ICryptoHelper';
import type { ProfileManagerMemProfile } from '../src/models/profile-manager';
import { WalletQueueStatuses } from '../src/models/wallet';
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

function buildProfile(profileId: string, did: string, displayName: string): ProfileManagerMemProfile {
  return {
    profileId,
    did,
    displayName,
  };
}

describe('utils/profile-manager-mem', () => {
  it('initializes one profile, queues emergency before normal, and stores the decoded response by thread', async () => {
    const senderWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    const gatewayWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    const senderProfile = buildProfile(
      EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID,
      EXAMPLE_PROFILE_MANAGER_MEM_DID,
      EXAMPLE_PROFILE_MANAGER_MEM_DISPLAY_NAME,
    );
    const gatewayProfile = buildProfile(
      EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID,
      EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_DID,
      EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_DISPLAY_NAME,
    );

    await gatewayWallet.provisionKeys(gatewayProfile.profileId);
    const senderManager = new ProfileManagerMem({
      profile: senderProfile,
      wallet: senderWallet,
      transport: {
        submit: async ({ envelope }) => {
          const decoded = await gatewayWallet.unpack!(envelope, gatewayProfile.profileId);
          expect(decoded.content).toEqual(EXAMPLE_PROFILE_MANAGER_MEM_REQUEST_PAYLOAD);

          const senderKeys = await senderWallet.getPublicKeys!(senderProfile.profileId);
          return {
            accepted: true,
            responseEnvelope: await gatewayWallet.pack!(
              EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD,
              senderKeys.encryptionJwk,
              gatewayProfile.profileId,
            ),
          };
        },
      },
    });

    await senderManager.initialize();
    const gatewayKeys = await gatewayWallet.getPublicKeys!(gatewayProfile.profileId);

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

    const firstResult = await senderManager.submitNextPendingMessage(gatewayKeys.encryptionJwk);
    expect(firstResult.message.status).toBe(WalletQueueStatuses.Delivered);
    expect(firstResult.response?.content).toEqual(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD);

    const storedResponse = senderManager.getResponseByThreadId(String(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD.thid));
    expect(storedResponse?.content).toEqual(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD);
    const history = await senderManager.listOutboxHistory();
    expect(history).toHaveLength(1);
    expect(history[0].envelope).toMatch(/\./);
    expect(history[0].responseThid).toBe(String(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD.thid));
  });

  it('marks the queued message as failed when transport rejects it', async () => {
    const senderWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    const gatewayWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    const senderProfile = buildProfile(
      EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID,
      EXAMPLE_PROFILE_MANAGER_MEM_DID,
      EXAMPLE_PROFILE_MANAGER_MEM_DISPLAY_NAME,
    );
    const gatewayProfile = buildProfile(
      EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID,
      EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_DID,
      EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_DISPLAY_NAME,
    );

    await gatewayWallet.provisionKeys(gatewayProfile.profileId);
    const senderManager = new ProfileManagerMem({
      profile: senderProfile,
      wallet: senderWallet,
      transport: {
        submit: async () => ({
          accepted: false,
          errorMessage: 'gateway-unavailable',
          retryable: true,
        }),
      },
    });

    await senderManager.initialize();
    const gatewayKeys = await gatewayWallet.getPublicKeys!(gatewayProfile.profileId);
    await senderManager.queueMessage({
      payload: EXAMPLE_PROFILE_MANAGER_MEM_REQUEST_PAYLOAD,
      priority: EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_NORMAL,
      recipientEncryptionJwk: gatewayKeys.encryptionJwk,
    });

    const result = await senderManager.submitNextPendingMessage(gatewayKeys.encryptionJwk);
    expect(result.message.status).toBe(WalletQueueStatuses.Failed);
    expect(result.message.errorMessage).toBe('gateway-unavailable');
    const history = await senderManager.listOutboxHistory();
    expect(history).toHaveLength(1);
    expect(history[0].status).toBe(WalletQueueStatuses.Failed);
  });
});
