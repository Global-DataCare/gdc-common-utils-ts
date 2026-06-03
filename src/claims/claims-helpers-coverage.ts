import { CoverageClaim } from '../models/interoperable-claims/coverage-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type CoverageInteroperableClaims = GenericInteroperableClaims;

export function getCoverageClaimList(claims: CoverageInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setCoverageClaimList(
  claims: CoverageInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): CoverageInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addCoverageClaimList(
  claims: CoverageInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): CoverageInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeCoverageClaimList(
  claims: CoverageInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): CoverageInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getCoverageIdentifier(claims: CoverageInteroperableClaims): string {
  return normalizeClaimScalar(claims[CoverageClaim.Identifier]);
}

export function setCoverageIdentifier(claims: CoverageInteroperableClaims, value: string): CoverageInteroperableClaims {
  return { ...claims, [CoverageClaim.Identifier]: normalizeClaimScalar(value) };
}

export function getCoveragePayorList(claims: CoverageInteroperableClaims): string[] {
  return getCoverageClaimList(claims, CoverageClaim.Payor);
}

export function setCoveragePayorList(claims: CoverageInteroperableClaims, values: string | readonly string[]): CoverageInteroperableClaims {
  return setCoverageClaimList(claims, CoverageClaim.Payor, values);
}
