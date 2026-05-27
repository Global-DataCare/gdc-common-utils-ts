// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

/**
 * Canonical capability families persisted through
 * `org.schema.Service.serviceType`.
 */
export const ServiceCapabilityFamily = {
  Indexing: 'indexing',
  DigitalTwin: 'digitaltwin',
} as const;

export type ServiceCapabilityFamilyValue =
  typeof ServiceCapabilityFamily[keyof typeof ServiceCapabilityFamily];

/**
 * Canonical capability tokens currently documented for tenant activation.
 *
 * The family prefix is the stable part of the contract. Suffixes such as
 * `.rs` and `.cruds` can evolve independently across runtimes.
 */
export const ServiceCapabilityToken = {
  IndexReader: 'indexing.rs',
  IndexProvider: 'indexing.cruds',
  DigitalTwinReader: 'digitaltwin.rs',
  DigitalTwinProvider: 'digitaltwin.cruds',
  /**
   * @deprecated Prefer `IndexReader`.
   */
  IndexingReadSearch: 'indexing.rs',
  /**
   * @deprecated Prefer `IndexProvider`.
   */
  IndexingCruds: 'indexing.cruds',
  /**
   * @deprecated Prefer `DigitalTwinReader`.
   */
  DigitalTwinReadSearch: 'digitaltwin.rs',
  /**
   * @deprecated Prefer `DigitalTwinProvider`.
   */
  DigitalTwinCruds: 'digitaltwin.cruds',
} as const;

export type ServiceCapabilityTokenValue =
  typeof ServiceCapabilityToken[keyof typeof ServiceCapabilityToken];

/**
 * SDK-facing capability names.
 *
 * These names are intentionally more explicit than the persisted claim tokens:
 * - `Provider` maps to write/manage capability (`*.cruds`)
 * - `Reader` maps to read/search capability (`*.rs`)
 */
export const ServiceCapability = {
  IndexProvider: ServiceCapabilityToken.IndexProvider,
  IndexReader: ServiceCapabilityToken.IndexReader,
  DigitalTwinProvider: ServiceCapabilityToken.DigitalTwinProvider,
  DigitalTwinReader: ServiceCapabilityToken.DigitalTwinReader,
  /**
   * @deprecated Prefer `IndexProvider`.
   */
  IndexingProvider: ServiceCapabilityToken.IndexProvider,
  /**
   * @deprecated Prefer `IndexReader`.
   */
  IndexingReader: ServiceCapabilityToken.IndexReader,
} as const;

export type ServiceCapabilityValue =
  typeof ServiceCapability[keyof typeof ServiceCapability];

/**
 * Parses the CSV stored in `org.schema.Service.serviceType`.
 */
export function parseServiceCapabilityTokens(value: unknown): string[] {
  return Array.from(new Set(
    String(value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  ));
}

/**
 * Serializes capability tokens into the canonical CSV claim format.
 */
export function serializeServiceCapabilityTokens(values: ReadonlyArray<string | undefined | null>): string | undefined {
  const normalized = Array.from(new Set(
    values
      .map((item) => String(item || '').trim())
      .filter(Boolean),
  ));
  return normalized.length ? normalized.join(',') : undefined;
}

/**
 * Returns the capability family prefix from a token.
 */
export function getServiceCapabilityFamily(value: string | undefined): string | undefined {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return undefined;
  return normalized.split('.')[0] || undefined;
}

/**
 * Checks whether the claim contains at least one capability from the requested
 * family.
 */
export function hasServiceCapabilityFamily(
  value: unknown,
  family: ServiceCapabilityFamilyValue | string,
): boolean {
  const normalizedFamily = String(family || '').trim().toLowerCase();
  if (!normalizedFamily) return false;
  return parseServiceCapabilityTokens(value).some((item) => getServiceCapabilityFamily(item) === normalizedFamily);
}
