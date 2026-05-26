import { sha256, sha512 } from '@noble/hashes/sha2.js';
import { Content } from './content';
import { ICryptography } from '../interfaces/ICryptography';
import {
  MlkemPublicJwk,
  MldsaAlg,
  MldsaPublicJwk,
  MlkemCurve,
} from '../interfaces/Cryptography.types';
import { ProtectedHeadersJWE } from '../models/jwe';
import { JwsHeader } from '../models/jws';
import {
  CommunicationKeyPurposes,
  DefaultEncryptionCurves,
  DefaultSigningAlgorithms,
  JoseContentEncryptionAlgorithms,
  JwkKeyUses,
} from '../constants/cryptography';

export type CommunicationIdentityBootstrapMode = 'deterministic' | 'random';

export interface CommunicationIdentityBootstrapOptions {
  /**
   * Stable logical identifier of the device/profile/app bootstrap context.
   *
   * This is metadata for the caller. It is not used as implicit seed material.
   */
  entityId: string;
  /**
   * Raw seed material used as the deterministic bootstrap source.
   *
   * Use this when the device/app/portal keeps an explicit seed in a wallet or
   * secure store and wants communication keys to be derived from that seed.
   *
   * When omitted, the helper defaults to random key generation unless the
   * caller explicitly requests `mode = deterministic`, in which case an error
   * is thrown.
   */
  seedMaterial?: string | Uint8Array;
  /**
   * Stateless crypto engine implementation used to derive ML-DSA and ML-KEM keys.
   */
  cryptography: ICryptography;
  /**
   * Bootstrap mode.
   *
   * - `deterministic` requires `seedMaterial`
   * - `random` delegates seed generation to the cryptography engine
   *
   * When omitted:
   * - `seedMaterial` present => `deterministic`
   * - `seedMaterial` absent => `random`
   */
  mode?: CommunicationIdentityBootstrapMode;
  /**
   * Include a separate VC signing key pair in addition to the communication
   * signing and encryption keys.
   */
  includeVcSigningKey?: boolean;
  /**
   * Override the communication signing algorithm when needed.
   */
  communicationSigningAlg?: MldsaAlg;
  /**
   * Override the VC signing algorithm when needed.
   */
  vcSigningAlg?: MldsaAlg;
  /**
   * Override the communication encryption curve when needed.
   */
  encryptionCurve?: MlkemCurve;
}

export interface ManagedMldsaKeyPair {
  /**
   * Public ML-DSA JWK enriched with canonical JOSE `use` and logical `purpose`.
   */
  publicJWKey: MldsaPublicJwk & { kid: string; use: typeof JwkKeyUses.Signature; purpose: string };
  /**
   * Private ML-DSA bytes kept in memory by the caller or wallet layer.
   */
  secretKeyBytes: Uint8Array;
}

export interface ManagedMlkemKeyPair {
  /**
   * Public ML-KEM JWK enriched with canonical JOSE `use`.
   */
  publicJWKey: MlkemPublicJwk & { kid: string; use: typeof JwkKeyUses.Encryption };
  /**
   * Private ML-KEM bytes kept in memory by the caller or wallet layer.
   */
  secretKeyBytes: Uint8Array;
}

export interface CommunicationIdentityBootstrapResult {
  /**
   * Technical signing key pair for communication envelopes.
   */
  commSigningKeyPair: ManagedMldsaKeyPair;
  /**
   * Optional separate signing key pair for VC issuance/verification workflows.
   */
  vcSigningKeyPair?: ManagedMldsaKeyPair;
  /**
   * Technical encryption key pair for communication envelopes.
   */
  commEncryptionKeyPair: ManagedMlkemKeyPair;
  /**
   * Ready-to-use JOSE header templates matching the current DIDComm metadata
   * nesting used by GDC (`meta.jws.protected` and `meta.jwe.header`).
   */
  headers: {
    jwsProtected: JwsHeader;
    jweHeader: ProtectedHeadersJWE;
  };
}

/**
 * Bootstraps the technical communication identity for a portal, device, or app
 * profile from an explicit seed source. This supports deterministic derivation
 * when a caller provides seed material, while also supporting random mode for
 * production runtimes.
 *
 * This helper creates transport identity only. It does not bootstrap the
 * human/person signing identity used for controller/professional/individual
 * authorization decisions.
 *
 * The returned JOSE header templates match the current DIDComm metadata contract:
 * `meta.jws.protected` and `meta.jwe.header`.
 *
 * @param options.entityId Stable logical identity of the bootstrap context.
 * @param options.seedMaterial Explicit seed material for deterministic derivation.
 * @param options.cryptography Stateless crypto engine implementation.
 * @param options.mode Deterministic or random seed derivation mode.
 * @param options.includeVcSigningKey Whether to derive a separate VC signing key pair.
 * @param options.communicationSigningAlg Optional override for the communication ML-DSA algorithm.
 * @param options.vcSigningAlg Optional override for the VC ML-DSA algorithm.
 * @param options.encryptionCurve Optional override for the communication ML-KEM curve.
 */
export async function initializeCommunicationIdentity(
  options: CommunicationIdentityBootstrapOptions,
): Promise<CommunicationIdentityBootstrapResult> {
  const mode = options.mode ?? (options.seedMaterial !== undefined ? 'deterministic' : 'random');
  const deterministicSource = resolveDeterministicSource(options.seedMaterial, mode);
  const communicationSigningAlg = options.communicationSigningAlg ?? DefaultSigningAlgorithms.Communication;
  const vcSigningAlg = options.vcSigningAlg ?? DefaultSigningAlgorithms.VerifiableCredential;
  const encryptionCurve = options.encryptionCurve ?? DefaultEncryptionCurves.Communication;

  const commSigningSeed =
    mode === 'deterministic' && deterministicSource
      ? deriveSeed32WithSuffix(deterministicSource, '-dsa-comm')
      : undefined;
  const vcSigningSeed =
    mode === 'deterministic' && deterministicSource && options.includeVcSigningKey
      ? deriveSeed32WithSuffix(deterministicSource, '-dsa-vc')
      : undefined;
  const encryptionSeed =
    mode === 'deterministic' && deterministicSource
      ? deriveSeed64WithSuffix(deterministicSource, '-kem')
      : undefined;

  const commSigningRaw = await options.cryptography.generateKeyPairMlDsa(commSigningSeed, communicationSigningAlg);
  const encryptionRaw = await options.cryptography.generateKeyPairMlKem(encryptionSeed, encryptionCurve);
  const vcSigningRaw = options.includeVcSigningKey
    ? await options.cryptography.generateKeyPairMlDsa(vcSigningSeed, vcSigningAlg)
    : undefined;

  const commSigningKeyPair: ManagedMldsaKeyPair = {
    publicJWKey: {
      ...commSigningRaw.publicJWKey,
      use: JwkKeyUses.Signature,
      purpose: CommunicationKeyPurposes.CommunicationSignature,
    },
    secretKeyBytes: commSigningRaw.secretKeyBytes,
  };

  const commEncryptionKeyPair: ManagedMlkemKeyPair = {
    publicJWKey: {
      ...encryptionRaw.publicJWKey,
      use: JwkKeyUses.Encryption,
    },
    secretKeyBytes: encryptionRaw.secretKeyBytes,
  };

  const vcSigningKeyPair = vcSigningRaw
    ? {
        publicJWKey: {
          ...vcSigningRaw.publicJWKey,
          use: JwkKeyUses.Signature,
          purpose: CommunicationKeyPurposes.VerifiableCredentialSignature,
        },
        secretKeyBytes: vcSigningRaw.secretKeyBytes,
      }
    : undefined;

  return {
    commSigningKeyPair,
    vcSigningKeyPair,
    commEncryptionKeyPair,
    headers: {
      jwsProtected: {
        alg: commSigningKeyPair.publicJWKey.alg,
        kid: commSigningKeyPair.publicJWKey.kid,
      },
      jweHeader: {
        alg: commEncryptionKeyPair.publicJWKey.crv,
        enc: JoseContentEncryptionAlgorithms.Aes256Gcm,
        skid: commEncryptionKeyPair.publicJWKey.kid,
      },
    },
  };
}

function resolveDeterministicSource(
  seedMaterial: string | Uint8Array | undefined,
  mode: CommunicationIdentityBootstrapMode,
): Uint8Array | undefined {
  if (mode !== 'deterministic') return undefined;
  if (seedMaterial instanceof Uint8Array) return seedMaterial;
  if (typeof seedMaterial === 'string' && seedMaterial.length > 0) {
    return Content.stringToBytesUTF8(seedMaterial);
  }
  throw new Error('initializeCommunicationIdentity requires seedMaterial when mode="deterministic".');
}

/**
 * @deprecated Use `initializeCommunicationIdentity(...)`.
 */
export const initializeCommunicationIdentityFromSeed = initializeCommunicationIdentity;

function deriveSeed32WithSuffix(source: Uint8Array, suffix: string): Uint8Array {
  return sha256(concatSeedSource(source, suffix)).subarray(0, 32);
}

function deriveSeed64WithSuffix(source: Uint8Array, suffix: string): Uint8Array {
  return sha512(concatSeedSource(source, suffix)).subarray(0, 64);
}

function concatSeedSource(source: Uint8Array, suffix: string): Uint8Array {
  const suffixBytes = Content.stringToBytesUTF8(suffix);
  const result = new Uint8Array(source.length + suffixBytes.length);
  result.set(source, 0);
  result.set(suffixBytes, source.length);
  return result;
}
