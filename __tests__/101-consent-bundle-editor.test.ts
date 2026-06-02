import { describe, expect, it } from '@jest/globals';

import { CommunicationCategoryCodes } from '../src/constants/communication.js';
import { HealthcareActorRoles, HealthcareBasicSections, HealthcareConsentPurposes } from '../src/constants/healthcare.js';
import { ClaimConsent } from '../src/models/consent-rule.js';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims.js';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_CONSENT_DATE,
  EXAMPLE_CONSENT_IDENTIFIER,
  EXAMPLE_CONSENT_PERIOD_END,
  EXAMPLE_CONSENT_PERIOD_START,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared.js';
import {
  setCommunicationCategory,
  setCommunicationIdentifier,
  setCommunicationSubject,
} from '../src/utils/communication-claim-helpers.js';
import {
  addSectionList,
  getActorRoleList,
  getPurposeList,
  getSectionList,
  setConsentDate,
  setConsentDecision,
  setConsentIdentifier,
  setConsentPeriodEnd,
  setConsentPeriodStart,
  setConsentSubject,
  setPurposeList,
  setActorRoleList,
  setSectionList,
} from '../src/utils/consent-claim-helpers.js';
import { CommunicationBundleSession } from '../src/utils/communication-bundle-session.js';

describe('101: consent bundle editor', () => {
  it('creates or edits one Consent inside a Communication bundle step by step', () => {
    // Step 1.
    // Frontend/runtime already has the Communication wrapper or creates one.
    // The in-memory bundle editor is the canonical unit for editing the
    // permissions bundle carried in Communication.content-attachment-data.
    let communicationBaseClaims: Record<string, unknown> = { '@context': 'org.hl7.fhir.r4' };
    communicationBaseClaims = setCommunicationIdentifier(
      communicationBaseClaims,
      EXAMPLE_COMMUNICATION_IDENTIFIER,
    );
    communicationBaseClaims = setCommunicationSubject(
      communicationBaseClaims,
      EXAMPLE_SUBJECT_DID,
    );
    communicationBaseClaims = setCommunicationCategory(
      communicationBaseClaims,
      CommunicationCategoryCodes.Notification.attributeValue,
    );

    const bundleEditor = new CommunicationBundleSession({
      communicationClaims: communicationBaseClaims,
    });

    // Step 2.
    // Create or upsert one Consent entry in the bundle. This is the consent the
    // user selected or the consent the UI is creating now.
    let consentBaseClaims: Record<string, unknown> = { '@context': 'org.hl7.fhir.api' };
    consentBaseClaims = setConsentDecision(consentBaseClaims, 'permit');
    consentBaseClaims = setConsentSubject(consentBaseClaims, EXAMPLE_SUBJECT_DID);
    consentBaseClaims = setConsentIdentifier(consentBaseClaims, EXAMPLE_CONSENT_IDENTIFIER);
    consentBaseClaims = setConsentDate(consentBaseClaims, EXAMPLE_CONSENT_DATE);
    consentBaseClaims = setConsentPeriodStart(consentBaseClaims, EXAMPLE_CONSENT_PERIOD_START);
    consentBaseClaims = setConsentPeriodEnd(consentBaseClaims, EXAMPLE_CONSENT_PERIOD_END);

    bundleEditor.upsertActiveConsentEntry({
      claims: consentBaseClaims,
      fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
    });

    // Step 3.
    // Read the currently selected Consent claims from the active bundle entry.
    const activeConsentClaims = {
      ...(bundleEditor.getActiveEntry()?.resource?.meta?.claims || {}),
    };

    // Step 4.
    // Use the simple get/set/add List helpers to edit the CSV flat claims.
    let nextConsentClaims = setPurposeList(activeConsentClaims, [HealthcareConsentPurposes.Treatment]);
    nextConsentClaims = setActorRoleList(nextConsentClaims, [HealthcareActorRoles.Physician]);
    nextConsentClaims = setSectionList(nextConsentClaims, [
      HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
    ]);
    nextConsentClaims = addSectionList(nextConsentClaims, [
      HealthcareBasicSections.Results.attributeValue,
    ]);

    // Step 5.
    // Patch the edited claims back into the active bundle entry and save.
    bundleEditor.patchActiveEntryClaims(nextConsentClaims);
    bundleEditor.saveAndReleaseActiveEntry();

    // Step 6.
    // Assertions: the edited Consent is now persisted inside the
    // Communication-attached bundle and ready to be sent or rendered again.
    const communicationClaims = bundleEditor.getCommunicationClaims();
    const decodedBundle = JSON.parse(
      Buffer.from(String(communicationClaims[CommunicationClaim.ContentAttachmentData]), 'base64').toString('utf8'),
    );
    const savedConsentClaims = decodedBundle.data[0].resource.meta.claims;

    expect(getPurposeList(savedConsentClaims)).toEqual([HealthcareConsentPurposes.Treatment]);
    expect(getActorRoleList(savedConsentClaims)).toEqual([HealthcareActorRoles.Physician]);
    expect(getSectionList(savedConsentClaims)).toEqual([
      HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
      HealthcareBasicSections.Results.attributeValue,
    ]);
    expect(savedConsentClaims[ClaimConsent.identifier]).toBe(EXAMPLE_CONSENT_IDENTIFIER);
  });
});
