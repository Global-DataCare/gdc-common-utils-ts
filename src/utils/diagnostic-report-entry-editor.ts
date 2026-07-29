/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - Keep exactly one exported class per file.
 * - Keep this file focused on one typed editor surface.
 * - Move shared helpers to reusable helper/base modules instead of duplicating logic here.
 */
import { ClinicalResourceEntryEditor } from './clinical-resource-entry-editor';
import { DiagnosticReportClaim } from '../models/interoperable-claims/diagnostic-report-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged DiagnosticReport resource entry.
 *
 * Use this surface when the frontend or BFF needs to stage one report with
 * links to results, specimen references, or one rendered attachment.
 */
export class DiagnosticReportEntryEditor extends ClinicalResourceEntryEditor {
  /** Overrides the canonical identifier when import or migration logic needs one explicit public id. */
  public setIdentifier(identifier?: string | null): this {
    return this.setIdentifierValue(DiagnosticReportClaim.Identifier, identifier);
  }

  /** Returns the canonical identifier currently exposed for this report. */
  public getIdentifier(): string | undefined {
    return this.getIdentifierValue(DiagnosticReportClaim.Identifier);
  }

  /** Ensures the entry has one synchronized canonical identifier across public claim, `resource.id`, and `fullUrl`. */
  public ensureIdentifier(): string {
    return this.ensureIdentifierValue(DiagnosticReportClaim.Identifier);
  }

  /** Sets the subject or patient reference for this report. */
  public setSubject(subject?: string | null): this {
    return this.setSubjectClaims(DiagnosticReportClaim.Subject, DiagnosticReportClaim.Patient, subject);
  }

  /** Returns the subject or patient reference for this report. */
  public getSubject(): string | undefined {
    return this.getSubjectClaims(DiagnosticReportClaim.Subject, DiagnosticReportClaim.Patient);
  }

  /** Sets the report status. */
  public setStatus(status?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.Status, status);
  }

  /** Returns the report status. */
  public getStatus(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.Status);
  }

  /** Sets the report date or effective time. */
  public setDate(date?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.Date, date);
  }

  /** Returns the report date or effective time. */
  public getDate(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.Date);
  }

  /** Sets the report category. */
  public setCategory(category?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.Category, category);
  }

  /** Returns the report category. */
  public getCategory(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.Category);
  }

  /** Sets the main report code. */
  public setCode(code?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.Code, code);
  }

  /** Returns the main report code. */
  public getCode(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.Code);
  }

  /** Sets the local-language report name projected to FHIR `code.text`. */
  public setCodeTextLocal(text?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.CodeText, text);
  }

  /** Returns the local-language report name. */
  public getCodeTextLocal(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.CodeText);
  }

  /** Sets the English/international terminology display. */
  public setCodeDisplay(display?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.CodeDisplay, display);
  }

  /** Returns the English/international terminology display. */
  public getCodeDisplay(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.CodeDisplay);
  }

  /** Sets the encounter reference linked to this report. */
  public setEncounter(reference?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.Encounter, reference);
  }

  /** Returns the encounter reference linked to this report. */
  public getEncounter(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.Encounter);
  }

  /** Replaces the performer reference list. */
  public setPerformerList(references: readonly string[]): this {
    return this.setCsvClaimList(DiagnosticReportClaim.Performer, references);
  }

  /** Returns the performer reference list. */
  public getPerformerList(): string[] {
    return this.getCsvClaimList(DiagnosticReportClaim.Performer);
  }

  /** Replaces the result reference list, often Observation references. */
  public setResultList(references: readonly string[]): this {
    return this.setCsvClaimList(DiagnosticReportClaim.Result, references);
  }

  /** Returns the result reference list. */
  public getResultList(): string[] {
    return this.getCsvClaimList(DiagnosticReportClaim.Result);
  }

  /** Replaces the specimen reference list. */
  public setSpecimenList(references: readonly string[]): this {
    return this.setCsvClaimList(DiagnosticReportClaim.Specimen, references);
  }

  /** Returns the specimen reference list. */
  public getSpecimenList(): string[] {
    return this.getCsvClaimList(DiagnosticReportClaim.Specimen);
  }

  /** @deprecated Use the shared contained-resource reference surface on `ClinicalResourceEntryEditor`. */
  public setContainedDocumentIdentifierList(identifiers: readonly string[]): this {
    return this.setCsvClaimList(DiagnosticReportClaim.ContainedDocuments, identifiers);
  }

  /** @deprecated Use the shared contained-resource reference surface on `ClinicalResourceEntryEditor`. */
  public getContainedDocumentIdentifierList(): string[] {
    return this.getCsvClaimList(DiagnosticReportClaim.ContainedDocuments);
  }

  /** Sets the MIME type for one attached presented form. */
  public setPresentedFormContentType(contentType?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.PresentedFormContentType, contentType);
  }

  /** Returns the MIME type for the attached presented form. */
  public getPresentedFormContentType(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.PresentedFormContentType);
  }

  /** Sets the inline base64 payload for one attached presented form. */
  public setPresentedFormData(data?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.PresentedFormData, data);
  }

  /** Returns the inline base64 payload for the attached presented form. */
  public getPresentedFormData(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.PresentedFormData);
  }

  /** Sets the external URL for one attached presented form. */
  public setPresentedFormUrl(url?: string | null): this {
    return this.setScalarClaim(DiagnosticReportClaim.PresentedFormUrl, url);
  }

  /** Returns the external URL for the attached presented form. */
  public getPresentedFormUrl(): string | undefined {
    return this.getScalarClaim(DiagnosticReportClaim.PresentedFormUrl);
  }
}

registerBundleEntryEditor(BundleEditableResourceTypes.diagnosticReport, DiagnosticReportEntryEditor);
