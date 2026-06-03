import { ImmunizationClaim } from '../models/interoperable-claims/immunization-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type ImmunizationInteroperableClaims = GenericInteroperableClaims;

export function getImmunizationClaimList(claims: ImmunizationInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setImmunizationClaimList(
  claims: ImmunizationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): ImmunizationInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addImmunizationClaimList(
  claims: ImmunizationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): ImmunizationInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeImmunizationClaimList(
  claims: ImmunizationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): ImmunizationInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getImmunizationIdentifier(claims: ImmunizationInteroperableClaims): string {
  return normalizeClaimScalar(claims[ImmunizationClaim.Identifier]);
}

export function setImmunizationIdentifier(claims: ImmunizationInteroperableClaims, value: string): ImmunizationInteroperableClaims {
  return { ...claims, [ImmunizationClaim.Identifier]: normalizeClaimScalar(value) };
}
