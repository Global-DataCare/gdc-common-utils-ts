import { createHash } from 'node:crypto';
import { UrnPrefixes } from '../constants/urn';
import { PublicJwk } from '../interfaces/Cryptography.types';

/**
 * Minimal RSA public JWK shape needed for RFC 7638 thumbprint derivation.
 */
export type RsaPublicJwk = {
  kty: 'RSA';
  e: string;
  n: string;
  kid?: string;
  alg?: string;
  use?: string;
};

/**
 * Public JWK shapes supported by the RFC 7638 thumbprint helpers.
 *
 * Notes:
 * - classic EC keys are identified by `kty: 'EC'` and use `crv`, `x`, `y`
 * - this includes `secp256k1`, represented as `crv: 'secp256k1'`
 * - ML-DSA keys are represented in this codebase as `kty: 'AKP'` and use
 *   `alg` plus `pub`; they do not use `crv`
 */
export type ThumbprintableJwk = PublicJwk | RsaPublicJwk;

type BaseThumbprintJwk =
  | { kty: 'EC'; crv: string; x: string; y: string }
  | { kty: 'RSA'; e: string; n: string }
  | { kty: 'OKP'; crv: string; x: string }
  | { kty: 'AKP'; alg: string; pub: string };

function canonicalizeForThumbprint(jwk: BaseThumbprintJwk): string {
  const keys = Object.keys(jwk).sort();
  const parts = keys.map((key) => `"${key}":${JSON.stringify(jwk[key as keyof BaseThumbprintJwk])}`);
  return `{${parts.join(',')}}`;
}

function toBaseThumbprintJwk(jwk: ThumbprintableJwk): BaseThumbprintJwk {
  if (jwk.kty === 'EC') {
    const { crv, x, y } = jwk;
    if (!crv || !x || !y) throw new Error('EC JWK thumbprint requires crv, x and y.');
    return { kty: 'EC', crv, x, y };
  }
  if (jwk.kty === 'RSA') {
    const { e, n } = jwk;
    if (!e || !n) throw new Error('RSA JWK thumbprint requires e and n.');
    return { kty: 'RSA', e, n };
  }
  if (jwk.kty === 'OKP') {
    const { crv, x } = jwk;
    if (!crv || !x) throw new Error('OKP JWK thumbprint requires crv and x.');
    return { kty: 'OKP', crv, x };
  }
  if (jwk.kty === 'AKP') {
    const { alg, pub } = jwk;
    if (!alg || !pub) throw new Error('AKP JWK thumbprint requires alg and pub.');
    return { kty: 'AKP', alg, pub };
  }
  throw new Error(`Unsupported JWK kty for RFC7638 thumbprint: ${(jwk as { kty?: string }).kty || 'unknown'}`);
}

/**
 * Computes the RFC 7638 JWK thumbprint as a bare base64url string.
 *
 * Canonical fields per supported key family:
 * - `EC`: `kty`, `crv`, `x`, `y`
 * - `RSA`: `kty`, `e`, `n`
 * - `OKP`: `kty`, `crv`, `x`
 * - `AKP` / ML-DSA: `kty`, `alg`, `pub`
 *
 * For classical EC keys, the curve is taken from `crv`, so keys such as
 * `secp256k1` are handled naturally through `crv: 'secp256k1'`.
 */
export function computeRfc7638JwkThumbprint(jwk: ThumbprintableJwk): string {
  const canonical = canonicalizeForThumbprint(toBaseThumbprintJwk(jwk));
  return createHash('sha256').update(canonical).digest('base64url');
}

/**
 * Returns the RFC 9278 thumbprint URI form:
 * `urn:ietf:params:oauth:jwk-thumbprint:sha-256:<base64url>`
 */
export function toJwkThumbprintSha256Urn(jwk: ThumbprintableJwk): string {
  return `${UrnPrefixes.JwkThumbprintSha256KeyId}${computeRfc7638JwkThumbprint(jwk)}`;
}
