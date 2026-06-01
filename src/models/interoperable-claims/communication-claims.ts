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
  /** Communication category code (`system|code`). */
  Category: 'Communication.category',
  /** FHIR Communication status. */
  Status: 'Communication.status',
  /** Stable communication identifier. */
  Identifier: 'Communication.identifier',
  /** Subject identifier (typically `did:web`). */
  Subject: 'Communication.subject',
  /** Recipient identifier(s); CSV allowed. */
  Recipient: 'Communication.recipient',
  /** Sender identifier. */
  Sender: 'Communication.sender',
  /** Sent timestamp (ISO 8601 DateTime). */
  Sent: 'Communication.sent',
  /** Human note text for the communication context. */
  NoteText: 'Communication.note-text',
  /** Narrative text (short summary or body). */
  Text: 'Communication.text',
  /** Related resource references; CSV allowed. */
  ContentReference: 'Communication.content-reference',
  /** Content code (`system|code`) when payload is coded. */
  ContentCode: 'Communication.content-code',
  /**
   * Base64 encoded payload for attachment-based communication flows.
   *
   * Recommended lifecycle:
   * - maintain the editable Bundle as object in memory
   * - edit one active entry at a time (`fullUrl`, `resource`, `request`, ...)
   * - re-serialize Bundle JSON to this claim after each save/update
   * - treat this claim as derived data (never manual source of truth)
   */
  ContentAttachmentData: 'Communication.content-attachment-data',
  /** Attachment MIME type (`application/fhir+json`, `application/pdf`, ...). */
  ContentAttachmentType: 'Communication.content-attachment-type',
  /** Attachment title for UI/readability contexts. */
  ContentAttachmentTitle: 'Communication.content-attachment-title',
  /** External attachment URL when payload is not embedded. */
  ContentAttachmentUrl: 'Communication.content-attachment-url',
  /** Parent communication thread/reference (`Communication.part-of`). */
  PartOf: 'Communication.part-of'
} as const;

export type CommunicationClaimKey = typeof CommunicationClaim[keyof typeof CommunicationClaim];
