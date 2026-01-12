import {
  decodeMultibase58btc,
  decodeMultibase58btcToHex,
  decodeMultibase58btcToUUID,
  encodeHexToMultibase58btc,
  encodeMultibase58btc,
} from '../src/utils/multibase58.js';

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

  it('round-trips hex to multibase and back', () => {
    const hex = '00112233445566778899aabbccddeeff';
    const encoded = encodeHexToMultibase58btc(hex);
    expect(decodeMultibase58btcToHex(encoded)).toBe(hex);
    expect(decodeMultibase58btcToUUID(encoded)).toBe('00112233-4455-6677-8899-aabbccddeeff');
  });
});
