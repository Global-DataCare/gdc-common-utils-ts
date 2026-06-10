import {
  buildClaimsFromIndividualFormPdf,
  parseDistinguishedName,
} from '../src/utils/individual-form-pdf';
import { ClaimsOrderSchemaorg, ClaimsOrganizationSchemaorg, ClaimsPersonSchemaorg } from '../src/constants/schemaorg';
import {
  IndividualFormPdfFieldName,
  IndividualFormPdfFieldNames,
  IndividualFormTemplateFields,
} from '../src/models/individual-onboarding';
import { ClaimConsent } from '../src/models/consent-rule';
import {
  EXAMPLE_CONTROLLER_IDENTIFIER_TYPE,
  EXAMPLE_FORM_CONTROLLER_IDENTIFIER_VALUE,
  EXAMPLE_FORM_CONTROLLER_PHONE,
  EXAMPLE_FORM_SUBJECT_IDENTIFIER_VALUE,
  EXAMPLE_FORM_SUBJECT_PHONE,
  EXAMPLE_PDF_CONSENT_DATE,
  EXAMPLE_SERVICE_PROVIDER_DOMAIN,
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

  it('maps controllerIsSubject=true using controller fields for both owner and subject claims', () => {
    const result = buildClaimsFromIndividualFormPdf({
      signerSubjectDn: SYNTHETIC_SIGNER_SUBJECT_DN,
      fields: {
        [IndividualFormPdfFieldName.controllerIsSubject]: 'true',
        [IndividualFormPdfFieldName.controllerAlternateName]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME,
        [IndividualFormPdfFieldName.controllerEmail]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL,
        [IndividualFormPdfFieldName.controllerSexAtBirth]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
        [IndividualFormPdfFieldName.controllerDateOfBirth]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_BIRTH_YEAR,
      },
    });

    expect(result.claims).toEqual({
      '@context': 'org.schema',
      [ClaimsOrganizationSchemaorg.alternateName]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME,
      [ClaimsOrganizationSchemaorg.ownerAlternateName]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME,
      [ClaimsOrganizationSchemaorg.ownerEmail]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
      [ClaimsOrganizationSchemaorg.ownerIdentifierValue]: SYNTHETIC_CERT_SUBJECT.serialNumber,
      [ClaimsOrganizationSchemaorg.memberGender]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
      [ClaimsOrganizationSchemaorg.memberBirthDate]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_BIRTH_YEAR,
      [ClaimsOrganizationSchemaorg.memberRole]: 'ONESELF',
      [ClaimsPersonSchemaorg.name]: EXAMPLE_SYNTHETIC_CERT_DISPLAY_NAME,
      [ClaimsPersonSchemaorg.givenName]: EXAMPLE_SYNTHETIC_CERT_GIVEN_NAME,
      [ClaimsPersonSchemaorg.familyName]: EXAMPLE_SYNTHETIC_CERT_FAMILY_NAME,
      [ClaimsPersonSchemaorg.identifierValue]: SYNTHETIC_CERT_SUBJECT.serialNumber,
      [ClaimsPersonSchemaorg.identifier]: `urn:person:identifier:${SYNTHETIC_CERT_SUBJECT.serialNumber}`,
      [ClaimsPersonSchemaorg.gender]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
      [ClaimsPersonSchemaorg.birthDate]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_BIRTH_YEAR,
      [ClaimsOrganizationSchemaorg.addressCountry]: SYNTHETIC_CERT_SUBJECT.country,
    });
  });

  it('maps subject* fields into the individual Organization when a controller registers Doraemon as a different subject', () => {
    const result = buildClaimsFromIndividualFormPdf({
      signerSubjectDn: SYNTHETIC_SIGNER_SUBJECT_DN,
      fields: {
        [IndividualFormPdfFieldName.controllerIsSubject]: 'false',
        [IndividualFormPdfFieldName.controllerAlternateName]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME,
        [IndividualFormPdfFieldName.controllerEmail]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL,
        [IndividualFormPdfFieldName.subjectAlternateName]: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
        [IndividualFormPdfFieldName.subjectDateOfBirth]: EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR,
        [IndividualFormPdfFieldName.subjectGender]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
        [IndividualFormPdfFieldName.docDate]: EXAMPLE_PDF_CONSENT_DATE,
        [IndividualFormPdfFieldName.serviceProviderDomain]: EXAMPLE_SERVICE_PROVIDER_DOMAIN,
      },
    });

    expect(result.claims[ClaimsOrganizationSchemaorg.alternateName]).toBe(EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME);
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerAlternateName]).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME);
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerEmail]).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED);
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerIdentifierValue]).toBe(SYNTHETIC_CERT_SUBJECT.serialNumber);
    expect(result.claims[ClaimsOrganizationSchemaorg.memberBirthDate]).toBe(EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR);
    expect(result.claims[ClaimsOrganizationSchemaorg.memberGender]).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER);
    expect(result.claims[ClaimsOrganizationSchemaorg.memberRole]).toBe('ONESELF');
    expect(result.claims[ClaimsPersonSchemaorg.name]).toBe(EXAMPLE_SYNTHETIC_CERT_DISPLAY_NAME);
    expect(result.claims[ClaimsPersonSchemaorg.identifierValue]).toBe(SYNTHETIC_CERT_SUBJECT.serialNumber);
    expect(result.claims[ClaimConsent.date]).toBe(EXAMPLE_PDF_CONSENT_DATE);
    expect(result.claims[ClaimsOrderSchemaorg.orderedItemServiceType]).toBe(EXAMPLE_SERVICE_PROVIDER_DOMAIN);
  });

  it('falls back to controller alias/contact when subject fields are absent even if controllerIsSubject=false', () => {
    const result = buildClaimsFromIndividualFormPdf({
      signerSubjectDn: SYNTHETIC_SIGNER_SUBJECT_DN,
      fields: {
        [IndividualFormPdfFieldName.controllerIsSubject]: 'false',
        [IndividualFormPdfFieldName.controllerAlternateName]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME,
        [IndividualFormPdfFieldName.controllerEmail]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
      },
    });

    expect(result.resolved.selfDeclared).toBe(false);
    expect(result.claims[ClaimsOrganizationSchemaorg.alternateName]).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME);
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerAlternateName]).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME);
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerEmail]).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED);
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerIdentifierValue]).toBe(SYNTHETIC_CERT_SUBJECT.serialNumber);
    expect(result.claims[ClaimsPersonSchemaorg.alternateName]).toBeUndefined();
  });

  it('exports the canonical list of supported onboarding PDF field names', () => {
    expect(IndividualFormPdfFieldNames).toEqual([
      IndividualFormPdfFieldName.docDate,
      IndividualFormPdfFieldName.serviceProviderDomain,
      IndividualFormPdfFieldName.controllerAlternateName,
      IndividualFormPdfFieldName.controllerDateOfBirth,
      IndividualFormPdfFieldName.controllerEmail,
      IndividualFormPdfFieldName.controllerFamilyName,
      IndividualFormPdfFieldName.controllerGender,
      IndividualFormPdfFieldName.controllerGivenName,
      IndividualFormPdfFieldName.controllerIdType,
      IndividualFormPdfFieldName.controllerIdValue,
      IndividualFormPdfFieldName.controllerPhone,
      IndividualFormPdfFieldName.controllerSexAtBirth,
      IndividualFormPdfFieldName.controllerIsSubject,
      IndividualFormPdfFieldName.subjectAlternateName,
      IndividualFormPdfFieldName.subjectGivenName,
      IndividualFormPdfFieldName.subjectFamilyName,
      IndividualFormPdfFieldName.subjectEmail,
      IndividualFormPdfFieldName.subjectPhone,
      IndividualFormPdfFieldName.subjectIdType,
      IndividualFormPdfFieldName.subjectIdValue,
      IndividualFormPdfFieldName.subjectDateOfBirth,
      IndividualFormPdfFieldName.subjectGender,
      IndividualFormPdfFieldName.subjectSexAtBirth,
    ]);
  });

  it('exports the full known PDF field shape, including fields not yet consumed by the mapper', () => {
    const knownFields: IndividualFormTemplateFields = {
      controllerIsSubject: true,
      controllerAlternateName: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME,
      controllerGivenName: EXAMPLE_SYNTHETIC_CERT_GIVEN_NAME,
      controllerFamilyName: EXAMPLE_SYNTHETIC_CERT_FAMILY_NAME,
      subjectAlternateName: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
      subjectGivenName: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
      subjectFamilyName: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
      controllerEmail: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL,
      subjectEmail: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
      controllerPhone: EXAMPLE_FORM_CONTROLLER_PHONE,
      subjectPhone: EXAMPLE_FORM_SUBJECT_PHONE,
      controllerIdType: EXAMPLE_CONTROLLER_IDENTIFIER_TYPE,
      controllerIdValue: EXAMPLE_FORM_CONTROLLER_IDENTIFIER_VALUE,
      subjectIdType: EXAMPLE_SUBJECT_IDENTIFIER_TYPE,
      subjectIdValue: EXAMPLE_FORM_SUBJECT_IDENTIFIER_VALUE,
      controllerDateOfBirth: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_BIRTH_YEAR,
      subjectDateOfBirth: EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR,
      controllerSexAtBirth: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
      controllerGender: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
      subjectSexAtBirth: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
      subjectGender: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER,
      docDate: EXAMPLE_PDF_CONSENT_DATE,
      serviceProviderDomain: EXAMPLE_SERVICE_PROVIDER_DOMAIN,
    };

    expect(knownFields.controllerIsSubject).toBe(true);
    expect(knownFields.controllerSexAtBirth).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER);
    expect(knownFields.subjectSexAtBirth).toBe(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER);
    expect(knownFields.serviceProviderDomain).toBe(EXAMPLE_SERVICE_PROVIDER_DOMAIN);
  });
});
