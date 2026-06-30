// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import type {
  HealthcareCanonicalSectionFamily,
  HealthcareRoleFamily,
} from '../constants/healthcare';
import { Format } from '../constants/Schemas';
import type { BundleEntry, BundleJsonApi, BundleRequest } from './bundle';

/**
 * Runtime strictness used by `CommunicationAttachedBundleSession`.
 */
export type CommunicationAttachedBundleSessionMode = 'strict' | 'normalize';

/**
 * Constructor options for `CommunicationAttachedBundleSession`.
 */
export type CommunicationAttachedBundleSessionOptions = Readonly<{
  communicationClaims?: Record<string, unknown>;
  initialBundle?: BundleJsonApi<BundleEntry>;
  mode?: CommunicationAttachedBundleSessionMode;
}>;

/**
 * Canonical `@context` for outer `Communication` claim payloads.
 *
 * Rationale:
 * - the outer container is materialized as one FHIR `Communication` resource
 * - the inner `resource.meta.claims` rows stay version-agnostic and therefore
 *   use `FHIR_API`
 */
export const CommunicationAttachmentClaimsContext = Format.FHIR_R4;

/**
 * Canonical `@context` for bundle entry `resource.meta.claims`.
 *
 * These claims are intended to stay version-agnostic across FHIR releases.
 */
export const BundleEntryClaimsContext = Format.FHIR_API;

/**
 * Selector for reopening one active bundle entry.
 *
 * Prefer `position` for bundle-array addressing. `index` is kept only as a
 * backward-compatible alias during migration.
 */
export type ActiveEntrySelection = Readonly<{
  position?: number;
  /** @deprecated Prefer `position`. */
  index?: number;
  fullUrl?: string;
}>;

/**
 * Generic upsert contract for one bundle entry stored in memory.
 */
export type UpsertEntryInput = Readonly<{
  resourceType: string;
  claims: Record<string, unknown>;
  type?: string;
  fullUrl?: string;
  request?: BundleRequest;
}>;

/**
 * Reusable resource-specific upsert contract used by typed session helpers.
 */
export type UpsertClaimsResourceEntryInput<TClaims extends object = Record<string, unknown>> = Readonly<{
  claims: TClaims;
  type?: string;
  fullUrl?: string;
  request?: BundleRequest;
}>;

/**
 * Input for adding one linked `DocumentReference` to the current active entry.
 */
export type AddContainedDocumentToActiveEntryInput = Readonly<{
  identifier?: string;
  fullUrl?: string;
  claims?: Record<string, unknown>;
  attachmentContentType?: string;
  attachmentDataBase64?: string;
  attachmentUrl?: string;
  description?: string;
  date?: string;
  language?: string;
}>;

/**
 * Canonical target kinds for consent access editing.
 */
export const ConsentEditorTargetKinds = Object.freeze({
  Section: 'section',
  ResourceType: 'resource-type',
} as const);

export type ConsentEditorTargetKind =
  typeof ConsentEditorTargetKinds[keyof typeof ConsentEditorTargetKinds];

/**
 * Canonical operation scope codes for consent access editing.
 */
export const ConsentEditorScopeCodes = Object.freeze({
  Search: 's',
  Read: 'r',
  Create: 'c',
  Update: 'u',
  Delete: 'd',
} as const);

export type ConsentEditorScopeCode =
  typeof ConsentEditorScopeCodes[keyof typeof ConsentEditorScopeCodes];

/**
 * One classified scope attached to a consent target.
 */
export type ConsentEditorClassifiedScope = Readonly<{
  code: ConsentEditorScopeCode;
  display?: string;
}>;

/**
 * One classified target entry shown to consent-editing callers.
 */
export type ConsentEditorClassifiedTarget = Readonly<{
  target: Readonly<{
    kind: ConsentEditorTargetKind;
    code: string;
    display?: string;
    sectionFamily?: HealthcareCanonicalSectionFamily;
  }>;
  scopes: readonly ConsentEditorClassifiedScope[];
}>;

/**
 * Classified actor role resolved from canonical healthcare role catalogs.
 */
export type ConsentEditorClassifiedActorRole = Readonly<{
  codingSystem: string;
  code: string;
  display?: string;
}>;

/**
 * Role kind used in consent role classification.
 *
 * The underlying catalog still comes from `HealthcareRoleFamily`, but this
 * editor-level view intentionally names the field `kind` instead of `family`
 * to avoid leaking `individual-organization` terminology into generic consent
 * editing flows.
 */
export type ConsentEditorClassifiedRoleKind = HealthcareRoleFamily;

/**
 * Classified role entry exposed by the consent editor.
 */
export type ConsentEditorClassifiedRole = Readonly<{
  kind?: ConsentEditorClassifiedRoleKind;
  codingSystem: string;
  code: string;
  display?: string;
  definition?: string;
}>;

/**
 * Role buckets exposed by the consent editor.
 */
export type ConsentEditorClassifiedRoles = Readonly<{
  professional: readonly ConsentEditorClassifiedRole[];
  relationship: readonly ConsentEditorClassifiedRole[];
  legalRepresentative: readonly ConsentEditorClassifiedRole[];
  other: readonly ConsentEditorClassifiedRole[];
}>;

export type ConsentEditorClassifiedDepartment = Readonly<{
  code: string;
  display?: string;
}>;

export type ConsentEditorClassifiedLocation = Readonly<{
  code: string;
  display?: string;
}>;

export type ConsentEditorClassifiedOrganization = Readonly<{
  domain: string;
  display?: string;
  departments: readonly ConsentEditorClassifiedDepartment[];
  locations: readonly ConsentEditorClassifiedLocation[];
}>;

export type ConsentEditorClassifiedJurisdiction = Readonly<{
  code: string;
  display?: string;
}>;

export type ConsentEditorClassifiedUser = Readonly<{
  email?: string;
  phone?: string;
  role?: ConsentEditorClassifiedActorRole;
}>;

export type ConsentEditorClassifiedActors = Readonly<{
  jurisdictions: readonly ConsentEditorClassifiedJurisdiction[];
  organizations: readonly ConsentEditorClassifiedOrganization[];
  users: readonly ConsentEditorClassifiedUser[];
}>;

export type ConsentEditorClassifiedPurpose = Readonly<{
  code: string;
  display?: string;
}>;

/**
 * Normalized consent view model exposed by the editor.
 */
export type ConsentViewModel = Readonly<{
  fullUrl?: string;
  identifier: string;
  subject: string;
  decision: string;
  classifiedActors: ConsentEditorClassifiedActors;
  classifiedRoles: ConsentEditorClassifiedRoles;
  classifiedPurposes: readonly ConsentEditorClassifiedPurpose[];
  classifiedTargets: readonly ConsentEditorClassifiedTarget[];
}>;
