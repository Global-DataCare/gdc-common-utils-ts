// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.

// Use explicit .js subpaths to satisfy package exports in Metro/Node ESM.
import { sha3_224, sha3_256, sha3_384, sha3_512 } from '@noble/hashes/sha3.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';
import baseX from 'base-x';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const base58btc = baseX(BASE58_ALPHABET);

export type Sha3DigestBits = 224 | 256 | 384 | 512;

type Sha3Profile = Readonly<{
  code: number;
  digestLengthBytes: number;
  digest: (input: Uint8Array) => Uint8Array;
}>;

const SHA3_PROFILES: Readonly<Record<Sha3DigestBits, Sha3Profile>> = Object.freeze({
  224: Object.freeze({ code: 0x17, digestLengthBytes: 28, digest: sha3_224 }),
  256: Object.freeze({ code: 0x16, digestLengthBytes: 32, digest: sha3_256 }),
  384: Object.freeze({ code: 0x15, digestLengthBytes: 48, digest: sha3_384 }),
  512: Object.freeze({ code: 0x14, digestLengthBytes: 64, digest: sha3_512 }),
});

/**
 * Encodes bytes as `multibase(base58btc(multihash(SHA3-n)))`.
 *
 * Contract:
 * - input strings are hashed as their exact UTF-8 bytes; callers own any
 *   higher-level identifier or JSON canonicalization
 * - SHA3-384 is the default profile
 * - the multihash stores the canonical SHA3 multicodec code and digest length
 * - the returned `z...` value is a multibase string, not a CID
 *
 * Use a CID builder when identifying a content-addressed record. Use this
 * helper when the multihash itself is the stable identifier or index key.
 */
export function encodeMultibaseSha3(
  input: string | Uint8Array,
  digestBits: Sha3DigestBits = 384,
): string {
  const profile = SHA3_PROFILES[digestBits];
  if (!profile) {
    throw new Error(`Unsupported SHA3 digest size: ${String(digestBits)}`);
  }
  const bytes = typeof input === 'string' ? utf8ToBytes(input) : input;
  const hashBytes = profile.digest(bytes);

  const multihashBytes = new Uint8Array(2 + hashBytes.length);
  multihashBytes[0] = profile.code;
  multihashBytes[1] = profile.digestLengthBytes;
  multihashBytes.set(hashBytes, 2);

  return 'z' + base58btc.encode(multihashBytes);
}

/**
 * @deprecated Use `encodeMultibaseSha3(input)` or pass `384` explicitly.
 *
 * This compatibility name now follows its historically intended multihash
 * profile: SHA3-384, not SHA-2 SHA-384 with a mismatched SHA3 prefix.
 */
export function encodeMultibaseSha384(input: string | Uint8Array): string {
  return encodeMultibaseSha3(input, 384);
}
