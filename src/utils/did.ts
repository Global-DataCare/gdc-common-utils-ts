// crypto-ts/utils/did.ts
// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ServiceEndpointSelector } from "../models/did";
import { multibase58MultihashSha3_256 } from './same-as';
import { HL7_CLAIMS_CODING_SYSTEM, HL7_DEFAULT_ROLE_HEALTH } from '../constants/hl7-roles';
import {
  SecureIdTypesIndividual,
  type SecureIdTypeIndividual,
} from '../constants/identity-identifiers';
import { normalizePhone } from './consent';
import { encodeMultibaseSha3 } from './multibasehash';

/**
 * Canonical DID path markers for hosted/provider individual identities.
 *
 * These markers are intentionally centralized because both SDKs and backend
 * repositories parse them heuristically in tests and route helpers.
 */
export const IndividualDidMarkers = {
  Individual: 'individual',
  Multibase: 'multibase',
  Member: 'member',
  Role: 'role',
} as const;

const UUID_VALUE_PATTERN = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
const MULTIBASE_SHA3_384_PATTERN = /^z[1-9A-HJ-NP-Za-km-z]+$/;

/**
 * Builds the privacy-preserving value used by a hosted individual DID.
 *
 * Wire profile: `multibase(base58btc(multihash(SHA3-384, canonical-bytes)))`.
 * The returned value is the bare `z...` path token, not an
 * `urn:multibase:...` value and not a CID.
 *
 * Canonical inputs:
 * - `UUID`: remove hyphens, interpret the 32 hexadecimal digits as the UUID's
 *   canonical 16 bytes, then hash those bytes;
 * - `EMAIL`: remove `mailto:`, whitespace and letter-case differences;
 * - `PHONE`: remove `tel:` and normalize the number through the shared phone
 *   normalizer (including its E.164 leading `+` when supplied);
 * - HL7 v2-0203 and other governed private identifiers: NFKC-normalized,
 *   trimmed, upper-case UTF-8 text. Their type and jurisdiction remain
 *   separate governed fields and are never inferred from the value.
 */
function buildSecureIdValue(typeInput: SecureIdTypeIndividual | string, valueInput: string, context: string): string {
  const type = String(typeInput || '').trim().toUpperCase();
  const rawValue = String(valueInput || '').trim();
  if (!type) throw new Error(`${context} requires a secure identifier type.`);
  if (!rawValue) throw new Error(`${context} requires a private identifier value.`);
  if (type === SecureIdTypesIndividual.Uuid) {
    if (!UUID_VALUE_PATTERN.test(rawValue)) {
      throw new Error(`${context} requires a hexadecimal UUID value.`);
    }
    const hex = rawValue.replace(/-/g, '').toLowerCase();
    const bytes = new Uint8Array(16);
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
    }
    return encodeMultibaseSha3(bytes, 384);
  }

  const canonicalText = type === SecureIdTypesIndividual.Email
    ? rawValue.replace(/^mailto:/i, '').replace(/\s+/g, '').toLowerCase()
    : type === SecureIdTypesIndividual.Phone
      ? normalizePhone(rawValue.replace(/^tel:/i, ''))
      : rawValue.normalize('NFKC').toUpperCase();
  if (!canonicalText) throw new Error(`${context} requires a valid ${type} value.`);
  return encodeMultibaseSha3(canonicalText, 384);
}

export function buildSecureIdValueIndividual(input: {
  secureIdTypeIndividual: SecureIdTypeIndividual | string;
  privateIdValueIndividual: string;
}): string {
  return buildSecureIdValue(
    input.secureIdTypeIndividual,
    input.privateIdValueIndividual,
    'buildSecureIdValueIndividual',
  );
}

/**
 * Builds the same SHA3-384 multihash path value for the private identifier of
 * an individual member/controller. The member and represented individual
 * remain distinct inputs even when both refer to the same natural person.
 */
export function buildSecureIdValueMember(input: {
  secureIdTypeMember: SecureIdTypeIndividual | string;
  privateIdValueMember: string;
}): string {
  return buildSecureIdValue(
    input.secureIdTypeMember,
    input.privateIdValueMember,
    'buildSecureIdValueMember',
  );
}

/**
 * Removes any coding-system prefix from a role claim when building a member DID.
 *
 * Example:
 * - `v3-RoleCode|RESPRSN` -> `RESPRSN`
 * - `ISCO-08|2211` -> `2211`
 * - `ONESELF` -> `ONESELF`
 */
export function toDidMemberRoleCode(role: string): string {
  const normalized = String(role || '').trim();
  if (!normalized) throw new Error('toDidMemberRoleCode requires role.');
  const parts = normalized.split('|');
  return String(parts[parts.length - 1] || '').trim();
}

/**
 * Generates a DID Service ID fragment from a selector object.
 * The format is always `#<section>:<format>:<resourceType>:<action>`.
 *
 * This utility's only job is to correctly assemble the string. It contains no
 * conditional logic about DID types, as that is handled by the data layer.
 *
 * @param selector The structured object containing the endpoint parts.
 * @returns The formatted service ID fragment string.
 */
export function generateServiceId(selector: ServiceEndpointSelector): string {
  // Canonical casing:
  // - `section`, `format`, `resourceType` are matched case-insensitively by the backend router,
  //   and lowercasing them makes DID Document lookup deterministic across SDKs.
  // - `action` is kept as-is (future actions may be case-sensitive identifiers).
  const parts = [
    selector.section?.toLowerCase(),
    selector.format?.toLowerCase(),
    selector.resourceType?.toLowerCase(),
    selector.action,
  ];
  
  return `#${parts.filter(p => p).join(':')}`;
}

/**
 * Normalizes a did:web string to a canonical format to prevent resolution errors
 * due to case sensitivity in the path component of the underlying URL.
 *
 * The rule is:
 * - The DNS authority and ordinary non-final path segments are lowercased.
 * - A hosted VAT tenant segment is uppercased (`vates-b...` -> `VATES-B...`).
 * - A `cds-<jurisdiction>` segment uses an uppercase ISO jurisdiction.
 * - The final segment is preserved.
 * - If the final segment represents a `system|code` pair (e.g., for a role),
 *   the `system` part is lowercased, but the `code` is preserved as-is.
 * - If the final segment is a unique identifier (like a Tax ID), it is preserved as-is.
 *
 * @param did The did:web string to normalize.
 * @returns The canonicalized did:web string.
 */
export function normalizeDidWeb(did: string): string {
  const parts = did.split(':');
  if (parts[0] !== 'did' || parts[1] !== 'web' || parts.length < 3) {
    // Not a valid did:web, return as is.
    return did;
  }

  const lastIndex = parts.length - 1;
  return parts.map((part, index) => {
    if (index < 2) return part.toLowerCase();
    if (index === 2) return part.toLowerCase().replace(/%3a/gi, '%3A');

    // Hosted tenant identifiers use the canonical VAT + ISO country prefix.
    // Keep this deliberately narrow so unrelated opaque DID path identifiers
    // are not modified merely because they contain the letters "vat".
    if (/^vat[a-z]{2}[-a-z0-9._]+$/i.test(part)) {
      return part.toUpperCase();
    }

    const jurisdictionMatch = /^cds-([a-z]{2})$/i.exec(part);
    if (jurisdictionMatch) {
      return `cds-${jurisdictionMatch[1].toUpperCase()}`;
    }

    if (index === lastIndex) {
      if (!part.includes('|')) return part;
      const [system, ...codeParts] = part.split('|');
      return `${system.toLowerCase()}|${codeParts.join('|')}`;
    }

    return part.toLowerCase();
  }).join(':');
}

/**
* Encodes a hostname according to did:web spec (percent-encodes port colons).
* @param apiUrl The full base URL of the API.
* @returns The percent-encoded hostname.
*/
function getEncodedHost(apiUrl: string): string {
  try {
    const parsedUrl = new URL(apiUrl);
    return parsedUrl.host.replace(':', '%3A');
  } catch (e) {
    console.error(`[getEncodedHost] Invalid apiUrl provided: ${apiUrl}`);
    return 'localhost'; // Fallback
  }
}

/**
* Creates the deterministic "hosted" did:web for a tenant (Organization).
*
* @param hostDidWeb The DID of the host (e.g., 'did:web:host.example.com').
 * @param tenantId Canonical tenant identifier (for example a tax-ID based tenant id).
* @param context An object containing jurisdiction, version, and sector.
* @returns The tenant's full, correctly formatted hosted did:web.
*          Example: 'did:web:host.example.com:acme:cds-es:v1:health-care'
*/
export function createHostedDidWeb(
  hostDidWeb: string,
  tenantId: string,
  context: { jurisdiction: string; version: string; sector: string }
): string {
  const hostPart = hostDidWeb.replace(/^did:web:/, '');
  // The path in a did:web uses colons as separators.
  const didPath = `cds-${context.jurisdiction}:${context.version}:${context.sector}`;
  return `did:web:${hostPart}:${tenantId}:${didPath}`;
}

/**
 * Extracts the tenant identifier from one hosted `did:web`.
 *
 * This is a compatibility helper for places that still receive a full hosted
 * DID where a route tenant id is expected. It only returns the tenant segment
 * used by the hosted organization form.
 */
export function extractTenantIdFromHostedDidWeb(did: string): string | undefined {
  const normalizedDid = String(did || '').trim();
  if (!normalizedDid.startsWith('did:web:')) {
    return undefined;
  }
  const didParts = normalizedDid.slice('did:web:'.length).split(':');
  if (didParts.length < 2) {
    return undefined;
  }
  const tenantId = String(didParts[1] || '').trim();
  if (!tenantId || /^cds-/i.test(tenantId)) {
    return undefined;
  }
  return decodeURIComponent(tenantId);
}

/**
 * Builds the canonical hosted organization DID from the official identifier
 * vocabulary governed by the selected data space.
 *
 * The identifier type is a path token such as `taxID`, `VAT`, or `BN`; this
 * helper normalizes only that token and never guesses a type by parsing the
 * identifier value. The corresponding FHIR Organization must retain the same
 * type and value in `Organization.identifier`.
 */
export function buildHostedOrganizationDidWeb(input: {
  hostDomain: string;
  sector: string;
  officialIdentifierType: string;
  officialIdentifierValue: string;
}): string {
  const hostDomain = String(input.hostDomain || '').trim().toLowerCase();
  const sector = String(input.sector || '').trim().toLowerCase();
  const identifierType = String(input.officialIdentifierType || '').trim().toLowerCase();
  const identifierValue = String(input.officialIdentifierValue || '').trim();
  if (!hostDomain) throw new Error('buildHostedOrganizationDidWeb requires hostDomain.');
  if (!sector) throw new Error('buildHostedOrganizationDidWeb requires sector.');
  if (!/^[a-z][a-z0-9._-]*$/.test(identifierType)) {
    throw new Error('buildHostedOrganizationDidWeb requires a canonical officialIdentifierType path token.');
  }
  if (!identifierValue || /[:/\s]/.test(identifierValue)) {
    throw new Error('buildHostedOrganizationDidWeb requires one DID-path-safe officialIdentifierValue.');
  }
  return `did:web:${hostDomain}:${sector}:organization:${identifierType}:${identifierValue}`;
}

/**
 * Builds the canonical hosted provider DID root used by hosted tenant services.
 *
 * Canonical form:
 * `did:web:<host.domain>:<sector>:organization:taxid:<provider-tax-id>`
 *
 * This is the provider-scoped DID root under which hosted individual and member
 * identities are published. Downstream individual DIDs extend this root with
 * `:individual:multibase:<individualId>`.
 */
export function buildHostedProviderDidWeb(input: {
  hostDomain: string;
  sector: string;
  providerTaxId: string;
}): string {
  const hostDomain = String(input.hostDomain || '').trim().toLowerCase();
  const sector = String(input.sector || '').trim().toLowerCase();
  const providerTaxId = String(input.providerTaxId || '').trim();
  if (!hostDomain) throw new Error('buildHostedProviderDidWeb requires hostDomain.');
  if (!sector) throw new Error('buildHostedProviderDidWeb requires sector.');
  if (!providerTaxId) throw new Error('buildHostedProviderDidWeb requires providerTaxId.');
  return buildHostedOrganizationDidWeb({
    hostDomain,
    sector,
    officialIdentifierType: 'taxid',
    officialIdentifierValue: providerTaxId,
  });
}

/**
 * Builds the canonical public provider DID root used by an external provider domain.
 *
 * Canonical form:
 * `did:web:<sector.provider.domain>`
 *
 * This is the external DID root that may later publish hosted DID artifacts for
 * the same subject identity.
 */
export function buildProviderSectorDidWeb(input: {
  providerSectorDomain: string;
}): string {
  const providerSectorDomain = String(input.providerSectorDomain || '').trim().toLowerCase();
  if (!providerSectorDomain) throw new Error('buildProviderSectorDidWeb requires providerSectorDomain.');
  return `did:web:${providerSectorDomain}`;
}


/**
 * Builds the canonical details (URL and did:web URN) for a hosted DID.
 * This is the single source of truth for constructing hosted identifiers in the app.
 *
 * @param options An object with the components of the DID.
 * @param options.host The provider's domain (e.g., 'provider.com').
 * @param options.tenantId The canonical tenant identifier.
 * @param options.alternateName Deprecated legacy alias kept only for backward compatibility.
 * @param options.jurisdiction The legal jurisdiction (defaults to 'ES').
 * @param options.sector The business sector (defaults to 'health-care').
 * @returns An object with the full URL (with trailing /) and the canonical did:web.
 */
export function buildHostedDidDetails({
  host,
  tenantId,
  alternateName,
  jurisdiction = 'ES',
  sector = 'health-care',
}: {
  host: string;
  tenantId?: string;
  alternateName: string;
  jurisdiction?: string;
  sector?: string;
}) {
  const resolvedTenantId = String(tenantId || alternateName || '').trim();
  if (!resolvedTenantId) {
    throw new Error('buildHostedDidDetails requires tenantId.');
  }
  // 1. Build the path part of the DID/URL.
  const pathPart = `${resolvedTenantId}/cds-${jurisdiction}/v1/${sector}`;
  
  // 2. Build the full URL, ensuring a trailing slash.
  const url = `https://${host}/${pathPart}/`;
  
  // 3. Build the canonical did:web, replacing / with :.
  const hostAndPath = `${host}/${pathPart}`;
  const did = `did:web:${hostAndPath.replace(/\//g, ':')}`;
  
  return { did, url };
}

/**
* Converts a did:web identifier into a full HTTPS or HTTP base URL with a trailing slash.
* It correctly decodes percent-encoded ports for local development.
* @param did The did:web string (e.g., 'did:web:example.com' or 'did:web:localhost%3A3000:acme:cds-es:v1:health-care').
* @returns The full base URL (e.g., 'https://example.com/acme/cds-es/v1/health-care/').
*/
export function getBaseUrlFromDidWeb(did: string): string {
  const didParts = did.replace(/^did:web:/, '').split(':');
  const domainPart = didParts[0];
  const pathParts = didParts.slice(1);
  
  const decodedDomain = decodeURIComponent(domainPart);
  const protocol = isLoopbackDidWebAuthority(decodedDomain) ? 'http' : 'https';
  
  const path = pathParts.join('/').replace(/cds-(es|us|gb)/, (match, p1) => `cds-${p1.toUpperCase()}`);

  // Ensure a trailing slash for the base URL, without double slashes when no path is present.
  const normalizedPath = path ? `${path}/` : '';
  return `${protocol}://${decodedDomain}/${normalizedPath}`;
}

/** Keeps local did:web discovery usable without weakening non-loopback HTTPS. */
function isLoopbackDidWebAuthority(authority: string): boolean {
  try {
    const hostname = new URL(`http://${authority}`).hostname.toLowerCase().replace(/^\[|\]$/g, '');
    return hostname === 'localhost'
      || hostname.endsWith('.localhost')
      || hostname === '::1'
      || /^127(?:\.\d{1,3}){3}$/.test(hostname);
  } catch {
    return false;
  }
}

/**
 * Builds the canonical hosted organization/tenant DID in the data space.
 *
 * This is a semantic alias over `createHostedDidWeb(...)` for callers that want
 * the API name to reflect the organization role more explicitly.
 *
 * @param input.hostDidWeb Host/provider DID root such as `did:web:api.example.org`.
 * @param input.tenantId Canonical tenant identifier used in the data space. In
 * new integrations this should be the real tenant ID, typically tax-ID based.
 * @param input.tenantAlternateName Deprecated legacy alias kept only for backward compatibility.
 * @param input.jurisdiction Jurisdiction segment used in the hosted DID path.
 * @param input.version API/version segment. Defaults to `v1`.
 * @param input.sector Functional data-space sector such as `health-care`.
 */
export function buildOrganizationDidWeb(input: {
  hostDidWeb: string;
  tenantId?: string;
  tenantAlternateName?: string;
  jurisdiction: string;
  version?: string;
  sector: string;
}): string {
  const tenantId = String(input.tenantId || input.tenantAlternateName || '').trim();
  if (!tenantId) throw new Error('buildOrganizationDidWeb requires tenantId.');
  return createHostedDidWeb(input.hostDidWeb, tenantId, {
    jurisdiction: input.jurisdiction,
    version: input.version || 'v1',
    sector: input.sector,
  });
}

/**
 * Builds a professional/member DID under a hosted organization DID.
 *
 * The stable actor path identifier is derived from the lower-cased email using
 * multibase(base58btc(multihash(SHA3-256))). The raw email is never embedded
 * in the DID.
 *
 * This is the same multibase payload used by the ICA-compatible credential
 * `sameAs`; only the representation differs: the DID path uses `z...` and the
 * credential alias uses `urn:multibase:z...`.
 *
 * @param input.organizationDidWeb Canonical hosted organization DID.
 * @param input.email Professional email used to derive a stable member identifier.
 * @param input.role Canonical role code such as `ISCO-08|2211`.
 * @param input.deviceId Optional per-device suffix for device-bound identities.
 */
export function buildProfessionalDidWeb(input: {
  organizationDidWeb: string;
  email: string;
  role: string;
  deviceId?: string;
}): string {
  const normalizedEmail = String(input.email || '').trim().toLowerCase();
  const role = String(input.role || '').trim();
  if (!normalizedEmail) throw new Error('buildProfessionalDidWeb requires email.');
  if (!role) throw new Error('buildProfessionalDidWeb requires role.');
  const memberId = multibase58MultihashSha3_256(normalizedEmail);
  return [
    String(input.organizationDidWeb).trim(),
    'employee',
    memberId,
    role,
    input.deviceId ? String(input.deviceId).trim() : undefined,
  ].filter(Boolean).join(':');
}

/**
 * Builds the canonical individual DID under either a hosted-provider DID root
 * or an external provider-sector DID root.
 *
 * Canonical hosted form:
 * `did:web:<provider-path>:individual:<secureIdTypeIndividual>:<secureIdValueIndividual>`
 *
 * Important semantics:
 * - the type remains an explicit upper-case path token such as `UUID`, `DL`,
 *   `PPN`, `EMAIL`, or `PHONE`;
 * - the value is always the one-way SHA3-384 multihash built by
 *   `buildSecureIdValueIndividual`, never the private identifier in plain text;
 * - role is not part of the individual DID.
 *
 * Backward-compatibility:
 * - `subjectId` is accepted as a legacy alias for `individualId`
 */
export function buildIndividualDidWeb(input: {
  providerDidWeb: string;
  secureIdTypeIndividual?: SecureIdTypeIndividual | string;
  secureIdValueIndividual?: string;
  /** @deprecated Use `secureIdTypeIndividual` plus `secureIdValueIndividual`. */
  individualId?: string;
  /** @deprecated Use `secureIdTypeIndividual` plus `secureIdValueIndividual`. */
  subjectId?: string;
}): string {
  const providerDidWeb = String(input.providerDidWeb || '').trim();
  const secureIdTypeIndividual = String(input.secureIdTypeIndividual || '').trim().toUpperCase();
  const secureIdValueIndividual = String(input.secureIdValueIndividual || '').trim();
  const individualId = String(input.individualId || input.subjectId || '').trim();
  if (!providerDidWeb) throw new Error('buildIndividualDidWeb requires providerDidWeb.');
  if (secureIdTypeIndividual || secureIdValueIndividual) {
    if (!secureIdTypeIndividual || !secureIdValueIndividual) {
      throw new Error('buildIndividualDidWeb requires both secure individual id type and value.');
    }
    if (!MULTIBASE_SHA3_384_PATTERN.test(secureIdValueIndividual)) {
      throw new Error('buildIndividualDidWeb requires secureIdValueIndividual as bare multibase base58btc.');
    }
    return [
      providerDidWeb,
      IndividualDidMarkers.Individual,
      secureIdTypeIndividual,
      secureIdValueIndividual,
    ].join(':');
  }
  if (!individualId) throw new Error('buildIndividualDidWeb requires individualId.');
  return [
    providerDidWeb,
    IndividualDidMarkers.Individual,
    IndividualDidMarkers.Multibase,
    individualId,
  ].filter(Boolean).join(':');
}

/**
 * Builds the canonical member DID under an individual DID.
 *
 * Canonical form:
 * `did:web:...:individual:<type>:<secure-value>:member:<secure-member-value>:<role-value>`
 *
 * `roleType` is mandatory input so callers cannot accidentally lose the coded
 * role semantics. Only `roleValue` is serialized in the DID because the full
 * FHIR token (`system|value`) remains in the protected claims/licence layer.
 */
export function buildIndividualMemberDidWeb(input: {
  individualDidWeb: string;
  memberId?: string;
  roleType?: string;
  roleValue?: string;
  /** @deprecated Use `roleType` plus `roleValue`. */
  role?: string;
}): string {
  const individualDidWeb = String(input.individualDidWeb || '').trim();
  if (!individualDidWeb) throw new Error('buildIndividualMemberDidWeb requires individualDidWeb.');
  const memberId = String(input.memberId || '').trim();
  const roleType = String(input.roleType || '').trim();
  const roleValue = String(input.roleValue || '').trim();
  if (memberId || roleType || roleValue) {
    if (!MULTIBASE_SHA3_384_PATTERN.test(memberId)) {
      throw new Error('buildIndividualMemberDidWeb requires memberId as bare multibase base58btc.');
    }
    if (!roleType || !roleValue) {
      throw new Error('buildIndividualMemberDidWeb requires both roleType and roleValue.');
    }
    return [individualDidWeb, IndividualDidMarkers.Member, memberId, roleValue].join(':');
  }
  return [
    individualDidWeb,
    IndividualDidMarkers.Member,
    IndividualDidMarkers.Role,
    toDidMemberRoleCode(String(input.role || '')),
  ].join(':');
}

/**
 * Builds a complete hosted individual-member DID directly from the private
 * identifiers already held by an authorized BFF.
 *
 * This is the integration helper for portals: the provider DID returned by GW,
 * the individual's private UUID or other governed identifier, the logged-in
 * member's email/phone/private identifier, and the protected role type/value
 * are sufficient. Neither private identifier is serialized in the result.
 */
export function buildIndividualMemberDidWebFromPrivateIdentifiers(input: {
  providerDidWeb: string;
  secureIdTypeIndividual: SecureIdTypeIndividual | string;
  privateIdValueIndividual: string;
  secureIdTypeMember: SecureIdTypeIndividual | string;
  privateIdValueMember: string;
  roleType: string;
  roleValue: string;
}): string {
  const individualDidWeb = buildIndividualDidWeb({
    providerDidWeb: input.providerDidWeb,
    secureIdTypeIndividual: input.secureIdTypeIndividual,
    secureIdValueIndividual: buildSecureIdValueIndividual({
      secureIdTypeIndividual: input.secureIdTypeIndividual,
      privateIdValueIndividual: input.privateIdValueIndividual,
    }),
  });
  return buildIndividualMemberDidWeb({
    individualDidWeb,
    memberId: buildSecureIdValueMember({
      secureIdTypeMember: input.secureIdTypeMember,
      privateIdValueMember: input.privateIdValueMember,
    }),
    roleType: input.roleType,
    roleValue: input.roleValue,
  });
}

/**
 * Parses one hosted individual-member DID without interpreting its role value
 * as authorization. The complete role system and value must still be checked
 * against the protected licence or credential by the consuming gateway.
 */
export function parseIndividualMemberDidWeb(didWeb: string): {
  individualDidWeb: string;
  memberId: string;
  roleValue: string;
} {
  const candidate = String(didWeb || '').trim();
  const marker = `:${IndividualDidMarkers.Member}:`;
  const markerOffset = candidate.lastIndexOf(marker);
  if (!candidate.startsWith('did:web:') || markerOffset < 0) {
    throw new Error('Invalid hosted individual member DID.');
  }
  const individualDidWeb = candidate.slice(0, markerOffset);
  const suffix = candidate.slice(markerOffset + marker.length).split(':');
  const [memberId, roleValue, ...unexpected] = suffix;
  if (!individualDidWeb.includes(`:${IndividualDidMarkers.Individual}:`)
    || unexpected.length > 0
    || !MULTIBASE_SHA3_384_PATTERN.test(String(memberId || ''))
    || !String(roleValue || '').trim()) {
    throw new Error('Invalid hosted individual member DID.');
  }
  return { individualDidWeb, memberId, roleValue };
}
