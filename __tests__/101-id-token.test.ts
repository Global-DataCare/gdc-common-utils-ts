import { describe, expect, it } from '@jest/globals';
import {
  buildJwtCompact,
  buildUnsignedJwt,
  prepareJwtBytesForSignature,
  prepareJwtForSignature,
} from '../src/utils/jwt.js';

describe('ID Token 101 external signing sequence', () => {
  it('builds a demo unsigned id_token and also documents the production external-signing sequence', () => {
    // Teaching goal:
    // - show the minimal `id_token` claims shape expected by identity-oriented
    //   backend/BFF flows
    // - show the difference between a demo unsigned token and a production
    //   externally signed compact JWT assembled after KMS signing

    // Step 1.
    // Demo/local path: build a compact unsigned JWT shell that still carries
    // the identity claims the backend/runtime reads, especially `email`.
    const demoToken = buildUnsignedJwt({
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

    // Step 2.
    // Production path: prepare the exact compact signing input for an external
    // signer such as a BFF-side KMS, HSM, or trusted issuer key.
    const protectedHeader = {
      alg: 'ES384',
      typ: 'JWT',
      kid: 'did:web:bff.example.org#signing-key-001',
    };
    const payload = {
      iss: 'did:web:bff.example.org',
      sub: 'controller-sub-001',
      aud: 'gw-production',
      email: 'controller@example.org',
      email_verified: true,
      iat: 1782296400,
      exp: 1782297000,
    };

    const prepared = prepareJwtForSignature(protectedHeader, payload);
    const signingBytes = prepareJwtBytesForSignature(protectedHeader, payload);

    expect(prepared.signingInput).toBe(`${prepared.encodedHeader}.${prepared.encodedPayload}`);
    expect(Array.from(signingBytes)).toEqual(Array.from(Buffer.from(prepared.signingInput, 'utf8')));

    // Step 3.
    // Simulate the final assembly once the external signer returns a detached
    // signature in base64url form.
    const signatureBase64Url = 'bff-kms-signature-base64url';
    const signedIdToken = buildJwtCompact(
      prepared.encodedHeader,
      prepared.encodedPayload,
      signatureBase64Url,
    );

    expect(signedIdToken).toBe(
      `${prepared.encodedHeader}.${prepared.encodedPayload}.${signatureBase64Url}`,
    );
  });
});
