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
