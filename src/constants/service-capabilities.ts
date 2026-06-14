// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

/**
 * Canonical persisted capability values stored in
 * `org.schema.Service.serviceType`.
 */
export const ServiceCapability = {
  /**
   * Hosting/operator capability to manage hosted tenant organizations.
   *
   * This is the canonical service authorization that allows a hosting operator
   * to activate, disable, and purge hosted legal organizations.
   */
  OrganizationRegistryProvider: 'organization/Organization.cruds',
  IndexReader: 'organization/Composition.rs',
  IndexProvider: 'organization/Composition.cruds',
  DigitalTwinReader: 'organization/ResearchSubject.rs',
  DigitalTwinProvider: 'organization/ResearchSubject.cruds',
} as const;

export type ServiceCapabilityValue =
  typeof ServiceCapability[keyof typeof ServiceCapability];

/**
 * Canonical capability families derived from the persisted service capability
 * values.
 */
export const ServiceCapabilityKind = {
  OrganizationRegistry: 'organization/organization',
  Indexing: 'organization/composition',
  DigitalTwin: 'organization/researchsubject',
} as const;

export type ServiceCapabilityKindValue =
  typeof ServiceCapabilityKind[keyof typeof ServiceCapabilityKind];

/**
 * @deprecated Legacy serviceType values accepted for backward compatibility.
 */
export const DeprecatedServiceCapabilityToken = {
  OrganizationRegistryProvider: 'organization-registry.cruds',
  IndexReader: 'indexing.rs',
  IndexProvider: 'indexing.cruds',
  DigitalTwinReader: 'digitaltwin.rs',
  DigitalTwinProvider: 'digitaltwin.cruds',
} as const;

export type DeprecatedServiceCapabilityTokenValue =
  typeof DeprecatedServiceCapabilityToken[keyof typeof DeprecatedServiceCapabilityToken];

/**
 * @deprecated Prefer `ServiceCapability`.
 *
 * Kept as a compatibility alias for older callers that imported
 * `ServiceCapabilityToken`.
 */
export const ServiceCapabilityToken = {
  OrganizationRegistryProvider: ServiceCapability.OrganizationRegistryProvider,
  IndexReader: ServiceCapability.IndexReader,
  IndexProvider: ServiceCapability.IndexProvider,
  DigitalTwinReader: ServiceCapability.DigitalTwinReader,
  DigitalTwinProvider: ServiceCapability.DigitalTwinProvider,
  /**
   * @deprecated Prefer `OrganizationRegistryProvider`.
   */
  OrganizationRegistryCruds: ServiceCapability.OrganizationRegistryProvider,
  /**
   * @deprecated Prefer `IndexReader`.
   */
  IndexingReadSearch: ServiceCapability.IndexReader,
  /**
   * @deprecated Prefer `IndexProvider`.
   */
  IndexingCruds: ServiceCapability.IndexProvider,
  /**
   * @deprecated Prefer `DigitalTwinReader`.
   */
  DigitalTwinReadSearch: ServiceCapability.DigitalTwinReader,
  /**
   * @deprecated Prefer `DigitalTwinProvider`.
   */
  DigitalTwinCruds: ServiceCapability.DigitalTwinProvider,
  /**
   * @deprecated Prefer `ServiceCapability.OrganizationRegistryProvider`.
   * Legacy persisted value kept for compatibility while external payloads
   * still emit `organization-registry.cruds`.
   */
  LegacyOrganizationRegistryProvider: DeprecatedServiceCapabilityToken.OrganizationRegistryProvider,
  /**
   * @deprecated Prefer `ServiceCapability.IndexReader`.
   * Legacy persisted value kept for compatibility while external payloads
   * still emit `indexing.rs`.
   */
  LegacyIndexReader: DeprecatedServiceCapabilityToken.IndexReader,
  /**
   * @deprecated Prefer `ServiceCapability.IndexProvider`.
   * Legacy persisted value kept for compatibility while external payloads
   * still emit `indexing.cruds`.
   */
  LegacyIndexProvider: DeprecatedServiceCapabilityToken.IndexProvider,
  /**
   * @deprecated Prefer `ServiceCapability.DigitalTwinReader`.
   * Legacy persisted value kept for compatibility while external payloads
   * still emit `digitaltwin.rs`.
   */
  LegacyDigitalTwinReader: DeprecatedServiceCapabilityToken.DigitalTwinReader,
  /**
   * @deprecated Prefer `ServiceCapability.DigitalTwinProvider`.
   * Legacy persisted value kept for compatibility while external payloads
   * still emit `digitaltwin.cruds`.
   */
  LegacyDigitalTwinProvider: DeprecatedServiceCapabilityToken.DigitalTwinProvider,
} as const;

/**
 * @deprecated Prefer `ServiceCapabilityValue`.
 */
export type ServiceCapabilityTokenValue =
  typeof ServiceCapabilityToken[keyof typeof ServiceCapabilityToken];

const CANONICAL_SERVICE_CAPABILITY_BY_VALUE = new Map<string, string>([
  [String(ServiceCapability.OrganizationRegistryProvider).toLowerCase(), ServiceCapability.OrganizationRegistryProvider],
  [String(ServiceCapability.IndexReader).toLowerCase(), ServiceCapability.IndexReader],
  [String(ServiceCapability.IndexProvider).toLowerCase(), ServiceCapability.IndexProvider],
  [String(ServiceCapability.DigitalTwinReader).toLowerCase(), ServiceCapability.DigitalTwinReader],
  [String(ServiceCapability.DigitalTwinProvider).toLowerCase(), ServiceCapability.DigitalTwinProvider],
  [String(DeprecatedServiceCapabilityToken.OrganizationRegistryProvider).toLowerCase(), ServiceCapability.OrganizationRegistryProvider],
  [String(DeprecatedServiceCapabilityToken.IndexReader).toLowerCase(), ServiceCapability.IndexReader],
  [String(DeprecatedServiceCapabilityToken.IndexProvider).toLowerCase(), ServiceCapability.IndexProvider],
  [String(DeprecatedServiceCapabilityToken.DigitalTwinReader).toLowerCase(), ServiceCapability.DigitalTwinReader],
  [String(DeprecatedServiceCapabilityToken.DigitalTwinProvider).toLowerCase(), ServiceCapability.DigitalTwinProvider],
]);

function splitServiceCapabilityToken(
  value: string,
): Readonly<{ family?: string; suffix?: string }> {
  const lastDot = value.lastIndexOf('.');
  if (lastDot < 0) {
    return { family: value || undefined, suffix: undefined };
  }
  return {
    family: value.slice(0, lastDot) || undefined,
    suffix: value.slice(lastDot + 1) || undefined,
  };
}

/**
 * Normalizes a service capability token into its canonical persisted form.
 */
export function normalizeServiceCapability(value: string | undefined | null): string | undefined {
  const normalized = String(value || '').trim();
  if (!normalized) return undefined;
  return CANONICAL_SERVICE_CAPABILITY_BY_VALUE.get(normalized.toLowerCase()) || normalized;
}

/**
 * Returns whether the token is one of the known persisted service capabilities.
 */
export function isKnownServiceCapability(value: string | undefined | null): boolean {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return false;
  return CANONICAL_SERVICE_CAPABILITY_BY_VALUE.has(normalized);
}

/**
 * Parses the CSV stored in `org.schema.Service.serviceType`.
 */
export function parseServiceCapabilityTokens(value: unknown): string[] {
  return Array.from(new Set(
    String(value || '')
      .split(',')
      .map((item) => normalizeServiceCapability(item))
      .filter((item): item is string => Boolean(item)),
  ));
}

/**
 * Merges capability claims published across compatibility locations.
 */
export function mergeServiceCapabilityClaims(...values: unknown[]): string | undefined {
  const merged = Array.from(new Set(
    values.flatMap((value) => parseServiceCapabilityTokens(value)),
  ));
  return merged.length ? merged.join(',') : undefined;
}

/**
 * Serializes capability tokens into the canonical CSV claim format.
 */
export function serializeServiceCapabilityTokens(values: ReadonlyArray<string | undefined | null>): string | undefined {
  const normalized = Array.from(new Set(
    values
      .map((item) => normalizeServiceCapability(item))
      .filter((item): item is string => Boolean(item)),
  ));
  return normalized.length ? normalized.join(',') : undefined;
}

/**
 * Returns the capability family prefix from a persisted capability token.
 */
export function getServiceCapabilityKind(value: string | undefined): string | undefined {
  const normalized = normalizeServiceCapability(value)?.toLowerCase();
  if (!normalized) return undefined;
  return splitServiceCapabilityToken(normalized).family;
}

/**
 * Checks whether the claim contains at least one capability from the requested
 * family.
 */
export function hasServiceCapabilityKind(
  value: unknown,
  family: ServiceCapabilityKindValue | string,
): boolean {
  const normalizedFamily = String(family || '').trim().toLowerCase();
  if (!normalizedFamily) return false;
  return parseServiceCapabilityTokens(value).some((item) => getServiceCapabilityKind(item) === normalizedFamily);
}

/**
 * Returns whether a capability token denotes a discoverable provider/service
 * role rather than a reader-only role.
 */
export function isProviderServiceCapability(value: string | undefined | null): boolean {
  const normalized = normalizeServiceCapability(value);
  return normalized === ServiceCapability.OrganizationRegistryProvider
    || normalized === ServiceCapability.IndexProvider
    || normalized === ServiceCapability.DigitalTwinProvider;
}
