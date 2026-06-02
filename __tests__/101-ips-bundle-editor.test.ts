import { describe, expect, it } from '@jest/globals';

import { CommunicationCategoryCodes } from '../src/constants/communication.js';
import { HealthcareBasicSections } from '../src/constants/healthcare.js';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import {
  EXAMPLE_COMMUNICATION_UUID,
  EXAMPLE_MEDICATION_DOSE_UNIT_MG,
  EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE,
  EXAMPLE_MEDICATION_IBUPROFEN_TEXT,
  EXAMPLE_MEDICATION_STATEMENT_STATUS,
  EXAMPLE_MEDICATION_STATEMENT_UUID,
  EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared.js';
import {
  setCommunicationCategory,
  setCommunicationIdentifier,
  setCommunicationSubject,
} from '../src/utils/communication-claim-helpers.js';
import { CommunicationBundleSession } from '../src/utils/communication-bundle-session.js';
import {
  getMedicationCategoryList,
  setMedicationCategoryList,
  setMedicationDosageAsNeeded,
  setMedicationDoseQuantityUnit,
  setMedicationDoseQuantityValue,
  setMedicationEffective,
  setMedicationIdentifier,
  setMedicationStatus,
  setMedicationSubject,
  setMedicationText,
  setMedicationTimingFrequency,
  setMedicationTimingPeriod,
  setMedicationTimingPeriodUnit,
} from '../src/utils/medication-claim-helpers.js';

describe('101: IPS bundle editor', () => {
  it('creates one IPS-style Communication bundle with one MedicationStatement step by step', () => {
    // Step 1.
    // Frontend/runtime creates the Communication wrapper that will carry the
    // IPS-style bundle in Communication.content-attachment-data.
    let communicationClaims: Record<string, unknown> = { '@context': 'org.hl7.fhir.r4' };
    communicationClaims = setCommunicationIdentifier(
      communicationClaims,
      EXAMPLE_COMMUNICATION_UUID,
    );
    communicationClaims = setCommunicationSubject(
      communicationClaims,
      EXAMPLE_SUBJECT_DID,
    );
    communicationClaims = setCommunicationCategory(
      communicationClaims,
      CommunicationCategoryCodes.Notification.attributeValue,
    );

    const bundleEditor = new CommunicationBundleSession({
      communicationClaims,
    });

    // Step 2.
    // Build the MedicationStatement flat claims first.
    let medicationClaims: Record<string, unknown> = { '@context': 'org.hl7.fhir.api' };
    medicationClaims = setMedicationIdentifier(
      medicationClaims,
      EXAMPLE_MEDICATION_STATEMENT_UUID,
    );
    medicationClaims = setMedicationSubject(
      medicationClaims,
      EXAMPLE_SUBJECT_DID,
    );
    medicationClaims = setMedicationStatus(
      medicationClaims,
      EXAMPLE_MEDICATION_STATEMENT_STATUS,
    );
    medicationClaims = setMedicationEffective(
      medicationClaims,
      EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE,
    );
    medicationClaims = setMedicationText(
      medicationClaims,
      EXAMPLE_MEDICATION_IBUPROFEN_TEXT,
    );
    medicationClaims = setMedicationDoseQuantityValue(medicationClaims, 400);
    medicationClaims = setMedicationDoseQuantityUnit(
      medicationClaims,
      EXAMPLE_MEDICATION_DOSE_UNIT_MG,
    );
    medicationClaims = setMedicationTimingFrequency(medicationClaims, 1);
    medicationClaims = setMedicationTimingPeriod(medicationClaims, 8);
    medicationClaims = setMedicationTimingPeriodUnit(
      medicationClaims,
      EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS,
    );
    medicationClaims = setMedicationDosageAsNeeded(medicationClaims, true);
    medicationClaims = setMedicationCategoryList(medicationClaims, [
      HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
    ]);

    // Step 3.
    // Put that MedicationStatement into the bundle carried by the Communication.
    bundleEditor.upsertActiveMedicationStatementEntry({
      claims: medicationClaims,
      fullUrl: `urn:uuid:${EXAMPLE_MEDICATION_STATEMENT_UUID}`,
    });
    bundleEditor.saveAndReleaseActiveEntry();

    // Step 4.
    // Assertions: the Communication now carries one bundle entry with one
    // MedicationStatement authored through meta.claims.
    const savedCommunicationClaims = bundleEditor.getCommunicationClaims();
    const decodedBundle = JSON.parse(
      Buffer.from(
        String(savedCommunicationClaims[CommunicationClaim.ContentAttachmentData]),
        'base64',
      ).toString('utf8'),
    );
    const medicationEntry = decodedBundle.data[0];
    const savedMedicationClaims = medicationEntry.resource.meta.claims;

    expect(savedCommunicationClaims[CommunicationClaim.ContentAttachmentData]).toBeTruthy();
    expect(medicationEntry.resource.resourceType).toBe('MedicationStatement');
    expect(savedMedicationClaims[MedicationStatementClaim.Identifier]).toBe(
      EXAMPLE_MEDICATION_STATEMENT_UUID,
    );
    expect(savedMedicationClaims[MedicationStatementClaim.Subject]).toBe(
      EXAMPLE_SUBJECT_DID,
    );
    expect(savedMedicationClaims[MedicationStatementClaim.Status]).toBe(
      EXAMPLE_MEDICATION_STATEMENT_STATUS,
    );
    expect(savedMedicationClaims[MedicationStatementClaim.MedicationText]).toBe(
      EXAMPLE_MEDICATION_IBUPROFEN_TEXT,
    );
    expect(getMedicationCategoryList(savedMedicationClaims)).toEqual([
      HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
    ]);
  });
});
