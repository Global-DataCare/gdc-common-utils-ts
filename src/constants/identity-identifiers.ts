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
export enum IdKind {
  /** ISO 18013-5 mobile driving licence credential. */
  MobileDriverLicense = 'org.iso.18013.5.1.mDL',

  /** HL7 driver license identifier. */
  PersonalDriverLicense = 'org.hl7.terminology.codesystem.v2-0203.DL',
  /** HL7 citizenship card identifier. */
  PersonalCitizenshipCard = 'org.hl7.terminology.codesystem.v2-0203.CZ',
  /** HL7 national identity number. */
  PersonalNationalNumber = 'org.hl7.terminology.codesystem.v2-0203.NN',
  /** HL7 jurisdictional health number. */
  RegionalHeathCardNumber = 'org.hl7.terminology.codesystem.v2-0203.JHN',
  /** HL7 local/private health card identifier. */
  LocalHealthCard = 'org.hl7.terminology.codesystem.v2-0203.HC',
  /** HL7 donor record identifier. */
  LocalDonorRecord = 'org.hl7.terminology.codesystem.v2-0203.DR',
  /** HL7 local patient identifier. */
  LocalPatientIdentifier = 'org.hl7.terminology.codesystem.v2-0203.PI',
}

/** Union helper for code that wants typed values without depending on the enum object. */
export type IdKindValue = typeof IdKind[keyof typeof IdKind];
