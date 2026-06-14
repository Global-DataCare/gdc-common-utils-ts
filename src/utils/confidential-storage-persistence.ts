import type {
  ConfidentialBlobInfo,
  ConfidentialStorageDoc,
} from '../models/confidential-storage';
import { stripUndefinedDeep } from './object-sanitize';

/**
 * Blob-store writer contract kept provider-neutral on purpose.
 *
 * Frontends, gateways, and server adapters may implement this over:
 * - object storage such as GCS/S3/MinIO
 * - database-backed blob layers such as Mongo GridFS
 * - content-addressed stores such as IPFS
 */
export interface ConfidentialBlobWriter {
  provider?: string;
  put(dataBytes: Uint8Array, contentType: string): Promise<ConfidentialBlobInfo>;
}

/**
 * Blob-store reader companion for rehydrating externalized JWE payloads.
 */
export interface ConfidentialBlobReader {
  get(blobRef: string): Promise<{
    dataBytes: Uint8Array;
    contentType?: string;
  }>;
  delete?(blobRef: string): Promise<void>;
}

/**
 * Optional symmetric reader/writer contract used by adapters that can both
 * persist and rehydrate encrypted confidential payloads.
 */
export interface ConfidentialBlobStore extends ConfidentialBlobWriter, ConfidentialBlobReader {}

/**
 * Canonical content type for serialized JSON JWE payloads externalized to blob
 * storage. Keeping one shared value avoids drift between gateway adapters,
 * frontend apps, and tests.
 */
export const CONFIDENTIAL_JWE_BLOB_CONTENT_TYPE = 'application/jose+json';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * Minimal shape guard used before applying confidential-storage persistence
 * policies to arbitrary repository records.
 */
export function isConfidentialStorageDocRecord(
  value: unknown,
): value is ConfidentialStorageDoc {
  return typeof (value as ConfidentialStorageDoc | undefined)?.id === 'string'
    && typeof (value as ConfidentialStorageDoc | undefined)?.sequence === 'number';
}

/**
 * Creates the persisted index-document view for one confidential record.
 *
 * Behaviour:
 * - if the record is not a `ConfidentialStorageDoc`, it is only sanitized
 * - if there is no `jwe`, it is only sanitized
 * - if there is a `jwe` and a blob writer is available, the JWE is serialized,
 *   stored in the blob backend, and removed from the persisted record
 *
 * This keeps database/index stores free of large encrypted payloads while
 * preserving the metadata required to load them back later.
 */
export async function externalizeConfidentialStorageDocForPersistence<T>(
  document: T,
  blobWriter?: ConfidentialBlobWriter,
): Promise<T> {
  if (!blobWriter || !isConfidentialStorageDocRecord(document) || !document.jwe) {
    return stripUndefinedDeep(document);
  }

  const jweBytes = textEncoder.encode(JSON.stringify(document.jwe));
  const blob = await blobWriter.put(jweBytes, CONFIDENTIAL_JWE_BLOB_CONTENT_TYPE);
  const persistedDocument: ConfidentialStorageDoc = {
    ...document,
    blob: {
      provider: blob.provider || blobWriter.provider,
      blobRef: blob.blobRef,
      locator: blob.locator,
      contentType: blob.contentType || CONFIDENTIAL_JWE_BLOB_CONTENT_TYPE,
    },
  };
  delete persistedDocument.jwe;
  return stripUndefinedDeep(persistedDocument) as T;
}

/**
 * Rehydrates one persisted confidential record back to the current in-memory
 * shape expected by KMS/decryption layers.
 *
 * If the record already contains inline `jwe`, it is returned unchanged.
 */
export async function hydrateConfidentialStorageDocFromPersistence<T>(
  document: T,
  blobReader?: ConfidentialBlobReader,
): Promise<T> {
  if (!blobReader || !isConfidentialStorageDocRecord(document) || document.jwe || !document.blob?.blobRef) {
    return document;
  }

  const blobPayload = await blobReader.get(document.blob.blobRef);
  const jwe = JSON.parse(textDecoder.decode(blobPayload.dataBytes)) as Record<string, any>;
  return {
    ...document,
    jwe,
  };
}
