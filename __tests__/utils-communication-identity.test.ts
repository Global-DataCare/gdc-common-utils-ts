import { randomBytes, createHash, randomUUID } from 'crypto';
import { CryptographyService } from '../src/CryptographyService';
import type { ICryptoHelper } from '../src/interfaces/ICryptoHelper';
import { initializeCommunicationIdentityFromSeed } from '../src/utils/communication-identity.js';
import {
  CommunicationKeyPurposes,
  DefaultEncryptionCurves,
  DefaultSigningAlgorithms,
  JoseContentEncryptionAlgorithms,
  JwkKeyUses,
} from '../src/constants/cryptography.js';

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

describe('initializeCommunicationIdentityFromSeed', () => {
  const cryptography = new CryptographyService(cryptoHelper);

  it('derives deterministic communication keys and JOSE headers', async () => {
    const first = await initializeCommunicationIdentityFromSeed({
      entityId: 'did:web:example.com:portal:acme',
      cryptography,
      includeVcSigningKey: true,
    });
    const second = await initializeCommunicationIdentityFromSeed({
      entityId: 'did:web:example.com:portal:acme',
      cryptography,
      includeVcSigningKey: true,
    });

    expect(first.commSigningKeyPair.publicJWKey.kid).toBe(second.commSigningKeyPair.publicJWKey.kid);
    expect(first.vcSigningKeyPair?.publicJWKey.kid).toBe(second.vcSigningKeyPair?.publicJWKey.kid);
    expect(first.commEncryptionKeyPair.publicJWKey.kid).toBe(second.commEncryptionKeyPair.publicJWKey.kid);
    expect(first.commSigningKeyPair.publicJWKey.use).toBe(JwkKeyUses.Signature);
    expect(first.commSigningKeyPair.publicJWKey.purpose).toBe(CommunicationKeyPurposes.CommunicationSignature);
    expect(first.vcSigningKeyPair?.publicJWKey.purpose).toBe(CommunicationKeyPurposes.VerifiableCredentialSignature);
    expect(first.commEncryptionKeyPair.publicJWKey.use).toBe(JwkKeyUses.Encryption);
    expect(first.headers.jwsProtected).toEqual({
      alg: DefaultSigningAlgorithms.Communication,
      kid: first.commSigningKeyPair.publicJWKey.kid,
    });
    expect(first.headers.jweHeader).toEqual({
      alg: DefaultEncryptionCurves.Communication,
      enc: JoseContentEncryptionAlgorithms.Aes256Gcm,
      skid: first.commEncryptionKeyPair.publicJWKey.kid,
    });
  });

  it('supports random mode without requiring VC signing keys', async () => {
    const result = await initializeCommunicationIdentityFromSeed({
      entityId: 'did:web:example.com:mobile:user-1',
      cryptography,
      mode: 'random',
    });

    expect(result.commSigningKeyPair.publicJWKey.kid).toBeDefined();
    expect(result.commEncryptionKeyPair.publicJWKey.kid).toBeDefined();
    expect(result.vcSigningKeyPair).toBeUndefined();
    expect(result.headers.jwsProtected.kid).toBe(result.commSigningKeyPair.publicJWKey.kid);
    expect(result.headers.jweHeader.skid).toBe(result.commEncryptionKeyPair.publicJWKey.kid);
  });
});
