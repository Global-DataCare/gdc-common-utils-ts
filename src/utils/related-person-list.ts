// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { RelatedPersonClaim } from '../models/interoperable-claims/related-person-claims.js';

export type RelatedPersonListRecord = Readonly<{
  identifier?: string;
  patient?: string;
  relationship?: string;
  name?: string;
  telecom?: string;
  active?: string;
  status?: string;
  resourceId?: string;
  claims: Record<string, unknown>;
}>;

export type RelatedPersonListSelection = Readonly<{
  index?: number;
  identifier?: string;
  name?: string;
  telecom?: string;
  patient?: string;
  activeOnly?: boolean;
}>;

function normalizeText(value: unknown): string | undefined {
  const normalized = String(value ?? '').trim();
  return normalized || undefined;
}

function extractClaims(entry: Record<string, unknown>): Record<string, unknown> {
  const meta = entry.meta && typeof entry.meta === 'object' ? entry.meta as Record<string, unknown> : {};
  const resource = entry.resource && typeof entry.resource === 'object' ? entry.resource as Record<string, unknown> : {};
  const resourceMeta = resource.meta && typeof resource.meta === 'object' ? resource.meta as Record<string, unknown> : {};
  const metaClaims = meta.claims && typeof meta.claims === 'object' ? meta.claims as Record<string, unknown> : undefined;
  const resourceClaims = resourceMeta.claims && typeof resourceMeta.claims === 'object' ? resourceMeta.claims as Record<string, unknown> : undefined;
  return { ...(resourceClaims || {}), ...(metaClaims || {}) };
}

/**
 * Reads subject-side relationship records from one current GW-style result
 * body into one neutral list shape for frontend screens.
 */
export function readRelatedPersonListRecords(body: unknown): RelatedPersonListRecord[] {
  const root = body && typeof body === 'object' ? body as Record<string, unknown> : {};
  const bodyNode = root.body && typeof root.body === 'object' ? root.body as Record<string, unknown> : root;
  const rawEntries = Array.isArray(bodyNode.entry)
    ? bodyNode.entry
    : (Array.isArray(bodyNode.data) ? bodyNode.data : []);

  return rawEntries
    .filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === 'object')
    .map((entry) => {
      const claims = extractClaims(entry);
      const meta = entry.meta && typeof entry.meta === 'object' ? entry.meta as Record<string, unknown> : {};
      const resource = entry.resource && typeof entry.resource === 'object' ? entry.resource as Record<string, unknown> : {};

      return {
        identifier: normalizeText(claims[RelatedPersonClaim.IdentifierValue] ?? claims[RelatedPersonClaim.Identifier]),
        patient: normalizeText(claims[RelatedPersonClaim.Patient]),
        relationship: normalizeText(claims[RelatedPersonClaim.Relationship]),
        name: normalizeText(claims[RelatedPersonClaim.Name]),
        telecom: normalizeText(claims[RelatedPersonClaim.Telecom]),
        active: normalizeText(claims[RelatedPersonClaim.Active]),
        status: normalizeText(meta.status),
        resourceId: normalizeText(resource.id || entry.id),
        claims,
      };
    });
}

/**
 * Returns one related-person record by canonical business identifier.
 */
export function findRelatedPersonListRecord(
  body: unknown,
  identifier: string,
): RelatedPersonListRecord | undefined {
  const normalizedIdentifier = normalizeText(identifier);
  if (!normalizedIdentifier) {
    return undefined;
  }

  return readRelatedPersonListRecords(body)
    .find((record) => record.identifier === normalizedIdentifier);
}

/**
 * Selects one related-person record from one neutralized list/body using the
 * same high-level criteria that channel apps usually expose to users:
 * list position, identifier, display name, contact value, or linked patient.
 */
export function selectRelatedPersonListRecord(
  body: unknown,
  selection: RelatedPersonListSelection,
): RelatedPersonListRecord | undefined {
  const records = readRelatedPersonListRecords(body);
  const candidates = selection.activeOnly
    ? records.filter((record) => record.active === 'true')
    : records;

  if (typeof selection.index === 'number' && Number.isInteger(selection.index)) {
    return candidates[selection.index];
  }

  const identifier = normalizeText(selection.identifier);
  if (identifier) {
    return candidates.find((record) => record.identifier === identifier);
  }

  const name = normalizeText(selection.name)?.toLowerCase();
  if (name) {
    return candidates.find((record) => normalizeText(record.name)?.toLowerCase() === name);
  }

  const telecom = normalizeText(selection.telecom)?.toLowerCase();
  if (telecom) {
    return candidates.find((record) => normalizeText(record.telecom)?.toLowerCase() === telecom);
  }

  const patient = normalizeText(selection.patient);
  if (patient) {
    return candidates.find((record) => record.patient === patient);
  }

  return undefined;
}
