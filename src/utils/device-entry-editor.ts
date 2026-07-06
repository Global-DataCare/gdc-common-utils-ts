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
import { DeviceClaim } from '../models/interoperable-claims/device-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged Device resource entry.
 *
 * Use this when a caller needs to stage one device row with claims-first
 * accessors in a bundle authoring flow.
 */
export class DeviceEntryEditor extends ClinicalResourceEntryEditor {
  /** Writes the canonical device identifier. */
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(DeviceClaim.Identifier, identifier); }
  /** Reads the canonical device identifier. */
  public getIdentifier(): string | undefined { return this.getIdentifierValue(DeviceClaim.Identifier); }
  /** Ensures the device entry has one canonical `urn:uuid:*` identifier. */
  public ensureIdentifier(): string { return this.ensureIdentifierValue(DeviceClaim.Identifier); }
  /** Writes the patient reference for the device. */
  public setPatient(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Patient, value); }
  /** Reads the patient reference for the device. */
  public getPatient(): string | undefined { return this.getScalarClaim(DeviceClaim.Patient); }
  /** Writes the device status. */
  public setStatus(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Status, value); }
  /** Reads the device status. */
  public getStatus(): string | undefined { return this.getScalarClaim(DeviceClaim.Status); }
  /** Writes the device type. */
  public setType(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Type, value); }
  /** Reads the device type. */
  public getType(): string | undefined { return this.getScalarClaim(DeviceClaim.Type); }
  /** Writes the manufacturer reference. */
  public setManufacturer(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Manufacturer, value); }
  /** Reads the manufacturer reference. */
  public getManufacturer(): string | undefined { return this.getScalarClaim(DeviceClaim.Manufacturer); }
  /** Writes the model. */
  public setModel(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Model, value); }
  /** Reads the model. */
  public getModel(): string | undefined { return this.getScalarClaim(DeviceClaim.Model); }
  /** Writes the human-readable device name. */
  public setDeviceName(value?: string | null): this { return this.setScalarClaim(DeviceClaim.DeviceName, value); }
  /** Reads the human-readable device name. */
  public getDeviceName(): string | undefined { return this.getScalarClaim(DeviceClaim.DeviceName); }
  /** Writes the serial number. */
  public setSerialNumber(value?: string | null): this { return this.setScalarClaim(DeviceClaim.SerialNumber, value); }
  /** Reads the serial number. */
  public getSerialNumber(): string | undefined { return this.getScalarClaim(DeviceClaim.SerialNumber); }
  /** Writes the owning organization. */
  public setOrganization(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Organization, value); }
  /** Reads the owning organization. */
  public getOrganization(): string | undefined { return this.getScalarClaim(DeviceClaim.Organization); }
  /** Writes the location reference. */
  public setLocation(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Location, value); }
  /** Reads the location reference. */
  public getLocation(): string | undefined { return this.getScalarClaim(DeviceClaim.Location); }
  /** Writes the URL reference. */
  public setUrl(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Url, value); }
  /** Reads the URL reference. */
  public getUrl(): string | undefined { return this.getScalarClaim(DeviceClaim.Url); }
  /** Writes the note text. */
  public setNote(value?: string | null): this { return this.setScalarClaim(DeviceClaim.Note, value); }
  /** Reads the note text. */
  public getNote(): string | undefined { return this.getScalarClaim(DeviceClaim.Note); }
}


registerBundleEntryEditor(BundleEditableResourceTypes.device, DeviceEntryEditor);
