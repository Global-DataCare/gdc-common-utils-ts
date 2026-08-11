import {
  computeRfc7638JwkThumbprint,
  toJwkThumbprintSha256Urn,
  withJwkThumbprintSha256Kid,
} from '../src/utils/jwk-thumbprint';

describe('JWK thumbprint identifiers', () => {
  const publicJwk = {
    kty: 'EC' as const,
    crv: 'P-384',
    x: 'x-coordinate',
    y: 'y-coordinate',
    alg: 'ES384' as const,
    use: 'sig' as const,
    kid: 'caller-controlled-alias',
  };

  it('derives the RFC 9278 kid from public material and ignores an incoming kid', () => {
    const expected = `urn:ietf:params:oauth:jwk-thumbprint:sha-256:${computeRfc7638JwkThumbprint(publicJwk)}`;

    expect(withJwkThumbprintSha256Kid(publicJwk)).toEqual({
      ...publicJwk,
      kid: expected,
    });
    expect(toJwkThumbprintSha256Urn(publicJwk)).toBe(expected);
  });

  it('does not mutate the supplied public JWK', () => {
    const normalized = withJwkThumbprintSha256Kid(publicJwk);

    expect(normalized).not.toBe(publicJwk);
    expect(publicJwk.kid).toBe('caller-controlled-alias');
  });
});
