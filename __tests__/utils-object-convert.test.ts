import {
  arrayCompare,
  arrayMerge,
  base64UrlSafeToJSON,
  objectToBytes,
  objectToRawBase64UrlSafe,
} from '../src/utils/object-convert.js';
import { bytesToStringUTF8 } from '../src/utils/string-convert.js';

function toArray(bytes: Uint8Array): number[] {
  return Array.from(bytes);
}

describe('object-convert', () => {
  it('compares arrays', () => {
    expect(arrayCompare([1, 2], [1, 2])).toBe(true);
    expect(arrayCompare([1], [1, 2])).toBe(false);
    expect(arrayCompare([1, 2], [1, 3])).toBe(false);
  });

  it('merges Uint8Arrays', () => {
    const merged = arrayMerge(new Uint8Array([1, 2]), new Uint8Array([3]));
    expect(toArray(merged)).toEqual([1, 2, 3]);
  });

  it('serializes objects to bytes and base64url', () => {
    const obj = { a: 1, b: true };
    const bytes = objectToBytes(obj);
    expect(bytesToStringUTF8(bytes)).toBe(JSON.stringify(obj));

    const encoded = objectToRawBase64UrlSafe(obj);
    expect(base64UrlSafeToJSON(encoded)).toEqual(obj);
  });

  it('throws on undefined base64 input', () => {
    expect(() => base64UrlSafeToJSON(undefined)).toThrow(/undefined/);
  });
});
