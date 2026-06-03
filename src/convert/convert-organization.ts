// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/convert/convert-organization.ts

import { OrganizationClaim } from '../models/interoperable-claims/organization-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceToValue } from './convert-shared';

function splitCsv(value?: string): string[] {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function organizationFlatToFhirR4(claims: FlatClaims): FhirResource {
  return {
    resourceType: 'Organization',
    identifier: claims[OrganizationClaim.Identifier] ? [{ value: claims[OrganizationClaim.Identifier] }] : undefined,
    active: claims[OrganizationClaim.Active] === undefined ? undefined : claims[OrganizationClaim.Active] === 'true',
    type: claims[OrganizationClaim.Type] ? [{ coding: codingFromValue(claims[OrganizationClaim.Type]) }] : undefined,
    name: claims[OrganizationClaim.Name],
    alias: splitCsv(claims[OrganizationClaim.Alias]),
    partOf: claims[OrganizationClaim.PartOf] ? { reference: claims[OrganizationClaim.PartOf] } : undefined,
    telecom: splitCsv(claims[OrganizationClaim.Telecom]).map((value) => ({ value })),
    address: claims[OrganizationClaim.Address] ? [{ text: claims[OrganizationClaim.Address] }] : undefined,
  };
}

export function organizationFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const alias = (resource.alias as string[] | undefined)?.filter(Boolean);
  const telecom = (resource.telecom as Array<{ value?: string }> | undefined)
    ?.map((item) => item?.value)
    .filter((item): item is string => Boolean(item));

  return {
    [OrganizationClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [OrganizationClaim.Active]: resource.active === undefined ? undefined : String(resource.active),
    [OrganizationClaim.Type]: codingToValue((resource.type as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [OrganizationClaim.Name]: resource.name as string | undefined,
    [OrganizationClaim.Alias]: alias?.length ? alias.join(',') : undefined,
    [OrganizationClaim.PartOf]: referenceToValue(resource.partOf as { reference?: string } | undefined),
    [OrganizationClaim.Telecom]: telecom?.length ? telecom.join(',') : undefined,
    [OrganizationClaim.Address]: (resource.address as Array<{ text?: string }> | undefined)?.[0]?.text,
  };
}
