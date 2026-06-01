// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import type { BundleEntry, BundleJsonApi } from '../models/bundle.js';

export type BundleResourceIdFilters = Readonly<{
  sections?: string | readonly string[];
  resourceTypes?: string | readonly string[];
  dateFrom?: string;
  dateTo?: string;
}>;

/**
 * Generic bundle query helper for reusable entry filtering and lookup.
 *
 * This utility is intentionally communication-agnostic and can be reused by
 * any package that works with BundleJsonApi payloads.
 */
export class BundleQuery {
  private readonly bundle: BundleJsonApi<BundleEntry>;

  constructor(bundle: BundleJsonApi<BundleEntry>) {
    this.bundle = cloneBundle(bundle);
  }

  /**
   * Returns stable resource IDs from bundle entries with optional filters.
   */
  getResourceIds(filters: BundleResourceIdFilters = {}): string[] {
    return this.bundle.data
      .filter((entry) => this.matchesResourceFilters(entry, filters))
      .map((entry, index) => this.resolveBundleEntryId(entry, index));
  }

  /**
   * Returns bundle entries matching resource IDs produced by `getResourceIds`.
   */
  getResourceEntriesByIds(resourceIds: readonly string[]): BundleEntry[] {
    const wanted = new Set((resourceIds || []).map((id) => asTrimmedString(id)).filter(Boolean));
    if (wanted.size === 0) {
      return [];
    }

    return this.bundle.data
      .map((entry, index) => ({
        entry,
        id: this.resolveBundleEntryId(entry, index),
      }))
      .filter((item) => wanted.has(item.id))
      .map((item) => cloneEntry(item.entry));
  }

  /**
   * Resolves the entry URL (`fullUrl`) for a given entry/resource identifier.
   */
  getEntryUrl(entryId: string): string | undefined {
    const wanted = asTrimmedString(entryId);
    if (!wanted) {
      return undefined;
    }

    const match = this.bundle.data.find((entry, index) => this.resolveBundleEntryId(entry, index) === wanted);
    const fullUrl = asTrimmedString(match?.fullUrl);
    return fullUrl || undefined;
  }

  private resolveBundleEntryId(entry: BundleEntry, index: number): string {
    const explicitId = asTrimmedString(entry.id);
    if (explicitId) {
      return explicitId;
    }

    const fullUrl = asTrimmedString(entry.fullUrl);
    if (fullUrl) {
      return fullUrl;
    }

    const claims = asRecord(entry?.resource?.meta?.claims);
    const fromIdentifier = this.resolveIdentifierFromClaims(claims);
    if (fromIdentifier) {
      return fromIdentifier;
    }

    const resourceType = asTrimmedString(entry?.resource?.resourceType) || 'resource';
    return `${resourceType}#${index}`;
  }

  private resolveIdentifierFromClaims(claims: Record<string, unknown>): string {
    const identifierKey = Object.keys(claims)
      .find((key) => String(key || '').toLowerCase().endsWith('.identifier'));
    if (!identifierKey) {
      return '';
    }
    return asTrimmedString(claims[identifierKey]);
  }

  private matchesResourceFilters(entry: BundleEntry, filters: BundleResourceIdFilters): boolean {
    const resourceType = asTrimmedString(entry?.resource?.resourceType);
    const resourceTypeFilters = normalizeTokenInput(filters.resourceTypes);
    if (resourceTypeFilters.length > 0 && !resourceTypeFilters.includes(resourceType)) {
      return false;
    }

    const claims = asRecord(entry?.resource?.meta?.claims);
    const sectionFilters = normalizeTokenInput(filters.sections);
    if (sectionFilters.length > 0 && !this.matchesSections(claims, sectionFilters)) {
      return false;
    }

    const entryDate = this.resolveEntryDate(claims);
    if (!this.matchesDateRange(entryDate, filters.dateFrom, filters.dateTo)) {
      return false;
    }

    return true;
  }

  private matchesSections(claims: Record<string, unknown>, sectionFilters: readonly string[]): boolean {
    const sectionClaims: string[] = [];
    for (const [key, value] of Object.entries(claims)) {
      const normalized = String(key || '').toLowerCase();
      if (
        normalized.endsWith('.action')
        || normalized.endsWith('.category')
        || normalized.endsWith('.purpose')
        || normalized.endsWith('.section')
      ) {
        sectionClaims.push(...splitCsv(value));
      }
    }

    const sectionSet = new Set(sectionClaims.map((item) => item.toLowerCase()));
    return sectionFilters.some((filterValue) => sectionSet.has(filterValue.toLowerCase()));
  }

  private resolveEntryDate(claims: Record<string, unknown>): string {
    for (const [key, value] of Object.entries(claims)) {
      const normalized = String(key || '').toLowerCase();
      if (
        normalized.endsWith('.date')
        || normalized.endsWith('.effective')
        || normalized.endsWith('.sent')
        || normalized.endsWith('.authored-on')
      ) {
        const dateValue = asTrimmedString(value);
        if (dateValue) {
          return dateValue;
        }
      }
    }
    return '';
  }

  private matchesDateRange(entryDate: string, dateFrom?: string, dateTo?: string): boolean {
    const fromTs = parseDateToTs(dateFrom);
    const toTs = parseDateToTs(dateTo);

    if (fromTs === null && toTs === null) {
      return true;
    }

    const entryTs = parseDateToTs(entryDate);
    if (entryTs === null) {
      return false;
    }

    if (fromTs !== null && entryTs < fromTs) {
      return false;
    }
    if (toTs !== null && entryTs > toTs) {
      return false;
    }

    return true;
  }
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

function splitCsv(value: unknown): string[] {
  return asTrimmedString(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeTokenInput(value: string | readonly string[] | undefined): string[] {
  if (!value) {
    return [];
  }
  return (Array.isArray(value) ? value : splitCsv(value))
    .map((item) => asTrimmedString(item))
    .filter(Boolean);
}

function parseDateToTs(value: unknown): number | null {
  const raw = asTrimmedString(value);
  if (!raw) {
    return null;
  }

  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? null : parsed;
}

function cloneBundle(bundle: BundleJsonApi<BundleEntry>): BundleJsonApi<BundleEntry> {
  return JSON.parse(JSON.stringify(bundle)) as BundleJsonApi<BundleEntry>;
}

function cloneEntry(entry: BundleEntry): BundleEntry {
  return JSON.parse(JSON.stringify(entry)) as BundleEntry;
}
