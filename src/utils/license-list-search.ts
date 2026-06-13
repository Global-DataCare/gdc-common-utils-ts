// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  buildLicenseSearchEntry,
  type LicenseClaims,
  LicenseStatuses,
  type LicenseSearchInput,
  type LicenseStatus,
} from './license';
import { ClaimsIndividualProductSchemaorg, ClaimsOfferSchemaorg, ClaimsPersonSchemaorg } from '../constants/schemaorg';

/**
 * High-level filter draft for license list/search screens.
 *
 * This draft keeps UI semantics stable even when the runtime search transport
 * still supports only a subset of the final portal-facing filters.
 */
export type LicenseListSearchDraft = Readonly<{
  serialNumbers?: readonly string[];
  email?: string;
  role?: string;
  status?: LicenseStatus;
  subjectId?: string;
  userClass?: string;
  type?: string;
  active?: boolean;
  assigned?: boolean;
  unused?: boolean;
  periodStart?: string;
  periodEnd?: string;
  additionalClaims: LicenseClaims;
}>;

/**
 * Frontend-friendly normalized row extracted from a GW/device-license style
 * response body.
 */
export type LicenseListRecord = Readonly<{
  id?: string;
  status?: string;
  subjectId?: string;
  email?: string;
  role?: string;
  category?: string;
  appType?: string;
  activationCode?: string;
  claims: Record<string, unknown>;
}>;

/**
 * Small aggregate that a frontend/BFF can show in counters without re-reading
 * raw claims entry by entry.
 */
export type LicenseListSummary = Readonly<{
  contracted: number;
  free: number;
  used: number;
  available: number;
  issued: number;
  active: number;
  inactive: number;
}>;

function normalizeText(value: unknown): string | undefined {
  const normalized = String(value ?? '').trim();
  return normalized || undefined;
}

function cloneClaims(claims?: LicenseClaims): LicenseClaims {
  return { ...(claims || {}) };
}

function cloneDraft(draft?: Partial<LicenseListSearchDraft>): LicenseListSearchDraft {
  return {
    serialNumbers: Array.isArray(draft?.serialNumbers) ? [...draft!.serialNumbers!] : undefined,
    email: normalizeText(draft?.email),
    role: normalizeText(draft?.role),
    status: draft?.status,
    subjectId: normalizeText(draft?.subjectId),
    userClass: normalizeText(draft?.userClass),
    type: normalizeText(draft?.type),
    active: typeof draft?.active === 'boolean' ? draft.active : undefined,
    assigned: typeof draft?.assigned === 'boolean' ? draft.assigned : undefined,
    unused: typeof draft?.unused === 'boolean' ? draft.unused : undefined,
    periodStart: normalizeText(draft?.periodStart),
    periodEnd: normalizeText(draft?.periodEnd),
    additionalClaims: cloneClaims(draft?.additionalClaims),
  };
}

function resolveStatus(draft: LicenseListSearchDraft): LicenseStatus | undefined {
  if (draft.status) return draft.status;
  if (draft.active === true) return LicenseStatuses.Active;
  if (draft.active === false) return LicenseStatuses.Inactive;
  if (draft.unused === true) return LicenseStatuses.Available;
  return undefined;
}

/**
 * High-level chainable draft for frontend/backend license list/search filters.
 *
 * Intent:
 * - keep UI-level filters (`active`, `unused`, `assigned`, `period`) visible at
 *   the semantic layer
 * - map the currently supported subset to the existing canonical search entry
 * - preserve the rest in a neutral draft until the final backend facade is
 *   fully converged
 */
export class LicenseListSearchEditor {
  private draft: LicenseListSearchDraft;

  constructor(initial?: Partial<LicenseListSearchDraft>) {
    this.draft = cloneDraft(initial);
  }

  setSerialNumbers(values: readonly string[]): this {
    this.draft = cloneDraft({ ...this.draft, serialNumbers: [...values] });
    return this;
  }

  setEmail(value: string): this {
    this.draft = cloneDraft({ ...this.draft, email: value });
    return this;
  }

  setRole(value: string): this {
    this.draft = cloneDraft({ ...this.draft, role: value });
    return this;
  }

  setStatus(value: LicenseStatus): this {
    this.draft = cloneDraft({ ...this.draft, status: value });
    return this;
  }

  setSubjectId(value: string): this {
    this.draft = cloneDraft({ ...this.draft, subjectId: value });
    return this;
  }

  setUserClass(value: string): this {
    this.draft = cloneDraft({ ...this.draft, userClass: value });
    return this;
  }

  setAppType(value: string): this {
    this.draft = cloneDraft({ ...this.draft, type: value });
    return this;
  }

  setActive(value: boolean): this {
    this.draft = cloneDraft({ ...this.draft, active: value });
    return this;
  }

  setAssigned(value: boolean): this {
    this.draft = cloneDraft({ ...this.draft, assigned: value });
    return this;
  }

  setUnused(value: boolean): this {
    this.draft = cloneDraft({ ...this.draft, unused: value });
    return this;
  }

  setPeriod(start?: string, end?: string): this {
    this.draft = cloneDraft({ ...this.draft, periodStart: start, periodEnd: end });
    return this;
  }

  mergeClaims(claims: LicenseClaims): this {
    this.draft = cloneDraft({
      ...this.draft,
      additionalClaims: { ...this.draft.additionalClaims, ...cloneClaims(claims) },
    });
    return this;
  }

  getDraft(): LicenseListSearchDraft {
    return cloneDraft(this.draft);
  }

  /**
   * Returns the currently supported runtime-facing search input subset.
   */
  toSearchInput(): LicenseSearchInput {
    return {
      ...(this.draft.serialNumbers ? { serialNumbers: [...this.draft.serialNumbers] } : {}),
      ...(this.draft.userClass ? { userClass: this.draft.userClass as LicenseSearchInput['userClass'] } : {}),
      ...(this.draft.type ? { type: this.draft.type as LicenseSearchInput['type'] } : {}),
      ...(this.draft.email ? { email: this.draft.email } : {}),
      ...(this.draft.role ? { role: this.draft.role } : {}),
      ...(resolveStatus(this.draft) ? { status: resolveStatus(this.draft) } : {}),
      ...(this.draft.subjectId ? { subjectId: this.draft.subjectId } : {}),
      additionalClaims: cloneClaims(this.draft.additionalClaims),
    };
  }

  buildSearchEntry(): ReturnType<typeof buildLicenseSearchEntry> {
    return buildLicenseSearchEntry(this.toSearchInput());
  }
}

function extractClaims(entry: Record<string, unknown>): Record<string, unknown> {
  const meta = entry.meta && typeof entry.meta === 'object' ? entry.meta as Record<string, unknown> : {};
  const resource = entry.resource && typeof entry.resource === 'object' ? entry.resource as Record<string, unknown> : {};
  const resourceMeta = resource.meta && typeof resource.meta === 'object' ? resource.meta as Record<string, unknown> : {};
  const metaClaims = meta.claims && typeof meta.claims === 'object' ? meta.claims as Record<string, unknown> : undefined;
  const resourceClaims = resourceMeta.claims && typeof resourceMeta.claims === 'object' ? resourceMeta.claims as Record<string, unknown> : undefined;
  return { ...(resourceClaims || {}), ...(metaClaims || {}) };
}

/**
 * Reads license-like search/list records from one current GW-style response
 * body without exposing raw claim access to frontend code.
 */
export function readLicenseListRecords(body: unknown): LicenseListRecord[] {
  const root = body && typeof body === 'object' ? body as Record<string, unknown> : {};
  const bodyNode = root.body && typeof root.body === 'object' ? root.body as Record<string, unknown> : root;
  const data = Array.isArray(bodyNode.data) ? bodyNode.data : [];

  return data
    .filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === 'object')
    .map((entry) => {
      const claims = extractClaims(entry);
      const meta = entry.meta && typeof entry.meta === 'object' ? entry.meta as Record<string, unknown> : {};
      return {
        id: normalizeText(
          claims[ClaimsIndividualProductSchemaorg.serialNumber]
          || claims[ClaimsOfferSchemaorg.serialNumber]
          || (entry as Record<string, unknown>).id,
        ),
        status: normalizeText(meta.status),
        subjectId: normalizeText(meta.subjectId),
        email: normalizeText(claims[ClaimsPersonSchemaorg.email]),
        role: normalizeText(claims[ClaimsPersonSchemaorg.hasOccupationalRoleValue]),
        category: normalizeText(claims[ClaimsIndividualProductSchemaorg.category]),
        appType: normalizeText(claims[ClaimsIndividualProductSchemaorg.additionalType]),
        activationCode: normalizeText(claims[ClaimsIndividualProductSchemaorg.serialNumber]),
        claims,
      };
    });
}

/**
 * Finds one list/search record by its canonical business seat identifier.
 *
 * Use this in frontend/BFF code when one row id was selected in a table and
 * the caller wants the already-normalized record back without touching raw
 * `meta.claims`.
 */
export function findLicenseListRecord(
  body: unknown,
  identifier: string,
): LicenseListRecord | undefined {
  const wanted = normalizeText(identifier);
  if (!wanted) return undefined;
  return readLicenseListRecords(body).find((record) => record.id === wanted);
}

/**
 * Summarizes one license list/search response into the seat counters typically
 * needed by portal dashboards and guards.
 *
 * Current meaning:
 * - `contracted`: total seats visible in the current response
 * - `free`: seats still `available`
 * - `used`: seats already assigned/consumed (`issued|active|inactive`)
 */
export function summarizeLicenseListRecords(body: unknown): LicenseListSummary {
  const summary = {
    contracted: 0,
    free: 0,
    used: 0,
    available: 0,
    issued: 0,
    active: 0,
    inactive: 0,
  };

  for (const record of readLicenseListRecords(body)) {
    summary.contracted += 1;
    if (record.status === LicenseStatuses.Available) summary.available += 1;
    if (record.status === LicenseStatuses.Issued) summary.issued += 1;
    if (record.status === LicenseStatuses.Active) summary.active += 1;
    if (record.status === LicenseStatuses.Inactive) summary.inactive += 1;
  }

  summary.free = summary.available;
  summary.used = summary.issued + summary.active + summary.inactive;
  return summary satisfies LicenseListSummary;
}
