// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  HealthcareActorRoles,
  HealthcareBasicSections,
  HealthcareConsentPurposes,
} from '../constants/healthcare';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';

export const EXAMPLE_INDIVIDUAL_DID_WEB = 'did:web:api.acme.org:individual:123' as const;
export const EXAMPLE_PROVIDER_ORGANIZATION_DID_WEB = 'did:web:hospital.acme.org' as const;
export const EXAMPLE_EMAIL_PROFESSIONAL = 'doctor.oncall@example.org' as const;
export const EXAMPLE_EMAIL_RELATED_PERSON = 'parent.guardian@example.org' as const;
export const EXAMPLE_CONSENT_ACCESS_JURISDICTION = 'ES' as const;

/**
 * Legacy compatibility aliases kept so older docs/tests/imports continue to work
 * while the canonical variable names converge.
 */
export const EXAMPLE_CONSENT_ACCESS_SUBJECT = EXAMPLE_INDIVIDUAL_DID_WEB;
export const EXAMPLE_CONSENT_ACCESS_PROVIDER_DID = EXAMPLE_PROVIDER_ORGANIZATION_DID_WEB;
export const EXAMPLE_CONSENT_ACCESS_PROVIDER_EMAIL = EXAMPLE_EMAIL_PROFESSIONAL;
export const EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL = EXAMPLE_EMAIL_RELATED_PERSON;

function buildRule(input: {
  identifier: string;
  actorIdentifier: string;
  actorRole: string;
  decision?: 'permit' | 'deny';
  purpose: string;
  actions: string[];
  resourceTypes?: string[];
  periodStart?: string;
  periodEnd?: string;
}) {
  return {
    '@context': 'org.hl7.fhir.api',
    'Consent.identifier': input.identifier,
    'Consent.subject': EXAMPLE_INDIVIDUAL_DID_WEB,
    'Consent.actor-identifier': input.actorIdentifier,
    'Consent.actor-role': input.actorRole,
    'Consent.decision': input.decision || 'permit',
    'Consent.purpose': input.purpose,
    'Consent.action': input.actions.join(','),
    ...(input.resourceTypes?.length ? { 'Consent.resourceType': input.resourceTypes.join(',') } : {}),
    ...(input.periodStart ? { 'Consent.period-start': input.periodStart } : {}),
    ...(input.periodEnd ? { 'Consent.period-end': input.periodEnd } : {}),
    'Consent.date': '2026-05-20',
  } as const;
}

export const EXAMPLE_CONSENT_ACCESS_RULES = Object.freeze({
  physicianByEmailContinuousCare: buildRule({
    identifier: 'urn:uuid:consent-physician-email-treatment',
    actorIdentifier: EXAMPLE_EMAIL_PROFESSIONAL,
    actorRole: HealthcareActorRoles.Physician,
    purpose: HealthcareConsentPurposes.Treatment,
    actions: [HealthcareBasicSections.AllergiesAndIntolerances.claim],
    resourceTypes: [ResourceTypesFhirR4.Composition, ResourceTypesFhirR4.AllergyIntolerance],
  }),
  physicianByEmailEmergency: buildRule({
    identifier: 'urn:uuid:consent-physician-email-emergency',
    actorIdentifier: EXAMPLE_EMAIL_PROFESSIONAL,
    actorRole: HealthcareActorRoles.Physician,
    purpose: HealthcareConsentPurposes.EmergencyTreatment,
    actions: [HealthcareBasicSections.PatientSummaryDocument.claim],
    resourceTypes: [ResourceTypesFhirR4.Composition, ResourceTypesFhirR4.DocumentReference],
  }),
  physicianByOrganizationContinuousCare: buildRule({
    identifier: 'urn:uuid:consent-physician-org-treatment',
    actorIdentifier: EXAMPLE_PROVIDER_ORGANIZATION_DID_WEB,
    actorRole: HealthcareActorRoles.Physician,
    purpose: HealthcareConsentPurposes.Treatment,
    actions: [HealthcareBasicSections.Results.claim],
    resourceTypes: [ResourceTypesFhirR4.Composition, ResourceTypesFhirR4.DiagnosticReport],
  }),
  physicianByJurisdictionEmergency: buildRule({
    identifier: 'urn:uuid:consent-physician-jurisdiction-emergency',
    actorIdentifier: EXAMPLE_CONSENT_ACCESS_JURISDICTION,
    actorRole: HealthcareActorRoles.Physician,
    purpose: HealthcareConsentPurposes.EmergencyTreatment,
    actions: [HealthcareBasicSections.PatientSummaryDocument.claim],
    resourceTypes: [ResourceTypesFhirR4.Composition, ResourceTypesFhirR4.DocumentReference],
  }),
  nurseByOrganization: buildRule({
    identifier: 'urn:uuid:consent-nurse-org-treatment',
    actorIdentifier: EXAMPLE_PROVIDER_ORGANIZATION_DID_WEB,
    actorRole: HealthcareActorRoles.NursingProfessional,
    purpose: HealthcareConsentPurposes.Treatment,
    actions: [HealthcareBasicSections.HistoryOfMedicationUse.claim],
    resourceTypes: [ResourceTypesFhirR4.Composition, ResourceTypesFhirR4.MedicationStatement],
  }),
  paramedicByJurisdiction: buildRule({
    identifier: 'urn:uuid:consent-paramedic-jurisdiction-emergency',
    actorIdentifier: EXAMPLE_CONSENT_ACCESS_JURISDICTION,
    actorRole: HealthcareActorRoles.Paramedic,
    purpose: HealthcareConsentPurposes.EmergencyTreatment,
    actions: [HealthcareBasicSections.PatientSummaryDocument.claim],
    resourceTypes: [ResourceTypesFhirR4.Composition, ResourceTypesFhirR4.Observation],
  }),
  directPhysicianDenyInsideAllowedOrganization: buildRule({
    identifier: 'urn:uuid:consent-physician-direct-deny',
    actorIdentifier: EXAMPLE_EMAIL_PROFESSIONAL,
    actorRole: HealthcareActorRoles.Physician,
    decision: 'deny',
    purpose: HealthcareConsentPurposes.Treatment,
    actions: [HealthcareBasicSections.Results.claim],
    resourceTypes: [ResourceTypesFhirR4.DiagnosticReport],
  }),
  relatedPersonByEmail: buildRule({
    identifier: 'urn:uuid:consent-related-person-email',
    actorIdentifier: EXAMPLE_EMAIL_RELATED_PERSON,
    actorRole: 'v3-RoleCode|RESPRSN',
    purpose: HealthcareConsentPurposes.Treatment,
    actions: [HealthcareBasicSections.PatientSummaryDocument.claim],
    resourceTypes: [ResourceTypesFhirR4.Composition, ResourceTypesFhirR4.DocumentReference],
  }),
  revokedPhysicianEmailConsent: buildRule({
    identifier: 'urn:uuid:consent-physician-email-revoked',
    actorIdentifier: EXAMPLE_EMAIL_PROFESSIONAL,
    actorRole: HealthcareActorRoles.Physician,
    purpose: HealthcareConsentPurposes.EmergencyTreatment,
    actions: [HealthcareBasicSections.PatientSummaryDocument.claim],
    periodEnd: '2026-05-01T00:00:00Z',
  }),
});

export const EXAMPLE_CONSENT_PHONE_EXTENSION_PENDING = Object.freeze({
  target: 'tel:+34600111222',
  status: 'pending-extension',
  reason: 'telephone actor targeting remains an extension concern unless the sector/runtime explicitly enables it',
});
