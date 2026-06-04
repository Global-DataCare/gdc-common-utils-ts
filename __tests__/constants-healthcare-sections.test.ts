import { describe, expect, it } from '@jest/globals';
import {
  HealthcareCanonicalSectionFamilies,
  HealthcareCoreSections,
  HealthcareKindOfDocumentSections,
  HealthcareTypeOfServiceSections,
  HealthcareSubjectMatterDomainSections,
  HealthcareSectionFamilies,
  HealthcareSectionsByFamily,
  HealthcareAllSectionsByCode,
  getHealthcareSectionByCode,
  getHealthcareSectionFamilyByCode,
  getHealthcareSectionsByFamily,
  HealthcareBasicSections,
} from '../src/constants/healthcare.js';

describe('healthcare section families', () => {
  it('exposes canonical core and LP section families with compatibility aliases', () => {
    const coreSections = getHealthcareSectionsByFamily(HealthcareSectionFamilies.CoreSection);
    const kindOfDocumentSections = getHealthcareSectionsByFamily(HealthcareSectionFamilies.KindOfDocument);
    const typeOfServiceSections = getHealthcareSectionsByFamily(HealthcareSectionFamilies.TypeOfService);
    const subjectMatterDomainSections = getHealthcareSectionsByFamily(HealthcareSectionFamilies.SubjectMatterDomainSection);
    const legacySummarySections = getHealthcareSectionsByFamily(HealthcareSectionFamilies.Summary);
    const legacyManagementSections = getHealthcareSectionsByFamily(HealthcareSectionFamilies.Management);

    expect(Object.keys(coreSections).length).toBeGreaterThan(10);
    expect(Object.keys(kindOfDocumentSections).length).toBeGreaterThan(0);
    expect(Object.keys(typeOfServiceSections).length).toBeGreaterThan(0);
    expect(Object.keys(subjectMatterDomainSections).length).toBeGreaterThan(0);
    expect(Object.keys(legacySummarySections).length).toBeGreaterThan(10);
    expect(Object.keys(legacyManagementSections).length).toBeGreaterThan(0);
  });

  it('resolves sections by code and keeps canonical LOINC claim format', () => {
    const section = getHealthcareSectionByCode(HealthcareCoreSections.AllergiesAndIntolerances.attributeValue);

    expect(section).toBeDefined();
    expect(section?.code).toBe(HealthcareCoreSections.AllergiesAndIntolerances.code);
    expect(section?.claim).toBe(HealthcareCoreSections.AllergiesAndIntolerances.claim);
  });

  it('keeps backwards-compatible legacy basic sections', () => {
    expect(HealthcareBasicSections.PatientSummaryDocument.code).toBe(HealthcareCoreSections.PatientSummaryDocument.code);
    expect(HealthcareBasicSections.AllergiesAndIntolerances.claim).toBe(HealthcareCoreSections.AllergiesAndIntolerances.claim);
  });

  it('classifies codes into canonical section families and aggregates them by code', () => {
    const coreCode = HealthcareCoreSections.AllergiesAndIntolerances.code;
    const kindOfDocumentCode = Object.values(HealthcareKindOfDocumentSections)[0].code;
    const typeOfServiceCode = Object.values(HealthcareTypeOfServiceSections)[0].code;
    const subjectMatterDomainCode = Object.values(HealthcareSubjectMatterDomainSections)[0].code;

    expect(getHealthcareSectionFamilyByCode(coreCode)).toBe(HealthcareCanonicalSectionFamilies.CoreSection);
    expect(getHealthcareSectionFamilyByCode(kindOfDocumentCode)).toBe(HealthcareCanonicalSectionFamilies.KindOfDocument);
    expect(getHealthcareSectionFamilyByCode(typeOfServiceCode)).toBe(HealthcareCanonicalSectionFamilies.TypeOfService);
    expect(getHealthcareSectionFamilyByCode(subjectMatterDomainCode)).toBe(HealthcareCanonicalSectionFamilies.SubjectMatterDomain);
    expect(HealthcareAllSectionsByCode[coreCode]).toBeDefined();
    expect(HealthcareAllSectionsByCode[kindOfDocumentCode]).toBeDefined();
    expect(HealthcareAllSectionsByCode[typeOfServiceCode]).toBeDefined();
    expect(HealthcareAllSectionsByCode[subjectMatterDomainCode]).toBeDefined();
  });
});
