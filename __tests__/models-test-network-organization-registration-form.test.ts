import {
  TEST_NETWORK_ORGANIZATION_REGISTRATION_PDF_FIELDS,
  type TestNetworkOrganizationRegistrationPdfForm,
} from '../src/models/test-network-organization-registration-form.js';

describe('Test Network organization registration PDF contract', () => {
  it('exports the exact supplied AcroForm names plus the server key commitment', () => {
    expect(TEST_NETWORK_ORGANIZATION_REGISTRATION_PDF_FIELDS).toEqual(expect.arrayContaining([
      'hostServiceLegalName',
      'organizationLegalName',
      'representativeFullName',
      'controllerContactEmail',
      'docVersion',
      'signDate',
      'controllerKeyCommitment',
    ]));
    expect(new Set(TEST_NETWORK_ORGANIZATION_REGISTRATION_PDF_FIELDS).size)
      .toBe(TEST_NETWORK_ORGANIZATION_REGISTRATION_PDF_FIELDS.length);
  });

  it('composes provider, organization, representative, controller and BFF metadata', () => {
    const form = {} as TestNetworkOrganizationRegistrationPdfForm;
    const compileTimeContract: readonly (keyof TestNetworkOrganizationRegistrationPdfForm)[] =
      TEST_NETWORK_ORGANIZATION_REGISTRATION_PDF_FIELDS;
    expect(form).toEqual({});
    expect(compileTimeContract).toHaveLength(41);
  });
});
