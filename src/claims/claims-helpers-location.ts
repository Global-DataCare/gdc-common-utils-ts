import { LocationClaim } from '../models/interoperable-claims/location-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type LocationInteroperableClaims = GenericInteroperableClaims;

export function getLocationClaimList(claims: LocationInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setLocationClaimList(
  claims: LocationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): LocationInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addLocationClaimList(
  claims: LocationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): LocationInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeLocationClaimList(
  claims: LocationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): LocationInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getLocationIdentifier(claims: LocationInteroperableClaims): string {
  return normalizeClaimScalar(claims[LocationClaim.Identifier]);
}

export function setLocationIdentifier(claims: LocationInteroperableClaims, value: string): LocationInteroperableClaims {
  return { ...claims, [LocationClaim.Identifier]: normalizeClaimScalar(value) };
}

export function getLocationTelecomList(claims: LocationInteroperableClaims): string[] {
  return getClaimValues(claims, LocationClaim.Telecom);
}

export function setLocationTelecomList(
  claims: LocationInteroperableClaims,
  values: string | readonly string[],
): LocationInteroperableClaims {
  return setClaimValues(claims, LocationClaim.Telecom, values);
}
