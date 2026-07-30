// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-document-reference.ts

import { DocumentReferenceClaim } from '../models/interoperable-claims/document-reference-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, requireClaim } from './convert-shared';

export function documentReferenceFlatToFhirR4(claims: FlatClaims): FhirResource {
  const subject = requireClaim(claims, DocumentReferenceClaim.Subject);
  const typeCoding = codingFromValue(claims[DocumentReferenceClaim.Type])?.map((coding) => ({
    ...coding,
    ...(claims[DocumentReferenceClaim.TypeDisplay] ? { display: claims[DocumentReferenceClaim.TypeDisplay] } : {}),
  }));
  return {
    resourceType: 'DocumentReference',
    identifier: claims[DocumentReferenceClaim.Identifier] ? [{ value: claims[DocumentReferenceClaim.Identifier] }] : undefined,
    subject: { reference: subject },
    description: claims[DocumentReferenceClaim.Description],
    category: claims[DocumentReferenceClaim.Category]
      ? [{ coding: codingFromValue(claims[DocumentReferenceClaim.Category]) }]
      : undefined,
    type: claims[DocumentReferenceClaim.Type]
      || claims[DocumentReferenceClaim.TypeText]
      || claims[DocumentReferenceClaim.TypeDisplay]
      ? {
        ...(typeCoding ? { coding: typeCoding } : {}),
        ...(claims[DocumentReferenceClaim.TypeText] ? { text: claims[DocumentReferenceClaim.TypeText] } : {}),
      }
      : undefined,
    date: claims[DocumentReferenceClaim.Date],
    content: [{ attachment: {
      contentType: claims[DocumentReferenceClaim.ContentType],
      data: claims[DocumentReferenceClaim.ContentData],
      url: claims[DocumentReferenceClaim.Location],
      hash: claims[DocumentReferenceClaim.ContentHash],
      language: claims[DocumentReferenceClaim.Language],
    } }],
  };
}

export function documentReferenceFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const attachment = (resource.content as Array<{ attachment?: Record<string, string> }> | undefined)?.[0]?.attachment;
  return {
    [DocumentReferenceClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [DocumentReferenceClaim.Subject]: (resource.subject as { reference?: string } | undefined)?.reference,
    [DocumentReferenceClaim.Description]: resource.description as string | undefined,
    [DocumentReferenceClaim.Category]: codingToValue(
      (resource.category as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0],
    ),
    [DocumentReferenceClaim.Type]: codingToValue(
      (resource.type as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0],
    ),
    [DocumentReferenceClaim.TypeText]: (resource.type as { text?: string } | undefined)?.text,
    [DocumentReferenceClaim.TypeDisplay]:
      (resource.type as { coding?: Array<{ display?: string }> } | undefined)?.coding?.[0]?.display,
    [DocumentReferenceClaim.Date]: resource.date as string | undefined,
    [DocumentReferenceClaim.ContentType]: attachment?.contentType,
    [DocumentReferenceClaim.ContentData]: attachment?.data,
    [DocumentReferenceClaim.Location]: attachment?.url,
    [DocumentReferenceClaim.ContentHash]: attachment?.hash,
    [DocumentReferenceClaim.Language]: attachment?.language,
  };
}
