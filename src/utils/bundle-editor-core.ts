/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - This file owns only bundle-level orchestration for `BundleEditor`.
 * - Shared helper logic belongs in `bundle-editor-helpers.ts`.
 * - Entry/resource-specific behavior belongs in dedicated `*-entry-editor.ts`
 *   modules, one exported class per file.
 */
import { ClaimsPersonSchemaorg } from '../constants/schemaorg';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import type { BundleEntry, BundleJsonApi, BundleRequest } from '../models/bundle';
import {
  AllowedResourceType,
  BundleEditorValidationIssues,
  BundleType,
  BundleTypes,
  type BuiltBundleEntry,
  type BundleEditorValidationIssue,
  type BundleOperation,
  type ResourceTypeEntryEditor,
} from '../models/bundle-editor-types';
import { AllergyIntoleranceClaim } from '../models/interoperable-claims/allergy-intolerance-claims';
import { CarePlanClaim } from '../models/interoperable-claims/care-plan-claims';
import { ClinicalImpressionClaim } from '../models/interoperable-claims/clinical-impression-claims';
import { CompositionClaim } from '../models/interoperable-claims/composition-claims';
import { ConditionClaim } from '../models/interoperable-claims/condition-claims';
import { CoverageClaim } from '../models/interoperable-claims/coverage-claims';
import { DeviceClaim } from '../models/interoperable-claims/device-claims';
import { DeviceUseStatementClaim } from '../models/interoperable-claims/device-use-statement-claims';
import { DiagnosticReportClaim } from '../models/interoperable-claims/diagnostic-report-claims';
import { DocumentReferenceClaim } from '../models/interoperable-claims/document-reference-claims';
import { EncounterClaim } from '../models/interoperable-claims/encounter-claims';
import { FlagClaim } from '../models/interoperable-claims/flag-claims';
import { ImmunizationClaim } from '../models/interoperable-claims/immunization-claims';
import {
  MedicationStatementClaim,
  MedicationStatementClaimsFhirApiExtended,
} from '../models/interoperable-claims/medication-statement-claims';
import { ObservationClaim } from '../models/interoperable-claims/observation-claims';
import { ProcedureClaim } from '../models/interoperable-claims/procedure-claims';
import { getClaimValues, setClaimValues } from '../claims/claim-list-helpers';
import { buildBundleDocumentFromClaims, type ValidateBundleDocumentResult } from './bundle-document-builder';
import {
  buildEmployeeBatchEntry,
  buildEmployeePurgeBundle,
  buildEmployeeSearchBundle,
  EmployeeBatchEntryTypes,
  EmployeeBundleMethods,
  EmployeeBundleOperations,
  EmployeeClaims,
  EmployeeResourceTypes,
  EmployeeSearchValue,
} from './employee';
import { BundleEntryEditor } from './bundle-entry-editor';
import {
  cloneClaimValue,
  cloneEntry,
  createCanonicalIdentifierUrn,
  inferGenericEntryType,
  normalizeContainedReference,
  normalizeOptionalIdentifier,
  resolveContainedFlagClaimKey,
  resolveContainedParentReferenceClaimKey,
  resolveContainedReferenceListClaimKey,
  resolveEntryTypeForOperation,
  resolveRequestMethodForOperation,
} from './bundle-editor-helpers';

export class BundleEditor {
  private bundleOperation: BundleOperation | null = null;
  private allowedResourceType: AllowedResourceType | null = null;
  private bundleType: BundleType = BundleTypes.batch;
  private compositionClaims: Record<string, unknown> = {};
  private readonly entries: BuiltBundleEntry[] = [];

  /**
   * Declares which business action this in-memory bundle is staging.
   *
   * Important distinction:
   * - this is **not** the same concept as FHIR `Bundle.entry.request.method`
   * - this is the higher-level action the editor is helping to assemble, for
   *   example `create`, `search`, `disable`, or `purge`
   * - the lower-level transport/request method may later be derived from that
   *   action, and may differ by backend contract
   *
   * Example:
   * - bundle operation `disable`
   * - current employee GW contract -> inner `entry.request.method = DELETE`
   * - current individual organization GW contract -> explicit `/_disable`
   *   route with inner `entry.request.method = POST`
   */
  public setBundleOperation(operation: BundleOperation): this {
    this.bundleOperation = operation;
    return this;
  }

  /**
   * Returns the current high-level business action assigned to the bundle.
   *
   * Read this as:
   * - "what am I trying to do?"
   *
   * not as:
   * - "which HTTP/FHIR request method will the final entry use?"
   */
  public getBundleOperation(): BundleOperation | null {
    return this.bundleOperation;
  }

  /**
   * Restricts the bundle to one resource type.
   *
   * For employee batch bundles this should be fixed to
   * `EmployeeResourceTypes.employee` so the editor cannot mix unrelated
   * resource kinds.
   */
  public setAllowedResourceType(resourceType: AllowedResourceType): this {
    this.allowedResourceType = resourceType;
    return this;
  }

  /** Returns the bundle resource type restriction when already declared. */
  public getAllowedResourceType(): AllowedResourceType | null {
    return this.allowedResourceType;
  }

  /** Declares which FHIR bundle shape the editor should materialize. */
  public setBundleType(type: BundleType): this {
    this.bundleType = type;
    return this;
  }

  /** Returns the declared target bundle shape. */
  public getBundleType(): BundleType {
    return this.bundleType;
  }

  public setCompositionIdentifier(identifier?: string | null): this {
    return this.setCompositionScalarClaim(CompositionClaim.Identifier, identifier);
  }

  /** Returns the normalized `Composition.identifier` staged for the future document root. */
  public getCompositionIdentifier(): string | undefined {
    return this.getCompositionScalarClaim(CompositionClaim.Identifier);
  }

  public setCompositionSubject(subject?: string | null): this {
    return this.setCompositionScalarClaim(CompositionClaim.Subject, subject);
  }

  /** Returns the normalized `Composition.subject` staged for the future document root. */
  public getCompositionSubject(): string | undefined {
    return this.getCompositionScalarClaim(CompositionClaim.Subject);
  }

  public setCompositionType(type?: string | null): this {
    return this.setCompositionScalarClaim(CompositionClaim.Type, type);
  }

  /** Returns the normalized `Composition.type` staged for the future document root. */
  public getCompositionType(): string | undefined {
    return this.getCompositionScalarClaim(CompositionClaim.Type);
  }

  public setCompositionTitle(title?: string | null): this {
    return this.setCompositionScalarClaim(CompositionClaim.Title, title);
  }

  /** Returns the normalized `Composition.title` staged for the future document root. */
  public getCompositionTitle(): string | undefined {
    return this.getCompositionScalarClaim(CompositionClaim.Title);
  }

  public setCompositionDate(date?: string | null): this {
    return this.setCompositionScalarClaim(CompositionClaim.Date, date);
  }

  /** Returns the normalized `Composition.date` staged for the future document root. */
  public getCompositionDate(): string | undefined {
    return this.getCompositionScalarClaim(CompositionClaim.Date);
  }

  public setCompositionAuthorList(references: readonly string[]): this {
    return this.setCompositionCsvClaimList(CompositionClaim.Author, references);
  }

  /** Returns the normalized `Composition.author` reference list staged for the future document root. */
  public getCompositionAuthorList(): string[] {
    return this.getCompositionCsvClaimList(CompositionClaim.Author);
  }

  /**
   * Opens one new entry and returns a generic entry editor for that slot.
   *
   * The entry editor can later expose resource-specific semantics through
   * methods such as `asEmployee()`.
   */
  public newEntry(resourceId?: string, resourceTypeOverride?: AllowedResourceType): BundleEntryEditor {
    const operation = this.requireBundleOperation();
    const resourceType = this.resolveEntryResourceType(resourceTypeOverride);
    const entry = this.createEntryDraft(operation, resourceType, resourceId);
    this.entries.push(entry);
    return new BundleEntryEditor(this, this.entries.length - 1);
  }

  /** Opens one new entry with an explicit resource type, mainly for document bundles. */
  public newEntryAs<T extends AllowedResourceType>(resourceType: T, resourceId?: string): ResourceTypeEntryEditor<T> {
    return this.newEntry(resourceId, resourceType).asResourceType(resourceType);
  }

  /** Reopens one existing entry by `resource.id` or `fullUrl`. */
  public openEntry(resourceIdOrFullUrl: string): BundleEntryEditor {
    const normalizedIdentifier = normalizeOptionalIdentifier(resourceIdOrFullUrl);
    if (!normalizedIdentifier) {
      throw new Error('openEntry requires a non-empty resource identifier or fullUrl.');
    }

    const entryIndex = this.entries.findIndex((entry) => {
      return normalizeOptionalIdentifier(entry.resource?.id) === normalizedIdentifier
        || normalizeOptionalIdentifier(entry.fullUrl) === normalizedIdentifier;
    });

    if (entryIndex < 0) {
      throw new Error(`openEntry could not find resource identifier or fullUrl: ${normalizedIdentifier}`);
    }

    return new BundleEntryEditor(this, entryIndex);
  }

  /** Returns cloned staged entries for inspection or debugging. */
  public getEntries(): readonly BuiltBundleEntry[] {
    return this.entries.map((entry) => cloneEntry(entry));
  }

  /** Returns the current Composition-level claims used when building a document bundle. */
  public getCompositionClaims(): Readonly<Record<string, unknown>> {
    return { ...this.compositionClaims };
  }

  /**
   * Validates whether the current editor state is sufficient to build one
   * clinical `Bundle.type=document`.
   */
  public validateDocumentAuthoring(): ValidateBundleDocumentResult {
    const issues: BundleEditorValidationIssue[] = [];
    if (this.bundleType !== BundleTypes.document) {
      issues.push(BundleEditorValidationIssues.DocumentModeRequired);
    }
    if (!this.getCompositionSubject()) {
      issues.push(BundleEditorValidationIssues.CompositionSubjectRequired);
    }
    if (!this.getCompositionType()) {
      issues.push(BundleEditorValidationIssues.CompositionTypeRequired);
    }
    if (!this.getCompositionTitle()) {
      issues.push(BundleEditorValidationIssues.CompositionTitleRequired);
    }
    if (!this.getCompositionDate()) {
      issues.push(BundleEditorValidationIssues.CompositionDateRequired);
    }
    if (this.getCompositionAuthorList().length === 0) {
      issues.push(BundleEditorValidationIssues.CompositionAuthorRequired);
    }
    if (this.entries.length === 0) {
      issues.push(BundleEditorValidationIssues.DocumentEntryRequired);
    }
    return {
      ok: issues.length === 0,
      issues,
    };
  }

  /** Builds one Composition-first document bundle from the staged resource entries. */
  public buildDocument(): Record<string, unknown> {
    const validation = this.validateDocumentAuthoring();
    if (!validation.ok) {
      throw new Error(`BundleEditor cannot build document: ${validation.issues.join(' ')}`);
    }
    return buildBundleDocumentFromClaims({
      claimsList: this.entries.map((entry) => ({ ...(entry.resource?.meta?.claims || {}) })),
      subjectDid: this.getCompositionSubject(),
      compositionType: this.getCompositionType(),
      compositionClaims: this.getCompositionClaims(),
    });
  }

  /**
   * Materializes the final bundle payload from the editor state.
   *
   * `build()` does not send, sign, or wrap the payload. It only returns the
   * final bundle object for the declared operation and staged entries.
   */
  public build():
    | ReturnType<typeof buildEmployeePurgeBundle>
    | ReturnType<typeof buildEmployeeSearchBundle>
    | {
      resourceType: 'Bundle';
      type: BundleType;
      entry: BuiltBundleEntry[];
    } {
    if (this.bundleType === BundleTypes.document) {
      return this.buildDocument() as {
        resourceType: 'Bundle';
        type: BundleType;
        entry: BuiltBundleEntry[];
      };
    }
    const operation = this.requireBundleOperation();
    const resourceType = this.requireAllowedResourceType();

    if (operation === EmployeeBundleOperations.search) {
      if (resourceType !== EmployeeResourceTypes.employee) {
        throw new Error(`BundleEditor search currently supports only resource type: ${EmployeeResourceTypes.employee}`);
      }
      return buildEmployeeSearchBundle({
        claims: this.getSingleSearchClaims(),
        resourceType,
      });
    }

    if (operation === EmployeeBundleOperations.purge) {
      if (resourceType !== EmployeeResourceTypes.employee) {
        throw new Error(`BundleEditor purge currently supports only resource type: ${EmployeeResourceTypes.employee}`);
      }
      return {
        resourceType: EmployeeResourceTypes.bundle,
        type: EmployeeResourceTypes.batch,
        entry: this.entries.map((entry) => {
          const identifier = normalizeOptionalIdentifier(
            entry.resource?.meta?.claims?.[ClaimsPersonSchemaorg.identifier]
              || entry.resource?.id
              || entry.fullUrl,
          );
          if (!identifier) {
            throw new Error('Every purge entry requires one canonical employee identifier.');
          }
          return buildEmployeePurgeBundle({
            identifier,
            resourceType,
          }).entry[0];
        }),
      };
    }

    return {
      resourceType: ResourceTypesFhirR4.Bundle,
      type: this.bundleType,
      entry: this.entries.map((entry) => cloneEntry(entry)),
    };
  }

  /**
   * Materializes the staged entries as the `BundleJsonApi` shape used by
   * `CommunicationAttachedBundleSession` and `ConsentAccessEditor`.
   *
   * Use this when the next layer edits bundle entries in-memory before another
   * runtime wraps or sends the bundle.
   */
  public buildJsonApi(): BundleJsonApi<BundleEntry> {
    return {
      resourceType: ResourceTypesFhirR4.Bundle,
      type: this.bundleType,
      data: this.entries.map((entry): BundleEntry => {
        const clonedEntry = cloneEntry(entry) as BuiltBundleEntry;
        const { request: _requestIgnored, ...clonedEntryWithoutRequest } = clonedEntry;
        const normalizedRequest: BundleRequest | undefined = clonedEntry.request
          ? {
            method: clonedEntry.request.method,
            url: clonedEntry.request.url || '',
          }
          : undefined;
        return normalizedRequest
          ? {
            ...clonedEntryWithoutRequest,
            request: normalizedRequest,
          }
          : clonedEntryWithoutRequest;
      }),
    };
  }

  /** @internal */
  public getMutableEntry(entryIndex: number): BuiltBundleEntry {
    if (!Number.isInteger(entryIndex) || entryIndex < 0 || entryIndex >= this.entries.length) {
      throw new Error(`BundleEditor could not open entry index: ${entryIndex}`);
    }
    return this.entries[entryIndex];
  }

  /** @internal */
  public removeMutableEntry(entryIndex: number): void {
    if (!Number.isInteger(entryIndex) || entryIndex < 0 || entryIndex >= this.entries.length) {
      throw new Error(`BundleEditor could not remove entry index: ${entryIndex}`);
    }
    this.entries.splice(entryIndex, 1);
  }

  /** @internal */
  public findEntryIndexByIdentifierOrFullUrl(resourceIdOrFullUrl: string): number {
    const normalizedIdentifier = normalizeOptionalIdentifier(resourceIdOrFullUrl);
    if (!normalizedIdentifier) {
      return -1;
    }
    return this.entries.findIndex((entry) => {
      return normalizeOptionalIdentifier(entry.resource?.id) === normalizedIdentifier
        || normalizeOptionalIdentifier(entry.fullUrl) === normalizedIdentifier;
    });
  }

  /**
   * Creates the mutable entry state that will later be wrapped by one entry editor.
   *
   * The draft seeds bundle-owned defaults such as:
   * - canonical internal identifier (`resource.id` / `fullUrl`)
   * - request method derived from the high-level bundle operation
   * - generic entry type string
   *
   * It does not yet imply that the public `<ResourceType>.identifier` claim was
   * written; the entry editor decides when that claim must be synchronized.
   */
  private createEntryDraft(
    operation: BundleOperation,
    resourceType: AllowedResourceType,
    resourceId?: string,
  ): BuiltBundleEntry {
    const normalizedIdentifier = operation === EmployeeBundleOperations.search
      ? normalizeOptionalIdentifier(resourceId)
      : (normalizeOptionalIdentifier(resourceId) || createCanonicalIdentifierUrn());
    const claims: EmployeeClaims = {
      '@context': 'org.schema',
      ...(normalizedIdentifier ? { [ClaimsPersonSchemaorg.identifier]: normalizedIdentifier } : {}),
    };

    if (resourceType !== EmployeeResourceTypes.employee) {
      return {
        type: inferGenericEntryType(resourceType, operation),
        request: { method: resolveRequestMethodForOperation(operation) },
        fullUrl: normalizedIdentifier,
        resource: {
          resourceType,
          ...(normalizedIdentifier ? { id: normalizedIdentifier } : {}),
          meta: { claims: {} },
        },
      };
    }

    const entry = buildEmployeeBatchEntry({
      type: resolveEntryTypeForOperation(operation),
      method: resolveRequestMethodForOperation(operation),
      resourceId: normalizedIdentifier,
      resourceType,
      claims,
    }) as BuiltBundleEntry;

    if (normalizedIdentifier) {
      entry.fullUrl = normalizedIdentifier;
    }

    return entry;
  }

  /**
   * Resolves which resource type one new entry should use.
   *
   * Non-document bundles stay homogeneous once an allowed resource type was
   * declared. Document bundles may stage multiple resource types and therefore
   * can use the override path repeatedly.
   */
  private resolveEntryResourceType(resourceTypeOverride?: AllowedResourceType): AllowedResourceType {
    const explicitResourceType = normalizeOptionalIdentifier(resourceTypeOverride);
    if (explicitResourceType) {
      if (
        this.bundleType !== BundleTypes.document
        && this.allowedResourceType
        && explicitResourceType !== this.allowedResourceType
      ) {
        throw new Error(
          `BundleEditor cannot mix resource types in ${this.bundleType} mode: ${this.allowedResourceType} vs ${explicitResourceType}`,
        );
      }
      return explicitResourceType;
    }
    if (!this.allowedResourceType) {
      throw new Error('BundleEditor requires setAllowedResourceType(...) before newEntry() or build().');
    }
    return this.allowedResourceType;
  }

  /**
   * Normalizes one single-entry search bundle into a plain claims object.
   *
   * Keep this internal because it is specific to the current search serialization
   * contract and should not become the public reader/editor story.
   */
  private getSingleSearchClaims(): Record<string, EmployeeSearchValue | undefined> {
    if (this.entries.length === 0) {
      return {};
    }

    if (this.entries.length > 1) {
      throw new Error('Search bundles currently support one entry per bundle.');
    }

    const claims = this.entries[0].resource?.meta?.claims || {};
    const searchClaims: Record<string, EmployeeSearchValue | undefined> = {};
    for (const [key, value] of Object.entries(claims)) {
      if (
        value === undefined
        || value === null
        || typeof value === 'string'
        || typeof value === 'number'
        || typeof value === 'boolean'
      ) {
        searchClaims[key] = value as EmployeeSearchValue | undefined;
      }
    }
    return searchClaims;
  }

  /** Returns the declared bundle operation or throws one onboarding-grade error. */
  private requireBundleOperation(): BundleOperation {
    if (!this.bundleOperation) {
      throw new Error('BundleEditor requires setBundleOperation(...) before newEntry() or build().');
    }
    return this.bundleOperation;
  }

  /** Returns the allowed resource type or throws when the editor was not initialized correctly. */
  private requireAllowedResourceType(): AllowedResourceType {
    if (!this.allowedResourceType) {
      throw new Error('BundleEditor requires setAllowedResourceType(...) before newEntry() or build().');
    }
    return this.allowedResourceType;
  }

  /**
   * Stores one Composition scalar claim in the staged document metadata.
   *
   * Callers should use semantic wrappers such as `setCompositionTitle(...)`
   * instead of touching claim keys directly.
   */
  private setCompositionScalarClaim(claimKey: string, value?: string | null): this {
    const normalized = normalizeOptionalIdentifier(value);
    if (!normalized) {
      delete this.compositionClaims[claimKey];
      return this;
    }
    this.compositionClaims[claimKey] = normalized;
    return this;
  }

  /**
   * Reads one normalized Composition scalar claim.
   *
   * This internal helper explains the otherwise opaque `getComposition...()`
   * implementations: they all delegate to the same normalized metadata store.
   */
  private getCompositionScalarClaim(claimKey: string): string | undefined {
    return normalizeOptionalIdentifier(this.compositionClaims[claimKey]);
  }

  /**
   * Stores one CSV-backed Composition claim list such as `Composition.author`.
   *
   * The editor keeps the flattened storage representation internal while the
   * public API exposes simple `string[]` setters/getters.
   */
  private setCompositionCsvClaimList(claimKey: string, values: readonly string[]): this {
    const next = setClaimValues({}, claimKey, values);
    const normalized = normalizeOptionalIdentifier(next[claimKey]);
    if (!normalized) {
      delete this.compositionClaims[claimKey];
      return this;
    }
    this.compositionClaims[claimKey] = normalized;
    return this;
  }

  /** Reads one CSV-backed Composition claim list as a normalized string array. */
  private getCompositionCsvClaimList(claimKey: string): string[] {
    return getClaimValues(this.compositionClaims, claimKey);
  }
}

/**
 * Generic editor for one staged bundle entry.
 *
 * This class only knows generic entry concerns such as:
 * - resource id
 * - fullUrl
 * - meta claims
 * - conversion to one resource-specific entry editor
 */
