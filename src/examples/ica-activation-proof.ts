// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import {
  ActivationCredentialTypes,
  W3cCredentialContexts,
  W3cCredentialTypes,
} from '../constants/verifiable-credentials';

/**
 * Shared synthetic ICA activation-proof fixtures reused by docs/tests.
 *
 * Contract note:
 * - issuer/holder/audience DIDs, VC subtype names, and representative binding
 *   fields must be imported from this module instead of re-hardcoded inline
 * - the representative `hasCredential.material` shape below reflects the
 *   current `activation-policy` helper contract; if ICA finalizes a different
 *   VC shape, update this module first and then the dependent helpers/tests
 */
export const EXAMPLE_ICA_VP_ISSUER_DID = 'did:web:controller.example.org' as const;
export const EXAMPLE_ICA_VP_AUDIENCE_DID = 'did:web:host.example.com' as const;
export const EXAMPLE_ICA_VP_HOLDER_DID = EXAMPLE_ICA_VP_ISSUER_DID;
export const EXAMPLE_ICA_ORGANIZATION_DID = 'did:web:org.example.org' as const;
export const EXAMPLE_ICA_REPRESENTATIVE_DID = 'did:web:rep.example.org' as const;
export const EXAMPLE_ICA_ORGANIZATION_TAX_ID = 'ESB00112233' as const;
export const EXAMPLE_ICA_REPRESENTATIVE_ROLE_CODE = 'RESPRSN' as const;
export const EXAMPLE_ICA_REPRESENTATIVE_BINDING_MATERIAL = 'controller-sig-kid' as const;

export const EXAMPLE_ICA_ORGANIZATION_CREDENTIAL = Object.freeze({
  '@context': [W3cCredentialContexts.V2, 'https://schema.org'],
  type: [
    W3cCredentialTypes.VerifiableCredential,
    ActivationCredentialTypes.OrganizationCredential,
  ],
  credentialSubject: {
    id: EXAMPLE_ICA_ORGANIZATION_DID,
    taxID: EXAMPLE_ICA_ORGANIZATION_TAX_ID,
  },
});

export const EXAMPLE_ICA_LEGAL_REPRESENTATIVE_CREDENTIAL = Object.freeze({
  '@context': [W3cCredentialContexts.V2, 'https://schema.org'],
  type: [
    W3cCredentialTypes.VerifiableCredential,
    ActivationCredentialTypes.LegalRepresentativeCredential,
  ],
  credentialSubject: {
    id: EXAMPLE_ICA_REPRESENTATIVE_DID,
    memberOf: {
      taxID: EXAMPLE_ICA_ORGANIZATION_TAX_ID,
    },
    hasOccupation: {
      identifier: {
        value: EXAMPLE_ICA_REPRESENTATIVE_ROLE_CODE,
      },
    },
    hasCredential: {
      material: EXAMPLE_ICA_REPRESENTATIVE_BINDING_MATERIAL,
    },
  },
});

export const EXAMPLE_ICA_ACTIVATION_VP_PAYLOAD = Object.freeze({
  iss: EXAMPLE_ICA_VP_ISSUER_DID,
  sub: EXAMPLE_ICA_VP_ISSUER_DID,
  aud: EXAMPLE_ICA_VP_AUDIENCE_DID,
  vp: {
    '@context': [W3cCredentialContexts.V1],
    type: [W3cCredentialTypes.VerifiablePresentation],
    holder: EXAMPLE_ICA_VP_HOLDER_DID,
    verifiableCredential: [
      JSON.stringify(EXAMPLE_ICA_ORGANIZATION_CREDENTIAL),
      JSON.stringify(EXAMPLE_ICA_LEGAL_REPRESENTATIVE_CREDENTIAL),
    ],
  },
});
