import { encodeJWT as encodeJWTEncode } from '../src/cryptoEncode.js';
import { encodeJWT as encodeJWTDecode, decodeBase64Url, decodePayloadRequest } from '../src/cryptoDecode.js';

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

describe('crypto encode/decode', () => {
  it('encodes JWTs with alg none (cryptoEncode)', () => {
    const header = { alg: 'none' };
    const payload = { sub: '123' };
    const token = encodeJWTEncode([], payload, [], header);
    const parts = token.split('.');
    expect(parts.length).toBe(3);
    expect(decodeBase64Url(parts[0])).toBe(JSON.stringify(header));
    expect(decodeBase64Url(parts[1])).toBe(JSON.stringify(payload));
  });

  it('encodes JWTs with alg none (cryptoDecode)', () => {
    const header = { alg: 'none' };
    const payload = { sub: '456' };
    const token = encodeJWTDecode([], payload, [], header);
    const parts = token.split('.');
    expect(decodeBase64Url(parts[0])).toBe(JSON.stringify(header));
    expect(decodeBase64Url(parts[1])).toBe(JSON.stringify(payload));
  });

  it('decodes payloads from authorization headers', () => {
    const header = { alg: 'none' };
    const payload = { a: 1 };
    const token = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}.`;
    const decoded = decodePayloadRequest('tenant', undefined, `Bearer ${token}`);
    expect(decoded).toBe(JSON.stringify(payload));
  });

  it('returns null when token is missing', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(decodePayloadRequest('tenant', undefined, undefined)).toBeNull();
    spy.mockRestore();
  });

  it('returns empty string for invalid payload JSON', () => {
    const invalid = base64UrlEncode('not-json');
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(decodeBase64Url(invalid)).toBe('');
    spy.mockRestore();
  });
});
