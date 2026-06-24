// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { randomBytes } from 'crypto';
import { ClassicalJoseSignatureAlgorithms, type JoseSignatureAlgorithm, JwkKeyUses } from '../constants/cryptography';
import type { ICryptography } from '../interfaces/ICryptography';
import type { MldsaAlg, PublicJwk, ClassicPublicJwk } from '../interfaces/Cryptography.types';
import { Content } from './content';
import {
  buildJwtCompact,
  buildUnsignedJwt,
  prepareJwtBytesForSignature,
  prepareJwtForSignature,
} from './jwt';
import {
  computeRfc7638JwkThumbprint,
  toJwkThumbprintSha256Urn,
  type ThumbprintableJwk,
} from './jwk-thumbprint';
import {
  deriveDeterministicEcJwkPair,
  type DeterministicEcJwkAlgorithm,
  type DeterministicEcJwkPair,
} from './deterministic-jwk';

export type JwtSignerMode = 'deterministic' | 'random';

export type JwtSignerMaterial =
  | {
    kind: 'classic-ec';
    publicJwk: ClassicPublicJwk & { kid: string; use: 'sig' };
    privateJwk: ClassicPublicJwk & { kid: string; use: 'sig'; d: string };
  }
  | {
    kind: 'ml-dsa';
    publicJwk: PublicJwk & { kid: string; use?: string };
    secretKeyBytes: Uint8Array;
  };

export type PreparedJwtSigningInput = {
  protectedHeader: Record<string, unknown>;
  encodedHeader: string;
  encodedPayload: string;
  signingInput: string;
  signingBytes: Uint8Array;
};

export interface JwtSigner {
  getMode(): JwtSignerMode;
  getAlgorithm(): JoseSignatureAlgorithm;
  getPurpose(): string;
  getPublicJwk(): PublicJwk;
  getPrivateMaterial(): JWKLikePrivateMaterial;
  getKid(): string;
  getThumbprint(): string;
  getThumbprintUri(): string;
  prepareJwt(input: {
    payload: Record<string, unknown>;
    header?: Record<string, unknown>;
    typ?: string;
    kid?: string;
  }): PreparedJwtSigningInput;
  buildCompact(signatureBase64Url: string, prepared: Pick<PreparedJwtSigningInput, 'encodedHeader' | 'encodedPayload'>): string;
  buildUnsignedJwt(payload: Record<string, unknown>, options?: Readonly<{ nowSeconds?: number; ttlSeconds?: number; nonce?: string }>): string;
}

export type JWKLikePrivateMaterial =
  | (ClassicPublicJwk & { kid: string; use: 'sig'; d: string })
  | Uint8Array;

export type CreateJwtSignerOptions = {
  alg: JoseSignatureAlgorithm;
  purpose: string;
  seed?: string | Uint8Array;
  cryptography?: Pick<ICryptography, 'generateKeyPairMlDsa'>;
};

function isClassicEcAlg(alg: JoseSignatureAlgorithm): alg is DeterministicEcJwkAlgorithm {
  return alg === ClassicalJoseSignatureAlgorithms.Es384 || alg === ClassicalJoseSignatureAlgorithms.Es256K;
}

function resolveMode(seed: string | Uint8Array | undefined): JwtSignerMode {
  return seed === undefined ? 'random' : 'deterministic';
}

function resolveSeedString(seed: string | Uint8Array | undefined): string {
  if (typeof seed === 'string') return seed;
  if (seed instanceof Uint8Array) return Content.bytesToRawBase64UrlSafe(seed);
  return randomBytes(32).toString('base64url');
}

/**
 * Creates one high-level JWT signer façade for docs, tests, BFF helpers, and
 * controller/wallet flows.
 *
 * Contract:
 * - if `seed` is provided, the signer runs in deterministic mode
 * - if `seed` is omitted, the signer generates fresh random material
 *
 * This helper intentionally exposes a small integrator-facing surface:
 * - get the public JWK / kid / thumbprint
 * - prepare the exact `header.payload` signing input
 * - assemble the final compact JWT afterwards
 *
 * It does not hide the real external-signing step. That step still belongs to
 * a KMS, HSM, wallet, or trusted issuer.
 */
export async function createJwtSigner(options: CreateJwtSignerOptions): Promise<JwtSigner> {
  const mode = resolveMode(options.seed);
  const seedText = resolveSeedString(options.seed);
  const alg = options.alg;

  let material: JwtSignerMaterial;
  if (isClassicEcAlg(alg)) {
    const pair: DeterministicEcJwkPair = deriveDeterministicEcJwkPair({
      seed: seedText,
      purpose: options.purpose,
      alg,
    });
    material = {
      kind: 'classic-ec',
      publicJwk: pair.publicJwk,
      privateJwk: pair.privateJwk,
    };
  } else {
    if (!options.cryptography) {
      throw new Error(`createJwtSigner requires options.cryptography for post-quantum algorithm '${alg}'.`);
    }
    const seedBytes = options.seed === undefined
      ? undefined
      : options.seed instanceof Uint8Array
        ? options.seed
        : Content.stringToBytesUTF8(options.seed);
    const generated = await options.cryptography.generateKeyPairMlDsa(seedBytes, alg as MldsaAlg);
    material = {
      kind: 'ml-dsa',
      publicJwk: {
        ...generated.publicJWKey,
        use: JwkKeyUses.Signature,
      },
      secretKeyBytes: generated.secretKeyBytes,
    };
  }

  const sourcePublicJwk = material.publicJwk;
  const thumbprintJwk = sourcePublicJwk as ThumbprintableJwk;
  const thumbprint = computeRfc7638JwkThumbprint(thumbprintJwk);
  const thumbprintUri = toJwkThumbprintSha256Urn(thumbprintJwk);
  const keyId = thumbprintUri;
  const publicJwk = {
    ...sourcePublicJwk,
    kid: keyId,
  } as PublicJwk;
  const privateMaterial = material.kind === 'classic-ec'
    ? {
      ...material.privateJwk,
      kid: keyId,
    }
    : material.secretKeyBytes;

  return {
    getMode(): JwtSignerMode {
      return mode;
    },
    getAlgorithm(): JoseSignatureAlgorithm {
      return alg;
    },
    getPurpose(): string {
      return options.purpose;
    },
    getPublicJwk(): PublicJwk {
      return publicJwk;
    },
    getPrivateMaterial(): JWKLikePrivateMaterial {
      return privateMaterial;
    },
    getKid(): string {
      return keyId;
    },
    getThumbprint(): string {
      return thumbprint;
    },
    getThumbprintUri(): string {
      return thumbprintUri;
    },
    prepareJwt(input: {
      payload: Record<string, unknown>;
      header?: Record<string, unknown>;
      typ?: string;
      kid?: string;
    }): PreparedJwtSigningInput {
      const protectedHeader = {
        alg,
        typ: input.typ ?? 'JWT',
        ...(input.header || {}),
        kid: keyId,
      };
      const prepared = prepareJwtForSignature(protectedHeader, input.payload);
      return {
        protectedHeader,
        ...prepared,
        signingBytes: prepareJwtBytesForSignature(protectedHeader, input.payload),
      };
    },
    buildCompact(signatureBase64Url: string, prepared: Pick<PreparedJwtSigningInput, 'encodedHeader' | 'encodedPayload'>): string {
      return buildJwtCompact(prepared.encodedHeader, prepared.encodedPayload, signatureBase64Url);
    },
    buildUnsignedJwt(payload: Record<string, unknown>, optionsForUnsigned?: Readonly<{ nowSeconds?: number; ttlSeconds?: number; nonce?: string }>): string {
      return buildUnsignedJwt(payload, optionsForUnsigned);
    },
  };
}
