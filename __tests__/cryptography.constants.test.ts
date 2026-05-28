import { describe, expect, it } from '@jest/globals';
import {
  ClassicalJoseSignatureAlgorithms,
  JoseSignatureAlgorithm,
} from '../src/constants/cryptography.js';
import { VpTokenHeader } from '../src/utils/vp-token.js';

/**
 * These tests are intentionally small and explicit.
 *
 * Their purpose is not to test TypeScript itself, but to document the shared
 * algorithm vocabulary that VP/JWT helpers are expected to use:
 * - `ES384` for the current legacy P-384 examples
 * - `ES256K` for secp256k1 / Pontus-X style signers
 * - `ML-DSA-*` for post-quantum signers already used elsewhere in GDC
 */
describe('cryptography constants', () => {
  it('exports the classical JOSE signature algorithms used by shared VP/JWT helpers', () => {
    expect(ClassicalJoseSignatureAlgorithms).toEqual({
      Es256: 'ES256',
      Es256K: 'ES256K',
      Es384: 'ES384',
    });
  });

  it('allows VP protected headers to use secp256k1 and post-quantum signing algorithms', () => {
    const secp256k1Header: VpTokenHeader = {
      alg: ClassicalJoseSignatureAlgorithms.Es256K,
      typ: 'JWT',
      kid: 'urn:ietf:params:oauth:jwk-thumbprint:sha-256:example-secp256k1-thumbprint',
    };
    const pqHeader: VpTokenHeader = {
      alg: 'ML-DSA-44',
      typ: 'JWT',
      kid: 'urn:ietf:params:oauth:jwk-thumbprint:sha-256:example-mldsa-thumbprint',
    };

    expect(secp256k1Header.alg).toBe('ES256K');
    expect(pqHeader.alg).toBe('ML-DSA-44');
  });

  it('keeps the shared algorithm type explicit in examples and helper signatures', () => {
    const selectedAlgorithms: JoseSignatureAlgorithm[] = [
      ClassicalJoseSignatureAlgorithms.Es384,
      ClassicalJoseSignatureAlgorithms.Es256K,
      'ML-DSA-65',
    ];

    expect(selectedAlgorithms).toEqual(['ES384', 'ES256K', 'ML-DSA-65']);
  });
});
