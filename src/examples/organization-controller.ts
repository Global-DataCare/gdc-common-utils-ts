// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import {
  ClaimsOrganizationSchemaorg,
  ClaimsPersonSchemaorg,
  ClaimsServiceSchemaorg,
} from '../constants/schemaorg';
import {
  ServiceCapabilityToken,
  serializeServiceCapabilityTokens,
} from '../constants/service-capabilities';
import {
  EXAMPLE_CONTROLLER_BINDING,
  EXAMPLE_DEVICE_CLIENT_ID,
  EXAMPLE_EMAIL_CONTROLLER_ORG,
  EXAMPLE_EMPLOYEE_ACTIVATION_CODE,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_RECEPTIONIST,
  EXAMPLE_JURISDICTION,
  EXAMPLE_ORGANIZATION_CONTROLLER_ROLE,
  EXAMPLE_SECTOR,
  EXAMPLE_SERVICE_PUBLIC_DID,
} from './shared';

/**
 * Examples for organization-controller and host-onboarding flows.
 *
 * Contract note:
 * repeated synthetic DIDs, roles, and activation fixtures must come from
 * `./shared`, never be re-hardcoded inline in public example payloads.
 */

export const EXAMPLE_ACTIVATE_ORGANIZATION_FROM_ICA_PROOF_INPUT = {
  vpToken: '<ica-proof-token>',
  controller: EXAMPLE_CONTROLLER_BINDING,
  additionalClaims: {
    [ClaimsOrganizationSchemaorg.alternateName]: 'acme',
    [ClaimsOrganizationSchemaorg.legalName]: 'ACME HEALTH SL',
    [ClaimsOrganizationSchemaorg.identifierType]: 'taxID',
    [ClaimsOrganizationSchemaorg.identifierValue]: 'VATES-B00112233',
    [ClaimsOrganizationSchemaorg.addressCountry]: EXAMPLE_JURISDICTION,
    [ClaimsOrganizationSchemaorg.taxId]: 'VATES-B00112233',
    [ClaimsPersonSchemaorg.email]: EXAMPLE_EMAIL_CONTROLLER_ORG,
    [ClaimsPersonSchemaorg.hasOccupationalRoleValue]: EXAMPLE_ORGANIZATION_CONTROLLER_ROLE,
    [ClaimsServiceSchemaorg.category]: EXAMPLE_SECTOR,
    [ClaimsServiceSchemaorg.identifier]: EXAMPLE_SERVICE_PUBLIC_DID,
    [ClaimsServiceSchemaorg.url]: `https://operator.example.net/acme/cds-${String(EXAMPLE_JURISDICTION).toLowerCase()}/v1/${EXAMPLE_SECTOR}`,
    [ClaimsServiceSchemaorg.serviceType]: serializeServiceCapabilityTokens([
      ServiceCapabilityToken.IndexProvider,
      ServiceCapabilityToken.DigitalTwinReader,
    ]),
  },
} as const;

export const EXAMPLE_GW_ORGANIZATION_ACTIVATE_PAYLOAD = {
  vp_token: '<ica-proof-token>',
  controller: EXAMPLE_CONTROLLER_BINDING,
} as const;

export const EXAMPLE_GW_ORGANIZATION_ACTIVATE_ACCEPTED_RESPONSE = {
  submit: { status: 202, body: {} },
  poll: {
    status: 200,
    body: {
      data: [
        {
          type: 'Organization-activation-request-v1.0',
          response: { status: '200' },
        },
      ],
    },
    attempts: 1,
  },
} as const;

export const EXAMPLE_LEGAL_ORGANIZATION_ORDER_INPUT = {
  offerId: 'offer-123',
  jurisdiction: EXAMPLE_JURISDICTION,
  sector: EXAMPLE_SECTOR,
  timeoutSeconds: 12,
  intervalSeconds: 3,
} as const;

export const EXAMPLE_LEGAL_ORGANIZATION_ORDER_RESPONSE = {
  submit: { status: 202, body: {} },
  poll: { status: 200, body: {}, attempts: 1 },
} as const;

export const EXAMPLE_ORGANIZATION_EMPLOYEE_INPUT = {
  employeeClaims: {
    [ClaimsPersonSchemaorg.identifier]: 'urn:uuid:11b2c3d4-e5f6-7890-1234-567890abcdef',
    [ClaimsPersonSchemaorg.email]: 'receptionist1@acme.org',
    [ClaimsPersonSchemaorg.hasOccupationalRoleValue]: EXAMPLE_HEALTHCARE_ACTOR_ROLE_RECEPTIONIST,
  },
} as const;

export const EXAMPLE_LIVE_EMPLOYEE_INPUT = {
  employeeClaims: {
    '@context': 'org.schema',
    [ClaimsPersonSchemaorg.identifier]: 'urn:uuid:11b2c3d4-e5f6-7890-1234-567890abcdef',
    [ClaimsPersonSchemaorg.email]: EXAMPLE_EMAIL_CONTROLLER_ORG,
    [ClaimsPersonSchemaorg.hasOccupationalRoleValue]: EXAMPLE_ORGANIZATION_CONTROLLER_ROLE,
  },
} as const;

export const EXAMPLE_EMPLOYEE_DEVICE_ACTIVATION_INPUT = {
  activationCode: EXAMPLE_EMPLOYEE_ACTIVATION_CODE,
  idToken: 'employee-id-token-001',
  dcrPayload: {
    application_type: 'web',
  },
} as const;

export const EXAMPLE_EMPLOYEE_DEVICE_EXCHANGE_RESPONSE = {
  submit: { status: 202, body: {} },
  poll: { status: 200, body: { body: { initial_access_token: 'initial-access-001' } }, attempts: 1 },
} as const;

export const EXAMPLE_EMPLOYEE_DEVICE_DCR_RESPONSE = {
  submit: { status: 202, body: {} },
  poll: { status: 200, body: { body: { client_id: EXAMPLE_DEVICE_CLIENT_ID } }, attempts: 1 },
} as const;
