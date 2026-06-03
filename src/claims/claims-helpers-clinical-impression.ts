import { ClinicalImpressionClaim } from '../models/interoperable-claims/clinical-impression-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type ClinicalImpressionInteroperableClaims = GenericInteroperableClaims;

export function getClinicalImpressionClaimList(claims: ClinicalImpressionInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setClinicalImpressionClaimList(
  claims: ClinicalImpressionInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): ClinicalImpressionInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addClinicalImpressionClaimList(
  claims: ClinicalImpressionInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): ClinicalImpressionInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeClinicalImpressionClaimList(
  claims: ClinicalImpressionInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): ClinicalImpressionInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getClinicalImpressionIdentifier(claims: ClinicalImpressionInteroperableClaims): string {
  return normalizeClaimScalar(claims[ClinicalImpressionClaim.Identifier]);
}

export function setClinicalImpressionIdentifier(claims: ClinicalImpressionInteroperableClaims, value: string): ClinicalImpressionInteroperableClaims {
  return { ...claims, [ClinicalImpressionClaim.Identifier]: normalizeClaimScalar(value) };
}

export function getClinicalImpressionProblemList(claims: ClinicalImpressionInteroperableClaims): string[] {
  return getClinicalImpressionClaimList(claims, ClinicalImpressionClaim.Problem);
}

export function setClinicalImpressionProblemList(
  claims: ClinicalImpressionInteroperableClaims,
  values: string | readonly string[],
): ClinicalImpressionInteroperableClaims {
  return setClinicalImpressionClaimList(claims, ClinicalImpressionClaim.Problem, values);
}
