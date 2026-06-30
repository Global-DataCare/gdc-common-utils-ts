import { createHash, randomBytes, randomUUID } from 'crypto';
import { describe, expect, it } from '@jest/globals';
import type { ICryptoHelper } from '../src/interfaces/ICryptoHelper';
import type { IWalletQueue } from '../src/interfaces/IWalletQueue';
import { WalletQueueStatuses, type WalletQueuedMessage } from '../src/models/wallet';
import {
  EXAMPLE_WALLET_CREATED_AT,
  EXAMPLE_WALLET_MESSAGE_ID_EMERGENCY,
  EXAMPLE_WALLET_MESSAGE_ID_NORMAL,
  EXAMPLE_WALLET_MESSAGE_PAYLOAD,
  EXAMPLE_WALLET_PRIORITY_EMERGENCY,
  EXAMPLE_WALLET_PRIORITY_NORMAL,
} from '../src/examples/wallet-mem';
import { MemoryWalletQueue } from '../src/utils/wallet-memory-queue';
import { WalletMem } from '../src/utils/wallet-mem';
import { CryptographyService } from '../src/CryptographyService';
import {
  EXAMPLE_WALLET_ENTITY_ID_RECIPIENT,
  EXAMPLE_WALLET_ENTITY_ID_SENDER,
} from '../src/examples/wallet-mem';

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

describe('utils/wallet-memory-queue', () => {
  it('preserves emergency-first priority and FIFO ordering inside the same priority', async () => {
    const queue = new MemoryWalletQueue(cryptoHelper);

    await queue.enqueue({
      id: EXAMPLE_WALLET_MESSAGE_ID_NORMAL,
      createdAt: EXAMPLE_WALLET_CREATED_AT,
      payload: EXAMPLE_WALLET_MESSAGE_PAYLOAD,
      priority: EXAMPLE_WALLET_PRIORITY_NORMAL,
    });
    await queue.enqueue({
      id: EXAMPLE_WALLET_MESSAGE_ID_EMERGENCY,
      createdAt: EXAMPLE_WALLET_CREATED_AT,
      payload: EXAMPLE_WALLET_MESSAGE_PAYLOAD,
      priority: EXAMPLE_WALLET_PRIORITY_EMERGENCY,
    });

    const listed = await queue.list();
    expect(listed[0].id).toBe(EXAMPLE_WALLET_MESSAGE_ID_EMERGENCY);
    expect(listed[1].id).toBe(EXAMPLE_WALLET_MESSAGE_ID_NORMAL);
  });

  it('lets WalletMem delegate queue operations to an injected adapter', async () => {
    class SpyQueue implements IWalletQueue {
      public readonly stored: WalletQueuedMessage[] = [];

      async enqueue(input: any): Promise<WalletQueuedMessage> {
        const queued: WalletQueuedMessage = {
          id: String(input.id || 'spy-message'),
          createdAt: String(input.createdAt || EXAMPLE_WALLET_CREATED_AT),
          priority: input.priority || EXAMPLE_WALLET_PRIORITY_NORMAL,
          status: WalletQueueStatuses.Pending,
          sequence: this.stored.length + 1,
          payload: JSON.parse(JSON.stringify(input.payload)),
          ...(input.thid ? { thid: input.thid } : {}),
          ...(input.messageType ? { messageType: input.messageType } : {}),
        };
        this.stored.push(queued);
        return JSON.parse(JSON.stringify(queued));
      }

      async peekNextPending(): Promise<WalletQueuedMessage | undefined> {
        return this.stored.find((message) => message.status === WalletQueueStatuses.Pending);
      }

      async update(messageId: string, patch: Partial<WalletQueuedMessage>): Promise<WalletQueuedMessage> {
        const index = this.stored.findIndex((message) => message.id === messageId);
        if (index < 0) throw new Error(`SpyQueue message not found: ${messageId}`);
        this.stored[index] = {
          ...this.stored[index],
          ...patch,
        };
        return JSON.parse(JSON.stringify(this.stored[index]));
      }

      async list(): Promise<WalletQueuedMessage[]> {
        return JSON.parse(JSON.stringify(this.stored));
      }
    }

    const spyQueue = new SpyQueue();
    const wallet = new WalletMem({
      cryptoHelper,
      cryptography: new CryptographyService(cryptoHelper),
      queue: spyQueue,
    });

    await wallet.provisionKeys(EXAMPLE_WALLET_ENTITY_ID_SENDER);
    await wallet.provisionKeys(EXAMPLE_WALLET_ENTITY_ID_RECIPIENT);
    await wallet.enqueueMessage!({
      id: EXAMPLE_WALLET_MESSAGE_ID_NORMAL,
      createdAt: EXAMPLE_WALLET_CREATED_AT,
      payload: EXAMPLE_WALLET_MESSAGE_PAYLOAD,
      priority: EXAMPLE_WALLET_PRIORITY_NORMAL,
    });

    expect(spyQueue.stored).toHaveLength(1);
    expect(spyQueue.stored[0].id).toBe(EXAMPLE_WALLET_MESSAGE_ID_NORMAL);
  });
});
