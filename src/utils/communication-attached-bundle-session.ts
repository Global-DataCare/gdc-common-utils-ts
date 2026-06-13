// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import {
  getHealthcareProfessionalRolesBySector,
  getHealthcareRoleByClaim,
  HealthcareRoleFamilies,
  getHealthcareRolesByFamily,
  getHealthcareSectionsByFamily,
  getHealthcareSectionByCode,
  getHealthcareSectionFamilyByCode,
  HealthcareConsentPurposes,
  type HealthcareCanonicalSectionFamily,
  HealthcareCanonicalSectionFamilies,
  type HealthcareActorRoleDescriptor,
  type HealthcareRoleFamily,
  type HealthcareSectionDescriptor,
} from '../constants/healthcare';
import { type DataspaceSector } from '../constants/sectors';
import { ClaimConsent } from '../models/consent-rule';
import { AllergyIntoleranceClaim } from '../models/interoperable-claims/allergy-intolerance-claims';
import { BundleEntry, BundleEntryResource, BundleJsonApi, BundleRequest } from '../models/bundle';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';
import { ConditionClaim } from '../models/interoperable-claims/condition-claims';
import { DocumentReferenceClaim } from '../models/interoperable-claims/document-reference-claims';
import { BundleQuery, type BundleResourceIdFilters } from './bundle-query';
import { addClaimValues, getClaimValues, removeClaimValues } from '../claims/claim-list-helpers';
import {
  detectDuplicateConsentRuleConflicts,
  type ConsentDuplicateRuleConflict,
} from './consent-duplicate-rules.js';
import {
  MedicationStatementClaim,
  type MedicationStatementClaimsFlat,
} from '../models/interoperable-claims/medication-statement-claims';
import { ObservationClaim } from '../models/interoperable-claims/observation-claims';

export type CommunicationAttachedBundleSessionMode = 'strict' | 'normalize';

export type CommunicationAttachedBundleSessionOptions = Readonly<{
  communicationClaims?: Record<string, unknown>;
  initialBundle?: BundleJsonApi<BundleEntry>;
  mode?: CommunicationAttachedBundleSessionMode;
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

export const ConsentEditorTargetKinds = Object.freeze({
  Section: 'section',
  ResourceType: 'resource-type',
} as const);

export type ConsentEditorTargetKind =
  typeof ConsentEditorTargetKinds[keyof typeof ConsentEditorTargetKinds];

export const ConsentEditorScopeCodes = Object.freeze({
  Search: 's',
  Read: 'r',
  Create: 'c',
  Update: 'u',
  Delete: 'd',
} as const);

export type ConsentEditorScopeCode =
  typeof ConsentEditorScopeCodes[keyof typeof ConsentEditorScopeCodes];

export type ConsentEditorClassifiedScope = Readonly<{
  code: ConsentEditorScopeCode;
  display?: string;
}>;

export type ConsentEditorClassifiedTarget = Readonly<{
  target: Readonly<{
    kind: ConsentEditorTargetKind;
    code: string;
    display?: string;
    sectionFamily?: HealthcareCanonicalSectionFamily;
  }>;
  scopes: readonly ConsentEditorClassifiedScope[];
}>;

export type ConsentEditorClassifiedActorRole = Readonly<{
  codingSystem: string;
  code: string;
  display?: string;
}>;

export type ConsentEditorClassifiedRole = Readonly<{
  family?: HealthcareRoleFamily;
  codingSystem: string;
  code: string;
  display?: string;
  definition?: string;
}>;

export type ConsentEditorClassifiedRoles = Readonly<{
  professional: readonly ConsentEditorClassifiedRole[];
  relationship: readonly ConsentEditorClassifiedRole[];
  legalRepresentative: readonly ConsentEditorClassifiedRole[];
  other: readonly ConsentEditorClassifiedRole[];
}>;

type MutableConsentEditorClassifiedRoles = {
  professional: ConsentEditorClassifiedRole[];
  relationship: ConsentEditorClassifiedRole[];
  legalRepresentative: ConsentEditorClassifiedRole[];
  other: ConsentEditorClassifiedRole[];
};

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

  /** Returns a deep copy of the active entry when selected. */
  getActiveEntry(): BundleEntry | null {
    if (this.activeEntryIndex === null) {
      return null;
    }
    return cloneEntry(this.bundleInMemory.data[this.activeEntryIndex]);
  }

  /** Returns one claim from the currently selected active entry. */
  getActiveEntryClaim(key: string): unknown {
    const claims = this.getRequiredActiveEntryClaims();
    return cloneUnknownValue(claims[key]);
  }

  /** Returns whether the currently selected active entry carries one claim key. */
  hasActiveEntryClaim(key: string): boolean {
    const claims = this.getRequiredActiveEntryClaims();
    return Object.prototype.hasOwnProperty.call(claims, key);
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
   * DocumentReference helper for bundle-contained attachments linked from
   * other clinical resources through `*.contained-documents`.
   */
  upsertActiveDocumentReferenceEntry(input: Readonly<{
    claims: Record<string, unknown>;
    fullUrl?: string;
    type?: string;
    request?: BundleRequest;
  }>): this {
    return this.upsertActiveEntry({
      resourceType: ResourceTypesFhirR4.DocumentReference,
      claims: {
        ...input.claims,
      },
      fullUrl: input.fullUrl,
      type: input.type,
      request: input.request,
    });
  }

  /**
   * Condition helper for IPS-in-Communication use cases.
   *
   * Expected keys should come from Condition claims constants.
   */
  upsertActiveConditionEntry(input: Readonly<{
    claims: Record<string, unknown>;
    fullUrl?: string;
    type?: string;
    request?: BundleRequest;
  }>): this {
    return this.upsertActiveEntry({
      resourceType: ResourceTypesFhirR4.Condition,
      claims: {
        ...input.claims,
      },
      fullUrl: input.fullUrl,
      type: input.type,
      request: input.request,
    });
  }

  /**
   * Observation helper for IPS-style and sectioned bundle authoring.
   *
   * Expected keys should come from Observation claims constants.
   */
  upsertActiveObservationEntry(input: Readonly<{
    claims: Record<string, unknown>;
    fullUrl?: string;
    type?: string;
    request?: BundleRequest;
  }>): this {
    return this.upsertActiveEntry({
      resourceType: ResourceTypesFhirR4.Observation,
      claims: {
        ...input.claims,
      },
      fullUrl: input.fullUrl,
      type: input.type,
      request: input.request,
    });
  }

  /**
   * AllergyIntolerance helper for IPS-in-Communication use cases.
   *
   * Expected keys should come from AllergyIntolerance claims constants.
   */
  upsertActiveAllergyIntoleranceEntry(input: Readonly<{
    claims: Record<string, unknown>;
    fullUrl?: string;
    type?: string;
    request?: BundleRequest;
  }>): this {
    return this.upsertActiveEntry({
      resourceType: ResourceTypesFhirR4.AllergyIntolerance,
      claims: {
        ...input.claims,
      },
      fullUrl: input.fullUrl,
      type: input.type,
      request: input.request,
    });
  }

  /**
   * TODO(ips-next):
   * Add `upsertActiveDiagnosticReportEntry(...)` once the shared claim helpers
   * for `DiagnosticReport` are in place.
   *
   * Expected shape should mirror the existing resource helpers:
   * - `claims` authored with `@context = org.hl7.fhir.api`
   * - matching priority by `DiagnosticReport.identifier`
   * - support for linked `DocumentReference` ids through
   *   `DiagnosticReport.contained-documents`
   *
   * Intentionally not implemented in this pass:
   * - IPS authoring already works for the currently documented resources
   * - GW Core can already consume bundle-contained `DocumentReference` rows
   * - adding the DiagnosticReport editing surface now would expand the IPS
   *   contract further than intended for this release slice
   */

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
      '@context': 'org.hl7.fhir.api',
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
      const consentSubject = asTrimmedString(claims[ClaimConsent.subject]);
      if (consentSubject) {
        return consentSubject;
      }
      const medicationSubject = asTrimmedString(claims[MedicationStatementClaim.Subject]);
      if (medicationSubject) {
        return medicationSubject;
      }
      const conditionSubject = asTrimmedString(claims[ConditionClaim.Subject]);
      if (conditionSubject) {
        return conditionSubject;
      }
      const allergySubject = asTrimmedString(claims[AllergyIntoleranceClaim.Subject] || claims[AllergyIntoleranceClaim.Patient]);
      if (allergySubject) {
        return allergySubject;
      }
      const documentReferenceSubject = asTrimmedString(claims[DocumentReferenceClaim.Subject]);
      if (documentReferenceSubject) {
        return documentReferenceSubject;
      }
      const observationSubject = asTrimmedString(claims[ObservationClaim.Subject] || claims[ObservationClaim.Patient]);
      if (observationSubject) {
        return observationSubject;
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

    const conditionIdentifier = asTrimmedString(claims[ConditionClaim.Identifier]);
    if (conditionIdentifier) {
      return `${ResourceTypesFhirR4.Condition}:${conditionIdentifier}`;
    }

    const allergyIdentifier = asTrimmedString(claims[AllergyIntoleranceClaim.Identifier]);
    if (allergyIdentifier) {
      return `${ResourceTypesFhirR4.AllergyIntolerance}:${allergyIdentifier}`;
    }

    const documentReferenceIdentifier = asTrimmedString(claims[DocumentReferenceClaim.Identifier]);
    if (documentReferenceIdentifier) {
      return `${ResourceTypesFhirR4.DocumentReference}:${documentReferenceIdentifier}`;
    }

    const observationIdentifier = asTrimmedString(claims[ObservationClaim.Identifier]);
    if (observationIdentifier) {
      return `${ResourceTypesFhirR4.Observation}:${observationIdentifier}`;
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

    const conditionIdentifier = asTrimmedString(claims[ConditionClaim.Identifier]);
    if (conditionIdentifier) {
      return conditionIdentifier;
    }

    const allergyIdentifier = asTrimmedString(claims[AllergyIntoleranceClaim.Identifier]);
    if (allergyIdentifier) {
      return allergyIdentifier;
    }

    const documentReferenceIdentifier = asTrimmedString(claims[DocumentReferenceClaim.Identifier]);
    if (documentReferenceIdentifier) {
      return documentReferenceIdentifier;
    }

    const observationIdentifier = asTrimmedString(claims[ObservationClaim.Identifier]);
    if (observationIdentifier) {
      return observationIdentifier;
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

/**
 * High-level consent-access editor alias for onboarding and app-facing code.
 *
 * This keeps the business intent explicit for developers who are editing
 * Consent access rules inside a Communication-carried bundle and should not
 * need to start from the lower-level generic session name.
 */
export class ConsentAccessEditor extends CommunicationAttachedBundleSession {
  /** Returns duplicate atomic consent-rule conflicts across the current bundle. */
  getConsentRuleDuplicateConflicts(): ConsentDuplicateRuleConflict[] {
    return detectDuplicateConsentRuleConflicts(this.getBundleInMemory().data);
  }

  /** Returns duplicate atomic consent-rule conflicts affecting the active Consent entry. */
  getActiveConsentRuleDuplicateConflicts(): ConsentDuplicateRuleConflict[] {
    const activeEntryIndex = this.getActiveEntryIndex();
    if (activeEntryIndex === null) {
      return [];
    }
    return this.getConsentRuleDuplicateConflicts()
      .filter((conflict) => conflict.affectedEntries.some((entry) => entry.entryIndex === activeEntryIndex));
  }

  /** Returns one frontend-facing editable view model for the active Consent entry. */
  getConsentViewModel(): ConsentViewModel {
    const activeEntry = this.getActiveEntry();
    const claims = {
      ...(activeEntry?.resource?.meta?.claims || {}),
    };
    return {
      ...(activeEntry?.fullUrl ? { fullUrl: activeEntry.fullUrl } : {}),
      identifier: asTrimmedString(claims[ClaimConsent.identifier]),
      subject: asTrimmedString(claims[ClaimConsent.subject]),
      decision: this.getDecision(),
      classifiedActors: this.getActorsClassified(),
      classifiedRoles: this.getRolesClassified(),
      classifiedPurposes: this.getPurposesClassified(),
      classifiedTargets: this.getTargetsClassified(),
    };
  }

  /** Applies one frontend-facing editable view model back into the active Consent entry. */
  applyConsentViewModel(viewModel: ConsentViewModel): this {
    this.setActiveEntryClaim(ClaimConsent.identifier, viewModel.identifier);
    this.setActiveEntryClaim(ClaimConsent.subject, viewModel.subject);
    this.setActiveEntryClaim(ClaimConsent.decision, viewModel.decision);
    this.setActiveEntryClaimList(
      ClaimConsent.actorIdentifier,
      flattenClassifiedActors(viewModel.classifiedActors),
    );
    this.setSelectedRoles(flattenClassifiedRoles(viewModel.classifiedRoles));
    this.setSelectedPurposes(viewModel.classifiedPurposes.map((purpose) => purpose.code));

    const flattenedTargets = flattenClassifiedTargets(viewModel.classifiedTargets);
    this.setSelectedCoreSections(flattenedTargets.coreSections);
    this.setSelectedKindOfDocuments(flattenedTargets.kindOfDocuments);
    this.setSelectedTypeOfServices(flattenedTargets.typeOfServices);
    this.setSelectedSubjectMatterDomains(flattenedTargets.subjectMatterDomains);
    this.setSelectedResourceTypes(flattenedTargets.resourceTypes);
    return this;
  }

  /** Returns the canonical permit/deny decision from the active Consent entry. */
  getDecision(): string {
    return asTrimmedString(this.getActiveEntryClaim(ClaimConsent.decision));
  }

  /**
   * @deprecated Use `getDecision()`.
   * Kept as a compatibility alias for the previous helper name.
   */
  getPermit(): string {
    return this.getDecision();
  }

  /**
   * Returns target classification derived from the current consent claim
   * contract without altering or extending the persisted claim keys.
   */
  getTargetsClassified(): ConsentEditorClassifiedTarget[] {
    const claims = {
      ...(this.getActiveEntry()?.resource?.meta?.claims || {}),
    };
    const actionTargets = splitCsv(claims[ClaimConsent.action]).map((code) =>
      buildClassifiedConsentTarget(ConsentEditorTargetKinds.Section, code, [ConsentEditorScopeCodes.Read]));
    const categoryTargets = splitCsv(claims[ClaimConsent.category]).map((code) =>
      buildClassifiedConsentTarget(
        ConsentEditorTargetKinds.Section,
        code,
        [ConsentEditorScopeCodes.Read],
        HealthcareCanonicalSectionFamilies.KindOfDocument,
      ));
    const resourceTypes = splitCsv(claims[ClaimConsent.resourceType]).map((code) =>
      buildClassifiedConsentTarget(ConsentEditorTargetKinds.ResourceType, code, [ConsentEditorScopeCodes.Read]));

    return normalizeClassifiedTargets([
      ...actionTargets,
      ...categoryTargets,
      ...resourceTypes,
    ]);
  }

  /** Returns the catalog of core-section targets available for picker UIs. */
  getCoreSectionOptions(): readonly ConsentEditorClassifiedTarget[] {
    return buildSectionCatalogOptions(HealthcareCanonicalSectionFamilies.CoreSection);
  }

  /** Returns the core-section catalog keyed by LOINC code. */
  getCoreSectionCatalog(): Readonly<Record<string, HealthcareSectionDescriptor>> {
    return getHealthcareSectionsByFamily(HealthcareCanonicalSectionFamilies.CoreSection);
  }

  /** Returns the catalog of kind-of-document targets available for picker UIs. */
  getKindOfDocumentOptions(): readonly ConsentEditorClassifiedTarget[] {
    return buildSectionCatalogOptions(HealthcareCanonicalSectionFamilies.KindOfDocument);
  }

  /** Returns the kind-of-document catalog keyed by LOINC code. */
  getKindOfDocumentCatalog(): Readonly<Record<string, HealthcareSectionDescriptor>> {
    return getHealthcareSectionsByFamily(HealthcareCanonicalSectionFamilies.KindOfDocument);
  }

  /** Returns the catalog of type-of-service targets available for picker UIs. */
  getTypeOfServiceOptions(): readonly ConsentEditorClassifiedTarget[] {
    return buildSectionCatalogOptions(HealthcareCanonicalSectionFamilies.TypeOfService);
  }

  /** Returns the type-of-service catalog keyed by LOINC code. */
  getTypeOfServiceCatalog(): Readonly<Record<string, HealthcareSectionDescriptor>> {
    return getHealthcareSectionsByFamily(HealthcareCanonicalSectionFamilies.TypeOfService);
  }

  /** Returns the catalog of subject-matter-domain targets available for picker UIs. */
  getSubjectMatterDomainOptions(): readonly ConsentEditorClassifiedTarget[] {
    return buildSectionCatalogOptions(HealthcareCanonicalSectionFamilies.SubjectMatterDomain);
  }

  /** Returns the subject-matter-domain catalog keyed by LOINC code. */
  getSubjectMatterDomainCatalog(): Readonly<Record<string, HealthcareSectionDescriptor>> {
    return getHealthcareSectionsByFamily(HealthcareCanonicalSectionFamilies.SubjectMatterDomain);
  }

  /** Returns resource-type targets currently known in the active consent entry. */
  getResourceTypeOptions(): readonly ConsentEditorClassifiedTarget[] {
    return this.getSelectedResourceTypes().map((code) =>
      buildClassifiedConsentTarget(ConsentEditorTargetKinds.ResourceType, code, [ConsentEditorScopeCodes.Read]));
  }

  /** Returns the supported resource-type catalog. */
  getResourceTypeCatalog(): readonly string[] {
    return Object.values(ResourceTypesFhirR4).filter((resourceType) => resourceType !== ResourceTypesFhirR4.Bundle);
  }

  /** Returns the available professional roles for one sector. */
  getAvailableProfessionalRolesBySector(
    sector: DataspaceSector,
  ): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
    return getHealthcareProfessionalRolesBySector(sector);
  }

  /** Returns the available HL7 relationship roles. */
  getAvailableRelationshipRoles(): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
    return getHealthcareRolesByFamily(HealthcareRoleFamilies.PersonalRelationshipHl7);
  }

  /** Returns selected core-section claim values. */
  getSelectedCoreSections(): string[] {
    return this.getSelectedSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.CoreSection,
    );
  }

  /** Returns selected kind-of-document claim values. */
  getSelectedKindOfDocuments(): string[] {
    return splitCsv(this.getActiveEntryClaim(ClaimConsent.category));
  }

  /** Returns selected type-of-service claim values. */
  getSelectedTypeOfServices(): string[] {
    return this.getSelectedSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.TypeOfService,
    );
  }

  /** Returns selected subject-matter-domain claim values. */
  getSelectedSubjectMatterDomains(): string[] {
    return this.getSelectedSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.SubjectMatterDomain,
    );
  }

  /** Returns selected resource-type claim values. */
  getSelectedResourceTypes(): string[] {
    return splitCsv(this.getActiveEntryClaim(ClaimConsent.resourceType));
  }

  /** Replaces selected core-section claim values while preserving other families. */
  setSelectedCoreSections(codes: readonly string[]): this {
    return this.setSelectedSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.CoreSection,
      codes,
    );
  }

  /** Replaces selected kind-of-document claim values. */
  setSelectedKindOfDocuments(codes: readonly string[]): this {
    return this.setActiveEntryClaimList(ClaimConsent.category, codes);
  }

  /** Replaces selected type-of-service claim values while preserving other families. */
  setSelectedTypeOfServices(codes: readonly string[]): this {
    return this.setSelectedSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.TypeOfService,
      codes,
    );
  }

  /** Replaces selected subject-matter-domain claim values while preserving other families. */
  setSelectedSubjectMatterDomains(codes: readonly string[]): this {
    return this.setSelectedSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.SubjectMatterDomain,
      codes,
    );
  }

  /** Replaces selected resource-type claim values. */
  setSelectedResourceTypes(codes: readonly string[]): this {
    return this.setActiveEntryClaimList(ClaimConsent.resourceType, codes);
  }

  /** Adds core-section claim values without removing other selected targets. */
  addCoreSections(codes: readonly string[]): this {
    return this.addSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.CoreSection,
      codes,
    );
  }

  /** Removes selected core-section claim values. */
  removeCoreSections(codes: readonly string[]): this {
    return this.removeSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.CoreSection,
      codes,
    );
  }

  /** Adds kind-of-document claim values. */
  addKindOfDocuments(codes: readonly string[]): this {
    return this.addActiveEntryClaimList(ClaimConsent.category, codes);
  }

  /** Removes kind-of-document claim values. */
  removeKindOfDocuments(codes: readonly string[]): this {
    return this.removeActiveEntryClaimList(ClaimConsent.category, codes);
  }

  /** Adds type-of-service claim values without removing other selected targets. */
  addTypeOfServices(codes: readonly string[]): this {
    return this.addSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.TypeOfService,
      codes,
    );
  }

  /** Removes selected type-of-service claim values. */
  removeTypeOfServices(codes: readonly string[]): this {
    return this.removeSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.TypeOfService,
      codes,
    );
  }

  /** Adds subject-matter-domain claim values without removing other selected targets. */
  addSubjectMatterDomains(codes: readonly string[]): this {
    return this.addSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.SubjectMatterDomain,
      codes,
    );
  }

  /** Removes selected subject-matter-domain claim values. */
  removeSubjectMatterDomains(codes: readonly string[]): this {
    return this.removeSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.SubjectMatterDomain,
      codes,
    );
  }

  /** Adds resource-type claim values. */
  addResourceTypes(codes: readonly string[]): this {
    return this.addActiveEntryClaimList(ClaimConsent.resourceType, codes);
  }

  /** Removes resource-type claim values. */
  removeResourceTypes(codes: readonly string[]): this {
    return this.removeActiveEntryClaimList(ClaimConsent.resourceType, codes);
  }

  /** Returns purposes as explicit classified items. */
  getPurposesClassified(): ConsentEditorClassifiedPurpose[] {
    return this.getSelectedPurposes().map((code) => ({
      code,
      display: resolveConsentPurposeDisplay(code),
    }));
  }

  /** Returns selected purpose claim values. */
  getSelectedPurposes(): string[] {
    return splitCsv(this.getActiveEntryClaim(ClaimConsent.purpose));
  }

  /** Replaces selected purpose claim values. */
  setSelectedPurposes(codes: readonly string[]): this {
    return this.setActiveEntryClaimList(ClaimConsent.purpose, codes);
  }

  /** Adds purpose claim values. */
  addPurposes(codes: readonly string[]): this {
    return this.addActiveEntryClaimList(ClaimConsent.purpose, codes);
  }

  /** Removes purpose claim values. */
  removePurposes(codes: readonly string[]): this {
    return this.removeActiveEntryClaimList(ClaimConsent.purpose, codes);
  }

  /** Returns selected actor roles as explicit classified items. */
  getRolesClassified(): ConsentEditorClassifiedRoles {
    const classified: MutableConsentEditorClassifiedRoles = {
      professional: [],
      relationship: [],
      legalRepresentative: [],
      other: [],
    };

    for (const roleToken of this.getSelectedRoles()) {
      const role = getHealthcareRoleByClaim(roleToken);
      if (!role) {
        classified.other.push({
          codingSystem: '',
          code: roleToken,
          display: roleToken,
        });
        continue;
      }

      const nextRole: ConsentEditorClassifiedRole = {
        family: role.family,
        codingSystem: role.codingSystem,
        code: role.code,
        display: role.titleEn,
        definition: role.definition,
      };

      if (role.family === HealthcareRoleFamilies.ProfessionalOccupationIsco08) {
        classified.professional.push(nextRole);
      } else if (role.family === HealthcareRoleFamilies.PersonalRelationshipHl7) {
        classified.relationship.push(nextRole);
      } else if (role.family === HealthcareRoleFamilies.LegalRepresentativeHl7) {
        classified.legalRepresentative.push(nextRole);
      } else {
        classified.other.push(nextRole);
      }
    }

    return classified;
  }

  /** Returns selected actor-role claim values. */
  getSelectedRoles(): string[] {
    return splitCsv(this.getActiveEntryClaim(ClaimConsent.actorRole));
  }

  /** Replaces selected actor-role claim values. */
  setSelectedRoles(codes: readonly string[]): this {
    return this.setActiveEntryClaimList(ClaimConsent.actorRole, codes);
  }

  /** Adds actor-role claim values. */
  addRoles(codes: readonly string[]): this {
    return this.addActiveEntryClaimList(ClaimConsent.actorRole, codes);
  }

  /** Removes actor-role claim values. */
  removeRoles(codes: readonly string[]): this {
    return this.removeActiveEntryClaimList(ClaimConsent.actorRole, codes);
  }

  /** Returns consent actors grouped by jurisdiction, organization, and user. */
  getActorsClassified(): ConsentEditorClassifiedActors {
    const claims = {
      ...(this.getActiveEntry()?.resource?.meta?.claims || {}),
    };
    const actorTokens = splitCsv(claims[ClaimConsent.actorIdentifier]);
    const actorRole = parseConsentActorRole(splitCsv(claims[ClaimConsent.actorRole])[0] || '');

    const jurisdictions = new Map<string, ConsentEditorClassifiedJurisdiction>();
    const organizations = new Map<string, ConsentEditorClassifiedOrganization>();
    const users = new Map<string, ConsentEditorClassifiedUser>();

    for (const token of actorTokens) {
      if (looksLikeJurisdictionToken(token)) {
        jurisdictions.set(token, { code: token, display: token });
        continue;
      }

      if (looksLikeEmailToken(token)) {
        users.set(`email:${token}`, {
          email: token,
          ...(actorRole ? { role: actorRole } : {}),
        });
        continue;
      }

      if (looksLikePhoneToken(token)) {
        users.set(`phone:${token}`, {
          phone: token,
          ...(actorRole ? { role: actorRole } : {}),
        });
        continue;
      }

      const organization = parseDidWebOrganizationToken(token);
      if (organization) {
        organizations.set(organization.domain, organization);
      }
    }

    return {
      jurisdictions: Array.from(jurisdictions.values()),
      organizations: Array.from(organizations.values()),
      users: Array.from(users.values()),
    };
  }

  private getSelectedSectionCodesByFamily(
    claimKey: string,
    family: HealthcareCanonicalSectionFamily,
  ): string[] {
    return splitCsv(this.getActiveEntryClaim(claimKey))
      .filter((code) => getHealthcareSectionFamilyByCode(code) === family);
  }

  private setSelectedSectionCodesByFamily(
    claimKey: string,
    family: HealthcareCanonicalSectionFamily,
    codes: readonly string[],
  ): this {
    const preserved = splitCsv(this.getActiveEntryClaim(claimKey))
      .filter((code) => getHealthcareSectionFamilyByCode(code) !== family);
    return this.setActiveEntryClaimList(claimKey, [...preserved, ...codes]);
  }

  private addSectionCodesByFamily(
    claimKey: string,
    family: HealthcareCanonicalSectionFamily,
    codes: readonly string[],
  ): this {
    const next = [...this.getSelectedSectionCodesByFamily(claimKey, family), ...codes];
    return this.setSelectedSectionCodesByFamily(claimKey, family, next);
  }

  private removeSectionCodesByFamily(
    claimKey: string,
    family: HealthcareCanonicalSectionFamily,
    codes: readonly string[],
  ): this {
    const codesToRemove = new Set(normalizeCsvValues(codes));
    const next = this.getSelectedSectionCodesByFamily(claimKey, family)
      .filter((code) => !codesToRemove.has(code));
    return this.setSelectedSectionCodesByFamily(claimKey, family, next);
  }

  private setActiveEntryClaimList(key: string, values: readonly string[]): this {
    const normalized = normalizeCsvValues(values);
    if (normalized.length === 0) {
      return this.removeActiveEntryClaim(key);
    }
    return this.setActiveEntryClaim(key, normalized.join(CSV_SEPARATOR));
  }

  private addActiveEntryClaimList(key: string, values: readonly string[]): this {
    const next = normalizeCsvValues([
      ...splitCsv(this.getActiveEntryClaim(key)),
      ...values,
    ]);
    return this.setActiveEntryClaimList(key, next);
  }

  private removeActiveEntryClaimList(key: string, values: readonly string[]): this {
    const valuesToRemove = new Set(normalizeCsvValues(values));
    const next = splitCsv(this.getActiveEntryClaim(key))
      .filter((value) => !valuesToRemove.has(value));
    return this.setActiveEntryClaimList(key, next);
  }
}

/**
 * High-level factory for consent-access editing.
 *
 * Prefer this name in onboarding docs when the developer intent is:
 * "edit a Consent access bundle carried by a Communication".
 */
export function createConsentAccessEditor(
  options: CommunicationAttachedBundleSessionOptions = {},
): ConsentAccessEditor {
  return new ConsentAccessEditor(options);
}

function ensureEntryResource(entry: BundleEntry, mode: CommunicationAttachedBundleSessionMode): BundleEntryResource {
  const resource = entry.resource as BundleEntryResource | undefined;
  if (resource && typeof resource === 'object') {
    return resource;
  }
  if (mode === 'normalize') {
    return { meta: { claims: {} } };
  }
  throw new Error('Active entry does not contain a valid resource object.');
}

function validateBundleLike(bundle: BundleJsonApi<BundleEntry>, mode: CommunicationAttachedBundleSessionMode): void {
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

function cloneUnknownValue<T>(value: T): T {
  if (value === undefined) {
    return value;
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

function asTrimmedString(value: unknown): string {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value).trim();
}

function resolveContainedDocumentsClaimKey(resourceType: string): string {
  if (resourceType === ResourceTypesFhirR4.Consent) {
    return ClaimConsent.containedDocuments;
  }
  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    return MedicationStatementClaim.ContainedDocuments;
  }
  if (resourceType === ResourceTypesFhirR4.Condition) {
    return ConditionClaim.ContainedDocuments;
  }
  if (resourceType === ResourceTypesFhirR4.AllergyIntolerance) {
    return AllergyIntoleranceClaim.ContainedDocuments;
  }
  return '';
}

function resolveSubjectFromClaims(claims: Record<string, unknown>): string {
  return asTrimmedString(
    claims[ClaimConsent.subject]
    || claims[MedicationStatementClaim.Subject]
    || claims[ConditionClaim.Subject]
    || claims[AllergyIntoleranceClaim.Subject]
    || claims[AllergyIntoleranceClaim.Patient]
    || claims[DocumentReferenceClaim.Subject],
  );
}

function setIfMissing(target: Record<string, unknown>, key: string, value: unknown): void {
  if (target[key] !== undefined) {
    return;
  }
  if (value === undefined || value === null || String(value).trim() === '') {
    return;
  }
  target[key] = value;
}

function runtimeUuid(prefix: string): string {
  const cryptoLike = globalThis as typeof globalThis & {
    crypto?: { randomUUID?: () => string };
  };
  if (typeof cryptoLike.crypto?.randomUUID === 'function') {
    return cryptoLike.crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const CSV_SEPARATOR = ',';
const DID_WEB_PREFIX = 'did:web:';
const PHONE_PREFIX = 'tel:';

function splitCsv(value: unknown): string[] {
  return normalizeCsvValues(String(value || '').split(CSV_SEPARATOR));
}

function normalizeCsvValues(values: readonly unknown[]): string[] {
  return Array.from(new Set(
    values
      .map((item) => String(item || '').trim())
      .filter(Boolean),
  ));
}

function buildClassifiedConsentTarget(
  kind: ConsentEditorTargetKind,
  code: string,
  scopeCodes: readonly ConsentEditorScopeCode[],
  sectionFamily?: HealthcareCanonicalSectionFamily,
): ConsentEditorClassifiedTarget {
  const normalizedCode = String(code || '').trim();
  return {
    target: {
      kind,
      code: normalizedCode,
      display: resolveConsentTargetDisplay(kind, normalizedCode),
      ...(kind === ConsentEditorTargetKinds.Section
        ? { sectionFamily: sectionFamily || getHealthcareSectionFamilyByCode(normalizedCode) }
        : {}),
    },
    scopes: normalizeScopeCodes(scopeCodes).map((scopeCode) => ({
      code: scopeCode,
      display: resolveConsentScopeDisplay(scopeCode),
    })),
  };
}

function buildSectionCatalogOptions(
  family: HealthcareCanonicalSectionFamily,
): ConsentEditorClassifiedTarget[] {
  return Object.values(getHealthcareSectionsByFamily(family)).map((descriptor) =>
    buildClassifiedConsentTarget(
      ConsentEditorTargetKinds.Section,
      descriptor.attributeValue,
      [ConsentEditorScopeCodes.Read],
    ));
}

function normalizeScopeCodes(scopeCodes: readonly ConsentEditorScopeCode[]): ConsentEditorScopeCode[] {
  const values = Array.from(new Set(scopeCodes.map((scopeCode) => String(scopeCode).trim()).filter(Boolean)));
  return values.filter((scopeCode): scopeCode is ConsentEditorScopeCode =>
    Object.values(ConsentEditorScopeCodes).includes(scopeCode as ConsentEditorScopeCode),
  );
}

function normalizeClassifiedTargets(targets: readonly ConsentEditorClassifiedTarget[]): ConsentEditorClassifiedTarget[] {
  const result = new Map<string, ConsentEditorClassifiedTarget>();
  for (const target of targets) {
    const normalized = buildClassifiedConsentTarget(
      target.target.kind,
      String(target.target.code || '').trim(),
      target.scopes.map((scope) => scope.code),
      target.target.sectionFamily,
    );
    const key = `${normalized.target.kind}:${normalized.target.code}`;
    result.set(key, normalized);
  }
  return Array.from(result.values());
}

function resolveConsentTargetDisplay(kind: ConsentEditorTargetKind, code: string): string | undefined {
  if (kind === ConsentEditorTargetKinds.ResourceType) {
    return code;
  }
  if (kind === ConsentEditorTargetKinds.Section) {
    const loincCode = code.includes('|') ? code.split('|').slice(-1)[0] : code;
    return getHealthcareSectionByCode(loincCode)?.titleEn;
  }
  return undefined;
}

function resolveConsentScopeDisplay(scopeCode: ConsentEditorScopeCode): string {
  if (scopeCode === ConsentEditorScopeCodes.Search) return 'search';
  if (scopeCode === ConsentEditorScopeCodes.Read) return 'read';
  if (scopeCode === ConsentEditorScopeCodes.Create) return 'create';
  if (scopeCode === ConsentEditorScopeCodes.Update) return 'update';
  return 'delete';
}

function resolveConsentPurposeDisplay(code: string): string {
  const normalized = String(code || '').trim();
  if (normalized === HealthcareConsentPurposes.Treatment) {
    return 'Treatment';
  }
  if (normalized === HealthcareConsentPurposes.EmergencyTreatment) {
    return 'Emergency treatment';
  }
  if (normalized === HealthcareConsentPurposes.CareManagement) {
    return 'Care management';
  }
  if (normalized === HealthcareConsentPurposes.Operations) {
    return 'Operations';
  }
  if (normalized === HealthcareConsentPurposes.PatientAdministration) {
    return 'Patient administration';
  }
  if (normalized === HealthcareConsentPurposes.RecordsManagement) {
    return 'Records management';
  }
  return normalized;
}

function looksLikeEmailToken(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim().toLowerCase());
}

function looksLikePhoneToken(value: string): boolean {
  return String(value || '').trim().startsWith(PHONE_PREFIX);
}

function looksLikeJurisdictionToken(value: string): boolean {
  return /^[A-Z]{2}([\-:][A-Z0-9]+)?$/.test(String(value || '').trim());
}

function parseDidWebOrganizationToken(value: string): ConsentEditorClassifiedOrganization | undefined {
  const normalized = String(value || '').trim();
  if (!normalized.startsWith(DID_WEB_PREFIX)) {
    return undefined;
  }
  const segments = normalized.slice(DID_WEB_PREFIX.length).split(':').filter(Boolean);
  if (segments.length === 0) {
    return undefined;
  }
  const [domain, ...departmentSegments] = segments;
  return {
    domain,
    display: domain,
    departments: departmentSegments.map((segment) => ({
      code: segment,
      display: segment,
    })),
    locations: [],
  };
}

function parseConsentActorRole(value: string): ConsentEditorClassifiedActorRole | undefined {
  const normalized = String(value || '').trim();
  if (!normalized) {
    return undefined;
  }
  const healthcareRole = getHealthcareRoleByClaim(normalized);
  if (healthcareRole) {
    return {
      codingSystem: healthcareRole.codingSystem,
      code: healthcareRole.code,
      display: healthcareRole.titleEn,
    };
  }

  const separatorIndex = normalized.indexOf('|');
  if (separatorIndex < 0) {
    return {
      codingSystem: '',
      code: normalized,
      display: normalized,
    };
  }

  return {
    codingSystem: normalized.slice(0, separatorIndex),
    code: normalized.slice(separatorIndex + 1),
    display: normalized,
  };
}

function flattenClassifiedActors(classifiedActors: ConsentEditorClassifiedActors): string[] {
  return normalizeCsvValues([
    ...classifiedActors.jurisdictions.map((jurisdiction) => jurisdiction.code),
    ...classifiedActors.organizations.map(serializeClassifiedOrganization),
    ...classifiedActors.users.flatMap((user) => [user.email, user.phone]),
  ]);
}

function serializeClassifiedOrganization(organization: ConsentEditorClassifiedOrganization): string {
  const domain = String(organization.domain || '').trim();
  const departments = organization.departments
    .map((department) => String(department.code || '').trim())
    .filter(Boolean);
  return [DID_WEB_PREFIX.replace(/:$/, ''), domain, ...departments].join(':');
}

function flattenClassifiedRoles(classifiedRoles: ConsentEditorClassifiedRoles): string[] {
  return normalizeCsvValues([
    ...classifiedRoles.professional.map(serializeClassifiedRole),
    ...classifiedRoles.relationship.map(serializeClassifiedRole),
    ...classifiedRoles.legalRepresentative.map(serializeClassifiedRole),
    ...classifiedRoles.other.map(serializeClassifiedRole),
  ]);
}

function serializeClassifiedRole(role: ConsentEditorClassifiedRole): string {
  const descriptor = getHealthcareRoleByClaim(`${String(role.codingSystem || '').trim()}|${String(role.code || '').trim()}`);
  if (descriptor) {
    return descriptor.claim;
  }
  return String(role.code || '').trim() || String(role.display || '').trim();
}

function flattenClassifiedTargets(
  classifiedTargets: readonly ConsentEditorClassifiedTarget[],
): Readonly<{
  coreSections: readonly string[];
  kindOfDocuments: readonly string[];
  typeOfServices: readonly string[];
  subjectMatterDomains: readonly string[];
  resourceTypes: readonly string[];
}> {
  const coreSections: string[] = [];
  const kindOfDocuments: string[] = [];
  const typeOfServices: string[] = [];
  const subjectMatterDomains: string[] = [];
  const resourceTypes: string[] = [];

  for (const entry of normalizeClassifiedTargets(classifiedTargets)) {
    if (entry.target.kind === ConsentEditorTargetKinds.ResourceType) {
      resourceTypes.push(entry.target.code);
      continue;
    }

    const family = entry.target.sectionFamily || getHealthcareSectionFamilyByCode(entry.target.code);
    if (family === HealthcareCanonicalSectionFamilies.KindOfDocument) {
      kindOfDocuments.push(entry.target.code);
      continue;
    }
    if (family === HealthcareCanonicalSectionFamilies.TypeOfService) {
      typeOfServices.push(entry.target.code);
      continue;
    }
    if (family === HealthcareCanonicalSectionFamilies.SubjectMatterDomain) {
      subjectMatterDomains.push(entry.target.code);
      continue;
    }
    coreSections.push(entry.target.code);
  }

  return {
    coreSections: normalizeCsvValues(coreSections),
    kindOfDocuments: normalizeCsvValues(kindOfDocuments),
    typeOfServices: normalizeCsvValues(typeOfServices),
    subjectMatterDomains: normalizeCsvValues(subjectMatterDomains),
    resourceTypes: normalizeCsvValues(resourceTypes),
  };
}
