// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ClaimsOrganizationSchemaorg } from '../constants/schemaorg';
import type { ClaimsRecord } from '../models/resource-document';

export type OrganizationAuthorizationUrnInput = Readonly<{
  identifierType: string;
  identifierValue: string;
}>;

export type MemberAuthorizationUrnInput = Readonly<{
  organizationUrn?: string;
  identifierType?: string;
  identifierValue?: string;
  memberId: string;
  /** Optional compatibility input. Role must be persisted separately, not inside the canonical member URN. */
  roleCode?: string;
}>;

const ORGANIZATION_URN_PREFIX = 'urn:org:' as const;

function normalizeTypeSegment(identifierType: string): string {
  return String(identifierType || '').trim().toLowerCase();
}

function normalizeValueSegment(identifierValue: string): string {
  return String(identifierValue || '').trim();
}

/**
 * Canonical organization authorization identifier used by ledger, consent-like
 * rules, and inter-tenant authorization persistence.
 *
 * Format:
 * - `urn:org:<identifierType-lowercase>:<identifierValue-as-canonical-input>`
 *
 * Examples:
 * - `urn:org:tax:VATES-B12345678`
 * - `urn:org:tax:acme-id`
 */
export function buildOrganizationAuthorizationUrn(
  input: OrganizationAuthorizationUrnInput,
): string {
  const identifierType = normalizeTypeSegment(input.identifierType);
  const identifierValue = normalizeValueSegment(input.identifierValue);
  if (!identifierType || !identifierValue) {
    throw new Error('Organization authorization URN requires identifierType and identifierValue.');
  }
  return `${ORGANIZATION_URN_PREFIX}${identifierType}:${identifierValue}`;
}

/**
 * Accepts either the legacy `TYPE|VALUE` input or an already-canonical
 * `urn:org:...` identifier and always returns the canonical URN form.
 */
export function normalizeOrganizationAuthorizationUrn(input: string): string {
  const normalized = String(input || '').trim();
  if (!normalized) {
    throw new Error('Organization authorization identifier cannot be empty.');
  }
  if (normalized.toLowerCase().startsWith(ORGANIZATION_URN_PREFIX)) {
    const parts = normalized.split(':');
    const identifierType = String(parts[2] || '').trim();
    const value = parts.slice(3).join(':').trim();
    return buildOrganizationAuthorizationUrn({
      identifierType,
      identifierValue: value,
    });
  }

  const legacyMatch = normalized.match(/^([^|:]+)\|(.+)$/);
  if (legacyMatch) {
    return buildOrganizationAuthorizationUrn({
      identifierType: legacyMatch[1],
      identifierValue: legacyMatch[2],
    });
  }

  throw new Error(`Unsupported organization authorization identifier format: ${normalized}`);
}

export function buildOrganizationAuthorizationUrnFromClaims(
  claims?: ClaimsRecord,
): string {
  const identifierType = String(claims?.[ClaimsOrganizationSchemaorg.identifierType] || '').trim();
  const identifierValue = String(claims?.[ClaimsOrganizationSchemaorg.identifierValue] || '').trim();
  return buildOrganizationAuthorizationUrn({
    identifierType,
    identifierValue,
  });
}

/**
 * Canonical member authorization identifier rooted in one canonical
 * `urn:org:...`.
 *
 * Format:
 * - `urn:org:<type>:<value>:member:<memberId>`
 *
 * Important rule:
 * - role must be stored as a separate claim, not inside the canonical member
 *   identifier
 */
export function buildMemberAuthorizationUrn(
  input: MemberAuthorizationUrnInput,
): string {
  const organizationUrn = input.organizationUrn
    ? normalizeOrganizationAuthorizationUrn(input.organizationUrn)
    : buildOrganizationAuthorizationUrn({
        identifierType: String(input.identifierType || '').trim(),
        identifierValue: String(input.identifierValue || '').trim(),
      });
  const memberId = String(input.memberId || '').trim();
  if (!memberId) {
    throw new Error('Member authorization URN requires memberId.');
  }
  return `${organizationUrn}:member:${memberId}`;
}
