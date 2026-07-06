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
import { FlagClaim } from '../models/interoperable-claims/flag-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged Flag resource entry.
 *
 * Use this when a caller needs to stage one flag row with claims-first
 * accessors in a bundle authoring flow.
 */
export class FlagEntryEditor extends ClinicalResourceEntryEditor {
  /** Writes the canonical flag identifier. */
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(FlagClaim.Identifier, identifier); }
  /** Reads the canonical flag identifier. */
  public getIdentifier(): string | undefined { return this.getIdentifierValue(FlagClaim.Identifier); }
  /** Ensures the flag entry has one canonical `urn:uuid:*` identifier. */
  public ensureIdentifier(): string { return this.ensureIdentifierValue(FlagClaim.Identifier); }
  /** Writes the subject/patient reference. */
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(FlagClaim.Subject, FlagClaim.Patient, subject); }
  /** Reads the subject/patient reference. */
  public getSubject(): string | undefined { return this.getSubjectClaims(FlagClaim.Subject, FlagClaim.Patient); }
  /** Writes the flag status. */
  public setStatus(value?: string | null): this { return this.setScalarClaim(FlagClaim.Status, value); }
  /** Reads the flag status. */
  public getStatus(): string | undefined { return this.getScalarClaim(FlagClaim.Status); }
  /** Writes the flag category. */
  public setCategory(value?: string | null): this { return this.setScalarClaim(FlagClaim.Category, value); }
  /** Reads the flag category. */
  public getCategory(): string | undefined { return this.getScalarClaim(FlagClaim.Category); }
  /** Writes the flag code. */
  public setCode(value?: string | null): this { return this.setScalarClaim(FlagClaim.Code, value); }
  /** Reads the flag code. */
  public getCode(): string | undefined { return this.getScalarClaim(FlagClaim.Code); }
  /** Writes the flag date. */
  public setDate(value?: string | null): this { return this.setScalarClaim(FlagClaim.Date, value); }
  /** Reads the flag date. */
  public getDate(): string | undefined { return this.getScalarClaim(FlagClaim.Date); }
  /** Writes the linked encounter reference. */
  public setEncounter(value?: string | null): this { return this.setScalarClaim(FlagClaim.Encounter, value); }
  /** Reads the linked encounter reference. */
  public getEncounter(): string | undefined { return this.getScalarClaim(FlagClaim.Encounter); }
  /** Writes the flag period start. */
  public setPeriodStart(value?: string | null): this { return this.setScalarClaim(FlagClaim.PeriodStart, value); }
  /** Reads the flag period start. */
  public getPeriodStart(): string | undefined { return this.getScalarClaim(FlagClaim.PeriodStart); }
  /** Writes the flag period end. */
  public setPeriodEnd(value?: string | null): this { return this.setScalarClaim(FlagClaim.PeriodEnd, value); }
  /** Reads the flag period end. */
  public getPeriodEnd(): string | undefined { return this.getScalarClaim(FlagClaim.PeriodEnd); }
}


registerBundleEntryEditor(BundleEditableResourceTypes.flag, FlagEntryEditor);
