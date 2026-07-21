// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.

import { randomBytes, createHash, randomUUID } from 'crypto';
import { CryptographyService } from '../src/CryptographyService';
import type { ICryptoHelper } from '../src/interfaces/ICryptoHelper';
import { Content } from '../src/utils/content';
import { MlDsaPrivKeySizeLevel2, MlDsaPubKeySizeLevel2 } from '../src/interfaces/MlDsa';
import { Kyber512PKBytes } from '../src/interfaces/MlKem';

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

describe('CryptographyService (PQC)', () => {
  const service = new CryptographyService(cryptoHelper);

  it('generates ML-KEM key pairs and encapsulates/decapsulates', async () => {
    const { publicJWKey, secretKeyBytes } = await service.generateKeyPairMlKem();
    expect(publicJWKey?.x).toBeDefined();
    expect(publicJWKey?.kid).toBeDefined();
    expect(secretKeyBytes.length).toBeGreaterThan(0);

    const recipientPublicKeyBytes = Content.base64ToBytes(publicJWKey.x);
    const cekSeedBytes = await cryptoHelper.getRandomBytes(32);
    const { derivedCekBytes, encapsulatedCekBytes } = await service.encapsulate(
      cekSeedBytes,
      secretKeyBytes,
      recipientPublicKeyBytes
    );
    const derivedFromDecap = await service.decapsulate(encapsulatedCekBytes, secretKeyBytes);

    expect(derivedCekBytes.length).toBeGreaterThan(0);
    expect(derivedFromDecap.length).toBe(derivedCekBytes.length);
    expect(Buffer.from(derivedFromDecap).equals(Buffer.from(derivedCekBytes))).toBe(true);
  });

  it('generates deterministic ML-KEM key pairs with a seed', async () => {
    const seed = new Uint8Array(64).fill(7);
    const first = await service.generateKeyPairMlKem(seed, 'ML-KEM-512');
    const second = await service.generateKeyPairMlKem(seed, 'ML-KEM-512');
    expect(first.publicJWKey.x).toBe(second.publicJWKey.x);
    expect(first.publicJWKey.kid).toBe(second.publicJWKey.kid);
    expect(first.secretKeyBytes.length).toBeGreaterThan(0);
    expect(Content.base64ToBytes(first.publicJWKey.x).length).toBe(Kyber512PKBytes);
  });

  it('generates ML-DSA key pairs with expected sizes', async () => {
    const seed = new Uint8Array(32).fill(3);
    const { publicJWKey, secretKeyBytes } = await service.generateKeyPairMlDsa(seed, 'ML-DSA-44');
    expect(publicJWKey.alg).toBe('ML-DSA-44');
    expect(secretKeyBytes.length).toBeGreaterThanOrEqual(MlDsaPrivKeySizeLevel2);
    expect(Content.base64ToBytes(publicJWKey.pub).length).toBe(MlDsaPubKeySizeLevel2);
  });

  it('signs and verifies with ML-DSA', async () => {
    const { publicJWKey, secretKeyBytes } = await service.generateKeyPairMlDsa(undefined, 'ML-DSA-44');
    const payload = Content.stringToBytesUTF8('test-payload');

    const signature = await service.signBytes(payload, secretKeyBytes, 'ML-DSA-44');
    const verified = await service.verifyBytes(signature, payload, publicJWKey);
    expect(verified).toBe(true);

    const tampered = Content.stringToBytesUTF8('test-payload-tampered');
    const verifiedTampered = await service.verifyBytes(signature, tampered, publicJWKey);
    expect(verifiedTampered).toBe(false);
  });

  it('signs JWS objects and verifies compact + detached forms', async () => {
    const { publicJWKey, secretKeyBytes } = await service.generateKeyPairMlDsa(undefined, 'ML-DSA-44');
    const protectedHeader = { alg: 'ML-DSA-44', typ: 'JWT' };
    const payload = { sub: '123', aud: 'test' };

    const jws = await service.signDataJws(payload, protectedHeader, secretKeyBytes);
    const compact = `${jws.protected}.${jws.payload}.${jws.signature}`;
    const verified = await service.verifyJws(compact, publicJWKey);
    expect(verified).toBe(true);

    const detached = `${jws.protected}..${jws.signature}`;
    const payloadBytes = Content.stringToBytesUTF8(JSON.stringify(payload));
    expect(await service.verifyDetachedJws(payloadBytes, detached, publicJWKey)).toBe(true);
  });

  it('throws on invalid detached JWS format', async () => {
    await expect(service.verifyDetachedJws(new Uint8Array([1]), 'not-detached', { kty: 'AKP', alg: 'ML-DSA-44', pub: 'AA' }))
      .rejects.toThrow(/Detached JWS format/);
  });

  it('throws on missing alg in headers for signing and verification', async () => {
    const { publicJWKey, secretKeyBytes } = await service.generateKeyPairMlDsa(undefined, 'ML-DSA-44');
    await expect(service.signDataJws({ a: 1 }, {}, secretKeyBytes)).rejects.toThrow(/alg/);

    const missingAlg = { ...publicJWKey };
    delete (missingAlg as any).alg;
    await expect(service.verifyBytes(new Uint8Array([1]), new Uint8Array([2]), missingAlg as any)).rejects.toThrow(/alg/);
  });

  it('encrypts and decrypts JWE objects (zip + no zip)', async () => {
    const recipient = await service.generateKeyPairMlKem(undefined, 'ML-KEM-768');
    const recipientPrivate = { ...recipient.publicJWKey, dBytes: recipient.secretKeyBytes };

    const payload = { msg: 'hello' };
    const headerNoZip = { typ: 'JWE', kid: recipient.publicJWKey.kid };
    const jwe = await service.encryptJwe(payload, headerNoZip, recipientPrivate, [recipient.publicJWKey]);
    const decrypted = await service.decryptJwe(jwe, recipientPrivate);
    expect(Content.bytesToStringUTF8(decrypted.decryptedBytes)).toBe(JSON.stringify(payload));

    const headerZip = { typ: 'JWE', zip: 'DEF', kid: recipient.publicJWKey.kid };
    const jweZip = await service.encryptJwe(payload, headerZip, recipientPrivate, [recipient.publicJWKey]);
    const decryptedZip = await service.decryptJwe(jweZip, recipientPrivate);
    expect(Content.bytesToStringUTF8(decryptedZip.decryptedBytes)).toBe(JSON.stringify(payload));
  });

  it('encrypts and decrypts compact JWE', async () => {
    const recipient = await service.generateKeyPairMlKem(undefined, 'ML-KEM-768');
    const recipientPrivate = { ...recipient.publicJWKey, dBytes: recipient.secretKeyBytes };

    const payload = 'hello-compact · 健康 · 🛡️';
    const protectedHeader = { typ: 'JWE', zip: 'DEF' };
    const compact = await service.encryptJweToCompact(payload, protectedHeader, recipientPrivate, recipient.publicJWKey);
    const parsed = service.parseCompactJwe(compact);
    const wrappedCek = Content.base64UrlSafeToJSON(parsed.recipients[0].encrypted_key!);
    expect(wrappedCek).toMatchObject({
      v: 'gdc-mlkem-cek-wrap-v1',
      kem: 'ML-KEM-768',
      kdf: 'HKDF-SHA-256',
      wrap: 'A256GCM',
    });
    const decrypted = await service.decryptJwe(parsed, recipientPrivate);
    expect(Content.bytesToStringUTF8(decrypted.decryptedBytes)).toBe(payload);
    const second = await service.encryptJweToCompact(payload, protectedHeader, recipientPrivate, recipient.publicJWKey);
    expect(second).not.toBe(compact);
  });

  it('rejects multiple recipients in encryptJwe', async () => {
    const recipient = await service.generateKeyPairMlKem(undefined, 'ML-KEM-768');
    const recipientPrivate = { ...recipient.publicJWKey, dBytes: recipient.secretKeyBytes };
    await expect(
      service.encryptJwe({ a: 1 }, { typ: 'JWE' }, recipientPrivate, [recipient.publicJWKey, recipient.publicJWKey])
    ).rejects.toThrow(/single recipient/);
  });

  it('parses and rejects malformed compact structures', async () => {
    expect(() => service.parseCompactJws('a.b')).toThrow(/Compact JWS/);
    expect(() => service.parseCompactJwe('a.b.c')).toThrow(/Compact JWE/);
  });

  it('parses compact JWS into structured data', async () => {
    const { publicJWKey, secretKeyBytes } = await service.generateKeyPairMlDsa(undefined, 'ML-DSA-44');
    const jws = await service.signDataJws({ sub: 'abc' }, { alg: 'ML-DSA-44' }, secretKeyBytes);
    const compact = `${jws.protected}.${jws.payload}.${jws.signature}`;
    const parsed = service.parseCompactJws(compact);
    expect(parsed.payload).toEqual({ sub: 'abc' });
    expect(parsed.protected).toEqual({ alg: 'ML-DSA-44' });
    expect(await service.verifyJws(compact, publicJWKey)).toBe(true);
  });

  it('parses JWS JSON serialization', async () => {
    const { secretKeyBytes } = await service.generateKeyPairMlDsa(undefined, 'ML-DSA-44');
    const jws = await service.signDataJws({ sub: 'json' }, { alg: 'ML-DSA-44' }, secretKeyBytes);
    const jwsJson = JSON.stringify({
      payload: jws.payload,
      signatures: [{ protected: jws.protected, signature: jws.signature }],
    });
    const parsed = service.parseCompactJws(jwsJson);
    expect(parsed.payload).toBe(jws.payload);
    expect(parsed.protected).toBe(jws.protected);
    expect(parsed.signature).toBe(jws.signature);
  });

  it('extracts recipient kids from JWE objects', async () => {
    const recipient = await service.generateKeyPairMlKem(undefined, 'ML-KEM-768');
    const recipientPrivate = { ...recipient.publicJWKey, dBytes: recipient.secretKeyBytes };
    const jwe = await service.encryptJwe({ a: 1 }, { typ: 'JWE', kid: recipient.publicJWKey.kid }, recipientPrivate, [recipient.publicJWKey]);
    expect(service.getRecipientKidsFromJwe(jwe)).toEqual([recipient.publicJWKey.kid]);
    expect(service.getRecipientKidsFromJwe({} as any)).toEqual([]);
  });

  it('parses JWE JSON serialization', async () => {
    const recipient = await service.generateKeyPairMlKem(undefined, 'ML-KEM-768');
    const recipientPrivate = { ...recipient.publicJWKey, dBytes: recipient.secretKeyBytes };
    const jwe = await service.encryptJwe({ msg: 'json' }, { typ: 'JWE', kid: recipient.publicJWKey.kid }, recipientPrivate, [recipient.publicJWKey]);
    const parsed = service.parseCompactJwe(JSON.stringify(jwe));
    const decrypted = await service.decryptJwe(parsed, recipientPrivate);
    expect(Content.bytesToStringUTF8(decrypted.decryptedBytes)).toBe(JSON.stringify({ msg: 'json' }));
  });

  it('computes JWK thumbprints for EC keys', async () => {
    const ecJwk = { kty: 'EC', crv: 'P-256', x: 'AA', y: 'BB' };
    const thumbprint = await (service as any)._computeJwkThumbprint(ecJwk, 'SHA-384');
    const thumbprint2 = await (service as any)._computeJwkThumbprint(ecJwk, 'SHA-384');
    expect(thumbprint).toBe(thumbprint2);
    expect(thumbprint.length).toBeGreaterThan(0);
  });
});
