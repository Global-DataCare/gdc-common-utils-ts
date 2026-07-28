// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  HealthcareActorRoles,
  HealthcareBasicSections,
  HealthcareConsentActions,
  HealthcareConsentPurposes,
} from '../constants/healthcare';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { buildSmartCompositionReadScope } from '../utils/smart-scope';
import {
  EXAMPLE_CLINICAL_SECTION_ALLERGIES,
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_HEALTHCARE_JURISDICTION,
  EXAMPLE_PATIENT_DID,
  EXAMPLE_PROVIDER_ORGANIZATION_URL,
  EXAMPLE_SUBJECT_DID,
} from './shared';

/**
 * Examples for professional runtime access flows.
 *
 * These examples intentionally separate:
 *
 * - the actor role of the professional (`Physician`, `NursingProfessional`, ...)
 * - the consented action/section over an individual subject
 * - the SMART scope ultimately requested against GW CORE
 * - a read scope containing only capabilities covered by the consent
 *
 * This differs from organization-controller and individual-owner bootstrap
 * examples, where the main concern is identity/bootstrap rather than
 * professional clinical access permissions.
 */

const EXAMPLE_SMART_SUBJECT_DID = EXAMPLE_SUBJECT_DID;
const EXAMPLE_PHYSICIAN_EMAIL = EXAMPLE_EMAIL_PROFESSIONAL;
const EXAMPLE_PROVIDER_ORG_URL = EXAMPLE_PROVIDER_ORGANIZATION_URL;
const EXAMPLE_JURISDICTION = EXAMPLE_HEALTHCARE_JURISDICTION;
const EXAMPLE_CANONICAL_SMART_READ_SCOPES = [
  buildSmartCompositionReadScope({
    subjectDid: EXAMPLE_SMART_SUBJECT_DID,
    sections: EXAMPLE_CLINICAL_SECTION_ALLERGIES,
  }),
] as const;

export const EXAMPLE_TOKEN_EXCHANGE_SMART_INPUT = {
  idToken: 'employee-id-token-001',
  scopes: [...EXAMPLE_CANONICAL_SMART_READ_SCOPES],
  timeoutSeconds: 5,
  intervalSeconds: 1,
} as const;

export const EXAMPLE_OPENID_SMART_TOKEN_INPUT = {
  idToken: 'employee-id-token-001',
  vpToken: '<vp-jws-or-jsonld>',
  scopes: [...EXAMPLE_CANONICAL_SMART_READ_SCOPES],
  smartTokenKind: 'openid-smart',
  clientId: 'device-1',
  subjectDid: EXAMPLE_SMART_SUBJECT_DID,
} as const;

export const EXAMPLE_SMART_PRESENTATION_SUBMISSION = {
  id: 'ps-001',
  definition_id: 'pd-001',
  descriptor_map: [{ id: 'vp-credential', format: 'jwt_vp', path: '$.vp_token' }],
} as const;

export const EXAMPLE_SMART_TOKEN_RESPONSE = {
  submit: { status: 202, body: {} },
  poll: {
    status: 200,
    body: {
      access_token: 'smart-token-openid-001',
      token_type: 'Bearer',
      scope: EXAMPLE_CANONICAL_SMART_READ_SCOPES.join(' '),
      expires_in: 3600,
    },
    attempts: 1,
  },
} as const;

export const EXAMPLE_TOKEN_EXCHANGE_RESPONSE = {
  submit: { status: 202, body: {} },
  poll: {
    status: 200,
    body: {
      access_token: 'smart-token-ctx-001',
      token_type: 'Bearer',
      scope: EXAMPLE_CANONICAL_SMART_READ_SCOPES.join(' '),
      expires_in: 3600,
    },
    attempts: 1,
  },
} as const;

export const EXAMPLE_SEND_COMMUNICATION_INPUT = {
  subject: EXAMPLE_PATIENT_DID,
  text: 'Message body',
} as const;

export const EXAMPLE_SEARCH_CLINICAL_BUNDLE_INPUT = {
  subject: EXAMPLE_PATIENT_DID,
  includedTypes: ['Communication', 'DocumentReference'],
} as const;

/**
 * Reusable role/permission examples for clinical access over an individual.
 *
 * These are intended as copy-paste fixtures for docs/tests when explaining:
 *
 * - which professional is acting
 * - what consent purpose/action was granted
 * - what SMART scope is being requested
 * - which FHIR resource types are expected to be relevant after access
 *
 * Teaching rule:
 *
 * - use `EXAMPLE_TOKEN_EXCHANGE_SMART_INPUT` or `EXAMPLE_OPENID_SMART_TOKEN_INPUT`
 *   for the first read-only examples
 * - do not append `organization/Consent.cruds` to a clinical read unless a
 *   separate rule explicitly grants that resource capability
 */
export const EXAMPLE_PROFESSIONAL_ACCESS_SCENARIOS = Object.freeze({
  physicianAllergiesRead: {
    actorRole: HealthcareActorRoles.GeneralistMedicalPractitioner,
    purpose: HealthcareConsentPurposes.Treatment,
    consentActions: [HealthcareConsentActions.AllergiesAndIntolerances],
    smartScopes: [
      buildSmartCompositionReadScope({
        subjectDid: EXAMPLE_SMART_SUBJECT_DID,
        sections: HealthcareConsentActions.AllergiesAndIntolerances,
      }),
    ],
    includedTypes: [
      ResourceTypesFhirR4.Composition,
      ResourceTypesFhirR4.AllergyIntolerance,
      ResourceTypesFhirR4.DocumentReference,
    ],
  },
  nursingMedicationRead: {
    actorRole: HealthcareActorRoles.NursingProfessional,
    purpose: HealthcareConsentPurposes.Treatment,
    consentActions: [HealthcareBasicSections.HistoryOfMedicationUse.claim],
    smartScopes: [
      buildSmartCompositionReadScope({
        subjectDid: EXAMPLE_SMART_SUBJECT_DID,
        sections: HealthcareBasicSections.HistoryOfMedicationUse.claim,
      }),
    ],
    includedTypes: [
      ResourceTypesFhirR4.Composition,
      ResourceTypesFhirR4.MedicationStatement,
      ResourceTypesFhirR4.DocumentReference,
    ],
  },
  paramedicEmergencySummaryRead: {
    actorRole: HealthcareActorRoles.Paramedic,
    purpose: HealthcareConsentPurposes.EmergencyTreatment,
    consentActions: [HealthcareBasicSections.PatientSummaryDocument.claim],
    smartScopes: [
      buildSmartCompositionReadScope({
        subjectDid: EXAMPLE_SMART_SUBJECT_DID,
        sections: HealthcareBasicSections.PatientSummaryDocument.claim,
      }),
    ],
    includedTypes: [
      ResourceTypesFhirR4.Composition,
      ResourceTypesFhirR4.DocumentReference,
      ResourceTypesFhirR4.Observation,
    ],
  },
  physicianResultsAndProblemsRead: {
    actorRole: HealthcareActorRoles.GeneralistMedicalPractitioner,
    purpose: HealthcareConsentPurposes.Treatment,
    consentActions: [
      HealthcareBasicSections.Results.claim,
      HealthcareBasicSections.ProblemList.claim,
    ],
    smartScopes: [
      buildSmartCompositionReadScope({
        subjectDid: EXAMPLE_SMART_SUBJECT_DID,
        sections: [
          HealthcareBasicSections.Results.claim,
          HealthcareBasicSections.ProblemList.claim,
        ],
      }),
    ],
    includedTypes: [
      ResourceTypesFhirR4.Composition,
      ResourceTypesFhirR4.Condition,
      ResourceTypesFhirR4.DiagnosticReport,
      ResourceTypesFhirR4.DocumentReference,
    ],
  },
} as const);

function buildConsentDecisionScenario(params: {
  actorId: string | { email?: string; organizationUrl?: string };
  actorRole: string;
  purpose: string;
  consentActions: string[];
  requestedSections: string | string[];
  includedTypes: readonly string[];
  expectedSmartTokenDecision: 'allowed' | 'denied';
  reason: string;
}) {
  return Object.freeze({
    actorId: params.actorId,
    actorRole: params.actorRole,
    purpose: params.purpose,
    consentActions: [...params.consentActions],
    smartScopes: [
      buildSmartCompositionReadScope({
        subjectDid: EXAMPLE_SMART_SUBJECT_DID,
        sections: params.requestedSections,
      }),
    ],
    includedTypes: [...params.includedTypes],
    expectedSmartTokenDecision: params.expectedSmartTokenDecision,
    reason: params.reason,
  });
}

/**
 * Reusable consent-vs-SMART examples that model:
 *
 * - who receives the consent (`actorId`)
 * - under which role
 * - for which purpose
 * - over which sections/actions
 * - and whether a later SMART request should be accepted or denied
 *
 * This is the right level for testing the live rule:
 * consent state + actor target + role + purpose + requested scope.
 */
export const EXAMPLE_PROFESSIONAL_CONSENT_SCENARIOS = Object.freeze({
  physicianByEmailContinuousCareAllergiesAllowed: buildConsentDecisionScenario({
    actorId: EXAMPLE_PHYSICIAN_EMAIL,
    actorRole: HealthcareActorRoles.GeneralistMedicalPractitioner,
    purpose: HealthcareConsentPurposes.Treatment,
    consentActions: [HealthcareBasicSections.AllergiesAndIntolerances.claim],
    requestedSections: HealthcareBasicSections.AllergiesAndIntolerances.claim,
    includedTypes: [
      ResourceTypesFhirR4.Composition,
      ResourceTypesFhirR4.AllergyIntolerance,
      ResourceTypesFhirR4.DocumentReference,
    ],
    expectedSmartTokenDecision: 'allowed',
    reason: 'physician is targeted directly by email and role for continuous care over allergies section',
  }),
  physicianByEmailEmergencySummaryAllowed: buildConsentDecisionScenario({
    actorId: EXAMPLE_PHYSICIAN_EMAIL,
    actorRole: HealthcareActorRoles.GeneralistMedicalPractitioner,
    purpose: HealthcareConsentPurposes.EmergencyTreatment,
    consentActions: [HealthcareBasicSections.PatientSummaryDocument.claim],
    requestedSections: HealthcareBasicSections.PatientSummaryDocument.claim,
    includedTypes: [
      ResourceTypesFhirR4.Composition,
      ResourceTypesFhirR4.DocumentReference,
      ResourceTypesFhirR4.Observation,
    ],
    expectedSmartTokenDecision: 'allowed',
    reason: 'physician is targeted directly by email and role for emergency summary access',
  }),
  physicianByOrganizationResultsAllowed: buildConsentDecisionScenario({
    actorId: { organizationUrl: EXAMPLE_PROVIDER_ORG_URL },
    actorRole: HealthcareActorRoles.GeneralistMedicalPractitioner,
    purpose: HealthcareConsentPurposes.Treatment,
    consentActions: [HealthcareBasicSections.Results.claim],
    requestedSections: HealthcareBasicSections.Results.claim,
    includedTypes: [
      ResourceTypesFhirR4.Composition,
      ResourceTypesFhirR4.DiagnosticReport,
      ResourceTypesFhirR4.DocumentReference,
    ],
    expectedSmartTokenDecision: 'allowed',
    reason: 'consent is granted to a physician role within a given organization for continuous care results access',
  }),
  physicianByJurisdictionEmergencySummaryAllowed: buildConsentDecisionScenario({
    actorId: EXAMPLE_JURISDICTION,
    actorRole: HealthcareActorRoles.GeneralistMedicalPractitioner,
    purpose: HealthcareConsentPurposes.EmergencyTreatment,
    consentActions: [HealthcareBasicSections.PatientSummaryDocument.claim],
    requestedSections: HealthcareBasicSections.PatientSummaryDocument.claim,
    includedTypes: [
      ResourceTypesFhirR4.Composition,
      ResourceTypesFhirR4.DocumentReference,
      ResourceTypesFhirR4.Observation,
    ],
    expectedSmartTokenDecision: 'allowed',
    reason: 'consent is granted at jurisdiction level for physician emergency access',
  }),
  nursingByOrganizationMedicationHistoryAllowed: buildConsentDecisionScenario({
    actorId: { organizationUrl: EXAMPLE_PROVIDER_ORG_URL },
    actorRole: HealthcareActorRoles.NursingProfessional,
    purpose: HealthcareConsentPurposes.Treatment,
    consentActions: [HealthcareBasicSections.HistoryOfMedicationUse.claim],
    requestedSections: HealthcareBasicSections.HistoryOfMedicationUse.claim,
    includedTypes: [
      ResourceTypesFhirR4.Composition,
      ResourceTypesFhirR4.MedicationStatement,
      ResourceTypesFhirR4.DocumentReference,
    ],
    expectedSmartTokenDecision: 'allowed',
    reason: 'nursing professional is allowed to read medication history for treatment through organization-scoped consent',
  }),
  paramedicByJurisdictionEmergencySummaryAllowed: buildConsentDecisionScenario({
    actorId: EXAMPLE_JURISDICTION,
    actorRole: HealthcareActorRoles.Paramedic,
    purpose: HealthcareConsentPurposes.EmergencyTreatment,
    consentActions: [HealthcareBasicSections.PatientSummaryDocument.claim],
    requestedSections: HealthcareBasicSections.PatientSummaryDocument.claim,
    includedTypes: [
      ResourceTypesFhirR4.Composition,
      ResourceTypesFhirR4.DocumentReference,
      ResourceTypesFhirR4.Observation,
    ],
    expectedSmartTokenDecision: 'allowed',
    reason: 'paramedic receives emergency-only jurisdiction-scoped access to patient summary',
  }),
  physicianObstetricianDeniedWhenOnlyAllergiesConsent: buildConsentDecisionScenario({
    actorId: EXAMPLE_PHYSICIAN_EMAIL,
    actorRole: `${HealthcareActorRoles.GeneralistMedicalPractitioner}:obstetrician`,
    purpose: HealthcareConsentPurposes.Treatment,
    consentActions: [HealthcareBasicSections.AllergiesAndIntolerances.claim],
    requestedSections: HealthcareBasicSections.Results.claim,
    includedTypes: [
      ResourceTypesFhirR4.Composition,
      ResourceTypesFhirR4.DiagnosticReport,
      ResourceTypesFhirR4.DocumentReference,
    ],
    expectedSmartTokenDecision: 'denied',
    reason: 'requested SMART scope targets results but active consent only covers allergies section',
  }),
  physicianByEmailDeniedWhenConsentRevokedAndNoOrgNorJurisdictionConsentIsActive: buildConsentDecisionScenario({
    actorId: EXAMPLE_PHYSICIAN_EMAIL,
    actorRole: HealthcareActorRoles.GeneralistMedicalPractitioner,
    purpose: HealthcareConsentPurposes.EmergencyTreatment,
    consentActions: [HealthcareBasicSections.PatientSummaryDocument.claim],
    requestedSections: HealthcareBasicSections.PatientSummaryDocument.claim,
    includedTypes: [
      ResourceTypesFhirR4.Composition,
      ResourceTypesFhirR4.DocumentReference,
    ],
    expectedSmartTokenDecision: 'denied',
    reason: 'matching consent rule existed before but is no longer active after controller deactivation/revocation',
  }),
} as const);
