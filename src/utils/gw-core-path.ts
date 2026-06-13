import type { ServiceEndpointSelector } from '../models/did';

/**
 * Minimal tenant-scoped route context required to describe one concrete GW CORE
 * resource action endpoint.
 *
 * This helper intentionally models the stable HTTP path shape instead of the
 * transport envelope. Frontend and SDK layers can use it to keep route
 * semantics explicit without handcrafting string paths inline.
 */
export type GwCoreTenantResourceActionSelector = Readonly<{
  tenantId: string;
  jurisdiction: string;
  version: string;
  sector: string;
} & Pick<ServiceEndpointSelector, 'section' | 'format' | 'resourceType' | 'action'>>;

function normalizePathSegment(value: unknown): string {
  return String(value || '').trim().replace(/^\/+|\/+$/g, '');
}

/**
 * Builds the canonical tenant-scoped GW CORE route path:
 * `/{tenantId}/cds-{jurisdiction}/{version}/{sector}/{section}/{format}/{resourceType}/{action}`
 *
 * Use this helper when tests, docs, or SDK adapters need to express the real
 * GW endpoint structure instead of ad hoc relative targets such as
 * `License/_search`.
 */
export function buildGwCoreTenantResourceActionPath(
  input: GwCoreTenantResourceActionSelector,
): string {
  return `/${normalizePathSegment(input.tenantId)}`
    + `/cds-${normalizePathSegment(input.jurisdiction)}`
    + `/${normalizePathSegment(input.version)}`
    + `/${normalizePathSegment(input.sector)}`
    + `/${normalizePathSegment(input.section)}`
    + `/${normalizePathSegment(input.format)}`
    + `/${normalizePathSegment(input.resourceType)}`
    + `/${normalizePathSegment(input.action)}`;
}
