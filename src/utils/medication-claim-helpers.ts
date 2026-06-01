// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { MedicationStatementClaim } from '../models/interoperable-claims/medication-statement-claims.js';

export type MedicationInteroperableClaims = Record<string, unknown>;

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
 * Returns tokenized values from a medication claim key stored as CSV.
 */
export function getMedicationClaimList(claims: MedicationInteroperableClaims, claimKey: string): string[] {
  return normalizeTokens(splitCsv(claims[claimKey]));
}

/**
 * Replaces a medication claim list from array/string input and stores canonical CSV.
 */
export function setMedicationClaimList(
  claims: MedicationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  const nextValues = normalizeInput(values);
  return {
    ...claims,
    [claimKey]: nextValues.join(','),
  };
}

/**
 * Adds values to a medication claim list preserving uniqueness.
 */
export function addMedicationClaimList(
  claims: MedicationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  const current = getMedicationClaimList(claims, claimKey);
  const additions = normalizeInput(values);
  return setMedicationClaimList(claims, claimKey, [...current, ...additions]);
}

/**
 * Medication category list getter/setter/add.
 */
export function getMedicationCategoryList(claims: MedicationInteroperableClaims): string[] {
  return getMedicationClaimList(claims, MedicationStatementClaim.Category);
}

export function setMedicationCategoryList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return setMedicationClaimList(claims, MedicationStatementClaim.Category, values);
}

export function addMedicationCategoryList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return addMedicationClaimList(claims, MedicationStatementClaim.Category, values);
}

/**
 * Medication part-of list getter/setter/add.
 */
export function getMedicationPartOfList(claims: MedicationInteroperableClaims): string[] {
  return getMedicationClaimList(claims, MedicationStatementClaim.PartOf);
}

export function setMedicationPartOfList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return setMedicationClaimList(claims, MedicationStatementClaim.PartOf, values);
}

export function addMedicationPartOfList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return addMedicationClaimList(claims, MedicationStatementClaim.PartOf, values);
}

/**
 * Medication code list getter/setter/add.
 *
 * Note:
 * - many flows use a single code, but CSV list is supported for UI preview/edit
 *   where multiple coded values can be staged before normalization.
 */
export function getMedicationCodeList(claims: MedicationInteroperableClaims): string[] {
  return getMedicationClaimList(claims, MedicationStatementClaim.Code);
}

export function setMedicationCodeList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return setMedicationClaimList(claims, MedicationStatementClaim.Code, values);
}

export function addMedicationCodeList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return addMedicationClaimList(claims, MedicationStatementClaim.Code, values);
}

/**
 * Medication source list getter/setter/add.
 */
export function getMedicationSourceList(claims: MedicationInteroperableClaims): string[] {
  return getMedicationClaimList(claims, MedicationStatementClaim.Source);
}

export function setMedicationSourceList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return setMedicationClaimList(claims, MedicationStatementClaim.Source, values);
}

export function addMedicationSourceList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return addMedicationClaimList(claims, MedicationStatementClaim.Source, values);
}

/**
 * Medication subject list getter/setter/add.
 */
export function getMedicationSubjectList(claims: MedicationInteroperableClaims): string[] {
  return getMedicationClaimList(claims, MedicationStatementClaim.Subject);
}

export function setMedicationSubjectList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return setMedicationClaimList(claims, MedicationStatementClaim.Subject, values);
}

export function addMedicationSubjectList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return addMedicationClaimList(claims, MedicationStatementClaim.Subject, values);
}
