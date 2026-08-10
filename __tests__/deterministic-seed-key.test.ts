import { createPrivateKey } from 'node:crypto';
import {
  deriveDeterministicEcPemKeyPair,
  deriveScryptSeparatedEcPemKeyPair,
  parseDeterministicSeedSalt,
  parseScryptDerivationProfile,
} from '../src/utils/deterministic-seed-key';

describe('deterministic ICA-compatible seed keys', () => {
  it('keeps deterministic P-384 material and RFC 7638 kid stable', () => {
    const first = deriveDeterministicEcPemKeyPair('stable-test-seed', 'P-384');
    const second = deriveDeterministicEcPemKeyPair('stable-test-seed', 'P-384');
    expect(second).toEqual(first);
    expect(createPrivateKey(first.privateKeyPem).asymmetricKeyType).toBe('ec');
    expect(first.publicJwk.crv).toBe('P-384');
    expect(first.kidRfc7638).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it('domain-separates scrypt-derived ES384 and ES256K keys', () => {
    const profile = parseScryptDerivationProfile('10:8:1:48');
    const salt = parseDeterministicSeedSalt('shared-test-salt', 'fallback').salt;
    const es384 = deriveScryptSeparatedEcPemKeyPair({
      passphrase: 'test passphrase', salt, profile, alg: 'ES384', separationTag: 'test:es384',
    });
    const es256k = deriveScryptSeparatedEcPemKeyPair({
      passphrase: 'test passphrase', salt, profile, alg: 'ES256K', separationTag: 'test:es256k',
    });
    expect(es384.publicJwk.crv).toBe('P-384');
    expect(es256k.publicJwk.crv).toBe('secp256k1');
    expect(es384.separatedSeedHex).not.toBe(es256k.separatedSeedHex);
  });
});
