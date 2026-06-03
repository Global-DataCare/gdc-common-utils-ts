import { DocumentReferenceClaim } from '../models/interoperable-claims/document-reference-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type DocumentReferenceInteroperableClaims = GenericInteroperableClaims;

export function getDocumentReferenceClaimList(claims: DocumentReferenceInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setDocumentReferenceClaimList(
  claims: DocumentReferenceInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): DocumentReferenceInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addDocumentReferenceClaimList(
  claims: DocumentReferenceInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): DocumentReferenceInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeDocumentReferenceClaimList(
  claims: DocumentReferenceInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): DocumentReferenceInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getDocumentReferenceIdentifier(claims: DocumentReferenceInteroperableClaims): string {
  return normalizeClaimScalar(claims[DocumentReferenceClaim.Identifier]);
}

export function setDocumentReferenceIdentifier(
  claims: DocumentReferenceInteroperableClaims,
  value: string,
): DocumentReferenceInteroperableClaims {
  return { ...claims, [DocumentReferenceClaim.Identifier]: normalizeClaimScalar(value) };
}
