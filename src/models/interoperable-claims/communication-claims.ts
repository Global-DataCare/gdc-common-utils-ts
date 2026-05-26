// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.
// File: src/models/interoperable-claims/communication-claims.ts

/**
 * Canonical flat claim keys for FHIR `Communication`.
 *
 * Good practice note:
 * - any code, examples, scripts, or tests that write/read reusable
 *   `Communication.*` claims must import these keys instead of re-hardcoding
 *   string literals inline
 * - legacy aliases such as `Communication.partOf` may still appear in
 *   compatibility readers, but new code must use the canonical key constants
 */
export const CommunicationClaim = {
  Category: 'Communication.category',
  Status: 'Communication.status',
  Identifier: 'Communication.identifier',
  Subject: 'Communication.subject',
  Recipient: 'Communication.recipient',
  Sender: 'Communication.sender',
  Sent: 'Communication.sent',
  NoteText: 'Communication.note-text',
  Text: 'Communication.text',
  ContentReference: 'Communication.content-reference',
  ContentCode: 'Communication.content-code',
  ContentAttachmentData: 'Communication.content-attachment-data',
  ContentAttachmentType: 'Communication.content-attachment-type',
  ContentAttachmentTitle: 'Communication.content-attachment-title',
  ContentAttachmentUrl: 'Communication.content-attachment-url',
  PartOf: 'Communication.part-of'
} as const;

export type CommunicationClaimKey = typeof CommunicationClaim[keyof typeof CommunicationClaim];
