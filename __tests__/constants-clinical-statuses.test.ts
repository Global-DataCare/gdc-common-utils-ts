import { describe, expect, it } from '@jest/globals';
import {
  AllergyIntoleranceClinicalStatuses,
  AllergyIntoleranceVerificationStatuses,
  ConditionClinicalStatuses,
  ConditionVerificationStatuses,
  MedicationStatementStatuses,
  ImmunizationStatuses,
  ProcedureStatuses,
  DiagnosticReportStatuses,
  ObservationStatuses,
} from '../src/constants/clinical-statuses.js';

describe('clinical status catalogs', () => {
  it('exposes canonical FHIR R4 status tokens for IPS-facing resource families', () => {
    expect(AllergyIntoleranceClinicalStatuses.Active).toBe('active');
    expect(AllergyIntoleranceVerificationStatuses.Confirmed).toBe('confirmed');
    expect(ConditionClinicalStatuses.Active).toBe('active');
    expect(ConditionVerificationStatuses.Confirmed).toBe('confirmed');
    expect(MedicationStatementStatuses.Active).toBe('active');
    expect(ImmunizationStatuses.Completed).toBe('completed');
    expect(ProcedureStatuses.Completed).toBe('completed');
    expect(DiagnosticReportStatuses.Final).toBe('final');
    expect(ObservationStatuses.Final).toBe('final');
  });

  it('keeps the shared catalogs immutable so docs/tests/examples reuse one canonical source', () => {
    expect(Object.isFrozen(AllergyIntoleranceClinicalStatuses)).toBe(true);
    expect(Object.isFrozen(ConditionClinicalStatuses)).toBe(true);
    expect(Object.isFrozen(MedicationStatementStatuses)).toBe(true);
    expect(Object.isFrozen(ObservationStatuses)).toBe(true);

    expect(Object.values(AllergyIntoleranceClinicalStatuses)).toContain('resolved');
    expect(Object.values(ConditionClinicalStatuses)).not.toContain('entered-in-error');
    expect(Object.values(ProcedureStatuses)).toContain('completed');
    expect(Object.values(ObservationStatuses)).not.toContain('completed');
  });
});
