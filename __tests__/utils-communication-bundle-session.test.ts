import { describe, expect, it } from '@jest/globals';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { HealthcareBasicSections } from '../src/constants/healthcare.js';
import { CommunicationCategoryCodes } from '../src/constants/communication.js';
import { ClaimConsent } from '../src/models/consent-rule.js';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
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
} from '../src/examples/shared.js';
import { CommunicationBundleSession } from '../src/utils/communication-bundle-session.js';

describe('utils/communication-bundle-session', () => {
  it('keeps consent as activeEntry, syncs attachment base64, and releases memory on save', () => {
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

    expect(session.getActiveEntryIndex()).toBe(0);
    expect(session.getActiveEntry()?.resource?.resourceType).toBe(ResourceTypesFhirR4.Consent);

    session.saveAndReleaseActiveEntry();

    expect(session.getActiveEntry()).toBeNull();

    const claims = session.getCommunicationClaims();
    expect(claims[CommunicationClaim.ContentAttachmentType]).toBe('application/fhir+json');
    expect(typeof claims[CommunicationClaim.ContentAttachmentData]).toBe('string');

    const decoded = JSON.parse(
      Buffer.from(String(claims[CommunicationClaim.ContentAttachmentData]), 'base64').toString('utf8'),
    );

    expect(decoded.resourceType).toBe(ResourceTypesFhirR4.Bundle);
    expect(decoded.data).toHaveLength(1);
    expect(decoded.data[0].resource.resourceType).toBe(ResourceTypesFhirR4.Consent);
    expect(decoded.data[0].resource.meta.claims[ClaimConsent.identifier]).toBe(EXAMPLE_CONSENT_IDENTIFIER);
  });

  it('updates medication claim entry and keeps IPS bundle synced in communication attachment', () => {
    const session = new CommunicationBundleSession({
      communicationClaims: {
        '@context': 'org.hl7.fhir.r4',
        [CommunicationClaim.Identifier]: EXAMPLE_COMMUNICATION_IDENTIFIER,
        [CommunicationClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [CommunicationClaim.Category]: CommunicationCategoryCodes.Reminder.claim,
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

    session.patchActiveEntryClaims({
      [MedicationStatementClaim.Note]: EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
    });
    session.saveAndReleaseActiveEntry();

    const claims = session.getCommunicationClaims();
    const decoded = JSON.parse(
      Buffer.from(String(claims[CommunicationClaim.ContentAttachmentData]), 'base64').toString('utf8'),
    );

    expect(decoded.data).toHaveLength(1);
    expect(decoded.data[0].resource.resourceType).toBe(ResourceTypesFhirR4.MedicationStatement);
    expect(decoded.data[0].resource.meta.claims[MedicationStatementClaim.Identifier]).toBe(EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER);
    expect(decoded.data[0].resource.meta.claims[MedicationStatementClaim.Note]).toBe(EXAMPLE_IPS_BUNDLE_NOTE_TEXT);
  });

  it('returns resource IDs filtered by section, resourceType and date range, and resolves entries by IDs', () => {
    const session = new CommunicationBundleSession({
      communicationClaims: {
        '@context': 'org.hl7.fhir.r4',
        [CommunicationClaim.Identifier]: EXAMPLE_COMMUNICATION_IDENTIFIER,
      },
    });

    session.upsertActiveConsentEntry({
      claims: {
        '@context': 'org.hl7.fhir.api',
        [ClaimConsent.identifier]: 'consent-A',
        [ClaimConsent.subject]: EXAMPLE_SUBJECT_DID,
        [ClaimConsent.date]: '2026-06-01',
        [ClaimConsent.action]: HealthcareBasicSections.AllergiesAndIntolerances.claim,
      },
      fullUrl: 'urn:uuid:consent-A',
    });

    session.upsertActiveMedicationStatementEntry({
      claims: {
        '@context': 'org.hl7.fhir.api',
        [MedicationStatementClaim.Identifier]: 'med-B',
        [MedicationStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [MedicationStatementClaim.Effective]: '2026-07-10',
        [MedicationStatementClaim.Category]: HealthcareBasicSections.HistoryOfMedicationUse.claim,
      },
      fullUrl: 'urn:uuid:med-B',
    });

    session.saveAndReleaseActiveEntry();

    const filteredIds = session.getResourceIds({
      sections: [HealthcareBasicSections.HistoryOfMedicationUse.claim],
      resourceTypes: [ResourceTypesFhirR4.MedicationStatement],
      dateFrom: '2026-07-01',
      dateTo: '2026-07-31',
    });

    expect(filteredIds).toEqual(['med-B']);

    const entries = session.getResourceEntriesByIds(filteredIds);
    expect(entries).toHaveLength(1);
    expect(entries[0].resource?.resourceType).toBe(ResourceTypesFhirR4.MedicationStatement);
    expect(entries[0].resource?.meta?.claims?.[MedicationStatementClaim.Identifier]).toBe('med-B');

    expect(session.getEntryUrl('med-B')).toBe('urn:uuid:med-B');
    expect(session.getEntryUrl('unknown-id')).toBeUndefined();
  });
});
