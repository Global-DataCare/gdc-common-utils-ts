import { CompositionClaim } from '../models/interoperable-claims/composition-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type CompositionInteroperableClaims = GenericInteroperableClaims;

export function getCompositionClaimList(claims: CompositionInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setCompositionClaimList(
  claims: CompositionInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): CompositionInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addCompositionClaimList(
  claims: CompositionInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): CompositionInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeCompositionClaimList(
  claims: CompositionInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): CompositionInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getCompositionTypeList(claims: CompositionInteroperableClaims): string[] {
  return getCompositionClaimList(claims, CompositionClaim.Type);
}

export function setCompositionTypeList(claims: CompositionInteroperableClaims, values: string | readonly string[]): CompositionInteroperableClaims {
  return setCompositionClaimList(claims, CompositionClaim.Type, values);
}

export function getCompositionSectionList(claims: CompositionInteroperableClaims): string[] {
  return getCompositionClaimList(claims, CompositionClaim.Section);
}

export function setCompositionSectionList(claims: CompositionInteroperableClaims, values: string | readonly string[]): CompositionInteroperableClaims {
  return setCompositionClaimList(claims, CompositionClaim.Section, values);
}

export function getCompositionSubject(claims: CompositionInteroperableClaims): string {
  return normalizeClaimScalar(claims[CompositionClaim.Subject]);
}

export function setCompositionSubject(claims: CompositionInteroperableClaims, value: string): CompositionInteroperableClaims {
  return { ...claims, [CompositionClaim.Subject]: normalizeClaimScalar(value) };
}
