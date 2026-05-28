// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.

import { MldsaAlg, MlkemCurve } from '../interfaces/Cryptography.types';
import { AES_GCM_JWA_ENC } from '../models/aes';

/**
 * Canonical JOSE/JWK `use` values used across GDC communication key material.
 */
export const JwkKeyUses = {
  Signature: 'sig',
  Encryption: 'enc',
} as const;

/**
 * Canonical public-key purposes used by GW and SDKs to distinguish communication
 * signing keys from VC signing keys.
 */
export const CommunicationKeyPurposes = {
  CommunicationSignature: 'comm_sig',
  VerifiableCredentialSignature: 'vc_sign',
} as const;

/**
 * Classical JOSE signature algorithms currently recognized across GDC VP/JWT
 * examples and gateway trust adapters.
 *
 * Notes:
 * - `ES256K` is the JOSE name for ECDSA over `secp256k1`
 * - `ES384` remains the common P-384 legacy example in current GW fixtures
 */
export const ClassicalJoseSignatureAlgorithms = {
  Es256: 'ES256',
  Es256K: 'ES256K',
  Es384: 'ES384',
} as const;

/**
 * JOSE signature algorithms accepted by shared VP/JWT helpers.
 *
 * This intentionally covers both:
 * - classical ECDSA JOSE algorithms (`ES256`, `ES256K`, `ES384`)
 * - post-quantum ML-DSA JOSE algorithm labels already used by GW
 *
 * Use this type when a helper builds or documents a JWS/JWT/VP proof header.
 */
export type JoseSignatureAlgorithm =
  | typeof ClassicalJoseSignatureAlgorithms[keyof typeof ClassicalJoseSignatureAlgorithms]
  | MldsaAlg;

/**
 * Default post-quantum signing algorithms used for communication bootstrap.
 */
export const DefaultSigningAlgorithms: {
  Communication: MldsaAlg;
  VerifiableCredential: MldsaAlg;
} = {
  Communication: 'ML-DSA-44',
  VerifiableCredential: 'ML-DSA-44',
};

/**
 * Default post-quantum encryption curve used for communication bootstrap.
 */
export const DefaultEncryptionCurves: {
  Communication: MlkemCurve;
} = {
  Communication: 'ML-KEM-768',
};

/**
 * Canonical JOSE content-encryption algorithms used by DIDComm/JWE envelopes.
 */
export const JoseContentEncryptionAlgorithms = {
  Aes256Gcm: AES_GCM_JWA_ENC,
} as const;
