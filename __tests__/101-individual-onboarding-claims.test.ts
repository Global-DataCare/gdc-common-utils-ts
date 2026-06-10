import { describe, expect, it } from '@jest/globals';

import {
  EXAMPLE_FORM_CONTROLLER_PHONE,
  EXAMPLE_FORM_SUBJECT_IDENTIFIER_VALUE,
  EXAMPLE_FORM_SUBJECT_PHONE,
  EXAMPLE_KYC_CONTROLLER_BIRTHDATE,
  EXAMPLE_KYC_CONTROLLER_CITY,
  EXAMPLE_KYC_CONTROLLER_COUNTRY,
  EXAMPLE_KYC_CONTROLLER_CREATED_AT,
  EXAMPLE_KYC_CONTROLLER_FAMILY_NAME,
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
  EXAMPLE_PDF_CONSENT_DATE,
  EXAMPLE_SERVICE_PROVIDER_DOMAIN,
  EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
  EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR,
  EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
} from '../src/examples/shared';
import {
  ClaimsOrganizationSchemaorg,
  ClaimsOrderSchemaorg,
  ClaimsPersonSchemaorg,
  ClaimsServiceSchemaorg,
} from '../src/constants/schemaorg';
import type {
  IndividualIndexServiceFormFields,
  IndividualOrganizationKycPayload,
  IndividualOrganizationKycProfile,
} from '../src/models/individual-onboarding';
import { createIndividualOnboardingEditor } from '../src/utils/individual-onboarding-editor';
import { mergeIndividualOrganizationClaims } from '../src/utils/individual-organization-claims';

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

describe('101: individual onboarding claims', () => {
  it('builds the final resource.meta.claims step by step after KYC as a controller assistant would do', () => {
    // Step 1.
    // After KYC, the assistant already knows the legal representative identity
    // plus the indexed individual nickname/basic seed values.
    const afterKyc = mergeIndividualOrganizationClaims({
      kyc: EXAMPLE_KYC_PAYLOAD,
    }).claims;

    expect(afterKyc).toEqual(expect.objectContaining({
      '@context': 'org.schema',
      [ClaimsOrganizationSchemaorg.alternateName]: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
      [ClaimsOrganizationSchemaorg.ownerAlternateName]: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
      [ClaimsOrganizationSchemaorg.ownerEmail]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
      [ClaimsOrganizationSchemaorg.ownerTelephone]: EXAMPLE_KYC_CONTROLLER_TELEPHONE,
      [ClaimsOrganizationSchemaorg.ownerIdentifierValue]: EXAMPLE_KYC_CONTROLLER_IDENTIFIER,
      [ClaimsPersonSchemaorg.identifierValue]: EXAMPLE_KYC_CONTROLLER_IDENTIFIER,
      [ClaimsPersonSchemaorg.givenName]: EXAMPLE_KYC_CONTROLLER_GIVEN_NAME.toUpperCase(),
      [ClaimsPersonSchemaorg.familyName]: EXAMPLE_KYC_CONTROLLER_FAMILY_NAME.toUpperCase(),
      [ClaimsOrganizationSchemaorg.memberBirthDate]: EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR,
      [ClaimsOrganizationSchemaorg.memberRole]: 'ONESELF',
    }));

    // Step 2.
    // The controller then fills the fields that KYC does not provide for the
    // indexed subject, as if moving through a wizard.
    const missingAfterKyc: IndividualIndexServiceFormFields = {
      controllerIsSubject: false,
      controllerPhone: EXAMPLE_FORM_CONTROLLER_PHONE,
      subjectAlternateName: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
      subjectPhone: EXAMPLE_FORM_SUBJECT_PHONE,
      subjectIdValue: EXAMPLE_FORM_SUBJECT_IDENTIFIER_VALUE,
      subjectDateOfBirth: EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR,
      docDate: EXAMPLE_PDF_CONSENT_DATE,
      serviceProviderDomain: EXAMPLE_SERVICE_PROVIDER_DOMAIN,
    };

    const editorClaims = createIndividualOnboardingEditor()
      .setSelf(false)
      .setControllerPhone(EXAMPLE_FORM_CONTROLLER_PHONE)
      .setSubjectAlternateName(EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME)
      .setSubjectPhone(EXAMPLE_FORM_SUBJECT_PHONE)
      .setSubjectIdentifier({ value: EXAMPLE_FORM_SUBJECT_IDENTIFIER_VALUE })
      .setSubjectBirthDate(EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR)
      .setConsentDate(EXAMPLE_PDF_CONSENT_DATE)
      .setServiceProviderDomain(EXAMPLE_SERVICE_PROVIDER_DOMAIN)
      .setBaseClaims(afterKyc)
      .buildClaims();

    const finalClaims = mergeIndividualOrganizationClaims({
      claims: afterKyc,
      formFields: missingAfterKyc,
    }).claims;

    // Step 3.
    // Final didactic proof:
    // - controller identity stays in Person.*
    // - controller contact stays in Organization.owner.*
    // - indexed subject identity stays in Organization.member.*
    // - service/order information stays outside Person/member identity.
    expect(finalClaims).toEqual(expect.objectContaining({
      [ClaimsOrganizationSchemaorg.alternateName]: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
      [ClaimsOrganizationSchemaorg.ownerEmail]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
      [ClaimsOrganizationSchemaorg.ownerTelephone]: EXAMPLE_FORM_CONTROLLER_PHONE,
      [ClaimsPersonSchemaorg.identifierValue]: EXAMPLE_KYC_CONTROLLER_IDENTIFIER,
      [ClaimsOrganizationSchemaorg.memberIdentifierValue]: EXAMPLE_FORM_SUBJECT_IDENTIFIER_VALUE,
      [ClaimsOrganizationSchemaorg.memberBirthDate]: EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR,
      [ClaimsOrganizationSchemaorg.memberRole]: 'ONESELF',
      [ClaimsServiceSchemaorg.serviceType]: EXAMPLE_SERVICE_PROVIDER_DOMAIN,
      [ClaimsOrderSchemaorg.orderedItemServiceType]: EXAMPLE_SERVICE_PROVIDER_DOMAIN,
    }));
    expect(editorClaims).toEqual(expect.objectContaining(finalClaims));
  });
});
