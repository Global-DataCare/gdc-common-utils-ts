// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.

import baseX from 'base-x';
import { sha3_224, sha3_256, sha3_384, sha3_512 } from '@noble/hashes/sha3.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';
import {
  encodeMultibaseSha3,
  encodeMultibaseSha384,
} from '../src/utils/multibasehash';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const base58btc = baseX(BASE58_ALPHABET);

/**
 * Multibase SHA3 flow contract under test:
 * 1. Callers receive SHA3-384 when they omit the digest size.
 * 2. Every supported SHA3 size carries its correct multihash code and length.
 * 3. The former SHA384-named helper is only a compatibility alias for the
 *    canonical SHA3-384 behavior.
 * 4. Unsupported digest sizes fail instead of emitting a misleading hash.
 */
describe('encodeMultibaseSha3', () => {
  it('defaults to multibase(base58btc(multihash(SHA3-384)))', () => {
    const input = 'hello';
    const output = encodeMultibaseSha3(input);
    const decoded = base58btc.decode(output.slice(1));

    expect(output.startsWith('z')).toBe(true);
    expect(decoded[0]).toBe(0x15);
    expect(decoded[1]).toBe(48);
    expect(Array.from(decoded.subarray(2))).toEqual(Array.from(sha3_384(utf8ToBytes(input))));
  });

  it.each([
    [224, 0x17, 28, sha3_224],
    [256, 0x16, 32, sha3_256],
    [384, 0x15, 48, sha3_384],
    [512, 0x14, 64, sha3_512],
  ] as const)('encodes SHA3-%i with its canonical multihash profile', (bits, code, length, digest) => {
    const input = `identity-${bits}`;
    const decoded = base58btc.decode(encodeMultibaseSha3(input, bits).slice(1));

    expect(decoded[0]).toBe(code);
    expect(decoded[1]).toBe(length);
    expect(Array.from(decoded.subarray(2))).toEqual(Array.from(digest(utf8ToBytes(input))));
  });

  it('keeps encodeMultibaseSha384 as the SHA3-384 compatibility alias', () => {
    expect(encodeMultibaseSha384('same')).toBe(encodeMultibaseSha3('same'));
  });

  it('rejects unsupported SHA3 digest sizes', () => {
    expect(() => encodeMultibaseSha3('invalid', 128 as never)).toThrow('Unsupported SHA3 digest size: 128');
  });
});
