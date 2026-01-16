// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.

import baseX from 'base-x';
import { encodeMultibaseSha384 } from '../src/utils/multibasehash';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const base58btc = baseX(BASE58_ALPHABET);

describe('encodeMultibaseSha384', () => {
  it('returns a multibase base58btc string with SHA-384 prefix', () => {
    const output = encodeMultibaseSha384('hello');
    expect(output.startsWith('z')).toBe(true);

    const decoded = base58btc.decode(output.slice(1));
    expect(decoded[0]).toBe(0x15);
    expect(decoded[1]).toBe(0x30);
    expect(decoded.length).toBe(2 + 48);
  });

  it('is deterministic for same input', () => {
    const a = encodeMultibaseSha384('same');
    const b = encodeMultibaseSha384('same');
    expect(a).toBe(b);
  });
});
