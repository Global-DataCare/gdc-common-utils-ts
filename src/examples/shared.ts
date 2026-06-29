// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import { DataspaceSectors } from '../constants/sectors';
import { HostNetworkTypes } from '../constants/network';
import { FhirCodeSystems } from '../constants/fhir-code-systems';
import { Format } from '../constants/Schemas';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { BirthSex, GenderIdentity } from '../constants/identity-gender';
import { IdKind } from '../constants/identity-identifiers';
import {
  HealthcareActorRoles,
  HealthcareBasicSections,
  HealthcareConsentPurposes,
  HealthcareDocumentTypes,
} from '../constants/healthcare';
import { CommunicationCategoryCodes } from '../constants/communication';
import { LOINC_SYSTEM_URL } from '../models/clinical-sections';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';
import {
  buildHostedProviderDidWeb,
  buildIndividualDidWeb,
  buildIndividualMemberDidWeb,
  buildProfessionalDidWeb,
  buildProviderSectorDidWeb,
} from '../utils/did';
import { encodeHexToMultibase58btc } from '../utils/multibase58';
import {
  MedicationStatementClaim,
  MedicationStatementClaimsFhirApiExtended,
} from '../models/interoperable-claims/medication-statement-claims';
import { medicationStatementFlatToFhirR4 } from '../utils/clinical-resource-converters';

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
export const EXAMPLE_RESEARCH_TENANT_IDENTIFIER = 'lab-id' as const;
export const EXAMPLE_JURISDICTION = 'ES' as const;
export const EXAMPLE_HOST_COVERAGE_SCOPE = 'EU' as const;
export const EXAMPLE_NETWORK_TYPE = HostNetworkTypes.Test;
export const EXAMPLE_ROUTE_VERSION = 'v1' as const;
export const EXAMPLE_SECTOR = DataspaceSectors.HealthCare;
export const EXAMPLE_RESEARCH_SECTOR = DataspaceSectors.HealthResearch;
export const EXAMPLE_EMAIL_CONTROLLER_ORG = 'controller@acme.org' as const;
export const EXAMPLE_EMAIL_CONTROLLER_RESEARCH_ORG = 'controller@lab.org' as const;
export const EXAMPLE_ORGANIZATION_LEGAL_NAME = 'ACME HEALTH SL' as const;
export const EXAMPLE_LEGAL_ORGANIZATION_TAX_ID = 'VATES-B00112233' as const;
export const EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL = 'ana.parent@example.org' as const;
export const EXAMPLE_INTEROPERABLE_CONTEXT_FHIR_API = Format.FHIR_API;
export const EXAMPLE_SELF_REGISTERED_INDIVIDUAL_ALTERNATE_NAME = 'Jane' as const;
export const EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL = 'Jane.Doe@example.com' as const;
export const EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED = 'jane.doe@example.com' as const;
export const EXAMPLE_SELF_REGISTERED_INDIVIDUAL_GENDER = BirthSex.Female;
export const EXAMPLE_SELF_REGISTERED_INDIVIDUAL_BIRTH_YEAR = '1980' as const;
export const EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME = 'Doraemon' as const;
export const EXAMPLE_REGISTERED_SUBJECT_BIRTH_YEAR = '2020' as const;
export const EXAMPLE_PDF_CONSENT_DATE = '2026-06-08' as const;
export const EXAMPLE_SIGNED_TERMS_PDF_URL =
  'https://portal.example.org/files/legal-organization-signed-terms.pdf' as const;
/**
 * Public provider domain selected during autodiscovery.
 *
 * This value may be:
 * - a public domain masking the hosted tenant path, e.g. `service.provider.example`
 * - or a hosted `did:web` base path without scheme, e.g.
 *   `hosting.example.com/acme-id/cds-es/v1/health-care`
 *
 * The outbox later resolves the DID document from this base and derives the
 * concrete endpoint URL for the selected operation.
 */
export const EXAMPLE_SERVICE_PROVIDER_DOMAIN = 'service.provider.example' as const;
/** Example hosted `did:web` base without scheme, useful for tests/docs. */
export const EXAMPLE_SERVICE_PROVIDER_HOSTED_DID_WEB_BASE =
  'hosting.example.com/acme-id/cds-es/v1/health-care' as const;
/** @deprecated Use `EXAMPLE_SERVICE_PROVIDER_DOMAIN`. */
export const EXAMPLE_PDF_SERVICE_PROVIDER_DOMAIN = EXAMPLE_SERVICE_PROVIDER_DOMAIN;
export const EXAMPLE_KYC_CONTROLLER_UUID = '033ceb35-2528-402e-8385-f22e12f57805' as const;
export const EXAMPLE_KYC_CONTROLLER_USER_UUID = '8c18ec13-e908-4b7a-91bb-134bb3a229e1' as const;
export const EXAMPLE_KYC_CONTROLLER_GIVEN_NAME = 'System' as const;
export const EXAMPLE_KYC_CONTROLLER_FAMILY_NAME = 'User' as const;
export const EXAMPLE_KYC_CONTROLLER_COUNTRY = 'VE' as const;
export const EXAMPLE_KYC_CONTROLLER_CITY = 'Caracas' as const;
export const EXAMPLE_KYC_CONTROLLER_STREET_ADDRESS = 'Av. Principal 123' as const;
export const EXAMPLE_KYC_CONTROLLER_IDENTIFIER = 'V-12345678' as const;
export const EXAMPLE_KYC_CONTROLLER_POSTAL_CODE = '1010' as const;
export const EXAMPLE_KYC_CONTROLLER_TELEPHONE = '+58-424-555-1234' as const;
export const EXAMPLE_KYC_CONTROLLER_BIRTHDATE = '1990-01-01' as const;
export const EXAMPLE_KYC_CONTROLLER_VERIFIED_AT = '2026-05-14T23:43:05.869+00:00' as const;
export const EXAMPLE_KYC_CONTROLLER_LANGUAGE = 'es' as const;
export const EXAMPLE_KYC_CONTROLLER_CREATED_AT = '2026-05-14T23:43:05.913+00:00' as const;
export const EXAMPLE_KYC_CONTROLLER_UPDATED_AT = '2026-05-14T23:43:05.913+00:00' as const;
export const EXAMPLE_KYC_CONTROLLER_GENDER_MALE = BirthSex.Male;
export const EXAMPLE_KYC_CONTROLLER_GENDER_FEMALE = BirthSex.Female;
export const EXAMPLE_KYC_CONTROLLER_GENDER_IDENTITY_MAN = GenderIdentity.Man;
export const EXAMPLE_KYC_CONTROLLER_GENDER_IDENTITY_WOMAN = GenderIdentity.Woman;
export const EXAMPLE_CONTROLLER_IDENTIFIER_TYPE = IdKind.PersonalNationalNumber;
export const EXAMPLE_SUBJECT_IDENTIFIER_TYPE = IdKind.LocalPatientIdentifier;
export const EXAMPLE_SYNTHETIC_SIGNER_SUBJECT_DN =
  'CN=DOE JANE - TEST1234,SN=DOE,GN=JANE,serialNumber=IDCES-TEST1234,C=ES' as const;
export const EXAMPLE_SYNTHETIC_CERT_COMMON_NAME = 'DOE JANE - TEST1234' as const;
export const EXAMPLE_SYNTHETIC_CERT_FAMILY_NAME = 'DOE' as const;
export const EXAMPLE_SYNTHETIC_CERT_GIVEN_NAME = 'JANE' as const;
export const EXAMPLE_SYNTHETIC_CERT_SERIAL_NUMBER = 'IDCES-TEST1234' as const;
export const EXAMPLE_SYNTHETIC_CERT_COUNTRY = 'ES' as const;
export const EXAMPLE_SYNTHETIC_CERT_DISPLAY_NAME = 'JANE DOE' as const;
export const EXAMPLE_KYC_CONTROLLER_DISPLAY_NAME = 'SYSTEM USER' as const;
export const EXAMPLE_FORM_CONTROLLER_PHONE = '+34000000001' as const;
export const EXAMPLE_FORM_SUBJECT_PHONE = '+34000000002' as const;
export const EXAMPLE_FORM_CONTROLLER_IDENTIFIER_VALUE = 'identifier-controller-001' as const;
export const EXAMPLE_FORM_SUBJECT_IDENTIFIER_VALUE = 'identifier-subject-001' as const;
export const EXAMPLE_OTP_INVITATION_ID = 'invitation-demo-001' as const;
export const EXAMPLE_OTP_CHALLENGE_ID = 'otp-challenge-demo-001' as const;
export const EXAMPLE_OTP_CODE = '123456' as const;
export const EXAMPLE_DEMO_PORTAL_ID_TOKEN =
  'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJkZW1vLXVzZXIiLCJlbWFpbCI6ImRlbW9AZXhhbXBsZS5vcmcifQ.demo' as const;

export const EXAMPLE_TENANT_ROUTE_CONTEXT = {
  tenantId: EXAMPLE_TENANT_IDENTIFIER,
  jurisdiction: EXAMPLE_JURISDICTION,
  sector: EXAMPLE_SECTOR,
} as const;

export const EXAMPLE_HOST_ROUTE_CONTEXT = {
  hostCoverageScope: EXAMPLE_HOST_COVERAGE_SCOPE,
  jurisdiction: EXAMPLE_JURISDICTION,
  /**
   * Host route segment used in `/host/cds-{hostCoverageScope}/v1/{hostNetwork}/...`.
   *
   * This is intentionally not the tenant business sector.
   */
  hostNetwork: EXAMPLE_NETWORK_TYPE,
  /** @deprecated Use `hostNetwork`. */
  sector: EXAMPLE_NETWORK_TYPE,
} as const;

export const EXAMPLE_CONTROLLER_DID = 'did:web:people.acme.org:controllers:primary' as const;
export const EXAMPLE_RESEARCH_CONTROLLER_DID = 'did:web:people.lab.org:controllers:primary' as const;
export const EXAMPLE_CONTROLLER_EMAIL = EXAMPLE_EMAIL_CONTROLLER_ORG;
export const EXAMPLE_CONTROLLER_SAME_AS = `mailto:${EXAMPLE_CONTROLLER_EMAIL}` as const;
export const EXAMPLE_API_ORGANIZATION_DID = 'did:web:api.acme.org' as const;
export const EXAMPLE_RESEARCH_API_ORGANIZATION_DID = 'did:web:api.lab.org' as const;
export const EXAMPLE_SERVICE_PUBLIC_DID = 'did:web:public.acme.org' as const;
export const EXAMPLE_PROFESSIONAL_DID = buildProfessionalDidWeb({
  organizationDidWeb: 'did:web:api.acme.org',
  email: 'doctor.oncall@example.org',
  role: HealthcareActorRoles.Physician,
});
export const EXAMPLE_PROVIDER_ORGANIZATION_DID = 'did:web:hospital.acme.org' as const;
export const EXAMPLE_PROVIDER_ORGANIZATION_URL = 'https://hospital.acme.org' as const;
export const EXAMPLE_GATEWAY_PUBLIC_ORIGIN = 'https://gateway.example.com' as const;
export const EXAMPLE_HOST_PUBLIC_HOSTNAME = 'host.example.com' as const;
export const EXAMPLE_PROVIDER_TAX_ID = 'VATES-B00112233' as const;
export const EXAMPLE_PROVIDER_DOMAIN = 'health-care.provider.example.org' as const;
export const EXAMPLE_INDIVIDUAL_MULTIBASE_ID =
  encodeHexToMultibase58btc('a87e5b15aea444759c7c40aa88354b6f');
export const EXAMPLE_INDIVIDUAL_MULTIBASE_ID_SECONDARY =
  encodeHexToMultibase58btc('b98f6c24bfb545849d8d51bb99465c7e');
export const EXAMPLE_INDIVIDUAL_MULTIBASE_ID_TERTIARY =
  encodeHexToMultibase58btc('c39f7d35c0c65695ae9e62cca0576d8f');
export const EXAMPLE_INDIVIDUAL_MULTIBASE_ID_CONDITION =
  encodeHexToMultibase58btc('d4a08e46d1d767a6bfaf73ddb1687ea0');
export const EXAMPLE_INDIVIDUAL_MULTIBASE_ID_IPS =
  encodeHexToMultibase58btc('e5b19f57e2e878b7c0b084eec2798fb1');
export const EXAMPLE_HOSTED_PROVIDER_DID = buildHostedProviderDidWeb({
  hostDomain: EXAMPLE_HOST_PUBLIC_HOSTNAME,
  sector: EXAMPLE_SECTOR,
  providerTaxId: EXAMPLE_PROVIDER_TAX_ID,
});
export const EXAMPLE_PROVIDER_DOMAIN_DID = buildProviderSectorDidWeb({
  providerSectorDomain: EXAMPLE_PROVIDER_DOMAIN,
});
/** @deprecated Use `EXAMPLE_PROVIDER_DOMAIN_DID`. */
export const EXAMPLE_PROVIDER_SECTOR_DID = EXAMPLE_PROVIDER_DOMAIN_DID;
/**
 * Canonical individual DID fixtures reused by docs, tests, and SDK examples.
 *
 * There are two valid base roots:
 * - hosted provider root:
 *   `did:web:<host.domain>:<sector>;organization:taxid:<provider-tax-id>`
 * - external provider custom-domain root:
 *   `did:web:<sector.provider.domain>`
 *
 * The individual DID itself must always extend one of those roots as:
 * `:individual:multibase:<individualId>`
 */
export const EXAMPLE_SUBJECT_DID = buildIndividualDidWeb({
  providerDidWeb: EXAMPLE_HOSTED_PROVIDER_DID,
  individualId: EXAMPLE_INDIVIDUAL_MULTIBASE_ID,
});
export const EXAMPLE_SUBJECT_DID_SECONDARY = buildIndividualDidWeb({
  providerDidWeb: EXAMPLE_HOSTED_PROVIDER_DID,
  individualId: EXAMPLE_INDIVIDUAL_MULTIBASE_ID_SECONDARY,
});
export const EXAMPLE_SUBJECT_DID_TERTIARY = buildIndividualDidWeb({
  providerDidWeb: EXAMPLE_HOSTED_PROVIDER_DID,
  individualId: EXAMPLE_INDIVIDUAL_MULTIBASE_ID_TERTIARY,
});
export const EXAMPLE_SUBJECT_DID_CONDITION = buildIndividualDidWeb({
  providerDidWeb: EXAMPLE_HOSTED_PROVIDER_DID,
  individualId: EXAMPLE_INDIVIDUAL_MULTIBASE_ID_CONDITION,
});
export const EXAMPLE_SUBJECT_DID_IPS = buildIndividualDidWeb({
  providerDidWeb: EXAMPLE_PROVIDER_DOMAIN_DID,
  individualId: EXAMPLE_INDIVIDUAL_MULTIBASE_ID_IPS,
});
export const EXAMPLE_DEFAULT_ICA_URL = 'https://ica.example.org' as const;
export const EXAMPLE_DEFAULT_ICA_DID = 'did:web:ica.example.org' as const;
export const EXAMPLE_HOSTING_OPERATOR_DID = 'did:web:host.example.org' as const;
export const EXAMPLE_TENANT_SERVICE_DID = 'did:web:provider.example.org' as const;
export const EXAMPLE_SECONDARY_TENANT_SERVICE_DID = 'did:web:provider-b.example.org' as const;
export const EXAMPLE_INDEX_PROVIDER_SECTOR_DID_WEB =
  'did:web:provider.example.org:acme-id:cds-es:v1:health-care' as const;
export const EXAMPLE_HOSTING_OPERATOR_DSPACE_VERSION_URL = `https://host.example.org/host/cds-${EXAMPLE_HOST_COVERAGE_SCOPE}/${EXAMPLE_ROUTE_VERSION}/${EXAMPLE_NETWORK_TYPE}/.well-known/dspace-version` as const;
export const EXAMPLE_HOSTING_OPERATOR_CATALOG_ARTIFACT_URL = `https://host.example.org/host/cds-${EXAMPLE_HOST_COVERAGE_SCOPE}/${EXAMPLE_ROUTE_VERSION}/${EXAMPLE_NETWORK_TYPE}/dsp/catalog/dcat.json` as const;
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
export const EXAMPLE_RELATED_PERSON_ACTIVE_NAME = 'Jose Example' as const;
export const EXAMPLE_RELATED_PERSON_INACTIVE_IDENTIFIER = 'urn:uuid:related-person-002' as const;
export const EXAMPLE_RELATED_PERSON_INACTIVE_EMAIL = 'caregiver.two@example.org' as const;
export const EXAMPLE_RELATED_PERSON_INACTIVE_NAME = 'Maria Example' as const;
export const EXAMPLE_RELATED_PERSON_INACTIVE_RELATIONSHIP =
  'http://terminology.hl7.org/CodeSystem/v3-RoleCode|NMTH' as const;
export const EXAMPLE_HEALTHCARE_JURISDICTION = 'ES' as const;
export const EXAMPLE_SECONDARY_HEALTHCARE_JURISDICTION = EXAMPLE_SECONDARY_EU_COUNTRY;
export const EXAMPLE_ORGANIZATION_CONTROLLER_ROLE = 'RESPRSN' as const;
export const EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN = HealthcareActorRoles.Physician;
export const EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER =
  HealthcareActorRoles.GeneralistMedicalPractitioner;
export const EXAMPLE_HEALTHCARE_ACTOR_ROLE_RECEPTIONIST = 'ISCO-08|4226' as const;
export const EXAMPLE_HEALTHCARE_ROLE_PHYSICIAN_TEXT = 'physician' as const;
export const EXAMPLE_RELATED_PERSON_ROLE = 'v3-RoleCode|RESPRSN' as const;
export const EXAMPLE_RELATED_PERSON_MEMBER_DID = buildIndividualMemberDidWeb({
  individualDidWeb: EXAMPLE_SUBJECT_DID,
  role: EXAMPLE_RELATED_PERSON_ROLE,
});
export const EXAMPLE_CLINICAL_SECTION_RESULTS = 'LOINC|30954-2' as const;
export const EXAMPLE_CLINICAL_SECTION_PATIENT_SUMMARY = 'LOINC|60591-5' as const;
export const EXAMPLE_CLINICAL_SECTION_HISTORY_MEDICATION = 'LOINC|10160-0' as const;
export const EXAMPLE_CLINICAL_SECTION_ALLERGIES = HealthcareBasicSections.AllergiesAndIntolerances.attributeValue;
export const EXAMPLE_CLINICAL_CODE_PROBLEM = 'LOINC|11450-4' as const;
export const EXAMPLE_CONSENT_DATE = '2026-05-20' as const;
/** @deprecated Use `ConsentDecisions.Permit`. */
export const EXAMPLE_CONSENT_DECISION_PERMIT = 'permit' as const;
export const EXAMPLE_CONSENT_PERIOD_END = '2026-05-01T00:00:00Z' as const;
export const EXAMPLE_CONSENT_PURPOSE_TREATMENT = HealthcareConsentPurposes.Treatment;
export const EXAMPLE_CONSENT_PURPOSE_EMERGENCY_TREATMENT =
  HealthcareConsentPurposes.EmergencyTreatment;
export const EXAMPLE_CONSENT_UUID = 'urn:uuid:consent-example-001' as const;
export const EXAMPLE_CONSENT_IDENTIFIER = EXAMPLE_CONSENT_UUID;
export const EXAMPLE_CONSENT_IDENTIFIER_SECONDARY = 'urn:uuid:consent-example-002' as const;
export const EXAMPLE_CONSENT_OPERATION_IDENTIFIER = 'consent-operation-example-001' as const;
export const EXAMPLE_CONSENT_OPERATION_THREAD_ID = 'thread-consent-example-001' as const;
export const EXAMPLE_CONSENT_PERIOD_START = '2026-05-20T00:00:00Z' as const;
export const EXAMPLE_COMMUNICATION_UUID = 'urn:uuid:communication-example-001' as const;
export const EXAMPLE_COMMUNICATION_IDENTIFIER = EXAMPLE_COMMUNICATION_UUID;
export const EXAMPLE_COMMUNICATION_THREAD_ID = 'thread-communication-example-001' as const;
export const EXAMPLE_COMMUNICATION_PARTICIPANT_SEARCH_SUBJECT_DID = EXAMPLE_SUBJECT_DID;
export const EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID = EXAMPLE_TENANT_SERVICE_DID;
export const EXAMPLE_COMMUNICATION_PARTICIPANT_USER_DID = EXAMPLE_RELATED_PERSON_MEMBER_DID;
export const EXAMPLE_COMMUNICATION_PARTICIPANT_EMAIL_USER = 'family.owner@example.org' as const;
export const EXAMPLE_COMMUNICATION_PARTICIPANT_EMAIL_RECIPIENT = 'nurse.oncall@example.org' as const;
export const EXAMPLE_COMMUNICATION_PARTICIPANT_TEL_RECIPIENT = '+34600111222' as const;
export const EXAMPLE_COMMUNICATION_SEARCH_CATEGORY =
  CommunicationCategoryCodes.Notification.attributeValue;
export const EXAMPLE_COMMUNICATION_SEARCH_TOPIC = 'care-plan-follow-up' as const;
export const EXAMPLE_IPS_BUNDLE_NOTE_TEXT = 'IPS ingestion request' as const;
export const EXAMPLE_CONTENT_TYPE_APPLICATION_JSON = 'application/json' as const;
export const EXAMPLE_CONTENT_TYPE_FHIR_JSON = 'application/fhir+json' as const;
export const EXAMPLE_IPS_BUNDLE_ATTACHMENT_TITLE = 'IPS Document Bundle' as const;
export const EXAMPLE_BUNDLE_RESOURCE_TYPE = 'Bundle' as const;
export const EXAMPLE_BUNDLE_TYPE_BATCH = 'batch' as const;
export const EXAMPLE_MEDICATION_STATEMENT_UUID = 'urn:uuid:medication-statement-example-001' as const;
export const EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER = EXAMPLE_MEDICATION_STATEMENT_UUID;
export const EXAMPLE_MEDICATION_STATEMENT_STATUS = 'active' as const;
export const EXAMPLE_MEDICATION_STATEMENT_CODE = 'http://www.nlm.nih.gov/research/umls/rxnorm|313782' as const;
export const EXAMPLE_MEDICATION_STATEMENT_TEXT = 'atorvastatin 20 mg oral tablet' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER = 'docref-example-001' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY = 'docref-example-002' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF = 'application/pdf' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_URL = 'https://example.org/prescription.pdf' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION = 'Prescription PDF' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_DATE = '2026-06-12T10:00:00Z' as const;
export const EXAMPLE_CLINICAL_EVENT_DATE_TIME = '2026-06-01T10:00:00Z' as const;
export const EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME = '2026-06-11T08:30:00Z' as const;
export const EXAMPLE_VITAL_SIGNS_PANEL_DATE_TIME = '2026-06-11T09:00:00Z' as const;
export const EXAMPLE_VAULT_PRIMARY_DATE_TIME = '2026-06-11T10:00:00Z' as const;
export const EXAMPLE_VAULT_SECONDARY_DATE_TIME = '2026-06-11T10:05:00Z' as const;
export const EXAMPLE_VAULT_IPS_DATE_TIME = '2026-06-11T11:00:00Z' as const;
export const EXAMPLE_VAULT_TERTIARY_DATE_TIME = '2026-06-11T12:00:00Z' as const;
export const EXAMPLE_VAULT_QUATERNARY_DATE_TIME = '2026-06-11T13:00:00Z' as const;
export const EXAMPLE_VAULT_CONDITION_DATE_TIME = '2026-06-11T14:00:00Z' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_CONTENT_HASH = 'z-document-reference-example-hash' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_LANGUAGE = 'en' as const;
export const EXAMPLE_CONSENT_ATTACHMENT_CONTENT_TYPE = EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF;
export const EXAMPLE_CONSENT_ATTACHMENT_DATA_BASE64 =
  'JVBERi0xLjQKJUZha2UgY29uc2VudCBQREYgZm9yIGxvY2FsIHNtb2tlIHRlc3QK' as const;
export const EXAMPLE_CONTENT_ADDRESSED_CONSENT_IDENTIFIER =
  'zQmYwAPJzv5CZsnAzt8auVZRnGi2C31WnH8D9N6A7h7vY2' as const;
export const EXAMPLE_CONTENT_ADDRESSED_SOURCE_REFERENCE =
  'zQmWvM9dQmWvM9dQmWvM9dQmWvM9dQmWvM9dQmWvM9dQmWv' as const;
export const EXAMPLE_CONTENT_ADDRESSED_EVIDENCE_RECORD_IDENTIFIER =
  'zQmXh8Y3mJQ4d7MmX7o9nP5sQ2uT1vW6xY8zA3bC4dE5fG' as const;
export const EXAMPLE_EMPLOYEE_ACTIVATION_CODE = 'ACT-001' as const;
export const EXAMPLE_LICENSE_OFFER_ID = 'urn:offer:family-003' as const;
export const EXAMPLE_LICENSE_INVALID_OFFER_ID = 'urn:offer:invalid-001' as const;
export const EXAMPLE_LICENSE_ACCEPTED_OFFER_ID = EXAMPLE_LICENSE_OFFER_ID;
export const EXAMPLE_LICENSE_AMOUNT = '9.99' as const;
export const EXAMPLE_LICENSE_CURRENCY = 'EUR' as const;
export const EXAMPLE_LICENSE_PLAN_NAME = 'Family starter' as const;
export const EXAMPLE_LICENSE_SKU = 'FAM-START' as const;
export const EXAMPLE_LICENSE_PAYMENT_METHOD_INVOICE = 'invoice' as const;
export const EXAMPLE_LICENSE_CHECKOUT_URL = 'https://pay.example/offer-001' as const;
export const EXAMPLE_LICENSE_PAYMENT_URL = 'https://pay.example/invoice-001' as const;
export const EXAMPLE_LICENSE_INVOICE_ID = 'invoice-001' as const;
export const EXAMPLE_INVOICE_DATE = '2026-06-11T10:00:00Z' as const;
export const EXAMPLE_INVOICE_CHARGEITEM_PRODUCT_CODE = '08412345678903' as const;
export const EXAMPLE_INVOICE_CHARGEITEM_PRODUCT_NAME = 'Sterile saline bottle 500 mL' as const;
export const EXAMPLE_INVOICE_CHARGEITEM_CATEGORY = 'medical-supplies' as const;
export const EXAMPLE_INVOICE_CHARGEITEM_SUPPLIER_PRODUCT_CODE = 'IMP-SAL-500' as const;
export const EXAMPLE_INVOICE_CHARGEITEM_IDENTIFIER = 'chargeitem-001' as const;
export const EXAMPLE_INVOICE_CHARGEITEM_STATUS = 'billable' as const;
export const EXAMPLE_INVOICE_CHARGEITEM_PART_OF = EXAMPLE_LICENSE_INVOICE_ID;
export const EXAMPLE_INVOICE_CHARGEITEM_QUANTITY = '3|bottle' as const;
export const EXAMPLE_INVOICE_CHARGEITEM_QUANTITY_NUMBER = '3' as const;
export const EXAMPLE_INVOICE_CHARGEITEM_QUANTITY_UNIT = 'bottle' as const;
export const EXAMPLE_INVOICE_CHARGEITEM_CODE_TEXT = 'Botella de suero salino estéril 500 mL' as const;
export const EXAMPLE_INVOICE_CHARGEITEM_ITEMS_PER_UNIT = '24' as const;
export const EXAMPLE_INVOICE_CHARGEITEM_ITEMS_QUANTITY = '500|mL' as const;
export const EXAMPLE_INVOICE_CHARGEITEM_ITEMS_QUANTITY_NUMBER = '500' as const;
export const EXAMPLE_INVOICE_CHARGEITEM_ITEMS_QUANTITY_UNIT = 'mL' as const;
export const EXAMPLE_LICENSE_PLAN_DEFAULT = 'default' as const;
export const EXAMPLE_LICENSE_RENEWAL_CYCLE_YEARLY = '12m' as const;
export const EXAMPLE_LICENSE_SUBJECT_ID_ACTIVE = 'urn:uuid:employee-controller-active-001' as const;
export const EXAMPLE_LICENSE_SUBJECT_ID_AVAILABLE = 'urn:uuid:subject-license-available-001' as const;
export const EXAMPLE_LICENSE_SEAT_UUID_ACTIVE = '8a8a5e1b-0d8e-4a7c-8c39-3b8034440001' as const;
export const EXAMPLE_LICENSE_SEAT_UUID_SECONDARY = '8a8a5e1b-0d8e-4a7c-8c39-3b8034440002' as const;
export const EXAMPLE_LICENSE_SEAT_UUID_AVAILABLE = '8a8a5e1b-0d8e-4a7c-8c39-3b8034440009' as const;
export const EXAMPLE_JOB_IDENTIFIER_LICENSE_SEARCH = 'job-license-search-001' as const;
export const EXAMPLE_THREAD_IDENTIFIER_LICENSE_SEARCH = 'thid-license-search-001' as const;
export const EXAMPLE_RELATED_PERSON_IDENTIFIER = 'rel-001' as const;
export const EXAMPLE_DEVICE_CLIENT_ID = 'did:web:device-001' as const;
export const EXAMPLE_LIVE_GW_BASE_URL_LOCAL = 'http://127.0.0.1:3000' as const;
export const EXAMPLE_LIVE_GW_BASE_URL_DOCKER = 'http://127.0.0.1:8000' as const;
export const EXAMPLE_MEDICATION_DOSE_UNIT_MG = 'mg' as const;
export const EXAMPLE_OBSERVATION_IDENTIFIER = 'urn:uuid:observation-example-001' as const;
export const EXAMPLE_OBSERVATION_IDENTIFIER_IPS = 'vs-1' as const;
export const EXAMPLE_OBSERVATION_PANEL_IDENTIFIER = 'urn:uuid:observation-panel-example-001' as const;
export const EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER = 'urn:uuid:observation-component-example-001' as const;
export const EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER_SECONDARY =
  'urn:uuid:observation-component-example-002' as const;
export const EXAMPLE_IPS_COMPOSITION_IDENTIFIER = 'ips-composition' as const;
export const EXAMPLE_CONDITION_IDENTIFIER = 'condition-example-001' as const;
export const EXAMPLE_VITAL_SIGNS_NOTE = 'Measured after rest.' as const;
export const EXAMPLE_FHIR_STATUS_FINAL = 'final' as const;
export const EXAMPLE_FHIR_STATUS_ACTIVE = 'active' as const;
export const EXAMPLE_FHIR_VERIFICATION_STATUS_CONFIRMED = 'confirmed' as const;
export const EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE = 68 as const;
export const EXAMPLE_VITAL_SIGN_VALUE_SYSTOLIC = 120 as const;
export const EXAMPLE_VITAL_SIGN_VALUE_DIASTOLIC = 78 as const;
export const EXAMPLE_VITAL_SIGN_VALUE_BODY_TEMPERATURE = 37.1 as const;
export const EXAMPLE_VITAL_SIGN_UNIT_BEATS_PER_MINUTE = '/min' as const;
export const EXAMPLE_OBSERVATION_CATEGORY_VITAL_SIGNS =
  'http://terminology.hl7.org/CodeSystem/observation-category|vital-signs' as const;
export const EXAMPLE_VITAL_SIGN_CODE_HEART_RATE = '8867-4' as const;
export const EXAMPLE_VITAL_SIGN_CODE_BODY_TEMPERATURE = '8310-5' as const;
export const EXAMPLE_VITAL_SIGN_CODE_BLOOD_PRESSURE_PANEL = '85354-9' as const;
export const EXAMPLE_VITAL_SIGN_CODE_SYSTOLIC_BLOOD_PRESSURE = '8480-6' as const;
export const EXAMPLE_VITAL_SIGN_CODE_DIASTOLIC_BLOOD_PRESSURE = '8462-4' as const;
export const EXAMPLE_VITAL_SIGN_DISPLAY_HEART_RATE = 'Heart rate' as const;
export const EXAMPLE_VITAL_SIGN_DISPLAY_BODY_TEMPERATURE = 'Body temperature' as const;
export const EXAMPLE_VITAL_SIGN_DISPLAY_VITAL_SIGNS = 'Vital Signs' as const;
export const EXAMPLE_VITAL_SIGN_DISPLAY_BLOOD_PRESSURE_PANEL = 'Blood pressure panel' as const;
/** Shared composite tag summary used by blood-pressure parent observation indexing examples. */
export const EXAMPLE_OBSERVATION_COMPONENT_TAGS_BLOOD_PRESSURE = 'bp-systolic,bp-diastolic' as const;
/** Shared component code summary used by blood-pressure parent observation indexing examples. */
export const EXAMPLE_OBSERVATION_COMPONENT_CODE_VALUES_BLOOD_PRESSURE =
  `${EXAMPLE_VITAL_SIGN_CODE_SYSTOLIC_BLOOD_PRESSURE},${EXAMPLE_VITAL_SIGN_CODE_DIASTOLIC_BLOOD_PRESSURE}` as const;
/** Shared human-readable component-name summary used by blood-pressure parent observation indexing examples. */
export const EXAMPLE_OBSERVATION_COMPONENT_NAMES_BLOOD_PRESSURE =
  'Systolic blood pressure,Diastolic blood pressure' as const;
export const EXAMPLE_SOCIAL_HISTORY_CATEGORY = 'http://terminology.hl7.org/CodeSystem/observation-category|social-history' as const;
export const EXAMPLE_OBSERVATION_CODE_TOBACCO_SMOKING_STATUS = '72166-2' as const;
export const EXAMPLE_OBSERVATION_DISPLAY_TOBACCO_SMOKING_STATUS = 'Tobacco smoking status' as const;
export const EXAMPLE_OBSERVATION_VALUE_CONCEPT_NEVER_SMOKER_CODE = '266919005' as const;
export const EXAMPLE_OBSERVATION_VALUE_CONCEPT_NEVER_SMOKER_DISPLAY = 'Never smoker' as const;
export const EXAMPLE_OBSERVATION_VALUE_CONCEPT_NEVER_SMOKER =
  `${FhirCodeSystems.SnomedCt}|${EXAMPLE_OBSERVATION_VALUE_CONCEPT_NEVER_SMOKER_CODE}` as const;
export const EXAMPLE_LAB_PANEL_IDENTIFIER = 'urn:uuid:observation-lab-panel-example-001' as const;
export const EXAMPLE_LAB_RESULT_HEMOGLOBIN_IDENTIFIER = 'urn:uuid:observation-lab-hemoglobin-example-001' as const;
export const EXAMPLE_LAB_RESULT_PLATELET_IDENTIFIER = 'urn:uuid:observation-lab-platelet-example-001' as const;
export const EXAMPLE_LAB_PANEL_CODE_COMPLETE_BLOOD_COUNT = `${FhirCodeSystems.Loinc}|58410-2` as const;
export const EXAMPLE_LAB_PANEL_DISPLAY_COMPLETE_BLOOD_COUNT = 'Complete blood count panel' as const;
export const EXAMPLE_LAB_RESULT_HEMOGLOBIN_CODE = `${FhirCodeSystems.Loinc}|718-7` as const;
export const EXAMPLE_LAB_RESULT_HEMOGLOBIN_DISPLAY = 'Hemoglobin' as const;
export const EXAMPLE_LAB_RESULT_HEMOGLOBIN_VALUE = 13.4 as const;
export const EXAMPLE_LAB_RESULT_HEMOGLOBIN_UNIT = `${FhirCodeSystems.Ucum}|g/dL` as const;
export const EXAMPLE_LAB_RESULT_PLATELET_CODE = `${FhirCodeSystems.Loinc}|777-3` as const;
export const EXAMPLE_LAB_RESULT_PLATELET_DISPLAY = 'Platelets' as const;
export const EXAMPLE_LAB_RESULT_PLATELET_VALUE = 245 as const;
export const EXAMPLE_LAB_RESULT_PLATELET_UNIT = `${FhirCodeSystems.Ucum}|10*3/uL` as const;
export const EXAMPLE_LAB_PANEL_MEMBER_REFERENCES =
  `Observation/${EXAMPLE_LAB_RESULT_HEMOGLOBIN_IDENTIFIER},Observation/${EXAMPLE_LAB_RESULT_PLATELET_IDENTIFIER}` as const;
export const EXAMPLE_BLOOD_PRESSURE_PANEL_MEMBER_REFERENCES =
  `Observation/${EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER},Observation/${EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER_SECONDARY}` as const;
export const EXAMPLE_CONDITION_CODE = 'http://snomed.info/sct|44054006' as const;
export const EXAMPLE_ALLERGY_IDENTIFIER = 'urn:uuid:allergy-example-001' as const;
export const EXAMPLE_ALLERGY_CODE = `${FhirCodeSystems.SnomedCt}|227493005` as const;
export const EXAMPLE_ALLERGY_CATEGORY = 'food' as const;
export const EXAMPLE_ALLERGY_CRITICALITY_HIGH = 'high' as const;
export const EXAMPLE_ALLERGY_ONSET_DATE_TIME = '2026-03-01T09:00:00Z' as const;
export const EXAMPLE_ALLERGY_RECORDER_REFERENCE = 'Practitioner/practitioner-example-010' as const;
export const EXAMPLE_ALLERGY_DOCUMENT_IDENTIFIER = 'docref-allergy-example-001' as const;
export const EXAMPLE_CONDITION_IDENTIFIER_SECONDARY = 'urn:uuid:condition-example-002' as const;
export const EXAMPLE_CONDITION_CATEGORY_PROBLEM_LIST_ITEM = 'problem-list-item' as const;
export const EXAMPLE_CONDITION_SEVERITY = `${FhirCodeSystems.SnomedCt}|24484000` as const;
export const EXAMPLE_CONDITION_ONSET_DATE_TIME = '2026-02-01T08:30:00Z' as const;
export const EXAMPLE_CONDITION_RECORDER_REFERENCE = 'Practitioner/practitioner-example-011' as const;
export const EXAMPLE_CONDITION_DOCUMENT_IDENTIFIER = 'docref-condition-example-001' as const;
export const EXAMPLE_MEDICATION_CODE_RXNORM = 'http://www.nlm.nih.gov/research/umls/rxnorm|860975' as const;
export const EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS = 'h' as const;
export const EXAMPLE_MEDICATION_IBUPROFEN_TEXT = 'Ibuprofen 400 mg' as const;
export const EXAMPLE_MEDICATION_IBUPROFEN_IDENTIFIER_PREFIX = 'urn:uuid:med-ibuprofen' as const;
export const EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE = '2026-06-01T08:00:00Z' as const;
export const EXAMPLE_MEDICATION_IBUPROFEN_NOTE = 'Take every 8 hours as needed. Keep a 4 hour gap from paracetamol.' as const;
export const EXAMPLE_MEDICATION_PARACETAMOL_TEXT = 'Paracetamol 600 mg' as const;
export const EXAMPLE_MEDICATION_PARACETAMOL_IDENTIFIER_PREFIX = 'urn:uuid:med-paracetamol' as const;
export const EXAMPLE_MEDICATION_PARACETAMOL_EFFECTIVE = '2026-06-01T12:00:00Z' as const;
export const EXAMPLE_MEDICATION_PARACETAMOL_NOTE = 'Take every 8 hours as needed. Keep a 4 hour gap from ibuprofen.' as const;
export const EXAMPLE_IMMUNIZATION_IDENTIFIER = 'urn:uuid:immunization-example-001' as const;
export const EXAMPLE_IMMUNIZATION_STATUS_COMPLETED = 'completed' as const;
export const EXAMPLE_IMMUNIZATION_DATE = '2026-06-10T09:30:00Z' as const;
export const EXAMPLE_IMMUNIZATION_VACCINE_CODE = 'http://hl7.org/fhir/sid/cvx|207' as const;
export const EXAMPLE_IMMUNIZATION_LOCATION_REFERENCE = 'Location/location-example-001' as const;
export const EXAMPLE_IMMUNIZATION_MANUFACTURER_REFERENCE = 'Organization/manufacturer-example-001' as const;
export const EXAMPLE_IMMUNIZATION_LOT_NUMBER = 'LOT-2026-001' as const;
export const EXAMPLE_IMMUNIZATION_PERFORMER_REFERENCE = 'Practitioner/practitioner-example-001' as const;
export const EXAMPLE_IMMUNIZATION_REASON_CODE = `${FhirCodeSystems.SnomedCt}|281647001` as const;
export const EXAMPLE_IMMUNIZATION_STATUS_REASON = 'http://terminology.hl7.org/CodeSystem/immunization-status-reason|seriescomplete' as const;
export const EXAMPLE_IMMUNIZATION_TARGET_DISEASE = `${FhirCodeSystems.SnomedCt}|840539006` as const;
export const EXAMPLE_IMMUNIZATION_DOSE_SEQUENCE = '2' as const;
export const EXAMPLE_IMMUNIZATION_SERIES = 'COVID primary series' as const;
export const EXAMPLE_IMMUNIZATION_REACTION_DATE = '2026-06-11T08:00:00Z' as const;
export const EXAMPLE_IMMUNIZATION_NOTE = 'No adverse reaction recorded.' as const;
export const EXAMPLE_PROCEDURE_IDENTIFIER = 'urn:uuid:procedure-example-001' as const;
export const EXAMPLE_PROCEDURE_STATUS_COMPLETED = 'completed' as const;
export const EXAMPLE_PROCEDURE_DATE = '2026-06-12T14:15:00Z' as const;
export const EXAMPLE_PROCEDURE_CODE = `${FhirCodeSystems.SnomedCt}|80146002` as const;
export const EXAMPLE_PROCEDURE_ENCOUNTER_REFERENCE = 'Encounter/encounter-example-001' as const;
export const EXAMPLE_PROCEDURE_LOCATION_REFERENCE = 'Location/location-example-002' as const;
export const EXAMPLE_PROCEDURE_REASON_CODE = `${FhirCodeSystems.SnomedCt}|233604007` as const;
export const EXAMPLE_PROCEDURE_NOTE = 'Procedure tolerated well.' as const;
export const EXAMPLE_PROCEDURE_PERFORMER_REFERENCE = 'Practitioner/practitioner-example-002' as const;
export const EXAMPLE_PROCEDURE_BASED_ON_REFERENCE = 'ServiceRequest/service-request-example-001' as const;
export const EXAMPLE_PROCEDURE_REASON_REFERENCE = 'Condition/condition-example-001' as const;
export const EXAMPLE_DIAGNOSTIC_REPORT_IDENTIFIER = 'urn:uuid:diagnostic-report-example-001' as const;
export const EXAMPLE_DIAGNOSTIC_REPORT_STATUS_FINAL = 'final' as const;
export const EXAMPLE_DIAGNOSTIC_REPORT_DATE = '2026-06-13T11:45:00Z' as const;
export const EXAMPLE_DIAGNOSTIC_REPORT_CATEGORY = 'http://terminology.hl7.org/CodeSystem/v2-0074|LAB' as const;
export const EXAMPLE_DIAGNOSTIC_REPORT_CODE = `${FhirCodeSystems.Loinc}|58410-2` as const;
export const EXAMPLE_DIAGNOSTIC_REPORT_ENCOUNTER_REFERENCE = 'Encounter/encounter-example-002' as const;
export const EXAMPLE_DIAGNOSTIC_REPORT_PERFORMER_REFERENCE = 'Organization/laboratory-example-001' as const;
export const EXAMPLE_DIAGNOSTIC_REPORT_RESULT_REFERENCE = 'Observation/observation-example-101' as const;
export const EXAMPLE_DIAGNOSTIC_REPORT_SPECIMEN_REFERENCE = 'Specimen/specimen-example-001' as const;
export const EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_CONTENT_TYPE = 'application/pdf' as const;
export const EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_DATA_BASE64 = 'JVBERi0xLjcKJUVPRgo=' as const;
export const EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_URL = 'https://clinical.example.org/reports/report-001.pdf' as const;
export const EXAMPLE_DIAGNOSTIC_REPORT_CONTAINED_DOCUMENT_IDENTIFIER = 'docref-example-001' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_TYPE = `${FhirCodeSystems.Loinc}|34133-9` as const;
export const EXAMPLE_DOCUMENT_REFERENCE_CATEGORY = `${FhirCodeSystems.Loinc}|LP173418-7` as const;
export const EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE = 'application/pdf' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_LOCATION = 'https://clinical.example.org/documents/docref-101.pdf' as const;
export const EXAMPLE_DOCUMENT_REFERENCE_AUTHOR = 'Practitioner/practitioner-example-012' as const;
export const EXAMPLE_CARE_PLAN_IDENTIFIER = 'urn:uuid:care-plan-example-001' as const;
export const EXAMPLE_CARE_PLAN_STATUS_ACTIVE = 'active' as const;
export const EXAMPLE_CARE_PLAN_INTENT_PLAN = 'plan' as const;
export const EXAMPLE_CARE_PLAN_CATEGORY = `${FhirCodeSystems.SnomedCt}|736373009` as const;
export const EXAMPLE_CARE_PLAN_DATE = '2026-06-15T09:00:00Z' as const;
export const EXAMPLE_CARE_PLAN_ENCOUNTER_REFERENCE = 'Encounter/encounter-example-003' as const;
export const EXAMPLE_CARE_PLAN_NOTE = 'Daily home exercise plan.' as const;
export const EXAMPLE_FLAG_IDENTIFIER = 'urn:uuid:flag-example-001' as const;
export const EXAMPLE_FLAG_STATUS_ACTIVE = 'active' as const;
export const EXAMPLE_FLAG_CATEGORY = 'http://terminology.hl7.org/CodeSystem/flag-category|safety' as const;
export const EXAMPLE_FLAG_CODE = `${FhirCodeSystems.Loinc}|104605-1` as const;
export const EXAMPLE_FLAG_DATE = '2026-06-16T09:00:00Z' as const;
export const EXAMPLE_FLAG_ENCOUNTER_REFERENCE = 'Encounter/encounter-example-004' as const;
export const EXAMPLE_FLAG_PERIOD_START = '2026-06-16T09:00:00Z' as const;
export const EXAMPLE_FLAG_PERIOD_END = '2026-07-16T09:00:00Z' as const;
export const EXAMPLE_CLINICAL_IMPRESSION_IDENTIFIER = 'urn:uuid:clinical-impression-example-001' as const;
export const EXAMPLE_CLINICAL_IMPRESSION_STATUS_COMPLETED = 'completed' as const;
export const EXAMPLE_CLINICAL_IMPRESSION_DESCRIPTION = 'Post-discharge review.' as const;
export const EXAMPLE_CLINICAL_IMPRESSION_ENCOUNTER_REFERENCE = 'Encounter/encounter-example-005' as const;
export const EXAMPLE_CLINICAL_IMPRESSION_EFFECTIVE_DATE_TIME = '2026-06-17T10:00:00Z' as const;
export const EXAMPLE_CLINICAL_IMPRESSION_ASSESSOR_REFERENCE = 'Practitioner/practitioner-example-013' as const;
export const EXAMPLE_CLINICAL_IMPRESSION_SUMMARY = 'Stable with mild fatigue.' as const;
export const EXAMPLE_DEVICE_IDENTIFIER = 'urn:uuid:device-example-001' as const;
export const EXAMPLE_DEVICE_STATUS_ACTIVE = 'active' as const;
export const EXAMPLE_DEVICE_TYPE = `${FhirCodeSystems.SnomedCt}|706172005` as const;
export const EXAMPLE_DEVICE_MANUFACTURER = 'Medtronic' as const;
export const EXAMPLE_DEVICE_MODEL = 'MiniMed 780G' as const;
export const EXAMPLE_DEVICE_NAME = 'Insulin pump' as const;
export const EXAMPLE_DEVICE_SERIAL_NUMBER = 'SN-12345' as const;
export const EXAMPLE_DEVICE_ORGANIZATION_REFERENCE = 'Organization/organization-example-001' as const;
export const EXAMPLE_DEVICE_LOCATION_REFERENCE = 'Location/location-example-003' as const;
export const EXAMPLE_DEVICE_URL = 'https://device.example.org/catalogue/123' as const;
export const EXAMPLE_DEVICE_NOTE = 'Patient-owned continuous glucose monitor.' as const;
export const EXAMPLE_DEVICE_USE_STATEMENT_IDENTIFIER = 'urn:uuid:device-use-statement-example-001' as const;
export const EXAMPLE_DEVICE_USE_STATEMENT_STATUS_ACTIVE = 'active' as const;
export const EXAMPLE_DEVICE_USE_STATEMENT_RECORDED_ON = '2026-06-18T10:00:00Z' as const;
export const EXAMPLE_DEVICE_USE_STATEMENT_TIMING_DATE_TIME = '2026-06-18T08:00:00Z' as const;
export const EXAMPLE_DEVICE_USE_STATEMENT_REASON_CODE = `${FhirCodeSystems.SnomedCt}|182840001` as const;
export const EXAMPLE_DEVICE_USE_STATEMENT_SOURCE = 'Practitioner/practitioner-example-014' as const;
export const EXAMPLE_ENCOUNTER_IDENTIFIER = 'urn:uuid:encounter-example-001' as const;
export const EXAMPLE_ENCOUNTER_STATUS_FINISHED = 'finished' as const;
export const EXAMPLE_ENCOUNTER_CLASS = 'http://terminology.hl7.org/CodeSystem/v3-ActCode|AMB' as const;
export const EXAMPLE_ENCOUNTER_TYPE = `${FhirCodeSystems.SnomedCt}|185349003` as const;
export const EXAMPLE_ENCOUNTER_PARTICIPANT_REFERENCE = 'Practitioner/practitioner-example-015' as const;
export const EXAMPLE_ENCOUNTER_SERVICE_PROVIDER_REFERENCE = 'Organization/organization-example-002' as const;
export const EXAMPLE_ENCOUNTER_PERIOD_START = '2026-06-19T09:00:00Z' as const;
export const EXAMPLE_ENCOUNTER_PERIOD_END = '2026-06-19T09:30:00Z' as const;
export const EXAMPLE_ENCOUNTER_REASON_CODE = `${FhirCodeSystems.SnomedCt}|65363002` as const;
export const EXAMPLE_COVERAGE_IDENTIFIER = 'urn:uuid:coverage-example-001' as const;
export const EXAMPLE_COVERAGE_STATUS_ACTIVE = 'active' as const;
export const EXAMPLE_COVERAGE_TYPE = 'http://terminology.hl7.org/CodeSystem/v3-ActCode|EHCPOL' as const;
export const EXAMPLE_COVERAGE_POLICY_HOLDER_REFERENCE = 'RelatedPerson/related-person-example-001' as const;
export const EXAMPLE_COVERAGE_SUBSCRIBER_REFERENCE = 'RelatedPerson/related-person-example-001' as const;
export const EXAMPLE_COVERAGE_RELATIONSHIP = 'http://terminology.hl7.org/CodeSystem/subscriber-relationship|self' as const;
export const EXAMPLE_COVERAGE_PERIOD_START = '2026-01-01' as const;
export const EXAMPLE_COVERAGE_PERIOD_END = '2026-12-31' as const;
export const EXAMPLE_COVERAGE_PAYOR_REFERENCE = 'Organization/payer-example-001' as const;
export const EXAMPLE_IPS_BUNDLE_REFERENCE_URL =
  `individual/org.hl7.fhir.r4/Bundle/_search?type=document&composition.subject=${EXAMPLE_SUBJECT_DID}&composition.type=http://loinc.org|60591-5` as const;
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

export type ExampleMedicationIpsDocumentBundleInput = Readonly<{
  subjectDid?: string;
  medication: ExampleLiveMedicationCase;
}>;

export type ExampleMedicationIpsDocumentBundle = Readonly<{
  resourceType: 'Bundle';
  type: 'document';
  entry: ReadonlyArray<{
    resource: Record<string, unknown>;
  }>;
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
            resourceType: ResourceTypesFhirR4.Communication,
            status: 'completed',
            subject: { reference: `Patient/${subjectDid}` },
            category: [{
              coding: [{
                system: CommunicationCategoryCodes.Notification.system,
                code: CommunicationCategoryCodes.Notification.code,
              }],
            }],
            payload: [
              {
                contentAttachment: {
                  contentType: EXAMPLE_CONTENT_TYPE_FHIR_JSON,
                  title: EXAMPLE_IPS_BUNDLE_ATTACHMENT_TITLE,
                  data: ipsBundleBase64,
                },
              },
            ],
            note: [{ text: EXAMPLE_IPS_BUNDLE_NOTE_TEXT }],
            meta: {
              claims: {
                '@context': Format.FHIR_R4,
                [CommunicationClaim.Category]: CommunicationCategoryCodes.Notification.claim,
                [CommunicationClaim.Subject]: subjectDid,
                [CommunicationClaim.Sent]: sent,
                [CommunicationClaim.ContentAttachmentType]: EXAMPLE_CONTENT_TYPE_FHIR_JSON,
                [CommunicationClaim.Text]: EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
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

/**
 * Builds a minimal IPS `Bundle.type=document` containing one
 * `MedicationStatement` under the `History of medication use` section.
 *
 * This helper exists so live GW tests and demos do not handcraft one-off
 * bundle structures inline.
 */
export function buildExampleMedicationIpsDocumentBundle(
  input: ExampleMedicationIpsDocumentBundleInput,
): ExampleMedicationIpsDocumentBundle {
  const subjectDid = input.subjectDid || EXAMPLE_SUBJECT_DID;
  const medicationClaims: Record<string, unknown> = {
    '@context': Format.FHIR_API,
    [MedicationStatementClaim.Identifier]: input.medication.identifier,
    [MedicationStatementClaim.Subject]: subjectDid,
    [MedicationStatementClaim.Status]: EXAMPLE_MEDICATION_STATEMENT_STATUS,
    [MedicationStatementClaim.MedicationText]: input.medication.text,
    [MedicationStatementClaim.Effective]: input.medication.effectiveDateTime,
    [MedicationStatementClaim.Note]: input.medication.note,
    [MedicationStatementClaim.Category]: input.medication.section || HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
    [MedicationStatementClaimsFhirApiExtended.DoseQuantityValue]: input.medication.doseQuantityValue,
    [MedicationStatementClaimsFhirApiExtended.DoseQuantityUnit]: input.medication.doseQuantityUnit,
    [MedicationStatementClaimsFhirApiExtended.TimingFrequency]: input.medication.timingFrequency,
    [MedicationStatementClaimsFhirApiExtended.TimingPeriod]: input.medication.timingPeriod,
    [MedicationStatementClaimsFhirApiExtended.TimingPeriodUnit]: input.medication.timingPeriodUnit,
    [MedicationStatementClaimsFhirApiExtended.DosageAsNeeded]: input.medication.dosageAsNeeded,
  };

  const medicationResource = medicationStatementFlatToFhirR4(medicationClaims as Record<string, string | undefined>);
  medicationResource.id = input.medication.identifier;
  medicationResource.meta = {
    ...(typeof medicationResource.meta === 'object' && medicationResource.meta ? medicationResource.meta : {}),
    claims: medicationClaims,
  };

  return {
    resourceType: ResourceTypesFhirR4.Bundle,
    type: 'document',
    entry: [
      {
        resource: {
          resourceType: ResourceTypesFhirR4.Composition,
          id: `composition-${input.medication.identifier}`,
          status: 'final',
          subject: { reference: subjectDid },
          type: {
            coding: [{
              system: HealthcareDocumentTypes.IPS.system,
              code: HealthcareDocumentTypes.IPS.code,
            }],
          },
          section: [
            {
              code: {
                coding: [{
                  system: LOINC_SYSTEM_URL,
                  code: HealthcareBasicSections.HistoryOfMedicationUse.code,
                }],
              },
              entry: [
                {
                  reference: `MedicationStatement/${input.medication.identifier}`,
                },
              ],
            },
          ],
        },
      },
      {
        resource: {
          resourceType: 'Patient',
          id: `patient-${input.medication.identifier}`,
        },
      },
      {
        resource: medicationResource,
      },
    ],
  };
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
