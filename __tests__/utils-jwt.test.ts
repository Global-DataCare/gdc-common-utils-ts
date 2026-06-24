import {
  buildJwtCompact,
  buildUnsignedJwt,
  buildUnsignedVpJwt,
  compactJWT,
  decodeHeader,
  decodePayload,
  encodeHeader,
  encodePayload,
  encodeSignature,
  getDataJWT,
  getPartsJWT,
  prepareJwtBytesForSignature,
  prepareJwtForSignature,
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

  it('builds unsigned JWTs with default timing claims', async () => {
    const token = await buildUnsignedJwt({ sub: '123' }, { nowSeconds: 1000, nonce: 'nonce-1000' });
    const data = await getDataJWT(token);
    expect(data?.protected).toEqual({ alg: 'none', typ: 'JWT' });
    expect(data?.payload).toEqual({
      sub: '123',
      iat: 1000,
      exp: 1600,
      nonce: 'nonce-1000',
    });
  });

  it('builds unsigned VP JWTs as aliases of unsigned JWT builder', async () => {
    const token = await buildUnsignedVpJwt({ vp: { holder: 'did:web:holder' } }, { nowSeconds: 2000, nonce: 'nonce-2000' });
    const data = await getDataJWT(token);
    expect(data?.payload).toEqual({
      vp: { holder: 'did:web:holder' },
      iat: 2000,
      exp: 2600,
      nonce: 'nonce-2000',
    });
  });

  it('prepares compact JWT signing input for an external signer and reassembles the final token', () => {
    const header = { alg: 'ES384', typ: 'JWT', kid: 'did:web:bff.example.org#key-1' };
    const payload = {
      iss: 'did:web:bff.example.org',
      sub: 'controller-sub-001',
      aud: 'gw-example',
      email: 'controller@example.org',
      exp: 1782300000,
    };

    const prepared = prepareJwtForSignature(header, payload);
    const signingBytes = prepareJwtBytesForSignature(header, payload);

    expect(prepared.signingInput).toBe(`${prepared.encodedHeader}.${prepared.encodedPayload}`);
    expect(Array.from(signingBytes)).toEqual(Array.from(Buffer.from(prepared.signingInput, 'utf8')));

    const jwt = buildJwtCompact(prepared.encodedHeader, prepared.encodedPayload, 'external-kms-signature');
    expect(jwt).toBe(`${prepared.encodedHeader}.${prepared.encodedPayload}.external-kms-signature`);
  });
});
