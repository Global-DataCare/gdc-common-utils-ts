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
import { ProcedureClaim } from '../models/interoperable-claims/procedure-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged Procedure resource entry.
 *
 * Use this when a caller needs to stage one procedure row with claims-first
 * accessors in a bundle authoring flow.
 */
export class ProcedureEntryEditor extends ClinicalResourceEntryEditor {
  /** Writes the canonical procedure identifier. */
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(ProcedureClaim.Identifier, identifier); }
  /** Reads the canonical procedure identifier. */
  public getIdentifier(): string | undefined { return this.getIdentifierValue(ProcedureClaim.Identifier); }
  /** Ensures the procedure entry has one canonical `urn:uuid:*` identifier. */
  public ensureIdentifier(): string { return this.ensureIdentifierValue(ProcedureClaim.Identifier); }
  /** Writes the subject/patient reference. */
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(ProcedureClaim.Subject, ProcedureClaim.Patient, subject); }
  /** Reads the subject/patient reference. */
  public getSubject(): string | undefined { return this.getSubjectClaims(ProcedureClaim.Subject, ProcedureClaim.Patient); }
  /** Writes the procedure status. */
  public setStatus(status?: string | null): this { return this.setScalarClaim(ProcedureClaim.Status, status); }
  /** Reads the procedure status. */
  public getStatus(): string | undefined { return this.getScalarClaim(ProcedureClaim.Status); }
  /** Writes the procedure date. */
  public setDate(date?: string | null): this { return this.setScalarClaim(ProcedureClaim.Date, date); }
  /** Reads the procedure date. */
  public getDate(): string | undefined { return this.getScalarClaim(ProcedureClaim.Date); }
  /** Writes the procedure code. */
  public setCode(code?: string | null): this { return this.setScalarClaim(ProcedureClaim.Code, code); }
  /** Reads the procedure code. */
  public getCode(): string | undefined { return this.getScalarClaim(ProcedureClaim.Code); }
  /** Writes the local code text. */
  public setCodeTextLocal(text?: string | null): this { return this.setScalarClaim(ProcedureClaim.CodeText, text); }
  /** Reads the local code text. */
  public getCodeTextLocal(): string | undefined { return this.getScalarClaim(ProcedureClaim.CodeText); }
  /** Writes the code display text. */
  public setCodeDisplay(display?: string | null): this { return this.setScalarClaim(ProcedureClaim.CodeDisplay, display); }
  /** Reads the code display text. */
  public getCodeDisplay(): string | undefined { return this.getScalarClaim(ProcedureClaim.CodeDisplay); }
  /** Writes the encounter reference. */
  public setEncounter(reference?: string | null): this { return this.setScalarClaim(ProcedureClaim.Encounter, reference); }
  /** Reads the encounter reference. */
  public getEncounter(): string | undefined { return this.getScalarClaim(ProcedureClaim.Encounter); }
  /** Writes the location reference. */
  public setLocation(reference?: string | null): this { return this.setScalarClaim(ProcedureClaim.Location, reference); }
  /** Reads the location reference. */
  public getLocation(): string | undefined { return this.getScalarClaim(ProcedureClaim.Location); }
  /** Writes the reason code. */
  public setReasonCode(code?: string | null): this { return this.setScalarClaim(ProcedureClaim.ReasonCode, code); }
  /** Reads the reason code. */
  public getReasonCode(): string | undefined { return this.getScalarClaim(ProcedureClaim.ReasonCode); }
  /** Writes the note text. */
  public setNote(note?: string | null): this { return this.setScalarClaim(ProcedureClaim.Note, note); }
  /** Reads the note text. */
  public getNote(): string | undefined { return this.getScalarClaim(ProcedureClaim.Note); }
  /** Alias for `setNote(...)` used by callers that expect clinical wording. */
  public setClinicalNote(note?: string | null): this { return this.setNote(note); }
  /** Alias for `getNote()` used by callers that expect clinical wording. */
  public getClinicalNote(): string | undefined { return this.getNote(); }
  /** Writes the performer list. */
  public setPerformerList(references: readonly string[]): this { return this.setCsvClaimList(ProcedureClaim.Performer, references); }
  /** Reads the performer list. */
  public getPerformerList(): string[] { return this.getCsvClaimList(ProcedureClaim.Performer); }
  /** Writes the based-on list. */
  public setBasedOnList(references: readonly string[]): this { return this.setCsvClaimList(ProcedureClaim.BasedOn, references); }
  /** Reads the based-on list. */
  public getBasedOnList(): string[] { return this.getCsvClaimList(ProcedureClaim.BasedOn); }
  /** Writes the reason-reference list. */
  public setReasonReferenceList(references: readonly string[]): this { return this.setCsvClaimList(ProcedureClaim.ReasonReference, references); }
  /** Reads the reason-reference list. */
  public getReasonReferenceList(): string[] { return this.getCsvClaimList(ProcedureClaim.ReasonReference); }
}

registerBundleEntryEditor(BundleEditableResourceTypes.procedure, ProcedureEntryEditor);
