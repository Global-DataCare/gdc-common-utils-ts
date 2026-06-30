// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import type { WalletEnqueueMessageInput, WalletQueuedMessage } from '../models/wallet';

/**
 * Runtime-neutral queue/outbox contract for low-level wallet-backed message
 * scheduling.
 *
 * Design intent:
 * - `common-utils` provides the contract plus one in-memory implementation
 * - BFF/server runtimes may later plug Redis, Google, filesystem, or database
 *   adapters without changing `WalletMem`
 * - mobile/native runtimes may plug SQLite-backed outbox adapters
 */
export interface IWalletQueue {
  /**
   * Enqueues one outbound message and returns the stored queued record.
   */
  enqueue(input: WalletEnqueueMessageInput): Promise<WalletQueuedMessage>;

  /**
   * Returns the next pending message according to queue ordering rules without
   * mutating queue state.
   */
  peekNextPending(): Promise<WalletQueuedMessage | undefined>;

  /**
   * Updates one queued message by identifier and returns the stored result.
   */
  update(messageId: string, patch: Partial<WalletQueuedMessage>): Promise<WalletQueuedMessage>;

  /**
   * Lists all queued messages in current processing order.
   */
  list(): Promise<WalletQueuedMessage[]>;
}

