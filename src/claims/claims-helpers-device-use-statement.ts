import { DeviceUseStatementClaim } from '../models/interoperable-claims/device-use-statement-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type DeviceUseStatementInteroperableClaims = GenericInteroperableClaims;

export function getDeviceUseStatementClaimList(claims: DeviceUseStatementInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setDeviceUseStatementClaimList(
  claims: DeviceUseStatementInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): DeviceUseStatementInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addDeviceUseStatementClaimList(
  claims: DeviceUseStatementInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): DeviceUseStatementInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeDeviceUseStatementClaimList(
  claims: DeviceUseStatementInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): DeviceUseStatementInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getDeviceUseStatementIdentifier(claims: DeviceUseStatementInteroperableClaims): string {
  return normalizeClaimScalar(claims[DeviceUseStatementClaim.Identifier]);
}

export function setDeviceUseStatementIdentifier(
  claims: DeviceUseStatementInteroperableClaims,
  value: string,
): DeviceUseStatementInteroperableClaims {
  return { ...claims, [DeviceUseStatementClaim.Identifier]: normalizeClaimScalar(value) };
}
