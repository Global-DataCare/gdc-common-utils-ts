// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import type { WalletMessagePriority, WalletQueuedMessage } from './wallet';

/**
 * Minimal local profile descriptor for memory-backed wallet/runtime tests.
 *
 * This stays intentionally below actor-specific SDK facades.
 */
export type ProfileManagerMemProfile = Readonly<{
  profileId: string;
  displayName?: string;
  did: string;
}>;

/**
 * Result returned by one backend message transport after submitting one local
 * queued message envelope.
 */
export type BackendMessageTransportSubmitResult = Readonly<{
  accepted: boolean;
  retryable?: boolean;
  errorMessage?: string;
  responseEnvelope?: string;
  locationUrl?: string;
}>;

/**
 * Result returned by one backend message poll operation after a previous
 * transport submit accepted the request asynchronously.
 */
export type BackendMessageTransportPollResult = Readonly<{
  pending: boolean;
  completed?: boolean;
  retryable?: boolean;
  errorMessage?: string;
  responseEnvelope?: string;
}>;

/**
 * Pluggable submit-only transport used by the low-level backend message manager.
 */
export type BackendMessageTransport = Readonly<{
  submit(input: Readonly<{
    message: WalletQueuedMessage;
    envelope: string;
  }>): Promise<BackendMessageTransportSubmitResult>;
  poll?(input: Readonly<{
    message: ProfileOutboxMessageRecord;
  }>): Promise<BackendMessageTransportPollResult>;
}>;

/**
 * One decoded inbound response associated with one DIDComm thread.
 */
export type BackendMessageResponseRecord = Readonly<{
  thid: string;
  receivedAt: string;
  content: Record<string, unknown>;
  meta: Record<string, unknown>;
}>;

/**
 * Immutable historical record written after one profile message is submitted.
 *
 * It complements the mutable queue state by preserving:
 * - the final submitted envelope
 * - the last known queue status at submission time
 * - the optional decoded response thread reference
 */
export type ProfileOutboxMessageRecord = Readonly<{
  id: string;
  thid?: string;
  messageType?: string;
  priority: string;
  status: string;
  transportStatus?: 'submitted' | 'completed' | 'failed';
  recordedAt: string;
  payload: Record<string, unknown>;
  envelope: string;
  responseThid?: string;
  locationUrl?: string;
  pollCount?: number;
}>;

/**
 * Input used by `BackendMessageManagerMem` and `ProfileManagerMem` to queue one
 * outbound business payload.
 */
export type QueueProfileMessageInput = Readonly<{
  payload: Record<string, unknown>;
  priority?: WalletMessagePriority;
  recipientEncryptionJwk: Record<string, unknown>;
}>;
