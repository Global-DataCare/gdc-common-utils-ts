// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/convert/convert-location.ts

import { LocationClaim } from '../models/interoperable-claims/location-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceToValue } from './convert-shared';

function splitCsv(value?: string): string[] {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function locationFlatToFhirR4(claims: FlatClaims): FhirResource {
  return {
    resourceType: 'Location',
    identifier: claims[LocationClaim.Identifier] ? [{ value: claims[LocationClaim.Identifier] }] : undefined,
    status: claims[LocationClaim.Status],
    name: claims[LocationClaim.Name],
    description: claims[LocationClaim.Description],
    type: claims[LocationClaim.Type] ? [{ coding: codingFromValue(claims[LocationClaim.Type]) }] : undefined,
    mode: claims[LocationClaim.Mode],
    telecom: splitCsv(claims[LocationClaim.Telecom]).map((value) => ({ value })),
    address: claims[LocationClaim.Address] ? { text: claims[LocationClaim.Address] } : undefined,
    physicalType: claims[LocationClaim.PhysicalType] ? { coding: codingFromValue(claims[LocationClaim.PhysicalType]) } : undefined,
    managingOrganization: claims[LocationClaim.ManagingOrganization] ? { reference: claims[LocationClaim.ManagingOrganization] } : undefined,
    partOf: claims[LocationClaim.PartOf] ? { reference: claims[LocationClaim.PartOf] } : undefined,
  };
}

export function locationFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const telecom = (resource.telecom as Array<{ value?: string }> | undefined)
    ?.map((item) => item?.value)
    .filter((item): item is string => Boolean(item));

  return {
    [LocationClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [LocationClaim.Status]: resource.status as string | undefined,
    [LocationClaim.Name]: resource.name as string | undefined,
    [LocationClaim.Description]: resource.description as string | undefined,
    [LocationClaim.Type]: codingToValue((resource.type as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [LocationClaim.Mode]: resource.mode as string | undefined,
    [LocationClaim.Telecom]: telecom?.length ? telecom.join(',') : undefined,
    [LocationClaim.Address]: (resource.address as { text?: string } | undefined)?.text,
    [LocationClaim.PhysicalType]: codingToValue((resource.physicalType as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [LocationClaim.ManagingOrganization]: referenceToValue(resource.managingOrganization as { reference?: string } | undefined),
    [LocationClaim.PartOf]: referenceToValue(resource.partOf as { reference?: string } | undefined),
  };
}
