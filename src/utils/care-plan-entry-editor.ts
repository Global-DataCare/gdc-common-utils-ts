/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - Keep exactly one exported class per file.
 * - Keep this file focused on one typed editor surface.
 * - Move shared helpers to reusable helper/base modules instead of duplicating logic here.
 */
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import type { BundleEditor } from './bundle-editor-core';
import {
  AllowedResourceType,
  type ResourceTypeEntryEditor,
} from '../models/bundle-editor-types';
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
import { ClinicalResourceEntryEditor } from './clinical-resource-entry-editor';
import { CarePlanClaim } from '../models/interoperable-claims/care-plan-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged CarePlan resource entry.
 *
 * Use this when a caller needs to stage one care-plan row with claims-first
 * accessors in a bundle authoring flow.
 */
export class CarePlanEntryEditor extends ClinicalResourceEntryEditor {
  /** Writes the canonical care-plan identifier. */
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(CarePlanClaim.Identifier, identifier); }
  /** Reads the canonical care-plan identifier. */
  public getIdentifier(): string | undefined { return this.getIdentifierValue(CarePlanClaim.Identifier); }
  /** Ensures the care-plan entry has one canonical `urn:uuid:*` identifier. */
  public ensureIdentifier(): string { return this.ensureIdentifierValue(CarePlanClaim.Identifier); }
  /** Writes the subject/patient reference. */
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(CarePlanClaim.Subject, CarePlanClaim.Patient, subject); }
  /** Reads the subject/patient reference. */
  public getSubject(): string | undefined { return this.getSubjectClaims(CarePlanClaim.Subject, CarePlanClaim.Patient); }
  /** Writes the care-plan status. */
  public setStatus(value?: string | null): this { return this.setScalarClaim(CarePlanClaim.Status, value); }
  /** Reads the care-plan status. */
  public getStatus(): string | undefined { return this.getScalarClaim(CarePlanClaim.Status); }
  /** Writes the care-plan intent. */
  public setIntent(value?: string | null): this { return this.setScalarClaim(CarePlanClaim.Intent, value); }
  /** Reads the care-plan intent. */
  public getIntent(): string | undefined { return this.getScalarClaim(CarePlanClaim.Intent); }
  /** Writes the care-plan category. */
  public setCategory(value?: string | null): this;
  public setCategory(codeSystem: string, codeValue: string): this;
  public setCategory(valueOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(CarePlanClaim.Category, valueOrSystem, codeValue); }
  /** Reads the care-plan category. */
  public getCategory(): string | undefined { return this.getCodingTokenSystemAndCode(CarePlanClaim.Category); }
  public getCategoryCode(): string | undefined { return this.getCodingTokenCode(CarePlanClaim.Category); }
  public setCategoryCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(CarePlanClaim.Category, system); }
  public getCategoryCodeSystem(): string | undefined { return this.getCodingTokenSystem(CarePlanClaim.Category); }
  public setCategorySystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(CarePlanClaim.Category, system, code); }
  public getCategorySystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(CarePlanClaim.Category); }
  /** Writes the linked encounter reference. */
  public setEncounter(value?: string | null): this { return this.setScalarClaim(CarePlanClaim.Encounter, value); }
  /** Reads the linked encounter reference. */
  public getEncounter(): string | undefined { return this.getScalarClaim(CarePlanClaim.Encounter); }
  /** Writes the care-plan date. */
  public setDate(value?: string | null): this { return this.setScalarClaim(CarePlanClaim.Date, value); }
  /** Reads the care-plan date. */
  public getDate(): string | undefined { return this.getScalarClaim(CarePlanClaim.Date); }
  /** Writes the note text. */
  public setNote(value?: string | null): this { return this.setScalarClaim(CarePlanClaim.Note, value); }
  /** Reads the note text. */
  public getNote(): string | undefined { return this.getScalarClaim(CarePlanClaim.Note); }
  public setActivityCode(value?: string | null): this;
  public setActivityCode(codeSystem: string, codeValue: string): this;
  public setActivityCode(valueOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(CarePlanClaim.ActivityCode, valueOrSystem, codeValue); }
  public getActivityCode(): string | undefined { return this.getCodingTokenCode(CarePlanClaim.ActivityCode); }
  public setActivityCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(CarePlanClaim.ActivityCode, system); }
  public getActivityCodeSystem(): string | undefined { return this.getCodingTokenSystem(CarePlanClaim.ActivityCode); }
  public setActivitySystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(CarePlanClaim.ActivityCode, system, code); }
  public getActivitySystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(CarePlanClaim.ActivityCode); }
  public setActivityOutcome(value?: string | null): this;
  public setActivityOutcome(codeSystem: string, codeValue: string): this;
  public setActivityOutcome(valueOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(CarePlanClaim.ActivityOutcome, valueOrSystem, codeValue); }
  public getActivityOutcome(): string | undefined { return this.getCodingTokenSystemAndCode(CarePlanClaim.ActivityOutcome); }
  public getActivityOutcomeCode(): string | undefined { return this.getCodingTokenCode(CarePlanClaim.ActivityOutcome); }
  public setActivityOutcomeCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(CarePlanClaim.ActivityOutcome, system); }
  public getActivityOutcomeCodeSystem(): string | undefined { return this.getCodingTokenSystem(CarePlanClaim.ActivityOutcome); }
  public setActivityOutcomeSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(CarePlanClaim.ActivityOutcome, system, code); }
  public getActivityOutcomeSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(CarePlanClaim.ActivityOutcome); }
}


registerBundleEntryEditor(BundleEditableResourceTypes.carePlan, CarePlanEntryEditor);
