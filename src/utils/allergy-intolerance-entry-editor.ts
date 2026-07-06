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
import { AllergyIntoleranceClaim } from '../models/interoperable-claims/allergy-intolerance-claims';
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
  /** Writes the coded allergy substance. */
  public setCode(code?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.Code, code); }
  /** Reads the coded allergy substance. */
  public getCode(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.Code); }
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
  public setCriticality(criticality?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.Criticality, criticality); }
  /** Reads the allergy criticality. */
  public getCriticality(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.Criticality); }
  /** Writes the onset date/time. */
  public setOnsetDateTime(value?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.OnsetDateTime, value); }
  /** Reads the onset date/time. */
  public getOnsetDateTime(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.OnsetDateTime); }
  /** Writes the recorder reference. */
  public setRecorder(reference?: string | null): this { return this.setScalarClaim(AllergyIntoleranceClaim.Recorder, reference); }
  /** Reads the recorder reference. */
  public getRecorder(): string | undefined { return this.getScalarClaim(AllergyIntoleranceClaim.Recorder); }
  /** Writes the linked contained-document identifier list. */
  public setContainedDocumentIdentifierList(identifiers: readonly string[]): this { return this.setCsvClaimList(AllergyIntoleranceClaim.ContainedDocuments, identifiers); }
  /** Reads the linked contained-document identifier list. */
  public getContainedDocumentIdentifierList(): string[] { return this.getCsvClaimList(AllergyIntoleranceClaim.ContainedDocuments); }
}


registerBundleEntryEditor(BundleEditableResourceTypes.allergyIntolerance, AllergyIntoleranceEntryEditor);
