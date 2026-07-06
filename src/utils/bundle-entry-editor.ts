/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - This file owns only the generic entry-level editor surface.
 * - Resource-specific semantics must live in the dedicated typed entry editors.
 */
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import type { BundleEditor } from './bundle-editor-core';
import {
  AllowedResourceType,
  BundleEditableResourceTypes,
  type BuiltBundleEntry,
  type ResourceTypeEntryEditor,
} from '../models/bundle-editor-types';
import type { AllergyIntoleranceEntryEditor } from './allergy-intolerance-entry-editor';
import type { CarePlanEntryEditor } from './care-plan-entry-editor';
import type { ClinicalImpressionEntryEditor } from './clinical-impression-entry-editor';
import type { ConditionEntryEditor } from './condition-entry-editor';
import type { CoverageEntryEditor } from './coverage-entry-editor';
import type { DeviceEntryEditor } from './device-entry-editor';
import type { DeviceUseStatementEntryEditor } from './device-use-statement-entry-editor';
import type { DiagnosticReportEntryEditor } from './diagnostic-report-entry-editor';
import type { DocumentReferenceEntryEditor } from './document-reference-entry-editor';
import type { EncounterEntryEditor } from './encounter-entry-editor';
import type { EmployeeEntryEditor } from './employee-entry-editor';
import type { FlagEntryEditor } from './flag-entry-editor';
import type { ImmunizationEntryEditor } from './immunization-entry-editor';
import type { MedicationStatementEntryEditor } from './medication-statement-entry-editor';
import type { ObservationEntryEditor } from './observation-entry-editor';
import type { ProcedureEntryEditor } from './procedure-entry-editor';
import type { VitalSignEntryEditor } from './vital-sign-entry-editor';
import { ObservationClaim } from '../models/interoperable-claims/observation-claims';
import { ClaimsPersonSchemaorg } from '../constants/schemaorg';
import {
  EmployeeResourceTypes,
  type EmployeeClaims,
} from './employee';
import { cloneClaimValue, normalizeOptionalIdentifier } from './bundle-editor-helpers';
import { createRegisteredBundleEntryEditor } from './bundle-editor-registry';

export class BundleEntryEditor {
  constructor(
    protected readonly bundleEditor: BundleEditor,
    protected readonly entryIndex: number,
  ) {}

  /**
   * Reopens the current slot as one typed resource editor.
   *
   * Use this when the caller already knows the resource type of an existing
   * entry and wants the typed `get...` / `set...` API back.
   */
  public asResourceType<T extends AllowedResourceType>(resourceType: T): ResourceTypeEntryEditor<T> {
    const normalized = String(resourceType || '').trim();
    switch (normalized) {
      case BundleEditableResourceTypes.employee:
        return this.asEmployee() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.vitalSign:
        return this.asVitalSign() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.observation:
        return this.asObservation() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.allergyIntolerance:
        return this.asAllergy() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.condition:
        return this.asCondition() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.medicationStatement:
        return this.asMedicationStatement() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.documentReference:
        return this.asDocumentReference() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.carePlan:
        return this.asCarePlan() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.flag:
        return this.asFlag() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.clinicalImpression:
        return this.asClinicalImpression() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.device:
        return this.asDevice() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.deviceUseStatement:
        return this.asDeviceUseStatement() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.encounter:
        return this.asEncounter() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.coverage:
        return this.asCoverage() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.immunization:
        return this.asImmunization() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.procedure:
        return this.asProcedure() as ResourceTypeEntryEditor<T>;
      case BundleEditableResourceTypes.diagnosticReport:
        return this.asDiagnosticReport() as ResourceTypeEntryEditor<T>;
      default:
        return this as unknown as ResourceTypeEntryEditor<T>;
    }
  }

  /** Opens the current entry as one employee-specific resource editor. */
  public asEmployee(): EmployeeEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== EmployeeResourceTypes.employee) {
      throw new Error(`BundleEntryEditor cannot open this entry as Employee: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<EmployeeEntryEditor>(BundleEditableResourceTypes.employee, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one vital-sign-specific Observation editor. */
  public asVitalSign(): VitalSignEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Observation) {
      throw new Error(`BundleEntryEditor cannot open this entry as VitalSign: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<VitalSignEntryEditor>(BundleEditableResourceTypes.vitalSign, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one general Observation editor. */
  public asObservation(): ObservationEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Observation) {
      throw new Error(`BundleEntryEditor cannot open this entry as Observation: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<ObservationEntryEditor>(BundleEditableResourceTypes.observation, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one AllergyIntolerance editor. */
  public asAllergy(): AllergyIntoleranceEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.AllergyIntolerance) {
      throw new Error(`BundleEntryEditor cannot open this entry as AllergyIntolerance: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<AllergyIntoleranceEntryEditor>(BundleEditableResourceTypes.allergyIntolerance, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one Condition editor. */
  public asCondition(): ConditionEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Condition) {
      throw new Error(`BundleEntryEditor cannot open this entry as Condition: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<ConditionEntryEditor>(BundleEditableResourceTypes.condition, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one MedicationStatement editor. */
  public asMedicationStatement(): MedicationStatementEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.MedicationStatement) {
      throw new Error(`BundleEntryEditor cannot open this entry as MedicationStatement: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<MedicationStatementEntryEditor>(BundleEditableResourceTypes.medicationStatement, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one DocumentReference editor. */
  public asDocumentReference(): DocumentReferenceEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.DocumentReference) {
      throw new Error(`BundleEntryEditor cannot open this entry as DocumentReference: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<DocumentReferenceEntryEditor>(BundleEditableResourceTypes.documentReference, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one CarePlan editor. */
  public asCarePlan(): CarePlanEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.CarePlan) {
      throw new Error(`BundleEntryEditor cannot open this entry as CarePlan: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<CarePlanEntryEditor>(BundleEditableResourceTypes.carePlan, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one Flag editor. */
  public asFlag(): FlagEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Flag) {
      throw new Error(`BundleEntryEditor cannot open this entry as Flag: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<FlagEntryEditor>(BundleEditableResourceTypes.flag, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one ClinicalImpression editor. */
  public asClinicalImpression(): ClinicalImpressionEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.ClinicalImpression) {
      throw new Error(`BundleEntryEditor cannot open this entry as ClinicalImpression: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<ClinicalImpressionEntryEditor>(BundleEditableResourceTypes.clinicalImpression, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one Device editor. */
  public asDevice(): DeviceEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Device) {
      throw new Error(`BundleEntryEditor cannot open this entry as Device: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<DeviceEntryEditor>(BundleEditableResourceTypes.device, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one DeviceUseStatement editor. */
  public asDeviceUseStatement(): DeviceUseStatementEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.DeviceUseStatement) {
      throw new Error(`BundleEntryEditor cannot open this entry as DeviceUseStatement: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<DeviceUseStatementEntryEditor>(BundleEditableResourceTypes.deviceUseStatement, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one Encounter editor. */
  public asEncounter(): EncounterEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Encounter) {
      throw new Error(`BundleEntryEditor cannot open this entry as Encounter: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<EncounterEntryEditor>(BundleEditableResourceTypes.encounter, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one Coverage editor. */
  public asCoverage(): CoverageEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Coverage) {
      throw new Error(`BundleEntryEditor cannot open this entry as Coverage: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<CoverageEntryEditor>(BundleEditableResourceTypes.coverage, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one Immunization editor. */
  public asImmunization(): ImmunizationEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Immunization) {
      throw new Error(`BundleEntryEditor cannot open this entry as Immunization: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<ImmunizationEntryEditor>(BundleEditableResourceTypes.immunization, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one Procedure editor. */
  public asProcedure(): ProcedureEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.Procedure) {
      throw new Error(`BundleEntryEditor cannot open this entry as Procedure: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<ProcedureEntryEditor>(BundleEditableResourceTypes.procedure, this.bundleEditor, this.entryIndex);
  }

  /** Opens the current entry as one DiagnosticReport editor. */
  public asDiagnosticReport(): DiagnosticReportEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== ResourceTypesFhirR4.DiagnosticReport) {
      throw new Error(`BundleEntryEditor cannot open this entry as DiagnosticReport: ${String(entry.resource?.resourceType || '')}`);
    }
    return createRegisteredBundleEntryEditor<DiagnosticReportEntryEditor>(BundleEditableResourceTypes.diagnosticReport, this.bundleEditor, this.entryIndex);
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

  /** Returns the mutable staged entry owned by this editor wrapper. */
  protected getMutableEntry(): BuiltBundleEntry {
    return this.bundleEditor.getMutableEntry(this.entryIndex);
  }

  /** Returns a cloned claims view for safe read-modify-write helper code. */
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
