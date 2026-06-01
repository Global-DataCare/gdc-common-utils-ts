// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import { HealthcareBasicSections } from '../constants/healthcare';
import { CommunicationCategoryCodes } from '../constants/communication';
import { ClaimConsent } from '../models/consent-rule';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';
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
  EXAMPLE_MEDICATION_STATEMENT_CODE,
  EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
  EXAMPLE_MEDICATION_STATEMENT_STATUS,
  EXAMPLE_MEDICATION_STATEMENT_TEXT,
  EXAMPLE_SUBJECT_DID,
} from './shared';
import { CommunicationBundleSession } from '../utils/communication-bundle-session';

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
  const session = new CommunicationBundleSession({
    communicationClaims: {
      '@context': 'org.hl7.fhir.r4',
      [CommunicationClaim.Identifier]: EXAMPLE_COMMUNICATION_IDENTIFIER,
      [CommunicationClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [CommunicationClaim.Category]: CommunicationCategoryCodes.Notification.claim,
      [CommunicationClaim.Text]: EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
    },
  });

  session.upsertActiveConsentEntry({
    claims: {
      '@context': 'org.hl7.fhir.api',
      [ClaimConsent.decision]: 'permit',
      [ClaimConsent.subject]: EXAMPLE_SUBJECT_DID,
      [ClaimConsent.identifier]: EXAMPLE_CONSENT_IDENTIFIER,
      [ClaimConsent.date]: EXAMPLE_CONSENT_DATE,
      [ClaimConsent.periodStart]: EXAMPLE_CONSENT_PERIOD_START,
      [ClaimConsent.periodEnd]: EXAMPLE_CONSENT_PERIOD_END,
      [ClaimConsent.purpose]: EXAMPLE_CONSENT_PURPOSE_TREATMENT,
      [ClaimConsent.action]: HealthcareBasicSections.AllergiesAndIntolerances.claim,
      [ClaimConsent.actorIdentifier]: EXAMPLE_EMAIL_PROFESSIONAL,
      [ClaimConsent.actorRole]: EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
    },
    fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
  });

  session.saveAndReleaseActiveEntry();

  return {
    communicationClaims: session.getCommunicationClaims(),
    bundleInMemory: session.getBundleInMemory(),
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
  const session = new CommunicationBundleSession({
    communicationClaims: {
      '@context': 'org.hl7.fhir.r4',
      [CommunicationClaim.Identifier]: EXAMPLE_COMMUNICATION_IDENTIFIER,
      [CommunicationClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [CommunicationClaim.Category]: CommunicationCategoryCodes.Reminder.claim,
      [CommunicationClaim.Text]: EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
    },
  });

  session.upsertActiveMedicationStatementEntry({
    claims: {
      '@context': 'org.hl7.fhir.api',
      [MedicationStatementClaim.Identifier]: EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
      [MedicationStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [MedicationStatementClaim.Status]: EXAMPLE_MEDICATION_STATEMENT_STATUS,
      [MedicationStatementClaim.Code]: EXAMPLE_MEDICATION_STATEMENT_CODE,
      [MedicationStatementClaim.MedicationText]: EXAMPLE_MEDICATION_STATEMENT_TEXT,
    },
    fullUrl: `urn:uuid:${EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER}`,
  });

  session.saveAndReleaseActiveEntry();

  return {
    communicationClaims: session.getCommunicationClaims(),
    bundleInMemory: session.getBundleInMemory(),
  };
}
