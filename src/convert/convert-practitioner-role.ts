// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { PractitionerRoleClaim } from '../models/interoperable-claims/practitioner-role-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import {
  codingFromValue,
  codingToValue,
  referenceListToCsv,
  referenceToValue,
} from './convert-shared';

export function practitionerRoleFhirR4ToFlat(
  resource: FhirResource,
  _context: string = 'org.hl7.fhir.api',
): FlatClaims {
  const concept = (resource.code as Array<{
    text?: string;
    coding?: Array<{ system?: string; code?: string; display?: string }>;
  }> | undefined)?.[0];
  return {
    [PractitionerRoleClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [PractitionerRoleClaim.Active]: resource.active === undefined ? undefined : String(resource.active),
    [PractitionerRoleClaim.Practitioner]: referenceToValue(resource.practitioner as { reference?: string } | undefined),
    [PractitionerRoleClaim.Organization]: referenceToValue(resource.organization as { reference?: string } | undefined),
    [PractitionerRoleClaim.Location]: referenceListToCsv(resource.location as Array<{ reference?: string }> | undefined),
    [PractitionerRoleClaim.Service]: referenceListToCsv(resource.healthcareService as Array<{ reference?: string }> | undefined),
    [PractitionerRoleClaim.Specialty]: codingToValue((resource.specialty as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [PractitionerRoleClaim.PeriodStart]: (resource.period as { start?: string } | undefined)?.start,
    [PractitionerRoleClaim.PeriodEnd]: (resource.period as { end?: string } | undefined)?.end,
    [PractitionerRoleClaim.Code]: codingToValue(concept?.coding?.[0]),
    [PractitionerRoleClaim.CodeText]: concept?.text,
    [PractitionerRoleClaim.CodeDisplay]: concept?.coding?.[0]?.display,
  };
}

export function practitionerRoleFlatToFhirR4(claims: FlatClaims): FhirResource {
  const location = claims[PractitionerRoleClaim.Location]?.split(',').map((reference) => ({ reference: reference.trim() }));
  const healthcareService = claims[PractitionerRoleClaim.Service]?.split(',').map((reference) => ({ reference: reference.trim() }));
  const coding = codingFromValue(claims[PractitionerRoleClaim.Code])?.map((item) => ({
    ...item,
    ...(claims[PractitionerRoleClaim.CodeDisplay]
      ? { display: claims[PractitionerRoleClaim.CodeDisplay] }
      : {}),
  }));
  return {
    resourceType: 'PractitionerRole',
    identifier: claims[PractitionerRoleClaim.Identifier]
      ? [{ value: claims[PractitionerRoleClaim.Identifier] }]
      : undefined,
    active: claims[PractitionerRoleClaim.Active] === undefined
      ? undefined
      : claims[PractitionerRoleClaim.Active] === 'true',
    practitioner: claims[PractitionerRoleClaim.Practitioner]
      ? { reference: claims[PractitionerRoleClaim.Practitioner] }
      : undefined,
    organization: claims[PractitionerRoleClaim.Organization]
      ? { reference: claims[PractitionerRoleClaim.Organization] }
      : undefined,
    location,
    healthcareService,
    specialty: claims[PractitionerRoleClaim.Specialty]
      ? [{ coding: codingFromValue(claims[PractitionerRoleClaim.Specialty]) }]
      : undefined,
    period: claims[PractitionerRoleClaim.PeriodStart] || claims[PractitionerRoleClaim.PeriodEnd]
      ? {
        start: claims[PractitionerRoleClaim.PeriodStart],
        end: claims[PractitionerRoleClaim.PeriodEnd],
      }
      : undefined,
    code: coding || claims[PractitionerRoleClaim.CodeText] ? [{
      ...(coding ? { coding } : {}),
      ...(claims[PractitionerRoleClaim.CodeText]
        ? { text: claims[PractitionerRoleClaim.CodeText] }
        : {}),
    }] : undefined,
  };
}
