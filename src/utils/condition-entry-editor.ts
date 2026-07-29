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
  public setCode(code?: string | null): this { return this.setScalarClaim(ConditionClaim.Code, code); }
  public getCode(): string | undefined { return this.getScalarClaim(ConditionClaim.Code); }
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
  public setCategory(category?: string | null): this { return this.setScalarClaim(ConditionClaim.Category, category); }
  public getCategory(): string | undefined { return this.getScalarClaim(ConditionClaim.Category); }
  public setSeverity(severity?: string | null): this { return this.setScalarClaim(ConditionClaim.Severity, severity); }
  public getSeverity(): string | undefined { return this.getScalarClaim(ConditionClaim.Severity); }
  public setOnsetDateTime(value?: string | null): this { return this.setScalarClaim(ConditionClaim.OnsetDateTime, value); }
  public getOnsetDateTime(): string | undefined { return this.getScalarClaim(ConditionClaim.OnsetDateTime); }
  public setRecorder(reference?: string | null): this { return this.setScalarClaim(ConditionClaim.Recorder, reference); }
  public getRecorder(): string | undefined { return this.getScalarClaim(ConditionClaim.Recorder); }
  public setContainedDocumentIdentifierList(identifiers: readonly string[]): this { return this.setCsvClaimList(ConditionClaim.ContainedReferenceList, identifiers); }
  public getContainedDocumentIdentifierList(): string[] { return this.getCsvClaimList(ConditionClaim.ContainedReferenceList); }
}


registerBundleEntryEditor(BundleEditableResourceTypes.condition, ConditionEntryEditor);
