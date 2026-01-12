import { computeHmacSha256, computeHmacSha256Base64Url } from '../src/hmac.js';

describe('hmac utilities', () => {
  it('computes HMAC-SHA3-256 bytes deterministically', async () => {
    const key = new Uint8Array([1, 2, 3, 4]);
    const message = 'hello';
    const first = await computeHmacSha256(message, key);
    const second = await computeHmacSha256(message, key);
    expect(Array.from(first)).toEqual(Array.from(second));
    expect(first.length).toBe(32);
  });

  it('computes base64url HMAC output consistently', async () => {
    const key = new Uint8Array([9, 8, 7, 6]);
    const message = 'hello';
    const first = await computeHmacSha256Base64Url(message, key);
    const second = await computeHmacSha256Base64Url(message, key);
    expect(first).toBe(second);
    expect(first.length).toBe(43);
  });
});
