import type { FhirResource, FlatClaims } from '../convert/convert-shared';
import { convertFhirResourceToClaims } from './clinical-resource-converters';
import {
  buildFhirParametersResourceFromSearchParams,
  type SearchParameterPrimitive,
} from './fhir-search';

export const InteroperableOperationMethods = Object.freeze({
  Post: 'POST',
} as const);

export const InteroperableOperationRoutes = Object.freeze({
  SearchSuffix: '/_search',
} as const);

export const InteroperableLifecycleStatuses = Object.freeze({
  Pending: 'pending',
  Active: 'active',
  Inactive: 'inactive',
  Purged: 'purged',
  Suspended: 'suspended',
  Revoked: 'revoked',
} as const);

export type InteroperableLifecycleStatus =
  typeof InteroperableLifecycleStatuses[keyof typeof InteroperableLifecycleStatuses];

export type InteroperableSearchParams = Readonly<Record<string, SearchParameterPrimitive | undefined>>;

export type InteroperableResourceOperationDraft = Readonly<{
  resourceType: string;
  identifierClaimKey: string;
  identifierValue?: string;
  identifierSystem?: string;
  resourceId?: string;
  claims: Record<string, unknown>;
  lifecycleStatus?: InteroperableLifecycleStatus;
}>;

/**
 * Chainable editor that keeps the distinction between:
 *
 * - interoperable business identity: `resource.identifier`
 * - internal storage identity: `resource.id`
 * - canonical processing shape: `resource.meta.claims`
 *
 * This editor is intentionally small and didactic. It is meant for SDKs,
 * tests, and docs that need a stable contract without re-explaining the same
 * identifier rules in every repository.
 */
export interface InteroperableResourceOperationEditor {
  setResourceType(value: string): InteroperableResourceOperationEditor;
  setIdentifierClaimKey(value: string): InteroperableResourceOperationEditor;
  setBusinessIdentifier(value: string, system?: string): InteroperableResourceOperationEditor;
  setInternalResourceId(value: string): InteroperableResourceOperationEditor;
  setClaims(claims: Record<string, unknown>): InteroperableResourceOperationEditor;
  mergeClaims(claims: Record<string, unknown>): InteroperableResourceOperationEditor;
  setLifecycleStatus(value: InteroperableLifecycleStatus): InteroperableResourceOperationEditor;
  importFhirResource(resource: FhirResource): InteroperableResourceOperationEditor;
  getDraft(): InteroperableResourceOperationDraft;
  getBusinessIdentifier(): string | undefined;
  getClaims(): Record<string, unknown>;
  buildLifecycleResource(): {
    resourceType: string;
    id?: string;
    identifier?: Array<{ value: string; system?: string }>;
    meta: { claims: Record<string, unknown>; status?: InteroperableLifecycleStatus };
  };
  buildDisableEntry(input: { type: string }): {
    type: string;
    request: { method: 'POST' };
    resource: ReturnType<InteroperableResourceOperationEditor['buildLifecycleResource']>;
  };
  buildPurgeEntry(input: { type: string }): {
    type: string;
    request: { method: 'POST' };
    resource: ReturnType<InteroperableResourceOperationEditor['buildLifecycleResource']>;
  };
  buildSearchEntry(input?: { resourceType?: string; searchParams?: InteroperableSearchParams }): {
    request: { method: 'POST'; url: string };
    resource: { resourceType: 'Parameters'; parameter: Array<Record<string, unknown>> };
  };
}

function normalizeText(value: unknown): string | undefined {
  const normalized = String(value ?? '').trim();
  return normalized || undefined;
}

function cloneClaims(claims?: Record<string, unknown>): Record<string, unknown> {
  return { ...(claims || {}) };
}

function resolveDefaultIdentifierClaimKey(resourceType: string): string {
  return `${String(resourceType || '').trim()}.identifier`;
}

function normalizeDraft(
  draft?: Partial<InteroperableResourceOperationDraft>,
): InteroperableResourceOperationDraft {
  const resourceType = normalizeText(draft?.resourceType) || 'Resource';
  return {
    resourceType,
    identifierClaimKey: normalizeText(draft?.identifierClaimKey) || resolveDefaultIdentifierClaimKey(resourceType),
    identifierValue: normalizeText(draft?.identifierValue),
    identifierSystem: normalizeText(draft?.identifierSystem),
    resourceId: normalizeText(draft?.resourceId),
    claims: cloneClaims(draft?.claims),
    lifecycleStatus: draft?.lifecycleStatus,
  };
}

function patchDraft(
  draft: InteroperableResourceOperationDraft,
  patch: Partial<InteroperableResourceOperationDraft>,
): InteroperableResourceOperationDraft {
  return normalizeDraft({
    ...draft,
    ...patch,
    claims: patch.claims ? cloneClaims(patch.claims) : cloneClaims(draft.claims),
  });
}

/**
 * Returns the primary FHIR `resource.identifier[0].value` when present.
 *
 * Contract note:
 * - this is the interoperable locator to use at API boundaries
 * - it is intentionally different from `resource.id`, which is treated as a
 *   technical/internal identifier
 */
export function getPrimaryFhirIdentifierValue(resource: Record<string, unknown>): string | undefined {
  const identifiers = Array.isArray(resource?.identifier)
    ? resource.identifier as Array<{ value?: unknown }>
    : [];
  return normalizeText(identifiers[0]?.value);
}

/**
 * Builds one resource clone with a primary FHIR `identifier` entry.
 */
export function setPrimaryFhirIdentifier(
  resource: Record<string, unknown>,
  input: Readonly<{ value: string; system?: string }>,
): Record<string, unknown> {
  const value = normalizeText(input.value);
  if (!value) return { ...resource };
  return {
    ...resource,
    identifier: [{
      value,
      ...(normalizeText(input.system) ? { system: normalizeText(input.system) } : {}),
    }],
  };
}

/**
 * Converts a FHIR resource into canonical processing claims and ensures that
 * the business identifier survives the normalization step.
 *
 * Processing order:
 * 1. use the resource-specific converter when available
 * 2. fall back to structural flattening for unsupported FHIR resources
 * 3. ensure the final claim record still carries the expected identifier claim
 */
export function normalizeClaimsFromFhirResource(
  resource: FhirResource,
  input: Readonly<{ identifierClaimKey?: string }>,
): Record<string, unknown> {
  const identifierClaimKey = normalizeText(input.identifierClaimKey)
    || resolveDefaultIdentifierClaimKey(resource.resourceType);
  const existingClaims = cloneClaims((resource.meta as Record<string, unknown> | undefined)?.claims as Record<string, unknown> | undefined);
  const convertedClaims = convertFhirResourceToClaims(resource);
  const identifierValue = getPrimaryFhirIdentifierValue(resource);
  const claims = {
    ...convertedClaims,
    ...existingClaims,
  } as Record<string, unknown>;
  if (identifierValue && !normalizeText(claims[identifierClaimKey])) {
    claims[identifierClaimKey] = identifierValue;
  }
  return claims;
}

/**
 * Builds the canonical operation path for a FHIR search action.
 *
 * Contract rule:
 * - operation intent lives in the path
 * - `_search` is emitted as `POST + Parameters`
 * - the runtime or manager can still accept legacy wrappers, but SDK helpers
 *   should generate this normalized target path
 */
export function buildInteroperableSearchPath(resourceType: string): string {
  return `${String(resourceType || '').trim() || 'Resource'}${InteroperableOperationRoutes.SearchSuffix}`;
}

/**
 * Builds the canonical lifecycle resource shape for `_disable` / `_purge`.
 *
 * Rules:
 * - `resource.identifier` is the interoperable locator
 * - `resource.id` is optional internal/runtime metadata
 * - `resource.meta.claims` is the canonical processing shape
 * - `resource.meta.status` carries lifecycle state without overloading
 *   resource-specific FHIR fields such as `status` or `active`
 */
export function buildLifecycleOperationResource(
  draft: InteroperableResourceOperationDraft,
): {
  resourceType: string;
  id?: string;
  identifier?: Array<{ value: string; system?: string }>;
  meta: { claims: Record<string, unknown>; status?: InteroperableLifecycleStatus };
} {
  const claims = cloneClaims(draft.claims);
  if (draft.identifierValue && !normalizeText(claims[draft.identifierClaimKey])) {
    claims[draft.identifierClaimKey] = draft.identifierValue;
  }

  return {
    resourceType: draft.resourceType,
    ...(draft.resourceId ? { id: draft.resourceId } : {}),
    ...(draft.identifierValue ? {
      identifier: [{
        value: draft.identifierValue,
        ...(draft.identifierSystem ? { system: draft.identifierSystem } : {}),
      }],
    } : {}),
    meta: {
      claims,
      ...(draft.lifecycleStatus ? { status: draft.lifecycleStatus } : {}),
    },
  };
}

/**
 * Creates the shared chainable editor for search/disable/purge request shapes.
 */
export function createInteroperableResourceOperationEditor(
  initial?: Partial<InteroperableResourceOperationDraft>,
): InteroperableResourceOperationEditor {
  let draft = normalizeDraft(initial);

  const editor: InteroperableResourceOperationEditor = {
    setResourceType(value) {
      const resourceType = normalizeText(value) || draft.resourceType;
      draft = patchDraft(draft, {
        resourceType,
        identifierClaimKey: resolveDefaultIdentifierClaimKey(resourceType),
      });
      return editor;
    },
    setIdentifierClaimKey(value) {
      draft = patchDraft(draft, { identifierClaimKey: normalizeText(value) || draft.identifierClaimKey });
      return editor;
    },
    setBusinessIdentifier(value, system) {
      draft = patchDraft(draft, {
        identifierValue: normalizeText(value),
        identifierSystem: normalizeText(system),
      });
      return editor;
    },
    setInternalResourceId(value) {
      draft = patchDraft(draft, { resourceId: normalizeText(value) });
      return editor;
    },
    setClaims(claims) {
      draft = patchDraft(draft, { claims });
      return editor;
    },
    mergeClaims(claims) {
      draft = patchDraft(draft, { claims: { ...draft.claims, ...cloneClaims(claims) } });
      return editor;
    },
    setLifecycleStatus(value) {
      draft = patchDraft(draft, { lifecycleStatus: value });
      return editor;
    },
    importFhirResource(resource) {
      const resourceType = normalizeText(resource?.resourceType) || draft.resourceType;
      const identifierClaimKey = draft.identifierClaimKey || resolveDefaultIdentifierClaimKey(resourceType);
      const claims = normalizeClaimsFromFhirResource(resource, { identifierClaimKey });
      draft = patchDraft(draft, {
        resourceType,
        identifierClaimKey,
        identifierValue: getPrimaryFhirIdentifierValue(resource) || draft.identifierValue,
        resourceId: normalizeText(resource?.id) || draft.resourceId,
        claims,
      });
      return editor;
    },
    getDraft() {
      return normalizeDraft(draft);
    },
    getBusinessIdentifier() {
      return draft.identifierValue;
    },
    getClaims() {
      const claims = cloneClaims(draft.claims);
      if (draft.identifierValue && !normalizeText(claims[draft.identifierClaimKey])) {
        claims[draft.identifierClaimKey] = draft.identifierValue;
      }
      return claims;
    },
    buildLifecycleResource() {
      return buildLifecycleOperationResource({
        ...draft,
        claims: editor.getClaims(),
      });
    },
    buildDisableEntry(input) {
      return {
        type: input.type,
        request: { method: InteroperableOperationMethods.Post },
        resource: createInteroperableResourceOperationEditor(draft)
          .setLifecycleStatus(InteroperableLifecycleStatuses.Inactive)
          .buildLifecycleResource(),
      };
    },
    buildPurgeEntry(input) {
      return {
        type: input.type,
        request: { method: InteroperableOperationMethods.Post },
        resource: createInteroperableResourceOperationEditor(draft)
          .setLifecycleStatus(InteroperableLifecycleStatuses.Purged)
          .buildLifecycleResource(),
      };
    },
    buildSearchEntry(input = {}) {
      const resourceType = normalizeText(input.resourceType) || draft.resourceType;
      return {
        request: {
          method: InteroperableOperationMethods.Post,
          url: buildInteroperableSearchPath(resourceType),
        },
        resource: buildFhirParametersResourceFromSearchParams(input.searchParams || {}),
      };
    },
  };

  return editor;
}
