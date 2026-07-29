// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-diagnostic-report.ts

import { DiagnosticReportClaim } from '../models/interoperable-claims/diagnostic-report-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceListToCsv, referenceToValue } from './convert-shared';

export function diagnosticReportFlatToFhirR4(claims: FlatClaims): FhirResource {
  const subject = claims[DiagnosticReportClaim.Subject] ?? claims[DiagnosticReportClaim.Patient];
  return {
    resourceType: 'DiagnosticReport',
    identifier: claims[DiagnosticReportClaim.Identifier] ? [{ value: claims[DiagnosticReportClaim.Identifier] }] : undefined,
    status: claims[DiagnosticReportClaim.Status],
    category: claims[DiagnosticReportClaim.Category] ? [{ coding: codingFromValue(claims[DiagnosticReportClaim.Category]) }] : undefined,
    code: claims[DiagnosticReportClaim.Code] ? {
      coding: codingFromValue(claims[DiagnosticReportClaim.Code])?.map((coding) => ({
        ...coding,
        ...(claims[DiagnosticReportClaim.CodeDisplay] ? { display: claims[DiagnosticReportClaim.CodeDisplay] } : {}),
      })),
      ...(claims[DiagnosticReportClaim.CodeText] ? { text: claims[DiagnosticReportClaim.CodeText] } : {}),
    } : undefined,
    subject: subject ? { reference: subject } : undefined,
    encounter: claims[DiagnosticReportClaim.Encounter] ? { reference: claims[DiagnosticReportClaim.Encounter] } : undefined,
    effectiveDateTime: claims[DiagnosticReportClaim.Date],
    basedOn: claims[DiagnosticReportClaim.BasedOn] ? claims[DiagnosticReportClaim.BasedOn]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    performer: claims[DiagnosticReportClaim.Performer] ? claims[DiagnosticReportClaim.Performer]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    result: claims[DiagnosticReportClaim.Result] ? claims[DiagnosticReportClaim.Result]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    resultsInterpreter: claims[DiagnosticReportClaim.ResultsInterpreter] ? claims[DiagnosticReportClaim.ResultsInterpreter]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    specimen: claims[DiagnosticReportClaim.Specimen] ? claims[DiagnosticReportClaim.Specimen]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    media: claims[DiagnosticReportClaim.Media] ? claims[DiagnosticReportClaim.Media]!.split(',').map((reference) => ({ link: { reference: reference.trim() } })) : undefined,
    presentedForm: (claims[DiagnosticReportClaim.PresentedFormContentType] || claims[DiagnosticReportClaim.PresentedFormData] || claims[DiagnosticReportClaim.PresentedFormUrl]) ? [{
      contentType: claims[DiagnosticReportClaim.PresentedFormContentType],
      data: claims[DiagnosticReportClaim.PresentedFormData],
      url: claims[DiagnosticReportClaim.PresentedFormUrl],
    }] : undefined,
  };
}

export function diagnosticReportFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const form = Array.isArray(resource.presentedForm) ? resource.presentedForm[0] as Record<string, unknown> | undefined : undefined;
  const media = Array.isArray(resource.media)
    ? (resource.media as Array<Record<string, unknown>>)
      .map((item) => referenceToValue(item?.link as { reference?: string } | undefined))
      .filter((item): item is string => Boolean(item))
    : [];
  return {
    [DiagnosticReportClaim.BasedOn]: referenceListToCsv(resource.basedOn as Array<{ reference?: string }> | undefined),
    [DiagnosticReportClaim.Category]: codingToValue((resource.category as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [DiagnosticReportClaim.Code]: codingToValue((resource.code as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [DiagnosticReportClaim.CodeText]: (resource.code as { text?: string } | undefined)?.text,
    [DiagnosticReportClaim.CodeDisplay]: (resource.code as { coding?: Array<{ display?: string }> } | undefined)?.coding?.[0]?.display,
    [DiagnosticReportClaim.Date]: (resource.effectiveDateTime as string | undefined) || (resource.issued as string | undefined),
    [DiagnosticReportClaim.Encounter]: referenceToValue(resource.encounter as { reference?: string } | undefined),
    [DiagnosticReportClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [DiagnosticReportClaim.Media]: media.length ? media.join(',') : undefined,
    [DiagnosticReportClaim.Patient]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [DiagnosticReportClaim.Performer]: referenceListToCsv(resource.performer as Array<{ reference?: string }> | undefined),
    [DiagnosticReportClaim.Result]: referenceListToCsv(resource.result as Array<{ reference?: string }> | undefined),
    [DiagnosticReportClaim.ResultsInterpreter]: referenceListToCsv(resource.resultsInterpreter as Array<{ reference?: string }> | undefined),
    [DiagnosticReportClaim.Specimen]: referenceListToCsv(resource.specimen as Array<{ reference?: string }> | undefined),
    [DiagnosticReportClaim.Status]: resource.status as string | undefined,
    [DiagnosticReportClaim.Subject]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [DiagnosticReportClaim.PresentedFormContentType]: form?.contentType as string | undefined,
    [DiagnosticReportClaim.PresentedFormData]: form?.data as string | undefined,
    [DiagnosticReportClaim.PresentedFormUrl]: form?.url as string | undefined,
  };
}
