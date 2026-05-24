import { LOINC_SYSTEM_URL } from '../models/clinical-sections';

export type HealthcareSectionDescriptor = Readonly<{
  system: typeof LOINC_SYSTEM_URL;
  code: string;
  claim: string;
}>;

function defineSection(code: string): HealthcareSectionDescriptor {
  return Object.freeze({
    system: LOINC_SYSTEM_URL,
    code,
    claim: `LOINC|${code}`,
  });
}

export const HealthcareBasicSections = Object.freeze({
  PatientSummaryDocument: defineSection('60591-5'),
  AllergiesAndIntolerances: defineSection('48765-2'),
  HistoryOfMedicationUse: defineSection('10160-0'),
  ProblemList: defineSection('11450-4'),
  Results: defineSection('30954-2'),
  Procedures: defineSection('47519-4'),
  Immunizations: defineSection('11369-6'),
  MedicalDevices: defineSection('46264-8'),
  FunctionalStatus: defineSection('47420-5'),
  PlanOfCare: defineSection('18776-5'),
  SocialHistory: defineSection('29762-2'),
  VitalSigns: defineSection('8716-3'),
});

export const HealthcareAdditionalSections = Object.freeze({
  AdvanceDirectives: defineSection('42348-3'),
  DiagnosticImaging: defineSection('18726-0'),
  HistoryOfPastIllness: defineSection('11348-0'),
  ReasonForReferral: defineSection('42349-1'),
  ChiefComplaint: defineSection('10154-3'),
  HealthcareGeneral: defineSection('56796-6'),
});

export const HealthcareAllSections = Object.freeze({
  ...HealthcareBasicSections,
  ...HealthcareAdditionalSections,
});

export const HealthcareConsentPurposes = Object.freeze({
  Treatment: 'TREAT',
  EmergencyTreatment: 'ETREAT',
  CareManagement: 'CAREMGT',
  Operations: 'HOPERAT',
  PatientAdministration: 'PATADMIN',
  RecordsManagement: 'RECORDMGT',
} as const);

export const HealthcareActorRoles = Object.freeze({
  Controller: 'ISCO-08|1120',
  Physician: 'ISCO-08|2211',
  NursingProfessional: 'ISCO-08|2221',
  Paramedic: 'ISCO-08|2240',
} as const);

export const HealthcareActorRoleCodes = Object.freeze({
  Controller: '1120',
  Physician: '2211',
  PhysicianBroad: '221',
  NursingProfessional: '2221',
  Paramedic: '2240',
} as const);

export const HealthcareConsentActions = Object.freeze({
  PatientSummaryDocument: HealthcareBasicSections.PatientSummaryDocument.claim,
  AllergiesAndIntolerances: HealthcareBasicSections.AllergiesAndIntolerances.claim,
  HistoryOfMedicationUse: HealthcareBasicSections.HistoryOfMedicationUse.claim,
  ProblemList: HealthcareBasicSections.ProblemList.claim,
  Results: HealthcareBasicSections.Results.claim,
  Procedures: HealthcareBasicSections.Procedures.claim,
  Immunizations: HealthcareBasicSections.Immunizations.claim,
} as const);
