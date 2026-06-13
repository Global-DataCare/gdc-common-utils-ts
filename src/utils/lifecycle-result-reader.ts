// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  BundleReader,
  type BundleReaderEntrySummary,
  type BundleReaderResponseAnalysis,
} from './bundle-reader';

export type LifecycleResultEntrySummary = BundleReaderEntrySummary;
export type LifecycleResultAnalysis = BundleReaderResponseAnalysis;

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function normalizeEntry(value: unknown): Record<string, unknown> {
  const entry = asRecord(value);
  if (!entry) {
    return {};
  }

  const resource = asRecord(entry.resource);
  const meta = asRecord(entry.meta);
  if (!resource && meta) {
    // Legacy compatibility path:
    // older wrappers exposed claims under `entry.meta.claims` instead of the
    // canonical `entry.resource.meta.claims`. New writers should not emit this.
    return {
      ...entry,
      resource: {
        meta,
      },
    };
  }

  if (resource && meta && !asRecord(resource.meta)) {
    return {
      ...entry,
      resource: {
        ...resource,
        meta,
      },
    };
  }

  return entry;
}

function resolveBundleLike(value: Record<string, unknown>): Record<string, unknown> {
  const body = asRecord(value.body);
  if (body && (Array.isArray(body.entry) || Array.isArray(body.data))) {
    return {
      ...body,
      ...(Array.isArray(body.entry) ? { entry: body.entry.map(normalizeEntry) } : {}),
      ...(Array.isArray(body.data) ? { data: body.data.map(normalizeEntry) } : {}),
    };
  }
  return {
    ...value,
    ...(Array.isArray(value.entry) ? { entry: value.entry.map(normalizeEntry) } : {}),
    ...(Array.isArray(value.data) ? { data: value.data.map(normalizeEntry) } : {}),
  };
}

/**
 * Neutral reader for lifecycle/search style operation results that eventually
 * resolve to one bundle-like payload.
 *
 * Accepted inputs:
 * - direct FHIR-like bundle (`entry[]`)
 * - direct JSON:API-like bundle (`data[]`)
 * - wrapper objects with `body.entry[]` or `body.data[]`
 *
 * Canonical claim location:
 * - `entry[].resource.meta.claims`
 * - `data[].resource.meta.claims`
 *
 * Deprecated compatibility still accepted:
 * - `entry[].meta.claims`
 * - `data[].meta.claims`
 *
 * The reader intentionally stays domain-neutral so employee, individual, and
 * future portal/backend wrappers can reuse one result-reading surface.
 */
export class LifecycleResultReader {
  private readonly bundleReader: BundleReader;

  constructor(result: Record<string, unknown>) {
    this.bundleReader = new BundleReader(resolveBundleLike(result));
  }

  getEntrySummaries(): LifecycleResultEntrySummary[] {
    return this.bundleReader.getEntrySummaries();
  }

  getResponseAnalysis(): LifecycleResultAnalysis {
    return this.bundleReader.getResponseAnalysis();
  }

  getSuccessfulIdentifiers(): string[] {
    return this.getEntrySummaries()
      .filter((entry) => entry.isSuccessful && entry.identifier)
      .map((entry) => String(entry.identifier));
  }

  getFailedIdentifiers(): string[] {
    return this.getEntrySummaries()
      .filter((entry) => !entry.isSuccessful && entry.identifier)
      .map((entry) => String(entry.identifier));
  }

  getEntrySummaryByIdentifier(identifier: string): LifecycleResultEntrySummary | undefined {
    return this.getEntrySummaries().find((entry) => entry.identifier === identifier);
  }
}

export function createLifecycleResultReader(
  result: Record<string, unknown>,
): LifecycleResultReader {
  return new LifecycleResultReader(result);
}
