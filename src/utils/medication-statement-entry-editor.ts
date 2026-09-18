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
  public setEffective(value?: string | null): this {
    this.removeClaim(MedicationStatementClaim.EffectivePeriodStart);
    this.removeClaim(MedicationStatementClaim.EffectivePeriodEnd);
    return this.setScalarClaim(MedicationStatementClaim.Effective, value);
  }
  /** Returns the effective date or period token. */
  public getEffective(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.Effective); }
  /** Sets the start of `effectivePeriod` and clears the mutually exclusive dateTime claim. */
  public setEffectivePeriodStart(value?: string | null): this {
    if (value?.trim()) this.removeClaim(MedicationStatementClaim.Effective);
    return this.setScalarClaim(MedicationStatementClaim.EffectivePeriodStart, value);
  }
  /** Returns the start of `effectivePeriod`. */
  public getEffectivePeriodStart(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.EffectivePeriodStart); }
  /** Sets the end of `effectivePeriod`, promoting an existing dateTime value to the period start. */
  public setEffectivePeriodEnd(value?: string | null): this {
    if (value?.trim()) {
      const effective = this.getEffective();
      if (effective && !this.getEffectivePeriodStart()) {
        this.setScalarClaim(MedicationStatementClaim.EffectivePeriodStart, effective);
      }
      this.removeClaim(MedicationStatementClaim.Effective);
    }
    return this.setScalarClaim(MedicationStatementClaim.EffectivePeriodEnd, value);
  }
  /** Returns the end of `effectivePeriod`. */
  public getEffectivePeriodEnd(): string | undefined { return this.getScalarClaim(MedicationStatementClaim.EffectivePeriodEnd); }
  /** Sets the medication code from `code`, `system|code`, or separate `system, code` arguments. */
  public setCode(code?: string | null): this;
  public setCode(codeSystem: string, codeValue: string): this;
  public setCode(codeOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(MedicationStatementClaim.Code, codeOrSystem, codeValue); }
  /** Returns only the medication code value. */
  public getCode(): string | undefined { return this.getCodingTokenCode(MedicationStatementClaim.Code); }
  public setCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(MedicationStatementClaim.Code, system); }
  public getCodeSystem(): string | undefined { return this.getCodingTokenSystem(MedicationStatementClaim.Code); }
  public setSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(MedicationStatementClaim.Code, system, code); }
  public getSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(MedicationStatementClaim.Code); }
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
  /** Convenience accessor for the R5 adherence coding. */
  public setAdherenceCode(value?: string | null): this;
  public setAdherenceCode(codeSystem: string, codeValue: string): this;
  public setAdherenceCode(valueOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(MedicationStatementClaim.Adherence, valueOrSystem, codeValue); }
  public getAdherenceCode(): string | undefined { return this.getCodingTokenCode(MedicationStatementClaim.Adherence); }
  public setAdherenceCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(MedicationStatementClaim.Adherence, system); }
  public getAdherenceCodeSystem(): string | undefined { return this.getCodingTokenSystem(MedicationStatementClaim.Adherence); }
  public setAdherenceSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(MedicationStatementClaim.Adherence, system, code); }
  public getAdherenceSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(MedicationStatementClaim.Adherence); }
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
  /** Sets the dose quantity unit from `code`, `system|code`, or separate `system, code` arguments. */
  public setDoseQuantityUnit(value?: string | null): this;
  public setDoseQuantityUnit(codeSystem: string, codeValue: string): this;
  public setDoseQuantityUnit(valueOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(MedicationStatementClaim.DoseQuantityUnit, valueOrSystem, codeValue); }
  /** Returns the compact dose quantity unit token. */
  public getDoseQuantityUnit(): string | undefined { return this.getCodingTokenSystemAndCode(MedicationStatementClaim.DoseQuantityUnit); }
  public getDoseQuantityUnitCode(): string | undefined { return this.getCodingTokenCode(MedicationStatementClaim.DoseQuantityUnit); }
  public setDoseQuantityUnitCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(MedicationStatementClaim.DoseQuantityUnit, system); }
  public getDoseQuantityUnitCodeSystem(): string | undefined { return this.getCodingTokenSystem(MedicationStatementClaim.DoseQuantityUnit); }
  public setDoseQuantityUnitSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(MedicationStatementClaim.DoseQuantityUnit, system, code); }
  public getDoseQuantityUnitSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(MedicationStatementClaim.DoseQuantityUnit); }
  public setDosageRoute(value?: string | null): this;
  public setDosageRoute(codeSystem: string, codeValue: string): this;
  public setDosageRoute(valueOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(MedicationStatementClaim.DosageRoute, valueOrSystem, codeValue); }
  public getDosageRoute(): string | undefined { return this.getCodingTokenSystemAndCode(MedicationStatementClaim.DosageRoute); }
  public getDosageRouteCode(): string | undefined { return this.getCodingTokenCode(MedicationStatementClaim.DosageRoute); }
  public setDosageRouteCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(MedicationStatementClaim.DosageRoute, system); }
  public getDosageRouteCodeSystem(): string | undefined { return this.getCodingTokenSystem(MedicationStatementClaim.DosageRoute); }
  public setDosageRouteSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(MedicationStatementClaim.DosageRoute, system, code); }
  public getDosageRouteSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(MedicationStatementClaim.DosageRoute); }
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
