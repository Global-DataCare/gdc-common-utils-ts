// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ConditionClaim } from '../models/interoperable-claims/condition-claims.js';
import {
  addClaimValues,
  getClaimValues,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type ConditionInteroperableClaims = GenericInteroperableClaims;

export function getConditionClaimList(claims: ConditionInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setConditionClaimList(
  claims: ConditionInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): ConditionInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addConditionClaimList(
  claims: ConditionInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): ConditionInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeConditionClaimList(
  claims: ConditionInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): ConditionInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getConditionContainedDocumentIdentifierList(claims: ConditionInteroperableClaims): string[] {
  return uniqueCsvLists([
    getConditionClaimList(claims, ConditionClaim.ContainedDocuments),
    getConditionClaimList(claims, ConditionClaim.AttachmentContentIds),
  ]);
}

export function setConditionContainedDocumentIdentifierList(
  claims: ConditionInteroperableClaims,
  values: string | readonly string[],
): ConditionInteroperableClaims {
  return setContainedDocuments(claims, values);
}

export function addConditionContainedDocumentIdentifierList(
  claims: ConditionInteroperableClaims,
  values: string | readonly string[],
): ConditionInteroperableClaims {
  return setContainedDocuments(
    claims,
    uniqueCsvLists([
      getConditionContainedDocumentIdentifierList(claims),
      Array.isArray(values) ? [...values] : getConditionClaimList({ [ConditionClaim.ContainedDocuments]: values }, ConditionClaim.ContainedDocuments),
    ]),
  );
}

export function removeConditionContainedDocumentIdentifierList(
  claims: ConditionInteroperableClaims,
  values: string | readonly string[],
): ConditionInteroperableClaims {
  const toRemove = new Set(
    (Array.isArray(values) ? values : getConditionClaimList({ [ConditionClaim.ContainedDocuments]: values }, ConditionClaim.ContainedDocuments))
      .map((item) => String(item || '').trim())
      .filter(Boolean),
  );
  return setContainedDocuments(
    claims,
    getConditionContainedDocumentIdentifierList(claims).filter((item) => !toRemove.has(item)),
  );
}

function setContainedDocuments(
  claims: ConditionInteroperableClaims,
  values: string | readonly string[],
): ConditionInteroperableClaims {
  const next = setConditionClaimList(claims, ConditionClaim.ContainedDocuments, values);
  const cleaned = {
    ...next,
  };
  delete cleaned[ConditionClaim.AttachmentContentIds];
  return cleaned;
}

function uniqueCsvLists(lists: readonly (readonly string[])[]): string[] {
  return [...new Set(lists.flatMap((list) => list.map((item) => String(item || '').trim()).filter(Boolean)))];
}
