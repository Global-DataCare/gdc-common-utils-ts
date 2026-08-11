// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.
import { Content } from './content';
import { buildJwtCompact, prepareJwtBytesForSignature, prepareJwtForSignature } from './jwt';
import {
  ORGANIZATION_ACTIVATION_VC_TYPES,
  ORGANIZATION_CONTROLLER_ACTIVATION_VC_TYPES,
  REPRESENTATIVE_ACTIVATION_VC_TYPES,
  W3cCredentialContexts,
  W3cCredentialTypes,
} from '../constants/verifiable-credentials';
import { JoseSignatureAlgorithm } from '../constants/cryptography';

/**
 * Protected JOSE header used when assembling a compact VP JWT.
 *
 * The `alg` field is intentionally typed as a shared JOSE signature algorithm
 * instead of a free-form string so docs/tests can show the supported values
 * explicitly, including `ES256K` for secp256k1-based signers.
 */
export type VpTokenHeader = {
  alg: JoseSignatureAlgorithm;
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
    verifiableCredential: Array<string | Record<string, unknown>>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type VpCredential = Record<string, unknown>;
export type VpCredentialInput = string | Record<string, unknown>;

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

/**
 * Appends one VC entry to the VP payload.
 *
 * Accepted input forms:
 *
 * - compact VC JWT/JWS string
 * - raw JSON VC string
 * - direct VC JSON object
 *
 * Storage rule:
 *
 * - string inputs are stored as strings
 * - object inputs are stored as objects
 *
 * This keeps the builder compatible with existing compact-token flows while
 * also supporting app/runtime code that already holds the VC as parsed JSON.
 */
export function addVC(vpPayload: VpTokenPayload, vcInput: VpCredentialInput): VpTokenPayload {
  if (vcInput && typeof vcInput === 'object') {
    vpPayload.vp.verifiableCredential.push({ ...vcInput });
    return vpPayload;
  }
  const v = String(vcInput || '').trim();
  if (!v) return vpPayload;
  vpPayload.vp.verifiableCredential.push(v);
  return vpPayload;
}

/**
 * Appends many VC entries to the VP payload.
 *
 * Each entry may be:
 *
 * - compact VC JWT/JWS string
 * - raw JSON VC string
 * - direct VC JSON object
 */
export function addVCs(vpPayload: VpTokenPayload, vcs: VpCredentialInput[]): VpTokenPayload {
  for (const vc of vcs || []) addVC(vpPayload, vc);
  return vpPayload;
}

function decodeVcPayload(vc: VpCredentialInput): Record<string, unknown> | undefined {
  if (vc && typeof vc === 'object') {
    return vc;
  }
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

/**
 * Extracts the organization-controller service credential from a VP token
 * when present. It never substitutes a legal-representative credential.
 *
 * @param vpToken Compact VP token or raw JSON string.
 */
export function getOrganizationControllerCredentialFromVpToken(vpToken: string): VpCredential | undefined {
  return getVpCredentialByAnyType(vpToken, [...ORGANIZATION_CONTROLLER_ACTIVATION_VC_TYPES]);
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
  vc: VpCredentialInput,
  acceptedTypes: string[],
  label: string,
): VpTokenPayload {
  const payload = decodeVcPayload(vc);
  if (!vcHasAnyType(payload, acceptedTypes)) {
    throw new Error(`${label} VC must include one of types: ${acceptedTypes.join(', ')}`);
  }
  return addVC(vpPayload, vc);
}

/**
 * Appends an organization activation credential after validating its VC type.
 *
 * Accepts compact VC strings, raw JSON VC strings, or VC JSON objects.
 */
export function addOrganizationCredential(vpPayload: VpTokenPayload, vc: VpCredentialInput): VpTokenPayload {
  return addTypedVC(vpPayload, vc, [...ORGANIZATION_ACTIVATION_VC_TYPES], 'Organization');
}

/**
 * Appends a legal-representative activation credential after validating its VC
 * type.
 *
 * Accepts compact VC strings, raw JSON VC strings, or VC JSON objects.
 */
export function addLegalRepresentativeCredential(vpPayload: VpTokenPayload, vc: VpCredentialInput): VpTokenPayload {
  return addTypedVC(vpPayload, vc, [...REPRESENTATIVE_ACTIVATION_VC_TYPES], 'LegalRepresentative');
}

/**
 * Appends an organization-controller service credential after validating its
 * VC type independently from the legal-representative credential type.
 *
 * Accepts compact VC strings, raw JSON VC strings, or VC JSON objects.
 */
export function addOrganizationControllerCredential(
  vpPayload: VpTokenPayload,
  vc: VpCredentialInput,
): VpTokenPayload {
  return addTypedVC(
    vpPayload,
    vc,
    [...ORGANIZATION_CONTROLLER_ACTIVATION_VC_TYPES],
    'OrganizationController',
  );
}

export function prepareForSignature(header: VpTokenHeader, payload: VpTokenPayload): {
  encodedHeader: string;
  encodedPayload: string;
  signingInput: string;
} {
  return prepareJwtForSignature(header, payload);
}

/**
 * Returns the UTF-8 bytes of the canonical `base64url(header).base64url(payload)`
 * signing input.
 *
 * This is the exact byte sequence an external wallet, HSM, or KMS must sign
 * before the caller assembles the final compact VP JWT with
 * `buildVpTokenCompact(...)`.
 */
export function prepareBytesForSignature(header: VpTokenHeader, payload: VpTokenPayload): Uint8Array {
  return prepareJwtBytesForSignature(header, payload);
}

/**
 * Assembles the final compact VP JWT once the caller already has:
 *
 * - the base64url-encoded protected header
 * - the base64url-encoded VP payload
 * - the detached signature returned by the external signer, also base64url-encoded
 */
export function buildVpTokenCompact(encodedHeader: string, encodedPayload: string, signatureBase64Url: string): string {
  return buildJwtCompact(encodedHeader, encodedPayload, signatureBase64Url);
}
