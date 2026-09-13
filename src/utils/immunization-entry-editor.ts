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

  /** Writes the vaccine code from `code`, `system|code`, or separate `system, code` arguments. */
  public setVaccineCode(code?: string | null): this;
  public setVaccineCode(codeSystem: string, codeValue: string): this;
  public setVaccineCode(codeOrSystem?: string | null, codeValue?: string): this {
    return this.setCodingTokenCode(ImmunizationClaim.VaccineCode, codeOrSystem, codeValue);
  }

  /** Reads the vaccine code. */
  public getVaccineCode(): string | undefined {
    return this.getCodingTokenCode(ImmunizationClaim.VaccineCode);
  }

  /** Replaces only the vaccine coding system. */
  public setVaccineCodeSystem(system?: string | null): this {
    return this.setCodingTokenSystem(ImmunizationClaim.VaccineCode, system);
  }

  /** Reads only the vaccine coding system. */
  public getVaccineCodeSystem(): string | undefined {
    return this.getCodingTokenSystem(ImmunizationClaim.VaccineCode);
  }

  /** Writes the vaccine coding system and code value together. */
  public setVaccineSystemAndCode(system?: string | null, code?: string | null): this {
    return this.setCodingTokenSystemAndCode(ImmunizationClaim.VaccineCode, system, code);
  }

  /** Reads the vaccine coding system and code as one compact token. */
  public getVaccineSystemAndCode(): string | undefined {
    return this.getCodingTokenSystemAndCode(ImmunizationClaim.VaccineCode);
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

  /** Writes the reason code from `code`, `system|code`, or separate `system, code` arguments. */
  public setReasonCode(code?: string | null): this;
  public setReasonCode(codeSystem: string, codeValue: string): this;
  public setReasonCode(codeOrSystem?: string | null, codeValue?: string): this {
    return this.setCodingTokenCode(ImmunizationClaim.ReasonCode, codeOrSystem, codeValue);
  }

  /** Reads the reason code. */
  public getReasonCode(): string | undefined {
    return this.getCodingTokenCode(ImmunizationClaim.ReasonCode);
  }

  public setReasonCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(ImmunizationClaim.ReasonCode, system); }
  public getReasonCodeSystem(): string | undefined { return this.getCodingTokenSystem(ImmunizationClaim.ReasonCode); }
  public setReasonSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(ImmunizationClaim.ReasonCode, system, code); }
  public getReasonSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(ImmunizationClaim.ReasonCode); }

  /** Writes the status reason. */
  public setStatusReason(reason?: string | null): this;
  public setStatusReason(codeSystem: string, codeValue: string): this;
  public setStatusReason(reasonOrSystem?: string | null, codeValue?: string): this {
    return this.setCodingTokenCode(ImmunizationClaim.StatusReason, reasonOrSystem, codeValue);
  }

  /** Reads the status reason. */
  public getStatusReason(): string | undefined {
    return this.getCodingTokenSystemAndCode(ImmunizationClaim.StatusReason);
  }

  public getStatusReasonCode(): string | undefined { return this.getCodingTokenCode(ImmunizationClaim.StatusReason); }

  public setStatusReasonCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(ImmunizationClaim.StatusReason, system); }
  public getStatusReasonCodeSystem(): string | undefined { return this.getCodingTokenSystem(ImmunizationClaim.StatusReason); }
  public setStatusReasonSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(ImmunizationClaim.StatusReason, system, code); }
  public getStatusReasonSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(ImmunizationClaim.StatusReason); }

  /** Writes the target disease. */
  public setTargetDisease(code?: string | null): this;
  public setTargetDisease(codeSystem: string, codeValue: string): this;
  public setTargetDisease(codeOrSystem?: string | null, codeValue?: string): this {
    return this.setCodingTokenCode(ImmunizationClaim.TargetDisease, codeOrSystem, codeValue);
  }

  /** Reads the target disease. */
  public getTargetDisease(): string | undefined {
    return this.getCodingTokenSystemAndCode(ImmunizationClaim.TargetDisease);
  }

  public getTargetDiseaseCode(): string | undefined { return this.getCodingTokenCode(ImmunizationClaim.TargetDisease); }

  public setTargetDiseaseCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(ImmunizationClaim.TargetDisease, system); }
  public getTargetDiseaseCodeSystem(): string | undefined { return this.getCodingTokenSystem(ImmunizationClaim.TargetDisease); }
  public setTargetDiseaseSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(ImmunizationClaim.TargetDisease, system, code); }
  public getTargetDiseaseSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(ImmunizationClaim.TargetDisease); }

  public setRoute(code?: string | null): this;
  public setRoute(codeSystem: string, codeValue: string): this;
  public setRoute(codeOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(ImmunizationClaim.Route, codeOrSystem, codeValue); }
  public getRoute(): string | undefined { return this.getCodingTokenSystemAndCode(ImmunizationClaim.Route); }
  public getRouteCode(): string | undefined { return this.getCodingTokenCode(ImmunizationClaim.Route); }
  public setRouteCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(ImmunizationClaim.Route, system); }
  public getRouteCodeSystem(): string | undefined { return this.getCodingTokenSystem(ImmunizationClaim.Route); }
  public setRouteSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(ImmunizationClaim.Route, system, code); }
  public getRouteSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(ImmunizationClaim.Route); }

  public setSite(code?: string | null): this;
  public setSite(codeSystem: string, codeValue: string): this;
  public setSite(codeOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(ImmunizationClaim.Site, codeOrSystem, codeValue); }
  public getSite(): string | undefined { return this.getCodingTokenSystemAndCode(ImmunizationClaim.Site); }
  public getSiteCode(): string | undefined { return this.getCodingTokenCode(ImmunizationClaim.Site); }
  public setSiteCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(ImmunizationClaim.Site, system); }
  public getSiteCodeSystem(): string | undefined { return this.getCodingTokenSystem(ImmunizationClaim.Site); }
  public setSiteSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(ImmunizationClaim.Site, system, code); }
  public getSiteSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(ImmunizationClaim.Site); }

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
