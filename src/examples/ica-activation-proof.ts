// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import {
  ActivationCredentialTypes,
  W3cCredentialContexts,
  W3cCredentialTypes,
} from '../constants/verifiable-credentials';
import { UrnPrefixes } from '../constants/urn';
import { ServiceCapability } from '../constants/service-capabilities';
import { DataspaceSectors } from '../constants/sectors';

/**
 * Shared synthetic ICA activation-proof fixtures reused by docs/tests.
 *
 * Contract note:
 * - controller-signing/audience ids and VC subtype names must be imported from
 *   this module instead of re-hardcoded
 *   inline
 * - the representative VC carries the legal occupation, while the separate
 *   service-controller VC carries `RESPRSN`, the technical ISCO occupation and the
 *   controller key binding
 *
 * Modeling note:
 * - this onboarding example intentionally anchors the business subject on the
 *   organization tax ID rather than on a pre-existing provider DID
 * - the VP envelope uses a synthetic RFC 7638-style JWK-thumbprint urn and a
 *   host id, which better matches the initial registration stage than a
 *   synthetic did:web
 */
/**
 * Synthetic JWK-thumbprint-based signing key id for the organization
 * controller who signs the initial legal-onboarding VP.
 */
export const EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID =
  `${UrnPrefixes.JwkThumbprintSha256KeyId}Q0ZfM0V4YW1wbGVUaHVtYnByaW50X2Jhc2U2NHVybA` as const;
export const EXAMPLE_PRESENTATION_AUDIENCE_HOST_ID = 'host:node-operator-es' as const;
export const EXAMPLE_ORGANIZATION_TAX_ID = 'ESB00112233' as const;
export const EXAMPLE_REPRESENTATIVE_ROLE_CODE = 'RESPRSN' as const;
export const EXAMPLE_LEGAL_REPRESENTATIVE_ISCO_CODE = '1120' as const;
export const EXAMPLE_TECHNICAL_CONTROLLER_ISCO_CODE = '1330' as const;
export const EXAMPLE_REPRESENTATIVE_IDENTIFIER = 'IDCES-99999999R' as const;
export const EXAMPLE_REPRESENTATIVE_EMAIL = 'legal.rep@example.org' as const;
export const EXAMPLE_REPRESENTATIVE_SUBJECT_URN =
  `urn:person:identifier:${EXAMPLE_REPRESENTATIVE_IDENTIFIER}` as const;
export const EXAMPLE_REPRESENTATIVE_SAME_AS = 'urn:multibase:zControllerHash' as const;
export const EXAMPLE_ORG_ACTIVATION_ORGANIZATION_DID =
  'did:web:provider.example:health-care:organization:taxid:VATES-ESB00112233' as const;
export const EXAMPLE_ORGANIZATION_ID = EXAMPLE_ORGANIZATION_TAX_ID;
export const EXAMPLE_ACTIVATION_AUTHORIZED_CATEGORY = DataspaceSectors.HealthCare;
export const EXAMPLE_ACTIVATION_AUTHORIZED_SERVICE_TYPE = ServiceCapability.IndexProvider;
export const EXAMPLE_HOST_ACTIVATION_AUTHORIZED_CATEGORY = 'system' as const;
export const EXAMPLE_HOST_ACTIVATION_AUTHORIZED_SERVICE_TYPE = ServiceCapability.OrganizationRegistryProvider;

export const EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL = Object.freeze({
  '@context': [W3cCredentialContexts.V2, 'https://schema.org'],
  type: [
    W3cCredentialTypes.VerifiableCredential,
    ActivationCredentialTypes.OrganizationCredential,
  ],
  credentialSubject: {
    id: EXAMPLE_ORGANIZATION_ID,
    taxID: EXAMPLE_ORGANIZATION_TAX_ID,
    makesOffer: {
      category: EXAMPLE_ACTIVATION_AUTHORIZED_CATEGORY,
      serviceType: EXAMPLE_ACTIVATION_AUTHORIZED_SERVICE_TYPE,
    },
  },
});

export const EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL = Object.freeze({
  '@context': [W3cCredentialContexts.V2, 'https://schema.org'],
  type: [
    W3cCredentialTypes.VerifiableCredential,
    ActivationCredentialTypes.LegalRepresentativeCredential,
  ],
  credentialSubject: {
    id: EXAMPLE_REPRESENTATIVE_SUBJECT_URN,
    memberOf: {
      taxID: EXAMPLE_ORGANIZATION_TAX_ID,
    },
    hasOccupation: {
      '@type': 'Occupation',
      occupationalCategory: `ISCO-08|${EXAMPLE_LEGAL_REPRESENTATIVE_ISCO_CODE}`,
    },
    identifier: EXAMPLE_REPRESENTATIVE_IDENTIFIER,
    sameAs: EXAMPLE_REPRESENTATIVE_SAME_AS,
  },
});

export const EXAMPLE_ORG_ACTIVATION_CONTROLLER_CREDENTIAL = Object.freeze({
  '@context': [W3cCredentialContexts.V2, 'https://schema.org'],
  type: [
    W3cCredentialTypes.VerifiableCredential,
    ActivationCredentialTypes.ServiceControllerCredential,
  ],
  credentialSubject: {
    id: EXAMPLE_ORGANIZATION_ID,
    '@type': 'Service',
    serviceType: 'OrganizationControllerService',
    provider: { taxID: EXAMPLE_ORGANIZATION_TAX_ID },
    owner: {
      '@type': 'Person',
      additionalType: EXAMPLE_REPRESENTATIVE_ROLE_CODE,
      sameAs: EXAMPLE_REPRESENTATIVE_SAME_AS,
      hasOccupation: {
        '@type': 'Occupation',
        occupationalCategory: `ISCO-08|${EXAMPLE_TECHNICAL_CONTROLLER_ISCO_CODE}`,
      },
      hasCredential: { material: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID },
    },
  },
});

export const EXAMPLE_ORG_ACTIVATION_PROOF_VP_PAYLOAD = Object.freeze({
  iss: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
  sub: EXAMPLE_ORGANIZATION_TAX_ID,
  aud: EXAMPLE_PRESENTATION_AUDIENCE_HOST_ID,
  vp: {
    '@context': [W3cCredentialContexts.V1],
    type: [W3cCredentialTypes.VerifiablePresentation],
    holder: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
    verifiableCredential: [
      JSON.stringify(EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL),
      JSON.stringify(EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL),
      JSON.stringify(EXAMPLE_ORG_ACTIVATION_CONTROLLER_CREDENTIAL),
    ],
  },
});
