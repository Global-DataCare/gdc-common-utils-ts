// src/models/fhir/AppointmentResponse.claims.ts

/**
 * Defines the flat claims structure for a FHIR AppointmentResponse resource.
 * 
 * @basedon https://www.hl7.org/fhir/appointmentresponse.html
 */

/**
 * @deprecated Claims are never version-specific. Kept as a source-compatible
 * alias whose keys now use the expanded `org.hl7.fhir.api` vocabulary.
 * 
 * @basedon https://www.hl7.org/fhir/R4/appointmentresponse.html
 */
export const AppointmentResponseClaimsFhirR4 = {
  'org.hl7.fhir.api.AppointmentResponse.actor': String,
  'org.hl7.fhir.api.AppointmentResponse.appointment': String,
  'org.hl7.fhir.api.AppointmentResponse.comment': String,
  'org.hl7.fhir.api.AppointmentResponse.identifier': String,
  'org.hl7.fhir.api.AppointmentResponse.start': String,
  'org.hl7.fhir.api.AppointmentResponse.end': String,
  'org.hl7.fhir.api.AppointmentResponse.participant-type': String,
  'org.hl7.fhir.api.AppointmentResponse.participant-status': String,
  'org.hl7.fhir.api.AppointmentResponse.resource-id': String,
};

/**
 * Contains claims representing the standard, version-agnostic API search parameters for an AppointmentResponse.
 * 
 * @basedon https://www.hl7.org/fhir/appointmentresponse.html#search
 */
export const AppointmentResponseClaimsFhirApi = {
  'org.hl7.fhir.api.AppointmentResponse.actor': String,
  'org.hl7.fhir.api.AppointmentResponse.appointment': String,
  'org.hl7.fhir.api.AppointmentResponse.identifier': String,
  'org.hl7.fhir.api.AppointmentResponse.location': String,
  'org.hl7.fhir.api.AppointmentResponse.part-status': String,
  'org.hl7.fhir.api.AppointmentResponse.patient': String,
  'org.hl7.fhir.api.AppointmentResponse.practitioner': String,
};

/**
 * Extends the standard API search parameters with custom parameters derived from core data model fields.
 * In this case, there are no common extended parameters, so it mirrors the base API claims.
 */
export const AppointmentResponseClaimsFhirApiExtended = {
  ...AppointmentResponseClaimsFhirApi,
  // No additional extended claims for AppointmentResponse at this time.
};

export const AppointmentResponseClaim = {
  Actor: 'AppointmentResponse.actor',
  Appointment: 'AppointmentResponse.appointment',
  Comment: 'AppointmentResponse.comment',
  Identifier: 'AppointmentResponse.identifier',
  Start: 'AppointmentResponse.start',
  End: 'AppointmentResponse.end',
  ParticipantType: 'AppointmentResponse.participant-type',
  ParticipantStatus: 'AppointmentResponse.participant-status',
  Patient: 'AppointmentResponse.patient',
  Practitioner: 'AppointmentResponse.practitioner',
  Location: 'AppointmentResponse.location',
} as const;

export type AppointmentResponseClaimKey =
  typeof AppointmentResponseClaim[keyof typeof AppointmentResponseClaim];
