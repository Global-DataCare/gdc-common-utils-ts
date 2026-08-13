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
      authorizationCredential: {
        '@context': ['https://www.w3.org/ns/credentials/v2'],
        id: 'urn:uuid:authorization-1',
        type: ['VerifiableCredential', 'OrganizationRegistrationAuthorizationCredential'],
        issuer: 'did:web:issuer.example',
        credentialSubject: { id: 'did:web:host.example:organization' },
        validFrom: '2026-08-10T00:00:00.000Z',
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
    expect(firstEntry?.resource?.meta?.claims?.[ClaimsOrganizationSchemaorg.identifierValue])
      .toBe(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID);
    expect(firstEntry?.meta).toBeUndefined();
    expect(controller?.publicKeyJwk)
      .toEqual(controllerBinding.publicKeyJwk);
    expect(representative?.email)
      .toBe(EXAMPLE_EMAIL_CONTROLLER_ORG);
    expect(firstEntry?.resource?.verification?.resourceType).toBe('contract');
    expect(firstEntry?.resource?.authorizationCredential?.id).toBe('urn:uuid:authorization-1');
    expect((bundle as any).attachments?.[0]?.data?.links?.[0]).toBe(EXAMPLE_SIGNED_TERMS_PDF_URL);
  });
});
