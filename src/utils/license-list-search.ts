// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  buildLicenseSearchEntry,
  type LicenseClaims,
  LicenseStatuses,
  type LicenseSearchInput,
  type LicenseStatus,
} from './license';
import { ClaimsIndividualProductSchemaorg, ClaimsOfferSchemaorg, ClaimsPersonSchemaorg } from '../constants/schemaorg';

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
