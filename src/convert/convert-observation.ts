// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-observation.ts

import { ObservationClaim } from '../models/interoperable-claims/observation-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingListToCsv, codingToValue, referenceListToCsv, referenceToValue } from './convert-shared';

export function observationFlatToFhirR4(claims: FlatClaims): FhirResource {
  const subject = claims[ObservationClaim.Subject] ?? claims[ObservationClaim.Patient];
  return {
    resourceType: 'Observation',
    identifier: claims[ObservationClaim.Identifier] ? [{ value: claims[ObservationClaim.Identifier] }] : undefined,
    status: claims[ObservationClaim.Status],
    category: claims[ObservationClaim.Category] ? claims[ObservationClaim.Category]!.split(',').map((value) => ({ coding: codingFromValue(value.trim()) })) : undefined,
    code: claims[ObservationClaim.Code] ? { coding: codingFromValue(claims[ObservationClaim.Code]) } : undefined,
    subject: subject ? { reference: subject } : undefined,
    effectiveDateTime: claims[ObservationClaim.EffectiveDateTime] ?? claims[ObservationClaim.Date],
    issued: claims[ObservationClaim.EffectiveDateTime] ? undefined : claims[ObservationClaim.Date],
    performer: claims[ObservationClaim.Performer] ? claims[ObservationClaim.Performer]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    valueCodeableConcept: claims[ObservationClaim.ValueConcept] ? { coding: codingFromValue(claims[ObservationClaim.ValueConcept]) } : undefined,
    valueDateTime: claims[ObservationClaim.ValueDate],
    valueString: claims[ObservationClaim.ValueString],
    note: claims[ObservationClaim.Note] ? [{ text: claims[ObservationClaim.Note] }] : undefined,
    basedOn: claims[ObservationClaim.BasedOn] ? claims[ObservationClaim.BasedOn]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    device: claims[ObservationClaim.Device] ? { reference: claims[ObservationClaim.Device] } : undefined,
    encounter: claims[ObservationClaim.Encounter] ? { reference: claims[ObservationClaim.Encounter] } : undefined,
    focus: claims[ObservationClaim.Focus] ? claims[ObservationClaim.Focus]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    hasMember: claims[ObservationClaim.HasMember] ? claims[ObservationClaim.HasMember]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    method: claims[ObservationClaim.Method] ? { coding: codingFromValue(claims[ObservationClaim.Method]) } : undefined,
    specimen: claims[ObservationClaim.Specimen] ? { reference: claims[ObservationClaim.Specimen] } : undefined,
    component: claims[ObservationClaim.ComponentCode] ? [{ code: { coding: codingFromValue(claims[ObservationClaim.ComponentCode]) } }] : undefined,
  };
}

export function observationFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const valueCodeableConcept = resource.valueCodeableConcept as { coding?: Array<{ system?: string; code?: string }> } | undefined;
  const component = Array.isArray(resource.component) ? resource.component[0] as Record<string, unknown> | undefined : undefined;
  return {
    [ObservationClaim.BasedOn]: referenceListToCsv(resource.basedOn as Array<{ reference?: string }> | undefined),
    [ObservationClaim.Category]: codingListToCsv((resource.category as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.flatMap((item) => item.coding || [])),
    [ObservationClaim.Code]: codingToValue((resource.code as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [ObservationClaim.Date]: (resource.effectiveDateTime as string | undefined) || (resource.issued as string | undefined),
    [ObservationClaim.Device]: referenceToValue(resource.device as { reference?: string } | undefined),
    [ObservationClaim.Encounter]: referenceToValue(resource.encounter as { reference?: string } | undefined),
    [ObservationClaim.Focus]: referenceListToCsv(resource.focus as Array<{ reference?: string }> | undefined),
    [ObservationClaim.HasMember]: referenceListToCsv(resource.hasMember as Array<{ reference?: string }> | undefined),
    [ObservationClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [ObservationClaim.Method]: codingToValue((resource.method as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [ObservationClaim.Patient]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [ObservationClaim.Performer]: referenceListToCsv(resource.performer as Array<{ reference?: string }> | undefined),
    [ObservationClaim.Specimen]: referenceToValue(resource.specimen as { reference?: string } | undefined),
    [ObservationClaim.Status]: resource.status as string | undefined,
    [ObservationClaim.Subject]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [ObservationClaim.ValueConcept]: codingToValue(valueCodeableConcept?.coding?.[0]),
    [ObservationClaim.ValueDate]: resource.valueDateTime as string | undefined,
    [ObservationClaim.ValueString]: resource.valueString as string | undefined,
    [ObservationClaim.ComponentCode]: codingToValue((component?.code as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [ObservationClaim.Note]: (resource.note as Array<{ text?: string }> | undefined)?.[0]?.text,
    [ObservationClaim.EffectiveDateTime]: resource.effectiveDateTime as string | undefined,
  };
}
