// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-immunization.ts

import { ImmunizationClaim } from '../models/interoperable-claims/immunization-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceToValue } from './convert-shared';

export function immunizationFlatToFhirR4(claims: FlatClaims): FhirResource {
  const subject = claims[ImmunizationClaim.Subject] ?? claims[ImmunizationClaim.Patient];
  return {
    resourceType: 'Immunization',
    identifier: claims[ImmunizationClaim.Identifier] ? [{ value: claims[ImmunizationClaim.Identifier] }] : undefined,
    status: claims[ImmunizationClaim.Status],
    vaccineCode: claims[ImmunizationClaim.VaccineCode]
      ? {
        coding: codingFromValue(claims[ImmunizationClaim.VaccineCode])?.map((coding) => ({
          ...coding,
          ...(claims[ImmunizationClaim.VaccineCodeDisplay]
            ? { display: claims[ImmunizationClaim.VaccineCodeDisplay] }
            : {}),
        })),
        ...(claims[ImmunizationClaim.VaccineCodeText]
          ? { text: claims[ImmunizationClaim.VaccineCodeText] }
          : {}),
      }
      : undefined,
    patient: subject ? { reference: subject } : undefined,
    occurrenceDateTime: claims[ImmunizationClaim.Date],
    location: claims[ImmunizationClaim.Location] ? { reference: claims[ImmunizationClaim.Location] } : undefined,
    manufacturer: claims[ImmunizationClaim.Manufacturer] ? { reference: claims[ImmunizationClaim.Manufacturer] } : undefined,
    lotNumber: claims[ImmunizationClaim.LotNumber],
    performer: claims[ImmunizationClaim.Performer] ? claims[ImmunizationClaim.Performer]!.split(',').map((reference) => ({ actor: { reference: reference.trim() } })) : undefined,
    reasonCode: claims[ImmunizationClaim.ReasonCode] ? [{ coding: codingFromValue(claims[ImmunizationClaim.ReasonCode]) }] : undefined,
    reasonReference: claims[ImmunizationClaim.ReasonReference] ? [{ reference: claims[ImmunizationClaim.ReasonReference] }] : undefined,
    statusReason: claims[ImmunizationClaim.StatusReason] ? { coding: codingFromValue(claims[ImmunizationClaim.StatusReason]) } : undefined,
    note: claims[ImmunizationClaim.Note] ? [{ text: claims[ImmunizationClaim.Note] }] : undefined,
    protocolApplied: (claims[ImmunizationClaim.Series] || claims[ImmunizationClaim.TargetDisease] || claims[ImmunizationClaim.DoseSequence]) ? [{
      series: claims[ImmunizationClaim.Series],
      targetDisease: claims[ImmunizationClaim.TargetDisease] ? [{ coding: codingFromValue(claims[ImmunizationClaim.TargetDisease]) }] : undefined,
      doseNumberString: claims[ImmunizationClaim.DoseSequence],
    }] : undefined,
    reaction: claims[ImmunizationClaim.ReactionDate] ? [{ date: claims[ImmunizationClaim.ReactionDate] }] : undefined,
  };
}

export function immunizationFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const reaction = Array.isArray(resource.reaction) ? resource.reaction[0] as Record<string, unknown> | undefined : undefined;
  const protocolApplied = Array.isArray(resource.protocolApplied) ? resource.protocolApplied[0] as Record<string, unknown> | undefined : undefined;
  const performer = Array.isArray(resource.performer)
    ? (resource.performer as Array<Record<string, unknown>>).map((item) => referenceToValue(item?.actor as { reference?: string } | undefined)).filter((item): item is string => Boolean(item))
    : [];
  return {
    [ImmunizationClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [ImmunizationClaim.Date]: resource.occurrenceDateTime as string | undefined,
    [ImmunizationClaim.Location]: referenceToValue(resource.location as { reference?: string } | undefined),
    [ImmunizationClaim.LotNumber]: resource.lotNumber as string | undefined,
    [ImmunizationClaim.Manufacturer]: referenceToValue(resource.manufacturer as { reference?: string } | undefined),
    [ImmunizationClaim.Patient]: referenceToValue(resource.patient as { reference?: string } | undefined),
    [ImmunizationClaim.Performer]: performer.length ? performer.join(',') : undefined,
    [ImmunizationClaim.ReactionDate]: reaction?.date as string | undefined,
    [ImmunizationClaim.ReasonCode]: codingToValue((resource.reasonCode as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [ImmunizationClaim.ReasonReference]: referenceToValue((resource.reasonReference as Array<{ reference?: string }> | undefined)?.[0]),
    [ImmunizationClaim.Series]: protocolApplied?.series as string | undefined,
    [ImmunizationClaim.Status]: resource.status as string | undefined,
    [ImmunizationClaim.StatusReason]: codingToValue((resource.statusReason as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [ImmunizationClaim.TargetDisease]: codingToValue((protocolApplied?.targetDisease as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [ImmunizationClaim.VaccineCode]: codingToValue((resource.vaccineCode as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [ImmunizationClaim.VaccineCodeText]: (resource.vaccineCode as { text?: string } | undefined)?.text,
    [ImmunizationClaim.VaccineCodeDisplay]: (resource.vaccineCode as { coding?: Array<{ display?: string }> } | undefined)?.coding?.[0]?.display,
    [ImmunizationClaim.DoseSequence]: protocolApplied?.doseNumberString as string | undefined,
    [ImmunizationClaim.Subject]: referenceToValue(resource.patient as { reference?: string } | undefined),
    [ImmunizationClaim.Note]: (resource.note as Array<{ text?: string }> | undefined)?.[0]?.text,
  };
}
