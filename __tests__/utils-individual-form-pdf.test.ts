import {
  buildClaimsFromIndividualFormPdf,
  parseDistinguishedName,
} from '../src/utils/individual-form-pdf';
import { ClaimsOrderSchemaorg, ClaimsOrganizationSchemaorg, ClaimsPersonSchemaorg } from '../src/constants/schemaorg';
import {
  IndividualFormPdfFieldName,
  IndividualFormPdfFieldNames,
  IndividualIndexServiceFormFields,
} from '../src/models/individual-onboarding';
import { ClaimConsent } from '../src/models/consent-rule';
import {
  EXAMPLE_CONTROLLER_IDENTIFIER_TYPE,
  EXAMPLE_FORM_CONTROLLER_IDENTIFIER_VALUE,
  EXAMPLE_FORM_CONTROLLER_PHONE,
  EXAMPLE_FORM_SUBJECT_IDENTIFIER_VALUE,
  EXAMPLE_FORM_SUBJECT_PHONE,
  EXAMPLE_PDF_CONSENT_DATE,
  EXAMPLE_PDF_SERVICE_PROVIDER_DOMAIN,
  EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
  EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR,
  EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME,
  EXAMPLE_SELF_REGISTERED_INDIVIDUAL_BIRTH_YEAR,
  EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL,
  EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
  EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
  EXAMPLE_SUBJECT_IDENTIFIER_TYPE,
  EXAMPLE_SYNTHETIC_CERT_COMMON_NAME,
  EXAMPLE_SYNTHETIC_CERT_COUNTRY,
  EXAMPLE_SYNTHETIC_CERT_DISPLAY_NAME,
  EXAMPLE_SYNTHETIC_CERT_FAMILY_NAME,
  EXAMPLE_SYNTHETIC_CERT_GIVEN_NAME,
  EXAMPLE_SYNTHETIC_CERT_SERIAL_NUMBER,
  EXAMPLE_SYNTHETIC_SIGNER_SUBJECT_DN,
} from '../src/examples/shared';

/**
 * This suite is intentionally a pure unit test.
 *
 * It does not read a real PDF and does not inspect a real certificate signature.
 * That integration path is covered in `gwtemplate-node-ts`, where the signed PDF is
 * parsed for real and the expected values come from environment variables.
 *
 * Here we use a synthetic DN fixture to verify only the deterministic contract of this helper:
 * parsing a signer subject DN and mapping it into normalized `org.schema` claims.
 */
describe('individual PDF form utilities', () => {
  const SYNTHETIC_SIGNER_SUBJECT_DN = EXAMPLE_SYNTHETIC_SIGNER_SUBJECT_DN;
  const SYNTHETIC_CERT_SUBJECT = {
    cn: EXAMPLE_SYNTHETIC_CERT_COMMON_NAME,
    sn: EXAMPLE_SYNTHETIC_CERT_FAMILY_NAME,
    gn: EXAMPLE_SYNTHETIC_CERT_GIVEN_NAME,
    serialNumber: EXAMPLE_SYNTHETIC_CERT_SERIAL_NUMBER,
    country: EXAMPLE_SYNTHETIC_CERT_COUNTRY,
  } as const;

  it('parses natural-person certificate subject DNs', () => {
    expect(parseDistinguishedName(SYNTHETIC_SIGNER_SUBJECT_DN)).toEqual({
      CN: SYNTHETIC_CERT_SUBJECT.cn,
      SN: SYNTHETIC_CERT_SUBJECT.sn,
      GN: SYNTHETIC_CERT_SUBJECT.gn,
      SERIALNUMBER: SYNTHETIC_CERT_SUBJECT.serialNumber,
      C: SYNTHETIC_CERT_SUBJECT.country,
    });
  });

  it('maps self=true using top-level alias/contact for both owner and controller claims', () => {
    const result = buildClaimsFromIndividualFormPdf({
      signerSubjectDn: SYNTHETIC_SIGNER_SUBJECT_DN,
      fields: {
        [IndividualFormPdfFieldName.self]: 'true',
        [IndividualFormPdfFieldName.alternateName]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME,
        [IndividualFormPdfFieldName.email]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL,
        [IndividualFormPdfFieldName.sexPicker]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
        [IndividualFormPdfFieldName.dateOfBirth]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_BIRTH_YEAR,
      },
    });

    expect(result.claims).toEqual({
      '@context': 'org.schema',
      [ClaimsOrganizationSchemaorg.alternateName]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME,
      [ClaimsOrganizationSchemaorg.ownerEmail]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
      [ClaimsOrganizationSchemaorg.ownerIdentifierValue]: SYNTHETIC_CERT_SUBJECT.serialNumber,
      [ClaimsPersonSchemaorg.email]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
      [ClaimsPersonSchemaorg.alternateName]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME,
      [ClaimsPersonSchemaorg.name]: EXAMPLE_SYNTHETIC_CERT_DISPLAY_NAME,
      [ClaimsPersonSchemaorg.givenName]: EXAMPLE_SYNTHETIC_CERT_GIVEN_NAME,
      [ClaimsPersonSchemaorg.familyName]: EXAMPLE_SYNTHETIC_CERT_FAMILY_NAME,
      [ClaimsPersonSchemaorg.identifierValue]: SYNTHETIC_CERT_SUBJECT.serialNumber,
      [ClaimsPersonSchemaorg.identifier]: `urn:person:identifier:${SYNTHETIC_CERT_SUBJECT.serialNumber}`,
      [ClaimsOrganizationSchemaorg.addressCountry]: SYNTHETIC_CERT_SUBJECT.country,
      [ClaimsPersonSchemaorg.gender]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
      [ClaimsPersonSchemaorg.birthDate]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_BIRTH_YEAR,
    });
  });

  it('maps subject* fields into the individual Organization when a controller registers Doraemon as a different subject', () => {
    const result = buildClaimsFromIndividualFormPdf({
      signerSubjectDn: SYNTHETIC_SIGNER_SUBJECT_DN,
      fields: {
        [IndividualFormPdfFieldName.self]: 'false',
        [IndividualFormPdfFieldName.alternateName]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME,
        [IndividualFormPdfFieldName.email]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL,
        [IndividualFormPdfFieldName.subjectAlternateName]: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
        [IndividualFormPdfFieldName.subjectDateOfBirth]: EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR,
        [IndividualFormPdfFieldName.subjectGender]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
        [IndividualFormPdfFieldName.date]: EXAMPLE_PDF_CONSENT_DATE,
        [IndividualFormPdfFieldName.serviceProviderDomain]: EXAMPLE_PDF_SERVICE_PROVIDER_DOMAIN,
      },
    });

    expect(result.claims[ClaimsOrganizationSchemaorg.alternateName]).toBe(EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME);
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerEmail]).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED);
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerIdentifierValue]).toBe(SYNTHETIC_CERT_SUBJECT.serialNumber);
    expect(result.claims[ClaimsPersonSchemaorg.alternateName]).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME);
    expect(result.claims[ClaimsPersonSchemaorg.name]).toBe(EXAMPLE_SYNTHETIC_CERT_DISPLAY_NAME);
    expect(result.claims[ClaimsPersonSchemaorg.identifierValue]).toBe(SYNTHETIC_CERT_SUBJECT.serialNumber);
    expect(result.claims[ClaimsPersonSchemaorg.birthDate]).toBe(EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR);
    expect(result.claims[ClaimsPersonSchemaorg.gender]).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER);
    expect(result.claims[ClaimConsent.date]).toBe(EXAMPLE_PDF_CONSENT_DATE);
    expect(result.claims[ClaimsOrderSchemaorg.orderedItemServiceType]).toBe(EXAMPLE_PDF_SERVICE_PROVIDER_DOMAIN);
  });

  it('falls back to top-level alias/contact when subject fields are absent even if self=false', () => {
    const result = buildClaimsFromIndividualFormPdf({
      signerSubjectDn: SYNTHETIC_SIGNER_SUBJECT_DN,
      fields: {
        [IndividualFormPdfFieldName.self]: 'false',
        [IndividualFormPdfFieldName.alternateName]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME,
        [IndividualFormPdfFieldName.email]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
      },
    });

    expect(result.resolved.selfDeclared).toBe(false);
    expect(result.claims[ClaimsOrganizationSchemaorg.alternateName]).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME);
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerEmail]).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED);
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerIdentifierValue]).toBe(SYNTHETIC_CERT_SUBJECT.serialNumber);
    expect(result.claims[ClaimsPersonSchemaorg.alternateName]).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME);
  });

  it('exports the canonical list of supported onboarding PDF field names', () => {
    expect(IndividualFormPdfFieldNames).toEqual([
      IndividualFormPdfFieldName.self,
      IndividualFormPdfFieldName.alternateName,
      IndividualFormPdfFieldName.givenName,
      IndividualFormPdfFieldName.familyName,
      IndividualFormPdfFieldName.subjectAlternateName,
      IndividualFormPdfFieldName.subjectGivenName,
      IndividualFormPdfFieldName.subjectFamilyName,
      IndividualFormPdfFieldName.email,
      IndividualFormPdfFieldName.subjectEmail,
      IndividualFormPdfFieldName.phone,
      IndividualFormPdfFieldName.subjectPhone,
      IndividualFormPdfFieldName.idType,
      IndividualFormPdfFieldName.idValue,
      IndividualFormPdfFieldName.subjectIdType,
      IndividualFormPdfFieldName.subjectIdValue,
      IndividualFormPdfFieldName.dateOfBirth,
      IndividualFormPdfFieldName.subjectDateOfBirth,
      IndividualFormPdfFieldName.sexPicker,
      IndividualFormPdfFieldName.gender,
      IndividualFormPdfFieldName.subjectSexPicker,
      IndividualFormPdfFieldName.subjectGender,
      IndividualFormPdfFieldName.date,
      IndividualFormPdfFieldName.serviceProviderDomain,
    ]);
  });

  it('exports the full known PDF field shape, including fields not yet consumed by the mapper', () => {
    const knownFields: IndividualIndexServiceFormFields = {
      self: true,
      alternateName: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME,
      givenName: EXAMPLE_SYNTHETIC_CERT_GIVEN_NAME,
      familyName: EXAMPLE_SYNTHETIC_CERT_FAMILY_NAME,
      subjectAlternateName: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
      subjectGivenName: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
      subjectFamilyName: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
      email: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL,
      subjectEmail: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
      phone: EXAMPLE_FORM_CONTROLLER_PHONE,
      subjectPhone: EXAMPLE_FORM_SUBJECT_PHONE,
      idType: EXAMPLE_CONTROLLER_IDENTIFIER_TYPE,
      idValue: EXAMPLE_FORM_CONTROLLER_IDENTIFIER_VALUE,
      subjectIdType: EXAMPLE_SUBJECT_IDENTIFIER_TYPE,
      subjectIdValue: EXAMPLE_FORM_SUBJECT_IDENTIFIER_VALUE,
      dateOfBirth: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_BIRTH_YEAR,
      subjectDateOfBirth: EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR,
      sexAtBirth: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
      gender: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
      subjectSexAtBirth: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
      subjectGender: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
      date: EXAMPLE_PDF_CONSENT_DATE,
      serviceProviderDomain: EXAMPLE_PDF_SERVICE_PROVIDER_DOMAIN,
    };

    expect(knownFields.self).toBe(true);
    expect(knownFields.sexAtBirth).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER);
    expect(knownFields.subjectSexAtBirth).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER);
    expect(knownFields.serviceProviderDomain).toBe(EXAMPLE_PDF_SERVICE_PROVIDER_DOMAIN);
  });
});
