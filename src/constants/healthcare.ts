import { LOINC_SYSTEM_URL, loincI18nKey } from '../models/clinical-sections';
import { clinicalWorkbookSummaryLabelI18nEn } from '../models/clinical-workbook-summary';
import {
  HL7_CODING_SYSTEM_PERSONAL_RELATIONSHIP,
  HL7_CODING_SYSTEM_V3_ROLE_CODE,
  HL7_PERSONAL_RELATIONSHIP_ROLES,
  HL7_V3_ROLE_CODE_LEGAL_REPRESENTATIVE,
} from './hl7-roles';
import { DataspaceSectors, type DataspaceSector } from './sectors';
import {
  ResourceTypesFhirR4,
  type ResourceTypeFhirR4,
} from './fhir-resource-types';

export type HealthcareSectionDescriptor = Readonly<{
  system: typeof LOINC_SYSTEM_URL;
  code: string;
  attributeValue: string;
  /**
   * @deprecated Use `attributeValue`.
   * Kept as compatibility alias because this token is a reusable claim value,
   * not a claim key/attribute name.
   */
  claim: string;
  i18nKey: `org.loinc.${string}`;
  titleEn?: string;
}>;

export type HealthcareDocumentTypeDescriptor = Readonly<{
  id: string;
  system: typeof LOINC_SYSTEM_URL;
  code: string;
  attributeValue: string;
  titleEn?: string;
}>;

/**
 * Canonical logical identifiers for document types backed by the LOINC
 * ontology. These keys are stable SDK-facing names; the concrete LOINC token
 * lives in `HealthcareDocumentTypes`.
 */
export const DocumentTypeLoincOntology = Object.freeze({
  IPS: 'IPS',
} as const);

export type DocumentTypeLoincOntologyKey =
  typeof DocumentTypeLoincOntology[keyof typeof DocumentTypeLoincOntology];

export const ISCO08_CODING_SYSTEM = 'org.ilo.isco' as const;
export const ISCO08_I18N_NAMESPACE = 'org.ilo.isco-08' as const;

export const HealthcareRoleFamilies = Object.freeze({
  ProfessionalOccupationIsco08: 'professionalOccupationIsco08',
  PersonalRelationshipHl7: 'personalRelationshipHl7',
  LegalRepresentativeHl7: 'legalRepresentativeHl7',
} as const);

export type HealthcareRoleFamily =
  typeof HealthcareRoleFamilies[keyof typeof HealthcareRoleFamilies];

/**
 * Canonical HL7 access role codes used by self-managed and controller flows.
 *
 * These are the values the portal and shared backend should persist and match.
 */
export type Hl7PersonalAccessRoleCode = 'ONESELF' | 'RESPRSN';

export type HealthcareActorRoleDescriptor = Readonly<{
  family: HealthcareRoleFamily;
  codingSystem: string;
  code: string;
  claim: string;
  i18nKey: `org.ilo.isco-08.${string}` | `org.isco08.${string}` | `org.hl7.terminology.CodeSystem.v3-RoleCode.${string}`;
  titleEn: string;
  definition?: string;
}>;

function defineSection(code: string, titleEn?: string): HealthcareSectionDescriptor {
  const attributeValue = `LOINC|${code}`;
  return Object.freeze({
    system: LOINC_SYSTEM_URL,
    code,
    attributeValue,
    claim: attributeValue,
    i18nKey: loincI18nKey(code) as `org.loinc.${string}`,
    titleEn,
  });
}

function defineDocumentType(id: string, code: string, titleEn?: string): HealthcareDocumentTypeDescriptor {
  return Object.freeze({
    id,
    system: LOINC_SYSTEM_URL,
    code,
    attributeValue: `${LOINC_SYSTEM_URL}|${code}`,
    titleEn,
  });
}

export const HealthcareSectionFamilies = Object.freeze({
  CoreSection: 'core-section',
  KindOfDocument: 'kind-of-document',
  TypeOfService: 'type-of-service',
  SubjectMatterDomainSection: 'subject-matter-domain',
  /** @deprecated Use `CoreSection`. */
  Summary: 'summary',
  /** @deprecated Use `KindOfDocument` and `TypeOfService`. */
  Management: 'management',
  /** @deprecated Use `SubjectMatterDomainSection`. */
  SubjectMatterDomain: 'subjectMatterDomain',
} as const);

export type HealthcareSectionFamily =
  typeof HealthcareSectionFamilies[keyof typeof HealthcareSectionFamilies];

export const HealthcareCanonicalSectionFamilies = Object.freeze({
  CoreSection: HealthcareSectionFamilies.CoreSection,
  KindOfDocument: HealthcareSectionFamilies.KindOfDocument,
  TypeOfService: HealthcareSectionFamilies.TypeOfService,
  SubjectMatterDomain: HealthcareSectionFamilies.SubjectMatterDomainSection,
} as const);

export type HealthcareCanonicalSectionFamily =
  typeof HealthcareCanonicalSectionFamilies[keyof typeof HealthcareCanonicalSectionFamilies];

function workbookLabel(code: string): string | undefined {
  const lookupCode = String(code || '').trim();
  const workbookLabels = clinicalWorkbookSummaryLabelI18nEn as Readonly<Record<string, string>>;
  return workbookLabels[`org.loinc.${lookupCode}`] || undefined;
}

function buildWorkbookSectionCatalog(
  codes: readonly string[],
): Readonly<Record<string, HealthcareSectionDescriptor>> {
  return Object.freeze(
    Object.fromEntries(
      codes.map((code) => [code, defineSection(code, workbookLabel(code))]),
    ),
  );
}

const planOfCareSection = defineSection('18776-5', 'Plan of care');

const healthcareCoreSections = {
  ProblemList: defineSection('11450-4', 'Problem list'),
  AllergiesAndIntolerances: defineSection('48765-2', 'Allergies and adverse reactions'),
  HistoryOfMedicationUse: defineSection('10160-0', 'History of medication use'),
  Immunizations: defineSection('11369-6', 'History of immunization'),
  Results: defineSection('30954-2', 'Relevant diagnostic tests/laboratory data'),
  Procedures: defineSection('47519-4', 'History of Procedures'),
  MedicalDevices: defineSection('46264-8', 'History of medical device use'),
  VitalSigns: defineSection('8716-3', 'Vital signs'),
  SocialHistory: defineSection('29762-2', 'Social history'),
  Alert: defineSection('104605-1', 'Alert'),
  GoalsAndPreferences: defineSection('81338-6', 'Goals / Preferences'),
  AdvanceDirectives: defineSection('42348-3', 'Advance directives'),
  FunctionalStatus: defineSection('47420-5', 'Functional status'),
  HistoryOfPastIllness: defineSection('11348-0', 'History of past illness'),
  PregnancyHistory: defineSection('10162-6', 'Pregnancy History'),
  PlanOfCare: planOfCareSection,
  DietAndNutrition: defineSection('61144-2', 'Diet and nutrition'),
  HistoryOfFamilyMemberDiseases: defineSection('10157-6', 'History of family member diseases'),
  HistoryOfHospitalizationsAndOutpatientVisits: defineSection('46240-8', 'History of hospitalizations+History of outpatient visits'),
  HistoryOfPresentIllness: defineSection('10164-2', 'History of present illness'),
  ProblemListNarrativeReported: defineSection('57852-6', 'Problem list'),
  Instructions: defineSection('69730-0', 'Instructions'),
} as const;

type HealthcareCoreCompatibilityAliases = Readonly<{
  /** @deprecated Use `HealthcareDocumentTypes.IPS`; this is a document type, not a section. */
  PatientSummaryDocument: HealthcareSectionDescriptor;
  /** @deprecated Use `PlanOfCare`; both names resolve to the same LOINC section. */
  PlanOfTreatment: HealthcareSectionDescriptor;
}>;

/**
 * Application healthcare sections: the 16 IPS sections followed by six
 * LOINC-coded extensions. Deprecated aliases remain accessible but are not
 * enumerable, so section pickers and `HealthcareAllSections` do not duplicate
 * the IPS document or plan-of-care entry.
 */
export const HealthcareCoreSections = Object.freeze(
  Object.defineProperties(healthcareCoreSections, {
    PatientSummaryDocument: {
      value: defineSection('60591-5', 'Patient summary document'),
      enumerable: false,
    },
    PlanOfTreatment: {
      value: planOfCareSection,
      enumerable: false,
    },
  }),
) as typeof healthcareCoreSections & HealthcareCoreCompatibilityAliases;

/** @deprecated Use `HealthcareCoreSections`. */
export const HealthcareBasicSections = HealthcareCoreSections;

/**
 * The 16 clinical sections from the official HL7 IPS 2.0 all-sections example.
 * Order follows `Composition.section`. The `60591-5` IPS document descriptor
 * is represented by `HealthcareDocumentTypes.IPS`, not as a section.
 *
 * @see https://hl7.org/fhir/uv/ips/STU2/Bundle-bundle-ips-all-sections.html
 */
export const HealthcareSummarySections = Object.freeze({
  ProblemList: HealthcareCoreSections.ProblemList,
  AllergiesAndIntolerances: HealthcareCoreSections.AllergiesAndIntolerances,
  HistoryOfMedicationUse: HealthcareCoreSections.HistoryOfMedicationUse,
  Immunizations: HealthcareCoreSections.Immunizations,
  Results: HealthcareCoreSections.Results,
  Procedures: HealthcareCoreSections.Procedures,
  MedicalDevices: HealthcareCoreSections.MedicalDevices,
  VitalSigns: HealthcareCoreSections.VitalSigns,
  SocialHistory: HealthcareCoreSections.SocialHistory,
  Alert: HealthcareCoreSections.Alert,
  GoalsAndPreferences: HealthcareCoreSections.GoalsAndPreferences,
  AdvanceDirectives: HealthcareCoreSections.AdvanceDirectives,
  FunctionalStatus: HealthcareCoreSections.FunctionalStatus,
  HistoryOfPastIllness: HealthcareCoreSections.HistoryOfPastIllness,
  PregnancyHistory: HealthcareCoreSections.PregnancyHistory,
  PlanOfCare: HealthcareCoreSections.PlanOfCare,
} as const);

/** Presence level assigned to a section by the IPS structure guide. */
export type HealthcareIpsSectionRequirement = 'required' | 'recommended' | 'optional';

/** Non-exclusive resource expectations for one IPS Composition section. */
export type HealthcareIpsSectionResourceProfile = Readonly<{
  section: HealthcareSectionDescriptor;
  requirement: HealthcareIpsSectionRequirement;
  /**
   * Primary FHIR resource types named by the IPS section structure. This is a
   * rendering/discovery hint, not an exclusive validation list: referenced or
   * supporting resources, including Observation, may occur in other sections.
   */
  expectedResourceTypes: readonly ResourceTypeFhirR4[];
  acceptsOtherSupportingResources: true;
  /** Patient Story explicitly permits any resource type. */
  acceptsAnyResource?: true;
}>;

function defineIpsSectionResourceProfile(
  section: HealthcareSectionDescriptor,
  requirement: HealthcareIpsSectionRequirement,
  expectedResourceTypes: readonly ResourceTypeFhirR4[],
  acceptsAnyResource?: true,
): HealthcareIpsSectionResourceProfile {
  return Object.freeze({
    section,
    requirement,
    expectedResourceTypes: Object.freeze([...expectedResourceTypes]),
    acceptsOtherSupportingResources: true as const,
    ...(acceptsAnyResource ? { acceptsAnyResource } : {}),
  });
}

/**
 * Resource-profile expectations for the 16 IPS 2.0 sections.
 *
 * Consumers must group a document by `Composition.section.entry` references;
 * they must not infer a section from `resourceType` alone because the same
 * type, especially Observation, is valid in several sections.
 *
 * @see https://hl7.org/fhir/uv/ips/STU2/Structure-of-the-International-Patient-Summary.html
 * @see https://hl7.org/fhir/uv/ips/STU2/profiles.html
 */
export const HealthcareIpsSectionResourceProfiles = Object.freeze({
  ProblemList: defineIpsSectionResourceProfile(
    HealthcareSummarySections.ProblemList,
    'required',
    [ResourceTypesFhirR4.Condition],
  ),
  AllergiesAndIntolerances: defineIpsSectionResourceProfile(
    HealthcareSummarySections.AllergiesAndIntolerances,
    'required',
    [ResourceTypesFhirR4.AllergyIntolerance],
  ),
  HistoryOfMedicationUse: defineIpsSectionResourceProfile(
    HealthcareSummarySections.HistoryOfMedicationUse,
    'required',
    [
      ResourceTypesFhirR4.MedicationStatement,
      ResourceTypesFhirR4.MedicationRequest,
      ResourceTypesFhirR4.Medication,
    ],
  ),
  Immunizations: defineIpsSectionResourceProfile(
    HealthcareSummarySections.Immunizations,
    'recommended',
    [ResourceTypesFhirR4.Immunization],
  ),
  Results: defineIpsSectionResourceProfile(
    HealthcareSummarySections.Results,
    'recommended',
    [
      ResourceTypesFhirR4.DiagnosticReport,
      ResourceTypesFhirR4.Observation,
      ResourceTypesFhirR4.Specimen,
      ResourceTypesFhirR4.Device,
      ResourceTypesFhirR4.ImagingStudy,
    ],
  ),
  Procedures: defineIpsSectionResourceProfile(
    HealthcareSummarySections.Procedures,
    'recommended',
    [ResourceTypesFhirR4.Procedure, ResourceTypesFhirR4.Device],
  ),
  MedicalDevices: defineIpsSectionResourceProfile(
    HealthcareSummarySections.MedicalDevices,
    'recommended',
    [ResourceTypesFhirR4.DeviceUseStatement, ResourceTypesFhirR4.Device],
  ),
  VitalSigns: defineIpsSectionResourceProfile(
    HealthcareSummarySections.VitalSigns,
    'optional',
    [ResourceTypesFhirR4.Observation],
  ),
  SocialHistory: defineIpsSectionResourceProfile(
    HealthcareSummarySections.SocialHistory,
    'optional',
    [ResourceTypesFhirR4.Observation],
  ),
  Alert: defineIpsSectionResourceProfile(
    HealthcareSummarySections.Alert,
    'optional',
    [ResourceTypesFhirR4.Flag],
  ),
  GoalsAndPreferences: defineIpsSectionResourceProfile(
    HealthcareSummarySections.GoalsAndPreferences,
    'optional',
    [],
    true,
  ),
  AdvanceDirectives: defineIpsSectionResourceProfile(
    HealthcareSummarySections.AdvanceDirectives,
    'optional',
    [ResourceTypesFhirR4.Consent],
  ),
  FunctionalStatus: defineIpsSectionResourceProfile(
    HealthcareSummarySections.FunctionalStatus,
    'optional',
    [ResourceTypesFhirR4.Condition, ResourceTypesFhirR4.ClinicalImpression],
  ),
  HistoryOfPastIllness: defineIpsSectionResourceProfile(
    HealthcareSummarySections.HistoryOfPastIllness,
    'optional',
    [ResourceTypesFhirR4.Condition],
  ),
  PregnancyHistory: defineIpsSectionResourceProfile(
    HealthcareSummarySections.PregnancyHistory,
    'optional',
    [ResourceTypesFhirR4.Observation],
  ),
  PlanOfCare: defineIpsSectionResourceProfile(
    HealthcareSummarySections.PlanOfCare,
    'optional',
    [ResourceTypesFhirR4.CarePlan, ResourceTypesFhirR4.ImmunizationRecommendation],
  ),
} as const);

/** IPS profiles used across sections rather than owned by one section. */
export const HealthcareIpsSharedResourceTypes = Object.freeze([
  ResourceTypesFhirR4.Organization,
  ResourceTypesFhirR4.Practitioner,
  ResourceTypesFhirR4.PractitionerRole,
  ResourceTypesFhirR4.DocumentReference,
] as const);

export const HealthcareDocumentTypes = Object.freeze({
  [DocumentTypeLoincOntology.IPS]: defineDocumentType(
    DocumentTypeLoincOntology.IPS,
    '60591-5',
    'International Patient Summary',
  ),
} as const);

export const HealthcareKindOfDocumentSections = buildWorkbookSectionCatalog([
  'LP447691-9',
  'LP173390-8',
  'LP173394-0',
  'LP173404-7',
  'LP181204-1',
  'LP173421-1',
]);

const healthcareTypeOfServiceWorkbookSections = buildWorkbookSectionCatalog([
  'LP437010-4',
  'LP310260-7',
  'LP200117-2',
  'LP203673-1',
]);

export const HealthcareTypeOfServiceSections = Object.freeze({
  ...healthcareTypeOfServiceWorkbookSections,
  'LP438240-6': defineSection('LP438240-6', 'Appointment summary'),
});

export const HealthcareSubjectMatterDomainSections = buildWorkbookSectionCatalog([
  'LP172918-7',
  'LP172919-5',
  'LP172923-7',
  'LP172934-4',
  'LP172935-1',
  'LP172957-5',
  'LP183499-5',
  'LP172943-5',
  'LP172894-0',
  'LP172946-8',
  'LP172911-2',
  'LP172941-9',
  'LP172945-0',
  'LP172947-6',
  'LP175685-9',
  'LP172951-8',
  'LP175686-7',
  'LP172962-5',
  'LP173015-1',
  'LP173023-5',
  'LP248728-0',
  'LP417852-3',
  'LP173027-6',
  'LP172956-7',
  'LP173011-0',
  'LP173012-8',
  'LP345049-3',
  'LP172964-1',
  'LP172968-2',
  'LP172971-6',
  'LP172973-2',
  'LP172901-3',
  'LP172974-0',
  'LP434870-4',
  'LP172979-9',
  'LP434767-2',
  'LP172980-7',
  'LP172982-3',
  'LP172984-9',
  'LP173002-9',
  'LP173004-5',
  'LP173008-6',
  'LP173018-5',
  'LP173036-7',
  'LP248732-2',
]);

/** @deprecated Use the explicit LP families instead. */
export const HealthcareAdditionalSections = Object.freeze({
  DiagnosticImaging: defineSection('18726-0'),
  ReasonForReferral: defineSection('42349-1'),
  ChiefComplaint: defineSection('10154-3'),
  HealthcareGeneral: defineSection('56796-6'),
});

export const HealthcareAllSections = Object.freeze({
  ...HealthcareCoreSections,
  ...HealthcareKindOfDocumentSections,
  ...HealthcareTypeOfServiceSections,
  ...HealthcareSubjectMatterDomainSections,
  ...HealthcareAdditionalSections,
});

/**
 * Full section families sourced from the existing section catalogs in
 * `models/clinical-sections.en.ts`.
 *
 * Family mapping used by SDK/business layers:
 * - `core-section`: central summary and IPS-oriented sections.
 * - `kind-of-document`: LP document classification.
 * - `type-of-service`: LP service classification.
 * - `subject-matter-domain`: LP specialty/domain classification.
 * Deprecated aliases remain available for compatibility:
 * - `summary` -> `core-section`
 * - `management` -> merged `kind-of-document` + `type-of-service`
 * - `subjectMatterDomain` -> `subject-matter-domain`
 */
export const HealthcareSectionsByFamily = Object.freeze({
  [HealthcareSectionFamilies.CoreSection]: Object.freeze({
    ...Object.fromEntries(
      Object.values(HealthcareCoreSections).map((descriptor) => [descriptor.code, descriptor]),
    ),
    ...Object.fromEntries(
      Object.values(HealthcareAdditionalSections).map((descriptor) => [descriptor.code, descriptor]),
    ),
  }),
  [HealthcareSectionFamilies.KindOfDocument]: HealthcareKindOfDocumentSections,
  [HealthcareSectionFamilies.TypeOfService]: HealthcareTypeOfServiceSections,
  [HealthcareSectionFamilies.SubjectMatterDomainSection]: HealthcareSubjectMatterDomainSections,
  [HealthcareSectionFamilies.Summary]: Object.freeze({
    ...Object.fromEntries(
      Object.values(HealthcareCoreSections).map((descriptor) => [descriptor.code, descriptor]),
    ),
    ...Object.fromEntries(
      Object.values(HealthcareAdditionalSections).map((descriptor) => [descriptor.code, descriptor]),
    ),
  }),
  [HealthcareSectionFamilies.Management]: Object.freeze({
    ...HealthcareKindOfDocumentSections,
    ...HealthcareTypeOfServiceSections,
  }),
  [HealthcareSectionFamilies.SubjectMatterDomain]: HealthcareSubjectMatterDomainSections,
} as const);

export const HealthcareAllSectionsByCode: Readonly<Record<string, HealthcareSectionDescriptor>> = Object.freeze({
  ...HealthcareSectionsByFamily[HealthcareSectionFamilies.CoreSection],
  ...HealthcareSectionsByFamily[HealthcareSectionFamilies.KindOfDocument],
  ...HealthcareSectionsByFamily[HealthcareSectionFamilies.TypeOfService],
  ...HealthcareSectionsByFamily[HealthcareSectionFamilies.SubjectMatterDomainSection],
  ...HealthcareAdditionalSections,
});

export function getHealthcareSectionByCode(code: string): HealthcareSectionDescriptor | undefined {
  const normalizedCode = String(code || '').trim().split('|').slice(-1)[0];
  return HealthcareAllSectionsByCode[normalizedCode];
}

export function getHealthcareSectionFamilyByCode(
  code: string,
): HealthcareCanonicalSectionFamily | undefined {
  const normalizedCode = String(code || '').trim().split('|').slice(-1)[0];
  const coreSections = HealthcareSectionsByFamily[
    HealthcareSectionFamilies.CoreSection
  ] as Readonly<Record<string, HealthcareSectionDescriptor>>;
  const kindOfDocumentSections = HealthcareSectionsByFamily[
    HealthcareSectionFamilies.KindOfDocument
  ] as Readonly<Record<string, HealthcareSectionDescriptor>>;
  const typeOfServiceSections = HealthcareSectionsByFamily[
    HealthcareSectionFamilies.TypeOfService
  ] as Readonly<Record<string, HealthcareSectionDescriptor>>;
  const subjectMatterDomainSections = HealthcareSectionsByFamily[
    HealthcareSectionFamilies.SubjectMatterDomainSection
  ] as Readonly<Record<string, HealthcareSectionDescriptor>>;

  if (coreSections[normalizedCode]) {
    return HealthcareCanonicalSectionFamilies.CoreSection;
  }
  if (kindOfDocumentSections[normalizedCode]) {
    return HealthcareCanonicalSectionFamilies.KindOfDocument;
  }
  if (typeOfServiceSections[normalizedCode]) {
    return HealthcareCanonicalSectionFamilies.TypeOfService;
  }
  if (subjectMatterDomainSections[normalizedCode]) {
    return HealthcareCanonicalSectionFamilies.SubjectMatterDomain;
  }
  return undefined;
}

export function getHealthcareSectionsByFamily(
  family: HealthcareSectionFamily,
): Readonly<Record<string, HealthcareSectionDescriptor>> {
  return HealthcareSectionsByFamily[family];
}

export const HealthcareConsentPurposes = Object.freeze({
  Treatment: 'TREAT',
  EmergencyTreatment: 'ETREAT',
  /** HL7 v3 ActReason: healthcare research. */
  Research: 'HRESCH',
  CareManagement: 'CAREMGT',
  Operations: 'HOPERAT',
  PatientAdministration: 'PATADMIN',
  RecordsManagement: 'RECORDMGT',
} as const);

export const HealthcareActorRoles = Object.freeze({
  /** Bare HL7 v3 RoleCode used for an organization controller. */
  Controller: 'RESPRSN',
  MedicalDoctors: 'ISCO-08|221',
  GeneralistMedicalPractitioner: 'ISCO-08|2211',
  SpecialistMedicalPractitioner: 'ISCO-08|2212',
  /**
   * @deprecated Use `GeneralistMedicalPractitioner`.
   * Kept as compatibility alias for the historical SDK name.
   */
  Physician: 'ISCO-08|2211',
  NursingProfessional: 'ISCO-08|2221',
  MidwiferyProfessional: 'ISCO-08|2222',
  Paramedic: 'ISCO-08|2240',
  Veterinarian: 'ISCO-08|2250',
  VeterinaryTechnicianOrAssistant: 'ISCO-08|3240',
  /** Administrative health occupation; it does not imply clinical authority. */
  MedicalSecretary: 'ISCO-08|3344',
} as const);

export const HealthcareActorRoleCodes = Object.freeze({
  Controller: 'RESPRSN',
  MedicalDoctors: '221',
  GeneralistMedicalPractitioner: '2211',
  SpecialistMedicalPractitioner: '2212',
  /**
   * @deprecated Use `GeneralistMedicalPractitioner`.
   * Kept as compatibility alias for the historical SDK name.
   */
  Physician: '2211',
  /**
   * @deprecated Use `MedicalDoctors`.
   * Kept as compatibility alias for the historical SDK name.
   */
  PhysicianBroad: '221',
  NursingProfessional: '2221',
  MidwiferyProfessional: '2222',
  Paramedic: '2240',
  Veterinarian: '2250',
  VeterinaryTechnicianOrAssistant: '3240',
  MedicalSecretary: '3344',
} as const);

function buildProfessionalIscoRoles(): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
  const entries: Array<[string, HealthcareActorRoleDescriptor]> = [
    [
      HealthcareActorRoleCodes.MedicalDoctors,
      Object.freeze({
        family: HealthcareRoleFamilies.ProfessionalOccupationIsco08,
        codingSystem: ISCO08_CODING_SYSTEM,
        code: HealthcareActorRoleCodes.MedicalDoctors,
        claim: HealthcareActorRoles.MedicalDoctors,
        i18nKey: `${ISCO08_I18N_NAMESPACE}.${HealthcareActorRoleCodes.MedicalDoctors}`,
        titleEn: 'Medical doctors',
      }),
    ],
    [
      HealthcareActorRoleCodes.GeneralistMedicalPractitioner,
      Object.freeze({
        family: HealthcareRoleFamilies.ProfessionalOccupationIsco08,
        codingSystem: ISCO08_CODING_SYSTEM,
        code: HealthcareActorRoleCodes.GeneralistMedicalPractitioner,
        claim: HealthcareActorRoles.GeneralistMedicalPractitioner,
        i18nKey: `${ISCO08_I18N_NAMESPACE}.${HealthcareActorRoleCodes.GeneralistMedicalPractitioner}`,
        titleEn: 'Generalist medical practitioner',
      }),
    ],
    [
      HealthcareActorRoleCodes.SpecialistMedicalPractitioner,
      Object.freeze({
        family: HealthcareRoleFamilies.ProfessionalOccupationIsco08,
        codingSystem: ISCO08_CODING_SYSTEM,
        code: HealthcareActorRoleCodes.SpecialistMedicalPractitioner,
        claim: HealthcareActorRoles.SpecialistMedicalPractitioner,
        i18nKey: `${ISCO08_I18N_NAMESPACE}.${HealthcareActorRoleCodes.SpecialistMedicalPractitioner}`,
        titleEn: 'Specialist medical practitioner',
      }),
    ],
    [
      HealthcareActorRoleCodes.NursingProfessional,
      Object.freeze({
        family: HealthcareRoleFamilies.ProfessionalOccupationIsco08,
        codingSystem: ISCO08_CODING_SYSTEM,
        code: HealthcareActorRoleCodes.NursingProfessional,
        claim: HealthcareActorRoles.NursingProfessional,
        i18nKey: `${ISCO08_I18N_NAMESPACE}.${HealthcareActorRoleCodes.NursingProfessional}`,
        titleEn: 'Nursing professional',
      }),
    ],
    [
      HealthcareActorRoleCodes.MidwiferyProfessional,
      Object.freeze({
        family: HealthcareRoleFamilies.ProfessionalOccupationIsco08,
        codingSystem: ISCO08_CODING_SYSTEM,
        code: HealthcareActorRoleCodes.MidwiferyProfessional,
        claim: HealthcareActorRoles.MidwiferyProfessional,
        i18nKey: `${ISCO08_I18N_NAMESPACE}.${HealthcareActorRoleCodes.MidwiferyProfessional}`,
        titleEn: 'Midwifery professional',
      }),
    ],
    [
      HealthcareActorRoleCodes.Paramedic,
      Object.freeze({
        family: HealthcareRoleFamilies.ProfessionalOccupationIsco08,
        codingSystem: ISCO08_CODING_SYSTEM,
        code: HealthcareActorRoleCodes.Paramedic,
        claim: HealthcareActorRoles.Paramedic,
        i18nKey: `${ISCO08_I18N_NAMESPACE}.${HealthcareActorRoleCodes.Paramedic}`,
        titleEn: 'Paramedic',
      }),
    ],
    [
      HealthcareActorRoleCodes.Veterinarian,
      Object.freeze({
        family: HealthcareRoleFamilies.ProfessionalOccupationIsco08,
        codingSystem: ISCO08_CODING_SYSTEM,
        code: HealthcareActorRoleCodes.Veterinarian,
        claim: HealthcareActorRoles.Veterinarian,
        i18nKey: `${ISCO08_I18N_NAMESPACE}.${HealthcareActorRoleCodes.Veterinarian}`,
        titleEn: 'Veterinarian',
      }),
    ],
    [
      HealthcareActorRoleCodes.VeterinaryTechnicianOrAssistant,
      Object.freeze({
        family: HealthcareRoleFamilies.ProfessionalOccupationIsco08,
        codingSystem: ISCO08_CODING_SYSTEM,
        code: HealthcareActorRoleCodes.VeterinaryTechnicianOrAssistant,
        claim: HealthcareActorRoles.VeterinaryTechnicianOrAssistant,
        i18nKey: `${ISCO08_I18N_NAMESPACE}.${HealthcareActorRoleCodes.VeterinaryTechnicianOrAssistant}`,
        titleEn: 'Veterinary technician or assistant',
      }),
    ],
    [
      HealthcareActorRoleCodes.MedicalSecretary,
      Object.freeze({
        family: HealthcareRoleFamilies.ProfessionalOccupationIsco08,
        codingSystem: ISCO08_CODING_SYSTEM,
        code: HealthcareActorRoleCodes.MedicalSecretary,
        claim: HealthcareActorRoles.MedicalSecretary,
        i18nKey: `${ISCO08_I18N_NAMESPACE}.${HealthcareActorRoleCodes.MedicalSecretary}`,
        titleEn: 'Medical secretary',
      }),
    ],
  ];

  return Object.freeze(Object.fromEntries(entries));
}

function buildPersonalRelationshipRoles(): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
  return Object.freeze(
    Object.fromEntries(
      HL7_PERSONAL_RELATIONSHIP_ROLES.map((item) => [
        item.code,
        Object.freeze({
          family: HealthcareRoleFamilies.PersonalRelationshipHl7,
          codingSystem: HL7_CODING_SYSTEM_V3_ROLE_CODE,
          code: item.code,
          claim: `v3-RoleCode|${item.code}`,
          i18nKey: `org.hl7.terminology.CodeSystem.v3-RoleCode.${item.code}`,
          titleEn: item.display,
          definition: item.definition,
        }),
      ]),
    ),
  );
}

function buildLegalRepresentativeRoles(): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
  return Object.freeze(
    Object.fromEntries(
      HL7_V3_ROLE_CODE_LEGAL_REPRESENTATIVE.map((item) => [
        item.code,
        Object.freeze({
          family: HealthcareRoleFamilies.LegalRepresentativeHl7,
          codingSystem: HL7_CODING_SYSTEM_V3_ROLE_CODE,
          code: item.code,
          claim: `v3-RoleCode|${item.code}`,
          i18nKey: `org.hl7.terminology.CodeSystem.v3-RoleCode.${item.code}`,
          titleEn: item.display,
          definition: item.definition,
        }),
      ]),
    ),
  );
}

export const HealthcareRolesByFamily = Object.freeze({
  [HealthcareRoleFamilies.ProfessionalOccupationIsco08]: buildProfessionalIscoRoles(),
  [HealthcareRoleFamilies.PersonalRelationshipHl7]: buildPersonalRelationshipRoles(),
  [HealthcareRoleFamilies.LegalRepresentativeHl7]: buildLegalRepresentativeRoles(),
} as const);

export const HealthcareAllRolesByClaim: Readonly<Record<string, HealthcareActorRoleDescriptor>> = Object.freeze(
  Object.fromEntries(
    Object.values(HealthcareRolesByFamily)
      .flatMap((catalog) => Object.values(catalog))
      .flatMap((descriptor) => [
        [descriptor.claim, descriptor],
        [descriptor.code, descriptor],
      ]),
  ),
);

function pickRoleCatalogByCodes(
  catalog: Readonly<Record<string, HealthcareActorRoleDescriptor>>,
  codes: ReadonlyArray<string>,
): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
  return Object.freeze(
    Object.fromEntries(
      codes
        .map((code) => [code, catalog[code]] as const)
        .filter((entry): entry is readonly [string, HealthcareActorRoleDescriptor] => Boolean(entry[1])),
    ),
  );
}

function reindexRoleCatalogByClaim(
  catalog: Readonly<Record<string, HealthcareActorRoleDescriptor>>,
): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
  return Object.freeze(
    Object.fromEntries(
      Object.values(catalog).flatMap((descriptor) => [
        [descriptor.claim, descriptor] as const,
        [descriptor.code, descriptor] as const,
      ]),
    ),
  );
}

const HealthcareProfessionalAndControllerRoles = Object.freeze({
  ...HealthcareRolesByFamily[HealthcareRoleFamilies.ProfessionalOccupationIsco08],
  [HealthcareActorRoleCodes.Controller]:
    HealthcareRolesByFamily[HealthcareRoleFamilies.LegalRepresentativeHl7][HealthcareActorRoleCodes.Controller],
});

export const HealthcareProfessionalRoleCodesBySector = Object.freeze({
  [DataspaceSectors.HealthCare]: Object.freeze([
    HealthcareActorRoleCodes.Controller,
    HealthcareActorRoleCodes.MedicalDoctors,
    HealthcareActorRoleCodes.GeneralistMedicalPractitioner,
    HealthcareActorRoleCodes.SpecialistMedicalPractitioner,
    HealthcareActorRoleCodes.NursingProfessional,
    HealthcareActorRoleCodes.MidwiferyProfessional,
    HealthcareActorRoleCodes.Paramedic,
    HealthcareActorRoleCodes.MedicalSecretary,
  ]),
  [DataspaceSectors.HealthResearch]: Object.freeze([
    HealthcareActorRoleCodes.Controller,
    HealthcareActorRoleCodes.MedicalDoctors,
    HealthcareActorRoleCodes.GeneralistMedicalPractitioner,
    HealthcareActorRoleCodes.SpecialistMedicalPractitioner,
    HealthcareActorRoleCodes.MedicalSecretary,
  ]),
  [DataspaceSectors.HealthTech]: Object.freeze([HealthcareActorRoleCodes.Controller]),
  [DataspaceSectors.HealthInsurance]: Object.freeze([HealthcareActorRoleCodes.Controller]),
  [DataspaceSectors.AnimalCare]: Object.freeze([
    HealthcareActorRoleCodes.Controller,
    HealthcareActorRoleCodes.Veterinarian,
    HealthcareActorRoleCodes.VeterinaryTechnicianOrAssistant,
  ]),
  [DataspaceSectors.AnimalResearch]: Object.freeze([
    HealthcareActorRoleCodes.Controller,
    HealthcareActorRoleCodes.Veterinarian,
    HealthcareActorRoleCodes.VeterinaryTechnicianOrAssistant,
  ]),
  [DataspaceSectors.AnimalInsurance]: Object.freeze([HealthcareActorRoleCodes.Controller]),
  [DataspaceSectors.AnimalTech]: Object.freeze([HealthcareActorRoleCodes.Controller]),
  [DataspaceSectors.OneHealthResearch]: Object.freeze([
    HealthcareActorRoleCodes.Controller,
    HealthcareActorRoleCodes.MedicalDoctors,
    HealthcareActorRoleCodes.GeneralistMedicalPractitioner,
    HealthcareActorRoleCodes.SpecialistMedicalPractitioner,
    HealthcareActorRoleCodes.Veterinarian,
    HealthcareActorRoleCodes.VeterinaryTechnicianOrAssistant,
    HealthcareActorRoleCodes.MedicalSecretary,
  ]),
  [DataspaceSectors.OneHealthTech]: Object.freeze([HealthcareActorRoleCodes.Controller]),
} as const);

export const HealthcareProfessionalRolesBySector = Object.freeze({
  [DataspaceSectors.HealthCare]: pickRoleCatalogByCodes(
    HealthcareProfessionalAndControllerRoles,
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.HealthCare],
  ),
  [DataspaceSectors.HealthResearch]: pickRoleCatalogByCodes(
    HealthcareProfessionalAndControllerRoles,
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.HealthResearch],
  ),
  [DataspaceSectors.HealthTech]: pickRoleCatalogByCodes(
    HealthcareProfessionalAndControllerRoles,
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.HealthTech],
  ),
  [DataspaceSectors.HealthInsurance]: pickRoleCatalogByCodes(
    HealthcareProfessionalAndControllerRoles,
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.HealthInsurance],
  ),
  [DataspaceSectors.AnimalCare]: pickRoleCatalogByCodes(
    HealthcareProfessionalAndControllerRoles,
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.AnimalCare],
  ),
  [DataspaceSectors.AnimalResearch]: pickRoleCatalogByCodes(
    HealthcareProfessionalAndControllerRoles,
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.AnimalResearch],
  ),
  [DataspaceSectors.AnimalInsurance]: pickRoleCatalogByCodes(
    HealthcareProfessionalAndControllerRoles,
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.AnimalInsurance],
  ),
  [DataspaceSectors.AnimalTech]: pickRoleCatalogByCodes(
    HealthcareProfessionalAndControllerRoles,
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.AnimalTech],
  ),
  [DataspaceSectors.OneHealthResearch]: pickRoleCatalogByCodes(
    HealthcareProfessionalAndControllerRoles,
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.OneHealthResearch],
  ),
  [DataspaceSectors.OneHealthTech]: pickRoleCatalogByCodes(
    HealthcareProfessionalAndControllerRoles,
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.OneHealthTech],
  ),
} as const);

export const HealthcareProfessionalRolesBySectorAndClaim = Object.freeze(
  Object.fromEntries(
    Object.values(DataspaceSectors).map((sector) => [
      sector,
      reindexRoleCatalogByClaim(
        HealthcareProfessionalRolesBySector[sector as DataspaceSector] || {},
      ),
    ]),
  ),
) as Readonly<
  Record<DataspaceSector, Readonly<Record<string, HealthcareActorRoleDescriptor>>>
>;

export const HealthcareRolesBySector = Object.freeze(
  Object.fromEntries(
    Object.values(DataspaceSectors).map((sector) => [
      sector,
      Object.freeze({
        [HealthcareRoleFamilies.ProfessionalOccupationIsco08]:
          HealthcareProfessionalRolesBySector[sector as DataspaceSector] || {},
        [HealthcareRoleFamilies.PersonalRelationshipHl7]:
          HealthcareRolesByFamily[HealthcareRoleFamilies.PersonalRelationshipHl7],
        [HealthcareRoleFamilies.LegalRepresentativeHl7]:
          HealthcareRolesByFamily[HealthcareRoleFamilies.LegalRepresentativeHl7],
      }),
    ]),
  ),
) as Readonly<
  Record<
    DataspaceSector,
    Readonly<Record<HealthcareRoleFamily, Readonly<Record<string, HealthcareActorRoleDescriptor>>>>
  >
>;

export function getHealthcareRolesByFamily(
  family: HealthcareRoleFamily,
): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
  return HealthcareRolesByFamily[family];
}

export function getHealthcareRoleByClaim(claim: string): HealthcareActorRoleDescriptor | undefined {
  return HealthcareAllRolesByClaim[String(claim || '').trim()];
}

export function getHealthcareProfessionalRolesBySector(
  sector: DataspaceSector,
): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
  return HealthcareProfessionalRolesBySector[sector] || {};
}

export function getHealthcareProfessionalRolesBySectorAndClaim(
  sector: DataspaceSector,
): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
  return HealthcareProfessionalRolesBySectorAndClaim[sector] || {};
}

export function getHealthcareRolesBySector(
  sector: DataspaceSector,
  family: HealthcareRoleFamily,
): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
  return HealthcareRolesBySector[sector]?.[family] || {};
}

export const HealthcareConsentActions = Object.freeze({
  PatientSummaryDocument: HealthcareBasicSections.PatientSummaryDocument.attributeValue,
  AllergiesAndIntolerances: HealthcareBasicSections.AllergiesAndIntolerances.attributeValue,
  HistoryOfMedicationUse: HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
  ProblemList: HealthcareBasicSections.ProblemList.attributeValue,
  Results: HealthcareBasicSections.Results.attributeValue,
  Procedures: HealthcareBasicSections.Procedures.attributeValue,
  Immunizations: HealthcareBasicSections.Immunizations.attributeValue,
} as const);
