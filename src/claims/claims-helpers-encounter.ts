import { EncounterClaim } from '../models/interoperable-claims/encounter-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type EncounterInteroperableClaims = GenericInteroperableClaims;

export function getEncounterClaimList(claims: EncounterInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setEncounterClaimList(
  claims: EncounterInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): EncounterInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addEncounterClaimList(
  claims: EncounterInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): EncounterInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeEncounterClaimList(
  claims: EncounterInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): EncounterInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getEncounterIdentifier(claims: EncounterInteroperableClaims): string {
  return normalizeClaimScalar(claims[EncounterClaim.Identifier]);
}

export function setEncounterIdentifier(claims: EncounterInteroperableClaims, value: string): EncounterInteroperableClaims {
  return { ...claims, [EncounterClaim.Identifier]: normalizeClaimScalar(value) };
}

export function getEncounterParticipantList(claims: EncounterInteroperableClaims): string[] {
  return getEncounterClaimList(claims, EncounterClaim.Participant);
}

export function setEncounterParticipantList(claims: EncounterInteroperableClaims, values: string | readonly string[]): EncounterInteroperableClaims {
  return setEncounterClaimList(claims, EncounterClaim.Participant, values);
}
