// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ClaimConsent } from '../models/consent-rule.js';
export {
  addClaimValues,
  getClaimValues,
  removeClaimValues,
  setClaimValues,
} from './claim-list-helpers.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type InteroperableClaims = GenericInteroperableClaims;

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

export function removeActors(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return removeClaimValues(claims, ClaimConsent.actorIdentifier, values);
}

export function addActorIdentifierList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addActors(claims, values);
}

export function removeActorIdentifierList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return removeActors(claims, values);
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

export function removeRoles(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return removeClaimValues(claims, ClaimConsent.actorRole, values);
}

export function addActorRoleList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addRoles(claims, values);
}

export function removeActorRoleList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return removeRoles(claims, values);
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

export function removePurposes(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return removeClaimValues(claims, ClaimConsent.purpose, values);
}

export function addPurposeList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addPurposes(claims, values);
}

export function removePurposeList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return removePurposes(claims, values);
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

export function removeCategories(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return removeClaimValues(claims, ClaimConsent.category, values);
}

export function addCategoryList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addCategories(claims, values);
}

export function removeCategoryList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return removeCategories(claims, values);
}

export function getSections(claims: InteroperableClaims): string[] {
  return getClaimValues(claims, ClaimConsent.action);
}

export function getSectionList(claims: InteroperableClaims): string[] {
  return getSections(claims);
}

/**
 * Alias for teams that describe Consent.action values as sector-scoped access
 * tokens. This maps to the same canonical Consent.action claim as sections.
 */
export function getSectors(claims: InteroperableClaims): string[] {
  return getSections(claims);
}

export function setSections(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setClaimValues(claims, ClaimConsent.action, values);
}

export function setSectionList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setSections(claims, values);
}

/**
 * Alias for teams that describe Consent.action values as sector-scoped access
 * tokens. This maps to the same canonical Consent.action claim as sections.
 */
export function setSectors(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setSections(claims, values);
}

export function addSections(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addClaimValues(claims, ClaimConsent.action, values);
}

export function addSectionList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addSections(claims, values);
}

/**
 * Alias for teams that describe Consent.action values as sector-scoped access
 * tokens. This maps to the same canonical Consent.action claim as sections.
 */
export function addSectors(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return addSections(claims, values);
}

export function removeSections(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return removeClaimValues(claims, ClaimConsent.action, values);
}

export function removeSectionList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return removeSections(claims, values);
}

/**
 * Alias for teams that describe Consent.action values as sector-scoped access
 * tokens. This maps to the same canonical Consent.action claim as sections.
 */
export function removeSectors(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return removeSections(claims, values);
}

/**
 * Returns linked DocumentReference identifiers carried by the consent.
 */
export function getContainedDocumentIdentifierList(claims: InteroperableClaims): string[] {
  return uniqueCsvLists([
    getClaimValues(claims, ClaimConsent.containedDocuments),
    getClaimValues(claims, ClaimConsent.attachmentContentIds),
  ]);
}

export function setContainedDocumentIdentifierList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setContainedDocuments(claims, values);
}

export function addContainedDocumentIdentifierList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  return setContainedDocuments(
    claims,
    uniqueCsvLists([
      getContainedDocumentIdentifierList(claims),
      Array.isArray(values) ? [...values] : getClaimValues({ [ClaimConsent.containedDocuments]: values }, ClaimConsent.containedDocuments),
    ]),
  );
}

export function removeContainedDocumentIdentifierList(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  const toRemove = new Set(
    (Array.isArray(values) ? values : getClaimValues({ [ClaimConsent.containedDocuments]: values }, ClaimConsent.containedDocuments))
      .map((item) => String(item || '').trim())
      .filter(Boolean),
  );
  return setContainedDocuments(
    claims,
    getContainedDocumentIdentifierList(claims).filter((item) => !toRemove.has(item)),
  );
}

function setContainedDocuments(
  claims: InteroperableClaims,
  values: string | readonly string[],
): InteroperableClaims {
  const next = setClaimValues(claims, ClaimConsent.containedDocuments, values);
  const cleaned = {
    ...next,
  };
  delete cleaned[ClaimConsent.attachmentContentIds];
  return cleaned;
}

function uniqueCsvLists(lists: readonly (readonly string[])[]): string[] {
  return [...new Set(lists.flatMap((list) => list.map((item) => String(item || '').trim()).filter(Boolean)))];
}

/**
 * Reads the canonical consent date claim.
 */
export function getConsentDate(claims: InteroperableClaims): string {
  return normalizeClaimScalar(claims[ClaimConsent.date]);
}

/**
 * Reads the canonical consent subject claim.
 */
export function getConsentSubject(claims: InteroperableClaims): string {
  return normalizeClaimScalar(claims[ClaimConsent.subject]);
}

/**
 * Sets the canonical consent subject claim.
 */
export function setConsentSubject(
  claims: InteroperableClaims,
  value: string,
): InteroperableClaims {
  return {
    ...claims,
    [ClaimConsent.subject]: normalizeClaimScalar(value),
  };
}

/**
 * Reads the canonical consent decision claim.
 */
export function getConsentDecision(claims: InteroperableClaims): string {
  return normalizeClaimScalar(claims[ClaimConsent.decision]);
}

/**
 * Sets the canonical consent decision claim.
 */
export function setConsentDecision(
  claims: InteroperableClaims,
  value: string,
): InteroperableClaims {
  return {
    ...claims,
    [ClaimConsent.decision]: normalizeClaimScalar(value),
  };
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
    [ClaimConsent.date]: normalizeClaimScalar(value),
  };
}

export function getConsentPeriodStart(claims: InteroperableClaims): string {
  return normalizeClaimScalar(claims[ClaimConsent.periodStart]);
}

export function setConsentPeriodStart(
  claims: InteroperableClaims,
  value: string,
): InteroperableClaims {
  return {
    ...claims,
    [ClaimConsent.periodStart]: normalizeClaimScalar(value),
  };
}

export function getConsentPeriodEnd(claims: InteroperableClaims): string {
  return normalizeClaimScalar(claims[ClaimConsent.periodEnd]);
}

export function setConsentPeriodEnd(
  claims: InteroperableClaims,
  value: string,
): InteroperableClaims {
  return {
    ...claims,
    [ClaimConsent.periodEnd]: normalizeClaimScalar(value),
  };
}

export function getConsentIdentifier(claims: InteroperableClaims): string {
  return normalizeClaimScalar(claims[ClaimConsent.identifier]);
}

export function setConsentIdentifier(
  claims: InteroperableClaims,
  value: string,
): InteroperableClaims {
  return {
    ...claims,
    [ClaimConsent.identifier]: normalizeClaimScalar(value),
  };
}
