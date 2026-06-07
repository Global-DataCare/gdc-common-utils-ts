import { createHash } from 'crypto';

import type { EvidenceObjectDLT } from '../models/oidc4ida.evidence.model.js';

const SHA3_384_PREFIX = 'sha3-384:';

/**
 * Shared blockchain-reference sanitization contract.
 *
 * Current shared rule:
 * - `z...` multibase base58 references are already public and stable
 * - any other identifier-like value is SHA3-384 hashed before persistence
 */
export function sanitizeBlockchainReference(value: unknown): string | undefined {
  const normalized = String(value || '').trim();
  if (!normalized) return undefined;
  if (/^z[1-9A-HJ-NP-Za-km-z]+$/.test(normalized)) return normalized;
  return `${SHA3_384_PREFIX}${createHash('sha3-384').update(normalized, 'utf8').digest('hex')}`;
}

/**
 * Resolves the public reference that downstream blockchain-oriented assets
 * should use when they point to an OIDC4IDA evidence record.
 *
 * Source-of-truth rule:
 * - prefer the public `evidence.id` when present
 * - otherwise return `undefined` so callers can choose another fallback
 *
 * This helper intentionally does not inspect nested attachments or digests
 * because those belong to the evidence record itself. Consent/blockchain rule
 * projections should point to the evidence record id, not copy its internals.
 */
export function resolveSourceReferenceFromEvidence(
  evidence: EvidenceObjectDLT | EvidenceObjectDLT[] | undefined,
): string | undefined {
  const items = Array.isArray(evidence) ? evidence : evidence ? [evidence] : [];
  for (const item of items) {
    const id = sanitizeBlockchainReference((item as EvidenceObjectDLT & { id?: unknown }).id);
    if (id) return id;
  }
  return undefined;
}
