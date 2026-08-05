/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - Keep exactly one exported class per file.
 * - Keep this file focused on one typed editor surface.
 * - Move shared helpers to reusable helper/base modules instead of duplicating logic here.
 */
import { ObservationCategoryCodes, type CodingDescriptor } from '../constants/vital-signs';
import { ObservationClaim } from '../models/interoperable-claims/observation-claims';
import { normalizeOptionalIdentifier } from './bundle-editor-helpers';
import { ClinicalResourceEntryEditor } from './clinical-resource-entry-editor';

/**
 * Typed editor for one staged ObservationComponent resource entry.
 *
 * Keep this surface thin and claim-focused so 101 tests can teach one
 * resource at a time without exposing bundle-internal plumbing.
 */
export class ObservationComponentEntryEditor extends ClinicalResourceEntryEditor {
  public setCode(code: CodingDescriptor | string): this {
    const token = typeof code === 'string' ? code.trim() : code.claim;
    this.setClaim(ObservationClaim.Code, token);
    if (typeof code !== 'string') {
      this.setClaim(ObservationClaim.CodeSystem, code.system);
      this.setClaim(ObservationClaim.CodeValue, code.code);
      if (code.display) {
        this.setClaim(ObservationClaim.CodeDisplay, code.display);
      }
    }
    return this;
  }

  public getCode(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.Code));
  }

  public setCodeSystem(system: string): this {
    return this.setClaim(ObservationClaim.CodeSystem, String(system).trim());
  }

  public getCodeSystem(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.CodeSystem));
  }

  public setCodeValue(value: string): this {
    return this.setClaim(ObservationClaim.CodeValue, String(value).trim());
  }

  public getCodeValue(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.CodeValue));
  }

  public setCodeDisplay(display: string): this {
    return this.setClaim(ObservationClaim.CodeDisplay, String(display).trim());
  }

  public getCodeDisplay(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.CodeDisplay));
  }

  /**
   * Stores the local-language label used by forms and local UI copy.
   *
   * Keep this distinct from `setCodeDisplay(...)`, which is the canonical
   * English/international display carried by the coded concept.
   */
  public setCodeTextLocal(text: string): this {
    return this.setClaim(ObservationClaim.CodeText, String(text).trim());
  }

  /**
   * Returns the local-language label used by forms and local UI copy.
   *
   * Keep this distinct from `getCodeDisplay()`, which returns the canonical
   * English/international display when present.
   */
  public getCodeTextLocal(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.CodeText));
  }

  /** Compatibility alias for older examples/tests. Prefer `setCodeTextLocal(...)`. */
  public setLocalText(text: string): this {
    return this.setCodeTextLocal(text);
  }

  /** Compatibility alias for older examples/tests. Prefer `getCodeTextLocal()`. */
  public getLocalText(): string | undefined {
    return this.getCodeTextLocal();
  }

  public setValueQuantityNumber(value: number): this {
    return this.setClaim(ObservationClaim.ValueQuantityNumber, String(value));
  }

  public getValueQuantityNumber(): number | undefined {
    const raw = this.getClaim(ObservationClaim.ValueQuantityNumber);
    if (raw === undefined || raw === null || raw === '') return undefined;
    const numeric = Number(raw);
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  public setValueQuantityUnit(unit: CodingDescriptor | string): this {
    const normalized = typeof unit === 'string' ? unit.trim() : unit.claim;
    return this.setClaim(ObservationClaim.ValueQuantityUnit, normalized);
  }

  public getValueQuantityUnit(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.ValueQuantityUnit));
  }

  public setValueString(value: string): this {
    return this.setClaim(ObservationClaim.ValueString, String(value).trim());
  }

  public getValueString(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.ValueString));
  }

  public setValueDate(value: string): this {
    return this.setClaim(ObservationClaim.ValueDate, String(value).trim());
  }

  public getValueDate(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.ValueDate));
  }
}

/**
 * Vital-sign-specific editor surface for one staged Observation entry.
 *
 * This layer applies the visible/searchable Vital Signs claim contract on top
 * of the reduced Observation component helpers.
 */
