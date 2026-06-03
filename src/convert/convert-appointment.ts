// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-appointment.ts

import { AppointmentClaim } from '../models/interoperable-claims/appointment-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceListToCsv, referenceToValue } from './convert-shared';

export function appointmentFlatToFhirR4(claims: FlatClaims): FhirResource {
  return {
    resourceType: 'Appointment',
    identifier: claims[AppointmentClaim.Identifier] ? [{ value: claims[AppointmentClaim.Identifier] }] : undefined,
    status: claims[AppointmentClaim.Status],
    serviceCategory: claims[AppointmentClaim.ServiceCategory] ? [{ coding: codingFromValue(claims[AppointmentClaim.ServiceCategory]) }] : undefined,
    serviceType: claims[AppointmentClaim.ServiceType] ? [{ coding: codingFromValue(claims[AppointmentClaim.ServiceType]) }] : undefined,
    specialty: claims[AppointmentClaim.Specialty] ? [{ coding: codingFromValue(claims[AppointmentClaim.Specialty]) }] : undefined,
    appointmentType: claims[AppointmentClaim.AppointmentType] ? { coding: codingFromValue(claims[AppointmentClaim.AppointmentType]) } : undefined,
    reasonCode: claims[AppointmentClaim.ReasonCode] ? [{ coding: codingFromValue(claims[AppointmentClaim.ReasonCode]) }] : undefined,
    reasonReference: claims[AppointmentClaim.ReasonReference] ? claims[AppointmentClaim.ReasonReference]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    description: claims[AppointmentClaim.Description],
    start: claims[AppointmentClaim.Start],
    end: claims[AppointmentClaim.End],
    minutesDuration: claims[AppointmentClaim.MinutesDuration] ? Number(claims[AppointmentClaim.MinutesDuration]) : undefined,
    created: claims[AppointmentClaim.Created],
    note: claims[AppointmentClaim.NoteText] ? [{ text: claims[AppointmentClaim.NoteText] }] : undefined,
    patientInstruction: claims[AppointmentClaim.PatientInstruction],
    basedOn: claims[AppointmentClaim.BasedOn] ? claims[AppointmentClaim.BasedOn]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    participant: claims[AppointmentClaim.ParticipantActor]
      ? claims[AppointmentClaim.ParticipantActor]!.split(',').map((reference) => ({
        actor: { reference: reference.trim() },
        status: claims[AppointmentClaim.ParticipantStatus],
        type: claims[AppointmentClaim.ParticipantType] ? [{ coding: codingFromValue(claims[AppointmentClaim.ParticipantType]) }] : undefined,
      }))
      : undefined,
  };
}

export function appointmentFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const participant = Array.isArray(resource.participant) ? resource.participant[0] as Record<string, unknown> | undefined : undefined;
  return {
    [AppointmentClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [AppointmentClaim.Status]: resource.status as string | undefined,
    [AppointmentClaim.ServiceCategory]: codingToValue((resource.serviceCategory as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [AppointmentClaim.ServiceType]: codingToValue((resource.serviceType as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [AppointmentClaim.Specialty]: codingToValue((resource.specialty as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [AppointmentClaim.AppointmentType]: codingToValue((resource.appointmentType as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [AppointmentClaim.ReasonCode]: codingToValue((resource.reasonCode as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [AppointmentClaim.ReasonReference]: referenceListToCsv(resource.reasonReference as Array<{ reference?: string }> | undefined),
    [AppointmentClaim.Description]: resource.description as string | undefined,
    [AppointmentClaim.Start]: resource.start as string | undefined,
    [AppointmentClaim.End]: resource.end as string | undefined,
    [AppointmentClaim.MinutesDuration]: resource.minutesDuration === undefined ? undefined : String(resource.minutesDuration),
    [AppointmentClaim.Created]: resource.created as string | undefined,
    [AppointmentClaim.NoteText]: (resource.note as Array<{ text?: string }> | undefined)?.[0]?.text,
    [AppointmentClaim.PatientInstruction]: resource.patientInstruction as string | undefined,
    [AppointmentClaim.BasedOn]: referenceListToCsv(resource.basedOn as Array<{ reference?: string }> | undefined),
    [AppointmentClaim.ParticipantActor]: Array.isArray(resource.participant)
      ? (resource.participant as Array<Record<string, unknown>>)
        .map((item) => referenceToValue(item?.actor as { reference?: string } | undefined))
        .filter((item): item is string => Boolean(item))
        .join(',')
      : undefined,
    [AppointmentClaim.ParticipantStatus]: participant?.status as string | undefined,
    [AppointmentClaim.ParticipantType]: codingToValue((participant?.type as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
  };
}
