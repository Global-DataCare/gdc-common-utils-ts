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

function normalizeScalar(value: unknown): string {
  return String(value || '').trim();
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

/**
 * Returns actor identifiers as array instead of CSV.
 */
export function getActorIdentifierList(claims: InteroperableClaims): string[] {
  return getActors(claims);
}

export function setActors(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setClaimValues(claims, ClaimConsent.actorIdentifier, values);
}

/**
 * Stores actor identifiers from array/string input as canonical CSV claim.
 */
export function setActorIdentifierList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setActors(claims, values);
}

export function addActors(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addClaimValues(claims, ClaimConsent.actorIdentifier, values);
}

export function addActorIdentifierList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addActors(claims, values);
}

export function getRoles(claims: InteroperableClaims): string[] {
  return getClaimValues(claims, ClaimConsent.actorRole);
}

/**
 * Returns actor roles as array instead of CSV.
 */
export function getActorRoleList(claims: InteroperableClaims): string[] {
  return getRoles(claims);
}

export function setRoles(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setClaimValues(claims, ClaimConsent.actorRole, values);
}

export function setActorRoleList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setRoles(claims, values);
}

export function addRoles(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addClaimValues(claims, ClaimConsent.actorRole, values);
}

export function addActorRoleList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addRoles(claims, values);
}

export function getPurposes(claims: InteroperableClaims): string[] {
  return getClaimValues(claims, ClaimConsent.purpose);
}

export function getPurposeList(claims: InteroperableClaims): string[] {
  return getPurposes(claims);
}

export function setPurposes(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setClaimValues(claims, ClaimConsent.purpose, values);
}

export function setPurposeList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setPurposes(claims, values);
}

export function addPurposes(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addClaimValues(claims, ClaimConsent.purpose, values);
}

export function addPurposeList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addPurposes(claims, values);
}

/**
 * Consent category as array instead of CSV.
 */
export function getCategories(claims: InteroperableClaims): string[] {
  return getClaimValues(claims, ClaimConsent.category);
}

export function getCategoryList(claims: InteroperableClaims): string[] {
  return getCategories(claims);
}

export function setCategories(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setClaimValues(claims, ClaimConsent.category, values);
}

export function setCategoryList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setCategories(claims, values);
}

export function addCategories(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addClaimValues(claims, ClaimConsent.category, values);
}

export function addCategoryList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addCategories(claims, values);
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

/**
 * Reads the canonical consent date claim.
 */
export function getConsentDate(claims: InteroperableClaims): string {
  return normalizeScalar(claims[ClaimConsent.date]);
}

/**
 * Sets the canonical consent date claim.
 */
export function setConsentDate(
  claims: InteroperableClaims,
  value: string,
): InteroperableClaims {
  return {
    ...claims,
    [ClaimConsent.date]: normalizeScalar(value),
  };
}

export function getConsentPeriodStart(claims: InteroperableClaims): string {
  return normalizeScalar(claims[ClaimConsent.periodStart]);
}

export function setConsentPeriodStart(
  claims: InteroperableClaims,
  value: string,
): InteroperableClaims {
  return {
    ...claims,
    [ClaimConsent.periodStart]: normalizeScalar(value),
  };
}

export function getConsentPeriodEnd(claims: InteroperableClaims): string {
  return normalizeScalar(claims[ClaimConsent.periodEnd]);
}

export function setConsentPeriodEnd(
  claims: InteroperableClaims,
  value: string,
): InteroperableClaims {
  return {
    ...claims,
    [ClaimConsent.periodEnd]: normalizeScalar(value),
  };
}

export function getConsentIdentifier(claims: InteroperableClaims): string {
  return normalizeScalar(claims[ClaimConsent.identifier]);
}

export function setConsentIdentifier(
  claims: InteroperableClaims,
  value: string,
): InteroperableClaims {
  return {
    ...claims,
    [ClaimConsent.identifier]: normalizeScalar(value),
  };
}
