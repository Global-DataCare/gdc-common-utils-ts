// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-clinical-impression.ts

import { ClinicalImpressionClaim } from '../models/interoperable-claims/clinical-impression-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceListToCsv, referenceToValue } from './convert-shared';

export function clinicalImpressionFlatToFhirR4(claims: FlatClaims): FhirResource {
  return {
    resourceType: 'ClinicalImpression',
    identifier: claims[ClinicalImpressionClaim.Identifier] ? [{ value: claims[ClinicalImpressionClaim.Identifier] }] : undefined,
    status: claims[ClinicalImpressionClaim.Status],
    description: claims[ClinicalImpressionClaim.Description],
    subject: claims[ClinicalImpressionClaim.Subject] ? { reference: claims[ClinicalImpressionClaim.Subject] } : undefined,
    encounter: claims[ClinicalImpressionClaim.Encounter] ? { reference: claims[ClinicalImpressionClaim.Encounter] } : undefined,
    effectiveDateTime: claims[ClinicalImpressionClaim.EffectiveDateTime],
    date: claims[ClinicalImpressionClaim.Date],
    assessor: claims[ClinicalImpressionClaim.Assessor] ? { reference: claims[ClinicalImpressionClaim.Assessor] } : undefined,
    problem: claims[ClinicalImpressionClaim.Problem] ? claims[ClinicalImpressionClaim.Problem]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    finding: claims[ClinicalImpressionClaim.Finding] ? claims[ClinicalImpressionClaim.Finding]!.split(',').map((reference) => ({ itemReference: { reference: reference.trim() } })) : undefined,
    prognosisCodeableConcept: claims[ClinicalImpressionClaim.PrognosisCode] ? [{ coding: codingFromValue(claims[ClinicalImpressionClaim.PrognosisCode]) }] : undefined,
    summary: claims[ClinicalImpressionClaim.Summary],
  };
}

export function clinicalImpressionFhirR4ToFlat(resource: FhirResource): FlatClaims {
  return {
    [ClinicalImpressionClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [ClinicalImpressionClaim.Status]: resource.status as string | undefined,
    [ClinicalImpressionClaim.Description]: resource.description as string | undefined,
    [ClinicalImpressionClaim.Subject]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [ClinicalImpressionClaim.Encounter]: referenceToValue(resource.encounter as { reference?: string } | undefined),
    [ClinicalImpressionClaim.EffectiveDateTime]: resource.effectiveDateTime as string | undefined,
    [ClinicalImpressionClaim.Date]: resource.date as string | undefined,
    [ClinicalImpressionClaim.Assessor]: referenceToValue(resource.assessor as { reference?: string } | undefined),
    [ClinicalImpressionClaim.Problem]: referenceListToCsv(resource.problem as Array<{ reference?: string }> | undefined),
    [ClinicalImpressionClaim.Finding]: Array.isArray(resource.finding)
      ? (resource.finding as Array<Record<string, unknown>>)
        .map((item) => referenceToValue(item?.itemReference as { reference?: string } | undefined))
        .filter((item): item is string => Boolean(item))
        .join(',')
      : undefined,
    [ClinicalImpressionClaim.PrognosisCode]: codingToValue((resource.prognosisCodeableConcept as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [ClinicalImpressionClaim.Summary]: resource.summary as string | undefined,
  };
}
