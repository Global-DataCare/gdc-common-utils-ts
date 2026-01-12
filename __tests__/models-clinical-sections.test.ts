import {
  clinicalSectionRegistry,
  getClinicalSectionByCode,
  loincI18nKey,
  supportedClinicalSectionCodes,
  clinicalSectionTitleEn,
} from '../src/models/clinical-sections.js';

describe('clinical sections', () => {
  it('builds i18n keys from LOINC codes', () => {
    expect(loincI18nKey('1234-5')).toBe('org.loinc.1234-5');
  });

  it('exposes supported section codes', () => {
    const codes = Object.keys(clinicalSectionTitleEn);
    expect(supportedClinicalSectionCodes.length).toBe(codes.length);
    expect(supportedClinicalSectionCodes).toContain(codes[0]);
  });

  it('provides registry entries', () => {
    const code = supportedClinicalSectionCodes[0];
    const entry = clinicalSectionRegistry[code];
    expect(entry.code).toBe(code);
    expect(entry.i18nKey).toBe(loincI18nKey(code));
  });

  it('gets clinical section by code', () => {
    const code = supportedClinicalSectionCodes[0];
    expect(getClinicalSectionByCode(code)?.code).toBe(code);
    expect(getClinicalSectionByCode('missing')).toBeUndefined();
  });
});
