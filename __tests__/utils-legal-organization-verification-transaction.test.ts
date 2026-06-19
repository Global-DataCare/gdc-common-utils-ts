import {
  buildLegalOrganizationVerificationTransactionBundle,
  getFirstLegalOrganizationVerificationTransactionEntry,
  getLegalOrganizationVerificationController,
  getLegalOrganizationVerificationRepresentativePayload,
  LegalOrganizationVerificationTransactionEntryTypes,
} from '../src/utils/legal-organization-verification-transaction';
import {
  EXAMPLE_CONTROLLER_BINDING,
  EXAMPLE_EMAIL_CONTROLLER_ORG,
  EXAMPLE_JURISDICTION,
  EXAMPLE_LEGAL_ORGANIZATION_TAX_ID,
  EXAMPLE_ORGANIZATION_LEGAL_NAME,
  EXAMPLE_SECTOR,
  EXAMPLE_SIGNED_TERMS_PDF_URL,
} from '../src/examples/shared';
import {
  ClaimsOrganizationSchemaorg,
  ClaimsPersonSchemaorg,
  ClaimsServiceSchemaorg,
} from '../src/constants/schemaorg';
import type { LegalOrganizationVerificationTransactionController } from '../src/utils/legal-organization-verification-transaction';

describe('buildLegalOrganizationVerificationTransactionBundle', () => {
  it('builds the canonical first-step GW CORE bundle for ICA verification', () => {
    const controllerBinding: LegalOrganizationVerificationTransactionController = {
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
    const bundle = buildLegalOrganizationVerificationTransactionBundle({
      claims: {
        '@context': 'org.schema',
        [ClaimsOrganizationSchemaorg.legalName]: EXAMPLE_ORGANIZATION_LEGAL_NAME,
        [ClaimsOrganizationSchemaorg.identifierValue]: EXAMPLE_LEGAL_ORGANIZATION_TAX_ID,
        [ClaimsOrganizationSchemaorg.taxId]: EXAMPLE_LEGAL_ORGANIZATION_TAX_ID,
        [ClaimsOrganizationSchemaorg.addressCountry]: EXAMPLE_JURISDICTION,
        [ClaimsPersonSchemaorg.email]: EXAMPLE_EMAIL_CONTROLLER_ORG,
        [ClaimsServiceSchemaorg.category]: EXAMPLE_SECTOR,
      },
      controller: controllerBinding,
      legalRepresentativePayload: {
        email: EXAMPLE_EMAIL_CONTROLLER_ORG,
      },
      attachments: [{
        id: 'signed-terms-pdf-001',
        media_type: 'application/pdf',
        data: { links: [EXAMPLE_SIGNED_TERMS_PDF_URL] },
      }],
    });

    const firstEntry = getFirstLegalOrganizationVerificationTransactionEntry(bundle);
    const representative = getLegalOrganizationVerificationRepresentativePayload(bundle);
    const controller = getLegalOrganizationVerificationController(bundle);
    expect(bundle.type).toBe('collection');
    expect(firstEntry?.type).toBe(LegalOrganizationVerificationTransactionEntryTypes.Request);
    expect(firstEntry?.meta?.claims?.[ClaimsOrganizationSchemaorg.identifierValue])
      .toBe(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID);
    expect(controller?.publicKeyJwk)
      .toEqual(controllerBinding.publicKeyJwk);
    expect(representative?.email)
      .toBe(EXAMPLE_EMAIL_CONTROLLER_ORG);
    expect(firstEntry?.resource?.verification?.resourceType).toBe('contract');
    expect((bundle as any).attachments?.[0]?.data?.links?.[0]).toBe(EXAMPLE_SIGNED_TERMS_PDF_URL);
  });
});
