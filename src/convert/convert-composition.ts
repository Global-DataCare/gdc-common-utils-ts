// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-composition.ts

import { CompositionClaim } from '../models/interoperable-claims/composition-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceListToCsv, referenceToValue } from './convert-shared';

export function compositionFlatToFhirR4(claims: FlatClaims): FhirResource {
  return {
    resourceType: 'Composition',
    identifier: claims[CompositionClaim.Identifier] ? { value: claims[CompositionClaim.Identifier] } : undefined,
    subject: claims[CompositionClaim.Subject] ? { reference: claims[CompositionClaim.Subject] } : undefined,
    author: claims[CompositionClaim.Author] ? claims[CompositionClaim.Author]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    date: claims[CompositionClaim.Date],
    title: claims[CompositionClaim.Title],
    type: claims[CompositionClaim.Type] ? { coding: codingFromValue(claims[CompositionClaim.Type]) } : undefined,
    section: claims[CompositionClaim.Section]
      ? claims[CompositionClaim.Section]!.split(',').map((value) => ({ code: { coding: codingFromValue(value.trim()) } }))
      : undefined,
  };
}

export function compositionFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const sectionValues = Array.isArray(resource.section)
    ? (resource.section as Array<Record<string, unknown>>)
      .map((item) => codingToValue((item?.code as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]))
      .filter((item): item is string => Boolean(item))
    : [];
  return {
    [CompositionClaim.Subject]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [CompositionClaim.Section]: sectionValues.length ? sectionValues.join(',') : undefined,
    [CompositionClaim.Author]: referenceListToCsv(resource.author as Array<{ reference?: string }> | undefined),
    [CompositionClaim.Date]: resource.date as string | undefined,
    [CompositionClaim.Entry]: undefined,
    [CompositionClaim.Type]: codingToValue((resource.type as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [CompositionClaim.Identifier]: (resource.identifier as { value?: string } | undefined)?.value,
    [CompositionClaim.Title]: resource.title as string | undefined,
  };
}
