// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import type { IWallet } from '../interfaces/IWallet';
import type { IProfileOutboxRepository } from '../interfaces/IProfileOutboxRepository';
import type {
  BackendMessageTransportPollResult,
  BackendMessageResponseRecord,
  BackendMessageTransport,
  ProfileOutboxMessageRecord,
  QueueProfileMessageInput,
} from '../models/profile-manager';
import { WalletQueueStatuses, type WalletQueuedMessage } from '../models/wallet';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export type BackendMessageManagerMemOptions = Readonly<{
  wallet: IWallet;
  entityId: string;
  transport: BackendMessageTransport;
  outboxRepository: IProfileOutboxRepository;
}>;

/**
 * Memory-backed backend message manager that:
 * - queues outbound payloads through `WalletMem`
 * - packs the next pending message as DIDComm-like JWS+JWE
 * - submits it through an injected transport
 * - unwraps the response and indexes it by `thid`
 *
 * This is the lowest reusable BFF/proxy slice before actor-specific SDK
 * facades appear.
 *
 * Normal deployment story:
 * - the injected wallet is the unlocked wallet of the user profile runtime
 * - that same profile wallet usually encrypts outbound messages and decrypts
 *   replies
 *
 * Optional deployment story:
 * - one BFF/proxy may also own a separate service wallet for its own
 *   envelopes, signatures, confidential storage, or tenant-level messaging
 * - that service wallet is a different actor and must not be confused with
 *   the user-profile wallet handled here
 */
export class BackendMessageManagerMem {
  private readonly wallet: IWallet;
  private readonly entityId: string;
  private readonly transport: BackendMessageTransport;
  private readonly outboxRepository: IProfileOutboxRepository;
  private readonly responsesByThread = new Map<string, BackendMessageResponseRecord>();

  constructor(options: BackendMessageManagerMemOptions) {
    this.wallet = options.wallet;
    this.entityId = String(options.entityId || '').trim();
    this.transport = options.transport;
    this.outboxRepository = options.outboxRepository;
  }

  /**
   * Queues one outbound business payload for later submission.
   */
  public async queueMessage(input: QueueProfileMessageInput): Promise<WalletQueuedMessage> {
    if (!this.wallet.enqueueMessage) {
      throw new Error('BackendMessageManagerMem requires wallet.enqueueMessage().');
    }
    const thid = typeof input.payload['thid'] === 'string' ? String(input.payload['thid']) : undefined;
    const messageType = typeof input.payload['type'] === 'string' ? String(input.payload['type']) : undefined;
    return this.wallet.enqueueMessage({
      payload: input.payload,
      priority: input.priority,
      thid,
      messageType,
    });
  }

  /**
   * Returns queued messages in current priority/FIFO processing order.
   */
  public async listQueuedMessages(): Promise<WalletQueuedMessage[]> {
    if (!this.wallet.listMessages) {
      throw new Error('BackendMessageManagerMem requires wallet.listMessages().');
    }
    return this.wallet.listMessages();
  }

  /**
   * Submits the next pending message through the injected transport and stores
   * the decoded response by `thid` when one response envelope is returned.
   */
  public async submitNextPendingMessage(recipientEncryptionJwk: Record<string, unknown>): Promise<{
    message: WalletQueuedMessage;
    response?: BackendMessageResponseRecord;
    pending?: boolean;
  }> {
    if (!this.wallet.peekNextMessage) {
      throw new Error('BackendMessageManagerMem requires wallet.peekNextMessage().');
    }
    if (!this.wallet.pack) {
      throw new Error('BackendMessageManagerMem requires wallet.pack().');
    }
    if (!this.wallet.markMessageDelivered || !this.wallet.markMessageFailed) {
      throw new Error('BackendMessageManagerMem requires wallet.markMessageDelivered() and wallet.markMessageFailed().');
    }

    const next = await this.wallet.peekNextMessage();
    if (!next || next.status !== WalletQueueStatuses.Pending) {
      throw new Error('BackendMessageManagerMem found no pending queued message.');
    }

    const envelope = await this.wallet.pack(next.payload, recipientEncryptionJwk, this.entityId);
    const transportResult = await this.transport.submit({
      message: next,
      envelope,
    });

    if (!transportResult.accepted) {
      const failed = await this.wallet.markMessageFailed(
        next.id,
        String(transportResult.errorMessage || 'transport rejected queued message'),
      );
      await this.persistMessageRecord(failed, envelope, undefined, {
        transportStatus: 'failed',
      });
      return { message: failed };
    }

    const delivered = await this.wallet.markMessageDelivered(next.id);
    if (!transportResult.responseEnvelope) {
      await this.persistMessageRecord(delivered, envelope, undefined, {
        transportStatus: 'submitted',
        locationUrl: transportResult.locationUrl,
        pollCount: 0,
      });
      return { message: delivered, pending: true };
    }

    if (!this.wallet.unpack) {
      throw new Error('BackendMessageManagerMem requires wallet.unpack() to decode response envelopes.');
    }

    const unpacked = await this.wallet.unpack(transportResult.responseEnvelope, this.entityId);
    const responseContent = clone(unpacked.content as Record<string, unknown>);
    const thid = String(responseContent['thid'] || delivered.thid || delivered.id).trim();
    const response: BackendMessageResponseRecord = {
      thid,
      receivedAt: new Date().toISOString(),
      content: responseContent,
      meta: clone(unpacked.meta),
    };
    this.responsesByThread.set(thid, response);
    await this.outboxRepository.putResponse(response);
    await this.persistMessageRecord(delivered, envelope, response.thid, {
      transportStatus: 'completed',
    });
    return {
      message: delivered,
      response,
    };
  }

  /**
   * Returns the latest decoded response for one DIDComm thread.
   */
  public getResponseByThreadId(thid: string): BackendMessageResponseRecord | undefined {
    const normalizedThreadId = String(thid || '').trim();
    const stored = this.responsesByThread.get(normalizedThreadId);
    return stored ? clone(stored) : undefined;
  }

  /**
   * Lists submitted message history records preserved by the outbox repository.
   */
  public async listOutboxHistory(): Promise<ProfileOutboxMessageRecord[]> {
    return this.outboxRepository.listMessages();
  }

  /**
   * Polls one previously submitted asynchronous message by id.
   */
  public async pollSubmittedMessage(messageId: string): Promise<{
    pending: boolean;
    response?: BackendMessageResponseRecord;
    record: ProfileOutboxMessageRecord;
  }> {
    if (!this.transport.poll) {
      throw new Error('BackendMessageManagerMem requires transport.poll() for asynchronous polling.');
    }

    const currentRecord = await this.requireOutboxRecord(messageId);
    const pollResult = await this.transport.poll({
      message: currentRecord,
    });
    if (pollResult.pending) {
      const pendingRecord = await this.outboxRepository.putMessage({
        ...currentRecord,
        transportStatus: 'submitted',
        pollCount: (currentRecord.pollCount || 0) + 1,
        recordedAt: new Date().toISOString(),
      });
      return {
        pending: true,
        record: pendingRecord,
      };
    }

    if (!pollResult.completed || !pollResult.responseEnvelope) {
      const failedRecord = await this.outboxRepository.putMessage({
        ...currentRecord,
        transportStatus: pollResult.retryable ? 'submitted' : 'failed',
        pollCount: (currentRecord.pollCount || 0) + 1,
        recordedAt: new Date().toISOString(),
      });
      return {
        pending: Boolean(pollResult.retryable),
        record: failedRecord,
      };
    }

    if (!this.wallet.unpack) {
      throw new Error('BackendMessageManagerMem requires wallet.unpack() to decode polled response envelopes.');
    }

    const unpacked = await this.wallet.unpack(pollResult.responseEnvelope, this.entityId);
    const responseContent = clone(unpacked.content as Record<string, unknown>);
    const thid = String(responseContent['thid'] || currentRecord.thid || currentRecord.id).trim();
    const response: BackendMessageResponseRecord = {
      thid,
      receivedAt: new Date().toISOString(),
      content: responseContent,
      meta: clone(unpacked.meta),
    };
    this.responsesByThread.set(thid, response);
    await this.outboxRepository.putResponse(response);
    const completedRecord = await this.outboxRepository.putMessage({
      ...currentRecord,
      transportStatus: 'completed',
      responseThid: response.thid,
      pollCount: (currentRecord.pollCount || 0) + 1,
      recordedAt: new Date().toISOString(),
    });
    return {
      pending: false,
      response,
      record: completedRecord,
    };
  }

  /**
   * Reads one decoded response by thread id, first from memory and then from the repository.
   */
  public async readResponseByThreadId(thid: string): Promise<BackendMessageResponseRecord | undefined> {
    const inMemory = this.getResponseByThreadId(thid);
    if (inMemory) return inMemory;
    const stored = await this.outboxRepository.getLatestResponseByThreadId(thid);
    if (stored) {
      this.responsesByThread.set(String(stored.thid || '').trim(), clone(stored));
    }
    return stored;
  }

  private async persistMessageRecord(
    message: WalletQueuedMessage,
    envelope: string,
    responseThid?: string,
    options: Readonly<{
      transportStatus?: 'submitted' | 'completed' | 'failed';
      locationUrl?: string;
      pollCount?: number;
    }> = {},
  ): Promise<void> {
    await this.outboxRepository.putMessage({
      id: message.id,
      thid: message.thid,
      messageType: message.messageType,
      priority: message.priority,
      status: message.status,
      transportStatus: options.transportStatus,
      recordedAt: new Date().toISOString(),
      payload: clone(message.payload),
      envelope,
      ...(responseThid ? { responseThid } : {}),
      ...(options.locationUrl ? { locationUrl: options.locationUrl } : {}),
      ...(typeof options.pollCount === 'number' ? { pollCount: options.pollCount } : {}),
    });
  }

  private async requireOutboxRecord(messageId: string): Promise<ProfileOutboxMessageRecord> {
    const normalizedMessageId = String(messageId || '').trim();
    const stored = await this.outboxRepository.getMessage(normalizedMessageId);
    if (!stored) {
      throw new Error(`BackendMessageManagerMem outbox record not found: ${normalizedMessageId}`);
    }
    return stored;
  }
}
