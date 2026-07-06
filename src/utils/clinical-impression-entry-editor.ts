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
import { ClinicalImpressionClaim } from '../models/interoperable-claims/clinical-impression-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged ClinicalImpression resource entry.
 *
 * Use this when a caller needs to stage one clinical-impression row with
 * claims-first accessors in a bundle authoring flow.
 */
export class ClinicalImpressionEntryEditor extends ClinicalResourceEntryEditor {
  /** Writes the canonical clinical-impression identifier. */
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(ClinicalImpressionClaim.Identifier, identifier); }
  /** Reads the canonical clinical-impression identifier. */
  public getIdentifier(): string | undefined { return this.getIdentifierValue(ClinicalImpressionClaim.Identifier); }
  /** Ensures the entry has one canonical `urn:uuid:*` identifier. */
  public ensureIdentifier(): string { return this.ensureIdentifierValue(ClinicalImpressionClaim.Identifier); }
  /** Writes the subject/patient reference. */
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(ClinicalImpressionClaim.Subject, ClinicalImpressionClaim.Subject, subject); }
  /** Reads the subject/patient reference. */
  public getSubject(): string | undefined { return this.getSubjectClaims(ClinicalImpressionClaim.Subject, ClinicalImpressionClaim.Subject); }
  /** Writes the status. */
  public setStatus(value?: string | null): this { return this.setScalarClaim(ClinicalImpressionClaim.Status, value); }
  /** Reads the status. */
  public getStatus(): string | undefined { return this.getScalarClaim(ClinicalImpressionClaim.Status); }
  /** Writes the description. */
  public setDescription(value?: string | null): this { return this.setScalarClaim(ClinicalImpressionClaim.Description, value); }
  /** Reads the description. */
  public getDescription(): string | undefined { return this.getScalarClaim(ClinicalImpressionClaim.Description); }
  /** Writes the linked encounter reference. */
  public setEncounter(value?: string | null): this { return this.setScalarClaim(ClinicalImpressionClaim.Encounter, value); }
  /** Reads the linked encounter reference. */
  public getEncounter(): string | undefined { return this.getScalarClaim(ClinicalImpressionClaim.Encounter); }
  /** Writes the effective date/time. */
  public setEffectiveDateTime(value?: string | null): this { return this.setScalarClaim(ClinicalImpressionClaim.EffectiveDateTime, value); }
  /** Reads the effective date/time. */
  public getEffectiveDateTime(): string | undefined { return this.getScalarClaim(ClinicalImpressionClaim.EffectiveDateTime); }
  /** Writes the assessor reference. */
  public setAssessor(value?: string | null): this { return this.setScalarClaim(ClinicalImpressionClaim.Assessor, value); }
  /** Reads the assessor reference. */
  public getAssessor(): string | undefined { return this.getScalarClaim(ClinicalImpressionClaim.Assessor); }
  /** Writes the summary text. */
  public setSummary(value?: string | null): this { return this.setScalarClaim(ClinicalImpressionClaim.Summary, value); }
  /** Reads the summary text. */
  public getSummary(): string | undefined { return this.getScalarClaim(ClinicalImpressionClaim.Summary); }
}

registerBundleEntryEditor(BundleEditableResourceTypes.clinicalImpression, ClinicalImpressionEntryEditor);
