// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/document-reference-claims.ts

import type { ClaimSpec } from './types';

// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

export const DocumentReferenceClaim = {
  Attester: 'DocumentReference.attester',
  Author: 'DocumentReference.author',
  BasedOn: 'DocumentReference.based-on',
  Category: 'DocumentReference.category',
  ContentData: 'DocumentReference.contentdata',
  ContentHash: 'DocumentReference.contenthash',
  ContentType: 'DocumentReference.contenttype',
  Context: 'DocumentReference.context',
  Creation: 'DocumentReference.creation',
  Date: 'DocumentReference.date',
  Description: 'DocumentReference.description',
  EventCode: 'DocumentReference.event-code',
  EventReference: 'DocumentReference.event-reference',
  FormatUri: 'DocumentReference.format-uri',
  Identifier: 'DocumentReference.identifier',
  Language: 'DocumentReference.language',
  Location: 'DocumentReference.location',
  Modality: 'DocumentReference.modality',
  RelatesTo: 'DocumentReference.relatesto',
  Relation: 'DocumentReference.relation',
  Subject: 'DocumentReference.subject',
  Type: 'DocumentReference.type',
  TypeText: 'DocumentReference.type-text',
  TypeDisplay: 'DocumentReference.type-display',
  UserSelected: 'DocumentReference.user-selected',
} as const;

export type DocumentReferenceClaimKey = typeof DocumentReferenceClaim[keyof typeof DocumentReferenceClaim];

/**
 * Human-readable reference for UI/docs generators.
 * This is intentionally claims-first metadata and not a FHIR structure.
 */
export const DocumentReferenceClaimSpecs: ClaimSpec[] = [
  { key: DocumentReferenceClaim.Attester, meaning: 'Attester value (DID or role: personal | professional | legal | official).', example: 'did:web:hospital.example.com:employee:adm-332' },
  { key: DocumentReferenceClaim.Author, meaning: 'DID of the source author.', example: 'did:web:lab.example.com:system:lisin' },
  { key: DocumentReferenceClaim.BasedOn, meaning: 'URL of the source FHIR resource.', example: 'https://ehr.example.com/fhir/ServiceRequest/sr-991' },
  { key: DocumentReferenceClaim.Category, meaning: 'Higher-level document grouping.', example: 'http://hl7.org/fhir/ValueSet/document-classcodes|LP173418-7' },
  { key: DocumentReferenceClaim.ContentData, meaning: 'Embedded attachment as base64.', example: 'JVBERi0xLjc...' },
  { key: DocumentReferenceClaim.ContentHash, meaning: 'Attachment content hash/CID used for retrieval and integrity checks.', example: 'z4EBG9jDwAxbThHs9AMGBy6dTN1P9fGEcXq6tCm1ugw3pV89Nsc' },
  { key: DocumentReferenceClaim.ContentType, meaning: 'Attachment MIME type.', example: 'application/pdf' },
  { key: DocumentReferenceClaim.Context, meaning: 'Context such as Appointment | Encounter | EpisodeOfCare.', example: 'Encounter/enc-123' },
  { key: DocumentReferenceClaim.Creation, meaning: 'When source information was created.', example: '2026-02-10T08:20:00Z' },
  { key: DocumentReferenceClaim.Date, meaning: 'When this registration was attested.', example: '2026-02-10T10:05:33Z' },
  { key: DocumentReferenceClaim.Description, meaning: 'Human-readable summary.', example: 'Vital signs report from home device' },
  { key: DocumentReferenceClaim.EventCode, meaning: 'Main code for the source FHIR resource.', example: 'http://loinc.org|85354-9' },
  { key: DocumentReferenceClaim.EventReference, meaning: 'URL of the source FHIR resource.', example: 'https://ehr.example.com/fhir/Observation/obs-778' },
  { key: DocumentReferenceClaim.FormatUri, meaning: 'Attachment format URI.', example: 'urn:ihe:dent:PDF' },
  { key: DocumentReferenceClaim.Identifier, meaning: 'Document identifier used for correlation.', example: 'docref-2026-00042' },
  { key: DocumentReferenceClaim.Language, meaning: 'Language of attachment content.', example: 'en' },
  { key: DocumentReferenceClaim.Location, meaning: 'Remote URL of attachment.', example: 'https://ehr.example.com/fhir/Binary/bin-123' },
  { key: DocumentReferenceClaim.Modality, meaning: 'Imaging modality/equipment function.', example: 'http://dicom.nema.org/resources/ontology/DCM|CT' },
  { key: DocumentReferenceClaim.RelatesTo, meaning: 'Reference to related/prior document.', example: 'DocumentReference/docref-00041' },
  { key: DocumentReferenceClaim.Relation, meaning: 'Relation type to related document.', example: 'appends' },
  { key: DocumentReferenceClaim.Subject, meaning: 'URN for the section in the individual index.', example: 'urn:uhix:section:vitals' },
  { key: DocumentReferenceClaim.Type, meaning: 'Lower-level, sector-specific type.', example: 'http://hl7.org/fhir/ValueSet/c80-doc-typecodes|34133-9' },
  { key: DocumentReferenceClaim.TypeText, meaning: 'Local-language document type label.', example: 'Resumen clínico' },
  { key: DocumentReferenceClaim.TypeDisplay, meaning: 'Canonical/international document type display.', example: 'Patient summary Document' },
  { key: DocumentReferenceClaim.UserSelected, meaning: 'Custom provenance flag telling whether the document was explicitly created or selected by the end user/controller.', example: 'true' },
];

/**
 * Optional mapping helper when converting claims-first payloads to strict FHIR JSON.
 * Not used as canonical claim naming.
 */
export const DocumentReferenceClaimToFhirPath: Record<string, string | string[]> = {
  [DocumentReferenceClaim.Attester]: [
    'DocumentReference.attester.party.reference',
    'DocumentReference.attester.mode',
  ],
  [DocumentReferenceClaim.Author]: 'DocumentReference.author.reference',
  [DocumentReferenceClaim.BasedOn]: 'DocumentReference.basedOn.reference',
  [DocumentReferenceClaim.Category]: 'DocumentReference.category.coding',
  [DocumentReferenceClaim.ContentData]: 'DocumentReference.content.attachment.data',
  [DocumentReferenceClaim.ContentHash]: [
    'DocumentReference.content.attachment.hash',
    'DocumentReference.meta.versionId',
  ],
  [DocumentReferenceClaim.ContentType]: 'DocumentReference.content.attachment.contentType',
  [DocumentReferenceClaim.Context]: 'DocumentReference.context',
  [DocumentReferenceClaim.Creation]: 'DocumentReference.content.attachment.creation',
  [DocumentReferenceClaim.Date]: 'DocumentReference.date',
  [DocumentReferenceClaim.Description]: 'DocumentReference.description',
  [DocumentReferenceClaim.EventCode]: 'DocumentReference.context.event.coding',
  [DocumentReferenceClaim.EventReference]: 'DocumentReference.context.related.reference',
  [DocumentReferenceClaim.FormatUri]: 'DocumentReference.content.format.code',
  [DocumentReferenceClaim.Identifier]: 'DocumentReference.identifier.value',
  [DocumentReferenceClaim.Language]: 'DocumentReference.content.attachment.language',
  [DocumentReferenceClaim.Location]: 'DocumentReference.content.attachment.url',
  [DocumentReferenceClaim.Modality]: 'DocumentReference.modality',
  [DocumentReferenceClaim.RelatesTo]: 'DocumentReference.relatesTo.target.reference',
  [DocumentReferenceClaim.Relation]: 'DocumentReference.relatesTo.code',
  [DocumentReferenceClaim.Subject]: 'DocumentReference.subject.reference',
  [DocumentReferenceClaim.Type]: 'DocumentReference.type.coding',
  [DocumentReferenceClaim.UserSelected]: 'DocumentReference.user-selected',
};
