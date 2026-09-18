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
import {
  AllergyIntoleranceClaim,
  type AllergyIntoleranceCriticality,
  type AllergyIntoleranceReactionSeverity,
} from '../models/interoperable-claims/allergy-intolerance-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged AllergyIntolerance resource entry.
 *
 * Use this from frontend/BFF bundle-authoring flows when the caller needs one
 * allergy row with canonical claims-first accessors.
 */
export class AllergyIntoleranceEntryEditor extends ClinicalResourceEntryEditor {
  /** Writes the canonical allergy identifier. */
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(AllergyIntoleranceClaim.Identifier, identifier); }
  /** Reads the canonical allergy identifier. */
  public getIdentifier(): string | undefined { return this.getIdentifierValue(AllergyIntoleranceClaim.Identifier); }
  /** Ensures the allergy entry has one canonical `urn:uuid:*` identifier. */
  public ensureIdentifier(): string { return this.ensureIdentifierValue(AllergyIntoleranceClaim.Identifier); }
  /** Writes the subject/patient reference for the allergy entry. */
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(AllergyIntoleranceClaim.Subject, AllergyIntoleranceClaim.Patient, subject); }
  /** Reads the subject/patient reference for the allergy entry. */
  public getSubject(): string | undefined { return this.getSubjectClaims(AllergyIntoleranceClaim.Subject, AllergyIntoleranceClaim.Patient); }
  /** Writes the allergy code from `code`, `system|code`, or separate `system, code` arguments. */
  public setCode(code?: string | null): this;
  public setCode(codeSystem: string, codeValue: string): this;
  public setCode(codeOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(AllergyIntoleranceClaim.Code, codeOrSystem, codeValue); }
  /** Reads only the allergy code value. */
  public getCode(): string | undefined { return this.getCodingTokenCode(AllergyIntoleranceClaim.Code); }
  public setCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(AllergyIntoleranceClaim.Code, system); }
  public getCodeSystem(): string | undefined { return this.getCodingTokenSystem(AllergyIntoleranceClaim.Code); }
  public setSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(AllergyIntoleranceClaim.Code, system, code); }
  public getSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(AllergyIntoleranceClaim.Code); }
  /** Writes the local-language allergy name projected to FHIR `code.text`. */
  public setCodeTextLocal(text?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.CodeText, text); }
  /** Reads the local-language allergy name. */
  public getCodeTextLocal(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.CodeText); }
  /** Writes the English/international terminology display. */
  public setCodeDisplay(display?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.CodeDisplay, display); }
  /** Reads the English/international terminology display. */
  public getCodeDisplay(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.CodeDisplay); }
  /** Writes the clinical status. */
  public setClinicalStatus(status?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.ClinicalStatus, status); }
  /** Reads the clinical status. */
  public getClinicalStatus(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.ClinicalStatus); }
  /** Writes the verification status. */
  public setVerificationStatus(status?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.VerificationStatus, status); }
  /** Reads the verification status. */
  public getVerificationStatus(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.VerificationStatus); }
  /** Writes the allergy category. */
  public setCategory(category?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.Category, category); }
  /** Reads the allergy category. */
  public getCategory(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.Category); }
  /** Writes the allergy criticality. */
  public setCriticality(criticality?: AllergyIntoleranceCriticality | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.Criticality, criticality); }
  /** Reads the allergy criticality. */
  public getCriticality(): AllergyIntoleranceCriticality | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.Criticality) as AllergyIntoleranceCriticality | undefined; }
  /** Writes the clinical manifestation required for a reaction event. Prefer separate coding-system and code-value arguments. */
  public setReactionManifestation(manifestation?: string | null): this;
  public setReactionManifestation(codingSystem: string, codeValue: string): this;
  public setReactionManifestation(manifestationOrCodingSystem?: string | null, codeValue?: string): this {
    return codeValue === undefined
      ? this.setCodingTokenCode(AllergyIntoleranceClaim.Manifestation, manifestationOrCodingSystem)
      : this.setCodingTokenSystemAndCode(AllergyIntoleranceClaim.Manifestation, manifestationOrCodingSystem, codeValue);
  }
  /** Reads the complete compatibility token for the reaction manifestation. */
  public getReactionManifestation(): string | undefined { return this.getCodingTokenSystemAndCode(AllergyIntoleranceClaim.Manifestation); }
  /** Reads the reaction-manifestation coding system without requiring callers to parse a token. */
  public getReactionManifestationSystem(): string | undefined { return this.getCodingTokenSystem(AllergyIntoleranceClaim.Manifestation); }
  /** Reads the reaction-manifestation code value without requiring callers to parse a token. */
  public getReactionManifestationCode(): string | undefined { return this.getCodingTokenCode(AllergyIntoleranceClaim.Manifestation); }
  /** Reads the complete `system|code` manifestation token used by canonical flat claims. */
  public getReactionManifestationSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(AllergyIntoleranceClaim.Manifestation); }
  /** Writes reaction-event severity, which is distinct from potential future-risk criticality. */
  public setReactionSeverity(severity?: AllergyIntoleranceReactionSeverity | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.Severity, severity); }
  /** Reads reaction-event severity. */
  public getReactionSeverity(): AllergyIntoleranceReactionSeverity | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.Severity) as AllergyIntoleranceReactionSeverity | undefined; }
  /** Writes the onset date/time. */
  public setOnsetDateTime(value?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.OnsetDateTime, value); }
  /** Reads the onset date/time. */
  public getOnsetDateTime(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.OnsetDateTime); }
  /** Writes the recorder reference. */
  public setRecorder(reference?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.Recorder, reference); }
  /** Reads the recorder reference. */
  public getRecorder(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.Recorder); }
  /** Writes the linked contained-document identifier list. */
  public setContainedDocumentIdentifierList(identifiers: readonly string[]): this { return this.setCsvClaimList(AllergyIntoleranceClaim.ContainedReferenceList, identifiers); }
  /** Reads the linked contained-document identifier list. */
  public getContainedDocumentIdentifierList(): string[] { return this.getCsvClaimList(AllergyIntoleranceClaim.ContainedReferenceList); }
}


registerBundleEntryEditor(BundleEditableResourceTypes.allergyIntolerance, AllergyIntoleranceEntryEditor);
