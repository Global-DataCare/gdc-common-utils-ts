// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-flag.ts

import { FlagClaim } from '../models/interoperable-claims/flag-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceToValue } from './convert-shared';

export function flagFlatToFhirR4(claims: FlatClaims): FhirResource {
  const subject = claims[FlagClaim.Subject] ?? claims[FlagClaim.Patient];
  return {
    resourceType: 'Flag',
    identifier: claims[FlagClaim.Identifier] ? [{ value: claims[FlagClaim.Identifier] }] : undefined,
    status: claims[FlagClaim.Status],
    category: claims[FlagClaim.Category] ? { coding: codingFromValue(claims[FlagClaim.Category]) } : undefined,
    code: claims[FlagClaim.Code] ? { coding: codingFromValue(claims[FlagClaim.Code]) } : undefined,
    subject: subject ? { reference: subject } : undefined,
    author: claims[FlagClaim.Author] ? { reference: claims[FlagClaim.Author] } : undefined,
    encounter: claims[FlagClaim.Encounter] ? { reference: claims[FlagClaim.Encounter] } : undefined,
    period: (claims[FlagClaim.PeriodStart] || claims[FlagClaim.PeriodEnd]) ? { start: claims[FlagClaim.PeriodStart], end: claims[FlagClaim.PeriodEnd] } : undefined,
  };
}

export function flagFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const period = resource.period as { start?: string; end?: string } | undefined;
  return {
    [FlagClaim.Author]: referenceToValue(resource.author as { reference?: string } | undefined),
    [FlagClaim.Date]: undefined,
    [FlagClaim.Encounter]: referenceToValue(resource.encounter as { reference?: string } | undefined),
    [FlagClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [FlagClaim.Patient]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [FlagClaim.Subject]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [FlagClaim.Status]: resource.status as string | undefined,
    [FlagClaim.Category]: codingToValue((resource.category as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [FlagClaim.Code]: codingToValue((resource.code as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [FlagClaim.PeriodStart]: period?.start,
    [FlagClaim.PeriodEnd]: period?.end,
  };
}
