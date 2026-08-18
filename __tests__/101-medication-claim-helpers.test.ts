/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { expect, it } from '@jest/globals';
import { BundleEntryClaimsContext } from '../src/models/communication-attached-bundle-session.js';
import {
  EXAMPLE_MEDICATION_DOSE_UNIT_MG,
  EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE,
  EXAMPLE_MEDICATION_IBUPROFEN_NOTE,
  EXAMPLE_MEDICATION_IBUPROFEN_TEXT,
  EXAMPLE_MEDICATION_STATEMENT_STATUS,
  EXAMPLE_MEDICATION_STATEMENT_UUID,
  EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared.js';
import {
  MedicationStatementClaim,
  MedicationStatementClaimsFhirApiExtended,
} from '../src/models/interoperable-claims/medication-statement-claims.js';
import {
  getMedicationDosageAsNeeded,
  getMedicationDoseQuantityUnit,
  getMedicationDoseQuantityValue,
  getMedicationEffective,
  getMedicationIdentifier,
  getMedicationStatus,
  getMedicationSubject,
  getMedicationText,
  getMedicationTimingFrequency,
  getMedicationTimingPeriod,
  getMedicationTimingPeriodUnit,
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
} from '../src/utils/claims-helpers-medication-statement.js';

it('101: build medication statement claims step by step with simple setters', () => {
  // Step 1.
  // Frontend/backend already knows which individual the medication belongs to.
  const subjectId = EXAMPLE_SUBJECT_DID;

  // Step 2.
  // Start from flat interoperable claims.
  let claims: Record<string, unknown> = { '@context': BundleEntryClaimsContext };

  // Step 3.
  // Set the core medication statement fields.
  claims = setMedicationIdentifier(claims, EXAMPLE_MEDICATION_STATEMENT_UUID);
  claims = setMedicationSubject(claims, subjectId);
  claims = setMedicationStatus(claims, EXAMPLE_MEDICATION_STATEMENT_STATUS);
  claims = setMedicationEffective(claims, EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE);
  claims = setMedicationText(claims, EXAMPLE_MEDICATION_IBUPROFEN_TEXT);

  // Step 4.
  // Structured dosage/timing for:
  // "Ibuprofen 400 mg, 1 dose every 8 hours, as needed (PRN)".
  claims = setMedicationDoseQuantityValue(claims, 400);
  claims = setMedicationDoseQuantityUnit(claims, EXAMPLE_MEDICATION_DOSE_UNIT_MG);
  claims = setMedicationTimingFrequency(claims, 1);
  claims = setMedicationTimingPeriod(claims, 8);
  claims = setMedicationTimingPeriodUnit(claims, EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS);
  claims = setMedicationDosageAsNeeded(claims, true);

  // Step 5.
  // Read them back with the matching getters.
  expect(getMedicationIdentifier(claims)).toBe(EXAMPLE_MEDICATION_STATEMENT_UUID);
  expect(getMedicationSubject(claims)).toBe(subjectId);
  expect(getMedicationStatus(claims)).toBe(EXAMPLE_MEDICATION_STATEMENT_STATUS);
  expect(getMedicationEffective(claims)).toBe(EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE);
  expect(getMedicationText(claims)).toBe(EXAMPLE_MEDICATION_IBUPROFEN_TEXT);
  expect(getMedicationDoseQuantityValue(claims)).toBe(400);
  expect(getMedicationDoseQuantityUnit(claims)).toBe(EXAMPLE_MEDICATION_DOSE_UNIT_MG);
  expect(getMedicationTimingFrequency(claims)).toBe(1);
  expect(getMedicationTimingPeriod(claims)).toBe(8);
  expect(getMedicationTimingPeriodUnit(claims)).toBe(EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS);
  expect(getMedicationDosageAsNeeded(claims)).toBe(true);

  // Step 6.
  // These are still flat claims, ready to go into meta.claims of a MedicationStatement.
  expect(claims[MedicationStatementClaim.Identifier]).toBe(EXAMPLE_MEDICATION_STATEMENT_UUID);
  expect(claims[MedicationStatementClaim.Subject]).toBe(subjectId);
  expect(claims[MedicationStatementClaim.Status]).toBe(EXAMPLE_MEDICATION_STATEMENT_STATUS);
  expect(claims[MedicationStatementClaim.Effective]).toBe(EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE);
  expect(claims[MedicationStatementClaim.CodeText]).toBe(EXAMPLE_MEDICATION_IBUPROFEN_TEXT);
  expect(claims[MedicationStatementClaim.MedicationText]).toBeUndefined();
  expect(claims[MedicationStatementClaimsFhirApiExtended.DoseQuantityValue]).toBe(400);
  expect(claims[MedicationStatementClaimsFhirApiExtended.DoseQuantityUnit]).toBe(EXAMPLE_MEDICATION_DOSE_UNIT_MG);
  expect(claims[MedicationStatementClaimsFhirApiExtended.TimingFrequency]).toBe(1);
  expect(claims[MedicationStatementClaimsFhirApiExtended.TimingPeriod]).toBe(8);
  expect(claims[MedicationStatementClaimsFhirApiExtended.TimingPeriodUnit]).toBe(EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS);
  expect(claims[MedicationStatementClaimsFhirApiExtended.DosageAsNeeded]).toBe(true);

  // Shared plain-language note used in docs/UI.
  expect(EXAMPLE_MEDICATION_IBUPROFEN_NOTE).toBe(
    'Take every 8 hours as needed. Keep a 4 hour gap from paracetamol.',
  );
});
