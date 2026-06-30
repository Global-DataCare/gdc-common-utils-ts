// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import type { IProfileOutboxRepository } from '../interfaces/IProfileOutboxRepository';
import type { BackendMessageResponseRecord, ProfileOutboxMessageRecord } from '../models/profile-manager';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * In-memory profile outbox repository used by low-level tests and as the
 * default history/response store for `ProfileManagerMem`.
 */
export class MemoryProfileOutboxRepository implements IProfileOutboxRepository {
  private readonly messages = new Map<string, ProfileOutboxMessageRecord>();
  private readonly responses = new Map<string, BackendMessageResponseRecord[]>();

  /**
   * Stores one immutable message history record.
   */
  public async putMessage(record: ProfileOutboxMessageRecord): Promise<ProfileOutboxMessageRecord> {
    this.messages.set(record.id, clone(record));
    return clone(record);
  }

  /**
   * Reads one message history record.
   */
  public async getMessage(messageId: string): Promise<ProfileOutboxMessageRecord | undefined> {
    const stored = this.messages.get(String(messageId || '').trim());
    return stored ? clone(stored) : undefined;
  }

  /**
   * Lists all message history records in insertion order.
   */
  public async listMessages(): Promise<ProfileOutboxMessageRecord[]> {
    return [...this.messages.values()].map((record) => clone(record));
  }

  /**
   * Stores one decoded response record grouped by thread id.
   */
  public async putResponse(record: BackendMessageResponseRecord): Promise<BackendMessageResponseRecord> {
    const normalizedThreadId = String(record.thid || '').trim();
    const current = this.responses.get(normalizedThreadId) || [];
    current.push(clone(record));
    this.responses.set(normalizedThreadId, current);
    return clone(record);
  }

  /**
   * Returns the latest decoded response for the provided thread id.
   */
  public async getLatestResponseByThreadId(thid: string): Promise<BackendMessageResponseRecord | undefined> {
    const stored = this.responses.get(String(thid || '').trim());
    const latest = stored?.[stored.length - 1];
    return latest ? clone(latest) : undefined;
  }

  /**
   * Lists all decoded responses across all threads.
   */
  public async listResponses(): Promise<BackendMessageResponseRecord[]> {
    return [...this.responses.values()]
      .flatMap((records) => records.map((record) => clone(record)));
  }
}
