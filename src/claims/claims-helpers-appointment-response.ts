import { AppointmentResponseClaim } from '../models/interoperable-claims/appointment-response-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type AppointmentResponseInteroperableClaims = GenericInteroperableClaims;

export function getAppointmentResponseClaimList(claims: AppointmentResponseInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setAppointmentResponseClaimList(
  claims: AppointmentResponseInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): AppointmentResponseInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addAppointmentResponseClaimList(
  claims: AppointmentResponseInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): AppointmentResponseInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeAppointmentResponseClaimList(
  claims: AppointmentResponseInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): AppointmentResponseInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getAppointmentResponseIdentifier(claims: AppointmentResponseInteroperableClaims): string {
  return normalizeClaimScalar(claims[AppointmentResponseClaim.Identifier]);
}

export function setAppointmentResponseIdentifier(
  claims: AppointmentResponseInteroperableClaims,
  value: string,
): AppointmentResponseInteroperableClaims {
  return { ...claims, [AppointmentResponseClaim.Identifier]: normalizeClaimScalar(value) };
}
