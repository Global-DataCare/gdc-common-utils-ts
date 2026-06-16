import { createHash } from 'crypto';

import { encodeMultibase58btc } from './multibase58';

/**
 * Builds the ICA-compatible multibase58(multihash(sha3-256)) payload for a
 * public controller alias.
 *
 * Synchronization note:
 * - this helper is intentionally copied from the current ICA-side algorithm in
 *   `dataspace-ica-ts/src/api/tools/multihash.ts`
 * - do not change this hashing/normalization contract here without updating
 *   the ICA implementation in lockstep
 *
 * @param value Raw canonical string to hash.
 */
export function multibase58MultihashSha3_256(value: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error('Cannot create multihash from empty value.');
  }
  const digest = createHash('sha3-256').update(normalized, 'utf8').digest();
  const multihash = Buffer.concat([Buffer.from([0x16, 0x20]), digest]);
  return encodeMultibase58btc(multihash);
}

function looksLikeBase58Multibase(value: string): boolean {
  return /^z\S+$/.test(value.trim());
}

function looksLikeEmail(value: string): boolean {
  const trimmed = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/**
 * Normalizes a public controller alias into the same representation used by
 * ICA for `credentialSubject.sameAs` and `controller.sameAs`.
 *
 * Synchronization note:
 * - this helper is a copied shared version of the current ICA algorithm from
 *   `dataspace-ica-ts/src/api/tools/multihash.ts`
 * - it exists in `gdc-common-utils-ts` so BFF/backend callers can compute the
 *   exact same value before calling GW/ICA
 * - do not let the two implementations drift
 *
 * Current rules:
 * - `urn:multibase:z...` stays unchanged
 * - bare `z...` becomes `urn:multibase:z...`
 * - plain email becomes hashed `urn:multibase:z...`
 * - any other identifier (for example `tel:+...`, `did:web:...`, custom URN)
 *   stays unchanged
 *
 * @param value Email, phone, DID, URN, or any other public alias string.
 */
export function normalizeSameAsHash(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  if (trimmed.toLowerCase().startsWith('urn:multibase:')) {
    const suffix = trimmed.slice('urn:multibase:'.length).trim();
    return looksLikeBase58Multibase(suffix) ? `urn:multibase:${suffix}` : trimmed;
  }

  if (looksLikeBase58Multibase(trimmed)) {
    return `urn:multibase:${trimmed}`;
  }

  if (looksLikeEmail(trimmed)) {
    return `urn:multibase:${multibase58MultihashSha3_256(trimmed.toLowerCase())}`;
  }

  return trimmed;
}

/**
 * Compares two public controller aliases after ICA-compatible normalization.
 *
 * @param left First alias.
 * @param right Second alias.
 */
export function sameAsValuesEqual(left: string, right: string): boolean {
  const normalizeComparable = (value: string): string => {
    const normalized = normalizeSameAsHash(value);
    return normalized.toLowerCase().startsWith('urn:multibase:')
      ? normalized.slice('urn:multibase:'.length)
      : normalized;
  };
  const normalizedLeft = normalizeComparable(left);
  const normalizedRight = normalizeComparable(right);
  return !!normalizedLeft && normalizedLeft === normalizedRight;
}
