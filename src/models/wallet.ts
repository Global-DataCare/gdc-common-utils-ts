// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import type { JWK } from './jwk';

/**
 * Canonical priority levels for wallet-managed outbound messages.
 *
 * Ordering rule:
 * - `emergency` is always processed before all other priorities
 * - for the same priority level, insertion order must be preserved
 */
export const WalletMessagePriorities = Object.freeze({
  Emergency: 'emergency',
  High: 'high',
  Normal: 'normal',
  Low: 'low',
} as const);

export type WalletMessagePriority =
  typeof WalletMessagePriorities[keyof typeof WalletMessagePriorities];

/**
 * Lifecycle states for one local wallet queue/outbox message.
 */
export const WalletQueueStatuses = Object.freeze({
  Pending: 'pending',
  Delivered: 'delivered',
  Failed: 'failed',
} as const);

export type WalletQueueStatus =
  typeof WalletQueueStatuses[keyof typeof WalletQueueStatuses];

/**
 * One message tracked by the local wallet queue or outbox.
 */
export type WalletQueuedMessage = Readonly<{
  id: string;
  createdAt: string;
  priority: WalletMessagePriority;
  status: WalletQueueStatus;
  sequence: number;
  payload: Record<string, unknown>;
  thid?: string;
  messageType?: string;
  deliveredAt?: string;
  errorMessage?: string;
}>;

/**
 * Input accepted by wallet-local queue implementations when creating one
 * queued outbound message.
 */
export type WalletEnqueueMessageInput = Readonly<{
  payload: Record<string, unknown>;
  priority?: WalletMessagePriority;
  thid?: string;
  messageType?: string;
  id?: string;
  createdAt?: string;
}>;

/**
 * Public summary of one wallet-managed entity key set.
 */
export type WalletManagedEntityDescriptor = Readonly<{
  entityId: string;
  signingJwk: JWK;
  encryptionJwk: JWK;
}>;

