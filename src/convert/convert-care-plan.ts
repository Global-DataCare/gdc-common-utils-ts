// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-care-plan.ts

import { CarePlanClaim } from '../models/interoperable-claims/care-plan-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceListToCsv, referenceToValue } from './convert-shared';

export function carePlanFlatToFhirR4(claims: FlatClaims): FhirResource {
  const subject = claims[CarePlanClaim.Subject] ?? claims[CarePlanClaim.Patient];
  return {
    resourceType: 'CarePlan',
    identifier: claims[CarePlanClaim.Identifier] ? [{ value: claims[CarePlanClaim.Identifier] }] : undefined,
    status: claims[CarePlanClaim.Status],
    intent: claims[CarePlanClaim.Intent],
    subject: subject ? { reference: subject } : undefined,
    category: claims[CarePlanClaim.Category] ? [{ coding: codingFromValue(claims[CarePlanClaim.Category]) }] : undefined,
    created: claims[CarePlanClaim.Date],
    note: claims[CarePlanClaim.Note] ? [{ text: claims[CarePlanClaim.Note] }] : undefined,
    basedOn: claims[CarePlanClaim.BasedOn] ? claims[CarePlanClaim.BasedOn]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    careTeam: claims[CarePlanClaim.CareTeam] ? claims[CarePlanClaim.CareTeam]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    addresses: claims[CarePlanClaim.Condition] ? claims[CarePlanClaim.Condition]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    encounter: claims[CarePlanClaim.Encounter] ? { reference: claims[CarePlanClaim.Encounter] } : undefined,
    goal: claims[CarePlanClaim.Goal] ? claims[CarePlanClaim.Goal]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    partOf: claims[CarePlanClaim.PartOf] ? claims[CarePlanClaim.PartOf]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    replaces: claims[CarePlanClaim.Replaces] ? claims[CarePlanClaim.Replaces]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    activity: (claims[CarePlanClaim.ActivityCode] || claims[CarePlanClaim.ActivityDate] || claims[CarePlanClaim.ActivityReference] || claims[CarePlanClaim.Performer]) ? [{
      reference: claims[CarePlanClaim.ActivityReference] ? { reference: claims[CarePlanClaim.ActivityReference] } : undefined,
      detail: {
        code: claims[CarePlanClaim.ActivityCode] ? { coding: codingFromValue(claims[CarePlanClaim.ActivityCode]) } : undefined,
        scheduledString: claims[CarePlanClaim.ActivityDate],
        performer: claims[CarePlanClaim.Performer] ? claims[CarePlanClaim.Performer]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
      },
    }] : undefined,
  };
}

export function carePlanFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const activity = Array.isArray(resource.activity) ? resource.activity[0] as Record<string, unknown> | undefined : undefined;
  const detail = activity?.detail as Record<string, unknown> | undefined;
  const period = resource.period as { start?: string } | undefined;
  return {
    [CarePlanClaim.ActivityCode]: codingToValue((detail?.code as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [CarePlanClaim.ActivityDate]: detail?.scheduledString as string | undefined,
    [CarePlanClaim.ActivityReference]: referenceToValue(activity?.reference as { reference?: string } | undefined),
    [CarePlanClaim.BasedOn]: referenceListToCsv(resource.basedOn as Array<{ reference?: string }> | undefined),
    [CarePlanClaim.CareTeam]: referenceListToCsv(resource.careTeam as Array<{ reference?: string }> | undefined),
    [CarePlanClaim.Category]: codingToValue((resource.category as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [CarePlanClaim.Condition]: referenceListToCsv(resource.addresses as Array<{ reference?: string }> | undefined),
    [CarePlanClaim.Date]: (resource.created as string | undefined) || period?.start,
    [CarePlanClaim.Encounter]: referenceToValue(resource.encounter as { reference?: string } | undefined),
    [CarePlanClaim.Goal]: referenceListToCsv(resource.goal as Array<{ reference?: string }> | undefined),
    [CarePlanClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [CarePlanClaim.Intent]: resource.intent as string | undefined,
    [CarePlanClaim.PartOf]: referenceListToCsv(resource.partOf as Array<{ reference?: string }> | undefined),
    [CarePlanClaim.Patient]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [CarePlanClaim.Performer]: referenceListToCsv(detail?.performer as Array<{ reference?: string }> | undefined),
    [CarePlanClaim.Replaces]: referenceListToCsv(resource.replaces as Array<{ reference?: string }> | undefined),
    [CarePlanClaim.Status]: resource.status as string | undefined,
    [CarePlanClaim.Subject]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [CarePlanClaim.Note]: (resource.note as Array<{ text?: string }> | undefined)?.[0]?.text,
  };
}
