// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import {
  ActivationCredentialTypes,
  W3cCredentialContexts,
  W3cCredentialTypes,
} from '../constants/verifiable-credentials';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { DataspaceSectors } from '../constants/sectors';
import { IssueSeverity, IssueType } from '../models/issue';
import {
  EXAMPLE_DEFAULT_ICA_DID,
  EXAMPLE_BUNDLE_RESOURCE_TYPE,
  EXAMPLE_PROVIDER_DOMAIN,
  EXAMPLE_PROVIDER_LEGAL_NAME,
  EXAMPLE_PROVIDER_TAX_ID,
  EXAMPLE_TENANT_SERVICE_DID,
} from './shared';
import {
  EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
  EXAMPLE_REPRESENTATIVE_IDENTIFIER,
  EXAMPLE_REPRESENTATIVE_SAME_AS,
  EXAMPLE_REPRESENTATIVE_SUBJECT_URN,
} from './ica-activation-proof';

/**
 * Minimal DIDComm bundle attachment example shape reused by ICA response fixtures.
 */
export interface IcaVerifyResponseExampleAttachment {
  id: string;
  format: string;
  media_type: string;
  filename: string;
  data: {
    json: {
      format: string;
      jwt: string;
    };
  };
}

/**
 * Minimal OperationOutcome issue example shape reused by ICA response fixtures.
 */
export interface IcaVerifyResponseExampleIssue {
  severity: 'information' | 'warning' | 'error' | 'fatal';
  code: string;
  diagnostics: string;
}

/**
 * Minimal OperationOutcome example shape reused by ICA response fixtures.
 */
export interface IcaVerifyResponseExampleOutcome {
  resourceType: typeof EXAMPLE_VERIFY_RESPONSE_OPERATION_OUTCOME_RESOURCE_TYPE;
  issue: IcaVerifyResponseExampleIssue[];
}

/**
 * Canonical example of the `_verify-response` DIDComm payload emitted by ICA.
 *
 * This example is intentionally transport-neutral and reusable by:
 * - Swagger/OpenAPI examples
 * - SDK unit tests
 * - portal/BFF documentation
 *
 * Contract notes:
 * - `body.data[0]` carries the organization credential plus optional generated
 *   organization signing keypair
 * - `body.data[1]` carries the legal representative credential plus the
 *   controller binding public key
 * - `credentialSubject.sameAs` expresses public identity continuity
 * - `credentialSubject.hasCredential.material` expresses controller
 *   signing/binding key continuity as an RFC 9278 JWK-thumbprint URN
 */
export interface IcaVerifyTermsResponseExample {
  jti: string;
  iss: string;
  aud: string;
  thid: string;
  type: string;
  attachments: IcaVerifyResponseExampleAttachment[];
  body: {
    resourceType: typeof EXAMPLE_BUNDLE_RESOURCE_TYPE;
    type: typeof EXAMPLE_VERIFY_RESPONSE_BATCH_RESPONSE_TYPE;
    total: number;
    issues: IcaVerifyResponseExampleOutcome;
    data: Array<Record<string, unknown>>;
  };
}

export const EXAMPLE_VERIFY_RESPONSE_OPERATION_OUTCOME_RESOURCE_TYPE = 'OperationOutcome' as const;
export const EXAMPLE_VERIFY_RESPONSE_BATCH_RESPONSE_TYPE = 'batch-response' as const;
export const EXAMPLE_VERIFY_RESPONSE_SCHEMA_ORG_CONTEXT = 'https://schema.org' as const;
export const EXAMPLE_VERIFY_RESPONSE_PERSON_TYPE = 'Person' as const;
export const EXAMPLE_VERIFY_RESPONSE_ORGANIZATION_TYPE = ResourceTypesFhirR4.Organization;
export const EXAMPLE_VERIFY_RESPONSE_JTI = 'urn:uuid:verify-resp-001' as const;
export const EXAMPLE_VERIFY_RESPONSE_THID = 'verify-terms-001' as const;
export const EXAMPLE_VERIFY_RESPONSE_BUNDLE_TYPE = 'application/bundle-api+json' as const;
export const EXAMPLE_VERIFY_RESPONSE_DATE = '2026-03-12T21:12:26.646Z' as const;
export const EXAMPLE_VERIFY_RESPONSE_PROOF_DATE = '2026-03-12T21:12:57.534Z' as const;
export const EXAMPLE_VERIFY_RESPONSE_VERSION_ID = 'zPdfVersionHash001' as const;
export const EXAMPLE_VERIFY_RESPONSE_ORG_VC_ID = 'urn:uuid:org-vc-001' as const;
export const EXAMPLE_VERIFY_RESPONSE_PERSON_VC_ID = 'urn:uuid:person-vc-001' as const;
export const EXAMPLE_VERIFY_RESPONSE_ORG_ENTRY_TYPE = 'Organization-verification-v1.0' as const;
export const EXAMPLE_VERIFY_RESPONSE_PERSON_ENTRY_TYPE = 'LegalRepresentative-verification-v1.0' as const;
export const EXAMPLE_VERIFY_RESPONSE_ORG_ATTACHMENT_ID = 'vc-jwt-1' as const;
export const EXAMPLE_VERIFY_RESPONSE_PERSON_ATTACHMENT_ID = 'vc-jwt-2' as const;
export const EXAMPLE_VERIFY_RESPONSE_ORG_ATTACHMENT_FILENAME = 'Organization-verification-v1.0-1.jwt' as const;
export const EXAMPLE_VERIFY_RESPONSE_PERSON_ATTACHMENT_FILENAME = 'LegalRepresentative-verification-v1.0-2.jwt' as const;
export const EXAMPLE_VERIFY_RESPONSE_ORG_JWT = '<vc-jwt-organization>' as const;
export const EXAMPLE_VERIFY_RESPONSE_PERSON_JWT = '<vc-jwt-legal-representative>' as const;
export const EXAMPLE_VERIFY_RESPONSE_MEDIA_TYPE = 'application/vc+jwt' as const;
export const EXAMPLE_VERIFY_RESPONSE_ATTACHMENT_FORMAT = 'vc+jwt' as const;
export const EXAMPLE_VERIFY_RESPONSE_STATUS_OK = '200' as const;
export const EXAMPLE_VERIFY_RESPONSE_ORG_KID = 'org-es384-001' as const;
export const EXAMPLE_VERIFY_RESPONSE_PERSON_KID = 'controller-es384-001' as const;
export const EXAMPLE_VERIFY_RESPONSE_ORG_DID =
  'did:web:globaldatacare.es:onehealth:organization:taxid:VATES-B00112233' as const;
export const EXAMPLE_VERIFY_RESPONSE_PERSON_NAME = 'Alex Example' as const;
export const EXAMPLE_VERIFY_RESPONSE_PERSON_GIVEN_NAME = 'Alex' as const;
export const EXAMPLE_VERIFY_RESPONSE_PERSON_FAMILY_NAME = 'Example' as const;
export const EXAMPLE_VERIFY_RESPONSE_PERSON_NATIONALITY = 'ES' as const;
export const EXAMPLE_VERIFY_RESPONSE_PERSON_ADDITIONAL_TYPE = 'ES384' as const;
export const EXAMPLE_VERIFY_RESPONSE_PERSON_ALTERNATE_NAME = EXAMPLE_VERIFY_RESPONSE_PERSON_KID;
export const EXAMPLE_VERIFY_RESPONSE_ORG_ADDITIONAL_TYPE =
  'sector=onehealth;section=dataprovider;kind=clinic;action=_index-provider,_research-provider' as const;
export const EXAMPLE_VERIFY_RESPONSE_ADDRESS_TYPE = 'PostalAddress' as const;
export const EXAMPLE_VERIFY_RESPONSE_ADDRESS_COUNTRY = 'ES' as const;
export const EXAMPLE_VERIFY_RESPONSE_OCCUPATION_TYPE = 'Occupation' as const;
export const EXAMPLE_VERIFY_RESPONSE_OCCUPATION_NAME = 'LegalRepresentative' as const;
export const EXAMPLE_VERIFY_RESPONSE_OCCUPATION_IDENTIFIER = 'urn:ilo:ilostat:isco-08:1120' as const;
export const EXAMPLE_VERIFY_RESPONSE_PROOF_TYPE = 'JsonWebSignature2020' as const;
export const EXAMPLE_VERIFY_RESPONSE_PROOF_PURPOSE = 'assertionMethod' as const;
export const EXAMPLE_VERIFY_RESPONSE_PROOF_VERIFICATION_METHOD =
  'did:web:localhost%3A3310#verification-key-001' as const;
export const EXAMPLE_VERIFY_RESPONSE_ORG_PROOF_JWS = '<detached-jws-organization-truncated>' as const;
export const EXAMPLE_VERIFY_RESPONSE_PERSON_PROOF_JWS = '<detached-jws-person-truncated>' as const;

/**
 * Shared success outcome reused at bundle level and item level.
 */
export const EXAMPLE_VERIFY_RESPONSE_SUCCESS_OUTCOME: IcaVerifyResponseExampleOutcome = {
  resourceType: EXAMPLE_VERIFY_RESPONSE_OPERATION_OUTCOME_RESOURCE_TYPE,
  issue: [
    {
      severity: IssueSeverity.Information,
      code: IssueType.Informational,
      diagnostics: 'Verification completed.',
    },
  ],
};

export const EXAMPLE_VERIFY_RESPONSE_ORG_ITEM_OUTCOME: IcaVerifyResponseExampleOutcome = {
  resourceType: EXAMPLE_VERIFY_RESPONSE_OPERATION_OUTCOME_RESOURCE_TYPE,
  issue: [
    {
      severity: IssueSeverity.Information,
      code: IssueType.Informational,
      diagnostics: 'Organization credential extracted from verified document.',
    },
  ],
};

export const EXAMPLE_VERIFY_RESPONSE_PERSON_ITEM_OUTCOME: IcaVerifyResponseExampleOutcome = {
  resourceType: EXAMPLE_VERIFY_RESPONSE_OPERATION_OUTCOME_RESOURCE_TYPE,
  issue: [
    {
      severity: IssueSeverity.Information,
      code: IssueType.Informational,
      diagnostics: 'Legal representative credential extracted from verified document.',
    },
  ],
};

export const EXAMPLE_VERIFY_RESPONSE_ORG_PUBLIC_KEY_JWK = Object.freeze({
  kty: 'EC',
  crv: 'P-384',
  x: 'org-pub-x',
  y: 'org-pub-y',
  alg: 'ES384',
  kid: EXAMPLE_VERIFY_RESPONSE_ORG_KID,
});

export const EXAMPLE_VERIFY_RESPONSE_ORG_PRIVATE_KEY_JWK = Object.freeze({
  ...EXAMPLE_VERIFY_RESPONSE_ORG_PUBLIC_KEY_JWK,
  d: 'org-priv-d',
});

export const EXAMPLE_VERIFY_RESPONSE_PERSON_PUBLIC_KEY_JWK = Object.freeze({
  kty: 'EC',
  crv: 'P-384',
  x: 'controller-x',
  y: 'controller-y',
  alg: 'ES384',
  kid: EXAMPLE_VERIFY_RESPONSE_PERSON_KID,
});

export const EXAMPLE_VERIFY_RESPONSE_ORG_AUTHORIZED_CATEGORY = DataspaceSectors.HealthCare;

export const EXAMPLE_VERIFY_RESPONSE_ORG_CREDENTIAL = Object.freeze({
  id: EXAMPLE_VERIFY_RESPONSE_ORG_VC_ID,
  '@context': [W3cCredentialContexts.V2, EXAMPLE_VERIFY_RESPONSE_SCHEMA_ORG_CONTEXT],
  type: [W3cCredentialTypes.VerifiableCredential, ActivationCredentialTypes.OrganizationCredential],
  issuer: EXAMPLE_DEFAULT_ICA_DID,
  validFrom: EXAMPLE_VERIFY_RESPONSE_DATE,
  meta: {
    versionId: EXAMPLE_VERIFY_RESPONSE_VERSION_ID,
  },
  credentialSubject: {
    id: EXAMPLE_VERIFY_RESPONSE_ORG_DID,
    '@type': EXAMPLE_VERIFY_RESPONSE_ORGANIZATION_TYPE,
    legalName: EXAMPLE_PROVIDER_LEGAL_NAME,
    taxID: EXAMPLE_PROVIDER_TAX_ID,
    sameAs: EXAMPLE_TENANT_SERVICE_DID,
    url: EXAMPLE_PROVIDER_DOMAIN,
    alternateName: 'example-provider',
    additionalType: EXAMPLE_VERIFY_RESPONSE_ORG_ADDITIONAL_TYPE,
    makesOffer: {
      '@type': 'Offer',
      category: EXAMPLE_VERIFY_RESPONSE_ORG_AUTHORIZED_CATEGORY,
    },
    address: {
      '@type': EXAMPLE_VERIFY_RESPONSE_ADDRESS_TYPE,
      addressCountry: EXAMPLE_VERIFY_RESPONSE_ADDRESS_COUNTRY,
    },
  },
  evidence: [],
  proof: {
    type: EXAMPLE_VERIFY_RESPONSE_PROOF_TYPE,
    created: EXAMPLE_VERIFY_RESPONSE_PROOF_DATE,
    proofPurpose: EXAMPLE_VERIFY_RESPONSE_PROOF_PURPOSE,
    verificationMethod: EXAMPLE_VERIFY_RESPONSE_PROOF_VERIFICATION_METHOD,
    jws: EXAMPLE_VERIFY_RESPONSE_ORG_PROOF_JWS,
  },
});

export const EXAMPLE_VERIFY_RESPONSE_PERSON_CREDENTIAL = Object.freeze({
  id: EXAMPLE_VERIFY_RESPONSE_PERSON_VC_ID,
  '@context': [W3cCredentialContexts.V2, EXAMPLE_VERIFY_RESPONSE_SCHEMA_ORG_CONTEXT],
  type: [
    W3cCredentialTypes.VerifiableCredential,
    ActivationCredentialTypes.PersonCredential,
    ActivationCredentialTypes.LegalRepresentativeCredential,
  ],
  issuer: EXAMPLE_DEFAULT_ICA_DID,
  validFrom: EXAMPLE_VERIFY_RESPONSE_DATE,
  meta: {
    versionId: EXAMPLE_VERIFY_RESPONSE_VERSION_ID,
  },
  credentialSubject: {
    id: EXAMPLE_REPRESENTATIVE_SUBJECT_URN,
    '@type': EXAMPLE_VERIFY_RESPONSE_PERSON_TYPE,
    name: EXAMPLE_VERIFY_RESPONSE_PERSON_NAME,
    givenName: EXAMPLE_VERIFY_RESPONSE_PERSON_GIVEN_NAME,
    familyName: EXAMPLE_VERIFY_RESPONSE_PERSON_FAMILY_NAME,
    identifier: EXAMPLE_REPRESENTATIVE_IDENTIFIER,
    nationality: EXAMPLE_VERIFY_RESPONSE_PERSON_NATIONALITY,
    sameAs: EXAMPLE_REPRESENTATIVE_SAME_AS,
    hasCredential: {
      material: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
    },
    hasOccupation: {
      '@type': EXAMPLE_VERIFY_RESPONSE_OCCUPATION_TYPE,
      name: EXAMPLE_VERIFY_RESPONSE_OCCUPATION_NAME,
      identifier: EXAMPLE_VERIFY_RESPONSE_OCCUPATION_IDENTIFIER,
    },
    memberOf: {
      '@type': EXAMPLE_VERIFY_RESPONSE_ORGANIZATION_TYPE,
      legalName: EXAMPLE_PROVIDER_LEGAL_NAME,
      taxID: EXAMPLE_PROVIDER_TAX_ID,
    },
    alternateName: EXAMPLE_VERIFY_RESPONSE_PERSON_ALTERNATE_NAME,
    additionalType: EXAMPLE_VERIFY_RESPONSE_PERSON_ADDITIONAL_TYPE,
  },
  evidence: [],
  proof: {
    type: EXAMPLE_VERIFY_RESPONSE_PROOF_TYPE,
    created: EXAMPLE_VERIFY_RESPONSE_PROOF_DATE,
    proofPurpose: EXAMPLE_VERIFY_RESPONSE_PROOF_PURPOSE,
    verificationMethod: EXAMPLE_VERIFY_RESPONSE_PROOF_VERIFICATION_METHOD,
    jws: EXAMPLE_VERIFY_RESPONSE_PERSON_PROOF_JWS,
  },
});

export const EXAMPLE_VERIFY_RESPONSE_ORG_ATTACHMENT: IcaVerifyResponseExampleAttachment = Object.freeze({
  id: EXAMPLE_VERIFY_RESPONSE_ORG_ATTACHMENT_ID,
  format: EXAMPLE_VERIFY_RESPONSE_ATTACHMENT_FORMAT,
  media_type: EXAMPLE_VERIFY_RESPONSE_MEDIA_TYPE,
  filename: EXAMPLE_VERIFY_RESPONSE_ORG_ATTACHMENT_FILENAME,
  data: {
    json: {
      format: EXAMPLE_VERIFY_RESPONSE_ATTACHMENT_FORMAT,
      jwt: EXAMPLE_VERIFY_RESPONSE_ORG_JWT,
    },
  },
});

export const EXAMPLE_VERIFY_RESPONSE_PERSON_ATTACHMENT: IcaVerifyResponseExampleAttachment = Object.freeze({
  id: EXAMPLE_VERIFY_RESPONSE_PERSON_ATTACHMENT_ID,
  format: EXAMPLE_VERIFY_RESPONSE_ATTACHMENT_FORMAT,
  media_type: EXAMPLE_VERIFY_RESPONSE_MEDIA_TYPE,
  filename: EXAMPLE_VERIFY_RESPONSE_PERSON_ATTACHMENT_FILENAME,
  data: {
    json: {
      format: EXAMPLE_VERIFY_RESPONSE_ATTACHMENT_FORMAT,
      jwt: EXAMPLE_VERIFY_RESPONSE_PERSON_JWT,
    },
  },
});

/**
 * Canonical `_verify-response` success example shared across ICA repos.
 */
export const EXAMPLE_ICA_VERIFY_TERMS_RESPONSE_SUCCESS: IcaVerifyTermsResponseExample = {
  jti: EXAMPLE_VERIFY_RESPONSE_JTI,
  iss: EXAMPLE_DEFAULT_ICA_DID,
  aud: EXAMPLE_DEFAULT_ICA_DID,
  thid: EXAMPLE_VERIFY_RESPONSE_THID,
  type: EXAMPLE_VERIFY_RESPONSE_BUNDLE_TYPE,
  attachments: [
    EXAMPLE_VERIFY_RESPONSE_ORG_ATTACHMENT,
    EXAMPLE_VERIFY_RESPONSE_PERSON_ATTACHMENT,
  ],
  body: {
    resourceType: EXAMPLE_BUNDLE_RESOURCE_TYPE,
    type: EXAMPLE_VERIFY_RESPONSE_BATCH_RESPONSE_TYPE,
    total: 2,
    issues: EXAMPLE_VERIFY_RESPONSE_SUCCESS_OUTCOME,
    data: [
      {
        type: EXAMPLE_VERIFY_RESPONSE_ORG_ENTRY_TYPE,
        publicKeyJwk: EXAMPLE_VERIFY_RESPONSE_ORG_PUBLIC_KEY_JWK,
        privateKeyJwk: EXAMPLE_VERIFY_RESPONSE_ORG_PRIVATE_KEY_JWK,
        keySource: 'generated',
        response: {
          status: EXAMPLE_VERIFY_RESPONSE_STATUS_OK,
          outcome: EXAMPLE_VERIFY_RESPONSE_ORG_ITEM_OUTCOME,
        },
        resource: EXAMPLE_VERIFY_RESPONSE_ORG_CREDENTIAL,
      },
      {
        type: EXAMPLE_VERIFY_RESPONSE_PERSON_ENTRY_TYPE,
        publicKeyJwk: EXAMPLE_VERIFY_RESPONSE_PERSON_PUBLIC_KEY_JWK,
        response: {
          status: EXAMPLE_VERIFY_RESPONSE_STATUS_OK,
          outcome: EXAMPLE_VERIFY_RESPONSE_PERSON_ITEM_OUTCOME,
        },
        resource: EXAMPLE_VERIFY_RESPONSE_PERSON_CREDENTIAL,
      },
    ],
  },
};

/**
 * Returns a detached deep clone of the canonical ICA `_verify-response`
 * success example so tests/docs can tweak fields without mutating the shared
 * frozen baseline.
 */
export function cloneIcaVerifyTermsResponseSuccessExample(): IcaVerifyTermsResponseExample {
  return JSON.parse(JSON.stringify(EXAMPLE_ICA_VERIFY_TERMS_RESPONSE_SUCCESS)) as IcaVerifyTermsResponseExample;
}
