import { OrganizationClaim } from '../models/interoperable-claims/organization-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type OrganizationInteroperableClaims = GenericInteroperableClaims;

export function getOrganizationClaimList(claims: OrganizationInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setOrganizationClaimList(
  claims: OrganizationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): OrganizationInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addOrganizationClaimList(
  claims: OrganizationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): OrganizationInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeOrganizationClaimList(
  claims: OrganizationInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): OrganizationInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getOrganizationIdentifier(claims: OrganizationInteroperableClaims): string {
  return normalizeClaimScalar(claims[OrganizationClaim.Identifier]);
}

export function setOrganizationIdentifier(claims: OrganizationInteroperableClaims, value: string): OrganizationInteroperableClaims {
  return { ...claims, [OrganizationClaim.Identifier]: normalizeClaimScalar(value) };
}

export function getOrganizationAliasList(claims: OrganizationInteroperableClaims): string[] {
  return getClaimValues(claims, OrganizationClaim.Alias);
}

export function setOrganizationAliasList(
  claims: OrganizationInteroperableClaims,
  values: string | readonly string[],
): OrganizationInteroperableClaims {
  return setClaimValues(claims, OrganizationClaim.Alias, values);
}

export function getOrganizationTelecomList(claims: OrganizationInteroperableClaims): string[] {
  return getClaimValues(claims, OrganizationClaim.Telecom);
}

export function setOrganizationTelecomList(
  claims: OrganizationInteroperableClaims,
  values: string | readonly string[],
): OrganizationInteroperableClaims {
  return setClaimValues(claims, OrganizationClaim.Telecom, values);
}
