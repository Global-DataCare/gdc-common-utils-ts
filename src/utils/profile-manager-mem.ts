// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import type { IWallet } from '../interfaces/IWallet';
import type { IProfileOutboxRepository } from '../interfaces/IProfileOutboxRepository';
import type {
  BackendMessageResponseRecord,
  BackendMessageTransport,
  ProfileOutboxMessageRecord,
  ProfileManagerMemProfile,
  QueueProfileMessageInput,
} from '../models/profile-manager';
import type { WalletQueuedMessage } from '../models/wallet';
import { BackendMessageManagerMem } from './backend-message-manager-mem';
import { MemoryProfileOutboxRepository } from './profile-outbox-memory-repository';

export type ProfileManagerMemOptions = Readonly<{
  profile: ProfileManagerMemProfile;
  wallet: IWallet;
  transport: BackendMessageTransport;
  outboxRepository?: IProfileOutboxRepository;
}>;

/**
 * Minimal memory-backed profile manager for low-level tests.
 *
 * Responsibility:
 * - own one logical profile
 * - ensure the profile keys exist in the wallet
 * - delegate queue/submit/response operations to `BackendMessageManagerMem`
 *
 * Non-goal:
 * - actor-specific orchestration belongs to higher SDK layers
 */
export class ProfileManagerMem {
  public readonly profile: ProfileManagerMemProfile;
  public readonly wallet: IWallet;
  public readonly messageManager: BackendMessageManagerMem;
  public readonly outboxRepository: IProfileOutboxRepository;

  constructor(options: ProfileManagerMemOptions) {
    this.profile = options.profile;
    this.wallet = options.wallet;
    this.outboxRepository = options.outboxRepository ?? new MemoryProfileOutboxRepository();
    this.messageManager = new BackendMessageManagerMem({
      wallet: options.wallet,
      entityId: options.profile.profileId,
      transport: options.transport,
      outboxRepository: this.outboxRepository,
    });
  }

  /**
   * Provisions the local profile keys before any queue or transport operation.
   */
  public async initialize(): Promise<void> {
    await this.wallet.provisionKeys(this.profile.profileId);
  }

  /**
   * Queues one outbound profile payload.
   */
  public async queueMessage(input: QueueProfileMessageInput): Promise<WalletQueuedMessage> {
    return this.messageManager.queueMessage(input);
  }

  /**
   * Returns the current queued messages in processing order.
   */
  public async listQueuedMessages(): Promise<WalletQueuedMessage[]> {
    return this.messageManager.listQueuedMessages();
  }

  /**
   * Submits the next pending message and optionally stores the decoded response.
   */
  public async submitNextPendingMessage(recipientEncryptionJwk: Record<string, unknown>): Promise<{
    message: WalletQueuedMessage;
    response?: BackendMessageResponseRecord;
    pending?: boolean;
  }> {
    return this.messageManager.submitNextPendingMessage(recipientEncryptionJwk);
  }

  /**
   * Reads the latest decoded response for one thread id.
   */
  public getResponseByThreadId(thid: string): BackendMessageResponseRecord | undefined {
    return this.messageManager.getResponseByThreadId(thid);
  }

  /**
   * Reads one decoded response by thread id from memory or repository storage.
   */
  public async readResponseByThreadId(thid: string): Promise<BackendMessageResponseRecord | undefined> {
    return this.messageManager.readResponseByThreadId(thid);
  }

  /**
   * Lists historical outbox records already submitted through this profile manager.
   */
  public async listOutboxHistory(): Promise<ProfileOutboxMessageRecord[]> {
    return this.messageManager.listOutboxHistory();
  }

  /**
   * Polls one asynchronous outbox record by id.
   */
  public async pollSubmittedMessage(messageId: string): Promise<{
    pending: boolean;
    response?: BackendMessageResponseRecord;
    record: ProfileOutboxMessageRecord;
  }> {
    return this.messageManager.pollSubmittedMessage(messageId);
  }
}
