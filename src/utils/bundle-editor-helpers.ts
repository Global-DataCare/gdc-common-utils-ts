/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - Keep only reusable pure helper logic here.
 * - Do not move entry-specific orchestration back into this file; that belongs
 *   in the editor classes.
 */
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { HttpRequestMethods } from '../constants/http';
import { type BundleRequest } from '../models/bundle';
import {
  AllergyIntoleranceClaim,
} from '../models/interoperable-claims/allergy-intolerance-claims';
import { ConditionClaim } from '../models/interoperable-claims/condition-claims';
import { DiagnosticReportClaim } from '../models/interoperable-claims/diagnostic-report-claims';
import { MedicationStatementClaim } from '../models/interoperable-claims/medication-statement-claims';
import { ClaimConsent } from '../models/consent-rule';
import {
  BundleEditableResourceTypes,
  type BundleOperation,
} from '../models/bundle-editor-types';
import {
  EmployeeBatchEntryTypes,
  EmployeeBundleMethods,
  EmployeeBundleOperations,
} from './employee';

export function cloneEntry<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Clones one claim value while preserving simple arrays used by flat claims. */
export function cloneClaimValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return [...value] as T;
  }
  return value;
}

/**
 * Trims one candidate identifier-like value and returns `undefined` when it is
 * empty or absent.
 *
 * Use this before writing ids, references, `fullUrl`, or flat-claim scalars so
 * every editor follows the same blank-value rule.
 */
export function normalizeOptionalIdentifier(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const normalized = String(value).trim();
  return normalized ? normalized : undefined;
}

/** Builds the canonical relative FHIR request URL for one technical resource id. */
export function buildFhirResourceRequestUrl(resourceType: string, resourceId: string): string {
  const normalizedType = normalizeOptionalIdentifier(resourceType);
  const normalizedId = normalizeOptionalIdentifier(resourceId);
  if (!normalizedType || !normalizedId) {
    throw new Error('FHIR resource request URL requires resource type and technical resource id.');
  }
  const prefix = `${normalizedType}/`;
  return normalizedId.startsWith(prefix) ? normalizedId : `${prefix}${normalizedId}`;
}

/** Converts one content version id into the weak ETag shape used by FHIR ifMatch. */
export function buildFhirIfMatch(versionId: string): string {
  const normalized = normalizeOptionalIdentifier(versionId);
  if (!normalized) throw new Error('ifMatch requires a non-empty version id.');
  if (/^(W\/)?"[^"]+"$/.test(normalized)) return normalized;
  return `W/"${normalized}"`;
}

/** Clones a staged entry and removes the resource body required to be absent for DELETE. */
export function materializeBundleEntry<T extends {
  request?: { method: BundleRequest['method'] };
  resource?: unknown;
  omitResource?: boolean;
}>(entry: T): T {
  const materialized = cloneEntry(entry);
  if (materialized.request?.method === HttpRequestMethods.Delete && materialized.omitResource) {
    delete materialized.resource;
  }
  delete materialized.omitResource;
  return materialized;
}

/** Returns one canonical `urn:uuid:*` identifier for new entry/resource drafts. */
export function createCanonicalIdentifierUrn(): string {
  const cryptoLike = globalThis as typeof globalThis & {
    crypto?: { randomUUID?: () => string };
  };
  const uuid = typeof cryptoLike.crypto?.randomUUID === 'function'
    ? cryptoLike.crypto.randomUUID()
    : `resource-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `urn:uuid:${uuid}`;
}

/**
 * Maps the editor's high-level business operation to the low-level request
 * method stored in staged bundle entries.
 */
export function resolveRequestMethodForOperation(operation: BundleOperation): BundleRequest['method'] {
  switch (operation) {
    case EmployeeBundleOperations.disable:
      return EmployeeBundleMethods.disable;
    case EmployeeBundleOperations.search:
    case EmployeeBundleOperations.create:
    case EmployeeBundleOperations.purge:
    default:
      return EmployeeBundleMethods.create;
  }
}

/**
 * Resolves the legacy entry `type` string used by employee-oriented batch flows.
 *
 * This is not the same concept as `resource.resourceType`.
 */
export function resolveEntryTypeForOperation(operation: BundleOperation): string {
  switch (operation) {
    case EmployeeBundleOperations.search:
      return EmployeeBatchEntryTypes.search;
    case EmployeeBundleOperations.disable:
      return EmployeeBatchEntryTypes.disable;
    case EmployeeBundleOperations.purge:
      return EmployeeBatchEntryTypes.purge;
    case EmployeeBundleOperations.create:
    default:
      return EmployeeBatchEntryTypes.create;
  }
}

/**
 * Builds the generic entry `type` string for non-employee resource drafts.
 *
 * This is one bundle-internal classification token, not a FHIR field.
 */
export function inferGenericEntryType(resourceType: string, operation: BundleOperation): string {
  const normalizedResourceType = String(resourceType || '').trim();
  if (normalizedResourceType === BundleEditableResourceTypes.employee) {
    return resolveEntryTypeForOperation(operation);
  }
  return `${normalizedResourceType}-${operation}-request-v1.0`;
}

/**
 * Resolves which flat-claims key stores the CSV of linked/contained resource
 * references for one parent resource type.
 */
export function resolveContainedReferenceListClaimKey(resourceType: string): string {
  switch (resourceType) {
    case ResourceTypesFhirR4.AllergyIntolerance:
      return AllergyIntoleranceClaim.ContainedReferenceList;
    case ResourceTypesFhirR4.Condition:
      return ConditionClaim.ContainedReferenceList;
    case ResourceTypesFhirR4.MedicationStatement:
      return MedicationStatementClaim.ContainedReferenceList;
    case ResourceTypesFhirR4.DiagnosticReport:
      return DiagnosticReportClaim.ContainedReferenceList;
    case ResourceTypesFhirR4.Consent:
      return ClaimConsent.containedReferenceList;
    default:
      return '';
  }
}

/** Returns the internal visibility-control claim that marks one resource as contained. */
export function resolveContainedFlagClaimKey(resourceType: string): string {
  return `${resourceType}.is-contained`;
}

/** Returns the internal parent-reference claim for one contained child resource. */
export function resolveContainedParentReferenceClaimKey(resourceType: string): string {
  return `${resourceType}.contained-parent-reference`;
}

/**
 * Normalizes one linked-resource reference into both:
 * - `identifier`: the entry-local id part
 * - `reference`: the canonical `ResourceType/<id>` string
 *
 * This lets the editors accept either a bare id or a full FHIR-style reference
 * while keeping one normalized shape internally.
 */
export function normalizeContainedReference(resourceType: string, referenceOrIdentifier: string): {
  identifier: string;
  reference: string;
} {
  const normalizedValue = normalizeOptionalIdentifier(referenceOrIdentifier);
  if (!normalizedValue) {
    return { identifier: '', reference: '' };
  }
  const slashIndex = normalizedValue.indexOf('/');
  if (slashIndex > 0) {
    const identifier = normalizedValue.slice(slashIndex + 1).trim();
    return {
      identifier,
      reference: `${String(resourceType || '').trim() || normalizedValue.slice(0, slashIndex).trim()}/${identifier}`,
    };
  }
  return {
    identifier: normalizedValue,
    reference: `${String(resourceType || '').trim()}/${normalizedValue}`,
  };
}
