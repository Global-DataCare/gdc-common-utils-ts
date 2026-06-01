// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ClaimConsent } from '../models/consent-rule.js';

export type InteroperableClaims = Record<string, unknown>;

function splitCsv(value: unknown): string[] {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeTokens(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))];
}

function normalizeInput(values: string | readonly string[]): string[] {
  return Array.isArray(values)
    ? normalizeTokens(values)
    : normalizeTokens(splitCsv(values));
}

/**
 * Returns the tokenized values for a claims field stored as CSV.
 */
export function getClaimValues(claims: InteroperableClaims, claimKey: string): string[] {
  return normalizeTokens(splitCsv(claims[claimKey]));
}

/**
 * Replaces a claims CSV field with the provided values.
 */
export function setClaimValues(
  claims: InteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): InteroperableClaims {
  const nextValues = normalizeInput(values);
  return {
    ...claims,
    [claimKey]: nextValues.join(','),
  };
}

/**
 * Adds one or many values into a claims CSV field while preserving uniqueness.
 */
export function addClaimValues(
  claims: InteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): InteroperableClaims {
  const current = getClaimValues(claims, claimKey);
  const additions = normalizeInput(values);
  return setClaimValues(claims, claimKey, [...current, ...additions]);
}

export function getActors(claims: InteroperableClaims): string[] {
  return getClaimValues(claims, ClaimConsent.actorIdentifier);
}

export function setActors(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setClaimValues(claims, ClaimConsent.actorIdentifier, values);
}

export function addActors(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addClaimValues(claims, ClaimConsent.actorIdentifier, values);
}

export function getRoles(claims: InteroperableClaims): string[] {
  return getClaimValues(claims, ClaimConsent.actorRole);
}

export function setRoles(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setClaimValues(claims, ClaimConsent.actorRole, values);
}

export function addRoles(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addClaimValues(claims, ClaimConsent.actorRole, values);
}

export function getPurposes(claims: InteroperableClaims): string[] {
  return getClaimValues(claims, ClaimConsent.purpose);
}

export function setPurposes(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setClaimValues(claims, ClaimConsent.purpose, values);
}

export function addPurposes(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addClaimValues(claims, ClaimConsent.purpose, values);
}

export function getSections(claims: InteroperableClaims): string[] {
  return getClaimValues(claims, ClaimConsent.action);
}

export function setSections(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setClaimValues(claims, ClaimConsent.action, values);
}

export function addSections(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addClaimValues(claims, ClaimConsent.action, values);
}
