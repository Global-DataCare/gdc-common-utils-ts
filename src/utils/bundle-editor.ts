import { ClaimsPersonSchemaorg } from '../constants/schemaorg';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { ObservationCategoryCodes, VitalSignsCodes, VitalSignsUnits, type CodingDescriptor } from '../constants/vital-signs';
import { type BundleEntry, type BundleJsonApi, type BundleRequest } from '../models/bundle';
import { AllergyIntoleranceClaim } from '../models/interoperable-claims/allergy-intolerance-claims';
import { CarePlanClaim } from '../models/interoperable-claims/care-plan-claims';
import { ClinicalImpressionClaim } from '../models/interoperable-claims/clinical-impression-claims';
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
import {
  buildEmployeeBatchEntry,
  buildEmployeePurgeBundle,
  buildEmployeeSearchBundle,
  EmployeeBatchEntryTypes,
  EmployeeBatchMethod,
  EmployeeBundleMethods,
  EmployeeBundleOperations,
  EmployeeClaims,
  EmployeeResourceTypes,
  EmployeeSearchValue,
} from './employee';

export type BundleOperation =
  (typeof EmployeeBundleOperations)[keyof typeof EmployeeBundleOperations];

export const BundleEditableResourceTypes = Object.freeze({
  employee: EmployeeResourceTypes.employee,
  consent: ResourceTypesFhirR4.Consent,
  observation: ResourceTypesFhirR4.Observation,
  vitalSign: ResourceTypesFhirR4.Observation,
  allergyIntolerance: ResourceTypesFhirR4.AllergyIntolerance,
  condition: ResourceTypesFhirR4.Condition,
  medicationStatement: ResourceTypesFhirR4.MedicationStatement,
  documentReference: ResourceTypesFhirR4.DocumentReference,
  carePlan: ResourceTypesFhirR4.CarePlan,
  flag: ResourceTypesFhirR4.Flag,
  clinicalImpression: ResourceTypesFhirR4.ClinicalImpression,
  device: ResourceTypesFhirR4.Device,
  deviceUseStatement: ResourceTypesFhirR4.DeviceUseStatement,
  encounter: ResourceTypesFhirR4.Encounter,
  coverage: ResourceTypesFhirR4.Coverage,
  immunization: ResourceTypesFhirR4.Immunization,
  procedure: ResourceTypesFhirR4.Procedure,
  diagnosticReport: ResourceTypesFhirR4.DiagnosticReport,
} as const);

export type AllowedResourceType = string;

export type BuiltBundleEntry = {
  type: string;
  request: { method: BundleRequest['method']; url?: string };
  resource: {
    resourceType: string;
    id?: string;
    meta: { claims: EmployeeClaims };
    [key: string]: unknown;
  };
  fullUrl?: string;
};

function cloneEntry<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function cloneClaimValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return [...value] as T;
  }
  return value;
}

function normalizeOptionalIdentifier(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const normalized = String(value).trim();
  return normalized ? normalized : undefined;
}

function createCanonicalIdentifierUrn(): string {
  const cryptoLike = globalThis as typeof globalThis & {
    crypto?: { randomUUID?: () => string };
  };
  const uuid = typeof cryptoLike.crypto?.randomUUID === 'function'
    ? cryptoLike.crypto.randomUUID()
    : `resource-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `urn:uuid:${uuid}`;
}

function resolveRequestMethodForOperation(operation: BundleOperation): BundleRequest['method'] {
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

function resolveEntryTypeForOperation(operation: BundleOperation): string {
  switch (operation) {
    case EmployeeBundleOperations.disable:
      return EmployeeBatchEntryTypes.disable;
    case EmployeeBundleOperations.purge:
      return EmployeeBatchEntryTypes.purge;
    case EmployeeBundleOperations.search:
      return EmployeeBatchEntryTypes.search;
    case EmployeeBundleOperations.create:
    default:
      return EmployeeBatchEntryTypes.create;
  }
}

function inferGenericEntryType(resourceType: string, operation: BundleOperation): string {
  const normalizedResourceType = String(resourceType || '').trim();
  if (normalizedResourceType === EmployeeResourceTypes.employee) {
    return resolveEntryTypeForOperation(operation);
  }
  return `${normalizedResourceType}-${operation}-request-v1.0`;
}

/**
 * Generic bundle editor for FHIR-like bundle payloads assembled in memory.
 *
 * This class owns bundle-level concerns:
 * - which business operation the bundle represents
 * - which resource type the bundle allows
 * - which entries belong to the bundle
 * - when the final bundle is materialized through `build()`
 *
 * Resource-specific semantics belong to resource entry editors such as
 * `EmployeeEntryEditor`.
 */
export class BundleEditor {
  private bundleOperation: BundleOperation | null = null;
  private allowedResourceType: AllowedResourceType | null = null;
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

  /**
   * Opens one new entry and returns a generic entry editor for that slot.
   *
   * The entry editor can later expose resource-specific semantics through
   * methods such as `asEmployee()`.
   */
  public newEntry(resourceId?: string): BundleEntryEditor {
    const operation = this.requireBundleOperation();
    const resourceType = this.requireAllowedResourceType();
    const entry = this.createEntryDraft(operation, resourceType, resourceId);
    this.entries.push(entry);
    return new BundleEntryEditor(this, this.entries.length - 1);
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
      type: 'batch';
      entry: BuiltBundleEntry[];
    } {
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
      type: EmployeeResourceTypes.batch,
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
      type: EmployeeResourceTypes.batch,
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

  private requireBundleOperation(): BundleOperation {
    if (!this.bundleOperation) {
      throw new Error('BundleEditor requires setBundleOperation(...) before newEntry() or build().');
    }
    return this.bundleOperation;
  }

  private requireAllowedResourceType(): AllowedResourceType {
    if (!this.allowedResourceType) {
      throw new Error('BundleEditor requires setAllowedResourceType(...) before newEntry() or build().');
    }
    return this.allowedResourceType;
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
export class BundleEntryEditor {
  constructor(
    protected readonly bundleEditor: BundleEditor,
    protected readonly entryIndex: number,
  ) {}

  /** Opens the current entry as one employee-specific resource editor. */
  public asEmployee(): EmployeeEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== EmployeeResourceTypes.employee) {
      throw new Error(`BundleEntryEditor cannot open this entry as Employee: ${String(entry.resource?.resourceType || '')}`);
    }
    return new EmployeeEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one vital-sign-specific Observation editor. */
  public asVitalSign(): VitalSignEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Observation) {
      throw new Error(`BundleEntryEditor cannot open this entry as VitalSign: ${String(entry.resource?.resourceType || '')}`);
    }
    return new VitalSignEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one general Observation editor. */
  public asObservation(): ObservationEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Observation) {
      throw new Error(`BundleEntryEditor cannot open this entry as Observation: ${String(entry.resource?.resourceType || '')}`);
    }
    return new ObservationEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one AllergyIntolerance editor. */
  public asAllergy(): AllergyIntoleranceEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.AllergyIntolerance) {
      throw new Error(`BundleEntryEditor cannot open this entry as AllergyIntolerance: ${String(entry.resource?.resourceType || '')}`);
    }
    return new AllergyIntoleranceEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one Condition editor. */
  public asCondition(): ConditionEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Condition) {
      throw new Error(`BundleEntryEditor cannot open this entry as Condition: ${String(entry.resource?.resourceType || '')}`);
    }
    return new ConditionEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one MedicationStatement editor. */
  public asMedicationStatement(): MedicationStatementEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.MedicationStatement) {
      throw new Error(`BundleEntryEditor cannot open this entry as MedicationStatement: ${String(entry.resource?.resourceType || '')}`);
    }
    return new MedicationStatementEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one DocumentReference editor. */
  public asDocumentReference(): DocumentReferenceEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.DocumentReference) {
      throw new Error(`BundleEntryEditor cannot open this entry as DocumentReference: ${String(entry.resource?.resourceType || '')}`);
    }
    return new DocumentReferenceEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one CarePlan editor. */
  public asCarePlan(): CarePlanEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.CarePlan) {
      throw new Error(`BundleEntryEditor cannot open this entry as CarePlan: ${String(entry.resource?.resourceType || '')}`);
    }
    return new CarePlanEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one Flag editor. */
  public asFlag(): FlagEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Flag) {
      throw new Error(`BundleEntryEditor cannot open this entry as Flag: ${String(entry.resource?.resourceType || '')}`);
    }
    return new FlagEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one ClinicalImpression editor. */
  public asClinicalImpression(): ClinicalImpressionEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.ClinicalImpression) {
      throw new Error(`BundleEntryEditor cannot open this entry as ClinicalImpression: ${String(entry.resource?.resourceType || '')}`);
    }
    return new ClinicalImpressionEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one Device editor. */
  public asDevice(): DeviceEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Device) {
      throw new Error(`BundleEntryEditor cannot open this entry as Device: ${String(entry.resource?.resourceType || '')}`);
    }
    return new DeviceEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one DeviceUseStatement editor. */
  public asDeviceUseStatement(): DeviceUseStatementEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.DeviceUseStatement) {
      throw new Error(`BundleEntryEditor cannot open this entry as DeviceUseStatement: ${String(entry.resource?.resourceType || '')}`);
    }
    return new DeviceUseStatementEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one Encounter editor. */
  public asEncounter(): EncounterEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Encounter) {
      throw new Error(`BundleEntryEditor cannot open this entry as Encounter: ${String(entry.resource?.resourceType || '')}`);
    }
    return new EncounterEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one Coverage editor. */
  public asCoverage(): CoverageEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Coverage) {
      throw new Error(`BundleEntryEditor cannot open this entry as Coverage: ${String(entry.resource?.resourceType || '')}`);
    }
    return new CoverageEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one Immunization editor. */
  public asImmunization(): ImmunizationEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Immunization) {
      throw new Error(`BundleEntryEditor cannot open this entry as Immunization: ${String(entry.resource?.resourceType || '')}`);
    }
    return new ImmunizationEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one Procedure editor. */
  public asProcedure(): ProcedureEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Procedure) {
      throw new Error(`BundleEntryEditor cannot open this entry as Procedure: ${String(entry.resource?.resourceType || '')}`);
    }
    return new ProcedureEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one DiagnosticReport editor. */
  public asDiagnosticReport(): DiagnosticReportEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.DiagnosticReport) {
      throw new Error(`BundleEntryEditor cannot open this entry as DiagnosticReport: ${String(entry.resource?.resourceType || '')}`);
    }
    return new DiagnosticReportEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Reads one claim from this entry. */
  public getClaim(key: string): unknown {
    return cloneClaimValue(this.getClaims()[String(key).trim()]);
  }

  /** Checks whether this entry contains one claim key. */
  public hasClaim(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.getClaims(), String(key).trim());
  }

  /** Writes one claim on this entry. */
  public setClaim(key: string, value: unknown): this {
    const entry = this.getMutableEntry();
    entry.resource = entry.resource || {
      resourceType: this.bundleEditor.getAllowedResourceType() || EmployeeResourceTypes.employee,
      meta: { claims: {} },
    };
    entry.resource.meta = entry.resource.meta || {};
    entry.resource.meta.claims = {
      ...(entry.resource.meta.claims || {}),
      [String(key).trim()]: cloneClaimValue(value),
    };
    return this;
  }

  /** Appends one claim value on this entry. */
  public addClaim(key: string, value: unknown): this {
    const normalizedKey = String(key).trim();
    const current = this.getClaim(normalizedKey);
    if (current === undefined) {
      return this.setClaim(normalizedKey, value);
    }
    if (Array.isArray(current)) {
      return this.setClaim(normalizedKey, [...current, cloneClaimValue(value)]);
    }
    return this.setClaim(normalizedKey, [current, cloneClaimValue(value)]);
  }

  /** Removes one claim from this entry. */
  public removeClaim(key: string): this {
    const entry = this.getMutableEntry();
    const claims = {
      ...(entry.resource?.meta?.claims || {}),
    };
    delete claims[String(key).trim()];
    entry.resource = entry.resource || {
      resourceType: this.bundleEditor.getAllowedResourceType() || EmployeeResourceTypes.employee,
      meta: { claims: {} },
    };
    entry.resource.meta = entry.resource.meta || {};
    entry.resource.meta.claims = claims;
    return this;
  }

  /** Writes the staged entry `resource.id`. */
  public setResourceId(resourceId?: string | null): this {
    const entry = this.getMutableEntry();
    const normalized = normalizeOptionalIdentifier(resourceId);
    if (!normalized) {
      delete entry.resource?.id;
      return this;
    }
    entry.resource = entry.resource || {
      resourceType: this.bundleEditor.getAllowedResourceType() || EmployeeResourceTypes.employee,
      meta: { claims: {} },
    };
    entry.resource.id = normalized;
    return this;
  }

  /** Reads the staged entry `resource.id` when present. */
  public getResourceId(): string | undefined {
    return normalizeOptionalIdentifier(this.getMutableEntry().resource?.id);
  }

  /** Writes the staged entry `fullUrl`. */
  public setFullUrl(fullUrl?: string | null): this {
    const entry = this.getMutableEntry();
    const normalized = normalizeOptionalIdentifier(fullUrl);
    if (!normalized) {
      delete entry.fullUrl;
      return this;
    }
    entry.fullUrl = normalized;
    return this;
  }

  /** Reads the staged entry `fullUrl` when present. */
  public getFullUrl(): string | undefined {
    return normalizeOptionalIdentifier(this.getMutableEntry().fullUrl);
  }

  /** Returns control to the parent bundle editor. */
  public doneEntry(): BundleEditor {
    return this.bundleEditor;
  }

  protected getMutableEntry(): BuiltBundleEntry {
    return this.bundleEditor.getMutableEntry(this.entryIndex);
  }

  protected getClaims(): EmployeeClaims {
    return {
      ...(this.getMutableEntry().resource?.meta?.claims || {}),
    };
  }
}

/**
 * Shared claims-first editor utilities for IPS clinical resource families.
 *
 * The concrete resource type changes, but the editing contract stays aligned:
 * identifier + subject + status + date + optional CSV-backed reference lists.
 */
class ClinicalResourceEntryEditor extends BundleEntryEditor {
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

  protected getSubjectClaims(subjectClaimKey: string, patientClaimKey: string): string | undefined {
    return normalizeOptionalIdentifier(
      this.getClaim(subjectClaimKey)
        || this.getClaim(patientClaimKey),
    );
  }

  protected setScalarClaim(claimKey: string, value?: string | null): this {
    const normalized = normalizeOptionalIdentifier(value);
    if (!normalized) {
      this.removeClaim(claimKey);
      return this;
    }
    return this.setClaim(claimKey, normalized);
  }

  protected getScalarClaim(claimKey: string): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(claimKey));
  }

  protected setNumberClaim(claimKey: string, value?: number | null): this {
    if (value === undefined || value === null || Number.isNaN(value)) {
      this.removeClaim(claimKey);
      return this;
    }
    return this.setClaim(claimKey, String(value));
  }

  protected getNumberClaim(claimKey: string): number | undefined {
    const raw = this.getClaim(claimKey);
    if (raw === undefined || raw === null || raw === '') return undefined;
    const numeric = Number(raw);
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  protected setBooleanClaim(claimKey: string, value?: boolean | null): this {
    if (value === undefined || value === null) {
      this.removeClaim(claimKey);
      return this;
    }
    return this.setClaim(claimKey, value);
  }

  protected getBooleanClaim(claimKey: string): boolean | undefined {
    const raw = this.getClaim(claimKey);
    if (typeof raw === 'boolean') return raw;
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    return undefined;
  }

  protected setCsvClaimList(claimKey: string, values: readonly string[]): this {
    const next = setClaimValues({}, claimKey, values);
    const normalized = normalizeOptionalIdentifier(next[claimKey]);
    if (!normalized) {
      this.removeClaim(claimKey);
      return this;
    }
    return this.setClaim(claimKey, normalized);
  }

  protected getCsvClaimList(claimKey: string): string[] {
    return getClaimValues(this.getClaims(), claimKey);
  }

  protected ensureIdentifierValue(claimKey: string): string {
    const existing = this.getIdentifierValue(claimKey);
    if (existing) return existing;
    const generated = createCanonicalIdentifierUrn();
    this.setIdentifierValue(claimKey, generated);
    return generated;
  }
}

/**
 * Reduced Observation component-style editor surface.
 *
 * This base layer owns the reusable code/value authoring helpers shared by
 * Vital Signs and broader Observation entry editors.
 */
export class ObservationComponentEntryEditor extends BundleEntryEditor {
  public setCode(code: CodingDescriptor | string): this {
    const token = typeof code === 'string' ? code.trim() : code.claim;
    this.setClaim(ObservationClaim.Code, token);
    if (typeof code !== 'string') {
      this.setClaim(ObservationClaim.CodeSystem, code.system);
      this.setClaim(ObservationClaim.CodeValue, code.code);
      if (code.display) {
        this.setClaim(ObservationClaim.CodeDisplay, code.display);
      }
    }
    return this;
  }

  public getCode(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.Code));
  }

  public setCodeSystem(system: string): this {
    return this.setClaim(ObservationClaim.CodeSystem, String(system).trim());
  }

  public getCodeSystem(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.CodeSystem));
  }

  public setCodeValue(value: string): this {
    return this.setClaim(ObservationClaim.CodeValue, String(value).trim());
  }

  public getCodeValue(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.CodeValue));
  }

  public setCodeDisplay(display: string): this {
    return this.setClaim(ObservationClaim.CodeDisplay, String(display).trim());
  }

  public getCodeDisplay(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.CodeDisplay));
  }

  /**
   * Stores the local-language label used by forms and local UI copy.
   *
   * Keep this distinct from `setCodeDisplay(...)`, which is the canonical
   * English/international display carried by the coded concept.
   */
  public setCodeTextLocal(text: string): this {
    return this.setClaim(ObservationClaim.CodeText, String(text).trim());
  }

  /**
   * Returns the local-language label used by forms and local UI copy.
   *
   * Keep this distinct from `getCodeDisplay()`, which returns the canonical
   * English/international display when present.
   */
  public getCodeTextLocal(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.CodeText));
  }

  /** Compatibility alias for older examples/tests. Prefer `setCodeTextLocal(...)`. */
  public setLocalText(text: string): this {
    return this.setCodeTextLocal(text);
  }

  /** Compatibility alias for older examples/tests. Prefer `getCodeTextLocal()`. */
  public getLocalText(): string | undefined {
    return this.getCodeTextLocal();
  }

  public setValueQuantityNumber(value: number): this {
    return this.setClaim(ObservationClaim.ValueQuantityNumber, String(value));
  }

  public getValueQuantityNumber(): number | undefined {
    const raw = this.getClaim(ObservationClaim.ValueQuantityNumber);
    if (raw === undefined || raw === null || raw === '') return undefined;
    const numeric = Number(raw);
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  public setValueQuantityUnit(unit: CodingDescriptor | string): this {
    const normalized = typeof unit === 'string' ? unit.trim() : unit.claim;
    return this.setClaim(ObservationClaim.ValueQuantityUnit, normalized);
  }

  public getValueQuantityUnit(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.ValueQuantityUnit));
  }

  public setValueString(value: string): this {
    return this.setClaim(ObservationClaim.ValueString, String(value).trim());
  }

  public getValueString(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.ValueString));
  }

  public setValueDate(value: string): this {
    return this.setClaim(ObservationClaim.ValueDate, String(value).trim());
  }

  public getValueDate(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.ValueDate));
  }
}

/**
 * Vital-sign-specific editor surface for one staged Observation entry.
 *
 * This layer applies the visible/searchable Vital Signs claim contract on top
 * of the reduced Observation component helpers.
 */
export class VitalSignEntryEditor extends ObservationComponentEntryEditor {
  public setIdentifier(identifier?: string | null): this {
    const normalized = normalizeOptionalIdentifier(identifier);
    if (!normalized) {
      this.removeClaim(ObservationClaim.Identifier);
      this.setResourceId(undefined);
      this.setFullUrl(undefined);
      return this;
    }
    this.setClaim(ObservationClaim.Identifier, normalized);
    this.setResourceId(normalized);
    this.setFullUrl(normalized);
    return this;
  }

  public getIdentifier(): string | undefined {
    return normalizeOptionalIdentifier(
      this.getClaim(ObservationClaim.Identifier)
        || this.getResourceId()
        || this.getFullUrl(),
    );
  }

  public ensureIdentifier(): string {
    const existing = this.getIdentifier();
    if (existing) return existing;
    const generated = createCanonicalIdentifierUrn();
    this.setIdentifier(generated);
    return generated;
  }

  public setSubject(subject: string): this {
    const normalized = String(subject).trim();
    this.setClaim(ObservationClaim.Subject, normalized);
    this.setClaim(ObservationClaim.Patient, normalized);
    return this;
  }

  public getSubject(): string | undefined {
    return normalizeOptionalIdentifier(
      this.getClaim(ObservationClaim.Subject)
        || this.getClaim(ObservationClaim.Patient),
    );
  }

  public setStatus(status: string): this {
    return this.setClaim(ObservationClaim.Status, String(status).trim());
  }

  public getStatus(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.Status));
  }

  public setCategory(category: CodingDescriptor | string): this {
    const normalized = typeof category === 'string' ? category.trim() : category.claim;
    return this.setClaim(ObservationClaim.Category, normalized);
  }

  public getCategory(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.Category));
  }

  public setDate(date: string): this {
    const normalized = String(date).trim();
    this.setClaim(ObservationClaim.Date, normalized);
    this.setClaim(ObservationClaim.EffectiveDateTime, normalized);
    return this;
  }

  public getDate(): string | undefined {
    return normalizeOptionalIdentifier(
      this.getClaim(ObservationClaim.Date)
        || this.getClaim(ObservationClaim.EffectiveDateTime),
    );
  }

  public setNote(note: string): this {
    return this.setClaim(ObservationClaim.Note, String(note).trim());
  }

  public getNote(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.Note));
  }

  public setVitalSignType(code: CodingDescriptor, unit?: CodingDescriptor): this {
    this.setCategory(ObservationCategoryCodes.VitalSigns);
    this.setStatus(this.getStatus() || 'final');
    this.setCode(code);
    this.setCodeSystem(code.system);
    this.setCodeValue(code.code);
    if (code.display) {
      this.setCodeDisplay(code.display);
      this.setCodeTextLocal(code.display);
    }
    if (unit) {
      this.setValueQuantityUnit(unit);
    }
    return this;
  }

  public setHeartRate(value: number): this {
    return this
      .setVitalSignType(VitalSignsCodes.HeartRate, VitalSignsUnits.BeatsPerMinute)
      .setValueQuantityNumber(value);
  }

  public getHeartRate(): number | undefined {
    return this.getCodeValue() === VitalSignsCodes.HeartRate.code
      ? this.getValueQuantityNumber()
      : undefined;
  }

  public setBodyTemperature(value: number): this {
    return this
      .setVitalSignType(VitalSignsCodes.BodyTemperature, VitalSignsUnits.Celsius)
      .setValueQuantityNumber(value);
  }

  public getBodyTemperature(): number | undefined {
    return this.getCodeValue() === VitalSignsCodes.BodyTemperature.code
      ? this.getValueQuantityNumber()
      : undefined;
  }

  public setSystolicBloodPressure(value: number): this {
    return this
      .setVitalSignType(VitalSignsCodes.SystolicBloodPressure, VitalSignsUnits.MillimeterOfMercury)
      .setValueQuantityNumber(value);
  }

  public getSystolicBloodPressure(): number | undefined {
    return this.getCodeValue() === VitalSignsCodes.SystolicBloodPressure.code
      ? this.getValueQuantityNumber()
      : undefined;
  }

  public setDiastolicBloodPressure(value: number): this {
    return this
      .setVitalSignType(VitalSignsCodes.DiastolicBloodPressure, VitalSignsUnits.MillimeterOfMercury)
      .setValueQuantityNumber(value);
  }

  public getDiastolicBloodPressure(): number | undefined {
    return this.getCodeValue() === VitalSignsCodes.DiastolicBloodPressure.code
      ? this.getValueQuantityNumber()
      : undefined;
  }
}

/**
 * General Observation editor surface.
 *
 * This extends the Vital Sign editor so generic Observation rows can reuse the
 * same code/date/value helpers while adding broader Observation references.
 */
export class ObservationEntryEditor extends VitalSignEntryEditor {
  public setBasedOn(reference: string): this {
    return this.setClaim(ObservationClaim.BasedOn, String(reference).trim());
  }

  public getBasedOn(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.BasedOn));
  }

  public setEncounter(reference: string): this {
    return this.setClaim(ObservationClaim.Encounter, String(reference).trim());
  }

  public getEncounter(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.Encounter));
  }

  public setPerformer(reference: string): this {
    return this.setClaim(ObservationClaim.Performer, String(reference).trim());
  }

  public getPerformer(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.Performer));
  }

  public setHasMember(reference: string): this {
    return this.setClaim(ObservationClaim.HasMember, String(reference).trim());
  }

  public getHasMember(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.HasMember));
  }

  public setHasMemberList(references: readonly string[]): this {
    const next = setClaimValues({}, ObservationClaim.HasMember, references);
    const normalized = normalizeOptionalIdentifier(next[ObservationClaim.HasMember]);
    if (!normalized) {
      this.removeClaim(ObservationClaim.HasMember);
      return this;
    }
    return this.setClaim(ObservationClaim.HasMember, normalized);
  }

  public getHasMemberList(): string[] {
    return getClaimValues(this.getClaims(), ObservationClaim.HasMember);
  }
}

/** Claims-first editor for one staged AllergyIntolerance entry. */
export class AllergyIntoleranceEntryEditor extends ClinicalResourceEntryEditor {
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(AllergyIntoleranceClaim.Identifier, identifier); }
  public getIdentifier(): string | undefined { return this.getIdentifierValue(AllergyIntoleranceClaim.Identifier); }
  public ensureIdentifier(): string { return this.ensureIdentifierValue(AllergyIntoleranceClaim.Identifier); }
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(AllergyIntoleranceClaim.Subject, AllergyIntoleranceClaim.Patient, subject); }
  public getSubject(): string | undefined { return this.getSubjectClaims(AllergyIntoleranceClaim.Subject, AllergyIntoleranceClaim.Patient); }
  public setCode(code?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.Code, code); }
  public getCode(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.Code); }
  public setClinicalStatus(status?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.ClinicalStatus, status); }
  public getClinicalStatus(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.ClinicalStatus); }
  public setVerificationStatus(status?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.VerificationStatus, status); }
  public getVerificationStatus(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.VerificationStatus); }
  public setCategory(category?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.Category, category); }
  public getCategory(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.Category); }
  public setCriticality(criticality?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.Criticality, criticality); }
  public getCriticality(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.Criticality); }
  public setOnsetDateTime(value?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.OnsetDateTime, value); }
  public getOnsetDateTime(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.OnsetDateTime); }
  public setRecorder(reference?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.Recorder, reference); }
  public getRecorder(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.Recorder); }
  public setContainedDocumentIdentifierList(identifiers: readonly string[]): this { return this.setCsvClaimList(AllergyIntoleranceClaim.ContainedDocuments, identifiers); }
  public getContainedDocumentIdentifierList(): string[] { return this.getCsvClaimList(AllergyIntoleranceClaim.ContainedDocuments); }
}

/** Claims-first editor for one staged Condition entry. */
export class ConditionEntryEditor extends ClinicalResourceEntryEditor {
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(ConditionClaim.Identifier, identifier); }
  public getIdentifier(): string | undefined { return this.getIdentifierValue(ConditionClaim.Identifier); }
  public ensureIdentifier(): string { return this.ensureIdentifierValue(ConditionClaim.Identifier); }
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(ConditionClaim.Subject, ConditionClaim.Subject, subject); }
  public getSubject(): string | undefined { return this.getSubjectClaims(ConditionClaim.Subject, ConditionClaim.Subject); }
  public setCode(code?: string | null): this { return this.setScalarClaim(ConditionClaim.Code, code); }
  public getCode(): string | undefined { return this.getScalarClaim(ConditionClaim.Code); }
  public setClinicalStatus(status?: string | null): this { return this.setScalarClaim(ConditionClaim.ClinicalStatus, status); }
  public getClinicalStatus(): string | undefined { return this.getScalarClaim(ConditionClaim.ClinicalStatus); }
  public setVerificationStatus(status?: string | null): this { return this.setScalarClaim(ConditionClaim.VerificationStatus, status); }
  public getVerificationStatus(): string | undefined { return this.getScalarClaim(ConditionClaim.VerificationStatus); }
  public setCategory(category?: string | null): this { return this.setScalarClaim(ConditionClaim.Category, category); }
  public getCategory(): string | undefined { return this.getScalarClaim(ConditionClaim.Category); }
  public setSeverity(severity?: string | null): this { return this.setScalarClaim(ConditionClaim.Severity, severity); }
  public getSeverity(): string | undefined { return this.getScalarClaim(ConditionClaim.Severity); }
  public setOnsetDateTime(value?: string | null): this { return this.setScalarClaim(ConditionClaim.OnsetDateTime, value); }
  public getOnsetDateTime(): string | undefined { return this.getScalarClaim(ConditionClaim.OnsetDateTime); }
  public setRecorder(reference?: string | null): this { return this.setScalarClaim(ConditionClaim.Recorder, reference); }
  public getRecorder(): string | undefined { return this.getScalarClaim(ConditionClaim.Recorder); }
  public setContainedDocumentIdentifierList(identifiers: readonly string[]): this { return this.setCsvClaimList(ConditionClaim.ContainedDocuments, identifiers); }
  public getContainedDocumentIdentifierList(): string[] { return this.getCsvClaimList(ConditionClaim.ContainedDocuments); }
}

/** Claims-first editor for one staged MedicationStatement entry. */
export class MedicationStatementEntryEditor extends ClinicalResourceEntryEditor {
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(MedicationStatementClaim.Identifier, identifier); }
  public getIdentifier(): string | undefined { return this.getIdentifierValue(MedicationStatementClaim.Identifier); }
  public ensureIdentifier(): string { return this.ensureIdentifierValue(MedicationStatementClaim.Identifier); }
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(MedicationStatementClaim.Subject, MedicationStatementClaim.Patient, subject); }
  public getSubject(): string | undefined { return this.getSubjectClaims(MedicationStatementClaim.Subject, MedicationStatementClaim.Patient); }
  public setStatus(status?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.Status, status); }
  public getStatus(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.Status); }
  public setEffective(value?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.Effective, value); }
  public getEffective(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.Effective); }
  public setCode(code?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.Code, code); }
  public getCode(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.Code); }
  public setMedicationText(text?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.MedicationText, text); }
  public getMedicationText(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.MedicationText); }
  public setNote(note?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.Note, note); }
  public getNote(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.Note); }
  public setDosageInstruction(value?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.DosageInstruction, value); }
  public getDosageInstruction(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.DosageInstruction); }
  public setCategoryList(values: readonly string[]): this { return this.setCsvClaimList(MedicationStatementClaim.Category, values); }
  public getCategoryList(): string[] { return this.getCsvClaimList(MedicationStatementClaim.Category); }
  public setDoseQuantityValue(value?: number | null): this { return this.setNumberClaim(MedicationStatementClaimsFhirApiExtended.DoseQuantityValue, value); }
  public getDoseQuantityValue(): number | undefined { return this.getNumberClaim(MedicationStatementClaimsFhirApiExtended.DoseQuantityValue); }
  public setDoseQuantityUnit(value?: string | null): this { return this.setScalarClaim(MedicationStatementClaimsFhirApiExtended.DoseQuantityUnit, value); }
  public getDoseQuantityUnit(): string | undefined { return this.getScalarClaim(MedicationStatementClaimsFhirApiExtended.DoseQuantityUnit); }
  public setTimingFrequency(value?: number | null): this { return this.setNumberClaim(MedicationStatementClaimsFhirApiExtended.TimingFrequency, value); }
  public getTimingFrequency(): number | undefined { return this.getNumberClaim(MedicationStatementClaimsFhirApiExtended.TimingFrequency); }
  public setTimingPeriod(value?: number | null): this { return this.setNumberClaim(MedicationStatementClaimsFhirApiExtended.TimingPeriod, value); }
  public getTimingPeriod(): number | undefined { return this.getNumberClaim(MedicationStatementClaimsFhirApiExtended.TimingPeriod); }
  public setTimingPeriodUnit(value?: string | null): this { return this.setScalarClaim(MedicationStatementClaimsFhirApiExtended.TimingPeriodUnit, value); }
  public getTimingPeriodUnit(): string | undefined { return this.getScalarClaim(MedicationStatementClaimsFhirApiExtended.TimingPeriodUnit); }
  public setDosageAsNeeded(value?: boolean | null): this { return this.setBooleanClaim(MedicationStatementClaimsFhirApiExtended.DosageAsNeeded, value); }
  public getDosageAsNeeded(): boolean | undefined { return this.getBooleanClaim(MedicationStatementClaimsFhirApiExtended.DosageAsNeeded); }
}

/** Claims-first editor for one staged DocumentReference entry. */
export class DocumentReferenceEntryEditor extends ClinicalResourceEntryEditor {
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(DocumentReferenceClaim.Identifier, identifier); }
  public getIdentifier(): string | undefined { return this.getIdentifierValue(DocumentReferenceClaim.Identifier); }
  public ensureIdentifier(): string { return this.ensureIdentifierValue(DocumentReferenceClaim.Identifier); }
  public setSubject(subject?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.Subject, subject); }
  public getSubject(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.Subject); }
  public setType(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.Type, value); }
  public getType(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.Type); }
  public setCategory(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.Category, value); }
  public getCategory(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.Category); }
  public setContentType(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.ContentType, value); }
  public getContentType(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.ContentType); }
  public setContentData(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.ContentData, value); }
  public getContentData(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.ContentData); }
  public setContentHash(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.ContentHash, value); }
  public getContentHash(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.ContentHash); }
  public setLocation(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.Location, value); }
  public getLocation(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.Location); }
  public setDescription(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.Description, value); }
  public getDescription(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.Description); }
  public setDate(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.Date, value); }
  public getDate(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.Date); }
  public setAuthor(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.Author, value); }
  public getAuthor(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.Author); }
}

/** Claims-first editor for one staged CarePlan entry. */
export class CarePlanEntryEditor extends ClinicalResourceEntryEditor {
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(CarePlanClaim.Identifier, identifier); }
  public getIdentifier(): string | undefined { return this.getIdentifierValue(CarePlanClaim.Identifier); }
  public ensureIdentifier(): string { return this.ensureIdentifierValue(CarePlanClaim.Identifier); }
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(CarePlanClaim.Subject, CarePlanClaim.Patient, subject); }
  public getSubject(): string | undefined { return this.getSubjectClaims(CarePlanClaim.Subject, CarePlanClaim.Patient); }
  public setStatus(value?: string | null): this { return this.setScalarClaim(CarePlanClaim.Status, value); }
  public getStatus(): string | undefined { return this.getScalarClaim(CarePlanClaim.Status); }
  public setIntent(value?: string | null): this { return this.setScalarClaim(CarePlanClaim.Intent, value); }
  public getIntent(): string | undefined { return this.getScalarClaim(CarePlanClaim.Intent); }
  public setCategory(value?: string | null): this { return this.setScalarClaim(CarePlanClaim.Category, value); }
  public getCategory(): string | undefined { return this.getScalarClaim(CarePlanClaim.Category); }
  public setEncounter(value?: string | null): this { return this.setScalarClaim(CarePlanClaim.Encounter, value); }
  public getEncounter(): string | undefined { return this.getScalarClaim(CarePlanClaim.Encounter); }
  public setDate(value?: string | null): this { return this.setScalarClaim(CarePlanClaim.Date, value); }
  public getDate(): string | undefined { return this.getScalarClaim(CarePlanClaim.Date); }
  public setNote(value?: string | null): this { return this.setScalarClaim(CarePlanClaim.Note, value); }
  public getNote(): string | undefined { return this.getScalarClaim(CarePlanClaim.Note); }
}

/** Claims-first editor for one staged Flag entry. */
export class FlagEntryEditor extends ClinicalResourceEntryEditor {
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(FlagClaim.Identifier, identifier); }
  public getIdentifier(): string | undefined { return this.getIdentifierValue(FlagClaim.Identifier); }
  public ensureIdentifier(): string { return this.ensureIdentifierValue(FlagClaim.Identifier); }
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(FlagClaim.Subject, FlagClaim.Patient, subject); }
  public getSubject(): string | undefined { return this.getSubjectClaims(FlagClaim.Subject, FlagClaim.Patient); }
  public setStatus(value?: string | null): this { return this.setScalarClaim(FlagClaim.Status, value); }
  public getStatus(): string | undefined { return this.getScalarClaim(FlagClaim.Status); }
  public setCategory(value?: string | null): this { return this.setScalarClaim(FlagClaim.Category, value); }
  public getCategory(): string | undefined { return this.getScalarClaim(FlagClaim.Category); }
  public setCode(value?: string | null): this { return this.setScalarClaim(FlagClaim.Code, value); }
  public getCode(): string | undefined { return this.getScalarClaim(FlagClaim.Code); }
  public setDate(value?: string | null): this { return this.setScalarClaim(FlagClaim.Date, value); }
  public getDate(): string | undefined { return this.getScalarClaim(FlagClaim.Date); }
  public setEncounter(value?: string | null): this { return this.setScalarClaim(FlagClaim.Encounter, value); }
  public getEncounter(): string | undefined { return this.getScalarClaim(FlagClaim.Encounter); }
  public setPeriodStart(value?: string | null): this { return this.setScalarClaim(FlagClaim.PeriodStart, value); }
  public getPeriodStart(): string | undefined { return this.getScalarClaim(FlagClaim.PeriodStart); }
  public setPeriodEnd(value?: string | null): this { return this.setScalarClaim(FlagClaim.PeriodEnd, value); }
  public getPeriodEnd(): string | undefined { return this.getScalarClaim(FlagClaim.PeriodEnd); }
}

/** Claims-first editor for one staged ClinicalImpression entry. */
export class ClinicalImpressionEntryEditor extends ClinicalResourceEntryEditor {
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(ClinicalImpressionClaim.Identifier, identifier); }
  public getIdentifier(): string | undefined { return this.getIdentifierValue(ClinicalImpressionClaim.Identifier); }
  public ensureIdentifier(): string { return this.ensureIdentifierValue(ClinicalImpressionClaim.Identifier); }
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(ClinicalImpressionClaim.Subject, ClinicalImpressionClaim.Subject, subject); }
  public getSubject(): string | undefined { return this.getSubjectClaims(ClinicalImpressionClaim.Subject, ClinicalImpressionClaim.Subject); }
  public setStatus(value?: string | null): this { return this.setScalarClaim(ClinicalImpressionClaim.Status, value); }
  public getStatus(): string | undefined { return this.getScalarClaim(ClinicalImpressionClaim.Status); }
  public setDescription(value?: string | null): this { return this.setScalarClaim(ClinicalImpressionClaim.Description, value); }
  public getDescription(): string | undefined { return this.getScalarClaim(ClinicalImpressionClaim.Description); }
  public setEncounter(value?: string | null): this { return this.setScalarClaim(ClinicalImpressionClaim.Encounter, value); }
  public getEncounter(): string | undefined { return this.getScalarClaim(ClinicalImpressionClaim.Encounter); }
  public setEffectiveDateTime(value?: string | null): this { return this.setScalarClaim(ClinicalImpressionClaim.EffectiveDateTime, value); }
  public getEffectiveDateTime(): string | undefined { return this.getScalarClaim(ClinicalImpressionClaim.EffectiveDateTime); }
  public setAssessor(value?: string | null): this { return this.setScalarClaim(ClinicalImpressionClaim.Assessor, value); }
  public getAssessor(): string | undefined { return this.getScalarClaim(ClinicalImpressionClaim.Assessor); }
  public setSummary(value?: string | null): this { return this.setScalarClaim(ClinicalImpressionClaim.Summary, value); }
  public getSummary(): string | undefined { return this.getScalarClaim(ClinicalImpressionClaim.Summary); }
}

/** Claims-first editor for one staged Device entry. */
export class DeviceEntryEditor extends ClinicalResourceEntryEditor {
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(DeviceClaim.Identifier, identifier); }
  public getIdentifier(): string | undefined { return this.getIdentifierValue(DeviceClaim.Identifier); }
  public ensureIdentifier(): string { return this.ensureIdentifierValue(DeviceClaim.Identifier); }
  public setPatient(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Patient, value); }
  public getPatient(): string | undefined { return this.getScalarClaim(DeviceClaim.Patient); }
  public setStatus(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Status, value); }
  public getStatus(): string | undefined { return this.getScalarClaim(DeviceClaim.Status); }
  public setType(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Type, value); }
  public getType(): string | undefined { return this.getScalarClaim(DeviceClaim.Type); }
  public setManufacturer(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Manufacturer, value); }
  public getManufacturer(): string | undefined { return this.getScalarClaim(DeviceClaim.Manufacturer); }
  public setModel(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Model, value); }
  public getModel(): string | undefined { return this.getScalarClaim(DeviceClaim.Model); }
  public setDeviceName(value?: string | null): this { return this.setScalarClaim(DeviceClaim.DeviceName, value); }
  public getDeviceName(): string | undefined { return this.getScalarClaim(DeviceClaim.DeviceName); }
  public setSerialNumber(value?: string | null): this { return this.setScalarClaim(DeviceClaim.SerialNumber, value); }
  public getSerialNumber(): string | undefined { return this.getScalarClaim(DeviceClaim.SerialNumber); }
  public setOrganization(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Organization, value); }
  public getOrganization(): string | undefined { return this.getScalarClaim(DeviceClaim.Organization); }
  public setLocation(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Location, value); }
  public getLocation(): string | undefined { return this.getScalarClaim(DeviceClaim.Location); }
  public setUrl(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Url, value); }
  public getUrl(): string | undefined { return this.getScalarClaim(DeviceClaim.Url); }
  public setNote(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Note, value); }
  public getNote(): string | undefined { return this.getScalarClaim(DeviceClaim.Note); }
}

/** Claims-first editor for one staged DeviceUseStatement entry. */
export class DeviceUseStatementEntryEditor extends ClinicalResourceEntryEditor {
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(DeviceUseStatementClaim.Identifier, identifier); }
  public getIdentifier(): string | undefined { return this.getIdentifierValue(DeviceUseStatementClaim.Identifier); }
  public ensureIdentifier(): string { return this.ensureIdentifierValue(DeviceUseStatementClaim.Identifier); }
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(DeviceUseStatementClaim.Subject, DeviceUseStatementClaim.Subject, subject); }
  public getSubject(): string | undefined { return this.getSubjectClaims(DeviceUseStatementClaim.Subject, DeviceUseStatementClaim.Subject); }
  public setStatus(value?: string | null): this { return this.setScalarClaim(DeviceUseStatementClaim.Status, value); }
  public getStatus(): string | undefined { return this.getScalarClaim(DeviceUseStatementClaim.Status); }
  public setDevice(value?: string | null): this { return this.setScalarClaim(DeviceUseStatementClaim.Device, value); }
  public getDevice(): string | undefined { return this.getScalarClaim(DeviceUseStatementClaim.Device); }
  public setRecordedOn(value?: string | null): this { return this.setScalarClaim(DeviceUseStatementClaim.RecordedOn, value); }
  public getRecordedOn(): string | undefined { return this.getScalarClaim(DeviceUseStatementClaim.RecordedOn); }
  public setTimingDateTime(value?: string | null): this { return this.setScalarClaim(DeviceUseStatementClaim.TimingDateTime, value); }
  public getTimingDateTime(): string | undefined { return this.getScalarClaim(DeviceUseStatementClaim.TimingDateTime); }
  public setReasonCode(value?: string | null): this { return this.setScalarClaim(DeviceUseStatementClaim.ReasonCode, value); }
  public getReasonCode(): string | undefined { return this.getScalarClaim(DeviceUseStatementClaim.ReasonCode); }
  public setSource(value?: string | null): this { return this.setScalarClaim(DeviceUseStatementClaim.Source, value); }
  public getSource(): string | undefined { return this.getScalarClaim(DeviceUseStatementClaim.Source); }
}

/** Claims-first editor for one staged Encounter entry. */
export class EncounterEntryEditor extends ClinicalResourceEntryEditor {
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(EncounterClaim.Identifier, identifier); }
  public getIdentifier(): string | undefined { return this.getIdentifierValue(EncounterClaim.Identifier); }
  public ensureIdentifier(): string { return this.ensureIdentifierValue(EncounterClaim.Identifier); }
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(EncounterClaim.Subject, EncounterClaim.Patient, subject); }
  public getSubject(): string | undefined { return this.getSubjectClaims(EncounterClaim.Subject, EncounterClaim.Patient); }
  public setStatus(value?: string | null): this { return this.setScalarClaim(EncounterClaim.Status, value); }
  public getStatus(): string | undefined { return this.getScalarClaim(EncounterClaim.Status); }
  public setClass(value?: string | null): this { return this.setScalarClaim(EncounterClaim.Class, value); }
  public getClass(): string | undefined { return this.getScalarClaim(EncounterClaim.Class); }
  public setType(value?: string | null): this { return this.setScalarClaim(EncounterClaim.Type, value); }
  public getType(): string | undefined { return this.getScalarClaim(EncounterClaim.Type); }
  public setParticipantList(values: readonly string[]): this { return this.setCsvClaimList(EncounterClaim.Participant, values); }
  public getParticipantList(): string[] { return this.getCsvClaimList(EncounterClaim.Participant); }
  public setServiceProvider(value?: string | null): this { return this.setScalarClaim(EncounterClaim.ServiceProvider, value); }
  public getServiceProvider(): string | undefined { return this.getScalarClaim(EncounterClaim.ServiceProvider); }
  public setPeriodStart(value?: string | null): this { return this.setScalarClaim(EncounterClaim.PeriodStart, value); }
  public getPeriodStart(): string | undefined { return this.getScalarClaim(EncounterClaim.PeriodStart); }
  public setPeriodEnd(value?: string | null): this { return this.setScalarClaim(EncounterClaim.PeriodEnd, value); }
  public getPeriodEnd(): string | undefined { return this.getScalarClaim(EncounterClaim.PeriodEnd); }
  public setReasonCode(value?: string | null): this { return this.setScalarClaim(EncounterClaim.ReasonCode, value); }
  public getReasonCode(): string | undefined { return this.getScalarClaim(EncounterClaim.ReasonCode); }
}

/** Claims-first editor for one staged Coverage entry. */
export class CoverageEntryEditor extends ClinicalResourceEntryEditor {
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(CoverageClaim.Identifier, identifier); }
  public getIdentifier(): string | undefined { return this.getIdentifierValue(CoverageClaim.Identifier); }
  public ensureIdentifier(): string { return this.ensureIdentifierValue(CoverageClaim.Identifier); }
  public setStatus(value?: string | null): this { return this.setScalarClaim(CoverageClaim.Status, value); }
  public getStatus(): string | undefined { return this.getScalarClaim(CoverageClaim.Status); }
  public setType(value?: string | null): this { return this.setScalarClaim(CoverageClaim.Type, value); }
  public getType(): string | undefined { return this.getScalarClaim(CoverageClaim.Type); }
  public setPolicyHolder(value?: string | null): this { return this.setScalarClaim(CoverageClaim.PolicyHolder, value); }
  public getPolicyHolder(): string | undefined { return this.getScalarClaim(CoverageClaim.PolicyHolder); }
  public setSubscriber(value?: string | null): this { return this.setScalarClaim(CoverageClaim.Subscriber, value); }
  public getSubscriber(): string | undefined { return this.getScalarClaim(CoverageClaim.Subscriber); }
  public setBeneficiary(value?: string | null): this { return this.setScalarClaim(CoverageClaim.Beneficiary, value); }
  public getBeneficiary(): string | undefined { return this.getScalarClaim(CoverageClaim.Beneficiary); }
  public setRelationship(value?: string | null): this { return this.setScalarClaim(CoverageClaim.Relationship, value); }
  public getRelationship(): string | undefined { return this.getScalarClaim(CoverageClaim.Relationship); }
  public setPeriodStart(value?: string | null): this { return this.setScalarClaim(CoverageClaim.PeriodStart, value); }
  public getPeriodStart(): string | undefined { return this.getScalarClaim(CoverageClaim.PeriodStart); }
  public setPeriodEnd(value?: string | null): this { return this.setScalarClaim(CoverageClaim.PeriodEnd, value); }
  public getPeriodEnd(): string | undefined { return this.getScalarClaim(CoverageClaim.PeriodEnd); }
  public setPayorList(values: readonly string[]): this { return this.setCsvClaimList(CoverageClaim.Payor, values); }
  public getPayorList(): string[] { return this.getCsvClaimList(CoverageClaim.Payor); }
}

/** Claims-first editor for one staged Immunization entry. */
export class ImmunizationEntryEditor extends ClinicalResourceEntryEditor {
  public setIdentifier(identifier?: string | null): this {
    return this.setIdentifierValue(ImmunizationClaim.Identifier, identifier);
  }

  public getIdentifier(): string | undefined {
    return this.getIdentifierValue(ImmunizationClaim.Identifier);
  }

  public ensureIdentifier(): string {
    return this.ensureIdentifierValue(ImmunizationClaim.Identifier);
  }

  public setSubject(subject?: string | null): this {
    return this.setSubjectClaims(ImmunizationClaim.Subject, ImmunizationClaim.Patient, subject);
  }

  public getSubject(): string | undefined {
    return this.getSubjectClaims(ImmunizationClaim.Subject, ImmunizationClaim.Patient);
  }

  public setStatus(status?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.Status, status);
  }

  public getStatus(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.Status);
  }

  public setDate(date?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.Date, date);
  }

  public getDate(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.Date);
  }

  public setVaccineCode(code?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.VaccineCode, code);
  }

  public getVaccineCode(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.VaccineCode);
  }

  public setVaccineCodeTextLocal(text?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.VaccineCodeText, text);
  }

  public getVaccineCodeTextLocal(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.VaccineCodeText);
  }

  public setVaccineCodeDisplay(display?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.VaccineCodeDisplay, display);
  }

  public getVaccineCodeDisplay(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.VaccineCodeDisplay);
  }

  public setLocation(reference?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.Location, reference);
  }

  public getLocation(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.Location);
  }

  public setManufacturer(reference?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.Manufacturer, reference);
  }

  public getManufacturer(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.Manufacturer);
  }

  public setLotNumber(lotNumber?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.LotNumber, lotNumber);
  }

  public getLotNumber(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.LotNumber);
  }

  public setPerformerList(references: readonly string[]): this {
    return this.setCsvClaimList(ImmunizationClaim.Performer, references);
  }

  public getPerformerList(): string[] {
    return this.getCsvClaimList(ImmunizationClaim.Performer);
  }

  public setReasonCode(code?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.ReasonCode, code);
  }

  public getReasonCode(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.ReasonCode);
  }

  public setStatusReason(reason?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.StatusReason, reason);
  }

  public getStatusReason(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.StatusReason);
  }

  public setTargetDisease(code?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.TargetDisease, code);
  }

  public getTargetDisease(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.TargetDisease);
  }

  public setDoseSequence(sequence?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.DoseSequence, sequence);
  }

  public getDoseSequence(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.DoseSequence);
  }

  public setSeries(series?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.Series, series);
  }

  public getSeries(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.Series);
  }

  public setReactionDate(date?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.ReactionDate, date);
  }

  public getReactionDate(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.ReactionDate);
  }

  public setNote(note?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.Note, note);
  }

  public getNote(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.Note);
  }

  public setClinicalNote(note?: string | null): this {
    return this.setNote(note);
  }

  public getClinicalNote(): string | undefined {
    return this.getNote();
  }
}

/** Claims-first editor for one staged Procedure entry. */
export class ProcedureEntryEditor extends ClinicalResourceEntryEditor {
  public setIdentifier(identifier?: string | null): this {
    return this.setIdentifierValue(ProcedureClaim.Identifier, identifier);
  }

  public getIdentifier(): string | undefined {
    return this.getIdentifierValue(ProcedureClaim.Identifier);
  }

  public ensureIdentifier(): string {
    return this.ensureIdentifierValue(ProcedureClaim.Identifier);
  }

  public setSubject(subject?: string | null): this {
    return this.setSubjectClaims(ProcedureClaim.Subject, ProcedureClaim.Patient, subject);
  }

  public getSubject(): string | undefined {
    return this.getSubjectClaims(ProcedureClaim.Subject, ProcedureClaim.Patient);
  }

  public setStatus(status?: string | null): this {
    return this.setScalarClaim(ProcedureClaim.Status, status);
  }

  public getStatus(): string | undefined {
    return this.getScalarClaim(ProcedureClaim.Status);
  }

  public setDate(date?: string | null): this {
    return this.setScalarClaim(ProcedureClaim.Date, date);
  }

  public getDate(): string | undefined {
    return this.getScalarClaim(ProcedureClaim.Date);
  }

  public setCode(code?: string | null): this {
    return this.setScalarClaim(ProcedureClaim.Code, code);
  }

  public getCode(): string | undefined {
    return this.getScalarClaim(ProcedureClaim.Code);
  }

  public setCodeTextLocal(text?: string | null): this {
    return this.setScalarClaim(ProcedureClaim.CodeText, text);
  }

  public getCodeTextLocal(): string | undefined {
    return this.getScalarClaim(ProcedureClaim.CodeText);
  }

  public setCodeDisplay(display?: string | null): this {
    return this.setScalarClaim(ProcedureClaim.CodeDisplay, display);
  }

  public getCodeDisplay(): string | undefined {
    return this.getScalarClaim(ProcedureClaim.CodeDisplay);
  }

  public setEncounter(reference?: string | null): this {
    return this.setScalarClaim(ProcedureClaim.Encounter, reference);
  }

  public getEncounter(): string | undefined {
    return this.getScalarClaim(ProcedureClaim.Encounter);
  }

  public setLocation(reference?: string | null): this {
    return this.setScalarClaim(ProcedureClaim.Location, reference);
  }

  public getLocation(): string | undefined {
    return this.getScalarClaim(ProcedureClaim.Location);
  }

  public setReasonCode(code?: string | null): this {
    return this.setScalarClaim(ProcedureClaim.ReasonCode, code);
  }

  public getReasonCode(): string | undefined {
    return this.getScalarClaim(ProcedureClaim.ReasonCode);
  }

  public setNote(note?: string | null): this {
    return this.setScalarClaim(ProcedureClaim.Note, note);
  }

  public getNote(): string | undefined {
    return this.getScalarClaim(ProcedureClaim.Note);
  }

  public setClinicalNote(note?: string | null): this {
    return this.setNote(note);
  }

  public getClinicalNote(): string | undefined {
    return this.getNote();
  }

  public setPerformerList(references: readonly string[]): this {
    return this.setCsvClaimList(ProcedureClaim.Performer, references);
  }

  public getPerformerList(): string[] {
    return this.getCsvClaimList(ProcedureClaim.Performer);
  }

  public setBasedOnList(references: readonly string[]): this {
    return this.setCsvClaimList(ProcedureClaim.BasedOn, references);
  }

  public getBasedOnList(): string[] {
    return this.getCsvClaimList(ProcedureClaim.BasedOn);
  }

  public setReasonReferenceList(references: readonly string[]): this {
    return this.setCsvClaimList(ProcedureClaim.ReasonReference, references);
  }

  public getReasonReferenceList(): string[] {
    return this.getCsvClaimList(ProcedureClaim.ReasonReference);
  }
}

/** Claims-first editor for one staged DiagnosticReport entry. */
export class DiagnosticReportEntryEditor extends ClinicalResourceEntryEditor {
  public setIdentifier(identifier?: string | null): this {
    return this.setIdentifierValue(DiagnosticReportClaim.Identifier, identifier);
  }

  public getIdentifier(): string | undefined {
    return this.getIdentifierValue(DiagnosticReportClaim.Identifier);
  }

  public ensureIdentifier(): string {
    return this.ensureIdentifierValue(DiagnosticReportClaim.Identifier);
  }

  public setSubject(subject?: string | null): this {
    return this.setSubjectClaims(DiagnosticReportClaim.Subject, DiagnosticReportClaim.Patient, subject);
  }

  public getSubject(): string | undefined {
    return this.getSubjectClaims(DiagnosticReportClaim.Subject, DiagnosticReportClaim.Patient);
  }

  public setStatus(status?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.Status, status);
  }

  public getStatus(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.Status);
  }

  public setDate(date?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.Date, date);
  }

  public getDate(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.Date);
  }

  public setCategory(category?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.Category, category);
  }

  public getCategory(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.Category);
  }

  public setCode(code?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.Code, code);
  }

  public getCode(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.Code);
  }

  public setEncounter(reference?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.Encounter, reference);
  }

  public getEncounter(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.Encounter);
  }

  public setPerformerList(references: readonly string[]): this {
    return this.setCsvClaimList(DiagnosticReportClaim.Performer, references);
  }

  public getPerformerList(): string[] {
    return this.getCsvClaimList(DiagnosticReportClaim.Performer);
  }

  public setResultList(references: readonly string[]): this {
    return this.setCsvClaimList(DiagnosticReportClaim.Result, references);
  }

  public getResultList(): string[] {
    return this.getCsvClaimList(DiagnosticReportClaim.Result);
  }

  public setSpecimenList(references: readonly string[]): this {
    return this.setCsvClaimList(DiagnosticReportClaim.Specimen, references);
  }

  public getSpecimenList(): string[] {
    return this.getCsvClaimList(DiagnosticReportClaim.Specimen);
  }

  public setContainedDocumentIdentifierList(identifiers: readonly string[]): this {
    return this.setCsvClaimList(DiagnosticReportClaim.ContainedDocuments, identifiers);
  }

  public getContainedDocumentIdentifierList(): string[] {
    return this.getCsvClaimList(DiagnosticReportClaim.ContainedDocuments);
  }

  public setPresentedFormContentType(contentType?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.PresentedFormContentType, contentType);
  }

  public getPresentedFormContentType(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.PresentedFormContentType);
  }

  public setPresentedFormData(data?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.PresentedFormData, data);
  }

  public getPresentedFormData(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.PresentedFormData);
  }

  public setPresentedFormUrl(url?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.PresentedFormUrl, url);
  }

  public getPresentedFormUrl(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.PresentedFormUrl);
  }
}

/**
 * Employee-specific editor for one staged bundle entry.
 *
 * Use this class after `bundle.newEntry().asEmployee()` or
 * `bundle.openEntry(...).asEmployee()`.
 */
export class EmployeeEntryEditor extends BundleEntryEditor {
  /**
   * Writes the canonical employee identifier.
   *
   * The identifier is synchronized across:
   * - `entry.fullUrl`
   * - `resource.id`
   * - `org.schema.Person.identifier`
   */
  public setIdentifier(identifier?: string | null): this {
    const normalized = normalizeOptionalIdentifier(identifier);
    if (!normalized) {
      this.removeClaim(ClaimsPersonSchemaorg.identifier);
      this.setResourceId(undefined);
      this.setFullUrl(undefined);
      return this;
    }
    this.setClaim(ClaimsPersonSchemaorg.identifier, normalized);
    this.setResourceId(normalized);
    this.setFullUrl(normalized);
    return this;
  }

  /** Reads the canonical employee identifier from claims, resource id, or fullUrl. */
  public getIdentifier(): string | undefined {
    return normalizeOptionalIdentifier(
      this.getClaim(ClaimsPersonSchemaorg.identifier)
        || this.getResourceId()
        || this.getFullUrl(),
    );
  }

  /** Ensures the employee entry carries one canonical `urn:uuid:*` identifier. */
  public ensureIdentifier(): string {
    const existing = this.getIdentifier();
    if (existing) {
      return existing;
    }
    const generated = createCanonicalIdentifierUrn();
    this.setIdentifier(generated);
    return generated;
  }

  /** Writes the canonical employee email claim on this entry. */
  public setEmail(email: string): this {
    return this.setClaim(ClaimsPersonSchemaorg.email, String(email).trim());
  }

  /** Reads the canonical employee email claim from this entry. */
  public getEmail(): string | undefined {
    const email = this.getClaim(ClaimsPersonSchemaorg.email);
    return typeof email === 'string' && email.trim() ? email.trim() : undefined;
  }

  /** Writes the canonical employee occupational role claim on this entry. */
  public setRole(role: string): this {
    return this.setClaim(ClaimsPersonSchemaorg.hasOccupationalRoleValue, String(role).trim());
  }

  /** Reads the canonical employee occupational role claim from this entry. */
  public getRole(): string | undefined {
    const role = this.getClaim(ClaimsPersonSchemaorg.hasOccupationalRoleValue);
    return typeof role === 'string' && role.trim() ? role.trim() : undefined;
  }

  /** Writes the canonical employee `worksFor` claim on this entry. */
  public setWorksFor(worksFor: string): this {
    return this.setClaim(ClaimsPersonSchemaorg.worksFor, String(worksFor).trim());
  }

  /** Writes the canonical employee `memberOf` claim on this entry. */
  public setMemberOf(memberOf: string): this {
    return this.setClaim(ClaimsPersonSchemaorg.memberOf, String(memberOf).trim());
  }

  /** Writes the canonical employee organization tax id claim on this entry. */
  public setMemberOfOrgTaxId(taxId: string): this {
    return this.setClaim(ClaimsPersonSchemaorg.memberOfOrgTaxId, String(taxId).trim());
  }
}
