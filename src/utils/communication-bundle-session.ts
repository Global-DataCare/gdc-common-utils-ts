// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { ClaimConsent } from '../models/consent-rule';
import { BundleEntry, BundleEntryResource, BundleJsonApi, BundleRequest } from '../models/bundle';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';
import { BundleQuery, type BundleResourceIdFilters } from './bundle-query';
import {
  MedicationStatementClaim,
  type MedicationStatementClaimsFlat,
} from '../models/interoperable-claims/medication-statement-claims';

export type CommunicationBundleSessionMode = 'strict' | 'normalize';

export type CommunicationBundleSessionOptions = Readonly<{
  communicationClaims?: Record<string, unknown>;
  initialBundle?: BundleJsonApi<BundleEntry>;
  mode?: CommunicationBundleSessionMode;
}>;

export type ActiveEntrySelection = Readonly<{
  index?: number;
  fullUrl?: string;
}>;

export type UpsertEntryInput = Readonly<{
  resourceType: string;
  claims: Record<string, unknown>;
  type?: string;
  fullUrl?: string;
  request?: BundleRequest;
}>;

/**
 * Communication editing session with bundle-in-memory as source of truth.
 *
 * Design contract:
 * - `activeEntry` is the real editing unit (not only `activeResource`), because
 *   it can include `fullUrl`, `request`, and entry-level context.
 * - `Communication.content-attachment-data` is always derived from the
 *   in-memory bundle after each committed update.
 * - saving can release active entry memory via `saveAndReleaseActiveEntry()`.
 */
export class CommunicationBundleSession {
  private communicationClaims: Record<string, unknown>;
  private bundleInMemory: BundleJsonApi<BundleEntry>;
  private activeEntryIndex: number | null;
  private mode: CommunicationBundleSessionMode;

  constructor(options: CommunicationBundleSessionOptions = {}) {
    this.mode = options.mode || 'strict';
    this.communicationClaims = {
      ...options.communicationClaims,
    };
    this.activeEntryIndex = null;

    const providedBundle = options.initialBundle ? cloneBundle(options.initialBundle) : undefined;
    this.bundleInMemory = providedBundle || this.decodeBundleFromClaims(this.communicationClaims);
    this.syncAttachmentFromBundle();
  }

  /** Returns a deep copy of communication claims. */
  getCommunicationClaims(): Record<string, unknown> {
    return {
      ...this.communicationClaims,
    };
  }

  /** Returns a deep copy of the current in-memory bundle. */
  getBundleInMemory(): BundleJsonApi<BundleEntry> {
    return cloneBundle(this.bundleInMemory);
  }

  /** Returns the active entry index, or null when no entry is selected. */
  getActiveEntryIndex(): number | null {
    return this.activeEntryIndex;
  }

  /** Returns a deep copy of the active entry when selected. */
  getActiveEntry(): BundleEntry | null {
    if (this.activeEntryIndex === null) {
      return null;
    }
    return cloneEntry(this.bundleInMemory.data[this.activeEntryIndex]);
  }

  /** Selects an active entry by index or fullUrl. */
  selectActiveEntry(selection: ActiveEntrySelection): this {
    if (typeof selection.index === 'number') {
      this.assertEntryIndex(selection.index);
      this.activeEntryIndex = selection.index;
      return this;
    }

    if (selection.fullUrl) {
      const foundIndex = this.bundleInMemory.data.findIndex((entry) => String(entry?.fullUrl || '').trim() === selection.fullUrl);
      if (foundIndex < 0) {
        throw new Error(`Active entry not found for fullUrl: ${selection.fullUrl}`);
      }
      this.activeEntryIndex = foundIndex;
      return this;
    }

    throw new Error('selectActiveEntry requires either index or fullUrl.');
  }

  /** Clears active entry selection from memory. */
  clearActiveEntry(): this {
    this.activeEntryIndex = null;
    return this;
  }

  /**
   * Upserts an entry in bundle memory and marks it as active.
   * Matching priority: `fullUrl` if present, then resource claim identifier.
   */
  upsertActiveEntry(input: UpsertEntryInput): this {
    const entry = this.createBundleEntry(input);
    const nextIndex = this.findUpsertIndex(entry, input.fullUrl);

    if (nextIndex >= 0) {
      this.bundleInMemory.data[nextIndex] = entry;
      this.activeEntryIndex = nextIndex;
    } else {
      this.bundleInMemory.data.push(entry);
      this.activeEntryIndex = this.bundleInMemory.data.length - 1;
    }

    this.syncAttachmentFromBundle();
    return this;
  }

  /**
   * Consent-first helper for developer onboarding.
   *
   * Expected keys should come from `ClaimConsent` in caller code.
   */
  upsertActiveConsentEntry(input: Readonly<{
    claims: Record<string, unknown>;
    fullUrl?: string;
    type?: string;
    request?: BundleRequest;
  }>): this {
    return this.upsertActiveEntry({
      resourceType: ResourceTypesFhirR4.Consent,
      claims: input.claims,
      fullUrl: input.fullUrl,
      type: input.type,
      request: input.request,
    });
  }

  /**
   * MedicationStatement helper for IPS-in-Communication use cases.
   *
   * Expected keys should come from MedicationStatement claims constants.
   */
  upsertActiveMedicationStatementEntry(input: Readonly<{
    claims: MedicationStatementClaimsFlat | Record<string, unknown>;
    fullUrl?: string;
    type?: string;
    request?: BundleRequest;
  }>): this {
    return this.upsertActiveEntry({
      resourceType: ResourceTypesFhirR4.MedicationStatement,
      claims: {
        ...input.claims,
      },
      fullUrl: input.fullUrl,
      type: input.type,
      request: input.request,
    });
  }

  /**
   * Patches active entry `resource.meta.claims` and synchronizes attachment data.
   */
  patchActiveEntryClaims(claimPatch: Record<string, unknown>): this {
    if (this.activeEntryIndex === null) {
      throw new Error('No active entry selected.');
    }
    const current = cloneEntry(this.bundleInMemory.data[this.activeEntryIndex]);
    const resource = ensureEntryResource(current, this.mode);
    resource.meta = resource.meta || {};
    resource.meta.claims = {
      ...(resource.meta.claims || {}),
      ...claimPatch,
    };
    current.resource = resource;
    this.bundleInMemory.data[this.activeEntryIndex] = current;
    this.syncAttachmentFromBundle();
    return this;
  }

  /**
   * Persists current memory state into communication claims attachment.
   * No-op for active entry pointer.
   */
  saveActiveEntry(): this {
    this.syncAttachmentFromBundle();
    return this;
  }

  /**
   * Persists and releases active entry memory pointer.
   * This is the recommended step after a successful save operation.
   */
  saveAndReleaseActiveEntry(): this {
    this.syncAttachmentFromBundle();
    this.clearActiveEntry();
    return this;
  }

  /**
   * Returns stable resource IDs from bundle entries with optional filters.
   */
  getResourceIds(filters: BundleResourceIdFilters = {}): string[] {
    const query = new BundleQuery(this.bundleInMemory);
    return query.getResourceIds(filters);
  }

  /**
   * Returns bundle entries matching resource IDs produced by `getResourceIds`.
   */
  getResourceEntriesByIds(resourceIds: readonly string[]): BundleEntry[] {
    const query = new BundleQuery(this.bundleInMemory);
    return query.getResourceEntriesByIds(resourceIds);
  }

  /**
   * Resolves the entry URL (`fullUrl`) for a given entry/resource identifier.
   */
  getEntryUrl(entryId: string): string | undefined {
    const query = new BundleQuery(this.bundleInMemory);
    return query.getEntryUrl(entryId);
  }

  private decodeBundleFromClaims(claims: Record<string, unknown>): BundleJsonApi<BundleEntry> {
    const encoded = asTrimmedString(claims[CommunicationClaim.ContentAttachmentData]);
    if (!encoded) {
      return createEmptyBundle();
    }

    try {
      const text = Buffer.from(encoded, 'base64').toString('utf8');
      const parsed = JSON.parse(text) as BundleJsonApi<BundleEntry>;
      validateBundleLike(parsed, this.mode);
      return cloneBundle(parsed);
    } catch (error) {
      if (this.mode === 'normalize') {
        return createEmptyBundle();
      }
      throw new Error(`Invalid ${CommunicationClaim.ContentAttachmentData}: ${(error as Error).message}`);
    }
  }

  private syncAttachmentFromBundle(): void {
    this.communicationClaims[CommunicationClaim.ContentAttachmentType] = 'application/fhir+json';
    this.communicationClaims[CommunicationClaim.ContentAttachmentData] = encodeBundleToBase64(this.bundleInMemory);

    const activeSubject = this.resolveCurrentSubject();
    if (activeSubject) {
      this.communicationClaims[CommunicationClaim.Subject] = activeSubject;
    }
  }

  private resolveCurrentSubject(): string | undefined {
    if (this.activeEntryIndex !== null) {
      const claims = this.bundleInMemory.data[this.activeEntryIndex]?.resource?.meta?.claims || {};
      const consentSubject = asTrimmedString(claims[ClaimConsent.subject]);
      if (consentSubject) {
        return consentSubject;
      }
      const medicationSubject = asTrimmedString(claims[MedicationStatementClaim.Subject]);
      if (medicationSubject) {
        return medicationSubject;
      }
    }

    const fromClaims = asTrimmedString(this.communicationClaims[CommunicationClaim.Subject]);
    return fromClaims || undefined;
  }

  private findUpsertIndex(entry: BundleEntry, fullUrl?: string): number {
    if (fullUrl) {
      const byFullUrl = this.bundleInMemory.data.findIndex((item) => String(item?.fullUrl || '').trim() === fullUrl);
      if (byFullUrl >= 0) {
        return byFullUrl;
      }
    }

    const incomingClaims = entry.resource?.meta?.claims || {};
    const incomingIdentifier = this.resolveEntryIdentifier(incomingClaims);
    if (!incomingIdentifier) {
      return -1;
    }

    return this.bundleInMemory.data.findIndex((item) => {
      const itemClaims = item?.resource?.meta?.claims || {};
      return this.resolveEntryIdentifier(itemClaims) === incomingIdentifier;
    });
  }

  private resolveEntryIdentifier(claims: Record<string, unknown>): string {
    const consentIdentifier = asTrimmedString(claims[ClaimConsent.identifier]);
    if (consentIdentifier) {
      return `${ResourceTypesFhirR4.Consent}:${consentIdentifier}`;
    }

    const medicationIdentifier = asTrimmedString(claims[MedicationStatementClaim.Identifier]);
    if (medicationIdentifier) {
      return `${ResourceTypesFhirR4.MedicationStatement}:${medicationIdentifier}`;
    }

    return '';
  }

  private createBundleEntry(input: UpsertEntryInput): BundleEntry {
    const resourceClaims = {
      ...input.claims,
    };
    const canonicalEntryIdentifier = this.resolveEntryCanonicalIdValue(resourceClaims);

    return {
      id: canonicalEntryIdentifier || undefined,
      type: input.type || `${input.resourceType}-edit-request-v1.0`,
      fullUrl: input.fullUrl,
      request: input.request,
      resource: {
        resourceType: input.resourceType,
        meta: {
          claims: resourceClaims,
        },
      },
    } as BundleEntry;
  }

  private resolveEntryCanonicalIdValue(claims: Record<string, unknown>): string {
    const consentIdentifier = asTrimmedString(claims[ClaimConsent.identifier]);
    if (consentIdentifier) {
      return consentIdentifier;
    }

    const medicationIdentifier = asTrimmedString(claims[MedicationStatementClaim.Identifier]);
    if (medicationIdentifier) {
      return medicationIdentifier;
    }

    const communicationIdentifier = asTrimmedString(claims[CommunicationClaim.Identifier]);
    if (communicationIdentifier) {
      return communicationIdentifier;
    }

    return '';
  }

  private assertEntryIndex(index: number): void {
    if (!Number.isInteger(index) || index < 0 || index >= this.bundleInMemory.data.length) {
      throw new Error(`Entry index out of range: ${index}`);
    }
  }
}

function ensureEntryResource(entry: BundleEntry, mode: CommunicationBundleSessionMode): BundleEntryResource {
  const resource = entry.resource as BundleEntryResource | undefined;
  if (resource && typeof resource === 'object') {
    return resource;
  }
  if (mode === 'normalize') {
    return { meta: { claims: {} } };
  }
  throw new Error('Active entry does not contain a valid resource object.');
}

function validateBundleLike(bundle: BundleJsonApi<BundleEntry>, mode: CommunicationBundleSessionMode): void {
  const looksLikeBundle = bundle && bundle.resourceType === ResourceTypesFhirR4.Bundle && Array.isArray(bundle.data);
  if (looksLikeBundle) {
    return;
  }
  if (mode === 'normalize') {
    return;
  }
  throw new Error('Decoded attachment is not a valid BundleJsonApi payload.');
}

function createEmptyBundle(): BundleJsonApi<BundleEntry> {
  return {
    resourceType: ResourceTypesFhirR4.Bundle,
    type: 'batch',
    data: [],
  };
}

function encodeBundleToBase64(bundle: BundleJsonApi<BundleEntry>): string {
  return Buffer.from(JSON.stringify(bundle), 'utf8').toString('base64');
}

function cloneBundle(bundle: BundleJsonApi<BundleEntry>): BundleJsonApi<BundleEntry> {
  return JSON.parse(JSON.stringify(bundle)) as BundleJsonApi<BundleEntry>;
}

function cloneEntry(entry: BundleEntry): BundleEntry {
  return JSON.parse(JSON.stringify(entry)) as BundleEntry;
}

function asTrimmedString(value: unknown): string {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value).trim();
}
