// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

export type GenericInteroperableClaims = Record<string, unknown>;

export function splitClaimCsv(value: unknown): string[] {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeClaimTokens(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))];
}

export function normalizeClaimInput(values: string | readonly string[]): string[] {
  return Array.isArray(values)
    ? normalizeClaimTokens(values)
    : normalizeClaimTokens(splitClaimCsv(values));
}

export function normalizeClaimScalar(value: unknown): string {
  return String(value || '').trim();
}

/**
 * Returns the tokenized values for a claims field stored as CSV.
 */
export function getClaimValues(
  claims: GenericInteroperableClaims,
  claimKey: string,
): string[] {
  return normalizeClaimTokens(splitClaimCsv(claims[claimKey]));
}

/**
 * Replaces a claims CSV field with the provided values.
 */
export function setClaimValues(
  claims: GenericInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): GenericInteroperableClaims {
  const nextValues = normalizeClaimInput(values);
  return {
    ...claims,
    [claimKey]: nextValues.join(','),
  };
}

/**
 * Adds one or many values into a claims CSV field while preserving uniqueness.
 */
export function addClaimValues(
  claims: GenericInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): GenericInteroperableClaims {
  const current = getClaimValues(claims, claimKey);
  const additions = normalizeClaimInput(values);
  return setClaimValues(claims, claimKey, [...current, ...additions]);
}

/**
 * Removes one or many values from a claims CSV field while preserving uniqueness.
 */
export function removeClaimValues(
  claims: GenericInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): GenericInteroperableClaims {
  const removals = new Set(normalizeClaimInput(values));
  const nextValues = getClaimValues(claims, claimKey).filter((value) => !removals.has(value));
  return setClaimValues(claims, claimKey, nextValues);
}
