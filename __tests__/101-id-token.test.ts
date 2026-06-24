import { describe, expect, it } from '@jest/globals';
import {
  createJwtSigner,
} from '../src/utils/jwt-signer.js';

describe('ID Token 101 external signing sequence', () => {
  it('creates one high-level BFF signer and uses it for both demo and production-shaped id_token flows', async () => {
    const signer = await createJwtSigner({
      alg: 'ES384',
      seed: 'demo-bff-seed-001',
      purpose: 'virtual-bff',
    });

    expect(signer.getMode()).toBe('deterministic');
    expect(signer.getAlgorithm()).toBe('ES384');
    expect(signer.getPublicJwk()).toMatchObject({
      kty: 'EC',
      crv: 'P-384',
      use: 'sig',
    });
    expect(signer.getKid()).toBeTruthy();
    expect(signer.getThumbprint()).toBeTruthy();
    expect(signer.getThumbprintUri()).toContain('urn:ietf:params:oauth:jwk-thumbprint:sha-256:');
    expect(signer.getKid()).toBe(signer.getThumbprintUri());

    // Demo/local path:
    // keep one syntactically valid compact JWT shell while still carrying the
    // identity claims a backend/BFF flow reads, especially `email`.
    const demoToken = signer.buildUnsignedJwt({
      iss: 'did:web:demo-bff.example.org',
      sub: 'controller-sub-001',
      aud: 'gw-local-demo',
      email: 'controller@example.org',
      email_verified: true,
    }, {
      nowSeconds: 1782296400,
      ttlSeconds: 600,
      nonce: 'demo-id-token-001',
    });

    const demoParts = demoToken.split('.');
    expect(demoParts).toHaveLength(3);
    expect(demoParts[2]).toBe('');

    // Production path:
    // prepare the exact compact signing input for one external signer such as
    // a BFF-side KMS, HSM, or trusted issuer key.
    const payload = {
      iss: 'did:web:bff.example.org',
      sub: 'controller-sub-001',
      aud: 'gw-production',
      email: 'controller@example.org',
      email_verified: true,
      iat: 1782296400,
      exp: 1782297000,
    };
    const prepared = signer.prepareJwt({
      payload,
    });

    expect(prepared.protectedHeader.kid).toBe(signer.getKid());
    expect(prepared.signingInput).toBe(`${prepared.encodedHeader}.${prepared.encodedPayload}`);
    expect(Array.from(prepared.signingBytes)).toEqual(Array.from(Buffer.from(prepared.signingInput, 'utf8')));

    // Final assembly once the external signer returns one detached signature.
    const signatureBase64Url = 'bff-kms-signature-base64url';
    const signedIdToken = signer.buildCompact(signatureBase64Url, prepared);

    expect(signedIdToken).toBe(
      `${prepared.encodedHeader}.${prepared.encodedPayload}.${signatureBase64Url}`,
    );
  });
});
