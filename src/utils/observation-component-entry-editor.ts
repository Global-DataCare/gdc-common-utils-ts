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
  public setCode(code: CodingDescriptor | string): this;
  public setCode(codeSystem: string, codeValue: string): this;
  public setCode(codeOrSystem: CodingDescriptor | string, codeValue?: string): this {
    if (typeof codeOrSystem !== 'string') {
      this.setCodingTokenSystemAndCode(ObservationClaim.Code, codeOrSystem.system, codeOrSystem.code);
      this.setClaim(ObservationClaim.CodeSystem, codeOrSystem.system);
      this.setClaim(ObservationClaim.CodeValue, codeOrSystem.code);
      if (codeOrSystem.display) this.setClaim(ObservationClaim.CodeDisplay, codeOrSystem.display);
      return this;
    }
    this.setCodingTokenCode(ObservationClaim.Code, codeOrSystem, codeValue);
    this.setClaim(ObservationClaim.CodeSystem, this.getCodingTokenSystem(ObservationClaim.Code) || '');
    this.setClaim(ObservationClaim.CodeValue, this.getCodingTokenCode(ObservationClaim.Code) || '');
    return this;
  }

  public getCode(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.CodeValue))
      || this.getCodingTokenCode(ObservationClaim.Code);
  }

  public setCodeSystem(system: string): this {
    this.setCodingTokenSystem(ObservationClaim.Code, system);
    return this.setClaim(ObservationClaim.CodeSystem, String(system).trim());
  }

  public getCodeSystem(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.CodeSystem));
  }

  public setCodeValue(value: string): this {
    this.setCodingTokenCode(ObservationClaim.Code, value);
    return this.setClaim(ObservationClaim.CodeValue, String(value).trim());
  }

  public getCodeValue(): string | undefined {
    return this.getCode();
  }

  public setSystemAndCode(system?: string | null, code?: string | null): this {
    this.setCodingTokenSystemAndCode(ObservationClaim.Code, system, code);
    this.setClaim(ObservationClaim.CodeSystem, String(system || '').trim());
    this.setClaim(ObservationClaim.CodeValue, String(code || '').trim());
    return this;
  }

  public getSystemAndCode(): string | undefined {
    return this.getCodingTokenSystemAndCode(ObservationClaim.Code);
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

  public setValueConcept(value?: string | null): this;
  public setValueConcept(codeSystem: string, codeValue: string): this;
  public setValueConcept(valueOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(ObservationClaim.ValueConcept, valueOrSystem, codeValue); }
  public getValueConcept(): string | undefined { return this.getCodingTokenSystemAndCode(ObservationClaim.ValueConcept); }
  public getValueConceptCode(): string | undefined { return this.getCodingTokenCode(ObservationClaim.ValueConcept); }
  public setValueConceptCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(ObservationClaim.ValueConcept, system); }
  public getValueConceptCodeSystem(): string | undefined { return this.getCodingTokenSystem(ObservationClaim.ValueConcept); }
  public setValueConceptSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(ObservationClaim.ValueConcept, system, code); }
  public getValueConceptSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(ObservationClaim.ValueConcept); }

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

  public setValueQuantityUnit(unit: CodingDescriptor | string): this;
  public setValueQuantityUnit(codeSystem: string, codeValue: string): this;
  public setValueQuantityUnit(unitOrSystem: CodingDescriptor | string, codeValue?: string): this {
    return typeof unitOrSystem === 'string'
      ? this.setCodingTokenCode(ObservationClaim.ValueQuantityUnit, unitOrSystem, codeValue)
      : this.setCodingTokenSystemAndCode(ObservationClaim.ValueQuantityUnit, unitOrSystem.system, unitOrSystem.code);
  }

  public getValueQuantityUnit(): string | undefined {
    return this.getCodingTokenSystemAndCode(ObservationClaim.ValueQuantityUnit);
  }

  public getValueQuantityUnitCode(): string | undefined { return this.getCodingTokenCode(ObservationClaim.ValueQuantityUnit); }
  public setValueQuantityUnitCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(ObservationClaim.ValueQuantityUnit, system); }
  public getValueQuantityUnitCodeSystem(): string | undefined { return this.getCodingTokenSystem(ObservationClaim.ValueQuantityUnit); }
  public setValueQuantityUnitSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(ObservationClaim.ValueQuantityUnit, system, code); }
  public getValueQuantityUnitSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(ObservationClaim.ValueQuantityUnit); }

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
