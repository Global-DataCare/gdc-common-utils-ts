/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - Keep exactly one exported class per file.
 * - Keep this file focused on one typed editor surface.
 * - Move shared helpers to reusable helper/base modules instead of duplicating logic here.
 */
import { ObservationCategoryCodes, VitalSignsCodes, VitalSignsUnits, type CodingDescriptor } from '../constants/vital-signs';
import { ObservationClaim } from '../models/interoperable-claims/observation-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { createCanonicalIdentifierUrn, normalizeOptionalIdentifier } from './bundle-editor-helpers';
import { ObservationComponentEntryEditor } from './observation-component-entry-editor';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged VitalSign resource entry.
 *
 * Use this surface when the frontend needs a simple authoring path for common
 * measurements such as heart rate, temperature, or blood pressure.
 */
export class VitalSignEntryEditor extends ObservationComponentEntryEditor {
  /** Overrides the canonical identifier when import or migration logic needs one explicit public id. */
  public setIdentifier(identifier?: string | null): this {
    const normalized = normalizeOptionalIdentifier(identifier);
    if (!normalized) {
      this.removeClaim(ObservationClaim.Identifier);
      this.setResourceId(undefined);
      this.setFullUrl(undefined);
      return this;
    }
    this.setClaim(ObservationClaim.Identifier, normalized);
    this.setResourceId(normalized);
    this.setFullUrl(normalized);
    return this;
  }

  /** Returns the canonical identifier currently exposed for this vital-sign entry. */
  public getIdentifier(): string | undefined {
    return normalizeOptionalIdentifier(
      this.getClaim(ObservationClaim.Identifier)
        || this.getResourceId()
        || this.getFullUrl(),
    );
  }

  /** Ensures the entry has one synchronized canonical identifier across public claim, `resource.id`, and `fullUrl`. */
  public ensureIdentifier(): string {
    const existing = this.getIdentifier();
    if (existing) return existing;
    const generated = createCanonicalIdentifierUrn();
    this.setIdentifier(generated);
    return generated;
  }

  /** Sets the subject/patient reference for this vital-sign observation. */
  public setSubject(subject: string): this {
    const normalized = String(subject).trim();
    this.setClaim(ObservationClaim.Subject, normalized);
    this.setClaim(ObservationClaim.Patient, normalized);
    return this;
  }

  /** Returns the subject/patient reference for this vital-sign observation. */
  public getSubject(): string | undefined {
    return normalizeOptionalIdentifier(
      this.getClaim(ObservationClaim.Subject)
        || this.getClaim(ObservationClaim.Patient),
    );
  }

  /** Sets the observation status. */
  public setStatus(status: string): this {
    return this.setClaim(ObservationClaim.Status, String(status).trim());
  }

  /** Returns the observation status. */
  public getStatus(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.Status));
  }

  /** Sets the observation category, usually one of the shared vital-sign category descriptors. */
  public setCategory(category: CodingDescriptor | string): this {
    const normalized = typeof category === 'string' ? category.trim() : category.claim;
    return this.setClaim(ObservationClaim.Category, normalized);
  }

  /** Returns the observation category token. */
  public getCategory(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.Category));
  }

  /** Sets the observation date/effective time. */
  public setDate(date: string): this {
    const normalized = String(date).trim();
    this.setClaim(ObservationClaim.Date, normalized);
    this.setClaim(ObservationClaim.EffectiveDateTime, normalized);
    return this;
  }

  /** Returns the observation date/effective time. */
  public getDate(): string | undefined {
    return normalizeOptionalIdentifier(
      this.getClaim(ObservationClaim.Date)
        || this.getClaim(ObservationClaim.EffectiveDateTime),
    );
  }

  /** Sets one free-text note for the vital sign. */
  public setNote(note: string): this {
    return this.setClaim(ObservationClaim.Note, String(note).trim());
  }

  /** Returns the free-text note for the vital sign. */
  public getNote(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.Note));
  }

  /** Seeds the observation code and optional quantity unit for the selected vital-sign family. */
  public setVitalSignType(code: CodingDescriptor, unit?: CodingDescriptor): this {
    this.setCategory(ObservationCategoryCodes.VitalSigns);
    this.setStatus(this.getStatus() || 'final');
    this.setCode(code);
    this.setCodeSystem(code.system);
    this.setCodeValue(code.code);
    if (code.display) {
      this.setCodeDisplay(code.display);
      this.setCodeTextLocal(code.display);
    }
    if (unit) {
      this.setValueQuantityUnit(unit);
    }
    return this;
  }

  /** Convenience helper for heart-rate authoring using the shared code/unit catalog. */
  public setHeartRate(value: number): this {
    this.setVitalSignType(VitalSignsCodes.HeartRate, VitalSignsUnits.BeatsPerMinute);
    return this.setValueQuantityNumber(value);
  }

  /** Returns the heart-rate numeric value. */
  public getHeartRate(): number | undefined {
    return this.getValueQuantityNumber();
  }

  /** Convenience helper for body-temperature authoring using the shared code/unit catalog. */
  public setBodyTemperature(value: number): this {
    this.setVitalSignType(VitalSignsCodes.BodyTemperature, VitalSignsUnits.Celsius);
    return this.setValueQuantityNumber(value);
  }

  /** Returns the body-temperature numeric value. */
  public getBodyTemperature(): number | undefined {
    return this.getValueQuantityNumber();
  }

  /** Convenience helper for systolic blood-pressure authoring. */
  public setSystolicBloodPressure(value: number): this {
    this.setVitalSignType(VitalSignsCodes.SystolicBloodPressure, VitalSignsUnits.MillimeterOfMercury);
    return this.setValueQuantityNumber(value);
  }

  /** Returns the systolic blood-pressure numeric value. */
  public getSystolicBloodPressure(): number | undefined {
    return this.getValueQuantityNumber();
  }

  /** Convenience helper for diastolic blood-pressure authoring. */
  public setDiastolicBloodPressure(value: number): this {
    this.setVitalSignType(VitalSignsCodes.DiastolicBloodPressure, VitalSignsUnits.MillimeterOfMercury);
    return this.setValueQuantityNumber(value);
  }

  /** Returns the diastolic blood-pressure numeric value. */
  public getDiastolicBloodPressure(): number | undefined {
    return this.getValueQuantityNumber();
  }
}

registerBundleEntryEditor(BundleEditableResourceTypes.vitalSign, VitalSignEntryEditor);
