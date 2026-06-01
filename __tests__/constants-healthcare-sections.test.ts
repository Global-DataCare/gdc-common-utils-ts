import { describe, expect, it } from '@jest/globals';
import {
  HealthcareSectionFamilies,
  HealthcareSectionsByFamily,
  HealthcareAllSectionsByCode,
  getHealthcareSectionByCode,
  getHealthcareSectionsByFamily,
  HealthcareBasicSections,
} from '../src/constants/healthcare.js';

describe('healthcare section families', () => {
  it('exposes 3 section families sourced from existing section catalogs', () => {
    const summary = getHealthcareSectionsByFamily(HealthcareSectionFamilies.Summary);
    const management = getHealthcareSectionsByFamily(HealthcareSectionFamilies.Management);
    const subjectMatterDomain = getHealthcareSectionsByFamily(HealthcareSectionFamilies.SubjectMatterDomain);

    expect(Object.keys(summary).length).toBeGreaterThan(10);
    expect(Object.keys(management).length).toBeGreaterThan(10);
    expect(Object.keys(subjectMatterDomain).length).toBeGreaterThan(0);
  });

  it('resolves sections by code and keeps canonical LOINC claim format', () => {
    const section = getHealthcareSectionByCode('48765-2');

    expect(section).toBeDefined();
    expect(section?.code).toBe('48765-2');
    expect(section?.claim).toBe('LOINC|48765-2');
  });

  it('keeps backwards-compatible legacy basic sections', () => {
    expect(HealthcareBasicSections.PatientSummaryDocument.code).toBe('60591-5');
    expect(HealthcareBasicSections.AllergiesAndIntolerances.claim).toBe('LOINC|48765-2');
  });

  it('aggregates family catalogs into all-sections-by-code', () => {
    const summaryCode = '48765-2';
    const managementCode = '60591-5';

    expect(HealthcareSectionsByFamily.summary[summaryCode]).toBeDefined();
    expect(HealthcareSectionsByFamily.management[managementCode]).toBeDefined();
    expect(HealthcareAllSectionsByCode[summaryCode]).toBeDefined();
    expect(HealthcareAllSectionsByCode[managementCode]).toBeDefined();
  });
});
