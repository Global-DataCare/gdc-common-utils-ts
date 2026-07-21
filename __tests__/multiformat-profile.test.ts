import baseX from 'base-x';
import { sha3_256, sha3_384 } from '@noble/hashes/sha3.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';
import {
  buildRawCidV1FromUtf8String,
  SHA3_256_MULTIHASH_PROFILE,
  SHA3_384_MULTIHASH_PROFILE,
} from '../src/utils/multiformat-profile';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const base58btc = baseX(BASE58_ALPHABET);

/**
 * CID identity flow contract under test:
 * 1. A caller can create a raw CIDv1 directly from canonical UTF-8 input.
 * 2. SHA3-384 is used when no profile is supplied.
 * 3. Explicit SHA3 profiles retain their canonical multihash code and digest.
 */
describe('buildRawCidV1FromUtf8String', () => {
  it('defaults to CIDv1(raw, SHA3-384)', () => {
    const input = 'DL|US-CA|D1234567';
    const decoded = base58btc.decode(buildRawCidV1FromUtf8String(input).slice(1));

    expect(Array.from(decoded.subarray(0, 4))).toEqual([0x01, 0x55, 0x15, 48]);
    expect(Array.from(decoded.subarray(4))).toEqual(Array.from(sha3_384(utf8ToBytes(input))));
  });

  it.each([
    [SHA3_256_MULTIHASH_PROFILE, 0x16, 32, sha3_256],
    [SHA3_384_MULTIHASH_PROFILE, 0x15, 48, sha3_384],
  ] as const)('encodes an explicit canonical SHA3 profile', (profile, code, length, digest) => {
    const input = `identity-${profile.algorithm}`;
    const decoded = base58btc.decode(buildRawCidV1FromUtf8String(input, profile).slice(1));

    expect(Array.from(decoded.subarray(0, 4))).toEqual([0x01, 0x55, code, length]);
    expect(Array.from(decoded.subarray(4))).toEqual(Array.from(digest(utf8ToBytes(input))));
  });
});
