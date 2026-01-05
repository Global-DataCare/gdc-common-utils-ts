import { encodeMultibase58btc, decodeMultibase58btc } from '../src/utils/multibase58.js';

describe('multibase58', () => {
  it('round-trips bytes', () => {
    const bytes = new Uint8Array([1, 2, 3, 250, 251, 252]);
    const encoded = encodeMultibase58btc(bytes);
    expect(encoded.startsWith('z')).toBe(true);
    const decoded = decodeMultibase58btc(encoded);
    expect(Array.from(decoded)).toEqual(Array.from(bytes));
  });

  it('throws if prefix is missing', () => {
    expect(() => decodeMultibase58btc('not-prefixed')).toThrow(/missing 'z' prefix/i);
  });
});
