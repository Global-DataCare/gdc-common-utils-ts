// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { DataspaceSectors } from '../constants/sectors';

/**
 * Shared low-level example fragments reused by multiple flow-specific example modules.
 */

export const EXAMPLE_TENANT_IDENTIFIER = 'acme-id' as const;
export const EXAMPLE_JURISDICTION = 'ES' as const;
export const EXAMPLE_SECTOR = DataspaceSectors.HealthCare;

export const EXAMPLE_TENANT_ROUTE_CONTEXT = {
  tenantId: EXAMPLE_TENANT_IDENTIFIER,
  jurisdiction: EXAMPLE_JURISDICTION,
  sector: EXAMPLE_SECTOR,
} as const;

export const EXAMPLE_HOST_ROUTE_CONTEXT = {
  jurisdiction: EXAMPLE_JURISDICTION,
  sector: EXAMPLE_SECTOR,
} as const;

export const EXAMPLE_CONTROLLER_DID = 'did:web:people.acme.org:controllers:primary' as const;
export const EXAMPLE_CONTROLLER_EMAIL = 'controller@acme.org' as const;
export const EXAMPLE_CONTROLLER_SAME_AS = `mailto:${EXAMPLE_CONTROLLER_EMAIL}` as const;

export const EXAMPLE_CONTROLLER_SIGN_KEY = {
  kid: 'controller-es384-001',
  kty: 'EC',
  crv: 'P-384',
  x: '<x>',
  y: '<y>',
  alg: 'ES384',
  use: 'sig',
} as const;

export const EXAMPLE_CONTROLLER_ENCRYPTION_KEY = {
  kid: 'controller-didcomm-enc-001',
  kty: 'EC',
  crv: 'P-384',
  x: '<enc-x>',
  y: '<enc-y>',
  use: 'enc',
  purposes: ['didcomm-enc'],
} as const;

export const EXAMPLE_CONTROLLER_PUBLIC_KEYS = {
  keys: [EXAMPLE_CONTROLLER_ENCRYPTION_KEY],
} as const;

export const EXAMPLE_CONTROLLER_BINDING = {
  did: EXAMPLE_CONTROLLER_DID,
  sameAs: EXAMPLE_CONTROLLER_SAME_AS,
  publicKeyJwk: EXAMPLE_CONTROLLER_SIGN_KEY,
  jwks: EXAMPLE_CONTROLLER_PUBLIC_KEYS,
} as const;

export function buildExampleCommunicationIngestionPayload({
  subjectDid = 'did:web:api.acme.org:individual:123',
  sent = '2026-05-22T10:00:00Z',
  ipsBundleBase64 = '<base64-ips-bundle>',
} = {}) {
  return {
    body: {
      data: [
        {
          type: 'Communication-ingestion-request-v1.0',
          resource: {
            resourceType: 'Communication',
            status: 'completed',
            subject: { reference: `Patient/${subjectDid}` },
            category: [{
              coding: [{
                system: 'http://terminology.hl7.org/CodeSystem/communication-category',
                code: 'notification',
              }],
            }],
            payload: [
              {
                contentAttachment: {
                  contentType: 'application/fhir+json',
                  title: 'IPS Document Bundle',
                  data: ipsBundleBase64,
                },
              },
            ],
            note: [{ text: 'IPS ingestion request' }],
            meta: {
              claims: {
                '@context': 'org.hl7.fhir.r4',
                'Communication.category': 'http://terminology.hl7.org/CodeSystem/communication-category|notification',
                'Communication.subject': subjectDid,
                'Communication.sent': sent,
                'Communication.content-attachment-type': 'application/fhir+json',
                'Communication.note': 'IPS ingestion request',
              },
            },
          },
        },
      ],
    },
  };
}

export function buildExampleDocumentReferenceSearchPayload(subjectDid = 'did:web:api.acme.org:individual:123') {
  return {
    thid: 'search-documentreference-example',
    body: {
      resourceType: 'Bundle',
      type: 'batch',
      entry: [
        {
          request: {
            method: 'GET',
            url: `DocumentReference?subject=${encodeURIComponent(subjectDid)}`,
          },
        },
      ],
    },
  };
}

export function cloneExample<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
