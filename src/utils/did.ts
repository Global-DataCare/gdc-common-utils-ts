// crypto-ts/utils/did.ts
// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ServiceEndpointSelector } from "../models/did";
import { encodeMultibaseSha384 } from './multibasehash';
import { HL7_CLAIMS_CODING_SYSTEM, HL7_DEFAULT_ROLE_HEALTH } from '../constants/hl7-roles';

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
 * - All segments are lowercased, EXCEPT the final segment.
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

  // Lowercase all parts except the very last one.
  const lowercasedParts = parts.slice(0, -1).map(part => part.toLowerCase());
  let lastPart = parts[parts.length - 1];

  // Special handling for the last part if it contains a role descriptor.
  if (lastPart.includes('|')) {
    const [system, ...codeParts] = lastPart.split('|');
    const code = codeParts.join('|'); // Re-join in case the code itself has a pipe.
    lastPart = `${system.toLowerCase()}|${code}`;
  }

  return [...lowercasedParts, lastPart].join(':');
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
 * Builds the canonical hosted provider DID root used by hosted tenant services.
 *
 * Canonical form:
 * `did:web:<host.domain>:<sector>;organization:taxid:<provider-tax-id>`
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
  return `did:web:${hostDomain}:${sector};organization:taxid:${providerTaxId}`;
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
  const protocol = decodedDomain.startsWith('localhost') ? 'http' : 'https';
  
  const path = pathParts.join('/').replace(/cds-(es|us|gb)/, (match, p1) => `cds-${p1.toUpperCase()}`);

  // Ensure a trailing slash for the base URL, without double slashes when no path is present.
  const normalizedPath = path ? `${path}/` : '';
  return `${protocol}://${decodedDomain}/${normalizedPath}`;
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
 * The stable actor identifier is derived from the email using multibase(base58btc(multihash(sha384))).
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
  const memberId = encodeMultibaseSha384(normalizedEmail);
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
 * Canonical supported forms:
 * - hosted:
 *   `did:web:<host.domain>:<sector>;organization:taxid:<provider-tax-id>:individual:multibase:<individualId>`
 * - external/provider-domain:
 *   `did:web:<sector.provider.domain>:individual:multibase:<individualId>`
 *
 * Important semantics:
 * - `individualId` must be the canonical stable identity of the individual
 * - `individualId` should already be serialized in multibase form, typically
 *   `zBase58(UUID-bytes)`
 * - role is not part of the canonical individual DID; roles are only appended
 *   in member DIDs via `:member:role:<role-code-no-coding-system>`
 *
 * Backward-compatibility:
 * - `subjectId` is accepted as a legacy alias for `individualId`
 */
export function buildIndividualDidWeb(input: {
  providerDidWeb: string;
  individualId?: string;
  subjectId?: string;
}): string {
  const providerDidWeb = String(input.providerDidWeb || '').trim();
  const individualId = String(input.individualId || input.subjectId || '').trim();
  if (!providerDidWeb) throw new Error('buildIndividualDidWeb requires providerDidWeb.');
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
 * `did:web:...:individual:multibase:<individualId>:member:role:<role-code-no-coding-system>`
 *
 * The DID suffix intentionally strips coding-system prefixes because the DID is
 * a compact routing/identity string, while the full coded role still belongs in
 * the claims layer.
 */
export function buildIndividualMemberDidWeb(input: {
  individualDidWeb: string;
  role: string;
}): string {
  const individualDidWeb = String(input.individualDidWeb || '').trim();
  if (!individualDidWeb) throw new Error('buildIndividualMemberDidWeb requires individualDidWeb.');
  return [
    individualDidWeb,
    IndividualDidMarkers.Member,
    IndividualDidMarkers.Role,
    toDidMemberRoleCode(input.role),
  ].join(':');
}
