import { ObservationClaim } from '../models/interoperable-claims/observation-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type ObservationInteroperableClaims = GenericInteroperableClaims;

export function getObservationClaimList(claims: ObservationInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setObservationClaimList(
  claims: ObservationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): ObservationInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addObservationClaimList(
  claims: ObservationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): ObservationInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeObservationClaimList(
  claims: ObservationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): ObservationInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getObservationIdentifier(claims: ObservationInteroperableClaims): string {
  return normalizeClaimScalar(claims[ObservationClaim.Identifier]);
}

export function setObservationIdentifier(claims: ObservationInteroperableClaims, value: string): ObservationInteroperableClaims {
  return { ...claims, [ObservationClaim.Identifier]: normalizeClaimScalar(value) };
}
