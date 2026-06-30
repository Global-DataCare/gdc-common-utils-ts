// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { BundleEntry, BundleJsonApi } from '../models/bundle';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';
import { DocumentReferenceClaim } from '../models/interoperable-claims/document-reference-claims';
import {
  BundleEntryClaimsContext,
  type ActiveEntrySelection,
  type AddContainedDocumentToActiveEntryInput,
  type CommunicationAttachedBundleSessionMode,
  type CommunicationAttachedBundleSessionOptions,
  type UpsertClaimsResourceEntryInput,
  type UpsertEntryInput,
} from '../models/communication-attached-bundle-session';
import { BundleQuery, type BundleResourceIdFilters } from './bundle-query';
import { addClaimValues, getClaimValues, removeClaimValues } from '../claims/claim-list-helpers';
import type { MedicationStatementClaimsFlat } from '../models/interoperable-claims/medication-statement-claims';
import {
  asTrimmedString,
  cloneBundle,
  cloneEntry,
  cloneUnknownValue,
  createEmptyBundle,
  encodeBundleToBase64,
  ensureEntryResource,
  resolveBundleEntryCanonicalIdValue,
  resolveBundleEntryIdentifier,
  resolveContainedDocumentsClaimKey,
  resolveSubjectFromClaims,
  runtimeUuid,
  setIfMissing,
  splitCsv,
  validateBundleLike,
} from './communication-attached-bundle-session-helpers';

export {
  BundleEntryClaimsContext,
  CommunicationAttachmentClaimsContext,
  ConsentEditorScopeCodes,
  ConsentEditorTargetKinds,
} from '../models/communication-attached-bundle-session';
export type {
  ActiveEntrySelection,
  AddContainedDocumentToActiveEntryInput,
  CommunicationAttachedBundleSessionMode,
  CommunicationAttachedBundleSessionOptions,
  ConsentEditorClassifiedActors,
  ConsentEditorClassifiedPurpose,
  ConsentEditorClassifiedRole,
  ConsentEditorClassifiedRoles,
  ConsentEditorClassifiedTarget,
  ConsentEditorScopeCode,
  ConsentEditorTargetKind,
  ConsentViewModel,
  UpsertClaimsResourceEntryInput,
  UpsertEntryInput,
} from '../models/communication-attached-bundle-session';

/**
 * Communication editing session with bundle-in-memory as source of truth.
 *
 * Design contract:
 * - `activeEntry` is the real editing unit (not only `activeResource`), because
 *   it can include `fullUrl`, `request`, and entry-level context.
 * - `Communication.content-attachment-data` is always derived from the
 *   in-memory bundle after each committed update.
 * - saving can release active entry memory via `saveAndReleaseActiveEntry()`.
 * - consent onboarding should prefer semantic helpers first, but this session
 *   also exposes direct claim-level editing on the selected active entry.
 */
export class CommunicationAttachedBundleSession {
  private communicationClaims: Record<string, unknown>;
  private bundleInMemory: BundleJsonApi<BundleEntry>;
  private activeEntryIndex: number | null;
  private mode: CommunicationAttachedBundleSessionMode;

  constructor(options: CommunicationAttachedBundleSessionOptions = {}) {
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

  /** Returns the active entry position, or null when no entry is selected. */
  getActiveEntryPosition(): number | null {
    return this.activeEntryIndex;
  }

  /** Alias of `getActiveEntryIndex()` with entry-selection wording. */
  getSelectedEntryIndex(): number | null {
    return this.getActiveEntryIndex();
  }

  /** Alias of `getActiveEntryPosition()` with entry-selection wording. */
  getSelectedEntryPosition(): number | null {
    return this.getActiveEntryPosition();
  }

  /** Returns a deep copy of the active entry when selected. */
  getActiveEntry(): BundleEntry | null {
    if (this.activeEntryIndex === null) {
      return null;
    }
    return cloneEntry(this.bundleInMemory.data[this.activeEntryIndex]);
  }

  /** Alias of `getActiveEntry()` with entry-selection wording. */
  getSelectedEntry(): BundleEntry | null {
    return this.getActiveEntry();
  }

  /** Returns one claim from the currently selected active entry. */
  getActiveEntryClaim(key: string): unknown {
    const claims = this.getRequiredActiveEntryClaims();
    return cloneUnknownValue(claims[key]);
  }

  /** Alias of `getActiveEntryClaim()` with entry-selection wording. */
  getSelectedEntryClaim(key: string): unknown {
    return this.getActiveEntryClaim(key);
  }

  /** Returns whether the currently selected active entry carries one claim key. */
  hasActiveEntryClaim(key: string): boolean {
    const claims = this.getRequiredActiveEntryClaims();
    return Object.prototype.hasOwnProperty.call(claims, key);
  }

  /** Alias of `hasActiveEntryClaim()` with entry-selection wording. */
  hasSelectedEntryClaim(key: string): boolean {
    return this.hasActiveEntryClaim(key);
  }

  /** Sets one claim on the currently selected active entry and syncs the bundle attachment. */
  setActiveEntryClaim(key: string, value: unknown): this {
    const current = cloneEntry(this.getRequiredActiveEntry());
    const resource = ensureEntryResource(current, this.mode);
    resource.meta = resource.meta || {};
    resource.meta.claims = {
      ...(resource.meta.claims || {}),
      [String(key).trim()]: cloneUnknownValue(value),
    };
    current.resource = resource;
    this.bundleInMemory.data[this.activeEntryIndex as number] = current;
    this.syncAttachmentFromBundle();
    return this;
  }

  /** Alias of `setActiveEntryClaim()` with entry-selection wording. */
  setSelectedEntryClaim(key: string, value: unknown): this {
    return this.setActiveEntryClaim(key, value);
  }

  /** Appends one claim value on the currently selected active entry and syncs the bundle attachment. */
  addActiveEntryClaim(key: string, value: unknown): this {
    const current = cloneEntry(this.getRequiredActiveEntry());
    const resource = ensureEntryResource(current, this.mode);
    resource.meta = resource.meta || {};
    const claims = {
      ...(resource.meta.claims || {}),
    };
    const normalizedKey = String(key).trim();
    const currentValue = claims[normalizedKey];
    if (currentValue === undefined) {
      claims[normalizedKey] = cloneUnknownValue(value);
    } else if (Array.isArray(currentValue)) {
      claims[normalizedKey] = [...currentValue, cloneUnknownValue(value)];
    } else {
      claims[normalizedKey] = [currentValue, cloneUnknownValue(value)];
    }
    resource.meta.claims = claims;
    current.resource = resource;
    this.bundleInMemory.data[this.activeEntryIndex as number] = current;
    this.syncAttachmentFromBundle();
    return this;
  }

  /** Removes one claim from the currently selected active entry and syncs the bundle attachment. */
  removeActiveEntryClaim(key: string): this {
    const current = cloneEntry(this.getRequiredActiveEntry());
    const resource = ensureEntryResource(current, this.mode);
    resource.meta = resource.meta || {};
    const claims = {
      ...(resource.meta.claims || {}),
    };
    delete claims[String(key).trim()];
    resource.meta.claims = claims;
    current.resource = resource;
    this.bundleInMemory.data[this.activeEntryIndex as number] = current;
    this.syncAttachmentFromBundle();
    return this;
  }

  /** Selects an active entry by position or fullUrl. */
  selectActiveEntry(selection: ActiveEntrySelection): this {
    const requestedPosition = typeof selection.position === 'number'
      ? selection.position
      : selection.index;
    if (typeof requestedPosition === 'number') {
      this.assertEntryIndex(requestedPosition);
      this.activeEntryIndex = requestedPosition;
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

    throw new Error('selectActiveEntry requires either position or fullUrl.');
  }

  /** Alias of `selectActiveEntry()` with entry-selection wording. */
  selectEntry(selection: ActiveEntrySelection): this {
    return this.selectActiveEntry(selection);
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
   * Reusable resource-typed wrapper around `upsertActiveEntry(...)`.
   *
   * Resource-specific helpers should delegate here instead of re-embedding the
   * same `resourceType/fullUrl/type/request/claims` plumbing.
   */
  private upsertActiveClaimsResourceEntry<TClaims extends object>(
    resourceType: string,
    input: UpsertClaimsResourceEntryInput<TClaims>,
  ): this {
    return this.upsertActiveEntry({
      resourceType,
      claims: {
        ...(input.claims as object),
      },
      fullUrl: input.fullUrl,
      type: input.type,
      request: input.request,
    });
  }

  /**
   * Consent-first helper for developer onboarding.
   *
   * Expected keys should come from `ClaimConsent` in caller code.
   */
  upsertActiveConsentEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.Consent, input);
  }

  /**
   * MedicationStatement helper for IPS-in-Communication use cases.
   *
   * Expected keys should come from MedicationStatement claims constants.
   */
  upsertActiveMedicationStatementEntry(
    input: UpsertClaimsResourceEntryInput<MedicationStatementClaimsFlat | Record<string, unknown>>,
  ): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.MedicationStatement, input);
  }

  /**
   * DocumentReference helper for bundle-contained attachments linked from
   * other clinical resources through `*.contained-documents`.
   */
  upsertActiveDocumentReferenceEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.DocumentReference, input);
  }

  /**
   * Condition helper for IPS-in-Communication use cases.
   *
   * Expected keys should come from Condition claims constants.
   */
  upsertActiveConditionEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.Condition, input);
  }

  /**
   * Appointment helper for schedule/event flows carried inside Communication.
   *
   * Expected keys should come from Appointment claims constants.
   */
  upsertActiveAppointmentEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.Appointment, input);
  }

  /**
   * Observation helper for IPS-style and sectioned bundle authoring.
   *
   * Expected keys should come from Observation claims constants.
   */
  upsertActiveObservationEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.Observation, input);
  }

  /**
   * AllergyIntolerance helper for IPS-in-Communication use cases.
   *
   * Expected keys should come from AllergyIntolerance claims constants.
   */
  upsertActiveAllergyIntoleranceEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.AllergyIntolerance, input);
  }

  /** DiagnosticReport helper for report-in-Communication use cases. */
  upsertActiveDiagnosticReportEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.DiagnosticReport, input);
  }

  /** CarePlan helper for plan-in-Communication use cases. */
  upsertActiveCarePlanEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.CarePlan, input);
  }

  /** Procedure helper for procedure-in-Communication use cases. */
  upsertActiveProcedureEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.Procedure, input);
  }

  /** Immunization helper for immunization-in-Communication use cases. */
  upsertActiveImmunizationEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.Immunization, input);
  }

  /** Encounter helper for visit/event flows carried inside Communication. */
  upsertActiveEncounterEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.Encounter, input);
  }

  /** Device helper for device catalog or implant/device context flows. */
  upsertActiveDeviceEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.Device, input);
  }

  /** DeviceUseStatement helper for device usage flows carried inside Communication. */
  upsertActiveDeviceUseStatementEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.DeviceUseStatement, input);
  }

  /** Flag helper for alert/banner flows carried inside Communication. */
  upsertActiveFlagEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.Flag, input);
  }

  /** ClinicalImpression helper for assessment flows carried inside Communication. */
  upsertActiveClinicalImpressionEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.ClinicalImpression, input);
  }

  /** Coverage helper for entitlement/insurance flows carried inside Communication. */
  upsertActiveCoverageEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.Coverage, input);
  }

  /** AppointmentResponse helper for schedule-response flows carried inside Communication. */
  upsertActiveAppointmentResponseEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.AppointmentResponse, input);
  }

  /** Composition helper for document-structure flows carried inside Communication. */
  upsertActiveCompositionEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.Composition, input);
  }

  /** Location helper for schedule/place flows carried inside Communication. */
  upsertActiveLocationEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.Location, input);
  }

  /** Organization helper for provider/payer/department flows carried inside Communication. */
  upsertActiveOrganizationEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.Organization, input);
  }

  /** RelatedPerson helper for relationship/member flows carried inside Communication. */
  upsertActiveRelatedPersonEntry(input: UpsertClaimsResourceEntryInput<Record<string, unknown>>): this {
    return this.upsertActiveClaimsResourceEntry(ResourceTypesFhirR4.RelatedPerson, input);
  }

  /**
   * Creates or updates a linked `DocumentReference` entry and stores its
   * identifier under the active resource `*.contained-documents` claim.
   */
  addContainedDocumentToActiveEntry(input: AddContainedDocumentToActiveEntryInput): this {
    if (this.activeEntryIndex === null) {
      throw new Error('No active entry selected.');
    }

    const parentIndex = this.activeEntryIndex;
    const parentEntry = cloneEntry(this.bundleInMemory.data[parentIndex]);
    const parentResource = ensureEntryResource(parentEntry, this.mode);
    const parentClaims = {
      ...(parentResource.meta?.claims || {}),
    };
    const parentResourceType = asTrimmedString(parentResource.resourceType);
    const containedDocumentsClaimKey = resolveContainedDocumentsClaimKey(parentResourceType);
    if (!containedDocumentsClaimKey) {
      throw new Error(`Contained documents are not supported for resourceType: ${parentResourceType || 'unknown'}`);
    }

    const documentIdentifier = asTrimmedString(input.identifier)
      || asTrimmedString(input.claims?.[DocumentReferenceClaim.Identifier])
      || runtimeUuid('docref');
    const documentSubject = asTrimmedString(input.claims?.[DocumentReferenceClaim.Subject])
      || resolveSubjectFromClaims(parentClaims)
      || asTrimmedString(this.communicationClaims[CommunicationClaim.Subject]);

    const documentClaims: Record<string, unknown> = {
      '@context': BundleEntryClaimsContext,
      ...(input.claims || {}),
      [DocumentReferenceClaim.Identifier]: documentIdentifier,
    };

    if (documentSubject) {
      documentClaims[DocumentReferenceClaim.Subject] = documentSubject;
    }
    setIfMissing(documentClaims, DocumentReferenceClaim.ContentType, input.attachmentContentType);
    setIfMissing(documentClaims, DocumentReferenceClaim.ContentData, input.attachmentDataBase64);
    setIfMissing(documentClaims, DocumentReferenceClaim.Location, input.attachmentUrl);
    setIfMissing(documentClaims, DocumentReferenceClaim.Description, input.description);
    setIfMissing(documentClaims, DocumentReferenceClaim.Date, input.date);
    setIfMissing(documentClaims, DocumentReferenceClaim.Language, input.language);

    this.upsertActiveDocumentReferenceEntry({
      claims: documentClaims,
      fullUrl: input.fullUrl || `urn:uuid:${documentIdentifier}`,
    });

    parentResource.meta = parentResource.meta || {};
    parentResource.meta.claims = addClaimValues(
      parentClaims,
      containedDocumentsClaimKey,
      [documentIdentifier],
    );
    parentEntry.resource = parentResource;
    this.bundleInMemory.data[parentIndex] = parentEntry;
    this.activeEntryIndex = parentIndex;
    this.syncAttachmentFromBundle();
    return this;
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

  private getRequiredActiveEntry(): BundleEntry {
    if (this.activeEntryIndex === null) {
      throw new Error('No active entry selected.');
    }
    return this.bundleInMemory.data[this.activeEntryIndex];
  }

  private getRequiredActiveEntryClaims(): Record<string, unknown> {
    const current = cloneEntry(this.getRequiredActiveEntry());
    const resource = ensureEntryResource(current, this.mode);
    resource.meta = resource.meta || {};
    return {
      ...(resource.meta.claims || {}),
    };
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
      const entrySubject = resolveSubjectFromClaims(claims);
      if (entrySubject) {
        return entrySubject;
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
    return resolveBundleEntryIdentifier(claims);
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
    return resolveBundleEntryCanonicalIdValue(claims);
  }

  private assertEntryIndex(index: number): void {
    if (!Number.isInteger(index) || index < 0 || index >= this.bundleInMemory.data.length) {
      throw new Error(`Entry index out of range: ${index}`);
    }
  }
}
