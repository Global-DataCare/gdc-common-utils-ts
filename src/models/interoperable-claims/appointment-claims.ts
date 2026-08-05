// src/models/fhir/Appointment.claims.ts

/**
 * Defines the flat claims structure for a FHIR Appointment resource, separating
 * version-specific data model fields from version-agnostic API search parameters.
 * 
 * This model aligns with FHIR R5 conventions (using `note.text` instead of `comment`)
 * for forward compatibility and consistency with other resources like Communication.
 * 
 */

/**
 * @deprecated Claims are never version-specific. Kept as a source-compatible
 * alias whose values now use the expanded `org.hl7.fhir.api` vocabulary.
 * 
 * @basedon https://www.hl7.org/fhir/R4/appointment.html
 */
export enum AppointmentClaimsFhirR4Core {
  Identifier = 'org.hl7.fhir.api.Appointment.identifier',
  Status = 'org.hl7.fhir.api.Appointment.status',
  CancelationReason = 'org.hl7.fhir.api.Appointment.cancelation-reason',
  ServiceCategory = 'org.hl7.fhir.api.Appointment.service-category',
  ServiceType = 'org.hl7.fhir.api.Appointment.service-type',
  Specialty = 'org.hl7.fhir.api.Appointment.specialty',
  AppointmentType = 'org.hl7.fhir.api.Appointment.appointment-type',
  ReasonCode = 'org.hl7.fhir.api.Appointment.reason-code',
  ReasonReference = 'org.hl7.fhir.api.Appointment.reason-reference',
  Priority = 'org.hl7.fhir.api.Appointment.priority',
  Description = 'org.hl7.fhir.api.Appointment.description',
  SupportingInformation = 'org.hl7.fhir.api.Appointment.supporting-information',
  Start = 'org.hl7.fhir.api.Appointment.start',
  End = 'org.hl7.fhir.api.Appointment.end',
  MinutesDuration = 'org.hl7.fhir.api.Appointment.minutes-duration',
  Slot = 'org.hl7.fhir.api.Appointment.slot',
  Created = 'org.hl7.fhir.api.Appointment.created',
  NoteText = 'org.hl7.fhir.api.Appointment.note-text',
  PatientInstruction = 'org.hl7.fhir.api.Appointment.patient-instruction',
  BasedOn = 'org.hl7.fhir.api.Appointment.based-on',
  ParticipantActor = 'org.hl7.fhir.api.Appointment.participant-actor',
  ParticipantRequired = 'org.hl7.fhir.api.Appointment.participant-required',
  ParticipantStatus = 'org.hl7.fhir.api.Appointment.participant-status',
  ParticipantType = 'org.hl7.fhir.api.Appointment.participant-type',
  RequestedPeriod = 'org.hl7.fhir.api.Appointment.requested-period',
  ResourceId = 'org.hl7.fhir.api.Appointment.resource-id',
}

/**
 * Contains claims representing the standard, version-agnostic API search parameters for an Appointment.
 * 
 * @basedon https://www.hl7.org/fhir/appointment.html#search
 */
export enum AppointmentClaimsFhirApi {
  Actor = 'org.hl7.fhir.api.Appointment.actor',
  AppointmentType = 'org.hl7.fhir.api.Appointment.appointment-type',
  BasedOn = 'org.hl7.fhir.api.Appointment.based-on',
  Date = 'org.hl7.fhir.api.Appointment.date',
  Identifier = 'org.hl7.fhir.api.Appointment.identifier',
  Location = 'org.hl7.fhir.api.Appointment.location',
  PartStatus = 'org.hl7.fhir.api.Appointment.part-status',
  Patient = 'org.hl7.fhir.api.Appointment.patient',
  Practitioner = 'org.hl7.fhir.api.Appointment.practitioner',
  ReasonCode = 'org.hl7.fhir.api.Appointment.reason-code',
  ReasonReference = 'org.hl7.fhir.api.Appointment.reason-reference',
  ServiceCategory = 'org.hl7.fhir.api.Appointment.service-category',
  ServiceType = 'org.hl7.fhir.api.Appointment.service-type',
  Slot = 'org.hl7.fhir.api.Appointment.slot',
  Specialty = 'org.hl7.fhir.api.Appointment.specialty',
  Status = 'org.hl7.fhir.api.Appointment.status',
  SupportingInfo = 'org.hl7.fhir.api.Appointment.supporting-info',
}

/**
 * Extends the standard API search parameters with custom parameters derived from core data model fields.
 */
export enum AppointmentClaimsFhirApiExtended {
  Actor = 'org.hl7.fhir.api.Appointment.actor',
  AppointmentType = 'org.hl7.fhir.api.Appointment.appointment-type',
  BasedOn = 'org.hl7.fhir.api.Appointment.based-on',
  Date = 'org.hl7.fhir.api.Appointment.date',
  Identifier = 'org.hl7.fhir.api.Appointment.identifier',
  Location = 'org.hl7.fhir.api.Appointment.location',
  PartStatus = 'org.hl7.fhir.api.Appointment.part-status',
  Patient = 'org.hl7.fhir.api.Appointment.patient',
  Practitioner = 'org.hl7.fhir.api.Appointment.practitioner',
  ReasonCode = 'org.hl7.fhir.api.Appointment.reason-code',
  ReasonReference = 'org.hl7.fhir.api.Appointment.reason-reference',
  ServiceCategory = 'org.hl7.fhir.api.Appointment.service-category',
  ServiceType = 'org.hl7.fhir.api.Appointment.service-type',
  Slot = 'org.hl7.fhir.api.Appointment.slot',
  Specialty = 'org.hl7.fhir.api.Appointment.specialty',
  Status = 'org.hl7.fhir.api.Appointment.status',
  SupportingInfo = 'org.hl7.fhir.api.Appointment.supporting-info',
  // Extended
  CancelationReason = 'org.hl7.fhir.api.Appointment.cancelation-reason',
  MinutesDuration = 'org.hl7.fhir.api.Appointment.minutes-duration',
  Priority = 'org.hl7.fhir.api.Appointment.priority',
  Created = 'org.hl7.fhir.api.Appointment.created',
  Description = 'org.hl7.fhir.api.Appointment.description',
  NoteText = 'org.hl7.fhir.api.Appointment.note-text', // Instead of 'comment', which is deprecated in R5
}

export const AppointmentClaimsFhirR4CoreMap = {
  [AppointmentClaimsFhirR4Core.Identifier]: String,
  [AppointmentClaimsFhirR4Core.Status]: String,
  [AppointmentClaimsFhirR4Core.CancelationReason]: String,
  [AppointmentClaimsFhirR4Core.ServiceCategory]: String,
  [AppointmentClaimsFhirR4Core.ServiceType]: String,
  [AppointmentClaimsFhirR4Core.Specialty]: String,
  [AppointmentClaimsFhirR4Core.AppointmentType]: String,
  [AppointmentClaimsFhirR4Core.ReasonCode]: String,
  [AppointmentClaimsFhirR4Core.ReasonReference]: String,
  [AppointmentClaimsFhirR4Core.Priority]: Number,
  [AppointmentClaimsFhirR4Core.Description]: String,
  [AppointmentClaimsFhirR4Core.SupportingInformation]: String,
  [AppointmentClaimsFhirR4Core.Start]: String,
  [AppointmentClaimsFhirR4Core.End]: String,
  [AppointmentClaimsFhirR4Core.MinutesDuration]: Number,
  [AppointmentClaimsFhirR4Core.Slot]: String,
  [AppointmentClaimsFhirR4Core.Created]: String,
  [AppointmentClaimsFhirR4Core.NoteText]: String,
  [AppointmentClaimsFhirR4Core.PatientInstruction]: String,
  [AppointmentClaimsFhirR4Core.BasedOn]: String,
  [AppointmentClaimsFhirR4Core.ParticipantActor]: String,
  [AppointmentClaimsFhirR4Core.ParticipantRequired]: String,
  [AppointmentClaimsFhirR4Core.ParticipantStatus]: String,
  [AppointmentClaimsFhirR4Core.ParticipantType]: String,
  [AppointmentClaimsFhirR4Core.RequestedPeriod]: String,
  [AppointmentClaimsFhirR4Core.ResourceId]: String,
};

export const AppointmentClaimsFhirApiMap = {
  [AppointmentClaimsFhirApi.Actor]: String,
  [AppointmentClaimsFhirApi.AppointmentType]: String,
  [AppointmentClaimsFhirApi.BasedOn]: String,
  [AppointmentClaimsFhirApi.Date]: String,
  [AppointmentClaimsFhirApi.Identifier]: String,
  [AppointmentClaimsFhirApi.Location]: String,
  [AppointmentClaimsFhirApi.PartStatus]: String,
  [AppointmentClaimsFhirApi.Patient]: String,
  [AppointmentClaimsFhirApi.Practitioner]: String,
  [AppointmentClaimsFhirApi.ReasonCode]: String,
  [AppointmentClaimsFhirApi.ReasonReference]: String,
  [AppointmentClaimsFhirApi.ServiceCategory]: String,
  [AppointmentClaimsFhirApi.ServiceType]: String,
  [AppointmentClaimsFhirApi.Slot]: String,
  [AppointmentClaimsFhirApi.Specialty]: String,
  [AppointmentClaimsFhirApi.Status]: String,
  [AppointmentClaimsFhirApi.SupportingInfo]: String,
};

export const AppointmentClaimsFhirApiExtendedMap = {
  ...AppointmentClaimsFhirApiMap,
  [AppointmentClaimsFhirApiExtended.CancelationReason]: String,
  [AppointmentClaimsFhirApiExtended.MinutesDuration]: Number,
  [AppointmentClaimsFhirApiExtended.Priority]: Number,
  [AppointmentClaimsFhirApiExtended.Created]: String,
  [AppointmentClaimsFhirApiExtended.Description]: String,
  [AppointmentClaimsFhirApiExtended.NoteText]: String,
};

export const AppointmentClaim = {
  Identifier: 'Appointment.identifier',
  Status: 'Appointment.status',
  ServiceCategory: 'Appointment.service-category',
  ServiceType: 'Appointment.service-type',
  Specialty: 'Appointment.specialty',
  AppointmentType: 'Appointment.appointment-type',
  ReasonCode: 'Appointment.reason-code',
  ReasonReference: 'Appointment.reason-reference',
  Description: 'Appointment.description',
  Start: 'Appointment.start',
  End: 'Appointment.end',
  MinutesDuration: 'Appointment.minutes-duration',
  Created: 'Appointment.created',
  NoteText: 'Appointment.note-text',
  PatientInstruction: 'Appointment.patient-instruction',
  BasedOn: 'Appointment.based-on',
  ParticipantActor: 'Appointment.actor',
  ParticipantStatus: 'Appointment.part-status',
  ParticipantType: 'Appointment.participant-type',
} as const;

export type AppointmentClaimKey = typeof AppointmentClaim[keyof typeof AppointmentClaim];

// src/models/fhir/Appointment.values.ts

/**
 * Defines the possible values for the `status` field on a FHIR Appointment resource.
 * @basedon http://hl7.org/fhir/R4/appointment.html#status
 * @basedon http://hl7.org/fhir/valueset-appointmentstatus.html
 */
export enum AppointmentStatus {
  Proposed = 'proposed',
  Pending = 'pending',
  Booked = 'booked',
  Arrived = 'arrived',
  Fulfilled = 'fulfilled',
  Cancelled = 'cancelled',
  NoShow = 'noshow',
  EnteredInError = 'entered-in-error',
  CheckedIn = 'checked-in',
  Waitlist = 'waitlist',
}

/**
 * Defines the possible values for the `participant.required` field on a FHIR Appointment resource.
 * @basedon http://hl7.org/fhir/R4/appointment.html#participant
 * @basedon http://hl7.org/fhir/valueset-participantrequired.html
 */
export enum AppointmentParticipantRequired {
  Required = 'required',
  Optional = 'optional',
  InformationOnly = 'information-only',
}

/**
 * Defines the possible values for the `participant.status` field on a FHIR Appointment resource.
 * @basedon http://hl7.org/fhir/R4/appointment.html#participant
 * @basedon http://hl7.org/fhir/valueset-participationstatus.html
 */
export enum AppointmentParticipantStatus {
  Accepted = 'accepted',
  Declined = 'declined',
  Tentative = 'tentative',
  NeedsAction = 'needs-action',
}
