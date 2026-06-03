import { ClaimsPersonSchemaorg } from '../constants/schemaorg';
import {
  buildFhirParametersResourceFromSearchParams,
  buildSearchQueryString,
  SearchParameterPrimitive,
  SearchRequestEncoding,
} from './fhir-search';

export type EmployeeClaims = Record<string, unknown>;

export type EmployeeSearchValue = SearchParameterPrimitive;

export type EmployeeDraftInput = Readonly<{
  identifier?: string;
  email?: string;
  role?: string;
  worksFor?: string;
  memberOf?: string;
  memberOfOrgTaxId?: string;
  additionalClaims?: EmployeeClaims;
}>;

export type EmployeeBatchMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type EmployeeBatchEntryInput = Readonly<{
  method: EmployeeBatchMethod;
  claims: EmployeeClaims;
  resourceId?: string;
  resourceType?: 'Employee';
  type?: string;
}>;

export type EmployeeSearchBundleInput = Readonly<{
  claims?: Record<string, EmployeeSearchValue | undefined>;
  method?: 'GET' | 'POST';
  encoding?: SearchRequestEncoding;
  resourceType?: 'Employee';
}>;

function cloneClaims(claims?: EmployeeClaims): EmployeeClaims {
  return { ...(claims || {}) };
}

function inferEmployeeEntryType(method: EmployeeBatchMethod): string {
  switch (method) {
    case 'DELETE':
      return 'Employee-delete-request-v1.0';
    case 'PUT':
    case 'PATCH':
      return 'Employee-update-request-v1.0';
    case 'GET':
      return 'Employee-search-request-v1.0';
    case 'POST':
    default:
      return 'Employee-create-request-v1.0';
  }
}

/**
 * Builds canonical `org.schema.Person.*` employee claims from semantic input.
 */
export function buildEmployeeClaims(input: EmployeeDraftInput): EmployeeClaims {
  const claims: EmployeeClaims = {
    '@context': 'org.schema',
    ...cloneClaims(input.additionalClaims),
  };

  if (typeof input.identifier === 'string' && input.identifier.trim()) {
    claims[ClaimsPersonSchemaorg.identifier] = input.identifier.trim();
  }
  if (typeof input.email === 'string' && input.email.trim()) {
    claims[ClaimsPersonSchemaorg.email] = input.email.trim();
  }
  if (typeof input.role === 'string' && input.role.trim()) {
    claims[ClaimsPersonSchemaorg.hasOccupationalRoleValue] = input.role.trim();
  }
  if (typeof input.worksFor === 'string' && input.worksFor.trim()) {
    claims[ClaimsPersonSchemaorg.worksFor] = input.worksFor.trim();
  }
  if (typeof input.memberOf === 'string' && input.memberOf.trim()) {
    claims[ClaimsPersonSchemaorg.memberOf] = input.memberOf.trim();
  }
  if (typeof input.memberOfOrgTaxId === 'string' && input.memberOfOrgTaxId.trim()) {
    claims[ClaimsPersonSchemaorg.memberOfOrgTaxId] = input.memberOfOrgTaxId.trim();
  }

  return claims;
}

/**
 * Builds a claims-first employee batch entry from the minimum semantic input.
 *
 * Callers only provide the operation method, employee claims, and optional
 * resource id. The helper places claims in the canonical `resource.meta.claims`
 * location and infers the business `type` internally.
 */
export function buildEmployeeBatchEntry(input: EmployeeBatchEntryInput): {
  type: string;
  request: { method: EmployeeBatchMethod };
  resource: { resourceType: 'Employee'; id?: string; meta: { claims: EmployeeClaims } };
} {
  const claims = cloneClaims(input.claims);
  const resourceType = input.resourceType || 'Employee';

  return {
    type: input.type || inferEmployeeEntryType(input.method),
    request: { method: input.method },
    resource: {
      resourceType,
      ...(input.resourceId ? { id: input.resourceId } : {}),
      meta: { claims },
    },
  };
}

/**
 * Builds the legacy query-string employee search target kept for compatibility
 * with older `_search` wrappers.
 */
export function buildEmployeeSearchQuery(input: EmployeeSearchBundleInput = {}): string {
  const resourceType = input.resourceType || 'Employee';
  const query = buildSearchQueryString(input.claims || {});
  return query ? `${resourceType}?${query}` : resourceType;
}

/**
 * Builds a canonical employee search bundle.
 *
 * Defaults to `POST + Parameters`. Set `method` or `encoding` to legacy GET
 * only when talking to older search consumers.
 */
export function buildEmployeeSearchBundle(input: EmployeeSearchBundleInput = {}): {
  resourceType: 'Bundle';
  type: 'batch';
  entry: Array<{
    request: {
      method: 'GET' | 'POST';
      url: string;
    };
    resource?: {
      resourceType: 'Parameters';
      parameter: Array<Record<string, unknown>>;
    };
  }>;
} {
  const resourceType = input.resourceType || 'Employee';
  const claims = input.claims || {};
  const method = input.method || (input.encoding === 'get-query' ? 'GET' : 'POST');

  if (method === 'GET') {
    return {
      resourceType: 'Bundle',
      type: 'batch',
      entry: [
        {
          request: {
            method: 'GET',
            url: buildEmployeeSearchQuery({ ...input, resourceType }),
          },
        },
      ],
    };
  }

  return {
    resourceType: 'Bundle',
    type: 'batch',
    entry: [
      {
        request: {
          method: 'POST',
          url: `${resourceType}/_search`,
        },
        resource: buildFhirParametersResourceFromSearchParams(claims),
      },
    ],
  };
}
