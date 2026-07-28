// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Examples for individual-controller and subject-index bootstrap flows.
 *
 * CORE canonical examples in this file avoid phone-specific subject/controller
 * fields unless the flow truly requires them. Telephone-driven notification or
 * consent targeting is treated as an extension concern (for example UNID GW),
 * not a CORE GW contract requirement.
 *
 * Semantic split:
 *
 * - these examples model the human controller as owner of the individual
 *   subject-index organization
 * - legal organization controller/representative examples belong instead to
 *   organization activation and VC/member semantics, not to `owner.*` claims
 */

import type {
  ExampleClinicalBundleSearchInput,
  ExampleLatestIpsSearchInput,
} from './shared';
import {
  EXAMPLE_CONTROLLER_DID,
  EXAMPLE_CLINICAL_CODE_PROBLEM,
  EXAMPLE_CLINICAL_DATE_RANGE,
  EXAMPLE_CLINICAL_SECTION_ALLERGIES,
  EXAMPLE_CLINICAL_SECTION_PATIENT_SUMMARY,
  EXAMPLE_CONSENT_PURPOSE_TREATMENT,
  EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
  EXAMPLE_GENERIC_SUBJECT_DID,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  EXAMPLE_HEALTHCARE_JURISDICTION,
  EXAMPLE_HEALTHCARE_ROLE_PHYSICIAN_TEXT,
  EXAMPLE_PRACTITIONER_DID,
  EXAMPLE_PROFESSIONAL_DID,
  EXAMPLE_SUBJECT_DID,
  EXAMPLE_FORM_CONTROLLER_PHONE,
} from './shared';

export const EXAMPLE_INDIVIDUAL_ORGANIZATION_START_INPUT = {
  alternateName: 'ana',
  controllerEmail: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
  timeoutSeconds: 7,
  intervalSeconds: 2,
} as const;

export const EXAMPLE_INDIVIDUAL_ORGANIZATION_START_RESPONSE = {
  submit: { status: 202, body: {} },
  poll: { status: 200, body: {}, attempts: 1 },
  offerId: 'urn:offer:family-003',
  offerPreview: { offerId: 'urn:offer:family-003', amount: '0.00' },
} as const;

export const EXAMPLE_INDIVIDUAL_ORGANIZATION_ORDER_INPUT = {
  offerId: 'offer-family-1',
  timeoutSeconds: 9,
  intervalSeconds: 2,
} as const;

export const EXAMPLE_INDIVIDUAL_ORGANIZATION_ORDER_RESPONSE = {
  submit: { status: 202, body: {} },
  poll: { status: 200, body: {}, attempts: 1 },
} as const;

export const EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY = Object.freeze({
  actorDid: EXAMPLE_CONTROLLER_DID,
  subjectDid: EXAMPLE_SUBJECT_DID,
  relationship: 'v3-RoleCode|RESPRSN',
  authorityBasis: 'parental-authority',
  email: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
  telephone: EXAMPLE_FORM_CONTROLLER_PHONE,
  credentialMaterial: `${EXAMPLE_CONTROLLER_DID}#signing-key-1`,
  evidence: [{
    type: ['DocumentVerification'],
    evidenceDocument: 'LibroDeFamilia',
    verifier: 'did:web:kyc.example.org',
  }],
} as const);

export const EXAMPLE_INDIVIDUAL_SUBJECT_IDENTITY = Object.freeze({
  subjectDid: EXAMPLE_SUBJECT_DID,
  sameAs: 'mailto:subject.guardian.record@example.org',
  telephone: EXAMPLE_FORM_CONTROLLER_PHONE,
  evidence: [{
    type: ['DocumentVerification'],
    evidenceDocument: 'DNI',
    verifier: 'did:web:kyc.example.org',
  }],
  additionalCredentialSubject: {
    alternateName: 'Ana',
  },
} as const);

export const EXAMPLE_CONSENT_GRANT_INPUT = {
  actor: `${EXAMPLE_PRACTITIONER_DID},${EXAMPLE_HEALTHCARE_JURISDICTION}`,
  actorRole: EXAMPLE_HEALTHCARE_ROLE_PHYSICIAN_TEXT,
  purpose: EXAMPLE_CONSENT_PURPOSE_TREATMENT,
  actions: ['read'],
  subjectDid: EXAMPLE_GENERIC_SUBJECT_DID,
} as const;

export const EXAMPLE_LIVE_CONSENT_GRANT_INPUT = {
  subjectDid: EXAMPLE_SUBJECT_DID,
  actorId: EXAMPLE_PROFESSIONAL_DID,
  actorRole: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  purpose: EXAMPLE_CONSENT_PURPOSE_TREATMENT,
  actions: [EXAMPLE_CLINICAL_SECTION_ALLERGIES],
} as const;

export const EXAMPLE_CONSENT_GRANT_RESPONSE = {
  submit: { status: 202, body: {} },
  poll: { status: 200, body: {}, attempts: 1 },
} as const;

export const EXAMPLE_COMMUNICATION_INGESTION_PAYLOAD = {
  body: {
    data: [
      {
        meta: {
          claims: {
            a: 1,
          },
        },
      },
    ],
  },
} as const;

export const EXAMPLE_DIGITAL_TWIN_COMPOSITION_INPUT = {
  compositionPayload: {
    body: {},
  },
  format: 'api',
} as const;

export const EXAMPLE_CLINICAL_BUNDLE_SEARCH_INPUT: ExampleClinicalBundleSearchInput = {
  subject: EXAMPLE_SUBJECT_DID,
  section: [EXAMPLE_CLINICAL_SECTION_PATIENT_SUMMARY, EXAMPLE_CLINICAL_SECTION_ALLERGIES],
  includedTypes: ['Composition', 'DocumentReference'],
  date: EXAMPLE_CLINICAL_DATE_RANGE,
  code: EXAMPLE_CLINICAL_CODE_PROBLEM,
  author: EXAMPLE_PROFESSIONAL_DID,
};

export const EXAMPLE_LATEST_IPS_SEARCH_INPUT: ExampleLatestIpsSearchInput = {
  subject: EXAMPLE_SUBJECT_DID,
};

export const EXAMPLE_FAMILY_ORGANIZATION_SEARCH_INPUT = {
  controllerPhone: '+34600000001',
  usualname: 'Ana',
  birthDate: '2010-05-20',
} as const;

export const EXAMPLE_FAMILY_ORGANIZATION_SEARCH_RESPONSE_BODY = {
  body: {
    data: [{
      type: 'Family-search-result-v1.0',
      meta: {
        claims: {
          'org.schema.FamilyRegistration.status': 'already_exists',
          'org.schema.Offer.identifier': 'offer-uuid-001',
          'org.schema.Organization.identifier.value': 'org-uuid-001',
          'org.schema.Organization.alternateName': EXAMPLE_FAMILY_ORGANIZATION_SEARCH_INPUT.usualname,
          'org.schema.Organization.owner.telephone': EXAMPLE_FAMILY_ORGANIZATION_SEARCH_INPUT.controllerPhone,
          'org.schema.Organization.foundingDate': EXAMPLE_FAMILY_ORGANIZATION_SEARCH_INPUT.birthDate,
        },
      },
      resource: { id: 'org-uuid-001' },
    }],
  },
} as const;
