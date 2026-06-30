import { randomBytes, createHash, randomUUID } from 'crypto';
import { describe, expect, it } from '@jest/globals';
import { CryptographyService } from '../src/CryptographyService';
import type { ICryptoHelper } from '../src/interfaces/ICryptoHelper';
import { WalletQueueStatuses } from '../src/models/wallet';
import {
  EXAMPLE_WALLET_CREATED_AT,
  EXAMPLE_WALLET_ENTITY_ID_RECIPIENT,
  EXAMPLE_WALLET_ENTITY_ID_SENDER,
  EXAMPLE_WALLET_FAILURE_MESSAGE,
  EXAMPLE_WALLET_MESSAGE_ID_EMERGENCY,
  EXAMPLE_WALLET_MESSAGE_ID_NORMAL,
  EXAMPLE_WALLET_MESSAGE_PAYLOAD,
  EXAMPLE_WALLET_PRIORITY_EMERGENCY,
  EXAMPLE_WALLET_PRIORITY_NORMAL,
  EXAMPLE_WALLET_PROTECTED_DOC_ID,
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

describe('utils/wallet-mem', () => {
  it('provisions deterministic keys per entity and reuses them on repeated calls', async () => {
    const wallet = new WalletMem({
      cryptoHelper,
      cryptography: new CryptographyService(cryptoHelper),
    });

    const first = await wallet.provisionKeys(EXAMPLE_WALLET_ENTITY_ID_SENDER);
    const second = await wallet.provisionKeys(EXAMPLE_WALLET_ENTITY_ID_SENDER);

    expect(first.keys).toHaveLength(2);
    expect(first.keys[0].kid).toBe(second.keys[0].kid);
    expect(first.keys[1].kid).toBe(second.keys[1].kid);
  });

  it('protects and unprotects confidential documents for a provisioned entity', async () => {
    const wallet = new WalletMem({
      cryptoHelper,
      cryptography: new CryptographyService(cryptoHelper),
    });
    await wallet.provisionKeys(EXAMPLE_WALLET_ENTITY_ID_SENDER);

    const protectedDoc = await wallet.protectConfidentialData({
      id: EXAMPLE_WALLET_PROTECTED_DOC_ID,
      content: EXAMPLE_WALLET_MESSAGE_PAYLOAD,
    }, EXAMPLE_WALLET_ENTITY_ID_SENDER) as Record<string, unknown>;

    expect(protectedDoc['content']).toBeUndefined();
    expect(protectedDoc['jwe']).toBeDefined();

    const unprotectedDoc = await wallet.unprotectConfidentialData(protectedDoc, EXAMPLE_WALLET_ENTITY_ID_SENDER) as Record<string, unknown>;
    expect(unprotectedDoc['content']).toEqual(EXAMPLE_WALLET_MESSAGE_PAYLOAD);
  });

  it('rejects protection when the entity has not provisioned keys yet', async () => {
    const wallet = new WalletMem({
      cryptoHelper,
      cryptography: new CryptographyService(cryptoHelper),
    });

    await expect(
      wallet.protectConfidentialData({ content: EXAMPLE_WALLET_MESSAGE_PAYLOAD }, EXAMPLE_WALLET_ENTITY_ID_SENDER),
    ).rejects.toThrow(/provision/i);
  });

  it('packs a payload for a recipient and unpacks the same message on the recipient side', async () => {
    const senderWallet = new WalletMem({
      cryptoHelper,
      cryptography: new CryptographyService(cryptoHelper),
    });
    const recipientWallet = new WalletMem({
      cryptoHelper,
      cryptography: new CryptographyService(cryptoHelper),
    });

    await senderWallet.provisionKeys(EXAMPLE_WALLET_ENTITY_ID_SENDER);
    await recipientWallet.provisionKeys(EXAMPLE_WALLET_ENTITY_ID_RECIPIENT);
    const recipientKeys = await recipientWallet.getPublicKeys(EXAMPLE_WALLET_ENTITY_ID_RECIPIENT);

    const packed = await senderWallet.pack!(EXAMPLE_WALLET_MESSAGE_PAYLOAD, recipientKeys.encryptionJwk, EXAMPLE_WALLET_ENTITY_ID_SENDER);
    const unpacked = await recipientWallet.unpack!(packed, EXAMPLE_WALLET_ENTITY_ID_RECIPIENT);

    expect(unpacked.content).toEqual(EXAMPLE_WALLET_MESSAGE_PAYLOAD);
    expect((unpacked.meta['jwe'] as Record<string, unknown>)['header']).toBeDefined();
    expect((unpacked.meta['jws'] as Record<string, unknown>)['verified']).toBe(true);
  });

  it('keeps emergency messages ahead of normal ones in the memory queue', async () => {
    const wallet = new WalletMem({
      cryptoHelper,
      cryptography: new CryptographyService(cryptoHelper),
    });

    await wallet.enqueueMessage!({
      id: EXAMPLE_WALLET_MESSAGE_ID_NORMAL,
      createdAt: EXAMPLE_WALLET_CREATED_AT,
      payload: EXAMPLE_WALLET_MESSAGE_PAYLOAD,
      priority: EXAMPLE_WALLET_PRIORITY_NORMAL,
    });
    await wallet.enqueueMessage!({
      id: EXAMPLE_WALLET_MESSAGE_ID_EMERGENCY,
      createdAt: EXAMPLE_WALLET_CREATED_AT,
      payload: EXAMPLE_WALLET_MESSAGE_PAYLOAD,
      priority: EXAMPLE_WALLET_PRIORITY_EMERGENCY,
    });

    const next = await wallet.peekNextMessage!();
    expect(next?.id).toBe(EXAMPLE_WALLET_MESSAGE_ID_EMERGENCY);
    expect(next?.status).toBe(WalletQueueStatuses.Pending);
  });

  it('marks queued messages as delivered or failed', async () => {
    const wallet = new WalletMem({
      cryptoHelper,
      cryptography: new CryptographyService(cryptoHelper),
    });

    await wallet.enqueueMessage!({
      id: EXAMPLE_WALLET_MESSAGE_ID_NORMAL,
      createdAt: EXAMPLE_WALLET_CREATED_AT,
      payload: EXAMPLE_WALLET_MESSAGE_PAYLOAD,
      priority: EXAMPLE_WALLET_PRIORITY_NORMAL,
    });

    const delivered = await wallet.markMessageDelivered!(EXAMPLE_WALLET_MESSAGE_ID_NORMAL);
    expect(delivered.status).toBe(WalletQueueStatuses.Delivered);

    await wallet.enqueueMessage!({
      id: EXAMPLE_WALLET_MESSAGE_ID_EMERGENCY,
      createdAt: EXAMPLE_WALLET_CREATED_AT,
      payload: EXAMPLE_WALLET_MESSAGE_PAYLOAD,
      priority: EXAMPLE_WALLET_PRIORITY_EMERGENCY,
    });
    const failed = await wallet.markMessageFailed!(EXAMPLE_WALLET_MESSAGE_ID_EMERGENCY, EXAMPLE_WALLET_FAILURE_MESSAGE);
    expect(failed.status).toBe(WalletQueueStatuses.Failed);
    expect(failed.errorMessage).toBe(EXAMPLE_WALLET_FAILURE_MESSAGE);
  });
});

