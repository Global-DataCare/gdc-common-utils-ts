/**
 * Canonical identifier kinds reused by onboarding forms, KYC mappers, and
 * frontend/backend tests.
 *
 * Source semantics:
 * - ISO identifiers keep their reverse-DNS namespace
 * - HL7 v2-0203 identifier types are normalized to reverse-DNS strings
 *
 * Design rule:
 * - tests must import these values instead of hardcoding identifier type
 *   strings inline
 * - onboarding form fields may still accept legacy provider strings, but new
 *   code should author `IdKind` values
 *
 * Reference:
 * http://terminology.hl7.org/CodeSystem/v2-0203
 */
export const HL7_V2_0203_IDENTIFIER_SYSTEM = 'http://terminology.hl7.org/CodeSystem/v2-0203' as const;
export const HL7_V2_0203_REVERSE_DNS_PREFIX = 'org.hl7.terminology.CodeSystem.v2-0203' as const;

export const HL7_V2_0203_IDENTIFIER_CODES = Object.freeze({
  DriverLicense: 'DL',
  CitizenshipCard: 'CZ',
  NationalNumber: 'NN',
  PassportNumber: 'PPN',
  JurisdictionalHealthNumber: 'JHN',
  WorkPermit: 'WP',
  StudyPermit: 'SP',
  HealthCard: 'HC',
  MemberNumber: 'MB',
  SubscriberNumber: 'SN',
  DonorRecord: 'DR',
  PatientIdentifier: 'PI',
} as const);

export type Hl7V20203IdentifierCode =
  typeof HL7_V2_0203_IDENTIFIER_CODES[keyof typeof HL7_V2_0203_IDENTIFIER_CODES];

/**
 * Identifier type tokens accepted by the hosted individual DID builders.
 *
 * `DL`, `PPN`, `NN`, and the other clinical identifier codes retain their
 * HL7 v2-0203 meaning. `UUID`, `EMAIL`, and `PHONE` are GDC index identifier
 * types and must not be described as HL7 codes.
 */
export const SecureIdTypesIndividual = Object.freeze({
  Uuid: 'UUID',
  Email: 'EMAIL',
  Phone: 'PHONE',
  ...HL7_V2_0203_IDENTIFIER_CODES,
} as const);

export type SecureIdTypeIndividual =
  typeof SecureIdTypesIndividual[keyof typeof SecureIdTypesIndividual];

/** Product-neutral document kinds used by subject identifier forms. */
export const INDIVIDUAL_IDENTIFIER_KINDS = Object.freeze({
  NationalPerson: 'national-person',
  Passport: 'passport',
  HealthNumber: 'health-number',
  HealthCard: 'health-card',
  InsuranceMember: 'insurance-member',
  InsuranceSubscriber: 'insurance-subscriber',
  DriverLicense: 'driver-license',
  WorkPermit: 'work-permit',
  StudyPermit: 'study-permit',
} as const);

export type IndividualIdentifierKind =
  typeof INDIVIDUAL_IDENTIFIER_KINDS[keyof typeof INDIVIDUAL_IDENTIFIER_KINDS];

export const INDIVIDUAL_IDENTIFIER_KIND_CODES = Object.freeze({
  [INDIVIDUAL_IDENTIFIER_KINDS.NationalPerson]: HL7_V2_0203_IDENTIFIER_CODES.NationalNumber,
  [INDIVIDUAL_IDENTIFIER_KINDS.Passport]: HL7_V2_0203_IDENTIFIER_CODES.PassportNumber,
  [INDIVIDUAL_IDENTIFIER_KINDS.HealthNumber]: HL7_V2_0203_IDENTIFIER_CODES.JurisdictionalHealthNumber,
  [INDIVIDUAL_IDENTIFIER_KINDS.HealthCard]: HL7_V2_0203_IDENTIFIER_CODES.HealthCard,
  [INDIVIDUAL_IDENTIFIER_KINDS.InsuranceMember]: HL7_V2_0203_IDENTIFIER_CODES.MemberNumber,
  [INDIVIDUAL_IDENTIFIER_KINDS.InsuranceSubscriber]: HL7_V2_0203_IDENTIFIER_CODES.SubscriberNumber,
  [INDIVIDUAL_IDENTIFIER_KINDS.DriverLicense]: HL7_V2_0203_IDENTIFIER_CODES.DriverLicense,
  [INDIVIDUAL_IDENTIFIER_KINDS.WorkPermit]: HL7_V2_0203_IDENTIFIER_CODES.WorkPermit,
  [INDIVIDUAL_IDENTIFIER_KINDS.StudyPermit]: HL7_V2_0203_IDENTIFIER_CODES.StudyPermit,
} as const satisfies Record<IndividualIdentifierKind, Hl7V20203IdentifierCode>);

export enum IdKind {
  /** ISO 18013-5 mobile driving licence credential. */
  MobileDriverLicense = 'org.iso.18013.5.1.mDL',

  /** HL7 driver license identifier. */
  PersonalDriverLicense = 'org.hl7.terminology.CodeSystem.v2-0203.DL',
  /** HL7 citizenship card identifier. */
  PersonalCitizenshipCard = 'org.hl7.terminology.CodeSystem.v2-0203.CZ',
  /** HL7 national identity number. */
  PersonalNationalNumber = 'org.hl7.terminology.CodeSystem.v2-0203.NN',
  /** HL7 passport number. */
  PersonalPassportNumber = 'org.hl7.terminology.CodeSystem.v2-0203.PPN',
  /** HL7 jurisdictional health number. */
  RegionalHealthCardNumber = 'org.hl7.terminology.CodeSystem.v2-0203.JHN',
  /** @deprecated Use `RegionalHealthCardNumber`. */
  RegionalHeathCardNumber = 'org.hl7.terminology.CodeSystem.v2-0203.JHN',
  /** HL7 work permit. */
  PersonalWorkPermit = 'org.hl7.terminology.CodeSystem.v2-0203.WP',
  /** HL7 study permit. */
  PersonalStudyPermit = 'org.hl7.terminology.CodeSystem.v2-0203.SP',
  /** HL7 local/private health card identifier. */
  LocalHealthCard = 'org.hl7.terminology.CodeSystem.v2-0203.HC',
  /** HL7 insured/member number, including private and travel health insurance. */
  InsuranceMemberNumber = 'org.hl7.terminology.CodeSystem.v2-0203.MB',
  /** HL7 policy subscriber number when it differs from the beneficiary/member. */
  InsuranceSubscriberNumber = 'org.hl7.terminology.CodeSystem.v2-0203.SN',
  /** HL7 donor record identifier. */
  LocalDonorRecord = 'org.hl7.terminology.CodeSystem.v2-0203.DR',
  /** HL7 local patient identifier. */
  LocalPatientIdentifier = 'org.hl7.terminology.CodeSystem.v2-0203.PI',
}

export const HL7_V2_0203_REVERSE_DNS_TYPES = Object.freeze({
  [HL7_V2_0203_IDENTIFIER_CODES.DriverLicense]: IdKind.PersonalDriverLicense,
  [HL7_V2_0203_IDENTIFIER_CODES.CitizenshipCard]: IdKind.PersonalCitizenshipCard,
  [HL7_V2_0203_IDENTIFIER_CODES.NationalNumber]: IdKind.PersonalNationalNumber,
  [HL7_V2_0203_IDENTIFIER_CODES.PassportNumber]: IdKind.PersonalPassportNumber,
  [HL7_V2_0203_IDENTIFIER_CODES.JurisdictionalHealthNumber]: IdKind.RegionalHealthCardNumber,
  [HL7_V2_0203_IDENTIFIER_CODES.WorkPermit]: IdKind.PersonalWorkPermit,
  [HL7_V2_0203_IDENTIFIER_CODES.StudyPermit]: IdKind.PersonalStudyPermit,
  [HL7_V2_0203_IDENTIFIER_CODES.HealthCard]: IdKind.LocalHealthCard,
  [HL7_V2_0203_IDENTIFIER_CODES.MemberNumber]: IdKind.InsuranceMemberNumber,
  [HL7_V2_0203_IDENTIFIER_CODES.SubscriberNumber]: IdKind.InsuranceSubscriberNumber,
  [HL7_V2_0203_IDENTIFIER_CODES.DonorRecord]: IdKind.LocalDonorRecord,
  [HL7_V2_0203_IDENTIFIER_CODES.PatientIdentifier]: IdKind.LocalPatientIdentifier,
} as const satisfies Record<Hl7V20203IdentifierCode, IdKind>);

/** Union helper for code that wants typed values without depending on the enum object. */
export type IdKindValue = typeof IdKind[keyof typeof IdKind];
