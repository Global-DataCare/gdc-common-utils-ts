import { sha3_256 } from '@noble/hashes/sha3.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';

import { normalizePhone } from './consent';
import { encodeMultibase58btc } from './multibase58';
import { encodeMultibaseSha3 } from './multibasehash';
import { UrnPrefixes } from '../constants/urn';

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
  const digest = sha3_256(utf8ToBytes(normalized));
  const multihash = Uint8Array.from([0x16, 0x20, ...digest]);
  return encodeMultibase58btc(multihash);
}

function looksLikeBase58Multibase(value: string): boolean {
  return /^z\S+$/.test(value.trim());
}

function looksLikeEmail(value: string): boolean {
  const trimmed = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function splitCommaSeparatedValues(value: string): string[] {
  return String(value || '')
    .split(',')
    .map((candidate) => candidate.trim())
    .filter(Boolean);
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
 * Normalizes one or more `sameAs` aliases into one deduplicated array.
 *
 * Input forms:
 * - one plain string
 * - one CSV string
 * - one array of plain/CSV strings
 *
 * Normalization rules:
 * - whitespace-only entries are discarded
 * - emails are hashed into ICA-compatible `urn:multibase:z...`
 * - already-normalized `urn:multibase:z...` values are preserved
 * - duplicate normalized entries are removed while preserving order
 *
 * @param value Canonical sameAs source value(s).
 */
export function normalizeSameAsHashList(
  value: string | readonly string[] | undefined,
): string[] {
  const candidates = Array.isArray(value)
    ? value.flatMap((entry) => splitCommaSeparatedValues(entry))
    : splitCommaSeparatedValues(String(value || ''));
  const normalized = candidates
    .map((candidate) => normalizeSameAsHash(candidate))
    .filter(Boolean);
  return [...new Set(normalized)];
}

/**
 * Splits a public alias CSV without changing the aliases themselves.
 *
 * Use this for mixed DID/CID `sameAs` indexes. Unlike
 * `normalizeSameAsHashList`, it deliberately does not interpret a CIDv1
 * beginning with `z` as a bare `urn:multibase` value.
 */
export function normalizePublicAliasList(
  value: string | readonly string[] | undefined,
): string[] {
  const candidates = Array.isArray(value)
    ? value.flatMap((entry) => splitCommaSeparatedValues(entry))
    : splitCommaSeparatedValues(String(value || ''));
  return [...new Set(candidates.map((candidate) => candidate.trim()).filter(Boolean))];
}

/** Derives an opaque SHA3-384 multihash URN for a global-ledger alias key. */
export function buildPublicAliasLedgerAssetId(alias: string): string {
  const normalized = String(alias || '').trim().normalize('NFKC');
  if (!normalized) throw new Error('Public alias is required');
  if (normalized.startsWith(UrnPrefixes.Multibase)) return normalized;
  return `${UrnPrefixes.Multibase}${encodeMultibaseSha3(normalized)}`;
}

/**
 * Joins one or more normalized `sameAs` aliases into the current flat CSV
 * storage form used by some shared VC/profile helpers.
 *
 * @param value Canonical sameAs source value(s).
 */
export function normalizeSameAsHashCsv(
  value: string | readonly string[] | undefined,
): string {
  return normalizeSameAsHashList(value).join(',');
}

/**
 * Normalizes one public telephone alias into the same hashed
 * `urn:multibase:z...` representation used for ICA-compatible public
 * continuity identifiers, while keeping the telephone claim separate from
 * `sameAs`.
 *
 * Rules:
 * - empty input becomes `''`
 * - `urn:multibase:z...` stays unchanged
 * - bare `z...` becomes `urn:multibase:z...`
 * - plain phone-like values are compacted through `normalizePhone(...)`
 *   before hashing
 *
 * @param value Plain or already-normalized public telephone alias.
 */
export function normalizeTelephoneHash(value: string): string {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';

  if (trimmed.toLowerCase().startsWith('urn:multibase:')) {
    const suffix = trimmed.slice('urn:multibase:'.length).trim();
    return looksLikeBase58Multibase(suffix) ? `urn:multibase:${suffix}` : trimmed;
  }

  if (looksLikeBase58Multibase(trimmed)) {
    return `urn:multibase:${trimmed}`;
  }

  const normalizedPhone = normalizePhone(trimmed);
  if (!normalizedPhone) return '';
  return `urn:multibase:${multibase58MultihashSha3_256(normalizedPhone)}`;
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
