import { describe, expect, it } from '@jest/globals';
import {
  HealthcareCanonicalSectionFamilies,
  HealthcareAllSections,
  HealthcareCoreSections,
  HealthcareDocumentTypes,
  HealthcareSummarySections,
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
  HealthcareIpsSectionResourceProfiles,
  HealthcareIpsSharedResourceTypes,
} from '../src/constants/healthcare.js';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';

describe('healthcare section families', () => {
  /**
   * Flow contract: a UI can render the 16 IPS sections in canonical order and
   * use profile resource types as discovery hints without rejecting additional
   * supporting resources referenced by the Composition.
   */
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

  it('exposes the IPS summary subset including the extra HL7 IPS all-sections tokens', () => {
    expect(HealthcareSummarySections.Alert.code).toBe('104605-1');
    expect(HealthcareSummarySections.PregnancyHistory.code).toBe('10162-6');
    expect(HealthcareSummarySections.GoalsAndPreferences.code).toBe('81338-6');
    expect('DietAndNutrition' in HealthcareSummarySections).toBe(false);
    expect('HistoryOfFamilyMemberDiseases' in HealthcareSummarySections).toBe(false);
    expect('HistoryOfHospitalizationsAndOutpatientVisits' in HealthcareSummarySections).toBe(false);
    expect('HistoryOfPresentIllness' in HealthcareSummarySections).toBe(false);
    expect('ProblemListNarrativeReported' in HealthcareSummarySections).toBe(false);
    expect('Instructions' in HealthcareSummarySections).toBe(false);
    expect(Object.values(HealthcareSummarySections)).toHaveLength(16);
    expect('PatientSummaryDocument' in HealthcareSummarySections).toBe(false);
    expect('PlanOfTreatment' in HealthcareSummarySections).toBe(false);
  });

  it('exposes exactly the 16 clinical sections from the IPS 2.0 all-sections example', () => {
    expect(Object.values(HealthcareSummarySections).map((section) => section.code)).toEqual([
      '11450-4',
      '48765-2',
      '10160-0',
      '11369-6',
      '30954-2',
      '47519-4',
      '46264-8',
      '8716-3',
      '29762-2',
      '104605-1',
      '81338-6',
      '42348-3',
      '47420-5',
      '11348-0',
      '10162-6',
      '18776-5',
    ]);
    expect(Object.values(HealthcareSummarySections)).toHaveLength(16);
    expect(
      Object.values(HealthcareSummarySections).some(
        (section) => section.code === HealthcareCoreSections.PatientSummaryDocument.code,
      ),
    ).toBe(false);
    expect(HealthcareSummarySections.PlanOfCare).toBe(HealthcareCoreSections.PlanOfCare);
    expect(HealthcareCoreSections.PlanOfTreatment).toBe(HealthcareCoreSections.PlanOfCare);
  });

  it('describes expected IPS resource types without treating them as an exclusive validator', () => {
    expect(HealthcareIpsSectionResourceProfiles.ProblemList).toEqual({
      section: HealthcareSummarySections.ProblemList,
      requirement: 'required',
      expectedResourceTypes: [ResourceTypesFhirR4.Condition],
      acceptsOtherSupportingResources: true,
    });
    expect(HealthcareIpsSectionResourceProfiles.HistoryOfMedicationUse.expectedResourceTypes).toEqual([
      ResourceTypesFhirR4.MedicationStatement,
      ResourceTypesFhirR4.MedicationRequest,
      ResourceTypesFhirR4.Medication,
    ]);
    expect(HealthcareIpsSectionResourceProfiles.GoalsAndPreferences.acceptsAnyResource).toBe(true);
    expect(HealthcareIpsSectionResourceProfiles.Results.expectedResourceTypes).toEqual(expect.arrayContaining([
      ResourceTypesFhirR4.DiagnosticReport,
      ResourceTypesFhirR4.Observation,
      ResourceTypesFhirR4.Specimen,
      ResourceTypesFhirR4.ImagingStudy,
    ]));
    expect(HealthcareIpsSharedResourceTypes).toEqual(expect.arrayContaining([
      ResourceTypesFhirR4.Organization,
      ResourceTypesFhirR4.Practitioner,
      ResourceTypesFhirR4.PractitionerRole,
      ResourceTypesFhirR4.DocumentReference,
    ]));
  });

  it('keeps one nested hierarchy: IPS summary, extended core, then all sections', () => {
    const ipsCodes = Object.values(HealthcareSummarySections).map((section) => section.code);
    const coreCodes = Object.values(HealthcareCoreSections).map((section) => section.code);
    const allCodes = Object.values(HealthcareAllSections).map((section) => section.code);

    expect(HealthcareDocumentTypes.IPS.code).toBe('60591-5');
    expect(coreCodes).toEqual(expect.arrayContaining(ipsCodes));
    expect(new Set(coreCodes).size).toBe(coreCodes.length);
    expect(coreCodes).toHaveLength(22);
    expect(coreCodes).not.toContain(HealthcareDocumentTypes.IPS.code);
    expect(Object.keys(HealthcareCoreSections)).not.toContain('PlanOfTreatment');
    expect(allCodes).toEqual(expect.arrayContaining(coreCodes));
    expect(HealthcareCoreSections.DietAndNutrition.code).toBe('61144-2');
    expect(HealthcareCoreSections.Instructions.code).toBe('69730-0');
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
