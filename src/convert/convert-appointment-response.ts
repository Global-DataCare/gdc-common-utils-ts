// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-appointment-response.ts

import { AppointmentResponseClaim } from '../models/interoperable-claims/appointment-response-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceToValue } from './convert-shared';

export function appointmentResponseFlatToFhirR4(claims: FlatClaims): FhirResource {
  return {
    resourceType: 'AppointmentResponse',
    identifier: claims[AppointmentResponseClaim.Identifier] ? [{ value: claims[AppointmentResponseClaim.Identifier] }] : undefined,
    appointment: claims[AppointmentResponseClaim.Appointment] ? { reference: claims[AppointmentResponseClaim.Appointment] } : undefined,
    actor: claims[AppointmentResponseClaim.Actor] ? { reference: claims[AppointmentResponseClaim.Actor] } : undefined,
    participantStatus: claims[AppointmentResponseClaim.ParticipantStatus],
    participantType: claims[AppointmentResponseClaim.ParticipantType] ? [{ coding: codingFromValue(claims[AppointmentResponseClaim.ParticipantType]) }] : undefined,
    start: claims[AppointmentResponseClaim.Start],
    end: claims[AppointmentResponseClaim.End],
    comment: claims[AppointmentResponseClaim.Comment],
  };
}

export function appointmentResponseFhirR4ToFlat(resource: FhirResource): FlatClaims {
  return {
    [AppointmentResponseClaim.Actor]: referenceToValue(resource.actor as { reference?: string } | undefined),
    [AppointmentResponseClaim.Appointment]: referenceToValue(resource.appointment as { reference?: string } | undefined),
    [AppointmentResponseClaim.Comment]: resource.comment as string | undefined,
    [AppointmentResponseClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [AppointmentResponseClaim.Start]: resource.start as string | undefined,
    [AppointmentResponseClaim.End]: resource.end as string | undefined,
    [AppointmentResponseClaim.ParticipantType]: codingToValue((resource.participantType as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [AppointmentResponseClaim.ParticipantStatus]: resource.participantStatus as string | undefined,
    [AppointmentResponseClaim.Patient]: undefined,
    [AppointmentResponseClaim.Practitioner]: undefined,
    [AppointmentResponseClaim.Location]: undefined,
  };
}
