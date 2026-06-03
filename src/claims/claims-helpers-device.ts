import { DeviceClaim } from '../models/interoperable-claims/device-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type DeviceInteroperableClaims = GenericInteroperableClaims;

export function getDeviceClaimList(claims: DeviceInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setDeviceClaimList(
  claims: DeviceInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): DeviceInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addDeviceClaimList(
  claims: DeviceInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): DeviceInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeDeviceClaimList(
  claims: DeviceInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): DeviceInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getDeviceIdentifier(claims: DeviceInteroperableClaims): string {
  return normalizeClaimScalar(claims[DeviceClaim.Identifier]);
}

export function setDeviceIdentifier(claims: DeviceInteroperableClaims, value: string): DeviceInteroperableClaims {
  return { ...claims, [DeviceClaim.Identifier]: normalizeClaimScalar(value) };
}
