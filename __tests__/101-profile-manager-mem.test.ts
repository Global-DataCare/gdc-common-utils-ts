/**
 * 101 note:
 * - Read `CONTRIBUTING.md` first. The shared test rules there are part of this file.
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Do not introduce inline literals when a shared type, constant, fixture, or
 *   validation issue already exists in `src/constants/*`, `src/models/*`, or
 *   `src/examples/*`.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

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
  it('teaches the main common-utils path: ProfileManagerMem first, then wallet/session transport details', async () => {
    /**
     * Teaching goal:
     * - start from `ProfileManagerMem` as the main public profile/session
     *   surface in this package
     * - show that wallet and queue details exist underneath that profile
     *   manager instead of being the first mental model
     * - keep emergency queue ordering visible from the start
     * - prove that the same manager can queue, submit, and recover one decoded
     *   response by `thid`
     *
     * Main narrative here:
     * `ProfileManagerMem -> wallet/profile session -> transport proxy -> decoded thread response`
     *
     * Ownership rule:
     * - normal case: this wallet belongs to the unlocked user profile runtime
     * - that user-profile wallet encrypts outbound messages and decrypts
     *   inbound replies
     * - an extra BFF/service wallet is optional infrastructure, not the
     *   default actor of this 101
     *
     * Scope guard:
     * - this file is transport-only
     * - it does not teach how to build one `Communication` or one clinical
     *   bundle
     * - for business-payload authoring, continue to:
     *   `101-communication-profile-wallet-e2e.test.ts`
     * - that split is intentional: first learn "how the profile sends", then
     *   learn "what business payload the profile is sending"
     *
     * Secondary details:
     * - direct `WalletMem` behavior
     * - envelope structure
     * - queue ordering internals
     */
    const senderWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    const gatewayWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });

    /**
     * Actors in this example:
     *
     * - sender profile:
     *   the user-owned local profile that wants to send one message and owns
     *   the crypto in the normal path
     * - gateway profile:
     *   the remote side that receives the encrypted envelope, reads it, and
     *   sends one encrypted reply back
     *
     * The beginner mental model is:
     *
     * 1. create one `ProfileManagerMem` for the sender profile
     * 2. queue one or more business payloads on that profile
     * 3. let the profile manager encrypt, send, and remember the reply
     *
     * The wallets exist underneath that flow only because the profile manager
     * needs keys to protect the transport.
     */

    // Step 1: prepare the remote side and create the local sender profile manager.
    //
    // What happens here:
    // - the gateway provisions its keys so it can decrypt incoming messages
    // - the sender creates one ProfileManagerMem bound to its own profile
    // - the sender configures one transport callback that simulates "send to GW"
    //
    // What the newbie should remember:
    // - `ProfileManagerMem` is the public entrypoint
    // - the `transport.submit(...)` callback is "where messages go"
    // - the callback returns one encrypted reply envelope
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
          // The gateway receives one encrypted envelope from the sender profile.
          const decodedRequest = await gatewayWallet.unpack!(envelope, EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID);

          // After decrypting, the gateway should see the original business payload.
          expect(decodedRequest.content).toEqual(EXAMPLE_PROFILE_MANAGER_MEM_REQUEST_PAYLOAD);

          // The gateway now prepares an encrypted reply back to the sender.
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

    // Step 2: queue business payloads on the sender profile.
    //
    // What happens here:
    // - the sender queues two outgoing messages
    // - both have the same payload here, but different priorities
    // - the emergency one should be processed first
    //
    // What the newbie should remember:
    // - queueing happens at profile-manager level
    // - the caller passes a plain business payload
    // - the caller does not manually encrypt at this point
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

    // Step 3: send the next pending message and read the stored reply.
    //
    // What happens here:
    // - the sender profile manager takes the highest-priority queued message
    // - it encrypts it for the gateway
    // - the gateway decrypts it, validates it, and returns an encrypted reply
    // - the sender decrypts that reply and stores it by thread id (`thid`)
    //
    // What the newbie should remember:
    // - `submitNextPendingMessage(...)` is the "do the send now" step
    // - `readResponseByThreadId(...)` is how the same profile reads the reply later
    const submission = await senderManager.submitNextPendingMessage(gatewayKeys.encryptionJwk);
    expect(submission.response?.content).toEqual(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD);
    expect(
      (await senderManager.readResponseByThreadId(String(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD.thid)))?.content,
    ).toEqual(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD);
    expect((await senderManager.listOutboxHistory())).toHaveLength(1);
  });
});
