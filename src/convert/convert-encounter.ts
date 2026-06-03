// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-encounter.ts

import { EncounterClaim } from '../models/interoperable-claims/encounter-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceListToCsv, referenceToValue } from './convert-shared';

export function encounterFlatToFhirR4(claims: FlatClaims): FhirResource {
  const subject = claims[EncounterClaim.Subject] ?? claims[EncounterClaim.Patient];
  return {
    resourceType: 'Encounter',
    identifier: claims[EncounterClaim.Identifier] ? [{ value: claims[EncounterClaim.Identifier] }] : undefined,
    status: claims[EncounterClaim.Status],
    class: claims[EncounterClaim.Class]
      ? (() => {
        const [system, code] = claims[EncounterClaim.Class]!.split('|');
        return code ? { system, code } : { code: system };
      })()
      : undefined,
    type: claims[EncounterClaim.Type] ? [{ coding: codingFromValue(claims[EncounterClaim.Type]) }] : undefined,
    subject: subject ? { reference: subject } : undefined,
    participant: claims[EncounterClaim.Participant]
      ? claims[EncounterClaim.Participant]!.split(',').map((reference) => ({ individual: { reference: reference.trim() } }))
      : undefined,
    serviceProvider: claims[EncounterClaim.ServiceProvider] ? { reference: claims[EncounterClaim.ServiceProvider] } : undefined,
    period: (claims[EncounterClaim.PeriodStart] || claims[EncounterClaim.PeriodEnd]) ? {
      start: claims[EncounterClaim.PeriodStart],
      end: claims[EncounterClaim.PeriodEnd],
    } : undefined,
    reasonCode: claims[EncounterClaim.ReasonCode] ? [{ coding: codingFromValue(claims[EncounterClaim.ReasonCode]) }] : undefined,
    diagnosis: claims[EncounterClaim.Diagnosis]
      ? claims[EncounterClaim.Diagnosis]!.split(',').map((reference) => ({ condition: { reference: reference.trim() } }))
      : undefined,
    location: claims[EncounterClaim.Location]
      ? claims[EncounterClaim.Location]!.split(',').map((reference) => ({ location: { reference: reference.trim() } }))
      : undefined,
  };
}

export function encounterFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const klass = resource.class as { system?: string; code?: string } | undefined;
  return {
    [EncounterClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [EncounterClaim.Status]: resource.status as string | undefined,
    [EncounterClaim.Class]: klass?.code ? (klass.system ? `${klass.system}|${klass.code}` : klass.code) : undefined,
    [EncounterClaim.Type]: codingToValue((resource.type as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [EncounterClaim.Subject]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [EncounterClaim.Patient]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [EncounterClaim.Participant]: Array.isArray(resource.participant)
      ? (resource.participant as Array<Record<string, unknown>>)
        .map((item) => referenceToValue(item?.individual as { reference?: string } | undefined))
        .filter((item): item is string => Boolean(item))
        .join(',')
      : undefined,
    [EncounterClaim.ServiceProvider]: referenceToValue(resource.serviceProvider as { reference?: string } | undefined),
    [EncounterClaim.PeriodStart]: (resource.period as { start?: string } | undefined)?.start,
    [EncounterClaim.PeriodEnd]: (resource.period as { end?: string } | undefined)?.end,
    [EncounterClaim.ReasonCode]: codingToValue((resource.reasonCode as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [EncounterClaim.Diagnosis]: Array.isArray(resource.diagnosis)
      ? (resource.diagnosis as Array<Record<string, unknown>>)
        .map((item) => referenceToValue(item?.condition as { reference?: string } | undefined))
        .filter((item): item is string => Boolean(item))
        .join(',')
      : undefined,
    [EncounterClaim.Location]: Array.isArray(resource.location)
      ? (resource.location as Array<Record<string, unknown>>)
        .map((item) => referenceToValue(item?.location as { reference?: string } | undefined))
        .filter((item): item is string => Boolean(item))
        .join(',')
      : undefined,
  };
}
