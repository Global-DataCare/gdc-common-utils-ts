// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  MedicationStatementClaim,
  MedicationStatementClaimsFhirApiExtended,
} from '../models/interoperable-claims/medication-statement-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type MedicationInteroperableClaims = GenericInteroperableClaims;

export function getMedicationIdentifier(claims: MedicationInteroperableClaims): string {
  return getMedicationScalar(claims, MedicationStatementClaim.Identifier);
}

export function setMedicationIdentifier(
  claims: MedicationInteroperableClaims,
  value: string,
): MedicationInteroperableClaims {
  return setMedicationScalar(claims, MedicationStatementClaim.Identifier, value);
}

export function getMedicationSubject(claims: MedicationInteroperableClaims): string {
  return getMedicationScalar(claims, MedicationStatementClaim.Subject);
}

export function setMedicationSubject(
  claims: MedicationInteroperableClaims,
  value: string,
): MedicationInteroperableClaims {
  return setMedicationScalar(claims, MedicationStatementClaim.Subject, value);
}

export function getMedicationStatus(claims: MedicationInteroperableClaims): string {
  return getMedicationScalar(claims, MedicationStatementClaim.Status);
}

export function setMedicationStatus(
  claims: MedicationInteroperableClaims,
  value: string,
): MedicationInteroperableClaims {
  return setMedicationScalar(claims, MedicationStatementClaim.Status, value);
}

export function getMedicationEffective(claims: MedicationInteroperableClaims): string {
  return getMedicationScalar(claims, MedicationStatementClaim.Effective);
}

export function setMedicationEffective(
  claims: MedicationInteroperableClaims,
  value: string,
): MedicationInteroperableClaims {
  return setMedicationScalar(claims, MedicationStatementClaim.Effective, value);
}

export function getMedicationText(claims: MedicationInteroperableClaims): string {
  return getMedicationScalar(claims, MedicationStatementClaim.MedicationText);
}

export function setMedicationText(
  claims: MedicationInteroperableClaims,
  value: string,
): MedicationInteroperableClaims {
  return setMedicationScalar(claims, MedicationStatementClaim.MedicationText, value);
}

export function getMedicationDoseQuantityValue(claims: MedicationInteroperableClaims): number | undefined {
  return getMedicationNumber(claims, MedicationStatementClaimsFhirApiExtended.DoseQuantityValue);
}

export function setMedicationDoseQuantityValue(
  claims: MedicationInteroperableClaims,
  value: number,
): MedicationInteroperableClaims {
  return setMedicationNumber(claims, MedicationStatementClaimsFhirApiExtended.DoseQuantityValue, value);
}

export function getMedicationDoseQuantityUnit(claims: MedicationInteroperableClaims): string {
  return getMedicationScalar(claims, MedicationStatementClaimsFhirApiExtended.DoseQuantityUnit);
}

export function setMedicationDoseQuantityUnit(
  claims: MedicationInteroperableClaims,
  value: string,
): MedicationInteroperableClaims {
  return setMedicationScalar(claims, MedicationStatementClaimsFhirApiExtended.DoseQuantityUnit, value);
}

export function getMedicationTimingFrequency(claims: MedicationInteroperableClaims): number | undefined {
  return getMedicationNumber(claims, MedicationStatementClaimsFhirApiExtended.TimingFrequency);
}

export function setMedicationTimingFrequency(
  claims: MedicationInteroperableClaims,
  value: number,
): MedicationInteroperableClaims {
  return setMedicationNumber(claims, MedicationStatementClaimsFhirApiExtended.TimingFrequency, value);
}

export function getMedicationTimingPeriod(claims: MedicationInteroperableClaims): number | undefined {
  return getMedicationNumber(claims, MedicationStatementClaimsFhirApiExtended.TimingPeriod);
}

export function setMedicationTimingPeriod(
  claims: MedicationInteroperableClaims,
  value: number,
): MedicationInteroperableClaims {
  return setMedicationNumber(claims, MedicationStatementClaimsFhirApiExtended.TimingPeriod, value);
}

export function getMedicationTimingPeriodUnit(claims: MedicationInteroperableClaims): string {
  return getMedicationScalar(claims, MedicationStatementClaimsFhirApiExtended.TimingPeriodUnit);
}

export function setMedicationTimingPeriodUnit(
  claims: MedicationInteroperableClaims,
  value: string,
): MedicationInteroperableClaims {
  return setMedicationScalar(claims, MedicationStatementClaimsFhirApiExtended.TimingPeriodUnit, value);
}

export function getMedicationDosageAsNeeded(claims: MedicationInteroperableClaims): boolean | undefined {
  return getMedicationBoolean(claims, MedicationStatementClaimsFhirApiExtended.DosageAsNeeded);
}

export function setMedicationDosageAsNeeded(
  claims: MedicationInteroperableClaims,
  value: boolean,
): MedicationInteroperableClaims {
  return setMedicationBoolean(claims, MedicationStatementClaimsFhirApiExtended.DosageAsNeeded, value);
}

/**
 * Returns tokenized values from a medication claim key stored as CSV.
 */
export function getMedicationClaimList(claims: MedicationInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

/**
 * Replaces a medication claim list from array/string input and stores canonical CSV.
 */
export function setMedicationClaimList(
  claims: MedicationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

/**
 * Adds values to a medication claim list preserving uniqueness.
 */
export function addMedicationClaimList(
  claims: MedicationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

/**
 * Removes values from a medication claim list while preserving uniqueness.
 */
export function removeMedicationClaimList(
  claims: MedicationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
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

export function removeMedicationCategoryList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return removeMedicationClaimList(claims, MedicationStatementClaim.Category, values);
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

export function removeMedicationPartOfList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return removeMedicationClaimList(claims, MedicationStatementClaim.PartOf, values);
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

export function removeMedicationCodeList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return removeMedicationClaimList(claims, MedicationStatementClaim.Code, values);
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

export function removeMedicationSourceList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return removeMedicationClaimList(claims, MedicationStatementClaim.Source, values);
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

export function removeMedicationSubjectList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return removeMedicationClaimList(claims, MedicationStatementClaim.Subject, values);
}

/**
 * Linked contained resource references associated to the medication statement.
 * Canonical claim key: `MedicationStatement.contained-reference-list`.
 * Legacy alias accepted on read: `MedicationStatement.attachment-content-ids`.
 */
export function getMedicationContainedResourceReferenceList(claims: MedicationInteroperableClaims): string[] {
  return uniqueCsvLists([
    getMedicationClaimList(claims, MedicationStatementClaim.ContainedReferenceList),
    getMedicationClaimList(claims, MedicationStatementClaim.ContainedDocuments),
    getMedicationClaimList(claims, MedicationStatementClaim.AttachmentContentIds),
  ]);
}

export function setMedicationContainedResourceReferenceList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return setContainedResources(claims, values);
}

export function addMedicationContainedResourceReferenceList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return setContainedResources(
    claims,
    uniqueCsvLists([
      getMedicationContainedResourceReferenceList(claims),
      Array.isArray(values) ? [...values] : getMedicationClaimList({ [MedicationStatementClaim.ContainedReferenceList]: values }, MedicationStatementClaim.ContainedReferenceList),
    ]),
  );
}

export function removeMedicationContainedResourceReferenceList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  const toRemove = new Set(
    (Array.isArray(values) ? values : getMedicationClaimList({ [MedicationStatementClaim.ContainedReferenceList]: values }, MedicationStatementClaim.ContainedReferenceList))
      .map((item) => String(item || '').trim())
      .filter(Boolean),
  );
  return setContainedResources(
    claims,
    getMedicationContainedResourceReferenceList(claims).filter((item) => !toRemove.has(item)),
  );
}

/** @deprecated Use `getMedicationContainedResourceReferenceList`. */
export function getMedicationContainedDocumentIdentifierList(claims: MedicationInteroperableClaims): string[] {
  return getMedicationContainedResourceReferenceList(claims);
}

/** @deprecated Use `setMedicationContainedResourceReferenceList`. */
export function setMedicationContainedDocumentIdentifierList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return setMedicationContainedResourceReferenceList(claims, values);
}

/** @deprecated Use `addMedicationContainedResourceReferenceList`. */
export function addMedicationContainedDocumentIdentifierList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return addMedicationContainedResourceReferenceList(claims, values);
}

/** @deprecated Use `removeMedicationContainedResourceReferenceList`. */
export function removeMedicationContainedDocumentIdentifierList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return removeMedicationContainedResourceReferenceList(claims, values);
}

function setContainedResources(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  const next = setMedicationClaimList(claims, MedicationStatementClaim.ContainedReferenceList, values);
  const cleaned = {
    ...next,
  };
  delete cleaned[MedicationStatementClaim.ContainedDocuments];
  delete cleaned[MedicationStatementClaim.AttachmentContentIds];
  return cleaned;
}

function uniqueCsvLists(lists: readonly (readonly string[])[]): string[] {
  return [...new Set(lists.flatMap((list) => list.map((item) => String(item || '').trim()).filter(Boolean)))];
}

function getMedicationScalar(claims: MedicationInteroperableClaims, claimKey: string): string {
  return normalizeClaimScalar(claims[claimKey]);
}

function setMedicationScalar(
  claims: MedicationInteroperableClaims,
  claimKey: string,
  value: string,
): MedicationInteroperableClaims {
  return {
    ...claims,
    [claimKey]: normalizeClaimScalar(value),
  };
}

function getMedicationNumber(claims: MedicationInteroperableClaims, claimKey: string): number | undefined {
  const raw = claims[claimKey];
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw;
  }
  const normalized = normalizeClaimScalar(raw);
  if (!normalized) {
    return undefined;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function setMedicationNumber(
  claims: MedicationInteroperableClaims,
  claimKey: string,
  value: number,
): MedicationInteroperableClaims {
  return {
    ...claims,
    [claimKey]: value,
  };
}

function getMedicationBoolean(claims: MedicationInteroperableClaims, claimKey: string): boolean | undefined {
  const raw = claims[claimKey];
  if (typeof raw === 'boolean') {
    return raw;
  }
  const normalized = normalizeClaimScalar(raw).toLowerCase();
  if (!normalized) {
    return undefined;
  }
  if (normalized === 'true') {
    return true;
  }
  if (normalized === 'false') {
    return false;
  }
  return undefined;
}

function setMedicationBoolean(
  claims: MedicationInteroperableClaims,
  claimKey: string,
  value: boolean,
): MedicationInteroperableClaims {
  return {
    ...claims,
    [claimKey]: value,
  };
}
