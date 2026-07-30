// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { PractitionerRoleClaim } from '../models/interoperable-claims/practitioner-role-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import {
  codingFromValue,
  codingToValue,
  fhirResourceToFlatClaims,
  flatClaimsToFhirResource,
} from './convert-shared';

export function practitionerRoleFhirR4ToFlat(
  resource: FhirResource,
  context: string = 'org.hl7.fhir.r4',
): FlatClaims {
  const concept = (resource.code as Array<{
    text?: string;
    coding?: Array<{ system?: string; code?: string; display?: string }>;
  }> | undefined)?.[0];
  return {
    ...fhirResourceToFlatClaims(resource, context),
    [PractitionerRoleClaim.Code]: codingToValue(concept?.coding?.[0]),
    [PractitionerRoleClaim.CodeText]: concept?.text,
    [PractitionerRoleClaim.CodeDisplay]: concept?.coding?.[0]?.display,
  };
}

export function practitionerRoleFlatToFhirR4(claims: FlatClaims): FhirResource {
  const structuralClaims = { ...claims };
  delete structuralClaims[PractitionerRoleClaim.Code];
  delete structuralClaims[PractitionerRoleClaim.CodeText];
  delete structuralClaims[PractitionerRoleClaim.CodeDisplay];
  const resource = flatClaimsToFhirResource(structuralClaims);
  const coding = codingFromValue(claims[PractitionerRoleClaim.Code])?.map((item) => ({
    ...item,
    ...(claims[PractitionerRoleClaim.CodeDisplay]
      ? { display: claims[PractitionerRoleClaim.CodeDisplay] }
      : {}),
  }));
  if (coding || claims[PractitionerRoleClaim.CodeText]) {
    resource.code = [{
      ...(coding ? { coding } : {}),
      ...(claims[PractitionerRoleClaim.CodeText]
        ? { text: claims[PractitionerRoleClaim.CodeText] }
        : {}),
    }];
  }
  return resource;
}
