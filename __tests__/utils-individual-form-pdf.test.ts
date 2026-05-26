import {
  buildClaimsFromIndividualFormPdf,
  parseDistinguishedName,
} from '../src/utils/individual-form-pdf';
import { ClaimsOrganizationSchemaorg, ClaimsPersonSchemaorg } from '../src/constants/schemaorg';

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
  const SYNTHETIC_SIGNER_SUBJECT_DN = 'CN=DOE JANE - TEST1234,SN=DOE,GN=JANE,serialNumber=IDCES-TEST1234,C=ES';
  const SYNTHETIC_CERT_SUBJECT = {
    cn: 'DOE JANE - TEST1234',
    sn: 'DOE',
    gn: 'JANE',
    serialNumber: 'IDCES-TEST1234',
    country: 'ES',
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
        self: 'true',
        alternateName: 'jane',
        email: 'Jane.Doe@example.com',
        sexPicker: 'M',
        dateOfBirth: '1980',
      },
    });

    expect(result.claims).toEqual({
      '@context': 'org.schema',
      [ClaimsOrganizationSchemaorg.alternateName]: 'jane',
      [ClaimsOrganizationSchemaorg.ownerEmail]: 'jane.doe@example.com',
      [ClaimsOrganizationSchemaorg.ownerIdentifierValue]: SYNTHETIC_CERT_SUBJECT.serialNumber,
      [ClaimsPersonSchemaorg.email]: 'jane.doe@example.com',
      [ClaimsPersonSchemaorg.alternateName]: 'jane',
      [ClaimsPersonSchemaorg.name]: 'JANE DOE',
      [ClaimsPersonSchemaorg.givenName]: 'JANE',
      [ClaimsPersonSchemaorg.familyName]: 'DOE',
      [ClaimsPersonSchemaorg.identifierValue]: SYNTHETIC_CERT_SUBJECT.serialNumber,
      [ClaimsPersonSchemaorg.identifier]: `urn:person:identifier:${SYNTHETIC_CERT_SUBJECT.serialNumber}`,
      [ClaimsOrganizationSchemaorg.addressCountry]: SYNTHETIC_CERT_SUBJECT.country,
      [ClaimsPersonSchemaorg.gender]: 'M',
      [ClaimsPersonSchemaorg.birthDate]: '1980',
    });
  });

  it('maps subject* fields into the individual Organization when subject differs from controller', () => {
    const result = buildClaimsFromIndividualFormPdf({
      signerSubjectDn: SYNTHETIC_SIGNER_SUBJECT_DN,
      fields: {
        self: 'false',
        alternateName: 'controller-fer',
        email: 'controller@example.com',
        subjectAlternateName: 'subject-ana',
        subjectPhone: '+34600111222',
      },
    });

    expect(result.claims[ClaimsOrganizationSchemaorg.alternateName]).toBe('subject-ana');
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerTelephone]).toBe('+34600111222');
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerIdentifierValue]).toBe(SYNTHETIC_CERT_SUBJECT.serialNumber);
    expect(result.claims[ClaimsPersonSchemaorg.alternateName]).toBe('controller-fer');
    expect(result.claims[ClaimsPersonSchemaorg.name]).toBe('JANE DOE');
    expect(result.claims[ClaimsPersonSchemaorg.identifierValue]).toBe(SYNTHETIC_CERT_SUBJECT.serialNumber);
  });

  it('falls back to top-level alias/contact when subject fields are absent even if self=false', () => {
    const result = buildClaimsFromIndividualFormPdf({
      signerSubjectDn: SYNTHETIC_SIGNER_SUBJECT_DN,
      fields: {
        self: 'false',
        alternateName: 'jane',
        email: 'jane.doe@example.com',
      },
    });

    expect(result.resolved.selfDeclared).toBe(false);
    expect(result.claims[ClaimsOrganizationSchemaorg.alternateName]).toBe('jane');
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerEmail]).toBe('jane.doe@example.com');
    expect(result.claims[ClaimsOrganizationSchemaorg.ownerIdentifierValue]).toBe(SYNTHETIC_CERT_SUBJECT.serialNumber);
    expect(result.claims[ClaimsPersonSchemaorg.alternateName]).toBe('jane');
  });
});
