import { alphabetBase58, BaseN, decodeN, encodeN } from '../src/utils/baseN.js';
import { stringToBytesUTF8 } from '../src/utils/string-convert.js';

describe('baseN', () => {
  it('round-trips base58 encoding/decoding', () => {
    const bytes = stringToBytesUTF8('hello world');
    const encoded = encodeN(bytes, alphabetBase58, undefined);
    const decoded = decodeN(encoded, alphabetBase58);
    expect(Array.from(decoded)).toEqual(Array.from(bytes));
  });

  it('supports maxline output wrapping', () => {
    const bytes = stringToBytesUTF8('hello world');
    const encoded = encodeN(bytes, alphabetBase58, 4 as unknown as any);
    expect(encoded.includes('\r\n')).toBe(true);
  });

  it('supports BaseN class helpers', () => {
    const bytes = new Uint8Array([0, 1, 2, 3]);
    const encodedBytes = BaseN.encodeBytesToBase58(bytes);
    expect(Array.from(BaseN.decodeBytesFromBase58(encodedBytes))).toEqual(Array.from(bytes));

    const encodedStr = BaseN.encodeStrToBase58('hello');
    expect(BaseN.decodeStrFromBase58(encodedStr)).toBe('hello');
  });

  it('throws on invalid encode inputs', () => {
    expect(() => encodeN('nope' as unknown as Uint8Array, alphabetBase58, undefined)).toThrow(/Uint8Array/);
    expect(() => encodeN(new Uint8Array([1, 2, 3]), 123 as unknown as string, undefined)).toThrow(/alphabet/);
    expect(() => encodeN(new Uint8Array([1, 2, 3]), alphabetBase58, 'x' as unknown as any)).toThrow(/maxline/);
  });

  it('handles decode edge cases', () => {
    expect(() => decodeN(123 as unknown as string, alphabetBase58)).toThrow(/input/);
    expect(() => decodeN('abc', 123 as unknown as string)).toThrow(/alphabet/);
    expect(decodeN('', alphabetBase58)).toEqual(new Uint8Array(0));
    expect(decodeN('0', alphabetBase58)).toEqual(new Uint8Array(0));
    expect(decodeN(' 11', alphabetBase58).length).toBeGreaterThan(0);
  });
});
