// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.
import { Content } from './content';
import {
  ORGANIZATION_ACTIVATION_VC_TYPES,
  REPRESENTATIVE_ACTIVATION_VC_TYPES,
  W3cCredentialContexts,
  W3cCredentialTypes,
} from '../constants/verifiable-credentials';

export type VpTokenHeader = {
  alg: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
};

export type VpTokenPayload = {
  iss: string;
  sub?: string;
  aud?: string;
  jti?: string;
  iat?: number;
  exp?: number;
  nonce?: string;
  vp: {
    '@context'?: unknown;
    type?: unknown;
    holder?: string;
    verifiableCredential: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type VpCredential = Record<string, unknown>;

function fallbackId(): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `id-${Date.now()}-${rand}`;
}

export function generateUuidLike(): string {
  const fn = (globalThis as any)?.crypto?.randomUUID;
  if (typeof fn === 'function') return fn.call((globalThis as any).crypto);
  return fallbackId();
}

export function buildEpochWindow(ttlSeconds = 300): { iat: number; exp: number } {
  const iat = Math.floor(Date.now() / 1000);
  return { iat, exp: iat + Math.max(1, Math.floor(ttlSeconds)) };
}

export function createVP(input?: Partial<VpTokenPayload>): VpTokenPayload {
  const ttl = input?.exp && input?.iat ? undefined : buildEpochWindow(300);
  const jti = input?.jti || generateUuidLike();
  const nonce = input?.nonce || generateUuidLike();
  const base: VpTokenPayload = {
    iss: String(input?.iss || ''),
    sub: input?.sub,
    aud: input?.aud,
    jti,
    iat: input?.iat ?? ttl?.iat,
    exp: input?.exp ?? ttl?.exp,
    nonce,
    vp: {
      '@context': [W3cCredentialContexts.V1],
      type: [W3cCredentialTypes.VerifiablePresentation],
      holder: input?.vp?.holder || input?.iss || '',
      verifiableCredential: [],
      ...(input?.vp || {}),
    },
  };
  return base;
}

export function addVC(vpPayload: VpTokenPayload, vcJwt: string): VpTokenPayload {
  const v = String(vcJwt || '').trim();
  if (!v) return vpPayload;
  vpPayload.vp.verifiableCredential.push(v);
  return vpPayload;
}

export function addVCs(vpPayload: VpTokenPayload, vcs: string[]): VpTokenPayload {
  for (const vc of vcs || []) addVC(vpPayload, vc);
  return vpPayload;
}

function decodeVcPayload(vc: string): Record<string, unknown> | undefined {
  const raw = String(vc || '').trim();
  if (!raw) return undefined;
  if (raw.startsWith('{')) {
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : undefined;
    } catch {
      return undefined;
    }
  }
  const parts = raw.split('.');
  if (parts.length !== 3 || !parts[1]) return undefined;
  try {
    const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
    const parsed = JSON.parse(payloadJson);
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Decodes a compact VP token payload into a JSON object.
 *
 * Supports either a raw JSON string payload or a compact JWT/JWS token.
 *
 * @param vpToken Compact VP token or raw JSON string.
 */
export function decodeVpTokenPayload(vpToken: string): VpTokenPayload | undefined {
  const raw = String(vpToken || '').trim();
  if (!raw) return undefined;
  if (raw.startsWith('{')) {
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed as VpTokenPayload : undefined;
    } catch {
      return undefined;
    }
  }
  const parts = raw.split('.');
  if (parts.length !== 3 || !parts[1]) return undefined;
  try {
    const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
    const parsed = JSON.parse(payloadJson);
    return parsed && typeof parsed === 'object' ? parsed as VpTokenPayload : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Extracts decoded VC objects from a VP token.
 *
 * VCs may be embedded as compact JWT/JWS strings, raw JSON strings, or direct
 * objects inside `vp.verifiableCredential`.
 *
 * @param vpToken Compact VP token or raw JSON string.
 */
export function getVpCredentials(vpToken: string): VpCredential[] {
  const payload = decodeVpTokenPayload(vpToken);
  const vcs = payload?.vp?.verifiableCredential;
  if (!Array.isArray(vcs)) return [];
  return vcs
    .map((candidate) => {
      if (candidate && typeof candidate === 'object') {
        return candidate as VpCredential;
      }
      if (typeof candidate === 'string') {
        return decodeVcPayload(candidate);
      }
      return undefined;
    })
    .filter((candidate): candidate is VpCredential => Boolean(candidate && typeof candidate === 'object'));
}

/**
 * Returns the first decoded VC in a VP token whose `type` includes any of the
 * accepted credential types.
 *
 * @param vpToken Compact VP token or raw JSON string.
 * @param acceptedTypes Accepted VC types such as `OrganizationCredential`.
 */
export function getVpCredentialByAnyType(vpToken: string, acceptedTypes: string[]): VpCredential | undefined {
  return getVpCredentials(vpToken).find((credential) => vcHasAnyType(credential, acceptedTypes));
}

/**
 * Extracts the organization credential from a VP token when present.
 *
 * @param vpToken Compact VP token or raw JSON string.
 */
export function getOrganizationCredentialFromVpToken(vpToken: string): VpCredential | undefined {
  return getVpCredentialByAnyType(vpToken, [...ORGANIZATION_ACTIVATION_VC_TYPES]);
}

/**
 * Extracts the legal representative credential from a VP token when present.
 *
 * @param vpToken Compact VP token or raw JSON string.
 */
export function getLegalRepresentativeCredentialFromVpToken(vpToken: string): VpCredential | undefined {
  return getVpCredentialByAnyType(vpToken, [...REPRESENTATIVE_ACTIVATION_VC_TYPES]);
}

function vcHasAnyType(vcPayload: Record<string, unknown> | undefined, acceptedTypes: string[]): boolean {
  if (!vcPayload) return false;
  const typeRaw =
    (vcPayload as any)?.type
    ?? (vcPayload as any)?.vc?.type
    ?? (vcPayload as any)?.credential?.type;
  const types = Array.isArray(typeRaw) ? typeRaw.map(String) : [String(typeRaw || '')];
  return acceptedTypes.some((t) => types.includes(t));
}

function addTypedVC(
  vpPayload: VpTokenPayload,
  vc: string,
  acceptedTypes: string[],
  label: string,
): VpTokenPayload {
  const payload = decodeVcPayload(vc);
  if (!vcHasAnyType(payload, acceptedTypes)) {
    throw new Error(`${label} VC must include one of types: ${acceptedTypes.join(', ')}`);
  }
  return addVC(vpPayload, vc);
}

export function addOrganizationCredential(vpPayload: VpTokenPayload, vc: string): VpTokenPayload {
  return addTypedVC(vpPayload, vc, [...ORGANIZATION_ACTIVATION_VC_TYPES], 'Organization');
}

export function addLegalRepresentativeCredential(vpPayload: VpTokenPayload, vc: string): VpTokenPayload {
  return addTypedVC(vpPayload, vc, [...REPRESENTATIVE_ACTIVATION_VC_TYPES], 'LegalRepresentative');
}

export function prepareForSignature(header: VpTokenHeader, payload: VpTokenPayload): {
  encodedHeader: string;
  encodedPayload: string;
  signingInput: string;
} {
  const encodedHeader = Content.objectToRawBase64UrlSafe(header);
  const encodedPayload = Content.objectToRawBase64UrlSafe(payload);
  return {
    encodedHeader,
    encodedPayload,
    signingInput: `${encodedHeader}.${encodedPayload}`,
  };
}

export function prepareBytesForSignature(header: VpTokenHeader, payload: VpTokenPayload): Uint8Array {
  const { signingInput } = prepareForSignature(header, payload);
  return new TextEncoder().encode(signingInput);
}

export function buildVpTokenCompact(encodedHeader: string, encodedPayload: string, signatureBase64Url: string): string {
  return `${encodedHeader}.${encodedPayload}.${String(signatureBase64Url || '').trim()}`;
}
