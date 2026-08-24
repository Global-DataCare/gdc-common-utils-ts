import { describe, expect, it } from '@jest/globals';

import {
  EXAMPLE_CONTROLLER_BINDING,
  EXAMPLE_EMAIL_CONTROLLER_ORG,
  EXAMPLE_JURISDICTION,
  EXAMPLE_LEGAL_ORGANIZATION_TAX_ID,
  EXAMPLE_ORGANIZATION_LEGAL_NAME,
  EXAMPLE_SECTOR,
  EXAMPLE_SIGNED_TERMS_PDF_URL,
  EXAMPLE_TENANT_SERVICE_DID,
} from '../src/examples/shared';
import {
  createLegalOrganizationOnboardingEditor,
} from '../src/utils/legal-organization-onboarding-editor';
import { EXAMPLE_LEGAL_ORGANIZATION_SERVICE_TYPE } from '../src/examples/legal-organization-verification-transaction';

const exampleControllerBinding = {
  did: EXAMPLE_CONTROLLER_BINDING.did,
  sameAs: EXAMPLE_CONTROLLER_BINDING.sameAs,
  publicKeyJwk: { ...EXAMPLE_CONTROLLER_BINDING.publicKeyJwk },
  ...(EXAMPLE_CONTROLLER_BINDING.jwks
    ? {
        jwks: {
          keys: EXAMPLE_CONTROLLER_BINDING.jwks.keys.map((item) => ({ ...item })) as Record<string, unknown>[],
        },
      }
    : {}),
};

describe('legal organization onboarding editor', () => {
  it('builds normalized claims from business setters without requiring explicit alternateName', () => {
    const draft = createLegalOrganizationOnboardingEditor()
      .setLegalName(EXAMPLE_ORGANIZATION_LEGAL_NAME)
      .setTaxId(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID)
      .setLegalIdentifierValue(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID)
      .setLegalIdentifierType('taxID')
      .setAddressCountry(EXAMPLE_JURISDICTION)
      .setControllerEmail(EXAMPLE_EMAIL_CONTROLLER_ORG)
      .setControllerRole('RESPRSN')
      .setServiceCategory(EXAMPLE_SECTOR)
      .setServiceIdentifier(EXAMPLE_TENANT_SERVICE_DID)
      .setServiceType(EXAMPLE_LEGAL_ORGANIZATION_SERVICE_TYPE)
      .setServiceUrl('https://provider.example.org')
      .buildDraft();

    expect(draft.validation.ok).toBe(true);
    expect(draft.claims['org.schema.Organization.legalName']).toBe(EXAMPLE_ORGANIZATION_LEGAL_NAME);
    expect(draft.claims['org.schema.Organization.taxID']).toBe(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID);
    expect(draft.claims['org.schema.Organization.identifier.value']).toBe(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID);
    expect(draft.claims['org.schema.Organization.alternateName']).toBe(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID);
    expect(draft.claims['org.schema.Service.serviceType']).toBe(EXAMPLE_LEGAL_ORGANIZATION_SERVICE_TYPE);
  });

  it('builds the canonical verification-transaction input from the same form draft', () => {
    const input = createLegalOrganizationOnboardingEditor()
      .setLegalName(EXAMPLE_ORGANIZATION_LEGAL_NAME)
      .setTaxId(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID)
      .setLegalIdentifierValue(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID)
      .setLegalIdentifierType('taxID')
      .setAddressCountry(EXAMPLE_JURISDICTION)
      .setControllerEmail(EXAMPLE_EMAIL_CONTROLLER_ORG)
      .setControllerRole('RESPRSN')
      .setServiceCategory(EXAMPLE_SECTOR)
      .setServiceType(EXAMPLE_LEGAL_ORGANIZATION_SERVICE_TYPE)
      .buildVerificationTransactionInput({
        controller: exampleControllerBinding,
        legalRepresentativePayload: {
          email: EXAMPLE_EMAIL_CONTROLLER_ORG,
        },
        attachments: [{
          id: 'signed-terms-pdf-001',
          media_type: 'application/pdf',
          data: {
            links: [EXAMPLE_SIGNED_TERMS_PDF_URL],
          },
        }],
      });

    expect(input.claims['org.schema.Organization.identifier.value']).toBe(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID);
    expect(input.controller.publicKeyJwk).toEqual(exampleControllerBinding.publicKeyJwk);
    expect((input.attachments || [])[0]).toEqual({
      id: 'signed-terms-pdf-001',
      media_type: 'application/pdf',
      data: {
        links: [EXAMPLE_SIGNED_TERMS_PDF_URL],
      },
    });
  });

  it('surfaces validation errors and warnings from one incomplete draft', () => {
    const validation = createLegalOrganizationOnboardingEditor()
      .setTaxId(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID)
      .setServiceCategory(EXAMPLE_SECTOR)
      .validate();

    expect(validation.ok).toBe(false);
    expect(validation.errors.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      'missing-legal-name',
      'missing-legal-identifier-type',
      'missing-address-country',
      'missing-controller-email',
      'missing-service-type',
    ]));
    expect(validation.warnings.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      'missing-controller-role',
      'missing-service-url',
    ]));
  });
});
