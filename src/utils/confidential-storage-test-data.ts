import type { ConfidentialBlobInfo, ConfidentialStorageDoc } from '../models/confidential-storage';

/**
 * Builds a stable example JWE payload for tests that only need shape fidelity.
 *
 * The literals are intentionally deterministic so downstream repositories can assert
 * exact persistence and hydration behaviour without hidden randomness.
 */
export function buildExampleConfidentialJwe(): Record<string, any> {
  return {
    protected: 'eyJlbmMiOiJDMjBQIn0',
    recipients: [
      {
        encrypted_key: '4PQsjDGs8IE3YqgcoGfwPTuVG25MKjojx4HSZqcjfkhr0qhwqkpUUw',
        header: {
          kid: 'urn:rfc7638:sha-256:Base64Url(SHA256(JWK))',
          alg: 'ML-KEM',
        },
      },
    ],
    iv: 'FoJ5uPIR6HDPFCtD',
    ciphertext: 'tIupQ-9MeYLdkAc1Us0Mdlp1kZ5Dbavq0No-eJ91cF0R0hE',
    tag: 'TMRcEPc74knOIbXhLDJA_w',
  };
}

/**
 * Builds a stable example blob pointer for tests that externalize confidential payloads.
 */
export function buildExampleConfidentialBlobInfo(overrides: Partial<ConfidentialBlobInfo> = {}): ConfidentialBlobInfo {
  return {
    provider: 'gcs',
    blobRef: 'zQmExampleBlobRefForEncryptedPayload',
    locator: 'https://storage.example.com/zQmExampleBlobRefForEncryptedPayload',
    contentType: 'application/jose+json',
    ...overrides,
  };
}

/**
 * Builds a realistic `ConfidentialStorageDoc` with deterministic indexed metadata.
 *
 * Tests can override just the fields they care about while reusing one canonical
 * base document across repositories and services.
 */
export function buildExampleConfidentialStorageDoc(
  overrides: Partial<ConfidentialStorageDoc> = {},
): ConfidentialStorageDoc {
  return {
    id: 'doc-1',
    status: 'active',
    sequence: 0,
    indexed: {
      attributes: [
        {
          name: 'hmac_for_email',
          value: 'hmac_for_test@example.com',
          unique: true,
        },
        {
          name: 'hmac_for_role',
          value: 'hmac_for_admin',
        },
      ],
    },
    jwe: buildExampleConfidentialJwe(),
    ...overrides,
  };
}
