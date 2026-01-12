import { capitalize, sanitizeString, stringToASCII, stringToBytesArrayOfNumbers } from '../src/utils/string-utils.js';

describe('string-utils', () => {
  it('capitalizes the first character', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('sanitizes disallowed characters', () => {
    expect(sanitizeString('Hello!!@#$% World')).toBe('Hello World');
  });

  it('converts a string to ASCII codes', () => {
    expect(stringToASCII('AZ')).toBe('6590');
  });

  it('converts a string to byte array numbers', () => {
    const bytes = stringToBytesArrayOfNumbers('A');
    expect(bytes).toEqual([65]);
  });

  it('handles multi-byte and surrogate pairs', () => {
    expect(stringToBytesArrayOfNumbers('\u00f1')).toEqual([195, 177]);
    expect(stringToBytesArrayOfNumbers('\ud83d\ude00')).toEqual([240, 159, 152, 128]);
  });
});
