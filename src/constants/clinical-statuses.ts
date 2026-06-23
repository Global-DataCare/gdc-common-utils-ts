export const AllergyIntoleranceClinicalStatuses = Object.freeze({
  Active: 'active',
  Inactive: 'inactive',
  Resolved: 'resolved',
} as const);

export type AllergyIntoleranceClinicalStatus =
  typeof AllergyIntoleranceClinicalStatuses[keyof typeof AllergyIntoleranceClinicalStatuses];

export const AllergyIntoleranceVerificationStatuses = Object.freeze({
  Unconfirmed: 'unconfirmed',
  Confirmed: 'confirmed',
  Refuted: 'refuted',
  EnteredInError: 'entered-in-error',
} as const);

export type AllergyIntoleranceVerificationStatus =
  typeof AllergyIntoleranceVerificationStatuses[keyof typeof AllergyIntoleranceVerificationStatuses];

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

export const ImmunizationStatuses = Object.freeze({
  Completed: 'completed',
  EnteredInError: 'entered-in-error',
  NotDone: 'not-done',
} as const);

export type ImmunizationStatus =
  typeof ImmunizationStatuses[keyof typeof ImmunizationStatuses];

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
