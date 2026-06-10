import { describe, expect, it } from '@jest/globals';

import {
  EXAMPLE_CONTROLLER_IDENTIFIER_TYPE,
  EXAMPLE_FORM_CONTROLLER_IDENTIFIER_VALUE,
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
import { ClaimsOrganizationSchemaorg, ClaimsOrderSchemaorg, ClaimsServiceSchemaorg } from '../src/constants/schemaorg';
import type { IndividualIndexServiceFormFields, IndividualOrganizationKycPayload, IndividualOrganizationKycProfile } from '../src/models/individual-onboarding';
import {
  buildClaimsFromIndividualOrganizationForm,
  mergeIndividualOrganizationClaims,
} from '../src/utils/individual-organization-claims';

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

describe('individual organization final claims helpers', () => {
  it('builds canonical onboarding claims from form fields without requiring a signed PDF', () => {
    const formFields: IndividualIndexServiceFormFields = {
      controllerIsSubject: false,
      controllerAlternateName: 'controller-visible-name',
      controllerEmail: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
      controllerPhone: EXAMPLE_FORM_CONTROLLER_PHONE,
      controllerIdType: EXAMPLE_CONTROLLER_IDENTIFIER_TYPE,
      controllerIdValue: EXAMPLE_FORM_CONTROLLER_IDENTIFIER_VALUE,
      subjectAlternateName: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
      subjectPhone: EXAMPLE_FORM_SUBJECT_PHONE,
      subjectIdValue: EXAMPLE_FORM_SUBJECT_IDENTIFIER_VALUE,
      subjectDateOfBirth: EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR,
      subjectGender: EXAMPLE_KYC_CONTROLLER_GENDER_MALE,
      docDate: EXAMPLE_PDF_CONSENT_DATE,
      serviceProviderDomain: EXAMPLE_SERVICE_PROVIDER_DOMAIN,
    };

    const result = buildClaimsFromIndividualOrganizationForm(formFields);

    expect(result.claims).toMatchObject({
      '@context': 'org.schema',
      [ClaimsOrganizationSchemaorg.alternateName]: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
      [ClaimsOrganizationSchemaorg.ownerAlternateName]: 'controller-visible-name',
      [ClaimsOrganizationSchemaorg.ownerEmail]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
      [ClaimsOrganizationSchemaorg.ownerTelephone]: EXAMPLE_FORM_CONTROLLER_PHONE,
      [ClaimsOrganizationSchemaorg.ownerIdentifierValue]: EXAMPLE_FORM_CONTROLLER_IDENTIFIER_VALUE,
      [ClaimsOrganizationSchemaorg.memberIdentifierValue]: EXAMPLE_FORM_SUBJECT_IDENTIFIER_VALUE,
      [ClaimsOrganizationSchemaorg.memberBirthDate]: EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR,
      [ClaimsOrganizationSchemaorg.memberGender]: EXAMPLE_KYC_CONTROLLER_GENDER_MALE,
      [ClaimsOrganizationSchemaorg.memberRole]: 'ONESELF',
      [ClaimsServiceSchemaorg.serviceType]: EXAMPLE_SERVICE_PROVIDER_DOMAIN,
      [ClaimsOrderSchemaorg.orderedItemServiceType]: EXAMPLE_SERVICE_PROVIDER_DOMAIN,
    });
  });

  it('merges explicit claims, KYC-derived claims, and form overrides with form taking precedence when non-empty', () => {
    const result = mergeIndividualOrganizationClaims({
      claims: {
        [ClaimsOrganizationSchemaorg.ownerEmail]: 'legacy@example.com',
        [ClaimsOrganizationSchemaorg.ownerAlternateName]: 'legacy-controller',
      },
      kyc: EXAMPLE_KYC_PAYLOAD,
      formFields: {
        controllerIsSubject: false,
        controllerAlternateName: 'controller-visible-name',
        controllerEmail: '',
        controllerPhone: EXAMPLE_FORM_CONTROLLER_PHONE,
        subjectAlternateName: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
        subjectPhone: EXAMPLE_FORM_SUBJECT_PHONE,
        serviceProviderDomain: EXAMPLE_SERVICE_PROVIDER_DOMAIN,
      },
    });

    expect(result.claims[ClaimsOrganizationSchemaorg.ownerEmail]).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED);
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerTelephone]).toBe(EXAMPLE_FORM_CONTROLLER_PHONE);
    expect(result.claims[ClaimsOrganizationSchemaorg.alternateName]).toBe(EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME);
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerAlternateName]).toBe('controller-visible-name');
    expect(result.claims[ClaimsOrganizationSchemaorg.memberTelephone]).toBeUndefined();
    expect(result.claims[ClaimsOrderSchemaorg.orderedItemServiceType]).toBe(EXAMPLE_SERVICE_PROVIDER_DOMAIN);
  });
});
