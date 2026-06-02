// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { AllergyIntoleranceClaim } from '../models/interoperable-claims/allergy-intolerance-claims.js';
import {
  addClaimValues,
  getClaimValues,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type AllergyIntoleranceInteroperableClaims = GenericInteroperableClaims;

export function getAllergyIntoleranceClaimList(
  claims: AllergyIntoleranceInteroperableClaims,
  claimKey: string,
): string[] {
  return getClaimValues(claims, claimKey);
}

export function setAllergyIntoleranceClaimList(
  claims: AllergyIntoleranceInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): AllergyIntoleranceInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addAllergyIntoleranceClaimList(
  claims: AllergyIntoleranceInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): AllergyIntoleranceInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeAllergyIntoleranceClaimList(
  claims: AllergyIntoleranceInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): AllergyIntoleranceInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getAllergyIntoleranceContainedDocumentIdentifierList(
  claims: AllergyIntoleranceInteroperableClaims,
): string[] {
  return uniqueCsvLists([
    getAllergyIntoleranceClaimList(claims, AllergyIntoleranceClaim.ContainedDocuments),
    getAllergyIntoleranceClaimList(claims, AllergyIntoleranceClaim.AttachmentContentIds),
  ]);
}

export function setAllergyIntoleranceContainedDocumentIdentifierList(
  claims: AllergyIntoleranceInteroperableClaims,
  values: string | readonly string[],
): AllergyIntoleranceInteroperableClaims {
  return setContainedDocuments(claims, values);
}

export function addAllergyIntoleranceContainedDocumentIdentifierList(
  claims: AllergyIntoleranceInteroperableClaims,
  values: string | readonly string[],
): AllergyIntoleranceInteroperableClaims {
  return setContainedDocuments(
    claims,
    uniqueCsvLists([
      getAllergyIntoleranceContainedDocumentIdentifierList(claims),
      Array.isArray(values) ? [...values] : getAllergyIntoleranceClaimList({ [AllergyIntoleranceClaim.ContainedDocuments]: values }, AllergyIntoleranceClaim.ContainedDocuments),
    ]),
  );
}

export function removeAllergyIntoleranceContainedDocumentIdentifierList(
  claims: AllergyIntoleranceInteroperableClaims,
  values: string | readonly string[],
): AllergyIntoleranceInteroperableClaims {
  const toRemove = new Set(
    (Array.isArray(values) ? values : getAllergyIntoleranceClaimList({ [AllergyIntoleranceClaim.ContainedDocuments]: values }, AllergyIntoleranceClaim.ContainedDocuments))
      .map((item) => String(item || '').trim())
      .filter(Boolean),
  );
  return setContainedDocuments(
    claims,
    getAllergyIntoleranceContainedDocumentIdentifierList(claims).filter((item) => !toRemove.has(item)),
  );
}

function setContainedDocuments(
  claims: AllergyIntoleranceInteroperableClaims,
  values: string | readonly string[],
): AllergyIntoleranceInteroperableClaims {
  const next = setAllergyIntoleranceClaimList(claims, AllergyIntoleranceClaim.ContainedDocuments, values);
  const cleaned = {
    ...next,
  };
  delete cleaned[AllergyIntoleranceClaim.AttachmentContentIds];
  return cleaned;
}

function uniqueCsvLists(lists: readonly (readonly string[])[]): string[] {
  return [...new Set(lists.flatMap((list) => list.map((item) => String(item || '').trim()).filter(Boolean)))];
}
