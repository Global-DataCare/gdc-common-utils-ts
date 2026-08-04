import type { Hl7V20203IdentifierCode } from '../constants/identity-identifiers.js';

/**
 * A confidential external identifier linked to one immutable subject DID.
 *
 * The raw value, assigner and validity period belong in encrypted tenant
 * storage. Only a canonical digest/CID may be used for equality lookup or a
 * future ledger evidence anchor. `MB` identifies an insured member;
 * policy/payor details belong in a FHIR Coverage resource.
 */
export type LinkedSubjectIdentifier = Readonly<{
  id: string;
  subjectDid: string;
  type: Hl7V20203IdentifierCode;
  jurisdiction: string;
  value: string;
  assigner?: string;
  periodStart?: string;
  periodEnd?: string;
  createdAt: string;
  updatedAt: string;
}>;

/** Input accepted by a subject-scoped identifier write boundary. */
export type LinkedSubjectIdentifierDraft = Readonly<{
  subjectDid: string;
  type: Hl7V20203IdentifierCode;
  jurisdiction: string;
  value: string;
  assigner?: string;
  periodStart?: string;
  periodEnd?: string;
}>;
