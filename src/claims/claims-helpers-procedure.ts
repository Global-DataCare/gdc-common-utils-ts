import { ProcedureClaim } from '../models/interoperable-claims/procedure-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type ProcedureInteroperableClaims = GenericInteroperableClaims;

export function getProcedureClaimList(claims: ProcedureInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setProcedureClaimList(
  claims: ProcedureInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): ProcedureInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addProcedureClaimList(
  claims: ProcedureInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): ProcedureInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeProcedureClaimList(
  claims: ProcedureInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): ProcedureInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getProcedureIdentifier(claims: ProcedureInteroperableClaims): string {
  return normalizeClaimScalar(claims[ProcedureClaim.Identifier]);
}

export function setProcedureIdentifier(claims: ProcedureInteroperableClaims, value: string): ProcedureInteroperableClaims {
  return { ...claims, [ProcedureClaim.Identifier]: normalizeClaimScalar(value) };
}
