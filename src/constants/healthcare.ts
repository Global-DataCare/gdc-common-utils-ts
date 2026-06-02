import { LOINC_SYSTEM_URL, loincI18nKey } from '../models/clinical-sections';
import {
  clinicalDocTypes,
  clinicalSectionAdditional,
  clinicalSectionsBase,
} from '../models/clinical-sections.en';
import {
  HL7_CODING_SYSTEM_PERSONAL_RELATIONSHIP,
  HL7_CODING_SYSTEM_V3_ROLE_CODE,
  HL7_PERSONAL_RELATIONSHIP_ROLES,
  HL7_V3_ROLE_CODE_LEGAL_REPRESENTATIVE,
} from './hl7-roles';
import { DataspaceSectors, type DataspaceSector } from './sectors';

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

export const ISCO08_CODING_SYSTEM = 'org.ilo.isco' as const;
export const ISCO08_I18N_NAMESPACE = 'org.ilo.isco-08' as const;

export const HealthcareRoleFamilies = Object.freeze({
  ProfessionalOccupationIsco08: 'professionalOccupationIsco08',
  PersonalRelationshipHl7: 'personalRelationshipHl7',
  LegalRepresentativeHl7: 'legalRepresentativeHl7',
} as const);

export type HealthcareRoleFamily =
  typeof HealthcareRoleFamilies[keyof typeof HealthcareRoleFamilies];

export type HealthcareActorRoleDescriptor = Readonly<{
  family: HealthcareRoleFamily;
  codingSystem: string;
  code: string;
  claim: string;
  i18nKey: `org.ilo.isco-08.${string}` | `org.hl7.v3.personalRelationship.${string}` | `org.hl7.v3.roleCode.${string}`;
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

export const HealthcareSectionFamilies = Object.freeze({
  Summary: 'summary',
  Management: 'management',
  SubjectMatterDomain: 'subjectMatterDomain',
} as const);

export type HealthcareSectionFamily =
  typeof HealthcareSectionFamilies[keyof typeof HealthcareSectionFamilies];

function buildSectionCatalogByCode(
  source: Record<string, string>,
): Readonly<Record<string, HealthcareSectionDescriptor>> {
  return Object.freeze(
    Object.fromEntries(
      Object.entries(source).map(([code, titleEn]) => [code, defineSection(code, titleEn)]),
    ),
  );
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

/**
 * Full section families sourced from the existing section catalogs in
 * `models/clinical-sections.en.ts`.
 *
 * Family mapping used by SDK/business layers:
 * - `summary`: IPS/base summary sections.
 * - `management`: kind-of-document and type-of-service oriented sections.
 * - `subjectMatterDomain`: additional service-domain sections.
 */
export const HealthcareSectionsByFamily = Object.freeze({
  [HealthcareSectionFamilies.Summary]: buildSectionCatalogByCode(clinicalSectionsBase),
  [HealthcareSectionFamilies.Management]: buildSectionCatalogByCode(clinicalDocTypes),
  [HealthcareSectionFamilies.SubjectMatterDomain]: buildSectionCatalogByCode(clinicalSectionAdditional),
} as const);

export const HealthcareAllSectionsByCode: Readonly<Record<string, HealthcareSectionDescriptor>> = Object.freeze({
  ...HealthcareSectionsByFamily[HealthcareSectionFamilies.Summary],
  ...HealthcareSectionsByFamily[HealthcareSectionFamilies.Management],
  ...HealthcareSectionsByFamily[HealthcareSectionFamilies.SubjectMatterDomain],
});

export function getHealthcareSectionByCode(code: string): HealthcareSectionDescriptor | undefined {
  return HealthcareAllSectionsByCode[String(code || '').trim()];
}

export function getHealthcareSectionsByFamily(
  family: HealthcareSectionFamily,
): Readonly<Record<string, HealthcareSectionDescriptor>> {
  return HealthcareSectionsByFamily[family];
}

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
  Veterinarian: 'ISCO-08|2250',
} as const);

export const HealthcareActorRoleCodes = Object.freeze({
  Controller: '1120',
  Physician: '2211',
  PhysicianBroad: '221',
  NursingProfessional: '2221',
  Paramedic: '2240',
  Veterinarian: '2250',
} as const);

function buildProfessionalIscoRoles(): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
  const entries: Array<[string, HealthcareActorRoleDescriptor]> = [
    [
      HealthcareActorRoleCodes.Controller,
      Object.freeze({
        family: HealthcareRoleFamilies.ProfessionalOccupationIsco08,
        codingSystem: ISCO08_CODING_SYSTEM,
        code: HealthcareActorRoleCodes.Controller,
        claim: HealthcareActorRoles.Controller,
        i18nKey: `${ISCO08_I18N_NAMESPACE}.${HealthcareActorRoleCodes.Controller}`,
        titleEn: 'Controller',
      }),
    ],
    [
      HealthcareActorRoleCodes.Physician,
      Object.freeze({
        family: HealthcareRoleFamilies.ProfessionalOccupationIsco08,
        codingSystem: ISCO08_CODING_SYSTEM,
        code: HealthcareActorRoleCodes.Physician,
        claim: HealthcareActorRoles.Physician,
        i18nKey: `${ISCO08_I18N_NAMESPACE}.${HealthcareActorRoleCodes.Physician}`,
        titleEn: 'Physician',
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
          codingSystem: HL7_CODING_SYSTEM_PERSONAL_RELATIONSHIP,
          code: item.code,
          claim: `v3-PersonalRelationshipRoleType|${item.code}`,
          i18nKey: `org.hl7.v3.personalRelationship.${item.code}`,
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
          i18nKey: `org.hl7.v3.roleCode.${item.code}`,
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
      .map((descriptor) => [descriptor.claim, descriptor]),
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

export const HealthcareProfessionalRoleCodesBySector = Object.freeze({
  [DataspaceSectors.HealthCare]: Object.freeze([
    HealthcareActorRoleCodes.Controller,
    HealthcareActorRoleCodes.Physician,
    HealthcareActorRoleCodes.NursingProfessional,
    HealthcareActorRoleCodes.Paramedic,
  ]),
  [DataspaceSectors.HealthResearch]: Object.freeze([
    HealthcareActorRoleCodes.Controller,
    HealthcareActorRoleCodes.Physician,
  ]),
  [DataspaceSectors.HealthTech]: Object.freeze([HealthcareActorRoleCodes.Controller]),
  [DataspaceSectors.HealthInsurance]: Object.freeze([HealthcareActorRoleCodes.Controller]),
  [DataspaceSectors.AnimalCare]: Object.freeze([
    HealthcareActorRoleCodes.Controller,
    HealthcareActorRoleCodes.Veterinarian,
  ]),
  [DataspaceSectors.AnimalResearch]: Object.freeze([
    HealthcareActorRoleCodes.Controller,
    HealthcareActorRoleCodes.Veterinarian,
  ]),
  [DataspaceSectors.AnimalInsurance]: Object.freeze([HealthcareActorRoleCodes.Controller]),
  [DataspaceSectors.AnimalTech]: Object.freeze([HealthcareActorRoleCodes.Controller]),
  [DataspaceSectors.OneHealthResearch]: Object.freeze([
    HealthcareActorRoleCodes.Controller,
    HealthcareActorRoleCodes.Physician,
    HealthcareActorRoleCodes.Veterinarian,
  ]),
  [DataspaceSectors.OneHealthTech]: Object.freeze([HealthcareActorRoleCodes.Controller]),
} as const);

export const HealthcareProfessionalRolesBySector = Object.freeze({
  [DataspaceSectors.HealthCare]: pickRoleCatalogByCodes(
    HealthcareRolesByFamily[HealthcareRoleFamilies.ProfessionalOccupationIsco08],
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.HealthCare],
  ),
  [DataspaceSectors.HealthResearch]: pickRoleCatalogByCodes(
    HealthcareRolesByFamily[HealthcareRoleFamilies.ProfessionalOccupationIsco08],
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.HealthResearch],
  ),
  [DataspaceSectors.HealthTech]: pickRoleCatalogByCodes(
    HealthcareRolesByFamily[HealthcareRoleFamilies.ProfessionalOccupationIsco08],
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.HealthTech],
  ),
  [DataspaceSectors.HealthInsurance]: pickRoleCatalogByCodes(
    HealthcareRolesByFamily[HealthcareRoleFamilies.ProfessionalOccupationIsco08],
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.HealthInsurance],
  ),
  [DataspaceSectors.AnimalCare]: pickRoleCatalogByCodes(
    HealthcareRolesByFamily[HealthcareRoleFamilies.ProfessionalOccupationIsco08],
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.AnimalCare],
  ),
  [DataspaceSectors.AnimalResearch]: pickRoleCatalogByCodes(
    HealthcareRolesByFamily[HealthcareRoleFamilies.ProfessionalOccupationIsco08],
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.AnimalResearch],
  ),
  [DataspaceSectors.AnimalInsurance]: pickRoleCatalogByCodes(
    HealthcareRolesByFamily[HealthcareRoleFamilies.ProfessionalOccupationIsco08],
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.AnimalInsurance],
  ),
  [DataspaceSectors.AnimalTech]: pickRoleCatalogByCodes(
    HealthcareRolesByFamily[HealthcareRoleFamilies.ProfessionalOccupationIsco08],
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.AnimalTech],
  ),
  [DataspaceSectors.OneHealthResearch]: pickRoleCatalogByCodes(
    HealthcareRolesByFamily[HealthcareRoleFamilies.ProfessionalOccupationIsco08],
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.OneHealthResearch],
  ),
  [DataspaceSectors.OneHealthTech]: pickRoleCatalogByCodes(
    HealthcareRolesByFamily[HealthcareRoleFamilies.ProfessionalOccupationIsco08],
    HealthcareProfessionalRoleCodesBySector[DataspaceSectors.OneHealthTech],
  ),
} as const);

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
