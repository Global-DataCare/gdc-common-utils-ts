import { RelatedPersonClaim } from '../models/interoperable-claims/related-person-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type RelatedPersonInteroperableClaims = GenericInteroperableClaims;

export function getRelatedPersonClaimList(claims: RelatedPersonInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setRelatedPersonClaimList(
  claims: RelatedPersonInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): RelatedPersonInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addRelatedPersonClaimList(
  claims: RelatedPersonInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): RelatedPersonInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeRelatedPersonClaimList(
  claims: RelatedPersonInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): RelatedPersonInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getRelatedPersonIdentifier(claims: RelatedPersonInteroperableClaims): string {
  return normalizeClaimScalar(
    claims[RelatedPersonClaim.IdentifierValue]
    ?? claims[RelatedPersonClaim.Identifier],
  );
}

export function setRelatedPersonIdentifier(claims: RelatedPersonInteroperableClaims, value: string): RelatedPersonInteroperableClaims {
  const normalizedValue = normalizeClaimScalar(value);
  return {
    ...claims,
    [RelatedPersonClaim.IdentifierValue]: normalizedValue,
  };
}

/**
 * Returns the current active flag as a boolean when present.
 *
 * Interoperability note:
 * some callers persist the flag as a real boolean while others may carry the
 * transport value as `"true"` / `"false"`. This helper normalizes both
 * shapes.
 */
export function getRelatedPersonActive(claims: RelatedPersonInteroperableClaims): boolean | undefined {
  const value = claims[RelatedPersonClaim.Active];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return undefined;
}

/**
 * Sets the canonical active flag used by the current `RelatedPerson` lifecycle
 * helpers.
 */
export function setRelatedPersonActive(
  claims: RelatedPersonInteroperableClaims,
  value: boolean,
): RelatedPersonInteroperableClaims {
  return { ...claims, [RelatedPersonClaim.Active]: value };
}
