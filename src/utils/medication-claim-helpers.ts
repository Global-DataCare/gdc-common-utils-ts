// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { MedicationStatementClaim } from '../models/interoperable-claims/medication-statement-claims.js';
import {
  addClaimValues,
  getClaimValues,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type MedicationInteroperableClaims = GenericInteroperableClaims;

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
 * Linked DocumentReference identifiers associated to the medication statement.
 * Canonical claim key: `MedicationStatement.contained-documents`.
 * Legacy alias accepted on read: `MedicationStatement.attachment-content-ids`.
 */
export function getMedicationContainedDocumentIdentifierList(claims: MedicationInteroperableClaims): string[] {
  return uniqueCsvLists([
    getMedicationClaimList(claims, MedicationStatementClaim.ContainedDocuments),
    getMedicationClaimList(claims, MedicationStatementClaim.AttachmentContentIds),
  ]);
}

export function setMedicationContainedDocumentIdentifierList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return setContainedDocuments(claims, values);
}

export function addMedicationContainedDocumentIdentifierList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  return setContainedDocuments(
    claims,
    uniqueCsvLists([
      getMedicationContainedDocumentIdentifierList(claims),
      Array.isArray(values) ? [...values] : getMedicationClaimList({ [MedicationStatementClaim.ContainedDocuments]: values }, MedicationStatementClaim.ContainedDocuments),
    ]),
  );
}

export function removeMedicationContainedDocumentIdentifierList(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  const toRemove = new Set(
    (Array.isArray(values) ? values : getMedicationClaimList({ [MedicationStatementClaim.ContainedDocuments]: values }, MedicationStatementClaim.ContainedDocuments))
      .map((item) => String(item || '').trim())
      .filter(Boolean),
  );
  return setContainedDocuments(
    claims,
    getMedicationContainedDocumentIdentifierList(claims).filter((item) => !toRemove.has(item)),
  );
}

function setContainedDocuments(
  claims: MedicationInteroperableClaims,
  values: string | readonly string[],
): MedicationInteroperableClaims {
  const next = setMedicationClaimList(claims, MedicationStatementClaim.ContainedDocuments, values);
  const cleaned = {
    ...next,
  };
  delete cleaned[MedicationStatementClaim.AttachmentContentIds];
  return cleaned;
}

function uniqueCsvLists(lists: readonly (readonly string[])[]): string[] {
  return [...new Set(lists.flatMap((list) => list.map((item) => String(item || '').trim()).filter(Boolean)))];
}
