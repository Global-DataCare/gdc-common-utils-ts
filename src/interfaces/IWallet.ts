// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import type { WalletEnqueueMessageInput, WalletManagedEntityDescriptor, WalletQueuedMessage } from '../models/wallet';
import type { JWK, JwkSet } from '../models/jwk';

/**
 * Shared wallet contract reused by tests, apps, frontend adapters, and simple
 * backend or BFF flows.
 *
 * Backward-compatibility rule:
 * - the legacy methods (`provisionKeys`, `digest`,
 *   `protectConfidentialData`, `unprotectConfidentialData`, `unpack`) remain
 *   the stable minimum contract expected by older consumers
 * - richer transport and queue helpers are optional so older platform-specific
 *   adapters do not need to implement them immediately
 */
export interface IWallet {
  /**
   * Provisions or retrieves the wallet key set for one logical entity.
   */
  provisionKeys(entityId: string): Promise<JwkSet>;

  /**
   * Computes one digest string using the provided algorithm name.
   */
  digest(data: string, algorithm: string): Promise<string>;

  /**
   * Protects one local document for confidential at-rest storage.
   */
  protectConfidentialData(doc: unknown, entityId?: string): Promise<unknown>;

  /**
   * Unprotects one local confidential document.
   */
  unprotectConfidentialData(doc: unknown, entityId?: string): Promise<unknown>;

  /**
   * Unpacks one transport message into business content plus JOSE metadata.
   */
  unpack?(packedMessage: string, entityId?: string): Promise<{
    content: unknown;
    meta: Record<string, unknown>;
  }>;

  /**
   * Packs one business payload for one recipient public key.
   */
  pack?(content: Record<string, unknown>, recipientJwk: JWK, entityId: string): Promise<string>;

  /**
   * Returns the public keys currently provisioned for one entity.
   */
  getPublicKeys?(entityId: string): Promise<WalletManagedEntityDescriptor>;

  /**
   * Signs one JSON payload into a compact JWS.
   */
  signCompactJws?(entityId: string, claims: Record<string, unknown>): Promise<string>;

  /**
   * Builds one compact JWE for the provided recipient.
   */
  buildCompactJwe?(
    entityId: string,
    plaintext: string | Uint8Array,
    recipientJwk: JWK,
    contentType?: string,
  ): Promise<string>;

  /**
   * Enqueues one local outbound message with an optional priority.
   */
  enqueueMessage?(input: WalletEnqueueMessageInput): Promise<WalletQueuedMessage>;

  /**
   * Returns the next pending message without mutating queue state.
   */
  peekNextMessage?(): Promise<WalletQueuedMessage | undefined>;

  /**
   * Marks one message as delivered.
   */
  markMessageDelivered?(messageId: string): Promise<WalletQueuedMessage>;

  /**
   * Marks one message as failed.
   */
  markMessageFailed?(messageId: string, errorMessage: string): Promise<WalletQueuedMessage>;

  /**
   * Lists all locally tracked queued messages.
   */
  listMessages?(): Promise<WalletQueuedMessage[]>;
}

