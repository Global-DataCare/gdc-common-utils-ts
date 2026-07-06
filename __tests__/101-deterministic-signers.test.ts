/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { createHash, randomBytes, randomUUID } from 'crypto';
import { describe, expect, it } from '@jest/globals';
import { deriveDeterministicEcJwkPair } from '../src/utils/deterministic-jwk.js';
import { CryptographyService } from '../src/CryptographyService.js';
import type { ICryptoHelper } from '../src/interfaces/ICryptoHelper.js';

const cryptoHelper: ICryptoHelper = {
  async getRandomBytes(byteCount: number): Promise<Uint8Array> {
    return randomBytes(byteCount);
  },
  async digestString(data: string, algorithm: string): Promise<string> {
    const normalized = String(algorithm).replace('-', '').toLowerCase();
    return createHash(normalized).update(data).digest('hex');
  },
  randomUUID(): string {
    return randomUUID();
  },
};

describe('Deterministic signer fixtures 101', () => {
  it('derives the same ES384 JWK pair for the same seed and purpose', () => {
    const first = deriveDeterministicEcJwkPair({
      seed: 'bff-seed-001',
      purpose: 'virtual-bff',
      alg: 'ES384',
    });
    const second = deriveDeterministicEcJwkPair({
      seed: 'bff-seed-001',
      purpose: 'virtual-bff',
      alg: 'ES384',
    });

    // Auditors can rerun this locally and obtain the same P-384 public JWK.
    expect(second.publicJwk).toEqual(first.publicJwk);
    expect(second.privateJwk).toEqual(first.privateJwk);
    expect(first.publicJwk.alg).toBe('ES384');
    expect(first.publicJwk.crv).toBe('P-384');
  });

  it('derives the same ES256K JWK pair for secp256k1-based controller flows', () => {
    const first = deriveDeterministicEcJwkPair({
      seed: 'controller-seed-001',
      purpose: 'controller-wallet',
      alg: 'ES256K',
    });
    const second = deriveDeterministicEcJwkPair({
      seed: 'controller-seed-001',
      purpose: 'controller-wallet',
      alg: 'ES256K',
    });

    expect(second.publicJwk).toEqual(first.publicJwk);
    expect(second.privateJwk).toEqual(first.privateJwk);
    expect(first.publicJwk.alg).toBe('ES256K');
    expect(first.publicJwk.crv).toBe('secp256k1');
  });

  it('documents that deterministic post-quantum signers already use the shared ML-DSA seed contract', async () => {
    const service = new CryptographyService(cryptoHelper);
    const seed = new Uint8Array(32).fill(9);
    const first = await service.generateKeyPairMlDsa(seed, 'ML-DSA-44');
    const second = await service.generateKeyPairMlDsa(seed, 'ML-DSA-44');

    // Post-quantum deterministic derivation already lives in the shared crypto
    // service. The new EC helper only fills the legacy ES384 / ES256K gap.
    expect(first.publicJWKey).toEqual(second.publicJWKey);
    expect(Array.from(first.secretKeyBytes)).toEqual(Array.from(second.secretKeyBytes));
    expect(first.publicJWKey.alg).toBe('ML-DSA-44');
  });
});
