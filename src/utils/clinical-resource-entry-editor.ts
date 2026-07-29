/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - This file owns only the shared clinical-resource editing primitives.
 * - Concrete clinical resource surfaces must stay in their dedicated
 *   `*-entry-editor.ts` files.
 */
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import type { BundleEditor } from './bundle-editor-core';
import {
  AllowedResourceType,
  type ResourceTypeEntryEditor,
} from '../models/bundle-editor-types';
import { AllergyIntoleranceClaim } from '../models/interoperable-claims/allergy-intolerance-claims';
import { ConditionClaim } from '../models/interoperable-claims/condition-claims';
import { DiagnosticReportClaim } from '../models/interoperable-claims/diagnostic-report-claims';
import { MedicationStatementClaim } from '../models/interoperable-claims/medication-statement-claims';
import { ClaimConsent } from '../models/consent-rule';
import {
  cloneClaimValue,
  createCanonicalIdentifierUrn,
  normalizeContainedReference,
  normalizeOptionalIdentifier,
  resolveContainedFlagClaimKey,
  resolveContainedParentReferenceClaimKey,
  resolveContainedReferenceListClaimKey,
} from './bundle-editor-helpers';
import { BundleEntryEditor } from './bundle-entry-editor';
import { getClaimValues, setClaimValues } from '../claims/claim-list-helpers';

export class ClinicalResourceEntryEditor extends BundleEntryEditor {
  /**
   * Returns the best current identifier for the resource:
   * - public `<ResourceType>.identifier` claim first
   * - otherwise internal `resource.id`
   * - otherwise `fullUrl`
   *
   * This fallback order matters because the editor may stage one new entry
   * before the public identifier claim has been synchronized.
   */
  protected getIdentifierValue(claimKey: string): string | undefined {
    return normalizeOptionalIdentifier(
      this.getClaim(claimKey)
        || this.getResourceId()
        || this.getFullUrl(),
    );
  }

  protected setIdentifierValue(claimKey: string, identifier?: string | null): this {
    const normalized = normalizeOptionalIdentifier(identifier);
    if (!normalized) {
      this.removeClaim(claimKey);
      this.setResourceId(undefined);
      this.setFullUrl(undefined);
      return this;
    }
    this.setClaim(claimKey, normalized);
    this.setResourceId(normalized);
    this.setFullUrl(normalized);
    return this;
  }

  /** Writes the same subject value into both subject-style claim slots used by this resource family. */
  protected setSubjectClaims(subjectClaimKey: string, patientClaimKey: string, subject?: string | null): this {
    const normalized = normalizeOptionalIdentifier(subject);
    if (!normalized) {
      this.removeClaim(subjectClaimKey);
      this.removeClaim(patientClaimKey);
      return this;
    }
    this.setClaim(subjectClaimKey, normalized);
    this.setClaim(patientClaimKey, normalized);
    return this;
  }

  /** Reads the normalized subject value from the supported subject/patient claim aliases. */
  protected getSubjectClaims(subjectClaimKey: string, patientClaimKey: string): string | undefined {
    return normalizeOptionalIdentifier(
      this.getClaim(subjectClaimKey)
        || this.getClaim(patientClaimKey),
    );
  }

  /** Writes one trimmed string claim and removes the key when the value is blank. */
  protected setScalarClaim(claimKey: string, value?: string | null): this {
    const normalized = normalizeOptionalIdentifier(value);
    if (!normalized) {
      this.removeClaim(claimKey);
      return this;
    }
    return this.setClaim(claimKey, normalized);
  }

  /** Reads one string claim using the shared blank-to-undefined normalization rule. */
  protected getScalarClaim(claimKey: string): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(claimKey));
  }

  /** Stores one numeric claim through the flat-claims string representation used by the bundle editors. */
  protected setNumberClaim(claimKey: string, value?: number | null): this {
    if (value === undefined || value === null || Number.isNaN(value)) {
      this.removeClaim(claimKey);
      return this;
    }
    return this.setClaim(claimKey, String(value));
  }

  /** Reads one numeric flat claim and converts it back to a finite number when possible. */
  protected getNumberClaim(claimKey: string): number | undefined {
    const raw = this.getClaim(claimKey);
    if (raw === undefined || raw === null || raw === '') return undefined;
    const numeric = Number(raw);
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  /** Stores one boolean claim and removes it when the caller wants to clear the field. */
  protected setBooleanClaim(claimKey: string, value?: boolean | null): this {
    if (value === undefined || value === null) {
      this.removeClaim(claimKey);
      return this;
    }
    return this.setClaim(claimKey, value);
  }

  /** Reads one boolean claim while tolerating both real booleans and serialized `'true'` / `'false'` values. */
  protected getBooleanClaim(claimKey: string): boolean | undefined {
    const raw = this.getClaim(claimKey);
    if (typeof raw === 'boolean') return raw;
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    return undefined;
  }

  /** Stores one multi-value flat claim using the shared CSV serialization helper. */
  protected setCsvClaimList(claimKey: string, values: readonly string[]): this {
    const next = setClaimValues({}, claimKey, values);
    const normalized = normalizeOptionalIdentifier(next[claimKey]);
    if (!normalized) {
      this.removeClaim(claimKey);
      return this;
    }
    return this.setClaim(claimKey, normalized);
  }

  /** Reads one CSV-backed flat claim as a normalized string list. */
  protected getCsvClaimList(claimKey: string): string[] {
    return getClaimValues(this.getClaims(), claimKey);
  }

  /**
   * Ensures one canonical identifier across:
   * - public identifier claim
   * - `resource.id`
   * - `fullUrl`
   *
   * This is the preferred onboarding path after `newEntryAs(...)` /
   * `newContainedResourceAs(...)` when the entry was created without an
   * explicit id.
   */
  protected ensureIdentifierValue(claimKey: string): string {
    const existingClaim = normalizeOptionalIdentifier(this.getClaim(claimKey));
    if (existingClaim) return existingClaim;
    const existingResourceIdentifier = normalizeOptionalIdentifier(this.getResourceId() || this.getFullUrl());
    if (existingResourceIdentifier) {
      this.setIdentifierValue(claimKey, existingResourceIdentifier);
      return existingResourceIdentifier;
    }
    const generated = createCanonicalIdentifierUrn();
    this.setIdentifierValue(claimKey, generated);
    return generated;
  }

  /** Resolves which claim stores the CSV list of linked/contained resource references for this resource type. */
  protected getContainedReferenceListClaimKey(): string {
    const resourceType = String(this.getMutableEntry().resource?.resourceType || '').trim();
    const claimKey = resolveContainedReferenceListClaimKey(resourceType);
    if (!claimKey) {
      throw new Error(`Contained-reference linking is not supported for resource type: ${resourceType || '(unknown)'}`);
    }
    return claimKey;
  }

  /** Builds one resource-scoped claim key such as `MedicationStatement.language`. */
  protected getResourceScopedClaimKey(suffix: string): string {
    const resourceType = String(this.getMutableEntry().resource?.resourceType || '').trim();
    if (!resourceType) {
      throw new Error('Resource-scoped claim access requires one concrete resource type.');
    }
    return `${resourceType}.${String(suffix || '').trim()}`;
  }

  /** Returns the canonical `ResourceType/<identifier>` reference for the current staged entry. */
  protected getEntryReference(): string {
    const resourceType = String(this.getMutableEntry().resource?.resourceType || '').trim();
    const identifier = normalizeOptionalIdentifier(this.getResourceId() || this.getFullUrl());
    if (!resourceType || !identifier) {
      throw new Error('Contained-resource linking requires the parent entry to have a concrete resource type and identifier.');
    }
    return `${resourceType}/${identifier}`;
  }

  /** Replaces the linked child-resource reference list on the current parent resource. */
  public setContainedResourceReferenceList(references: readonly string[]): this {
    return this.setCsvClaimList(this.getContainedReferenceListClaimKey(), references);
  }

  /** Returns the normalized linked child-resource reference list for the current parent resource. */
  public getContainedResourceReferenceList(): string[] {
    return this.getCsvClaimList(this.getContainedReferenceListClaimKey());
  }

  /** Adds one child-resource reference to the parent list, deduplicating exact matches. */
  public addContainedResourceReference(reference: string): this {
    const next = [...this.getContainedResourceReferenceList(), String(reference || '').trim()]
      .filter(Boolean);
    return this.setContainedResourceReferenceList([...new Set(next)]);
  }

  /** Removes one child-resource reference from the parent list without touching any staged child entry. */
  public removeContainedResourceReference(reference: string): this {
    const normalized = String(reference || '').trim();
    if (!normalized) {
      return this;
    }
    return this.setContainedResourceReferenceList(
      this.getContainedResourceReferenceList().filter((item) => item !== normalized),
    );
  }

  /**
   * Creates one linked child entry, then seeds it from an already prepared claims object.
   *
   * Keep this as a plumbing/import helper. The 101 path should prefer
   * `newContainedResourceAs(...)` so the front edits the child through the
   * typed editor surface instead of raw claim objects.
   */
  public addContainedResourceByClaims(
    resourceType: AllowedResourceType,
    claims: Record<string, unknown>,
    resourceIdOrReference?: string,
    options?: Readonly<{ contained?: boolean }>,
  ): BundleEntryEditor {
    const seededIdentifier = normalizeOptionalIdentifier(resourceIdOrReference)
      || normalizeOptionalIdentifier(claims[`${resourceType}.identifier`])
      || createCanonicalIdentifierUrn();
    const containedEntry = this.addContainedResourceEntry(resourceType, seededIdentifier, options);

    Object.entries(claims || {}).forEach(([key, value]) => {
      containedEntry.setClaim(key, cloneClaimValue(value));
    });

    return containedEntry;
  }

  /**
   * Opens one linked child/sibling resource through the same `BundleEditor`.
   *
   * Default path:
   * - create one visible sibling resource
   * - link it from the parent CSV reference list
   *
   * Advanced path:
   * - pass `{ contained: true }` only when the FHIR export must rebuild the
   *   resource under `parent.contained[]`.
   */
  /**
   * Creates one linked child entry through the same bundle editor.
   *
   * Default behavior:
   * - create one visible sibling entry
   * - add its canonical `ResourceType/<id>` reference to the parent list
   *
   * Advanced behavior:
   * - `{ contained: true }` also marks the child so FHIR export can rebuild it
   *   under `parent.contained[]` instead of showing it as a normal top-level
   *   clinical resource entry.
   */
  public newContainedResource(
    resourceType: AllowedResourceType,
    resourceIdOrReference?: string,
    options?: Readonly<{ contained?: boolean }>,
  ): BundleEntryEditor {
    const parentReference = this.getEntryReference();
    const seededIdentifier = normalizeOptionalIdentifier(resourceIdOrReference) || createCanonicalIdentifierUrn();
    const normalizedContained = normalizeContainedReference(resourceType, seededIdentifier);
    const containedEntry = this.bundleEditor.newEntryAs(resourceType, normalizedContained.identifier);

    containedEntry
      .setResourceId(normalizedContained.identifier)
      .setFullUrl(normalizedContained.identifier)
      .setClaim(`${resourceType}.identifier`, normalizedContained.identifier);

    if (options?.contained) {
      containedEntry
        .setClaim(resolveContainedFlagClaimKey(resourceType), true)
        .setClaim(resolveContainedParentReferenceClaimKey(resourceType), parentReference);
    }

    this.addContainedResourceReference(normalizedContained.reference);
    return containedEntry;
  }

  /** Creates one linked child entry and immediately returns the typed editor for that child resource type. */
  public newContainedResourceAs<T extends AllowedResourceType>(
    resourceType: T,
    resourceIdOrReference?: string,
    options?: Readonly<{ contained?: boolean }>,
  ): ResourceTypeEntryEditor<T> {
    return this.newContainedResource(resourceType, resourceIdOrReference, options).asResourceType(resourceType);
  }

  /** @deprecated Use `newContainedResource(...)`. */
  public addContainedResourceEntry(
    resourceType: AllowedResourceType,
    resourceIdOrReference?: string,
    options?: Readonly<{ contained?: boolean }>,
  ): BundleEntryEditor {
    return this.newContainedResource(resourceType, resourceIdOrReference, options);
  }

  /**
   * Removes one linked child reference and, when the child was marked as
   * contained under this exact parent, also removes the staged child entry.
   */
  public removeContainedResourceByReference(reference: string): this {
    const parentReference = this.getEntryReference();
    const normalizedContained = normalizeContainedReference(
      String(reference || '').includes('/') ? String(reference || '').split('/')[0] : '',
      String(reference || ''),
    );
    const normalizedReference = normalizedContained.reference || String(reference || '').trim();
    const normalizedIdentifier = normalizedContained.identifier || normalizedReference.split('/').pop() || '';

    this.removeContainedResourceReference(normalizedReference);
    const childEntryIndex = this.bundleEditor.findEntryIndexByIdentifierOrFullUrl(normalizedIdentifier);
    if (childEntryIndex < 0) {
      return this;
    }

    const childEntry = this.bundleEditor.getMutableEntry(childEntryIndex);
    const childClaims = childEntry.resource?.meta?.claims || {};
    const childResourceType = String(childEntry.resource?.resourceType || '').trim();
    const childContainedFlagClaimKey = resolveContainedFlagClaimKey(childResourceType);
    const childContainedParentReferenceClaimKey = resolveContainedParentReferenceClaimKey(childResourceType);
    const isContainedChild = childClaims[childContainedFlagClaimKey] === true
      || childClaims[childContainedFlagClaimKey] === 'true';
    const childParentReference = normalizeOptionalIdentifier(childClaims[childContainedParentReferenceClaimKey]);

    if (isContainedChild && childParentReference === parentReference) {
      this.bundleEditor.removeMutableEntry(childEntryIndex);
    }

    return this;
  }

  /** Stores the generic `<ResourceType>.language` flat claim used by multilingual resource payloads. */
  public setLanguage(value?: string | null): this {
    return this.setScalarClaim(this.getResourceScopedClaimKey('language'), value);
  }

  /** Returns the generic `<ResourceType>.language` flat claim when present. */
  public getLanguage(): string | undefined {
    return this.getScalarClaim(this.getResourceScopedClaimKey('language'));
  }

  /**
   * Assigns the resource to one or more Composition sections.
   *
   * Section placement is document structure, not the resource's clinical
   * category. `BundleEditor.buildDocument()` consumes this
   * `<ResourceType>.section` claim to create `Composition.section.entry`
   * references without overloading fields such as
   * `AllergyIntolerance.category`.
   */
  public setSectionList(sectionCodes: readonly string[]): this {
    return this.setCsvClaimList(this.getResourceScopedClaimKey('section'), sectionCodes);
  }

  /** Returns the explicit Composition section codes staged for this resource. */
  public getSectionList(): string[] {
    return this.getCsvClaimList(this.getResourceScopedClaimKey('section'));
  }

  /** Adds one Composition section code while preserving existing assignments. */
  public addSection(sectionCode: string): this {
    const normalized = String(sectionCode || '').trim();
    return normalized
      ? this.setSectionList([...new Set([...this.getSectionList(), normalized])])
      : this;
  }

  /** Stores the generic `<ResourceType>.user-selected` flag used by self-managed user flows. */
  public setUserSelected(value?: boolean | null): this {
    return this.setBooleanClaim(this.getResourceScopedClaimKey('user-selected'), value);
  }

  /** Returns the generic `<ResourceType>.user-selected` flag when present. */
  public getUserSelected(): boolean | undefined {
    return this.getBooleanClaim(this.getResourceScopedClaimKey('user-selected'));
  }
}

/**
 * Reduced Observation component-style editor surface.
 *
 * This base layer owns the reusable code/value authoring helpers shared by
 * Vital Signs and broader Observation entry editors.
 */
