// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-document-reference.ts

import { DocumentReferenceClaim } from '../models/interoperable-claims/document-reference-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { requireClaim } from './convert-shared';

export function documentReferenceFlatToFhirR4(claims: FlatClaims): FhirResource {
  const subject = requireClaim(claims, DocumentReferenceClaim.Subject);
  return {
    resourceType: 'DocumentReference',
    identifier: claims[DocumentReferenceClaim.Identifier] ? [{ value: claims[DocumentReferenceClaim.Identifier] }] : undefined,
    subject: { reference: subject },
    description: claims[DocumentReferenceClaim.Description],
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
    [DocumentReferenceClaim.Date]: resource.date as string | undefined,
    [DocumentReferenceClaim.ContentType]: attachment?.contentType,
    [DocumentReferenceClaim.ContentData]: attachment?.data,
    [DocumentReferenceClaim.Location]: attachment?.url,
    [DocumentReferenceClaim.ContentHash]: attachment?.hash,
    [DocumentReferenceClaim.Language]: attachment?.language,
  };
}
