// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import type { BackendMessageResponseRecord, ProfileOutboxMessageRecord } from '../models/profile-manager';

/**
 * Runtime-neutral repository for profile-scoped outbox history and decoded
 * responses.
 *
 * Separation rule:
 * - `IWalletQueue` controls ordering and mutable pending state
 * - `IProfileOutboxRepository` preserves historical records and decoded
 *   responses that the profile/runtime may want to inspect later
 */
export interface IProfileOutboxRepository {
  /**
   * Stores one immutable message history record.
   */
  putMessage(record: ProfileOutboxMessageRecord): Promise<ProfileOutboxMessageRecord>;

  /**
   * Returns one historical message record by id.
   */
  getMessage(messageId: string): Promise<ProfileOutboxMessageRecord | undefined>;

  /**
   * Lists all historical message records.
   */
  listMessages(): Promise<ProfileOutboxMessageRecord[]>;

  /**
   * Stores one decoded response record.
   */
  putResponse(record: BackendMessageResponseRecord): Promise<BackendMessageResponseRecord>;

  /**
   * Returns the latest decoded response for one thread id.
   */
  getLatestResponseByThreadId(thid: string): Promise<BackendMessageResponseRecord | undefined>;

  /**
   * Lists all decoded responses.
   */
  listResponses(): Promise<BackendMessageResponseRecord[]>;
}
