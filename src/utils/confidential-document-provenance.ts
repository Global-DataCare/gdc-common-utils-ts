// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import type { AuditInfo, IndexedAttribute } from '../models/confidential-storage.js';
import { CompositionClaim } from '../models/interoperable-claims/composition-claims.js';

export const ConfidentialDocumentIndex = Object.freeze({
  Sector: 'sector',
  CreatorDid: 'audit.creatorDid',
  SubmitterDid: 'audit.submitterDid',
  SigningKeyId: 'audit.signingKeyId',
} as const);

/** Flat Composition claims whose string value is a positional or set-like CSV projection. */
export const CompositionCsvClaimKeys = Object.freeze([
  CompositionClaim.Author,
  CompositionClaim.Attester,
  CompositionClaim.AttesterMode,
  CompositionClaim.AttesterTime,
  CompositionClaim.Section,
  CompositionClaim.Entry,
] as const);

const CSV_CLAIMS = new Set<string>(CompositionCsvClaimKeys);
const COMPOSITION_CLAIMS = new Set<string>(Object.values(CompositionClaim));

export type ConfidentialDocumentProvenanceAudit = Pick<
  AuditInfo,
  'creatorDid' | 'submitterDid' | 'signingKeyId'
>;

export type ConfidentialDocumentIndexedAttributesInput = Readonly<{
  claims: Readonly<Record<string, unknown>>;
  sector?: string;
  audit?: ConfidentialDocumentProvenanceAudit;
  /**
   * Temporarily retain the former whole-CSV attribute so exact legacy queries
   * continue to match while consumers move to one attribute per value.
   */
  includeDeprecatedCsvAggregate?: boolean;
}>;

/**
 * Projects searchable metadata without changing the protected canonical
 * claims. CSV multiplicity is governed by `CompositionCsvClaimKeys`; arbitrary
 * text containing commas is never split.
 */
export function buildConfidentialDocumentIndexedAttributes(
  input: ConfidentialDocumentIndexedAttributesInput,
): IndexedAttribute[] {
  const attributes: IndexedAttribute[] = [];
  const includeDeprecatedAggregate = input.includeDeprecatedCsvAggregate !== false;

  const append = (name: string, value: unknown, unique?: boolean) => {
    const normalized = String(value ?? '').trim();
    if (!normalized) return;
    if (attributes.some((attribute) => attribute.name === name && attribute.value === normalized)) return;
    attributes.push({ name, value: normalized, ...(unique ? { unique: true } : {}) });
  };

  append(ConfidentialDocumentIndex.Sector, input.sector);
  append(ConfidentialDocumentIndex.CreatorDid, input.audit?.creatorDid);
  append(ConfidentialDocumentIndex.SubmitterDid, input.audit?.submitterDid);
  append(ConfidentialDocumentIndex.SigningKeyId, input.audit?.signingKeyId);

  for (const [name, rawValue] of Object.entries(input.claims)) {
    if (name === '@context' || name === '@type' || rawValue === undefined || rawValue === null || Array.isArray(rawValue)) {
      continue;
    }
    const value = String(rawValue).trim();
    if (!value) continue;
    if (CSV_CLAIMS.has(name)) {
      const values = value.split(',').map((item) => item.trim()).filter(Boolean);
      values.forEach((item) => append(name, item));
      if (includeDeprecatedAggregate && values.length > 1) append(name, value);
      continue;
    }
    const isUniqueResourceIdentifier = !COMPOSITION_CLAIMS.has(name)
      && (name.endsWith('.identifier') || name.endsWith('.identifier.value'));
    append(name, value, isUniqueResourceIdentifier);
  }
  return attributes;
}
