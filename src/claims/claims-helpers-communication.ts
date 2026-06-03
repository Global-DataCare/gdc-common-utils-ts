// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { CommunicationClaim } from '../models/interoperable-claims/communication-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type CommunicationInteroperableClaims = GenericInteroperableClaims;

function getCommunicationScalar(
  claims: CommunicationInteroperableClaims,
  claimKey: string,
): string {
  return normalizeClaimScalar(claims[claimKey]);
}

function setCommunicationScalar(
  claims: CommunicationInteroperableClaims,
  claimKey: string,
  value: unknown,
): CommunicationInteroperableClaims {
  return {
    ...claims,
    [claimKey]: normalizeClaimScalar(value),
  };
}

export function getCommunicationIdentifier(claims: CommunicationInteroperableClaims): string {
  return getCommunicationScalar(claims, CommunicationClaim.Identifier);
}

export function setCommunicationIdentifier(
  claims: CommunicationInteroperableClaims,
  value: unknown,
): CommunicationInteroperableClaims {
  return setCommunicationScalar(claims, CommunicationClaim.Identifier, value);
}

export function getCommunicationSubject(claims: CommunicationInteroperableClaims): string {
  return getCommunicationScalar(claims, CommunicationClaim.Subject);
}

export function setCommunicationSubject(
  claims: CommunicationInteroperableClaims,
  value: unknown,
): CommunicationInteroperableClaims {
  return setCommunicationScalar(claims, CommunicationClaim.Subject, value);
}

export function getCommunicationCategory(claims: CommunicationInteroperableClaims): string {
  return getCommunicationScalar(claims, CommunicationClaim.Category);
}

export function getCommunicationCategoryList(
  claims: CommunicationInteroperableClaims,
): string[] {
  return getClaimValues(claims, CommunicationClaim.Category);
}

export function setCommunicationCategory(
  claims: CommunicationInteroperableClaims,
  value: string | readonly string[],
): CommunicationInteroperableClaims {
  return setClaimValues(claims, CommunicationClaim.Category, value);
}

export function addCommunicationCategoryList(
  claims: CommunicationInteroperableClaims,
  value: string | readonly string[],
): CommunicationInteroperableClaims {
  return addClaimValues(claims, CommunicationClaim.Category, value);
}

export function removeCommunicationCategoryList(
  claims: CommunicationInteroperableClaims,
  value: string | readonly string[],
): CommunicationInteroperableClaims {
  return removeClaimValues(claims, CommunicationClaim.Category, value);
}

export function getCommunicationText(claims: CommunicationInteroperableClaims): string {
  return getCommunicationScalar(claims, CommunicationClaim.Text);
}

export function setCommunicationText(
  claims: CommunicationInteroperableClaims,
  value: unknown,
): CommunicationInteroperableClaims {
  return setCommunicationScalar(claims, CommunicationClaim.Text, value);
}

export function getCommunicationContentAttachmentData(claims: CommunicationInteroperableClaims): string {
  return getCommunicationScalar(claims, CommunicationClaim.ContentAttachmentData);
}

export function setCommunicationContentAttachmentData(
  claims: CommunicationInteroperableClaims,
  value: unknown,
): CommunicationInteroperableClaims {
  return setCommunicationScalar(claims, CommunicationClaim.ContentAttachmentData, value);
}

export function getCommunicationContentAttachmentType(claims: CommunicationInteroperableClaims): string {
  return getCommunicationScalar(claims, CommunicationClaim.ContentAttachmentType);
}

export function setCommunicationContentAttachmentType(
  claims: CommunicationInteroperableClaims,
  value: unknown,
): CommunicationInteroperableClaims {
  return setCommunicationScalar(claims, CommunicationClaim.ContentAttachmentType, value);
}
