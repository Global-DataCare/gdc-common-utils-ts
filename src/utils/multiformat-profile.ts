// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { sha3_256, sha3_384 } from '@noble/hashes/sha3.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';
import { encodeMultibase58btc } from './multibase58.js';

/**
 * Project-wide multiformat constants and helpers used when a logical business
 * identifier must cross a blockchain boundary as a self-describing content id.
 *
 * Notes for junior developers:
 * - `CIDv1` identifies the container format
 * - `multicodec` describes the payload bytes carried by the CID
 * - `multihash` describes the digest algorithm and digest length
 * - `base58btc` is the textual multibase envelope used by this project
 */

export type MultihashProfile = Readonly<{
  algorithm: 'sha3-256' | 'sha3-384';
  code: number;
  digestLengthBytes: number;
  digest: (value: Uint8Array) => Uint8Array;
}>;

/**
 * `CIDv1` version marker used by all new blockchain-facing content ids.
 */
export const MULTIFORMAT_CID_V1_CODE = 0x01;

/**
 * The `raw` codec means the CID points directly to raw bytes, not a higher
 * level IPLD codec such as DAG-JSON or DAG-CBOR.
 */
export const MULTICODEC_RAW_CODE = 0x55;

/**
 * Repository-wide `sha3-256` multihash profile.
 *
 * This is reused by identifiers such as some `did:web`-derived ids and other
 * legacy/public ids that already depend on the shorter digest form.
 */
export const SHA3_256_MULTIHASH_PROFILE: MultihashProfile = Object.freeze({
  algorithm: 'sha3-256',
  code: 0x16,
  digestLengthBytes: 32,
  digest: sha3_256,
});

/**
 * Repository-wide `sha3-384` multihash profile.
 *
 * This is the default profile for consent access rule ids and for other cases
 * where a stronger digest length is required.
 */
export const SHA3_384_MULTIHASH_PROFILE: MultihashProfile = Object.freeze({
  algorithm: 'sha3-384',
  code: 0x15,
  digestLengthBytes: 48,
  digest: sha3_384,
});

/**
 * Builds a `CIDv1` over a UTF-8 string using SHA3-384 by default.
 *
 * This helper intentionally does not canonicalize the input string for you.
 * Callers must pass the final canonical logical identifier they want to anchor.
 * A caller may supply another explicit multihash profile when an established
 * external contract requires it.
 */
export function buildRawCidV1FromUtf8String(
  value: string,
  profile: MultihashProfile = SHA3_384_MULTIHASH_PROFILE,
): string {
  const digest = profile.digest(utf8ToBytes(String(value || '')));
  const multihash = concatBytes(
    Uint8Array.from([profile.code, profile.digestLengthBytes]),
    digest,
  );
  const cidBytes = concatBytes(
    encodeVarint(MULTIFORMAT_CID_V1_CODE),
    encodeVarint(MULTICODEC_RAW_CODE),
    multihash,
  );
  return encodeMultibase58btc(cidBytes);
}

function encodeVarint(value: number): Uint8Array {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`Invalid varint value: ${value}`);
  }

  const out: number[] = [];
  let n = value >>> 0;
  while (n >= 0x80) {
    out.push((n & 0x7f) | 0x80);
    n >>>= 7;
  }
  out.push(n);
  return Uint8Array.from(out);
}

function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((acc, part) => acc + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}
