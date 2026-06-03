// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import type { BundleEntry, BundleJsonApi, BundleEntryResource } from '../models/bundle.js';

export const DEFAULT_META_CLAIM_TAG_SYSTEM = 'urn:gdc:fhir:meta-claim';

export type BundleLike = Readonly<{
  resourceType?: string;
  type?: string;
  entry?: readonly BundleEntry[];
  data?: readonly BundleEntry[];
}>;

export type ResourceMetaClaimsExtraction = Readonly<{
  resourceType: string;
  fullUrl?: string;
  claims: Record<string, unknown>;
}>;

export type FhirMetaTagCoding = Readonly<{
  system: string;
  code: string;
  display?: string;
}>;

/**
 * Removes the versioned/contextualized FHIR prefix from a flattened claim key.
 *
 * Examples:
 * - `org.hl7.fhir.r4.Immunization.vaccine-code` -> `Immunization.vaccine-code`
 * - `org.hl7.fhir.api.MedicationStatement.subject` -> `MedicationStatement.subject`
 * - `Consent.identifier` -> `Consent.identifier`
 */
export function toVersionAgnosticMetaClaimKey(claimKey: string): string {
  const raw = String(claimKey || '').trim();
  if (!raw) return '';

  return raw
    .replace(/^org\.hl7\.fhir\.[a-z0-9]+\./i, '')
    .replace(/^org\.hl7\.fhir\.api\./i, '');
}

/**
 * Extracts all `resource.meta.claims` blocks from a FHIR/JSON:API bundle.
 *
 * This is intentionally claims-first: only resources that already carry
 * `resource.meta.claims` are returned.
 */
export function extractResourceMetaClaimsFromBundle(bundle: BundleLike): ResourceMetaClaimsExtraction[] {
  const entries = Array.isArray(bundle?.entry)
    ? bundle.entry
    : Array.isArray(bundle?.data)
      ? bundle.data
      : [];

  return entries
    .map((entry) => extractResourceMetaClaimsFromEntry(entry))
    .filter((value): value is ResourceMetaClaimsExtraction => !!value);
}

/**
 * Builds FHIR `meta.tag[]` codings from a flat claims record.
 *
 * The generated `code` is version-agnostic so UI/frontends can use the same
 * tag keys across `org.hl7.fhir.r4.*` and `org.hl7.fhir.api.*` payloads.
 */
export function createFhirMetaTagsFromClaims(
  claims: Record<string, unknown>,
  options?: Readonly<{
    system?: string;
    includeContext?: boolean;
  }>,
): FhirMetaTagCoding[] {
  const system = String(options?.system || DEFAULT_META_CLAIM_TAG_SYSTEM).trim();
  const includeContext = Boolean(options?.includeContext);

  const tags: FhirMetaTagCoding[] = [];

  for (const key of Object.keys(claims || {})) {
    if (key === '@context' || key === '@type') continue;
    const code = includeContext ? String(key).trim() : toVersionAgnosticMetaClaimKey(key);
    if (!code) continue;

    const display = stringifyClaimValue(claims[key]);
    tags.push({
      system,
      code,
      ...(display ? { display } : {}),
    });
  }

  return tags;
}

/**
 * Returns a shallow resource copy whose `meta.tag[]` is derived from
 * `resource.meta.claims`.
 */
export function withDerivedFhirMetaTagsFromClaims<T extends BundleEntryResource>(
  resource: T,
  options?: Readonly<{
    system?: string;
    includeContext?: boolean;
  }>,
): T {
  const claims = asRecord(resource?.meta?.claims);
  const tags = createFhirMetaTagsFromClaims(claims, options);

  return {
    ...resource,
    meta: {
      ...(resource?.meta || {}),
      tag: tags,
    },
  };
}

function extractResourceMetaClaimsFromEntry(entry: BundleEntry): ResourceMetaClaimsExtraction | undefined {
  const resource = entry?.resource;
  const claims = asRecord(resource?.meta?.claims);
  if (!resource || !claims || Object.keys(claims).length === 0) return undefined;

  return {
    resourceType: String(resource.resourceType || 'Unknown'),
    fullUrl: typeof entry.fullUrl === 'string' ? entry.fullUrl : undefined,
    claims,
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function stringifyClaimValue(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return undefined;
  }
}
