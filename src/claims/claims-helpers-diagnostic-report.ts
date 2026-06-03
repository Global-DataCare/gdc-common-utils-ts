import { DiagnosticReportClaim } from '../models/interoperable-claims/diagnostic-report-claims.js';
import {
  addClaimValues,
  getClaimValues,
  normalizeClaimScalar,
  removeClaimValues,
  setClaimValues,
  type GenericInteroperableClaims,
} from './claim-list-helpers.js';

export type DiagnosticReportInteroperableClaims = GenericInteroperableClaims;

export function getDiagnosticReportClaimList(claims: DiagnosticReportInteroperableClaims, claimKey: string): string[] {
  return getClaimValues(claims, claimKey);
}

export function setDiagnosticReportClaimList(
  claims: DiagnosticReportInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): DiagnosticReportInteroperableClaims {
  return setClaimValues(claims, claimKey, values);
}

export function addDiagnosticReportClaimList(
  claims: DiagnosticReportInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): DiagnosticReportInteroperableClaims {
  return addClaimValues(claims, claimKey, values);
}

export function removeDiagnosticReportClaimList(
  claims: DiagnosticReportInteroperableClaims,
  claimKey: string,
  values: string | readonly string[],
): DiagnosticReportInteroperableClaims {
  return removeClaimValues(claims, claimKey, values);
}

export function getDiagnosticReportIdentifier(claims: DiagnosticReportInteroperableClaims): string {
  return normalizeClaimScalar(claims[DiagnosticReportClaim.Identifier]);
}

export function setDiagnosticReportIdentifier(claims: DiagnosticReportInteroperableClaims, value: string): DiagnosticReportInteroperableClaims {
  return { ...claims, [DiagnosticReportClaim.Identifier]: normalizeClaimScalar(value) };
}

export function getDiagnosticReportResultList(claims: DiagnosticReportInteroperableClaims): string[] {
  return getDiagnosticReportClaimList(claims, DiagnosticReportClaim.Result);
}

export function setDiagnosticReportResultList(
  claims: DiagnosticReportInteroperableClaims,
  values: string | readonly string[],
): DiagnosticReportInteroperableClaims {
  return setDiagnosticReportClaimList(claims, DiagnosticReportClaim.Result, values);
}

export function getDiagnosticReportContainedDocumentIdentifierList(claims: DiagnosticReportInteroperableClaims): string[] {
  return getDiagnosticReportClaimList(claims, DiagnosticReportClaim.ContainedDocuments);
}

export function setDiagnosticReportContainedDocumentIdentifierList(
  claims: DiagnosticReportInteroperableClaims,
  values: string | readonly string[],
): DiagnosticReportInteroperableClaims {
  return setDiagnosticReportClaimList(claims, DiagnosticReportClaim.ContainedDocuments, values);
}
