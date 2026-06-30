import { randomBytes, createHash, randomUUID } from 'crypto';
import { describe, expect, it } from '@jest/globals';
import { CryptographyService } from '../src/CryptographyService';
import type { ICryptoHelper } from '../src/interfaces/ICryptoHelper';
import {
  EXAMPLE_WALLET_CREATED_AT,
  EXAMPLE_WALLET_ENTITY_ID_RECIPIENT,
  EXAMPLE_WALLET_ENTITY_ID_SENDER,
  EXAMPLE_WALLET_MESSAGE_ID_EMERGENCY,
  EXAMPLE_WALLET_MESSAGE_ID_NORMAL,
  EXAMPLE_WALLET_MESSAGE_PAYLOAD,
  EXAMPLE_WALLET_PRIORITY_EMERGENCY,
  EXAMPLE_WALLET_PRIORITY_NORMAL,
} from '../src/examples/wallet-mem';
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

describe('101: wallet mem step by step', () => {
  it('teaches how one frontend-like sender and one BFF-like recipient can pack, queue, and unpack one DIDComm payload', async () => {
    /**
     * Teaching goal:
     * - show the lowest reusable wallet layer that tests can use without
     *   actor-specific SDK facades
     * - keep the queue local to memory while preserving emergency priority
     * - pack one business payload as nested JWS+JWE and unpack it on the
     *   recipient side
     */
    const senderWallet = new WalletMem({
      cryptoHelper,
      cryptography: new CryptographyService(cryptoHelper),
    });
    const recipientWallet = new WalletMem({
      cryptoHelper,
      cryptography: new CryptographyService(cryptoHelper),
    });

    // Step 1.
    await senderWallet.provisionKeys(EXAMPLE_WALLET_ENTITY_ID_SENDER);
    await recipientWallet.provisionKeys(EXAMPLE_WALLET_ENTITY_ID_RECIPIENT);
    const recipientKeys = await recipientWallet.getPublicKeys(EXAMPLE_WALLET_ENTITY_ID_RECIPIENT);

    // Step 2.
    await senderWallet.enqueueMessage!({
      id: EXAMPLE_WALLET_MESSAGE_ID_NORMAL,
      createdAt: EXAMPLE_WALLET_CREATED_AT,
      payload: EXAMPLE_WALLET_MESSAGE_PAYLOAD,
      priority: EXAMPLE_WALLET_PRIORITY_NORMAL,
    });
    await senderWallet.enqueueMessage!({
      id: EXAMPLE_WALLET_MESSAGE_ID_EMERGENCY,
      createdAt: EXAMPLE_WALLET_CREATED_AT,
      payload: EXAMPLE_WALLET_MESSAGE_PAYLOAD,
      priority: EXAMPLE_WALLET_PRIORITY_EMERGENCY,
    });

    const firstPending = await senderWallet.peekNextMessage!();
    expect(firstPending?.id).toBe(EXAMPLE_WALLET_MESSAGE_ID_EMERGENCY);

    // Step 3.
    const packed = await senderWallet.pack!(
      EXAMPLE_WALLET_MESSAGE_PAYLOAD,
      recipientKeys.encryptionJwk,
      EXAMPLE_WALLET_ENTITY_ID_SENDER,
    );
    const unpacked = await recipientWallet.unpack!(packed, EXAMPLE_WALLET_ENTITY_ID_RECIPIENT);

    expect(unpacked.content).toEqual(EXAMPLE_WALLET_MESSAGE_PAYLOAD);
  });
});
