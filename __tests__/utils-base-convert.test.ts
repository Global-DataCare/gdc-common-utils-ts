import {
  base58ToBytes,
  base64OrUrlSafeToBytes,
  base64ToBase64Url,
  base64UrlToBase64,
  bytesToBase58,
  bytesToBase64,
  bytesToHexString,
  bytesToRawBase64UrlSafe,
  stringToBase64Url,
  stringToStdBase64,
} from '../src/utils/base-convert.js';
import { stringToBytesUTF8, bytesToStringUTF8 } from '../src/utils/string-convert.js';

function toArray(bytes: Uint8Array): number[] {
  return Array.from(bytes);
}

describe('base-convert utilities', () => {
  it('converts bytes to hex string', () => {
    const hex = bytesToHexString(new Uint8Array([0, 15, 255]));
    expect(hex).toBe('000fff');
  });

  it('round-trips base58 encoding', () => {
    const bytes = stringToBytesUTF8('hello');
    const encoded = bytesToBase58(bytes);
    const decoded = base58ToBytes(encoded);
    expect(toArray(decoded)).toEqual(toArray(bytes));
  });

  it('handles base64 and base64url conversions', () => {
    const std = stringToStdBase64('hi');
    expect(std).toBe('aGk=');
    const url = stringToBase64Url('hi');
    expect(url).toBe('aGk=');
    expect(base64ToBase64Url('ab+/')).toBe('ab-_');
    expect(base64UrlToBase64('ab-_')).toBe('ab+/');
  });

  it('decodes base64 or base64url into bytes', () => {
    const withSlash = '//8='; // bytes [255, 255]
    const fromBase64 = base64OrUrlSafeToBytes(withSlash);
    expect(toArray(fromBase64)).toEqual([255, 255]);

    const urlSafe = 'AQID'; // bytes [1,2,3]
    const fromUrlSafe = base64OrUrlSafeToBytes(urlSafe);
    expect(toArray(fromUrlSafe)).toEqual([1, 2, 3]);
  });

  it('encodes bytes to base64 and raw base64url', () => {
    const bytes = stringToBytesUTF8('test');
    expect(bytesToBase64(bytes)).toBe('dGVzdA==');
    expect(bytesToRawBase64UrlSafe(bytes)).toBe('dGVzdA');
    expect(bytesToStringUTF8(base64OrUrlSafeToBytes(bytesToRawBase64UrlSafe(bytes)))).toBe('test');
  });
});
