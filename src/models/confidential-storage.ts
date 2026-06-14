// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.
// File: gdc-common-utils-ts/src/models/confidential-storage.ts

import { ParameterType } from './params';

/**
 * FHIR `Coding`-like tag used for research/analytics metadata.
 * Keep values coarse and coded; avoid free text in `display` unless explicitly policy-approved.
 */
export interface MetaTagCoding {
  system?: string;
  code?: string;
  version?: string;
  display?: string;
  userSelected?: boolean;
}

/**
 * Research/analytics metadata kept outside encrypted `content`.
 * Policy-dependent: treat these fields as potentially sensitive.
 */
export interface ResearchInfo {
  /** Coarse jurisdiction identifier (e.g., "cds-es" or "ES"). */
  jurisdiction?: string;
  /** Year of birth (YYYY). */
  yearOfBirth?: string;
  /** Gender identity (user-identified). Keep coded and coarse. */
  gender?: string;
  /** Sex assigned at birth (if collected). Keep coded and coarse. */
  sexAtBirth?: string;
}

/**
 * Audit metadata for traceability.
 *
 * Values are set by the software (off-ledger) and/or by an external attestation layer (on-ledger).
 * This object is intentionally separate from:
 * - `research` (analytics metadata)
 * - any `meta` object inside encrypted `content` (e.g., entry `meta.claims`)
 */
export interface AuditInfo {
  /** When the document was first created off-ledger (ISO 8601). */
  created?: string;
  /** When the document was last updated off-ledger (ISO 8601). */
  updated?: string;
  /** True if removed/deactivated (deactivation time is typically `updated`). */
  deactivated?: boolean;
  /**
   * Optional lightweight lifecycle disposition copied outside encrypted
   * content, for example `purged`.
   */
  disposition?: string;
  /** Name of the channel/network where the data is audited/anchored. */
  channel?: string;
  /** Base58/Base64Url transaction identifier, depending on the attestation layer. */
  txId?: string;
  /** Transaction timestamp (ISO 8601). */
  txTime?: string;
}

/**
 * Public runtime projection kept outside encrypted `content`.
 *
 * These values are not the canonical business payload. They are copied or
 * generated from the protected content so runtime flows can answer lightweight
 * queries without hydrating the confidential JWE blob.
 *
 * Rules:
 * - Keep this object strictly minimal.
 * - Only place data here when it is intentionally public or deployment-safe.
 * - Never treat these fields as the source of truth if the encrypted content
 *   carries the canonical value.
 */
export interface PublicInfo {
  /**
   * Optional lightweight role or technical marker copied outside encrypted
   * content for routing, gating, or lifecycle inspection.
   *
   * This is a convenience projection for lookup. The canonical role still
   * belongs to the protected business payload and/or indexed attributes.
   *
   * Example:
   * - hosting may copy a synthetic bootstrap-controller marker here so tenant
   *   lifecycle scans can ignore that technical employee without hydrating the
   *   confidential JWE payload.
   */
  role?: string;
}

/**
 * Defines the structure of an attribute to be indexed for blind, searchable queries.
 * @see https://identity.foundation/confidential-storage/#indexed-attributes
 */
export interface IndexedAttribute {
  name: string;
  value: string;
  unique?: boolean;
  /**
   * The original data type of the `value` before it was converted to a string
   * for HMAC protection. This is essential for performing type-aware queries
   * (e.g., numerical range queries) on the indexed data.
   * If not present, the type is assumed to be 'string'.
   */
  type?: ParameterType | string;
}

/**
 * Defines an indexed portion of a confidential document, allowing specific attributes to be searchable.
 */
export interface IndexedData {
    attributes: IndexedAttribute[];
    hmac?: {
        id: string;
        type: string;
    };
    sequence?: number;
}

/**
 * Represents a complete Structured Document as defined by the Confidential Storage specification.
 * This is the canonical format for all documents persisted in a vault.
 * @see https://identity.foundation/confidential-storage/#structureddocument
 */
export interface ConfidentialBlobInfo {
    /**
     * Logical provider label used by the deployment.
     * Examples: `gcs`, `supabase`, `mem`, `mongodb`.
     */
    provider?: string;

    /**
     * Canonical blob identifier inside the blob store.
     * In current adapters this is the deterministic multihash-derived object key.
     */
    blobRef: string;

    /**
     * Optional URL or provider-specific locator kept for diagnostics and migration.
     * The repository should not rely exclusively on this field for reads.
     */
    locator?: string;

    /**
     * MIME type of the blob payload stored outside the index database.
     * For persisted confidential JWE documents this should normally be `application/jose+json`.
     */
    contentType?: string;
}

export interface ConfidentialStorageDoc {
    // 'id' is inherited from RecordBase
    id: string;
    status: string;
    /**
     * Optional content-derived version identifier.
     *
     * Recommended usage:
     * - set to a deterministic content hash of the canonicalized artifact/claims (e.g., multihash over JCS bytes),
     *   so each semantic update yields a new `versionId`.
     * - do NOT use this for blockchain transaction identifiers (use `audit.txId` / `audit.txTime` instead).
     */
    versionId?: string;
    vaultId?: string;
    chunks?: number;

    /** A number that MUST be incremented each time the document is updated. */
    sequence: number;

    /** Contains an array of indexed attributes protected with HMAC for blind queries. */
    indexed?: IndexedData;
    
    /** The main, potentially encrypted, content of the document. */
    content?: Record<string, any>;

    /**
     * Inline JWE representation of the encrypted content.
     *
     * Keep this field only for in-memory workflows or backends that intentionally persist
     * the protected payload inline. Index-oriented repositories such as Firestore or
     * PostgreSQL should externalize this payload into `blob` before persistence.
     */
    jwe?: Record<string, any>;

    /**
     * Pointer to an external confidential blob that stores the serialized JWE payload.
     *
     * This field allows index repositories to keep searchable metadata in the database
     * while placing large encrypted payloads in a dedicated blob backend.
     */
    blob?: ConfidentialBlobInfo;

    /**
     * Document-level created timestamp (outside encrypted `content`).
     * This is distinct from any `meta` objects inside `content` (e.g., entry meta.claims).
     */
    audit?: AuditInfo;

    /**
     * @deprecated Use `audit.created` instead.
     */
    created?: string;

    /**
     * Document-level content type label (outside encrypted `content`).
     * This is distinct from any `contentType` claims inside `content`.
     */
    contentType?: string;

    /**
     * Optional research/routing tags kept outside encrypted `content`.
     * These tags are intended for analytics/routing and may be mirrored back to API responses.
     * Avoid free text in `display` unless explicitly policy-approved.
     */
    tag?: MetaTagCoding[];

    /** Policy-dependent research/analytics metadata, kept outside encrypted `content`. */
    research?: ResearchInfo;

    /**
     * Optional public runtime projection copied or generated for lightweight
     * reads outside encrypted `content`.
     *
     * This object is intended for lookup, routing, and operational gating.
     * It must not become a second canonical payload.
     *
     * Typical usage:
     * - copy a small public or deployment-safe value out of protected content
     * - or generate a technical marker needed for lightweight runtime scans
     * - never treat this object as the source of truth for business semantics
     */
    public?: PublicInfo;
}

/**
 * Represents a document whose sensitive content has been decrypted and is held
 * in memory. The `jwe` property is removed, and the `content` is guaranteed to exist.
 * This type should ONLY be used for in-memory processing and NEVER for persistence.
 * @template T The expected type of the decrypted `content`.
 */
export type UnprotectedStorageDoc<T> = Omit<ConfidentialStorageDoc, 'jwe' | 'content'> & {
    content: T;
};
