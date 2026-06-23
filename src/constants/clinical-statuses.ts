/**
 * Canonical shared FHIR R4 status vocabularies for IPS-facing clinical
 * resource families.
 *
 * Use these constants in docs, examples, fixtures, and tests instead of
 * retyping raw clinical literals when a shared catalog already exists.
 *
 * When a needed status is missing, add it here first following the canonical
 * FHIR/HL7 code value for that resource family.
 */

/** Canonical `AllergyIntolerance.clinicalStatus` codes. */
export const AllergyIntoleranceClinicalStatuses = Object.freeze({
  Active: 'active',
  Inactive: 'inactive',
  Resolved: 'resolved',
} as const);

export type AllergyIntoleranceClinicalStatus =
  typeof AllergyIntoleranceClinicalStatuses[keyof typeof AllergyIntoleranceClinicalStatuses];

/** Canonical `AllergyIntolerance.verificationStatus` codes. */
export const AllergyIntoleranceVerificationStatuses = Object.freeze({
  Unconfirmed: 'unconfirmed',
  Confirmed: 'confirmed',
  Refuted: 'refuted',
  EnteredInError: 'entered-in-error',
} as const);

export type AllergyIntoleranceVerificationStatus =
  typeof AllergyIntoleranceVerificationStatuses[keyof typeof AllergyIntoleranceVerificationStatuses];

/** Canonical `Condition.clinicalStatus` codes. */
export const ConditionClinicalStatuses = Object.freeze({
  Active: 'active',
  Recurrence: 'recurrence',
  Relapse: 'relapse',
  Inactive: 'inactive',
  Remission: 'remission',
  Resolved: 'resolved',
} as const);

export type ConditionClinicalStatus =
  typeof ConditionClinicalStatuses[keyof typeof ConditionClinicalStatuses];

/** Canonical `Condition.verificationStatus` codes. */
export const ConditionVerificationStatuses = Object.freeze({
  Unconfirmed: 'unconfirmed',
  Provisional: 'provisional',
  Differential: 'differential',
  Confirmed: 'confirmed',
  Refuted: 'refuted',
  EnteredInError: 'entered-in-error',
} as const);

export type ConditionVerificationStatus =
  typeof ConditionVerificationStatuses[keyof typeof ConditionVerificationStatuses];

/** Canonical `MedicationStatement.status` codes. */
export const MedicationStatementStatuses = Object.freeze({
  Active: 'active',
  Completed: 'completed',
  EnteredInError: 'entered-in-error',
  Intended: 'intended',
  Stopped: 'stopped',
  OnHold: 'on-hold',
  Unknown: 'unknown',
  NotTaken: 'not-taken',
} as const);

export type MedicationStatementStatus =
  typeof MedicationStatementStatuses[keyof typeof MedicationStatementStatuses];

/** Canonical `Immunization.status` codes. */
export const ImmunizationStatuses = Object.freeze({
  Completed: 'completed',
  EnteredInError: 'entered-in-error',
  NotDone: 'not-done',
} as const);

export type ImmunizationStatus =
  typeof ImmunizationStatuses[keyof typeof ImmunizationStatuses];

/** Canonical `Procedure.status` codes. */
export const ProcedureStatuses = Object.freeze({
  Preparation: 'preparation',
  InProgress: 'in-progress',
  NotDone: 'not-done',
  OnHold: 'on-hold',
  Stopped: 'stopped',
  Completed: 'completed',
  EnteredInError: 'entered-in-error',
  Unknown: 'unknown',
} as const);

export type ProcedureStatus =
  typeof ProcedureStatuses[keyof typeof ProcedureStatuses];

/** Canonical `DiagnosticReport.status` codes. */
export const DiagnosticReportStatuses = Object.freeze({
  Registered: 'registered',
  Partial: 'partial',
  Preliminary: 'preliminary',
  Final: 'final',
  Amended: 'amended',
  Corrected: 'corrected',
  Appended: 'appended',
  Cancelled: 'cancelled',
  EnteredInError: 'entered-in-error',
  Unknown: 'unknown',
} as const);

export type DiagnosticReportStatus =
  typeof DiagnosticReportStatuses[keyof typeof DiagnosticReportStatuses];

/** Canonical `Observation.status` codes. */
export const ObservationStatuses = Object.freeze({
  Registered: 'registered',
  Preliminary: 'preliminary',
  Final: 'final',
  Amended: 'amended',
  Corrected: 'corrected',
  Cancelled: 'cancelled',
  EnteredInError: 'entered-in-error',
  Unknown: 'unknown',
} as const);

export type ObservationStatus =
  typeof ObservationStatuses[keyof typeof ObservationStatuses];
