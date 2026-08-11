/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { describe, expect, it } from '@jest/globals';

import {
  EXAMPLE_CONTROLLER_BINDING,
  EXAMPLE_EMAIL_CONTROLLER_ORG,
  EXAMPLE_JURISDICTION,
  EXAMPLE_LEGAL_ORGANIZATION_TAX_ID,
  EXAMPLE_ORGANIZATION_LEGAL_NAME,
  EXAMPLE_PUBLIC_PORTAL_DOMAIN,
  EXAMPLE_SECTOR,
  EXAMPLE_SIGNED_TERMS_PDF_URL,
  EXAMPLE_TENANT_SERVICE_DID,
} from '../src/examples/shared';
import {
  createLegalOrganizationOnboardingEditor,
} from '../src/utils/legal-organization-onboarding-editor';

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

describe('101: legal-organization onboarding editor', () => {
  it('walks one portal/BFF draft with only high-level onboarding methods', () => {
    // Step 1: the front-web form captures business fields, not raw claim keys.
    const editor = createLegalOrganizationOnboardingEditor()
      .setLegalName(EXAMPLE_ORGANIZATION_LEGAL_NAME)
      .setTaxId(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID)
      .setLegalIdentifierValue(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID)
      .setLegalIdentifierType('taxID')
      .setAddressCountry(EXAMPLE_JURISDICTION)
      .setControllerEmail(EXAMPLE_EMAIL_CONTROLLER_ORG)
      .setControllerRole('RESPRSN')
      .setServiceCategory(EXAMPLE_SECTOR)
      .setServiceIdentifier(EXAMPLE_TENANT_SERVICE_DID)
      .setServiceUrl('https://provider.example.org');

    // Step 2: the frontend/BFF validates and normalizes the shared claim set.
    const draft = editor.buildDraft();
    expect(draft.validation.ok).toBe(true);
    expect(editor.getLegalName()).toBe(EXAMPLE_ORGANIZATION_LEGAL_NAME);
    expect(editor.getTaxId()).toBe(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID);
    expect(editor.getLegalIdentifierType()).toBe('taxID');
    expect(editor.getLegalIdentifierValue()).toBe(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID);
    expect(editor.getControllerEmail()).toBe(EXAMPLE_EMAIL_CONTROLLER_ORG);
    expect(editor.getServiceCategory()).toBe(EXAMPLE_SECTOR);
    expect(editor.getServiceIdentifier()).toBe(EXAMPLE_TENANT_SERVICE_DID);
    expect(editor.getServiceUrl()).toBe('https://provider.example.org');
    expect(draft.claims['org.schema.Organization.identifier.value']).toBe(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID);
    expect(draft.claims['org.schema.Organization.alternateName']).toBe(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID);

    // Step 3: the BFF asks the editor for the host-side verification request.
    const verificationRequest = editor.buildGatewayVerificationRequest({
      controller: exampleControllerBinding,
      publicOrganizationDomain: EXAMPLE_PUBLIC_PORTAL_DOMAIN,
      signedTermsPdfUrl: EXAMPLE_SIGNED_TERMS_PDF_URL,
    });

    expect(verificationRequest.claims['org.schema.Organization.legalName']).toBe(EXAMPLE_ORGANIZATION_LEGAL_NAME);
    expect(verificationRequest.controller.did).toBe(exampleControllerBinding.did);
    expect(verificationRequest.organization).toEqual({
      did: `did:web:${EXAMPLE_PUBLIC_PORTAL_DOMAIN}:${EXAMPLE_SECTOR}:organization:taxid:${EXAMPLE_LEGAL_ORGANIZATION_TAX_ID}`,
      url: 'https://provider.example.org',
    });
    expect(verificationRequest.legalRepresentativePayload).toBeUndefined();
    expect((verificationRequest.attachments || [])[0]).toEqual({
      id: 'signed-terms-pdf-001',
      media_type: 'application/pdf',
      data: {
        links: [EXAMPLE_SIGNED_TERMS_PDF_URL],
      },
    });
  });

  it('does not confuse the technical service DID with the public organization DID', () => {
    const editor = createLegalOrganizationOnboardingEditor()
      .setLegalName(EXAMPLE_ORGANIZATION_LEGAL_NAME)
      .setTaxId(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID)
      .setLegalIdentifierValue(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID)
      .setLegalIdentifierType('taxID')
      .setAddressCountry(EXAMPLE_JURISDICTION)
      .setControllerEmail(EXAMPLE_EMAIL_CONTROLLER_ORG)
      .setServiceCategory(EXAMPLE_SECTOR)
      .setServiceIdentifier(EXAMPLE_TENANT_SERVICE_DID)
      .setServiceUrl('https://provider.example.org');

    const verificationRequest = editor.buildGatewayVerificationRequest({
      controller: exampleControllerBinding,
    });

    expect(verificationRequest.organization).toEqual({
      url: 'https://provider.example.org',
    });
    expect(verificationRequest.organization?.did).not.toBe(EXAMPLE_TENANT_SERVICE_DID);
  });
});
