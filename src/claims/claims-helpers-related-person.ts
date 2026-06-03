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
  return normalizeClaimScalar(claims[RelatedPersonClaim.Identifier]);
}

export function setRelatedPersonIdentifier(claims: RelatedPersonInteroperableClaims, value: string): RelatedPersonInteroperableClaims {
  return { ...claims, [RelatedPersonClaim.Identifier]: normalizeClaimScalar(value) };
}
