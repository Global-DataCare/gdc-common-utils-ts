import { Content } from './content';

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
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
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
  return addTypedVC(vpPayload, vc, ['OrganizationCredential', 'LegalOrganizationCredential'], 'Organization');
}

export function addLegalRepresentativeCredential(vpPayload: VpTokenPayload, vc: string): VpTokenPayload {
  return addTypedVC(vpPayload, vc, ['LegalRepresentativeCredential', 'PersonCredential'], 'LegalRepresentative');
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
