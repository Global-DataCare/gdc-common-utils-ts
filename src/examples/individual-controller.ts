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

export const EXAMPLE_INDIVIDUAL_ORGANIZATION_START_INPUT = {
  alternateName: 'ana',
  controllerEmail: 'ana.parent@example.org',
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

export const EXAMPLE_CONSENT_GRANT_INPUT = {
  actor: 'did:web:practitioner.example,ES',
  actorRole: 'physician',
  purpose: 'TREAT',
  actions: ['read'],
  subjectDid: 'did:web:subject.example',
} as const;

export const EXAMPLE_LIVE_CONSENT_GRANT_INPUT = {
  subjectDid: 'did:web:api.acme.org:individual:123',
  actor: { identifier: 'did:web:api.acme.org' },
  actorRole: 'ISCO-08|2211',
  purpose: 'TREAT',
  actions: ['LOINC|48765-2'],
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

export const EXAMPLE_CLINICAL_BUNDLE_SEARCH_INPUT = {
  subject: 'did:web:api.acme.org:individual:123',
  section: ['LOINC|60591-5', 'LOINC|48765-2'],
  includedTypes: ['Composition', 'DocumentReference'],
  date: { start: '2026-01-01', end: '2026-12-31' },
  code: 'LOINC|11450-4',
  author: 'did:web:api.acme.org:professional:1',
} as const;

export const EXAMPLE_LATEST_IPS_SEARCH_INPUT = {
  subject: 'did:web:api.acme.org:individual:123',
} as const;
