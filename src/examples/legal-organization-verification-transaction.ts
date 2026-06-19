// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  ClaimsOrganizationSchemaorg,
  ClaimsPersonSchemaorg,
  ClaimsServiceSchemaorg,
} from '../constants/schemaorg';
import {
  serializeServiceCapabilityTokens,
  ServiceCapability,
} from '../constants/service-capabilities';
import {
  buildLegalOrganizationVerificationTransactionBundle,
  type LegalOrganizationVerificationTransactionController,
} from '../utils/legal-organization-verification-transaction';
import {
  EXAMPLE_CONTROLLER_BINDING,
  EXAMPLE_EMAIL_CONTROLLER_ORG,
  EXAMPLE_JURISDICTION,
  EXAMPLE_ORGANIZATION_LEGAL_NAME,
  EXAMPLE_LEGAL_ORGANIZATION_TAX_ID,
  EXAMPLE_SECTOR,
  EXAMPLE_SIGNED_TERMS_PDF_URL,
  EXAMPLE_TENANT_SERVICE_DID,
} from './shared';

/**
 * Canonical host-onboarding transaction example for the new ICA verification
 * first step.
 *
 * Why this exists:
 * - BFF/portal integrations need one stable example of the GW CORE request
 *   that wraps an ICA `_verify`
 * - the example keeps the controller business binding separate from any
 *   technical DIDComm communication key
 *
 * Contract note:
 * - the same request must already declare the requested tenant service
 *   capabilities because GW uses them to prepare the pending Offer that the
 *   client will later confirm via `Order/_batch`
 */
const exampleControllerBinding: LegalOrganizationVerificationTransactionController = {
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

export const EXAMPLE_LEGAL_ORGANIZATION_VERIFICATION_TRANSACTION_BUNDLE =
  buildLegalOrganizationVerificationTransactionBundle({
    claims: {
      '@context': 'org.schema',
      [ClaimsOrganizationSchemaorg.legalName]: EXAMPLE_ORGANIZATION_LEGAL_NAME,
      [ClaimsOrganizationSchemaorg.identifierType]: 'taxID',
      [ClaimsOrganizationSchemaorg.identifierValue]: EXAMPLE_LEGAL_ORGANIZATION_TAX_ID,
      [ClaimsOrganizationSchemaorg.taxId]: EXAMPLE_LEGAL_ORGANIZATION_TAX_ID,
      [ClaimsOrganizationSchemaorg.addressCountry]: EXAMPLE_JURISDICTION,
      [ClaimsPersonSchemaorg.email]: EXAMPLE_EMAIL_CONTROLLER_ORG,
      [ClaimsServiceSchemaorg.category]: EXAMPLE_SECTOR,
      [ClaimsServiceSchemaorg.identifier]: EXAMPLE_TENANT_SERVICE_DID,
      [ClaimsServiceSchemaorg.url]: `https://operator.example.net/acme/cds-${String(EXAMPLE_JURISDICTION).toLowerCase()}/v1/${EXAMPLE_SECTOR}`,
      [ClaimsServiceSchemaorg.serviceType]: serializeServiceCapabilityTokens([
        ServiceCapability.IndexProvider,
        ServiceCapability.DigitalTwinReader,
      ]),
    },
    controller: exampleControllerBinding,
    organization: {
      did: EXAMPLE_TENANT_SERVICE_DID,
      publicKeyJwk: {
        kid: 'organization-signing-es384-001',
        kty: 'EC',
        crv: 'P-384',
        x: '<organization-sign-x>',
        y: '<organization-sign-y>',
        alg: 'ES384',
        use: 'sig',
      },
    },
    legalRepresentativePayload: {
      email: EXAMPLE_EMAIL_CONTROLLER_ORG,
    },
    verification: {
      resourceType: 'contract',
    },
    attachments: [{
      id: 'signed-terms-pdf-001',
      media_type: 'application/pdf',
      data: {
        links: [EXAMPLE_SIGNED_TERMS_PDF_URL],
      },
    }],
  });
