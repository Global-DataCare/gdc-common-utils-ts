// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-device.ts

import { DeviceClaim } from '../models/interoperable-claims/device-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceToValue } from './convert-shared';

export function deviceFlatToFhirR4(claims: FlatClaims): FhirResource {
  const typeCoding = codingFromValue(claims[DeviceClaim.Type])?.map((coding) => ({
    ...coding,
    ...(claims[DeviceClaim.TypeDisplay] ? { display: claims[DeviceClaim.TypeDisplay] } : {}),
  }));
  return {
    resourceType: 'Device',
    identifier: claims[DeviceClaim.Identifier] ? [{ value: claims[DeviceClaim.Identifier] }] : undefined,
    deviceName: claims[DeviceClaim.DeviceName] ? [{ name: claims[DeviceClaim.DeviceName] }] : undefined,
    location: claims[DeviceClaim.Location] ? { reference: claims[DeviceClaim.Location] } : undefined,
    manufacturer: claims[DeviceClaim.Manufacturer],
    modelNumber: claims[DeviceClaim.Model],
    owner: claims[DeviceClaim.Organization] ? { reference: claims[DeviceClaim.Organization] } : undefined,
    patient: claims[DeviceClaim.Patient] ? { reference: claims[DeviceClaim.Patient] } : undefined,
    serialNumber: claims[DeviceClaim.SerialNumber],
    status: claims[DeviceClaim.Status],
    type: claims[DeviceClaim.Type] || claims[DeviceClaim.TypeText] || claims[DeviceClaim.TypeDisplay]
      ? {
        ...(typeCoding ? { coding: typeCoding } : {}),
        ...(claims[DeviceClaim.TypeText] ? { text: claims[DeviceClaim.TypeText] } : {}),
      }
      : undefined,
    udiCarrier: claims[DeviceClaim.UdiCarrier] ? [{ carrierHRF: claims[DeviceClaim.UdiCarrier] }] : undefined,
    url: claims[DeviceClaim.Url],
  };
}

export function deviceFhirR4ToFlat(resource: FhirResource): FlatClaims {
  return {
    [DeviceClaim.DeviceName]: (resource.deviceName as Array<{ name?: string }> | undefined)?.[0]?.name,
    [DeviceClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [DeviceClaim.Location]: referenceToValue(resource.location as { reference?: string } | undefined),
    [DeviceClaim.Manufacturer]: resource.manufacturer as string | undefined,
    [DeviceClaim.Model]: (resource.modelNumber as string | undefined) || (resource.model as string | undefined),
    [DeviceClaim.Organization]: referenceToValue(resource.owner as { reference?: string } | undefined),
    [DeviceClaim.Patient]: referenceToValue(resource.patient as { reference?: string } | undefined),
    [DeviceClaim.SerialNumber]: resource.serialNumber as string | undefined,
    [DeviceClaim.Status]: resource.status as string | undefined,
    [DeviceClaim.Type]: codingToValue((resource.type as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [DeviceClaim.TypeText]: (resource.type as { text?: string } | undefined)?.text,
    [DeviceClaim.TypeDisplay]: (resource.type as { coding?: Array<{ display?: string }> } | undefined)?.coding?.[0]?.display,
    [DeviceClaim.UdiCarrier]: (resource.udiCarrier as Array<{ carrierHRF?: string }> | undefined)?.[0]?.carrierHRF,
    [DeviceClaim.Url]: resource.url as string | undefined,
  };
}
