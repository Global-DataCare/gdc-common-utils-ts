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
import { CoverageClaim } from '../models/interoperable-claims/coverage-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged Coverage resource entry.
 *
 * Use this when a caller needs to stage one coverage row with claims-first
 * accessors in a bundle authoring flow.
 */
export class CoverageEntryEditor extends ClinicalResourceEntryEditor {
  /** Writes the canonical coverage identifier. */
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(CoverageClaim.Identifier, identifier); }
  /** Reads the canonical coverage identifier. */
  public getIdentifier(): string | undefined { return this.getIdentifierValue(CoverageClaim.Identifier); }
  /** Ensures the coverage entry has one canonical `urn:uuid:*` identifier. */
  public ensureIdentifier(): string { return this.ensureIdentifierValue(CoverageClaim.Identifier); }
  /** Writes the coverage status. */
  public setStatus(value?: string | null): this { return this.setScalarClaim(CoverageClaim.Status, value); }
  /** Reads the coverage status. */
  public getStatus(): string | undefined { return this.getScalarClaim(CoverageClaim.Status); }
  /** Writes the coverage type. */
  public setType(value?: string | null): this { return this.setScalarClaim(CoverageClaim.Type, value); }
  /** Reads the coverage type. */
  public getType(): string | undefined { return this.getScalarClaim(CoverageClaim.Type); }
  /** Writes the policy-holder reference. */
  public setPolicyHolder(value?: string | null): this { return this.setScalarClaim(CoverageClaim.PolicyHolder, value); }
  /** Reads the policy-holder reference. */
  public getPolicyHolder(): string | undefined { return this.getScalarClaim(CoverageClaim.PolicyHolder); }
  /** Writes the subscriber reference. */
  public setSubscriber(value?: string | null): this { return this.setScalarClaim(CoverageClaim.Subscriber, value); }
  /** Reads the subscriber reference. */
  public getSubscriber(): string | undefined { return this.getScalarClaim(CoverageClaim.Subscriber); }
  /** Writes the beneficiary reference. */
  public setBeneficiary(value?: string | null): this { return this.setScalarClaim(CoverageClaim.Beneficiary, value); }
  /** Reads the beneficiary reference. */
  public getBeneficiary(): string | undefined { return this.getScalarClaim(CoverageClaim.Beneficiary); }
  /** Writes the subscriber relationship. */
  public setRelationship(value?: string | null): this { return this.setScalarClaim(CoverageClaim.Relationship, value); }
  /** Reads the subscriber relationship. */
  public getRelationship(): string | undefined { return this.getScalarClaim(CoverageClaim.Relationship); }
  /** Writes the coverage period start. */
  public setPeriodStart(value?: string | null): this { return this.setScalarClaim(CoverageClaim.PeriodStart, value); }
  /** Reads the coverage period start. */
  public getPeriodStart(): string | undefined { return this.getScalarClaim(CoverageClaim.PeriodStart); }
  /** Writes the coverage period end. */
  public setPeriodEnd(value?: string | null): this { return this.setScalarClaim(CoverageClaim.PeriodEnd, value); }
  /** Reads the coverage period end. */
  public getPeriodEnd(): string | undefined { return this.getScalarClaim(CoverageClaim.PeriodEnd); }
  /** Writes the payor list. */
  public setPayorList(values: readonly string[]): this { return this.setCsvClaimList(CoverageClaim.Payor, values); }
  /** Reads the payor list. */
  public getPayorList(): string[] { return this.getCsvClaimList(CoverageClaim.Payor); }
}


registerBundleEntryEditor(BundleEditableResourceTypes.coverage, CoverageEntryEditor);
