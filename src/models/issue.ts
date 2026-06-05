// src/models/issue.ts
// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.
// Source: https://build.fhir.org/valueset-issue-severity.html
// Source: https://build.fhir.org/valueset-issue-type.html

/**
 * Canonical FHIR issue severities shared across common-utils.
 */
export const IssueSeverity = {
  Fatal: 'fatal',
  Error: 'error',
  Warning: 'warning',
  Information: 'information',
  Success: 'success',
} as const;

export type IssueSeverityCode = typeof IssueSeverity[keyof typeof IssueSeverity];
export type IssueSeverityAttentionCode =
  | typeof IssueSeverity.Error
  | typeof IssueSeverity.Warning;

/**
 * Backward-compatible alias kept for older callers.
 */
export const IssueLevel = IssueSeverity;
export type IssueLevel = IssueSeverityCode;

export const IssueSeverityPriority: Readonly<Record<IssueSeverityCode, number>> = {
  [IssueSeverity.Fatal]: 5,
  [IssueSeverity.Error]: 4,
  [IssueSeverity.Warning]: 3,
  [IssueSeverity.Information]: 2,
  [IssueSeverity.Success]: 1,
};

const ISSUE_SEVERITY_VALUES = Object.values(IssueSeverity);

export function isIssueSeverityCode(value: unknown): value is IssueSeverityCode {
  return typeof value === 'string' && ISSUE_SEVERITY_VALUES.includes(value as IssueSeverityCode);
}

export function getHighestIssueSeverity(
  severities: readonly IssueSeverityCode[],
): IssueSeverityCode | undefined {
  return severities.reduce<IssueSeverityCode | undefined>((highest, current) => {
    if (!highest) {
      return current;
    }
    return IssueSeverityPriority[current] > IssueSeverityPriority[highest] ? current : highest;
  }, undefined);
}

/**
 * Canonical FHIR issue types shared across common-utils.
 */
export const IssueType = {
  Invalid: 'invalid',
  Structure: 'structure',
  Required: 'required',
  Value: 'value',
  Invariant: 'invariant',
  Security: 'security',
  Login: 'login',
  Unknown: 'unknown',
  Expired: 'expired',
  Forbidden: 'forbidden',
  Suppressed: 'suppressed',
  Processing: 'processing',
  NotSupported: 'not-supported',
  Duplicate: 'duplicate',
  MultipleMatches: 'multiple-matches',
  NotFound: 'not-found',
  Deleted: 'deleted',
  TooLong: 'too-long',
  CodeInvalid: 'code-invalid',
  Extension: 'extension',
  TooCostly: 'too-costly',
  BusinessRule: 'business-rule',
  Conflict: 'conflict',
  LimitedFilter: 'limited-filter',
  Transient: 'transient',
  LockError: 'lock-error',
  NoStore: 'no-store',
  Exception: 'exception',
  Timeout: 'timeout',
  Incomplete: 'incomplete',
  Throttled: 'throttled',
  Informational: 'informational',
  Success: 'success',
} as const;

export type IssueTypeCode = typeof IssueType[keyof typeof IssueType];

/**
 * Pragmatic HTTP mapping for common API/server adapters.
 */
export const IssueTypeToHttpStatus: Record<IssueTypeCode, string> = {
  [IssueType.Invalid]: '400',
  [IssueType.Structure]: '400',
  [IssueType.Required]: '400',
  [IssueType.Value]: '400',
  [IssueType.Invariant]: '400',
  [IssueType.Security]: '403',
  [IssueType.Login]: '401',
  [IssueType.Unknown]: '401',
  [IssueType.Expired]: '401',
  [IssueType.Forbidden]: '403',
  [IssueType.Suppressed]: '403',
  [IssueType.Processing]: '422',
  [IssueType.NotSupported]: '501',
  [IssueType.Duplicate]: '409',
  [IssueType.MultipleMatches]: '409',
  [IssueType.NotFound]: '404',
  [IssueType.Deleted]: '410',
  [IssueType.TooLong]: '413',
  [IssueType.CodeInvalid]: '400',
  [IssueType.Extension]: '400',
  [IssueType.TooCostly]: '422',
  [IssueType.BusinessRule]: '422',
  [IssueType.Conflict]: '409',
  [IssueType.LimitedFilter]: '422',
  [IssueType.Transient]: '503',
  [IssueType.LockError]: '423',
  [IssueType.NoStore]: '503',
  [IssueType.Exception]: '500',
  [IssueType.Timeout]: '504',
  [IssueType.Incomplete]: '206',
  [IssueType.Throttled]: '429',
  [IssueType.Informational]: '200',
  [IssueType.Success]: '200',
};
