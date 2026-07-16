// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { createCanonicalIdentifierUrn } from './bundle-editor-helpers';
import { BundleQuery } from './bundle-query';
import type { BundleEntry, BundleJsonApi } from '../models/bundle';

export const VitalSignDayBatchClaim = Object.freeze({
  Identifier: 'VitalSignDayBatch.identifier',
  Subject: 'VitalSignDayBatch.subject',
  Actor: 'VitalSignDayBatch.actor',
  Day: 'VitalSignDayBatch.day',
  CreatedAtTimestamp: 'VitalSignDayBatch.createdAtTimestamp',
} as const);

export type VitalSignDayBatchEntryInput = Readonly<{
  subject: string;
  actor: string;
  date: string | Date;
  createdAtTimestamp?: number;
  entry?: BundleEntry;
  bundle?: BundleJsonApi<BundleEntry>;
}>;

export type VitalSignDayBatchResult = Readonly<{
  batchId: string;
  day: string;
  reused: boolean;
  bundle: BundleJsonApi<BundleEntry>;
}>;

export function buildVitalSignDayBatchClaims(
  input: Pick<VitalSignDayBatchEntryInput, 'subject' | 'actor' | 'date' | 'createdAtTimestamp'>,
): Record<string, unknown> {
  const day = resolveDayKey(input.date);
  const claims: Record<string, unknown> = {
    [VitalSignDayBatchClaim.Subject]: asTrimmedString(input.subject),
    [VitalSignDayBatchClaim.Actor]: asTrimmedString(input.actor),
    [VitalSignDayBatchClaim.Day]: day,
  };

  if (typeof input.createdAtTimestamp === 'number' && Number.isFinite(input.createdAtTimestamp)) {
    claims[VitalSignDayBatchClaim.CreatedAtTimestamp] = input.createdAtTimestamp;
  }

  return claims;
}

export function resolveVitalSignDayBatchId(input: VitalSignDayBatchEntryInput): VitalSignDayBatchResult {
  const baseBundle = cloneBundle(input.bundle || createEmptyBundle());
  const day = resolveDayKey(input.date);
  const dayRange = resolveDayRange(day);
  const existingClaims = asRecord(baseBundle.meta?.claims);
  const query = new BundleQuery(baseBundle);
  const dayEntryIds = query.getResourceIds({ dateFrom: dayRange.from, dateTo: dayRange.to });
  const dayEntries = query.getResourceEntriesByIds(dayEntryIds);
  const matchingDayEntry = dayEntries.find((entry) => matchesBatchOwner(entry, input.subject, input.actor));
  const sameOwner = matchesBatchOwnerClaims(existingClaims, input.subject, input.actor);
  const sameDay = asTrimmedString(existingClaims[VitalSignDayBatchClaim.Day]) === day;
  const existingBatchId = asTrimmedString(baseBundle.id || existingClaims[VitalSignDayBatchClaim.Identifier]);
  const reused = Boolean(existingBatchId && sameOwner && sameDay && (dayEntryIds.length > 0 || matchingDayEntry));
  const batchId = reused ? existingBatchId : createCanonicalIdentifierUrn();

  const bundle: BundleJsonApi<BundleEntry> = {
    ...baseBundle,
    id: batchId,
    meta: {
      ...(baseBundle.meta || {}),
      claims: {
        ...existingClaims,
        ...buildVitalSignDayBatchClaims(input),
        [VitalSignDayBatchClaim.Identifier]: batchId,
      },
    },
    data: [...(baseBundle.data || [])],
  };

  if (input.entry) {
    bundle.data.push(cloneEntry(input.entry));
  }

  return {
    batchId,
    day,
    reused,
    bundle,
  };
}

export function openOrCreateVitalSignDayBatchBundle(input: VitalSignDayBatchEntryInput): BundleJsonApi<BundleEntry> {
  return resolveVitalSignDayBatchId(input).bundle;
}

function matchesBatchOwner(entry: BundleEntry, subject: string, actor: string): boolean {
  const claims = asRecord(entry.resource?.meta?.claims || entry.meta?.claims);
  return matchesBatchOwnerClaims(claims, subject, actor);
}

function matchesBatchOwnerClaims(claims: Record<string, unknown>, subject: string, actor: string): boolean {
  return asTrimmedString(claims[VitalSignDayBatchClaim.Subject]) === asTrimmedString(subject)
    && asTrimmedString(claims[VitalSignDayBatchClaim.Actor]) === asTrimmedString(actor);
}

function resolveDayKey(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const raw = asTrimmedString(value);
  if (!raw) {
    return new Date().toISOString().slice(0, 10);
  }

  const parsed = Date.parse(raw);
  if (Number.isNaN(parsed)) {
    return raw.slice(0, 10);
  }
  return new Date(parsed).toISOString().slice(0, 10);
}

function resolveDayRange(day: string): { from: string; to: string } {
  return {
    from: `${day}T00:00:00.000Z`,
    to: `${day}T23:59:59.999Z`,
  };
}

function asTrimmedString(value: unknown): string {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value).trim();
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

function cloneBundle(bundle: BundleJsonApi<BundleEntry>): BundleJsonApi<BundleEntry> {
  return JSON.parse(JSON.stringify(bundle)) as BundleJsonApi<BundleEntry>;
}

function cloneEntry(entry: BundleEntry): BundleEntry {
  return JSON.parse(JSON.stringify(entry)) as BundleEntry;
}

function createEmptyBundle(): BundleJsonApi<BundleEntry> {
  return {
    resourceType: 'Bundle',
    type: 'collection',
    data: [],
  };
}