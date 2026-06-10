import { describe, expect, it } from '@jest/globals';

import { ClaimsOrganizationSchemaorg, ClaimsPersonSchemaorg } from '../src/constants/schemaorg';
import {
  EXAMPLE_KYC_CONTROLLER_DISPLAY_NAME,
  EXAMPLE_KYC_CONTROLLER_BIRTHDATE,
  EXAMPLE_KYC_CONTROLLER_CITY,
  EXAMPLE_KYC_CONTROLLER_COUNTRY,
  EXAMPLE_KYC_CONTROLLER_CREATED_AT,
  EXAMPLE_KYC_CONTROLLER_FAMILY_NAME,
  EXAMPLE_KYC_CONTROLLER_GENDER_FEMALE,
  EXAMPLE_KYC_CONTROLLER_GENDER_IDENTITY_MAN,
  EXAMPLE_KYC_CONTROLLER_GENDER_IDENTITY_WOMAN,
  EXAMPLE_KYC_CONTROLLER_GENDER_MALE,
  EXAMPLE_KYC_CONTROLLER_GIVEN_NAME,
  EXAMPLE_KYC_CONTROLLER_IDENTIFIER,
  EXAMPLE_KYC_CONTROLLER_LANGUAGE,
  EXAMPLE_KYC_CONTROLLER_POSTAL_CODE,
  EXAMPLE_KYC_CONTROLLER_STREET_ADDRESS,
  EXAMPLE_KYC_CONTROLLER_TELEPHONE,
  EXAMPLE_KYC_CONTROLLER_UPDATED_AT,
  EXAMPLE_KYC_CONTROLLER_USER_UUID,
  EXAMPLE_KYC_CONTROLLER_UUID,
  EXAMPLE_KYC_CONTROLLER_VERIFIED_AT,
  EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
  EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR,
  EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
} from '../src/examples/shared';

import {
  KYC_GENDER_INPUT_FEMALE,
  KYC_GENDER_INPUT_MUJER,
  KYC_GENDER_INPUT_MALE,
  KYC_GENDER_INPUT_COMPACT_FEMALE,
  KYC_GENDER_INPUT_COMPACT_MALE,
} from '../src/constants/kyc-gender';

import {
  IndividualOrganizationKycPayload,
  IndividualOrganizationKycProfile,
} from '../src/models/individual-onboarding';
import {
  buildClaimsFromIndividualOrganizationKyc,
  normalizeKycGender,
} from '../src/utils/individual-organization-kyc';

const EXAMPLE_KYC_PROFILE: IndividualOrganizationKycProfile = Object.freeze({
  uuid: EXAMPLE_KYC_CONTROLLER_UUID,
  user_uuid: EXAMPLE_KYC_CONTROLLER_USER_UUID,
  first_name: EXAMPLE_KYC_CONTROLLER_GIVEN_NAME,
  last_name: EXAMPLE_KYC_CONTROLLER_FAMILY_NAME,
  nationality: null,
  country: EXAMPLE_KYC_CONTROLLER_COUNTRY,
  ip_country: null,
  city: EXAMPLE_KYC_CONTROLLER_CITY,
  address: EXAMPLE_KYC_CONTROLLER_STREET_ADDRESS,
  id_number: EXAMPLE_KYC_CONTROLLER_IDENTIFIER,
  postal_code: EXAMPLE_KYC_CONTROLLER_POSTAL_CODE,
  phone_number: EXAMPLE_KYC_CONTROLLER_TELEPHONE,
  birthdate: EXAMPLE_KYC_CONTROLLER_BIRTHDATE,
  kyc_verified_at: EXAMPLE_KYC_CONTROLLER_VERIFIED_AT,
  gender: EXAMPLE_KYC_CONTROLLER_GENDER_MALE,
  language: EXAMPLE_KYC_CONTROLLER_LANGUAGE,
  created_at: EXAMPLE_KYC_CONTROLLER_CREATED_AT,
  updated_at: EXAMPLE_KYC_CONTROLLER_UPDATED_AT,
  primary_wallet_address: null,
  primary_wallet: null,
} as const);

const EXAMPLE_KYC_PAYLOAD: IndividualOrganizationKycPayload = Object.freeze({
  profile: EXAMPLE_KYC_PROFILE,
  individualAlternateName: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
  individualBirthDate: EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR,
  controllerEmail: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
} as const);

describe('individual organization KYC mapper', () => {
  /**
   * The mapper must turn the provider-specific KYC payload into the canonical
   * `org.schema.Organization` + `org.schema.Person` claim set consumed by the
   * current individual onboarding contract.
   */
  it('maps KYC controller data plus Doraemon seed fields into canonical org.schema claims', () => {
    const result = buildClaimsFromIndividualOrganizationKyc({
      profile: EXAMPLE_KYC_PAYLOAD.profile,
      individualAlternateName: EXAMPLE_KYC_PAYLOAD.individualAlternateName || '',
      individualBirthDate: EXAMPLE_KYC_PAYLOAD.individualBirthDate,
      controllerEmail: EXAMPLE_KYC_PAYLOAD.controllerEmail,
    });

    expect(result.claims).toEqual({
      '@context': 'org.schema',
      [ClaimsOrganizationSchemaorg.alternateName]: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
      [ClaimsOrganizationSchemaorg.ownerAlternateName]: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
      [ClaimsOrganizationSchemaorg.ownerIdentifierValue]: EXAMPLE_KYC_PROFILE.id_number,
      [ClaimsOrganizationSchemaorg.ownerEmail]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
      [ClaimsOrganizationSchemaorg.ownerTelephone]: EXAMPLE_KYC_PROFILE.phone_number,
      [ClaimsOrganizationSchemaorg.memberBirthDate]: EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR,
      [ClaimsOrganizationSchemaorg.memberRole]: 'ONESELF',
      [ClaimsOrganizationSchemaorg.addressCountry]: EXAMPLE_KYC_PROFILE.country,
      [ClaimsOrganizationSchemaorg.addressLocality]: EXAMPLE_KYC_PROFILE.city,
      [ClaimsOrganizationSchemaorg.streetAddress]: EXAMPLE_KYC_PROFILE.address,
      [ClaimsOrganizationSchemaorg.postalCode]: EXAMPLE_KYC_PROFILE.postal_code,
      [ClaimsPersonSchemaorg.identifierValue]: EXAMPLE_KYC_PROFILE.id_number,
      [ClaimsPersonSchemaorg.identifier]: `urn:person:identifier:${EXAMPLE_KYC_PROFILE.id_number}`,
      [ClaimsPersonSchemaorg.givenName]: EXAMPLE_KYC_CONTROLLER_GIVEN_NAME.toUpperCase(),
      [ClaimsPersonSchemaorg.familyName]: EXAMPLE_KYC_CONTROLLER_FAMILY_NAME.toUpperCase(),
      [ClaimsPersonSchemaorg.name]: EXAMPLE_KYC_CONTROLLER_DISPLAY_NAME,
      [ClaimsPersonSchemaorg.gender]: EXAMPLE_KYC_CONTROLLER_GENDER_MALE,
      [ClaimsPersonSchemaorg.birthDate]: EXAMPLE_KYC_CONTROLLER_BIRTHDATE.slice(0, 4),
    });
  });

  /**
   * Gender normalization should accept the current compact values used in old
   * tests and also the more descriptive KYC variants.
  */
  it('normalizes KYC gender values to the compact current contract values', () => {
    expect(normalizeKycGender(KYC_GENDER_INPUT_FEMALE)).toBe(EXAMPLE_KYC_CONTROLLER_GENDER_FEMALE);
    expect(normalizeKycGender(KYC_GENDER_INPUT_MUJER)).toBe(EXAMPLE_KYC_CONTROLLER_GENDER_FEMALE);
    expect(normalizeKycGender(EXAMPLE_KYC_CONTROLLER_GENDER_IDENTITY_WOMAN)).toBe(EXAMPLE_KYC_CONTROLLER_GENDER_FEMALE);
    expect(normalizeKycGender(KYC_GENDER_INPUT_COMPACT_FEMALE)).toBe(EXAMPLE_KYC_CONTROLLER_GENDER_FEMALE);

    expect(normalizeKycGender(KYC_GENDER_INPUT_MALE)).toBe(EXAMPLE_KYC_CONTROLLER_GENDER_MALE);
    expect(normalizeKycGender(EXAMPLE_KYC_CONTROLLER_GENDER_IDENTITY_MAN)).toBe(EXAMPLE_KYC_CONTROLLER_GENDER_MALE);
    expect(normalizeKycGender(KYC_GENDER_INPUT_COMPACT_MALE)).toBe(EXAMPLE_KYC_CONTROLLER_GENDER_MALE);
  });


  /**
   * The controller email is optional because the current KYC payload does not
   * expose it. When missing, telephone remains as the owner contact channel.
   */
  it('keeps telephone as owner contact when the KYC source does not provide an email', () => {
    const result = buildClaimsFromIndividualOrganizationKyc({
      profile: EXAMPLE_KYC_PAYLOAD.profile,
      individualAlternateName: EXAMPLE_KYC_PAYLOAD.individualAlternateName || '',
    });

    expect(result.claims[ClaimsOrganizationSchemaorg.ownerEmail]).toBeUndefined();
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerTelephone]).toBe(EXAMPLE_KYC_PROFILE.phone_number);
    expect(result.claims[ClaimsPersonSchemaorg.birthDate]).toBe('1990');
  });

  it('exports the full KYC payload type used by onboarding flows', () => {
    expect(EXAMPLE_KYC_PAYLOAD.profile).toBe(EXAMPLE_KYC_PROFILE);
    expect(EXAMPLE_KYC_PAYLOAD.individualAlternateName).toBe(EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME);
    expect(EXAMPLE_KYC_PAYLOAD.individualBirthDate).toBe(EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR);
    expect(EXAMPLE_KYC_PAYLOAD.controllerEmail).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED);
  });
});
