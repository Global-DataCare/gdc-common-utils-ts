import { bytesToStringASCII, bytesToStringUTF8, stringToBytesUTF8 } from '../src/utils/string-convert.js';

describe('string-convert', () => {
  it('round-trips UTF-8 strings', () => {
    const bytes = stringToBytesUTF8('hola');
    expect(bytesToStringUTF8(bytes)).toBe('hola');
  });

  it('decodes ASCII/UTF-8 bytes permissively', () => {
    const value = '\\u00f1';
    const bytes = stringToBytesUTF8(value);
    expect(bytesToStringASCII(bytes)).toBe(value);
  });

  it('decodes 3-byte UTF-8 sequences', () => {
    const value = '\\u20ac';
    const bytes = stringToBytesUTF8(value);
    expect(bytesToStringASCII(bytes)).toBe(value);
  });
});
