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

export function getAllergyIntoleranceContainedResourceReferenceList(
  claims: AllergyIntoleranceInteroperableClaims,
): string[] {
  return uniqueCsvLists([
    getAllergyIntoleranceClaimList(claims, AllergyIntoleranceClaim.ContainedReferenceList),
    getAllergyIntoleranceClaimList(claims, AllergyIntoleranceClaim.ContainedDocuments),
    getAllergyIntoleranceClaimList(claims, AllergyIntoleranceClaim.AttachmentContentIds),
  ]);
}

export function setAllergyIntoleranceContainedResourceReferenceList(
  claims: AllergyIntoleranceInteroperableClaims,
  values: string | readonly string[],
): AllergyIntoleranceInteroperableClaims {
  return setContainedResources(claims, values);
}

export function addAllergyIntoleranceContainedResourceReferenceList(
  claims: AllergyIntoleranceInteroperableClaims,
  values: string | readonly string[],
): AllergyIntoleranceInteroperableClaims {
  return setContainedResources(
    claims,
    uniqueCsvLists([
      getAllergyIntoleranceContainedResourceReferenceList(claims),
      Array.isArray(values) ? [...values] : getAllergyIntoleranceClaimList({ [AllergyIntoleranceClaim.ContainedReferenceList]: values }, AllergyIntoleranceClaim.ContainedReferenceList),
    ]),
  );
}

export function removeAllergyIntoleranceContainedResourceReferenceList(
  claims: AllergyIntoleranceInteroperableClaims,
  values: string | readonly string[],
): AllergyIntoleranceInteroperableClaims {
  const toRemove = new Set(
    (Array.isArray(values) ? values : getAllergyIntoleranceClaimList({ [AllergyIntoleranceClaim.ContainedReferenceList]: values }, AllergyIntoleranceClaim.ContainedReferenceList))
      .map((item) => String(item || '').trim())
      .filter(Boolean),
  );
  return setContainedResources(
    claims,
    getAllergyIntoleranceContainedResourceReferenceList(claims).filter((item) => !toRemove.has(item)),
  );
}

/** @deprecated Use `getAllergyIntoleranceContainedResourceReferenceList`. */
export function getAllergyIntoleranceContainedDocumentIdentifierList(
  claims: AllergyIntoleranceInteroperableClaims,
): string[] {
  return getAllergyIntoleranceContainedResourceReferenceList(claims);
}

/** @deprecated Use `setAllergyIntoleranceContainedResourceReferenceList`. */
export function setAllergyIntoleranceContainedDocumentIdentifierList(
  claims: AllergyIntoleranceInteroperableClaims,
  values: string | readonly string[],
): AllergyIntoleranceInteroperableClaims {
  return setAllergyIntoleranceContainedResourceReferenceList(claims, values);
}

/** @deprecated Use `addAllergyIntoleranceContainedResourceReferenceList`. */
export function addAllergyIntoleranceContainedDocumentIdentifierList(
  claims: AllergyIntoleranceInteroperableClaims,
  values: string | readonly string[],
): AllergyIntoleranceInteroperableClaims {
  return addAllergyIntoleranceContainedResourceReferenceList(claims, values);
}

/** @deprecated Use `removeAllergyIntoleranceContainedResourceReferenceList`. */
export function removeAllergyIntoleranceContainedDocumentIdentifierList(
  claims: AllergyIntoleranceInteroperableClaims,
  values: string | readonly string[],
): AllergyIntoleranceInteroperableClaims {
  return removeAllergyIntoleranceContainedResourceReferenceList(claims, values);
}

function setContainedResources(
  claims: AllergyIntoleranceInteroperableClaims,
  values: string | readonly string[],
): AllergyIntoleranceInteroperableClaims {
  const next = setAllergyIntoleranceClaimList(claims, AllergyIntoleranceClaim.ContainedReferenceList, values);
  const cleaned = {
    ...next,
  };
  delete cleaned[AllergyIntoleranceClaim.ContainedDocuments];
  delete cleaned[AllergyIntoleranceClaim.AttachmentContentIds];
  return cleaned;
}

function uniqueCsvLists(lists: readonly (readonly string[])[]): string[] {
  return [...new Set(lists.flatMap((list) => list.map((item) => String(item || '').trim()).filter(Boolean)))];
}
