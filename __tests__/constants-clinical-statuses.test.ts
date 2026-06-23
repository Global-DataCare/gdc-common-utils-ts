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
});
