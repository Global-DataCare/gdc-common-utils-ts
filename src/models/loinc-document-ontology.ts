/**
 * LOINC Document Ontology helpers for Communication ingestion workflows.
 *
 * Source:
 * - https://loinc.org/kb/users-guide/document-ontology/
 *
 * Notes:
 * - LP codes are represented as bare codes (e.g., "LP173418-7").
 * - When a claim requires a coding token value, prefer `LOINC|<CODE>`.
 */

export const LOINC_TOKEN_PREFIX = 'LOINC|' as const;

export function toLoincToken(code: string): `${typeof LOINC_TOKEN_PREFIX}${string}` {
  return `${LOINC_TOKEN_PREFIX}${code}`;
}

export const loincOntology = Object.freeze({
  KindOfDocument: Object.freeze({
    Note: Object.freeze({
      code: 'LP173418-7',
      AdverseEventNote: Object.freeze({
        code: 'LP173419-5',
      }),
      Alert: Object.freeze({
        code: 'LP173420-3',
      }),
      AppointmentReminder: Object.freeze({
        code: 'LP434808-4',
      }),
      ArrivalNotificationNote: Object.freeze({
        code: 'LP436847-0',
      }),
      ComprehensivePlanOfCareNote: Object.freeze({
        code: 'LP436848-8',
      }),
      ClinicalNote: Object.freeze({
        code: 'LP447692-7',
      }),
      ScreeningInvitationLetter: Object.freeze({
        code: 'LP448671-0',
      }),
      ImplantedDeviceNote: Object.freeze({
        code: 'LP450051-0',
      }),
      RepositoryInitialEvaluationNote: Object.freeze({
        code: 'LP436851-2',
      }),
    }),
  }),
});

/**
 * Defaults agreed for Communication ingestion:
 * - datatype: KindOfDocument.Note
 * - category: Arrival notification note
 */
export const communicationIngestionDefaults = Object.freeze({
  datatype: toLoincToken(loincOntology.KindOfDocument.Note.code),
  category: toLoincToken(loincOntology.KindOfDocument.Note.ArrivalNotificationNote.code),
});
