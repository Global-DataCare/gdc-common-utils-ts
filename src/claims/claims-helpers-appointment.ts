import { AppointmentClaim } from '../models/interoperable-claims/appointment-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type AppointmentInteroperableClaims = GenericInteroperableClaims;

export function getAppointmentClaimList(claims: AppointmentInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setAppointmentClaimList(
  claims: AppointmentInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): AppointmentInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addAppointmentClaimList(
  claims: AppointmentInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): AppointmentInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeAppointmentClaimList(
  claims: AppointmentInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): AppointmentInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getAppointmentIdentifier(claims: AppointmentInteroperableClaims): string {
  return normalizeClaimScalar(claims[AppointmentClaim.Identifier]);
}

export function setAppointmentIdentifier(claims: AppointmentInteroperableClaims, value: string): AppointmentInteroperableClaims {
  return { ...claims, [AppointmentClaim.Identifier]: normalizeClaimScalar(value) };
}

export function getAppointmentParticipantActorList(claims: AppointmentInteroperableClaims): string[] {
  return getAppointmentClaimList(claims, AppointmentClaim.ParticipantActor);
}

export function setAppointmentParticipantActorList(
  claims: AppointmentInteroperableClaims,
  values: string | readonly string[],
): AppointmentInteroperableClaims {
  return setAppointmentClaimList(claims, AppointmentClaim.ParticipantActor, values);
}
