import { HealthcareCoreSections } from './healthcare';

export type IndividualSectionDescriptor = Readonly<{
  code: string;
  attributeValue: string;
  titleEn: string;
}>;

function defineSection(code: string, titleEn: string): IndividualSectionDescriptor {
  return Object.freeze({
    code,
    attributeValue: `urn:gdc:individual-section|${code}`,
    titleEn,
  });
}

export const IndividualSectionSystems = Object.freeze({
  Logical: 'urn:gdc:individual-section',
} as const);

export const IndividualLogicalSections = Object.freeze({
  Composition: defineSection('composition', 'Individual composition index'),
  Communications: defineSection('communications', 'Communications'),
  Consents: defineSection('consents', 'Consents'),
  Appointments: defineSection('appointments', 'Appointments'),
  Encounters: defineSection('encounters', 'Encounters'),
  Documents: defineSection('documents', 'Documents'),
  Observations: defineSection('observations', 'Observations'),
  DiagnosticReports: defineSection('diagnostic-reports', 'Diagnostic reports'),
  RelatedPersons: defineSection('related-persons', 'Related persons'),
  Coverage: defineSection('coverage', 'Coverage'),
} as const);

export const IndividualClinicalSections = Object.freeze({
  AllergiesAndIntolerances: HealthcareCoreSections.AllergiesAndIntolerances,
  Conditions: HealthcareCoreSections.ProblemList,
  Immunizations: HealthcareCoreSections.Immunizations,
  Medications: HealthcareCoreSections.HistoryOfMedicationUse,
  Procedures: HealthcareCoreSections.Procedures,
  VitalSigns: HealthcareCoreSections.VitalSigns,
} as const);

export const IndividualAllSections = Object.freeze({
  ...IndividualLogicalSections,
  ...IndividualClinicalSections,
} as const);
