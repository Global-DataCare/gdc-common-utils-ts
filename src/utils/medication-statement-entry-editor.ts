/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - Keep exactly one exported class per file.
 * - Keep this file focused on one typed editor surface.
 * - Move shared helpers to reusable helper/base modules instead of duplicating logic here.
 */
import { ClinicalResourceEntryEditor } from './clinical-resource-entry-editor';
import { MedicationStatementClaim, MedicationStatementClaimsFhirApiExtended } from '../models/interoperable-claims/medication-statement-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged MedicationStatement resource entry.
 *
 * Use this surface in the frontend when the user creates, corrects, or reviews
 * medication data one entry at a time before the final document is built.
 */
export class MedicationStatementEntryEditor extends ClinicalResourceEntryEditor {
  /** Overrides the canonical identifier when import or migration logic needs one explicit public id. */
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(MedicationStatementClaim.Identifier, identifier); }
  /** Returns the canonical identifier currently exposed for this medication entry. */
  public getIdentifier(): string | undefined { return this.getIdentifierValue(MedicationStatementClaim.Identifier); }
  /** Ensures the entry has one synchronized canonical identifier across public claim, `resource.id`, and `fullUrl`. */
  public ensureIdentifier(): string { return this.ensureIdentifierValue(MedicationStatementClaim.Identifier); }
  /** Sets the subject/patient reference for this medication statement. */
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(MedicationStatementClaim.Subject, MedicationStatementClaim.Patient, subject); }
  /** Returns the subject/patient reference for this medication statement. */
  public getSubject(): string | undefined { return this.getSubjectClaims(MedicationStatementClaim.Subject, MedicationStatementClaim.Patient); }
  /** Sets the medication statement status. */
  public setStatus(status?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.Status, status); }
  /** Returns the medication statement status. */
  public getStatus(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.Status); }
  /** Sets the effective date or period token stored in the flat-claims model. */
  public setEffective(value?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.Effective, value); }
  /** Returns the effective date or period token. */
  public getEffective(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.Effective); }
  /** Sets the official `code` token SearchParameter value for `medication.concept`. */
  public setCode(code?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.Code, code); }
  /** Returns the official `code` token SearchParameter value. */
  public getCode(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.Code); }
  /** Sets the official `medication` reference SearchParameter value for `medication.reference`. */
  public setMedication(reference?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.Medication, reference); }
  /** Returns the official `medication` reference SearchParameter value. */
  public getMedication(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.Medication); }
  /** @deprecated Prefer `setCodeTextLocal`; this compatibility method now emits canonical `code-text`. */
  public setMedicationText(text?: string | null): this { return this.setCodeTextLocal(text); }
  /** Returns canonical `code-text`, falling back to historical `medication-text`. */
  public getMedicationText(): string | undefined { return this.getCodeTextLocal(); }
  /** Sets local/manual `medication.concept.text` as canonical `code-text`. */
  public setCodeTextLocal(text?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.CodeText, text); }
  /** Returns the local-language medication text. */
  public getCodeTextLocal(): string | undefined {
    return this.getScalarClaim(MedicationStatementClaim.CodeText)
      || this.getScalarClaim(MedicationStatementClaim.MedicationText);
  }
  /** Sets the English/international terminology display. */
  public setCodeDisplay(display?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.CodeDisplay, display); }
  /** Returns the English/international terminology display. */
  public getCodeDisplay(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.CodeDisplay); }
  /** Sets the official R5 `adherence` token; the dotted HL7 FHIRPath is never emitted as a claim key. */
  public setAdherence(value?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.Adherence, value); }
  /** Returns the official R5 `adherence` token SearchParameter value. */
  public getAdherence(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.Adherence); }
  /** Convenience alias that emits the official R5 `adherence` SearchParameter claim. */
  public setAdherenceCode(value?: string | null): this { return this.setAdherence(value); }
  /** Convenience alias that reads the official R5 `adherence` SearchParameter claim. */
  public getAdherenceCode(): string | undefined { return this.getAdherence(); }
  /** Sets local/manual text for the R5 adherence CodeableConcept. */
  public setAdherenceCodeTextLocal(value?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.AdherenceText, value); }
  /** Returns local/manual text for the R5 adherence CodeableConcept. */
  public getAdherenceCodeTextLocal(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.AdherenceText); }
  /** Sets the terminology display for the R5 adherence Coding. */
  public setAdherenceCodeDisplay(value?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.AdherenceDisplay, value); }
  /** Returns the terminology display for the R5 adherence Coding. */
  public getAdherenceCodeDisplay(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.AdherenceDisplay); }
  /** Sets one free-text note attached to the medication entry. */
  public setNote(note?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.Note, note); }
  /** Returns the current medication note. */
  public getNote(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.Note); }
  /** Sets one flat-text dosage instruction. */
  public setDosageInstruction(value?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.DosageInstruction, value); }
  /** Returns the flat-text dosage instruction. */
  public getDosageInstruction(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.DosageInstruction); }
  /** Replaces the medication category/section tags used by document assembly and local filtering. */
  public setCategoryList(values: readonly string[]): this { return this.setCsvClaimList(MedicationStatementClaim.Category, values); }
  /** Returns the medication category/section tags. */
  public getCategoryList(): string[] { return this.getCsvClaimList(MedicationStatementClaim.Category); }
  /** Sets the numeric dose quantity value. */
  public setDoseQuantityValue(value?: number | null): this { return this.setNumberClaim(MedicationStatementClaim.DoseQuantityValue, value); }
  /** Returns the numeric dose quantity value. */
  public getDoseQuantityValue(): number | undefined { return this.getNumberClaim(MedicationStatementClaim.DoseQuantityValue); }
  /** Sets the dose quantity unit token. */
  public setDoseQuantityUnit(value?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.DoseQuantityUnit, value); }
  /** Returns the dose quantity unit token. */
  public getDoseQuantityUnit(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.DoseQuantityUnit); }
  /** Sets the timing frequency for structured dosage authoring. */
  public setTimingFrequency(value?: number | null): this { return this.setNumberClaim(MedicationStatementClaim.TimingFrequency, value); }
  /** Returns the timing frequency. */
  public getTimingFrequency(): number | undefined { return this.getNumberClaim(MedicationStatementClaim.TimingFrequency); }
  /** Sets the timing period for structured dosage authoring. */
  public setTimingPeriod(value?: number | null): this { return this.setNumberClaim(MedicationStatementClaim.TimingPeriod, value); }
  /** Returns the timing period. */
  public getTimingPeriod(): number | undefined { return this.getNumberClaim(MedicationStatementClaim.TimingPeriod); }
  /** Sets the timing period unit token. */
  public setTimingPeriodUnit(value?: string | null): this { return this.setScalarClaim(MedicationStatementClaim.TimingPeriodUnit, value); }
  /** Returns the timing period unit token. */
  public getTimingPeriodUnit(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.TimingPeriodUnit); }
  /** Marks whether this dosage is `as needed`. */
  public setDosageAsNeeded(value?: boolean | null): this { return this.setBooleanClaim(MedicationStatementClaimsFhirApiExtended.DosageAsNeeded, value); }
  /** Returns whether this dosage is `as needed`. */
  public getDosageAsNeeded(): boolean | undefined { return this.getBooleanClaim(MedicationStatementClaimsFhirApiExtended.DosageAsNeeded); }
  /** Replaces the linked child-resource reference list, typically `DocumentReference/...` items. */
  public setContainedResourceReferenceList(references: readonly string[]): this { return this.setCsvClaimList(MedicationStatementClaim.ContainedReferenceList, references); }
  /** Returns the linked child-resource reference list. */
  public getContainedResourceReferenceList(): string[] { return this.getCsvClaimList(MedicationStatementClaim.ContainedReferenceList); }
  /** Marks whether the medication was user-entered or user-confirmed in self-managed flows. */
  public setUserSelected(value?: boolean | null): this { return this.setBooleanClaim(MedicationStatementClaim.UserSelected, value); }
  /** Returns whether the medication was marked as user-selected. */
  public getUserSelected(): boolean | undefined { return this.getBooleanClaim(MedicationStatementClaim.UserSelected); }
  /** @deprecated Use `setContainedResourceReferenceList(...)`. */
  public setContainedDocumentIdentifierList(identifiers: readonly string[]): this { return this.setContainedResourceReferenceList(identifiers); }
  /** @deprecated Use `getContainedResourceReferenceList()`. */
  public getContainedDocumentIdentifierList(): string[] { return this.getContainedResourceReferenceList(); }
}

registerBundleEntryEditor(BundleEditableResourceTypes.medicationStatement, MedicationStatementEntryEditor);
