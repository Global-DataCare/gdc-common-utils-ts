// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import { HealthcareBasicSections } from '../constants/healthcare';
import { CommunicationCategoryCodes } from '../constants/communication';
import { MedicationStatementClaim } from '../models/interoperable-claims/medication-statement-claims';
import { BundleEntry, BundleJsonApi } from '../models/bundle';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_CONSENT_DATE,
  EXAMPLE_CONSENT_IDENTIFIER,
  EXAMPLE_CONSENT_PERIOD_END,
  EXAMPLE_CONSENT_PERIOD_START,
  EXAMPLE_CONSENT_PURPOSE_TREATMENT,
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
  EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
  EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
  EXAMPLE_MEDICATION_STATEMENT_STATUS,
  EXAMPLE_MEDICATION_STATEMENT_TEXT,
  EXAMPLE_SUBJECT_DID,
} from './shared';
import { CommunicationBundleSession } from '../utils/communication-bundle-session';
import {
  setCommunicationCategory,
  setCommunicationIdentifier,
  setCommunicationSubject,
  setCommunicationText,
} from '../claims/claims-helpers-communication';
import {
  setActorIdentifierList,
  setActorRoleList,
  setConsentDate,
  setConsentDecision,
  setConsentIdentifier,
  setConsentPeriodEnd,
  setConsentPeriodStart,
  setConsentSubject,
  setPurposeList,
  setSectionList,
} from '../claims/claims-helpers-consent';

/**
 * First developer use case:
 * - edit a Consent entry inside a Communication-attached Bundle
 * - keep active entry in memory
 * - serialize full Bundle to Communication.content-attachment-data on save
 * - release active entry memory when finished
 */
export function buildConsentEditingCommunicationSessionExample(): {
  communicationClaims: Record<string, unknown>;
  bundleInMemory: BundleJsonApi<BundleEntry>;
} {
  let communicationClaims: Record<string, unknown> = { '@context': 'org.hl7.fhir.r4' };
  communicationClaims = setCommunicationIdentifier(
    communicationClaims,
    EXAMPLE_COMMUNICATION_IDENTIFIER,
  );
  communicationClaims = setCommunicationSubject(
    communicationClaims,
    EXAMPLE_SUBJECT_DID,
  );
  communicationClaims = setCommunicationCategory(
    communicationClaims,
    CommunicationCategoryCodes.Notification.attributeValue,
  );
  communicationClaims = setCommunicationText(
    communicationClaims,
    EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
  );

  const bundleEditor = new CommunicationBundleSession({
    communicationClaims,
  });

  let consentClaims: Record<string, unknown> = { '@context': 'org.hl7.fhir.api' };
  consentClaims = setConsentDecision(consentClaims, 'permit');
  consentClaims = setConsentSubject(consentClaims, EXAMPLE_SUBJECT_DID);
  consentClaims = setConsentIdentifier(consentClaims, EXAMPLE_CONSENT_IDENTIFIER);
  consentClaims = setConsentDate(consentClaims, EXAMPLE_CONSENT_DATE);
  consentClaims = setConsentPeriodStart(consentClaims, EXAMPLE_CONSENT_PERIOD_START);
  consentClaims = setConsentPeriodEnd(consentClaims, EXAMPLE_CONSENT_PERIOD_END);
  consentClaims = setPurposeList(consentClaims, [EXAMPLE_CONSENT_PURPOSE_TREATMENT]);
  consentClaims = setSectionList(consentClaims, [
    HealthcareBasicSections.AllergiesAndIntolerances.attributeValue,
  ]);
  consentClaims = setActorIdentifierList(consentClaims, [EXAMPLE_EMAIL_PROFESSIONAL]);
  consentClaims = setActorRoleList(consentClaims, [EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN]);

  bundleEditor.upsertActiveConsentEntry({
    claims: consentClaims,
    fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
  });

  bundleEditor.saveAndReleaseActiveEntry();

  return {
    communicationClaims: bundleEditor.getCommunicationClaims(),
    bundleInMemory: bundleEditor.getBundleInMemory(),
  };
}

/**
 * Second developer use case:
 * - edit MedicationStatement claims to drive a health view
 * - keep bundle attached to Communication as base64 payload
 * - apply save/release lifecycle consistently
 */
export function buildMedicationEditingCommunicationSessionExample(): {
  communicationClaims: Record<string, unknown>;
  bundleInMemory: BundleJsonApi<BundleEntry>;
} {
  let communicationClaims: Record<string, unknown> = { '@context': 'org.hl7.fhir.r4' };
  communicationClaims = setCommunicationIdentifier(
    communicationClaims,
    EXAMPLE_COMMUNICATION_IDENTIFIER,
  );
  communicationClaims = setCommunicationSubject(
    communicationClaims,
    EXAMPLE_SUBJECT_DID,
  );
  communicationClaims = setCommunicationCategory(
    communicationClaims,
    CommunicationCategoryCodes.Reminder.attributeValue,
  );
  communicationClaims = setCommunicationText(
    communicationClaims,
    EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
  );

  const bundleEditor = new CommunicationBundleSession({
    communicationClaims,
  });

  bundleEditor.upsertActiveMedicationStatementEntry({
    claims: {
      '@context': 'org.hl7.fhir.api',
      [MedicationStatementClaim.Identifier]: EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
      [MedicationStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [MedicationStatementClaim.Status]: EXAMPLE_MEDICATION_STATEMENT_STATUS,
      [MedicationStatementClaim.MedicationText]: EXAMPLE_MEDICATION_STATEMENT_TEXT,
    },
    fullUrl: `urn:uuid:${EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER}`,
  });

  bundleEditor.saveAndReleaseActiveEntry();

  return {
    communicationClaims: bundleEditor.getCommunicationClaims(),
    bundleInMemory: bundleEditor.getBundleInMemory(),
  };
}
