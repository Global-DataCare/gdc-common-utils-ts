// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import {
  ActivationCredentialTypes,
  W3cCredentialContexts,
  W3cCredentialTypes,
} from '../constants/verifiable-credentials';
import { UrnPrefixes } from '../constants/urn';

/**
 * Shared synthetic ICA activation-proof fixtures reused by docs/tests.
 *
 * Contract note:
 * - presentation signer/audience ids, VC subtype names, and representative
 *   binding fields must be imported from this module instead of re-hardcoded
 *   inline
 * - the representative `hasCredential.material` shape below reflects the
 *   current `activation-policy` helper contract; if ICA finalizes a different
 *   VC shape, update this module first and then the dependent helpers/tests
 *
 * Modeling note:
 * - this onboarding example intentionally anchors the business subject on the
 *   organization tax ID rather than on a pre-existing provider DID
 * - the VP envelope uses a synthetic RFC 7638-style JWK-thumbprint urn and a
 *   host id, which better matches the initial registration stage than a
 *   synthetic did:web
 */
export const EXAMPLE_PRESENTATION_SIGNER_KEY_ID =
  `${UrnPrefixes.JwkThumbprintSha256KeyId}Q0ZfM0V4YW1wbGVUaHVtYnByaW50X2Jhc2U2NHVybA` as const;
export const EXAMPLE_PRESENTATION_AUDIENCE_HOST_ID = 'host:node-operator-es' as const;
export const EXAMPLE_ORGANIZATION_TAX_ID = 'ESB00112233' as const;
export const EXAMPLE_REPRESENTATIVE_ROLE_CODE = 'RESPRSN' as const;
export const EXAMPLE_REPRESENTATIVE_BINDING_MATERIAL =
  EXAMPLE_PRESENTATION_SIGNER_KEY_ID;
export const EXAMPLE_ORGANIZATION_ID = EXAMPLE_ORGANIZATION_TAX_ID;
export const EXAMPLE_REPRESENTATIVE_KEY_ID = EXAMPLE_PRESENTATION_SIGNER_KEY_ID;

export const EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL = Object.freeze({
  '@context': [W3cCredentialContexts.V2, 'https://schema.org'],
  type: [
    W3cCredentialTypes.VerifiableCredential,
    ActivationCredentialTypes.OrganizationCredential,
  ],
  credentialSubject: {
    id: EXAMPLE_ORGANIZATION_ID,
    taxID: EXAMPLE_ORGANIZATION_TAX_ID,
  },
});

export const EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL = Object.freeze({
  '@context': [W3cCredentialContexts.V2, 'https://schema.org'],
  type: [
    W3cCredentialTypes.VerifiableCredential,
    ActivationCredentialTypes.LegalRepresentativeCredential,
  ],
  credentialSubject: {
    id: EXAMPLE_REPRESENTATIVE_KEY_ID,
    memberOf: {
      taxID: EXAMPLE_ORGANIZATION_TAX_ID,
    },
    hasOccupation: {
      identifier: {
        value: EXAMPLE_REPRESENTATIVE_ROLE_CODE,
      },
    },
    hasCredential: {
      material: EXAMPLE_REPRESENTATIVE_BINDING_MATERIAL,
    },
  },
});

export const EXAMPLE_ORG_ACTIVATION_PROOF_VP_PAYLOAD = Object.freeze({
  iss: EXAMPLE_PRESENTATION_SIGNER_KEY_ID,
  sub: EXAMPLE_ORGANIZATION_TAX_ID,
  aud: EXAMPLE_PRESENTATION_AUDIENCE_HOST_ID,
  vp: {
    '@context': [W3cCredentialContexts.V1],
    type: [W3cCredentialTypes.VerifiablePresentation],
    holder: EXAMPLE_PRESENTATION_SIGNER_KEY_ID,
    verifiableCredential: [
      JSON.stringify(EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL),
      JSON.stringify(EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL),
    ],
  },
});
