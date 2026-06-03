import { FlagClaim } from '../models/interoperable-claims/flag-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type FlagInteroperableClaims = GenericInteroperableClaims;

export function getFlagClaimList(claims: FlagInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setFlagClaimList(
  claims: FlagInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): FlagInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addFlagClaimList(
  claims: FlagInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): FlagInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeFlagClaimList(
  claims: FlagInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): FlagInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getFlagIdentifier(claims: FlagInteroperableClaims): string {
  return normalizeClaimScalar(claims[FlagClaim.Identifier]);
}

export function setFlagIdentifier(claims: FlagInteroperableClaims, value: string): FlagInteroperableClaims {
  return { ...claims, [FlagClaim.Identifier]: normalizeClaimScalar(value) };
}
