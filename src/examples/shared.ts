// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import { DataspaceSectors } from '../constants/sectors';
import { HostNetworkTypes } from '../constants/network';
import {
  HealthcareActorRoles,
  HealthcareBasicSections,
  HealthcareConsentPurposes,
} from '../constants/healthcare';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';

/**
 * Shared low-level example fragments reused by multiple flow-specific example modules.
 *
 * Non-negotiable rule:
 *
 * - example DIDs, emails, actor identifiers, sections, codes, and date windows
 *   must be imported from this module
 * - example files must not re-hardcode those fixture values inline
 * - all values below are synthetic documentation/test fixtures, never real data
 */

export const EXAMPLE_TENANT_IDENTIFIER = 'acme-id' as const;
export const EXAMPLE_JURISDICTION = 'ES' as const;
export const EXAMPLE_NETWORK_TYPE = HostNetworkTypes.Test;
export const EXAMPLE_ROUTE_VERSION = 'v1' as const;
export const EXAMPLE_SECTOR = DataspaceSectors.HealthCare;
export const EXAMPLE_EMAIL_CONTROLLER_ORG = 'controller@acme.org' as const;
export const EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL = 'ana.parent@example.org' as const;

export const EXAMPLE_TENANT_ROUTE_CONTEXT = {
  tenantId: EXAMPLE_TENANT_IDENTIFIER,
  jurisdiction: EXAMPLE_JURISDICTION,
  sector: EXAMPLE_SECTOR,
} as const;

export const EXAMPLE_HOST_ROUTE_CONTEXT = {
  jurisdiction: EXAMPLE_JURISDICTION,
  sector: HostNetworkTypes.Test,
} as const;

export const EXAMPLE_CONTROLLER_DID = 'did:web:people.acme.org:controllers:primary' as const;
export const EXAMPLE_CONTROLLER_EMAIL = EXAMPLE_EMAIL_CONTROLLER_ORG;
export const EXAMPLE_CONTROLLER_SAME_AS = `mailto:${EXAMPLE_CONTROLLER_EMAIL}` as const;
export const EXAMPLE_API_ORGANIZATION_DID = 'did:web:api.acme.org' as const;
export const EXAMPLE_SERVICE_PUBLIC_DID = 'did:web:public.acme.org' as const;
export const EXAMPLE_SUBJECT_DID = 'did:web:api.acme.org:individual:123' as const;
export const EXAMPLE_PROFESSIONAL_DID = 'did:web:api.acme.org:professional:1' as const;
export const EXAMPLE_PROVIDER_ORGANIZATION_DID = 'did:web:hospital.acme.org' as const;
export const EXAMPLE_PROVIDER_ORGANIZATION_URL = 'https://hospital.acme.org' as const;
export const EXAMPLE_GATEWAY_PUBLIC_ORIGIN = 'https://gateway.example.com' as const;
export const EXAMPLE_HOST_PUBLIC_HOSTNAME = 'host.example.com' as const;
export const EXAMPLE_DEFAULT_ICA_URL = 'https://ica.example.org' as const;
export const EXAMPLE_DEFAULT_ICA_DID = 'did:web:ica.example.org' as const;
export const EXAMPLE_HOSTING_OPERATOR_DID = 'did:web:host.example.org' as const;
export const EXAMPLE_TENANT_SERVICE_DID = 'did:web:provider.example.org' as const;
export const EXAMPLE_SECONDARY_TENANT_SERVICE_DID = 'did:web:provider-b.example.org' as const;
export const EXAMPLE_INDEX_PROVIDER_SECTOR_DID_WEB =
  'did:web:provider.example.org:acme-id:cds-es:v1:health-care' as const;
export const EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL = `https://host.example.org/host/cds-ES/${EXAMPLE_ROUTE_VERSION}/${EXAMPLE_NETWORK_TYPE}/.well-known/dspace-version` as const;
export const EXAMPLE_HOSTING_OPERATOR_CATALOG_ARTIFACT_URL = `https://host.example.org/host/cds-ES/${EXAMPLE_ROUTE_VERSION}/${EXAMPLE_NETWORK_TYPE}/dsp/catalog/dcat.json` as const;
/** @deprecated Use `EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL`. */
export const EXAMPLE_HOSTING_OPERATOR_CATALOG_URL = EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL;
export const EXAMPLE_PROVIDER_PUBLISHED_ENDPOINT_URL = 'https://host.example.org/catalog/provider-a' as const;
export const EXAMPLE_PROVIDER_LEGAL_NAME = 'ACME Health Provider' as const;
export const EXAMPLE_SECONDARY_PROVIDER_LEGAL_NAME = 'Reader Only Provider' as const;
export const EXAMPLE_SECONDARY_PROVIDER_ALTERNATE_NAME = 'reader-only' as const;
export const EXAMPLE_COVERAGE_SCOPE_EU = 'EU' as const;
export const EXAMPLE_NON_EU_COUNTRY = 'US' as const;
export const EXAMPLE_SECONDARY_EU_COUNTRY = 'PT' as const;
export const EXAMPLE_PATIENT_DID = 'did:web:patient.example' as const;
export const EXAMPLE_PROFILE_PROVIDER_DID = 'did:web:provider.example.org' as const;
export const EXAMPLE_PROFILE_ORGANIZATION_DID = 'did:web:org.example' as const;
export const EXAMPLE_PROFILE_ID = 'profile-1' as const;
export const EXAMPLE_PROFILE_EMAIL = 'user@example.com' as const;
export const EXAMPLE_PRACTITIONER_DID = 'did:web:practitioner.example' as const;
export const EXAMPLE_GENERIC_SUBJECT_DID = 'did:web:subject.example' as const;
export const EXAMPLE_EMAIL_PROFESSIONAL = 'doctor.oncall@example.org' as const;
export const EXAMPLE_EMAIL_RELATED_PERSON = 'parent.guardian@example.org' as const;
export const EXAMPLE_HEALTHCARE_JURISDICTION = 'ES' as const;
export const EXAMPLE_ORGANIZATION_CONTROLLER_ROLE = 'RESPRSN' as const;
export const EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN = HealthcareActorRoles.Physician;
export const EXAMPLE_HEALTHCARE_ACTOR_ROLE_RECEPTIONIST = 'ISCO-08|4226' as const;
export const EXAMPLE_HEALTHCARE_ROLE_PHYSICIAN_TEXT = 'physician' as const;
export const EXAMPLE_RELATED_PERSON_ROLE = 'v3-RoleCode|RESPRSN' as const;
export const EXAMPLE_CLINICAL_SECTION_RESULTS = 'LOINC|30954-2' as const;
export const EXAMPLE_CLINICAL_SECTION_PATIENT_SUMMARY = 'LOINC|60591-5' as const;
export const EXAMPLE_CLINICAL_SECTION_HISTORY_MEDICATION = 'LOINC|10160-0' as const;
export const EXAMPLE_CLINICAL_SECTION_ALLERGIES = HealthcareBasicSections.AllergiesAndIntolerances.attributeValue;
export const EXAMPLE_CLINICAL_CODE_PROBLEM = 'LOINC|11450-4' as const;
export const EXAMPLE_CONSENT_DATE = '2026-05-20' as const;
export const EXAMPLE_CONSENT_PERIOD_END = '2026-05-01T00:00:00Z' as const;
export const EXAMPLE_CONSENT_PURPOSE_TREATMENT = HealthcareConsentPurposes.Treatment;
export const EXAMPLE_CONSENT_IDENTIFIER = 'urn:uuid:consent-example-001' as const;
export const EXAMPLE_CONSENT_OPERATION_IDENTIFIER = 'consent-operation-example-001' as const;
export const EXAMPLE_CONSENT_OPERATION_THREAD_ID = 'thread-consent-example-001' as const;
export const EXAMPLE_CONSENT_PERIOD_START = '2026-05-20T00:00:00Z' as const;
export const EXAMPLE_COMMUNICATION_IDENTIFIER = 'urn:uuid:communication-example-001' as const;
export const EXAMPLE_IPS_BUNDLE_NOTE_TEXT = 'IPS ingestion request' as const;
export const EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER = 'urn:uuid:medication-statement-example-001' as const;
export const EXAMPLE_MEDICATION_STATEMENT_STATUS = 'active' as const;
export const EXAMPLE_MEDICATION_STATEMENT_CODE = 'http://www.nlm.nih.gov/research/umls/rxnorm|313782' as const;
export const EXAMPLE_MEDICATION_STATEMENT_TEXT = 'atorvastatin 20 mg oral tablet' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER = 'docref-example-001' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY = 'docref-example-002' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF = 'application/pdf' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_URL = 'https://example.org/prescription.pdf' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION = 'Prescription PDF' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_DATE = '2026-06-12T10:00:00Z' as const;
export const EXAMPLE_EMPLOYEE_ACTIVATION_CODE = 'ACT-001' as const;
export const EXAMPLE_DEVICE_CLIENT_ID = 'did:web:device-001' as const;
export const EXAMPLE_LIVE_GW_BASE_URL_LOCAL = 'http://127.0.0.1:3000' as const;
export const EXAMPLE_LIVE_GW_BASE_URL_DOCKER = 'http://127.0.0.1:8000' as const;
export const EXAMPLE_MEDICATION_DOSE_UNIT_MG = 'mg' as const;
export const EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS = 'h' as const;
export const EXAMPLE_MEDICATION_IBUPROFEN_TEXT = 'Ibuprofen 400 mg' as const;
export const EXAMPLE_MEDICATION_IBUPROFEN_IDENTIFIER_PREFIX = 'urn:uuid:med-ibuprofen' as const;
export const EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE = '2026-06-01T08:00:00Z' as const;
export const EXAMPLE_MEDICATION_IBUPROFEN_NOTE = 'Take every 8 hours as needed. Keep a 4 hour gap from paracetamol.' as const;
export const EXAMPLE_MEDICATION_PARACETAMOL_TEXT = 'Paracetamol 600 mg' as const;
export const EXAMPLE_MEDICATION_PARACETAMOL_IDENTIFIER_PREFIX = 'urn:uuid:med-paracetamol' as const;
export const EXAMPLE_MEDICATION_PARACETAMOL_EFFECTIVE = '2026-06-01T12:00:00Z' as const;
export const EXAMPLE_MEDICATION_PARACETAMOL_NOTE = 'Take every 8 hours as needed. Keep a 4 hour gap from ibuprofen.' as const;
export const EXAMPLE_IPS_BUNDLE_REFERENCE_URL =
  `individual/org.hl7.fhir.r4/Bundle?type=document&composition.subject=${EXAMPLE_SUBJECT_DID}&composition.type=http://loinc.org|60591-5` as const;
export const EXAMPLE_IPS_BUNDLE_REFERENCE_ABSOLUTE_URL =
  `https://provider.example.org/acme-id/cds-ES/v1/health-care/${EXAMPLE_IPS_BUNDLE_REFERENCE_URL}` as const;

export type ExampleDateRange = Readonly<{
  start: string;
  end: string;
}>;

export const EXAMPLE_CLINICAL_DATE_RANGE: ExampleDateRange = {
  start: '2026-01-01',
  end: '2026-12-31',
};

export type ExampleClinicalBundleSearchInput = Readonly<{
  subject: string;
  section: readonly string[];
  includedTypes: readonly string[];
  date: ExampleDateRange;
  code: string;
  author: string;
}>;

export type ExampleLatestIpsSearchInput = Readonly<{
  subject: string;
}>;

export type ExampleLiveMedicationCase = Readonly<{
  identifier: string;
  effectiveDateTime: string;
  text: string;
  note: string;
  doseQuantityValue: number;
  doseQuantityUnit: string;
  timingFrequency: number;
  timingPeriod: number;
  timingPeriodUnit: string;
  dosageAsNeeded: boolean;
  section: string;
}>;

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
  subjectDid = EXAMPLE_SUBJECT_DID,
  sent = '2026-05-22T10:00:00Z',
  ipsBundleBase64 = '<base64-ips-bundle>',
} = {}) {
  // Good practice note:
  // Communication claim keys in examples must come from `CommunicationClaim`
  // instead of repeating raw `Communication.*` strings inline.
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
                [CommunicationClaim.Category]: 'http://terminology.hl7.org/CodeSystem/communication-category|notification',
                [CommunicationClaim.Subject]: subjectDid,
                [CommunicationClaim.Sent]: sent,
                [CommunicationClaim.ContentAttachmentType]: 'application/fhir+json',
                [CommunicationClaim.Text]: 'IPS ingestion request',
              },
            },
          },
        },
      ],
    },
  };
}

export function buildExampleDocumentReferenceSearchPayload(subjectDid = EXAMPLE_SUBJECT_DID) {
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

export function buildExampleLiveMedicationCases(seed = Date.now()): ExampleLiveMedicationCase[] {
  return [
    {
      identifier: `${EXAMPLE_MEDICATION_IBUPROFEN_IDENTIFIER_PREFIX}-${seed}`,
      effectiveDateTime: EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE,
      text: EXAMPLE_MEDICATION_IBUPROFEN_TEXT,
      note: EXAMPLE_MEDICATION_IBUPROFEN_NOTE,
      doseQuantityValue: 400,
      doseQuantityUnit: EXAMPLE_MEDICATION_DOSE_UNIT_MG,
      timingFrequency: 1,
      timingPeriod: 8,
      timingPeriodUnit: EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS,
      dosageAsNeeded: true,
      section: EXAMPLE_CLINICAL_SECTION_HISTORY_MEDICATION,
    },
    {
      identifier: `${EXAMPLE_MEDICATION_PARACETAMOL_IDENTIFIER_PREFIX}-${seed}`,
      effectiveDateTime: EXAMPLE_MEDICATION_PARACETAMOL_EFFECTIVE,
      text: EXAMPLE_MEDICATION_PARACETAMOL_TEXT,
      note: EXAMPLE_MEDICATION_PARACETAMOL_NOTE,
      doseQuantityValue: 600,
      doseQuantityUnit: EXAMPLE_MEDICATION_DOSE_UNIT_MG,
      timingFrequency: 1,
      timingPeriod: 8,
      timingPeriodUnit: EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS,
      dosageAsNeeded: true,
      section: EXAMPLE_CLINICAL_SECTION_HISTORY_MEDICATION,
    },
  ];
}

export type ExampleHostedTenantRouteContext = Readonly<{
  alternateName: string;
  jurisdiction: string;
  version: string;
  sector: string;
}>;

export function buildExampleHostedTenantBaseUrl(input: ExampleHostedTenantRouteContext): string {
  return `${EXAMPLE_GATEWAY_PUBLIC_ORIGIN}/${input.alternateName}/cds-${input.jurisdiction.toLowerCase()}/${input.version}/${input.sector}`;
}
