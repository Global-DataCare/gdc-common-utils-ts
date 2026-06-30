// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { CryptographyService } from '../CryptographyService';
import type { ICryptoHelper } from '../interfaces/ICryptoHelper';
import type { IWallet } from '../interfaces/IWallet';
import type { IWalletQueue } from '../interfaces/IWalletQueue';
import type { MlkemPrivateJwk, MldsaAlg, PublicJwk } from '../interfaces/Cryptography.types';
import type { DidCommDecodedMetadata } from '../models/confidential-message';
import type { JWK, JwkSet } from '../models/jwk';
import { WalletQueueStatuses, type WalletEnqueueMessageInput, type WalletManagedEntityDescriptor, type WalletQueuedMessage } from '../models/wallet';
import { Content } from './content';
import { MemoryWalletQueue } from './wallet-memory-queue';

type ManagedEntityState = {
  descriptor: WalletManagedEntityDescriptor;
  signingSecretKeyBytes: Uint8Array;
  encryptionSecretKeyBytes: Uint8Array;
  storageKeyBytes: Uint8Array;
};

export type WalletMemOptions = Readonly<{
  cryptoHelper: ICryptoHelper;
  cryptography?: CryptographyService;
  queue?: IWalletQueue;
}>;

const WALLET_DIGEST_ALGORITHM = 'SHA-512' as const;
const WALLET_SIGNING_ALGORITHM = 'ML-DSA-44' as const;
const WALLET_ENCRYPTION_ALGORITHM = 'ML-KEM-768' as const;
const WALLET_JWE_CONTENT_ENCRYPTION = 'A256GCM' as const;
const WALLET_JWS_TYPE = 'JWS' as const;
const WALLET_JWE_TYPE = 'JWE' as const;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * In-memory wallet implementation intended for:
 * - common low-level tests
 * - GW template integration tests
 * - frontend-like and BFF-like local transport simulations
 *
 * Design rule:
 * - keep this class below actor-specific SDK facades
 * - compose cryptography, key cache, local queue, and DIDComm-style
 *   pack/unpack in one portable runtime-neutral helper
 */
export class WalletMem implements IWallet {
  private readonly cryptoHelper: ICryptoHelper;
  private readonly cryptography: CryptographyService;
  private readonly entities = new Map<string, ManagedEntityState>();
  private readonly queue: IWalletQueue;

  constructor(options: WalletMemOptions) {
    this.cryptoHelper = options.cryptoHelper;
    this.cryptography = options.cryptography ?? new CryptographyService(this.cryptoHelper);
    this.queue = options.queue ?? new MemoryWalletQueue(this.cryptoHelper);
  }

  /**
   * Computes one digest through the injected platform helper.
   */
  public async digest(data: string, algorithm: string): Promise<string> {
    return this.cryptoHelper.digestString(data, algorithm);
  }

  /**
   * Provisions one deterministic signing key, one deterministic encryption key,
   * and one deterministic storage key for the provided entity id.
   */
  public async provisionKeys(entityId: string): Promise<JwkSet> {
    const normalizedEntityId = this.requireEntityId(entityId);
    const existing = this.entities.get(normalizedEntityId);
    if (existing) {
      return {
        keys: [
          existing.descriptor.signingJwk,
          existing.descriptor.encryptionJwk,
        ],
      };
    }

    const signingSeed = await this.deriveSeedBytes(normalizedEntityId, 'signing', 32);
    const encryptionSeed = await this.deriveSeedBytes(normalizedEntityId, 'encryption', 64);
    const storageKeyBytes = await this.deriveSeedBytes(normalizedEntityId, 'storage', 32);

    const signingKeyPair = await this.cryptography.generateKeyPairMlDsa(signingSeed, WALLET_SIGNING_ALGORITHM as MldsaAlg);
    const encryptionKeyPair = await this.cryptography.generateKeyPairMlKem(encryptionSeed, WALLET_ENCRYPTION_ALGORITHM);
    const descriptor: WalletManagedEntityDescriptor = {
      entityId: normalizedEntityId,
      signingJwk: {
        ...signingKeyPair.publicJWKey,
        use: 'sig',
      },
      encryptionJwk: {
        ...encryptionKeyPair.publicJWKey,
        use: 'enc',
      },
    };

    this.entities.set(normalizedEntityId, {
      descriptor,
      signingSecretKeyBytes: signingKeyPair.secretKeyBytes,
      encryptionSecretKeyBytes: encryptionKeyPair.secretKeyBytes,
      storageKeyBytes,
    });

    return {
      keys: [descriptor.signingJwk, descriptor.encryptionJwk],
    };
  }

  /**
   * Returns the public signing/encryption keys currently provisioned for one entity.
   */
  public async getPublicKeys(entityId: string): Promise<WalletManagedEntityDescriptor> {
    const state = this.requireEntityState(entityId);
    return clone(state.descriptor);
  }

  /**
   * Protects one document in memory using the entity-specific at-rest key.
   */
  public async protectConfidentialData(doc: unknown, entityId?: string): Promise<unknown> {
    const document = doc as Record<string, unknown>;
    if (document?.content === undefined) {
      return doc;
    }
    const state = this.requireEntityState(this.resolveEntityId(entityId));
    const ownerId = state.descriptor.entityId;
    const encrypted = await this.cryptography.encrypt(
      JSON.stringify(document.content),
      state.storageKeyBytes,
      ownerId,
    );
    const { content, ...docWithoutContent } = document;
    return {
      ...docWithoutContent,
      jwe: encrypted,
    };
  }

  /**
   * Unprotects one document previously encrypted through `protectConfidentialData(...)`.
   */
  public async unprotectConfidentialData(doc: unknown, entityId?: string): Promise<unknown> {
    const document = doc as Record<string, unknown>;
    if (document?.jwe === undefined) {
      return doc;
    }
    const state = this.requireEntityState(this.resolveEntityId(entityId));
    const ownerId = state.descriptor.entityId;
    const decrypted = await this.cryptography.decrypt(
      document.jwe as any,
      state.storageKeyBytes,
      ownerId,
    );
    const { jwe, ...docWithoutJwe } = document;
    return {
      ...docWithoutJwe,
      content: JSON.parse(decrypted),
    };
  }

  /**
   * Signs one JSON payload into a compact JWS carrying the sender public JWK.
   */
  public async signCompactJws(entityId: string, claims: Record<string, unknown>): Promise<string> {
    const state = this.requireEntityState(entityId);
    const jws = await this.cryptography.signDataJws(
      claims,
      {
        alg: WALLET_SIGNING_ALGORITHM,
        typ: WALLET_JWS_TYPE,
        kid: state.descriptor.signingJwk.kid,
        jwk: state.descriptor.signingJwk,
      },
      state.signingSecretKeyBytes,
    );
    return `${jws.protected}.${jws.payload}.${jws.signature}`;
  }

  /**
   * Encrypts one plaintext for the provided recipient public JWK.
   */
  public async buildCompactJwe(
    entityId: string,
    plaintext: string | Uint8Array,
    recipientJwk: JWK,
    contentType?: string,
  ): Promise<string> {
    const state = this.requireEntityState(entityId);
    const senderPrivateKey: MlkemPrivateJwk = {
      ...(state.descriptor.encryptionJwk as any),
      dBytes: state.encryptionSecretKeyBytes,
    };
    return this.cryptography.encryptJweToCompact(
      typeof plaintext === 'string' ? plaintext : Content.bytesToStringUTF8(plaintext),
      {
        enc: WALLET_JWE_CONTENT_ENCRYPTION,
        typ: WALLET_JWE_TYPE,
        ...(contentType ? { cty: contentType } : {}),
      },
      senderPrivateKey,
      recipientJwk as any,
    );
  }

  /**
   * Packs one payload as nested compact JWS inside compact JWE.
   */
  public async pack(content: Record<string, unknown>, recipientJwk: JWK, entityId: string): Promise<string> {
    const compactJws = await this.signCompactJws(entityId, content);
    return this.buildCompactJwe(entityId, compactJws, recipientJwk, WALLET_JWS_TYPE);
  }

  /**
   * Unpacks one compact JWE and, when present, verifies the nested compact JWS.
   */
  public async unpack(packedMessage: string, entityId?: string): Promise<{ content: unknown; meta: Record<string, unknown> }> {
    const state = this.requireEntityState(this.resolveEntityId(entityId));
    const recipientPrivateKey: MlkemPrivateJwk = {
      ...(state.descriptor.encryptionJwk as any),
      dBytes: state.encryptionSecretKeyBytes,
    };
    const decrypted = await this.cryptography.decryptJwe(packedMessage, recipientPrivateKey);
    const decryptedText = Content.bytesToStringUTF8(decrypted.decryptedBytes);
    const metadata: DidCommDecodedMetadata = {
      jwe: {
        header: decrypted.protectedHeader as any,
      },
    };

    if ((decrypted.protectedHeader as Record<string, unknown>)['cty'] === WALLET_JWS_TYPE) {
      const parsedJws = this.cryptography.parseCompactJws(decryptedText);
      const protectedHeader = parsedJws.protected as Record<string, unknown>;
      const publicJwk = protectedHeader['jwk'] as JWK | undefined;
      const verified = publicJwk
        ? await this.cryptography.verifyJws(decryptedText, publicJwk as PublicJwk)
        : false;
      metadata.jws = {
        protected: protectedHeader as any,
        signature: typeof parsedJws.signature === 'string'
          ? parsedJws.signature
          : parsedJws.signature
            ? Content.bytesToRawBase64UrlSafe(parsedJws.signature)
            : '',
      };
      return {
        content: parsedJws.payload,
        meta: {
          ...metadata,
          jws: {
            ...metadata.jws,
            verified,
          },
        },
      };
    }

    return {
      content: JSON.parse(decryptedText),
      meta: metadata as Record<string, unknown>,
    };
  }

  /**
   * Enqueues one message in the local in-memory outbox/queue.
   */
  public async enqueueMessage(input: WalletEnqueueMessageInput): Promise<WalletQueuedMessage> {
    return this.queue.enqueue(input);
  }

  /**
   * Returns the highest-priority pending message without mutating queue state.
   */
  public async peekNextMessage(): Promise<WalletQueuedMessage | undefined> {
    return this.queue.peekNextPending();
  }

  /**
   * Marks one queued message as delivered.
   */
  public async markMessageDelivered(messageId: string): Promise<WalletQueuedMessage> {
    return this.queue.update(messageId, {
      status: WalletQueueStatuses.Delivered,
      deliveredAt: new Date().toISOString(),
      errorMessage: undefined,
    });
  }

  /**
   * Marks one queued message as failed while preserving it in the local queue.
   */
  public async markMessageFailed(messageId: string, errorMessage: string): Promise<WalletQueuedMessage> {
    return this.queue.update(messageId, {
      status: WalletQueueStatuses.Failed,
      errorMessage: String(errorMessage || '').trim(),
    });
  }

  /**
   * Lists all queued messages in priority/FIFO processing order.
   */
  public async listMessages(): Promise<WalletQueuedMessage[]> {
    return this.queue.list();
  }

  private async deriveSeedBytes(entityId: string, purpose: string, size: number): Promise<Uint8Array> {
    const blocks: Buffer[] = [];
    let counter = 0;
    while (Buffer.concat(blocks).length < size) {
      const digest = await this.digest(`${entityId}:${purpose}:${counter}`, WALLET_DIGEST_ALGORITHM);
      blocks.push(Buffer.from(digest, 'hex'));
      counter += 1;
    }
    return Buffer.concat(blocks).subarray(0, size);
  }

  private requireEntityId(entityId: string): string {
    const normalized = String(entityId || '').trim();
    if (!normalized) {
      throw new Error('WalletMem requires a non-empty entityId.');
    }
    return normalized;
  }

  private resolveEntityId(entityId?: string): string {
    if (entityId) {
      return this.requireEntityId(entityId);
    }
    if (this.entities.size === 1) {
      return [...this.entities.keys()][0];
    }
    throw new Error('WalletMem requires entityId when more than one entity is provisioned.');
  }

  private requireEntityState(entityId: string): ManagedEntityState {
    const normalized = this.requireEntityId(entityId);
    const state = this.entities.get(normalized);
    if (!state) {
      throw new Error(`WalletMem requires provisionKeys('${normalized}') before this operation.`);
    }
    return state;
  }

}
