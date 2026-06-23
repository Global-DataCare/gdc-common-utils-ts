// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-procedure.ts

import { ProcedureClaim } from '../models/interoperable-claims/procedure-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceListToCsv, referenceToValue } from './convert-shared';

export function procedureFlatToFhirR4(claims: FlatClaims): FhirResource {
  const subject = claims[ProcedureClaim.Subject] ?? claims[ProcedureClaim.Patient];
  return {
    resourceType: 'Procedure',
    identifier: claims[ProcedureClaim.Identifier] ? [{ value: claims[ProcedureClaim.Identifier] }] : undefined,
    status: claims[ProcedureClaim.Status],
    subject: subject ? { reference: subject } : undefined,
    code: claims[ProcedureClaim.Code]
      ? {
        coding: codingFromValue(claims[ProcedureClaim.Code])?.map((coding) => ({
          ...coding,
          ...(claims[ProcedureClaim.CodeDisplay]
            ? { display: claims[ProcedureClaim.CodeDisplay] }
            : {}),
        })),
        ...(claims[ProcedureClaim.CodeText]
          ? { text: claims[ProcedureClaim.CodeText] }
          : {}),
      }
      : undefined,
    performedDateTime: claims[ProcedureClaim.Date],
    note: claims[ProcedureClaim.Note] ? [{ text: claims[ProcedureClaim.Note] }] : undefined,
    basedOn: claims[ProcedureClaim.BasedOn] ? claims[ProcedureClaim.BasedOn]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    bodySite: claims[ProcedureClaim.BodySite] ? [{ coding: codingFromValue(claims[ProcedureClaim.BodySite]) }] : undefined,
    encounter: claims[ProcedureClaim.Encounter] ? { reference: claims[ProcedureClaim.Encounter] } : undefined,
    instantiatesCanonical: claims[ProcedureClaim.InstantiatesCanonical] ? [claims[ProcedureClaim.InstantiatesCanonical]] : undefined,
    instantiatesUri: claims[ProcedureClaim.InstantiatesUri] ? [claims[ProcedureClaim.InstantiatesUri]] : undefined,
    location: claims[ProcedureClaim.Location] ? { reference: claims[ProcedureClaim.Location] } : undefined,
    partOf: claims[ProcedureClaim.PartOf] ? claims[ProcedureClaim.PartOf]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    performer: claims[ProcedureClaim.Performer] ? claims[ProcedureClaim.Performer]!.split(',').map((reference) => ({ actor: { reference: reference.trim() } })) : undefined,
    reasonCode: claims[ProcedureClaim.ReasonCode] ? [{ coding: codingFromValue(claims[ProcedureClaim.ReasonCode]) }] : undefined,
    reasonReference: claims[ProcedureClaim.ReasonReference] ? claims[ProcedureClaim.ReasonReference]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
  };
}

export function procedureFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const performer = Array.isArray(resource.performer)
    ? (resource.performer as Array<Record<string, unknown>>).map((item) => referenceToValue(item?.actor as { reference?: string } | undefined)).filter((item): item is string => Boolean(item))
    : [];
  return {
    [ProcedureClaim.BasedOn]: referenceListToCsv(resource.basedOn as Array<{ reference?: string }> | undefined),
    [ProcedureClaim.BodySite]: codingToValue((resource.bodySite as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [ProcedureClaim.Code]: codingToValue((resource.code as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [ProcedureClaim.CodeText]: (resource.code as { text?: string } | undefined)?.text,
    [ProcedureClaim.CodeDisplay]: (resource.code as { coding?: Array<{ display?: string }> } | undefined)?.coding?.[0]?.display,
    [ProcedureClaim.Date]: (resource.performedDateTime as string | undefined) || (resource.performedPeriod as { start?: string } | undefined)?.start,
    [ProcedureClaim.Encounter]: referenceToValue(resource.encounter as { reference?: string } | undefined),
    [ProcedureClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [ProcedureClaim.InstantiatesCanonical]: Array.isArray(resource.instantiatesCanonical) ? resource.instantiatesCanonical[0] as string | undefined : undefined,
    [ProcedureClaim.InstantiatesUri]: Array.isArray(resource.instantiatesUri) ? resource.instantiatesUri[0] as string | undefined : undefined,
    [ProcedureClaim.Location]: referenceToValue(resource.location as { reference?: string } | undefined),
    [ProcedureClaim.PartOf]: referenceListToCsv(resource.partOf as Array<{ reference?: string }> | undefined),
    [ProcedureClaim.Patient]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [ProcedureClaim.Performer]: performer.length ? performer.join(',') : undefined,
    [ProcedureClaim.ReasonCode]: codingToValue((resource.reasonCode as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [ProcedureClaim.ReasonReference]: referenceListToCsv(resource.reasonReference as Array<{ reference?: string }> | undefined),
    [ProcedureClaim.Status]: resource.status as string | undefined,
    [ProcedureClaim.Subject]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [ProcedureClaim.Note]: (resource.note as Array<{ text?: string }> | undefined)?.[0]?.text,
  };
}
