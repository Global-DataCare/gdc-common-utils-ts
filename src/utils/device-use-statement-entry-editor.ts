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
import { DeviceUseStatementClaim } from '../models/interoperable-claims/device-use-statement-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged DeviceUseStatement resource entry.
 *
 * Use this when a caller needs to stage one device-use row with claims-first
 * accessors in a bundle authoring flow.
 */
export class DeviceUseStatementEntryEditor extends ClinicalResourceEntryEditor {
  /** Writes the canonical device-use identifier. */
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(DeviceUseStatementClaim.Identifier, identifier); }
  /** Reads the canonical device-use identifier. */
  public getIdentifier(): string | undefined { return this.getIdentifierValue(DeviceUseStatementClaim.Identifier); }
  /** Ensures the device-use entry has one canonical `urn:uuid:*` identifier. */
  public ensureIdentifier(): string { return this.ensureIdentifierValue(DeviceUseStatementClaim.Identifier); }
  /** Writes the subject/patient reference. */
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(DeviceUseStatementClaim.Subject, DeviceUseStatementClaim.Subject, subject); }
  /** Reads the subject/patient reference. */
  public getSubject(): string | undefined { return this.getSubjectClaims(DeviceUseStatementClaim.Subject, DeviceUseStatementClaim.Subject); }
  /** Writes the device-use status. */
  public setStatus(value?: string | null): this { return this.setScalarClaim(DeviceUseStatementClaim.Status, value); }
  /** Reads the device-use status. */
  public getStatus(): string | undefined { return this.getScalarClaim(DeviceUseStatementClaim.Status); }
  /** Writes the linked device reference. */
  public setDevice(value?: string | null): this { return this.setScalarClaim(DeviceUseStatementClaim.Device, value); }
  /** Reads the linked device reference. */
  public getDevice(): string | undefined { return this.getScalarClaim(DeviceUseStatementClaim.Device); }
  /** Writes the recorded-on date. */
  public setRecordedOn(value?: string | null): this { return this.setScalarClaim(DeviceUseStatementClaim.RecordedOn, value); }
  /** Reads the recorded-on date. */
  public getRecordedOn(): string | undefined { return this.getScalarClaim(DeviceUseStatementClaim.RecordedOn); }
  /** Writes the timing date/time. */
  public setTimingDateTime(value?: string | null): this { return this.setScalarClaim(DeviceUseStatementClaim.TimingDateTime, value); }
  /** Reads the timing date/time. */
  public getTimingDateTime(): string | undefined { return this.getScalarClaim(DeviceUseStatementClaim.TimingDateTime); }
  /** Writes the reason code. */
  public setReasonCode(value?: string | null): this { return this.setScalarClaim(DeviceUseStatementClaim.ReasonCode, value); }
  /** Reads the reason code. */
  public getReasonCode(): string | undefined { return this.getScalarClaim(DeviceUseStatementClaim.ReasonCode); }
  /** Writes the source reference. */
  public setSource(value?: string | null): this { return this.setScalarClaim(DeviceUseStatementClaim.Source, value); }
  /** Reads the source reference. */
  public getSource(): string | undefined { return this.getScalarClaim(DeviceUseStatementClaim.Source); }
}


registerBundleEntryEditor(BundleEditableResourceTypes.deviceUseStatement, DeviceUseStatementEntryEditor);
