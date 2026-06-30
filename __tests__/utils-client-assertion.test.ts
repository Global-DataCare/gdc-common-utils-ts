import { describe, expect, it } from '@jest/globals';
import { decodeProtectedHeader } from 'jose';
import { buildClientAssertionJwt, buildClientAssertionFixture } from '../src/utils/client-assertion';
import { getPartsJWT } from '../src/utils/jwt';

describe('client assertion helpers', () => {
  it('builds one ES384 client assertion by default with embedded JWK', async () => {
    const jwt = await buildClientAssertionJwt({
      clientId: 'did:web:client.example:device:001',
      audience: 'did:web:api.provider.example',
    });

    const parts = getPartsJWT(jwt);
    expect(parts).toBeDefined();
    const header = decodeProtectedHeader(jwt);
    expect(header.alg).toBe('ES384');
    expect(header.typ).toBe('JWT');
    expect((header as any).jwk).toBeDefined();
  });

  it('supports alternate algorithms such as ES256', async () => {
    const fixture = await buildClientAssertionFixture({
      clientId: 'did:web:client.example:device:002',
      audience: 'did:web:api.provider.example',
      algorithm: 'ES256',
    });

    const header = decodeProtectedHeader(fixture.jwt);
    expect(header.alg).toBe('ES256');
    expect(fixture.publicJwk.kty).toBe('EC');
  });
});
