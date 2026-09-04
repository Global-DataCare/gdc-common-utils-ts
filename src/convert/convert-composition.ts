// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-composition.ts

import { CompositionClaim } from '../models/interoperable-claims/composition-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceListToCsv, referenceToValue, requireClaim } from './convert-shared';

type CompositionAttesterR4 = {
  mode: string;
  party?: { reference: string };
  time?: string;
};

function splitAlignedCsv(value?: string): string[] {
  return value === undefined ? [] : value.split(',').map((item) => item.trim());
}

function attestersFromClaims(claims: FlatClaims): CompositionAttesterR4[] | undefined {
  const partyClaim = claims[CompositionClaim.Attester];
  const modeClaim = claims[CompositionClaim.AttesterMode];
  const timeClaim = claims[CompositionClaim.AttesterTime];
  if (partyClaim === undefined && modeClaim === undefined && timeClaim === undefined) return undefined;
  const modes = splitAlignedCsv(requireClaim(claims, CompositionClaim.AttesterMode));
  const parties = splitAlignedCsv(partyClaim);
  const times = splitAlignedCsv(timeClaim);
  if (modes.some((mode) => !mode) || parties.length > modes.length || times.length > modes.length) {
    throw new Error('Composition attester claims must be positionally aligned with non-empty attester modes.');
  }
  return modes.map((mode, index) => ({
    mode,
    ...(parties[index] ? { party: { reference: parties[index] } } : {}),
    ...(times[index] ? { time: times[index] } : {}),
  }));
}

function alignedAttesterValue(
  attesters: CompositionAttesterR4[],
  select: (attester: CompositionAttesterR4) => string | undefined,
): string | undefined {
  if (attesters.length === 0) return undefined;
  return attesters.map((attester) => select(attester) || '').join(',');
}

export function compositionFlatToFhirR4(claims: FlatClaims): FhirResource {
  return {
    resourceType: 'Composition',
    identifier: claims[CompositionClaim.Identifier] ? { value: claims[CompositionClaim.Identifier] } : undefined,
    subject: claims[CompositionClaim.Subject] ? { reference: claims[CompositionClaim.Subject] } : undefined,
    author: claims[CompositionClaim.Author] ? claims[CompositionClaim.Author]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    attester: attestersFromClaims(claims),
    custodian: claims[CompositionClaim.Custodian] ? { reference: claims[CompositionClaim.Custodian] } : undefined,
    date: claims[CompositionClaim.Date],
    title: claims[CompositionClaim.Title],
    type: claims[CompositionClaim.Type] ? { coding: codingFromValue(claims[CompositionClaim.Type]) } : undefined,
    section: claims[CompositionClaim.Section]
      ? claims[CompositionClaim.Section]!.split(',').map((value) => ({ code: { coding: codingFromValue(value.trim()) } }))
      : undefined,
  };
}

export function compositionFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const attesters = Array.isArray(resource.attester)
    ? resource.attester as CompositionAttesterR4[]
    : [];
  const sectionValues = Array.isArray(resource.section)
    ? (resource.section as Array<Record<string, unknown>>)
      .map((item) => codingToValue((item?.code as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]))
      .filter((item): item is string => Boolean(item))
    : [];
  return {
    [CompositionClaim.Subject]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [CompositionClaim.Section]: sectionValues.length ? sectionValues.join(',') : undefined,
    [CompositionClaim.Author]: referenceListToCsv(resource.author as Array<{ reference?: string }> | undefined),
    [CompositionClaim.Attester]: alignedAttesterValue(attesters, (attester) => attester.party?.reference),
    [CompositionClaim.AttesterMode]: alignedAttesterValue(attesters, (attester) => attester.mode),
    [CompositionClaim.AttesterTime]: alignedAttesterValue(attesters, (attester) => attester.time),
    [CompositionClaim.Custodian]: referenceToValue(resource.custodian as { reference?: string } | undefined),
    [CompositionClaim.Date]: resource.date as string | undefined,
    [CompositionClaim.Entry]: undefined,
    [CompositionClaim.Type]: codingToValue((resource.type as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [CompositionClaim.Identifier]: (resource.identifier as { value?: string } | undefined)?.value,
    [CompositionClaim.Title]: resource.title as string | undefined,
  };
}
