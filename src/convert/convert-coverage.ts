// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-coverage.ts

import { CoverageClaim } from '../models/interoperable-claims/coverage-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceListToCsv, referenceToValue } from './convert-shared';

export function coverageFlatToFhirR4(claims: FlatClaims): FhirResource {
  return {
    resourceType: 'Coverage',
    identifier: claims[CoverageClaim.Identifier] ? [{ value: claims[CoverageClaim.Identifier] }] : undefined,
    status: claims[CoverageClaim.Status],
    type: claims[CoverageClaim.Type] ? { coding: codingFromValue(claims[CoverageClaim.Type]) } : undefined,
    policyHolder: claims[CoverageClaim.PolicyHolder] ? { reference: claims[CoverageClaim.PolicyHolder] } : undefined,
    subscriber: claims[CoverageClaim.Subscriber] ? { reference: claims[CoverageClaim.Subscriber] } : undefined,
    beneficiary: claims[CoverageClaim.Beneficiary] ? { reference: claims[CoverageClaim.Beneficiary] } : undefined,
    relationship: claims[CoverageClaim.Relationship] ? { coding: codingFromValue(claims[CoverageClaim.Relationship]) } : undefined,
    period: (claims[CoverageClaim.PeriodStart] || claims[CoverageClaim.PeriodEnd]) ? {
      start: claims[CoverageClaim.PeriodStart],
      end: claims[CoverageClaim.PeriodEnd],
    } : undefined,
    payor: claims[CoverageClaim.Payor] ? claims[CoverageClaim.Payor]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    class: claims[CoverageClaim.Class]
      ? claims[CoverageClaim.Class]!.split(',').map((value) => {
        const [type, val] = value.trim().split('|');
        return { type: { text: type }, value: val ?? type };
      })
      : undefined,
  };
}

export function coverageFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const classValues = Array.isArray(resource.class)
    ? (resource.class as Array<Record<string, unknown>>)
      .map((item) => {
        const type = (item?.type as { text?: string } | undefined)?.text;
        const value = item?.value as string | undefined;
        return type && value ? `${type}|${value}` : undefined;
      })
      .filter((item): item is string => Boolean(item))
    : [];
  return {
    [CoverageClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [CoverageClaim.Status]: resource.status as string | undefined,
    [CoverageClaim.Type]: codingToValue((resource.type as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [CoverageClaim.PolicyHolder]: referenceToValue(resource.policyHolder as { reference?: string } | undefined),
    [CoverageClaim.Subscriber]: referenceToValue(resource.subscriber as { reference?: string } | undefined),
    [CoverageClaim.Beneficiary]: referenceToValue(resource.beneficiary as { reference?: string } | undefined),
    [CoverageClaim.Relationship]: codingToValue((resource.relationship as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [CoverageClaim.PeriodStart]: (resource.period as { start?: string } | undefined)?.start,
    [CoverageClaim.PeriodEnd]: (resource.period as { end?: string } | undefined)?.end,
    [CoverageClaim.Payor]: referenceListToCsv(resource.payor as Array<{ reference?: string }> | undefined),
    [CoverageClaim.Class]: classValues.length ? classValues.join(',') : undefined,
  };
}
