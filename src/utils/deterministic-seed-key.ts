// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { createECDH, createHash, createPrivateKey, scryptSync } from 'node:crypto';
import { computeRfc7638JwkThumbprint } from './jwk-thumbprint';

export type DeterministicSeedEcAlgorithm = 'ES384' | 'ES256K';
export type DeterministicSeedEcCurve = 'P-384' | 'secp256k1';

export type ScryptDerivationProfile = {
  profile: string;
  log2N: number;
  N: number;
  r: number;
  p: number;
  dkLen: number;
};

export type DeterministicEcPemKeyMaterial = {
  privateKeyPem: string;
  publicJwk: {
    kty: 'EC';
    crv: DeterministicSeedEcCurve;
    x: string;
    y: string;
  };
  kidRfc7638: string;
};

/** Parses the portable `<log2N>:<r>:<p>:<dkLen>` scrypt profile. */
export function parseScryptDerivationProfile(
  rawProfile: string | undefined,
  fallbackProfile = '17:8:1:48',
): ScryptDerivationProfile {
  const profile = (rawProfile || fallbackProfile).trim();
  const values = profile.split(':').map((value) => Number.parseInt(value, 10));
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value) || value <= 0)) {
    throw new Error('Invalid scrypt profile. Expected <log2N>:<r>:<p>:<dkLen>, e.g. 17:8:1:48.');
  }
  const [log2N, r, p, dkLen] = values;
  if (log2N < 10 || log2N > 24) {
    throw new Error('scrypt log2N must be between 10 and 24.');
  }
  return { profile, log2N, N: 2 ** log2N, r, p, dkLen };
}

/** Decodes a seed salt as hexadecimal when unambiguous, otherwise as UTF-8. */
export function parseDeterministicSeedSalt(rawSalt: string | undefined, fallbackSalt: string): {
  salt: Uint8Array;
  raw: string;
  encoding: 'hex' | 'utf8';
} {
  const value = (rawSalt || '').trim() || fallbackSalt;
  const isHex = /^[0-9a-fA-F]+$/.test(value) && value.length % 2 === 0;
  return {
    salt: Buffer.from(value, isHex ? 'hex' : 'utf8'),
    raw: isHex ? value.toLowerCase() : value,
    encoding: isHex ? 'hex' : 'utf8',
  };
}

/**
 * Derives the compatibility EC PEM/JWK pair used by ICA seed profiles.
 *
 * The byte-for-byte algorithm is deliberately stable: changing its SHA-512
 * expansion would silently change every key regenerated from an existing
 * private seed.
 */
export function deriveDeterministicEcPemKeyPair(
  seed: string,
  curve: DeterministicSeedEcCurve,
): DeterministicEcPemKeyMaterial {
  const nodeCurve = curve === 'P-384' ? 'secp384r1' : 'secp256k1';
  const keyLength = curve === 'P-384' ? 48 : 32;
  for (let counter = 0; counter < 256; counter += 1) {
    const material = createHash('sha512').update(`${seed}:${curve}:${counter}`).digest();
    const candidate = material.subarray(0, keyLength);
    try {
      const ecdh = createECDH(nodeCurve);
      ecdh.setPrivateKey(candidate);
      const privateBytes = ecdh.getPrivateKey();
      const publicBytes = ecdh.getPublicKey(undefined, 'uncompressed');
      const x = publicBytes.subarray(1, 1 + keyLength).toString('base64url');
      const y = publicBytes.subarray(1 + keyLength, 1 + (2 * keyLength)).toString('base64url');
      const publicJwk = { kty: 'EC' as const, crv: curve, x, y };
      const privateKey = createPrivateKey({
        key: { ...publicJwk, d: privateBytes.toString('base64url') },
        format: 'jwk',
      });
      return {
        privateKeyPem: privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
        publicJwk,
        kidRfc7638: computeRfc7638JwkThumbprint(publicJwk),
      };
    } catch {
      // Retry the next deterministic candidate until the curve accepts it.
    }
  }
  throw new Error(`Unable to derive deterministic ${curve} key from seed.`);
}

/**
 * Applies scrypt and explicit domain separation before deterministic EC key
 * expansion. Existing `profile + salt + separationTag` values are a durable
 * key identity contract and must remain recorded with encrypted seed custody.
 */
export function deriveScryptSeparatedEcPemKeyPair(input: {
  passphrase: string;
  salt: Uint8Array;
  profile: ScryptDerivationProfile;
  alg: DeterministicSeedEcAlgorithm;
  separationTag: string;
}): DeterministicEcPemKeyMaterial & { deterministicSeed: string; separatedSeedHex: string } {
  const derivedSeed = scryptSync(input.passphrase, input.salt, input.profile.dkLen, {
    N: input.profile.N,
    r: input.profile.r,
    p: input.profile.p,
    maxmem: 128 * input.profile.N * input.profile.r * 2,
  });
  const separatedSeedHex = createHash('sha256')
    .update(derivedSeed)
    .update(Buffer.from('|'))
    .update(Buffer.from(input.separationTag, 'utf8'))
    .digest('hex');
  const deterministicSeed = `scrypt:${input.profile.profile}:${separatedSeedHex}`;
  const curve = input.alg === 'ES384' ? 'P-384' : 'secp256k1';
  return {
    ...deriveDeterministicEcPemKeyPair(deterministicSeed, curve),
    deterministicSeed,
    separatedSeedHex,
  };
}
