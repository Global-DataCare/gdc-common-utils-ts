import { CarePlanClaim } from '../models/interoperable-claims/care-plan-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type CarePlanInteroperableClaims = GenericInteroperableClaims;

export function getCarePlanClaimList(claims: CarePlanInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setCarePlanClaimList(
  claims: CarePlanInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): CarePlanInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addCarePlanClaimList(
  claims: CarePlanInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): CarePlanInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeCarePlanClaimList(
  claims: CarePlanInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): CarePlanInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getCarePlanIdentifier(claims: CarePlanInteroperableClaims): string {
  return normalizeClaimScalar(claims[CarePlanClaim.Identifier]);
}

export function setCarePlanIdentifier(claims: CarePlanInteroperableClaims, value: string): CarePlanInteroperableClaims {
  return { ...claims, [CarePlanClaim.Identifier]: normalizeClaimScalar(value) };
}
