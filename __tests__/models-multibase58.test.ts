import {
  decodeMultibase58btc,
  decodeMultibase58btcToHex,
  decodeMultibase58btcToUUID,
  encodeHexToMultibase58btc,
  encodeMultibase58btc,
} from '../src/models/multibase58.js';

describe('models multibase58', () => {
  it('round-trips hex to multibase and back', () => {
    const hex = '00112233445566778899aabbccddeeff';
    const encoded = encodeHexToMultibase58btc(hex);
    const decodedHex = decodeMultibase58btcToHex(encoded);
    expect(decodedHex).toBe(hex);
  });

  it('decodes to UUID with hyphens', () => {
    const hex = '00112233445566778899aabbccddeeff';
    const encoded = encodeHexToMultibase58btc(hex);
    expect(decodeMultibase58btcToUUID(encoded)).toBe('00112233-4455-6677-8899-aabbccddeeff');
  });

  it('encodes and decodes raw bytes', () => {
    const bytes = new Uint8Array([9, 9, 9]);
    const encoded = encodeMultibase58btc(bytes);
    const decoded = decodeMultibase58btc(encoded);
    expect(Array.from(decoded)).toEqual([9, 9, 9]);
  });

  it('throws for invalid hex input', () => {
    expect(() => encodeHexToMultibase58btc('not-hex')).toThrow(/Invalid 16-byte hex string/);
  });
});
