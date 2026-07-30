// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { ClaimConsent } from '../models/consent-rule';
import type { FhirResource, FlatClaims } from './convert-shared';
import {
  codingFromValue,
  codingToValue,
  fhirResourceToFlatClaims,
  flatClaimsToFhirResource,
} from './convert-shared';

export function consentFhirR4ToFlat(
  resource: FhirResource,
  context: string = 'org.hl7.fhir.r4',
): FlatClaims {
  const concept = (resource.category as Array<{
    text?: string;
    coding?: Array<{ system?: string; code?: string; display?: string }>;
  }> | undefined)?.[0];
  return {
    ...fhirResourceToFlatClaims(resource, context),
    [ClaimConsent.category]: codingToValue(concept?.coding?.[0]),
    [ClaimConsent.categoryText]: concept?.text,
    [ClaimConsent.categoryDisplay]: concept?.coding?.[0]?.display,
  };
}

export function consentFlatToFhirR4(claims: FlatClaims): FhirResource {
  const structuralClaims = { ...claims };
  delete structuralClaims[ClaimConsent.category];
  delete structuralClaims[ClaimConsent.categoryText];
  delete structuralClaims[ClaimConsent.categoryDisplay];
  const resource = flatClaimsToFhirResource(structuralClaims);
  const coding = codingFromValue(claims[ClaimConsent.category])?.map((item) => ({
    ...item,
    ...(claims[ClaimConsent.categoryDisplay]
      ? { display: claims[ClaimConsent.categoryDisplay] }
      : {}),
  }));
  if (coding || claims[ClaimConsent.categoryText]) {
    resource.category = [{
      ...(coding ? { coding } : {}),
      ...(claims[ClaimConsent.categoryText] ? { text: claims[ClaimConsent.categoryText] } : {}),
    }];
  }
  return resource;
}
