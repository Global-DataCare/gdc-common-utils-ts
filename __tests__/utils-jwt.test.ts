import {
  compactJWT,
  decodeHeader,
  decodePayload,
  encodeHeader,
  encodePayload,
  encodeSignature,
  getDataJWT,
  getPartsJWT,
} from '../src/utils/jwt.js';

const signatureBytes = new Uint8Array([1, 2, 3]);

describe('jwt utilities', () => {
  it('splits compact JWTs into parts', () => {
    expect(getPartsJWT(undefined)).toBeUndefined();
    expect(getPartsJWT('a.b')).toBeUndefined();
    expect(getPartsJWT('a.b.c')).toEqual({ protected: 'a', payload: 'b', signature: 'c' });
  });

  it('encodes and decodes headers', () => {
    const header = { alg: 'none' };
    const encoded = encodeHeader(header);
    expect(decodeHeader(encoded)).toEqual(header);
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(decodeHeader('not-base64')).toEqual({});
    spy.mockRestore();
  });

  it('encodes and decodes payloads (raw and deflated)', async () => {
    const payload = { sub: '123', aud: 'test' };
    const encoded = await encodePayload(payload);
    const decoded = await decodePayload(encoded);
    expect(decoded).toEqual(payload);

    const encodedDeflated = await encodePayload(payload, true);
    const decodedDeflated = await decodePayload(encodedDeflated, true);
    expect(decodedDeflated).toEqual(payload);
  });

  it('encodes signatures', () => {
    expect(encodeSignature()).toBe('');
    expect(encodeSignature(new Uint8Array(0))).toBe('');
    expect(encodeSignature(signatureBytes)).not.toBe('');
  });

  it('round-trips compact JWTs', async () => {
    const header = { alg: 'none' };
    const payload = { sub: '123' };
    const token = await compactJWT(header, payload, signatureBytes);

    const data = await getDataJWT(token);
    expect(data?.protected).toEqual(header);
    expect(data?.payload).toEqual(payload);
    expect(Array.from(data?.signature || [])).toEqual(Array.from(signatureBytes));
  });
});
