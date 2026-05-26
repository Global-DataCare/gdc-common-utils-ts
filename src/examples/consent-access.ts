// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  HealthcareActorRoles,
  HealthcareBasicSections,
  HealthcareConsentPurposes,
} from '../constants/healthcare';
import { ClaimConsent, type ConsentRule } from '../models/consent-rule';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import {
  EXAMPLE_CONSENT_DATE,
  EXAMPLE_CONSENT_PERIOD_END,
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_EMAIL_RELATED_PERSON,
  EXAMPLE_HEALTHCARE_JURISDICTION,
  EXAMPLE_PROVIDER_ORGANIZATION_DID,
  EXAMPLE_RELATED_PERSON_ROLE,
  EXAMPLE_SUBJECT_DID,
} from './shared';

export const EXAMPLE_INDIVIDUAL_DID_WEB = EXAMPLE_SUBJECT_DID;
export const EXAMPLE_PROVIDER_ORGANIZATION_DID_WEB = EXAMPLE_PROVIDER_ORGANIZATION_DID;
export { EXAMPLE_EMAIL_PROFESSIONAL, EXAMPLE_EMAIL_RELATED_PERSON };
export const EXAMPLE_CONSENT_ACCESS_JURISDICTION = EXAMPLE_HEALTHCARE_JURISDICTION;

/**
 * Legacy compatibility aliases kept so older docs/tests/imports continue to work
 * while the canonical variable names converge.
 */
export const EXAMPLE_CONSENT_ACCESS_SUBJECT = EXAMPLE_INDIVIDUAL_DID_WEB;
export const EXAMPLE_CONSENT_ACCESS_PROVIDER_DID = EXAMPLE_PROVIDER_ORGANIZATION_DID_WEB;
export const EXAMPLE_CONSENT_ACCESS_PROVIDER_EMAIL = EXAMPLE_EMAIL_PROFESSIONAL;
export const EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL = EXAMPLE_EMAIL_RELATED_PERSON;

/**
 * Consent example builder used by docs/tests.
 *
 * Contract note:
 * repeated actor identifiers, dates, jurisdictions, role fixtures, and
 * canonical consent claim keys must be imported, never re-hardcoded inline in
 * each example rule.
 */
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
}): ConsentRule & Partial<Record<typeof ClaimConsent.resourceType, string>> {
  return {
    '@context': 'org.hl7.fhir.api',
    [ClaimConsent.identifier]: input.identifier,
    [ClaimConsent.subject]: EXAMPLE_INDIVIDUAL_DID_WEB,
    [ClaimConsent.actorIdentifier]: input.actorIdentifier,
    [ClaimConsent.actorRole]: input.actorRole,
    [ClaimConsent.decision]: input.decision || 'permit',
    [ClaimConsent.purpose]: input.purpose,
    [ClaimConsent.action]: input.actions.join(','),
    ...(input.resourceTypes?.length ? { [ClaimConsent.resourceType]: input.resourceTypes.join(',') } : {}),
    ...(input.periodStart ? { [ClaimConsent.periodStart]: input.periodStart } : {}),
    ...(input.periodEnd ? { [ClaimConsent.periodEnd]: input.periodEnd } : {}),
    [ClaimConsent.date]: EXAMPLE_CONSENT_DATE,
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
    actorRole: EXAMPLE_RELATED_PERSON_ROLE,
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
    periodEnd: EXAMPLE_CONSENT_PERIOD_END,
  }),
});

export const EXAMPLE_CONSENT_PHONE_EXTENSION_PENDING = Object.freeze({
  target: 'tel:+34600111222',
  status: 'pending-extension',
  reason: 'telephone actor targeting remains an extension concern unless the sector/runtime explicitly enables it',
});
