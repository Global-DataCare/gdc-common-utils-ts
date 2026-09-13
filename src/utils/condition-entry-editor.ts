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
import { ConditionClaim } from '../models/interoperable-claims/condition-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged Condition resource entry.
 *
 * Use this when a caller needs to stage one condition row with claims-first
 * accessors in a bundle authoring flow.
 */
export class ConditionEntryEditor extends ClinicalResourceEntryEditor {
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(ConditionClaim.Identifier, identifier); }
  public getIdentifier(): string | undefined { return this.getIdentifierValue(ConditionClaim.Identifier); }
  public ensureIdentifier(): string { return this.ensureIdentifierValue(ConditionClaim.Identifier); }
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(ConditionClaim.Subject, ConditionClaim.Subject, subject); }
  public getSubject(): string | undefined { return this.getSubjectClaims(ConditionClaim.Subject, ConditionClaim.Subject); }
  public setCode(code?: string | null): this;
  public setCode(codeSystem: string, codeValue: string): this;
  public setCode(codeOrSystem?: string | null, codeValue?: string): this {
    return this.setCodingTokenCode(ConditionClaim.Code, codeOrSystem, codeValue);
  }
  public getCode(): string | undefined { return this.getCodingTokenCode(ConditionClaim.Code); }
  public setCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(ConditionClaim.Code, system); }
  public getCodeSystem(): string | undefined { return this.getCodingTokenSystem(ConditionClaim.Code); }
  public setSystemAndCode(system?: string | null, code?: string | null): this {
    return this.setCodingTokenSystemAndCode(ConditionClaim.Code, system, code);
  }
  public getSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(ConditionClaim.Code); }
  /** Writes the local-language condition name projected to FHIR `code.text`. */
  public setCodeTextLocal(text?: string | null): this { return this.setScalarClaim(ConditionClaim.CodeText, text); }
  /** Reads the local-language condition name. */
  public getCodeTextLocal(): string | undefined { return this.getScalarClaim(ConditionClaim.CodeText); }
  /** Writes the English/international terminology display. */
  public setCodeDisplay(display?: string | null): this { return this.setScalarClaim(ConditionClaim.CodeDisplay, display); }
  /** Reads the English/international terminology display. */
  public getCodeDisplay(): string | undefined { return this.getScalarClaim(ConditionClaim.CodeDisplay); }
  public setClinicalStatus(status?: string | null): this { return this.setScalarClaim(ConditionClaim.ClinicalStatus, status); }
  public getClinicalStatus(): string | undefined { return this.getScalarClaim(ConditionClaim.ClinicalStatus); }
  public setVerificationStatus(status?: string | null): this { return this.setScalarClaim(ConditionClaim.VerificationStatus, status); }
  public getVerificationStatus(): string | undefined { return this.getScalarClaim(ConditionClaim.VerificationStatus); }
  public setCategory(category?: string | null): this;
  public setCategory(codeSystem: string, codeValue: string): this;
  public setCategory(categoryOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(ConditionClaim.Category, categoryOrSystem, codeValue); }
  public getCategory(): string | undefined { return this.getCodingTokenSystemAndCode(ConditionClaim.Category); }
  public getCategoryCode(): string | undefined { return this.getCodingTokenCode(ConditionClaim.Category); }
  public setCategoryCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(ConditionClaim.Category, system); }
  public getCategoryCodeSystem(): string | undefined { return this.getCodingTokenSystem(ConditionClaim.Category); }
  public setCategorySystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(ConditionClaim.Category, system, code); }
  public getCategorySystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(ConditionClaim.Category); }
  public setSeverity(severity?: string | null): this;
  public setSeverity(codeSystem: string, codeValue: string): this;
  public setSeverity(severityOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(ConditionClaim.Severity, severityOrSystem, codeValue); }
  public getSeverity(): string | undefined { return this.getCodingTokenSystemAndCode(ConditionClaim.Severity); }
  public getSeverityCode(): string | undefined { return this.getCodingTokenCode(ConditionClaim.Severity); }
  public setSeverityCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(ConditionClaim.Severity, system); }
  public getSeverityCodeSystem(): string | undefined { return this.getCodingTokenSystem(ConditionClaim.Severity); }
  public setSeveritySystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(ConditionClaim.Severity, system, code); }
  public getSeveritySystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(ConditionClaim.Severity); }
  public setOnsetDateTime(value?: string | null): this { return this.setScalarClaim(ConditionClaim.OnsetDateTime, value); }
  public getOnsetDateTime(): string | undefined { return this.getScalarClaim(ConditionClaim.OnsetDateTime); }
  public setRecorder(reference?: string | null): this { return this.setScalarClaim(ConditionClaim.Recorder, reference); }
  public getRecorder(): string | undefined { return this.getScalarClaim(ConditionClaim.Recorder); }
  public setContainedDocumentIdentifierList(identifiers: readonly string[]): this { return this.setCsvClaimList(ConditionClaim.ContainedReferenceList, identifiers); }
  public getContainedDocumentIdentifierList(): string[] { return this.getCsvClaimList(ConditionClaim.ContainedReferenceList); }
}


registerBundleEntryEditor(BundleEditableResourceTypes.condition, ConditionEntryEditor);
