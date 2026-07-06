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
import { ImmunizationClaim } from '../models/interoperable-claims/immunization-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged Immunization resource entry.
 *
 * Use this when a caller needs to stage one immunization row with claims-first
 * accessors in a bundle authoring flow.
 */
export class ImmunizationEntryEditor extends ClinicalResourceEntryEditor {
  /** Writes the canonical immunization identifier. */
  public setIdentifier(identifier?: string | null): this {
    return this.setIdentifierValue(ImmunizationClaim.Identifier, identifier);
  }

  /** Reads the canonical immunization identifier. */
  public getIdentifier(): string | undefined {
    return this.getIdentifierValue(ImmunizationClaim.Identifier);
  }

  /** Ensures the immunization entry has one canonical `urn:uuid:*` identifier. */
  public ensureIdentifier(): string {
    return this.ensureIdentifierValue(ImmunizationClaim.Identifier);
  }

  /** Writes the subject/patient reference. */
  public setSubject(subject?: string | null): this {
    return this.setSubjectClaims(ImmunizationClaim.Subject, ImmunizationClaim.Patient, subject);
  }

  /** Reads the subject/patient reference. */
  public getSubject(): string | undefined {
    return this.getSubjectClaims(ImmunizationClaim.Subject, ImmunizationClaim.Patient);
  }

  /** Writes the immunization status. */
  public setStatus(status?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.Status, status);
  }

  /** Reads the immunization status. */
  public getStatus(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.Status);
  }

  /** Writes the administration date. */
  public setDate(date?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.Date, date);
  }

  /** Reads the administration date. */
  public getDate(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.Date);
  }

  /** Writes the vaccine code. */
  public setVaccineCode(code?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.VaccineCode, code);
  }

  /** Reads the vaccine code. */
  public getVaccineCode(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.VaccineCode);
  }

  /** Writes the local vaccine code text. */
  public setVaccineCodeTextLocal(text?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.VaccineCodeText, text);
  }

  /** Reads the local vaccine code text. */
  public getVaccineCodeTextLocal(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.VaccineCodeText);
  }

  /** Writes the vaccine display text. */
  public setVaccineCodeDisplay(display?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.VaccineCodeDisplay, display);
  }

  /** Reads the vaccine display text. */
  public getVaccineCodeDisplay(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.VaccineCodeDisplay);
  }

  /** Writes the location reference. */
  public setLocation(reference?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.Location, reference);
  }

  /** Reads the location reference. */
  public getLocation(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.Location);
  }

  /** Writes the manufacturer reference. */
  public setManufacturer(reference?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.Manufacturer, reference);
  }

  /** Reads the manufacturer reference. */
  public getManufacturer(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.Manufacturer);
  }

  /** Writes the lot number. */
  public setLotNumber(lotNumber?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.LotNumber, lotNumber);
  }

  /** Reads the lot number. */
  public getLotNumber(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.LotNumber);
  }

  /** Writes the performer list. */
  public setPerformerList(references: readonly string[]): this {
    return this.setCsvClaimList(ImmunizationClaim.Performer, references);
  }

  /** Reads the performer list. */
  public getPerformerList(): string[] {
    return this.getCsvClaimList(ImmunizationClaim.Performer);
  }

  /** Writes the reason code. */
  public setReasonCode(code?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.ReasonCode, code);
  }

  /** Reads the reason code. */
  public getReasonCode(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.ReasonCode);
  }

  /** Writes the status reason. */
  public setStatusReason(reason?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.StatusReason, reason);
  }

  /** Reads the status reason. */
  public getStatusReason(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.StatusReason);
  }

  /** Writes the target disease. */
  public setTargetDisease(code?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.TargetDisease, code);
  }

  /** Reads the target disease. */
  public getTargetDisease(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.TargetDisease);
  }

  /** Writes the dose sequence. */
  public setDoseSequence(sequence?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.DoseSequence, sequence);
  }

  /** Reads the dose sequence. */
  public getDoseSequence(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.DoseSequence);
  }

  /** Writes the series. */
  public setSeries(series?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.Series, series);
  }

  /** Reads the series. */
  public getSeries(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.Series);
  }

  /** Writes the reaction date. */
  public setReactionDate(date?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.ReactionDate, date);
  }

  /** Reads the reaction date. */
  public getReactionDate(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.ReactionDate);
  }

  /** Writes the note text. */
  public setNote(note?: string | null): this {
    return this.setScalarClaim(ImmunizationClaim.Note, note);
  }

  /** Reads the note text. */
  public getNote(): string | undefined {
    return this.getScalarClaim(ImmunizationClaim.Note);
  }

  /** Alias for `setNote(...)` used by callers that expect clinical wording. */
  public setClinicalNote(note?: string | null): this {
    return this.setNote(note);
  }

  /** Alias for `getNote()` used by callers that expect clinical wording. */
  public getClinicalNote(): string | undefined {
    return this.getNote();
  }
}


registerBundleEntryEditor(BundleEditableResourceTypes.immunization, ImmunizationEntryEditor);
