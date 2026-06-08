/**
 * Common gender/sex identity enumerations shared by tests and mappers.
 *
 * This module is designed to remove string literals from tests and to
 * unify the semantics between different layers:
 * - BirthSex (F/M)
 * - AdministrativeSex (F/M/O; Other unified as O)
 * - GenderIdentity (FHIR PCORNet-style codes, with Other handled as OT)
 */

/** BirthSex can only be "F", "M" or "U". */
export enum BirthSex {
  /** Female */
  Female = 'F',
  /** Male */
  Male = 'M',
  /** Unknown / not available in source data. */
  Unknown = 'U',
}

/**
 * PCORNet Gender Identity terminology.
 * https://hl7.org/fhir/us/cdmh/ValueSet-pcornet-gender-identity.html
 */
export enum GenderIdentity {
  /** Gender identity is a Man. */
  Man = 'M',
  /** Gender identity is a Woman. */
  Woman = 'F',

  /** Transgender male or Transman or Female-to-Male. */
  TransgenderMale = 'TM',
  /** Transgender female or Transwoman or Male-to-female. */
  TransgenderFemale = 'TF',

  /** Gender identity is Genderqueer/Non-binary. */
  GenderqueerNonBinary = 'GQ',

  /** Gender identity is Something else. */
  SomethingElse = 'SE',

  /** Gender identity is Multiple gender categories. */
  MultipleGenderCategories = 'MU',

  /** Person has declined to answer about their gender identity. */
  DeclineToAnswer = 'DC',

  /** There is no information about the Person's gender identity. */
  NoInformation = 'NI',

  /** Person's gender identity is unknown. */
  Unknown = 'UN',

  /** Gender identity is Other. */
  Other = 'OT',
}
