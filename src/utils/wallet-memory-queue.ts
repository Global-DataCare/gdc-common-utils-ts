// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import type { ICryptoHelper } from '../interfaces/ICryptoHelper';
import type { IWalletQueue } from '../interfaces/IWalletQueue';
import {
  WalletMessagePriorities,
  WalletQueueStatuses,
  type WalletEnqueueMessageInput,
  type WalletMessagePriority,
  type WalletQueuedMessage,
} from '../models/wallet';

const WalletMessagePriorityOrder: Record<WalletMessagePriority, number> = {
  [WalletMessagePriorities.Emergency]: 0,
  [WalletMessagePriorities.High]: 1,
  [WalletMessagePriorities.Normal]: 2,
  [WalletMessagePriorities.Low]: 3,
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function sortQueue(messages: WalletQueuedMessage[]): WalletQueuedMessage[] {
  return [...messages].sort((left, right) => {
    const priorityDelta = WalletMessagePriorityOrder[left.priority] - WalletMessagePriorityOrder[right.priority];
    if (priorityDelta !== 0) return priorityDelta;
    return left.sequence - right.sequence;
  });
}

/**
 * Default in-memory queue/outbox implementation for `WalletMem`.
 *
 * Contract:
 * - `emergency` outranks `high`, `normal`, and `low`
 * - within the same priority level, FIFO order is preserved through `sequence`
 */
export class MemoryWalletQueue implements IWalletQueue {
  private readonly cryptoHelper: ICryptoHelper;
  private readonly messages = new Map<string, WalletQueuedMessage>();
  private sequence = 0;

  constructor(cryptoHelper: ICryptoHelper) {
    this.cryptoHelper = cryptoHelper;
  }

  /**
   * Enqueues one outbound message.
   */
  public async enqueue(input: WalletEnqueueMessageInput): Promise<WalletQueuedMessage> {
    this.sequence += 1;
    const queued: WalletQueuedMessage = {
      id: String(input.id || this.cryptoHelper.randomUUID()).trim(),
      createdAt: String(input.createdAt || new Date().toISOString()).trim(),
      priority: input.priority || WalletMessagePriorities.Normal,
      status: WalletQueueStatuses.Pending,
      sequence: this.sequence,
      payload: clone(input.payload),
      ...(input.thid ? { thid: input.thid } : {}),
      ...(input.messageType ? { messageType: input.messageType } : {}),
    };
    this.messages.set(queued.id, queued);
    return clone(queued);
  }

  /**
   * Returns the next pending message without mutating queue state.
   */
  public async peekNextPending(): Promise<WalletQueuedMessage | undefined> {
    const pending = sortQueue(
      [...this.messages.values()].filter((message) => message.status === WalletQueueStatuses.Pending),
    );
    const next = pending[0];
    return next ? clone(next) : undefined;
  }

  /**
   * Updates one queued message.
   */
  public async update(messageId: string, patch: Partial<WalletQueuedMessage>): Promise<WalletQueuedMessage> {
    const normalizedMessageId = String(messageId || '').trim();
    const current = this.messages.get(normalizedMessageId);
    if (!current) {
      throw new Error(`MemoryWalletQueue message not found: ${normalizedMessageId}`);
    }
    const updated: WalletQueuedMessage = {
      ...current,
      ...patch,
    };
    this.messages.set(normalizedMessageId, updated);
    return clone(updated);
  }

  /**
   * Lists all queued messages in processing order.
   */
  public async list(): Promise<WalletQueuedMessage[]> {
    return sortQueue([...this.messages.values()]).map((message) => clone(message));
  }
}

