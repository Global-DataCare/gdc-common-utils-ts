// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
import { describe, expect, it } from '@jest/globals';

import {
  BundleEditableResourceTypes,
  BundleEditor,
  EXAMPLE_CONDITION_CODE,
  EXAMPLE_IMMUNIZATION_TARGET_DISEASE,
  EXAMPLE_IMMUNIZATION_VACCINE_CODE,
  codingFromValue,
} from '../src';
import { ImmunizationClaim } from '../src/models/interoperable-claims/immunization-claims.js';

function splitFixture(token: string): readonly [string, string] {
  const separator = token.indexOf('|');
  return [token.slice(0, separator), token.slice(separator + 1)];
}

describe('FHIR token accessors on typed clinical entry editors', () => {
  it('keeps system and code independently editable while getCode returns only the code value', () => {
    const [vaccineSystem, vaccineCode] = splitFixture(EXAMPLE_IMMUNIZATION_VACCINE_CODE);
    const [targetSystem, targetCode] = splitFixture(EXAMPLE_IMMUNIZATION_TARGET_DISEASE);
    const immunization = new BundleEditor()
      .newEntryAs(BundleEditableResourceTypes.immunization)
      .asImmunization();

    immunization.setVaccineCode(vaccineSystem, vaccineCode);
    expect(immunization.getVaccineCode()).toBe(vaccineCode);
    expect(immunization.getVaccineCodeSystem()).toBe(vaccineSystem);
    expect(immunization.getVaccineSystemAndCode()).toBe(EXAMPLE_IMMUNIZATION_VACCINE_CODE);

    immunization.setVaccineCode(targetCode);
    expect(immunization.getVaccineCode()).toBe(targetCode);
    expect(immunization.getVaccineSystemAndCode()).toBe(`${vaccineSystem}|${targetCode}`);

    immunization.setVaccineCodeSystem(targetSystem);
    expect(immunization.getVaccineCode()).toBe(targetCode);
    expect(immunization.getVaccineSystemAndCode()).toBe(EXAMPLE_IMMUNIZATION_TARGET_DISEASE);

    immunization.setTargetDisease(targetSystem, targetCode);
    expect(immunization.getTargetDisease()).toBe(EXAMPLE_IMMUNIZATION_TARGET_DISEASE);
    expect(immunization.getTargetDiseaseCode()).toBe(targetCode);
    expect(immunization.getTargetDiseaseCodeSystem()).toBe(targetSystem);
    expect(immunization.getTargetDiseaseSystemAndCode()).toBe(EXAMPLE_IMMUNIZATION_TARGET_DISEASE);

    const resource = immunization.doneEntry().build().entry?.[0]?.resource as
      | { meta?: { claims?: Record<string, unknown> } }
      | undefined;
    const claims = resource?.meta?.claims || {};
    expect(claims[ImmunizationClaim.VaccineCode]).toBe(EXAMPLE_IMMUNIZATION_TARGET_DISEASE);
    expect(claims[ImmunizationClaim.TargetDisease]).toBe(EXAMPLE_IMMUNIZATION_TARGET_DISEASE);
  });

  it('offers the same accessors for another coded field and accepts the existing compact token', () => {
    const [conditionSystem, conditionCode] = splitFixture(EXAMPLE_CONDITION_CODE);
    const condition = new BundleEditor()
      .newEntryAs(BundleEditableResourceTypes.condition)
      .asCondition();

    condition.setCode(EXAMPLE_CONDITION_CODE);
    expect(condition.getCode()).toBe(conditionCode);
    expect(condition.getCodeSystem()).toBe(conditionSystem);
    expect(condition.getSystemAndCode()).toBe(EXAMPLE_CONDITION_CODE);

    condition.setSystemAndCode(conditionSystem, conditionCode);
    expect(condition.getSystemAndCode()).toBe(EXAMPLE_CONDITION_CODE);

    condition.setCode(EXAMPLE_CONDITION_CODE);
    expect(condition.getSystemAndCode()).toBe(EXAMPLE_CONDITION_CODE);
  });

  it('keeps the separator in the compact representation when only a code value is available', () => {
    const [, conditionCode] = splitFixture(EXAMPLE_CONDITION_CODE);
    const condition = new BundleEditor()
      .newEntryAs(BundleEditableResourceTypes.condition)
      .asCondition();

    condition.setCode(conditionCode);

    expect(condition.getCode()).toBe(conditionCode);
    expect(condition.getCodeSystem()).toBeUndefined();
    expect(condition.getSystemAndCode()).toBe(`|${conditionCode}`);
    expect(codingFromValue(condition.getSystemAndCode())).toEqual([{ code: conditionCode }]);
  });

  it('clears a coded claim when the one-argument code setter receives no value', () => {
    const condition = new BundleEditor()
      .newEntryAs(BundleEditableResourceTypes.condition)
      .asCondition()
      .setCode(EXAMPLE_CONDITION_CODE)
      .setCode(undefined);

    expect(condition.getCode()).toBeUndefined();
    expect(condition.getCodeSystem()).toBeUndefined();
    expect(condition.getSystemAndCode()).toBeUndefined();
  });
});
