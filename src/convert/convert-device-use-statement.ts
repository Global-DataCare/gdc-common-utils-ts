// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-device-use-statement.ts

import { DeviceUseStatementClaim } from '../models/interoperable-claims/device-use-statement-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { requireClaim } from './convert-shared';

export function deviceUseStatementFlatToFhirR4(claims: FlatClaims): FhirResource {
  const subject = requireClaim(claims, DeviceUseStatementClaim.Subject);
  const device = requireClaim(claims, DeviceUseStatementClaim.Device);
  const status = requireClaim(claims, DeviceUseStatementClaim.Status);
  return {
    resourceType: 'DeviceUseStatement',
    identifier: claims[DeviceUseStatementClaim.Identifier] ? [{ value: claims[DeviceUseStatementClaim.Identifier] }] : undefined,
    subject: { reference: subject },
    device: {
      reference: device,
      ...(claims[DeviceUseStatementClaim.DeviceDisplay]
        ? { display: claims[DeviceUseStatementClaim.DeviceDisplay] }
        : {}),
    },
    status,
    recordedOn: claims[DeviceUseStatementClaim.RecordedOn] || claims['DeviceUseStatement.recordedon'],
    timingDateTime: claims[DeviceUseStatementClaim.TimingDateTime],
    _timingDateTime: claims[DeviceUseStatementClaim.TimingAbsentReason] ? { extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/data-absent-reason', valueCode: claims[DeviceUseStatementClaim.TimingAbsentReason] }] } : undefined,
  };
}

export function deviceUseStatementFhirR4ToFlat(resource: FhirResource): FlatClaims {
  return {
    [DeviceUseStatementClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [DeviceUseStatementClaim.Subject]: (resource.subject as { reference?: string } | undefined)?.reference,
    [DeviceUseStatementClaim.Device]: (resource.device as { reference?: string } | undefined)?.reference,
    [DeviceUseStatementClaim.DeviceDisplay]: (resource.device as { display?: string } | undefined)?.display,
    [DeviceUseStatementClaim.Status]: resource.status as string | undefined,
    [DeviceUseStatementClaim.RecordedOn]: resource.recordedOn as string | undefined,
    [DeviceUseStatementClaim.TimingDateTime]: resource.timingDateTime as string | undefined,
    [DeviceUseStatementClaim.TimingAbsentReason]: ((resource._timingDateTime as { extension?: Array<{ valueCode?: string }> } | undefined)?.extension)?.[0]?.valueCode,
  };
}
