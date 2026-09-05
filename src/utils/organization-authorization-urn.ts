// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ClaimsOrganizationSchemaorg } from '../constants/schemaorg';
import type { ClaimsRecord } from '../models/resource-document';

export type OrganizationAuthorizationUrnInput = Readonly<{
  identifierType: string;
  identifierValue: string;
}>;

export type OrganizationAuthorizationUrnCdsInput = Readonly<{
  /** ISO country or governed subdivision such as ES, US, US-WA or CA-BC. */
  jurisdiction: string;
  /** Version of the stable CDS identifier grammar. Defaults to v1. */
  version?: string;
  /** Governed legal identifier type such as TAX, EIN or BN. */
  identifierType: string;
  /** Canonical value issued by that jurisdiction's identifier authority. */
  identifierValue: string;
}>;

export type OrganizationMemberAuthorizationUrnCdsInput = Readonly<{
  organizationUrn: string;
  /** Bare base58btc multibase identifier (`z...`); never raw email/phone. */
  memberId: string;
  /** Required protected coding system; deliberately not serialized. */
  roleType: string;
  /** Coded role value serialized as the final compact path segment. */
  roleValue: string;
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
const CDS_ORGANIZATION_URN_PATTERN =
  /^urn:cds-([a-z]{2}(?:-[a-z0-9]{2,3})?):(v[1-9][0-9]*):organization:([a-z][a-z0-9-]*):([^:]+)$/;
const BARE_MULTIBASE_PATTERN = /^z[1-9A-HJ-NP-Za-km-z]+$/;

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
 * @deprecated For new cross-jurisdiction identities use
 * `buildOrganizationAuthorizationUrnCds`, which requires jurisdiction and
 * grammar version. This legacy form remains readable during migration.
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
 * Builds the globally scoped, host-independent legal organization identifier.
 *
 * Format:
 * `urn:cds-<jurisdiction>:<version>:organization:<identifier-type>:<identifier-value>`
 *
 * Jurisdiction is mandatory because identifier schemes such as BN, EIN and
 * TAX are interpreted by different national/subnational authorities.
 */
export function buildOrganizationAuthorizationUrnCds(
  input: OrganizationAuthorizationUrnCdsInput,
): string {
  const jurisdiction = String(input.jurisdiction || '').trim().toLowerCase();
  const version = String(input.version || 'v1').trim().toLowerCase();
  const identifierType = normalizeTypeSegment(input.identifierType);
  const identifierValue = normalizeValueSegment(input.identifierValue);
  if (!/^[a-z]{2}(?:-[a-z0-9]{2,3})?$/.test(jurisdiction)) {
    throw new Error('CDS organization authorization URN requires an ISO jurisdiction such as ES, US or CA-BC.');
  }
  if (!/^v[1-9][0-9]*$/.test(version)) {
    throw new Error('CDS organization authorization URN requires a version such as v1.');
  }
  if (!/^[a-z][a-z0-9-]*$/.test(identifierType) || !identifierValue || identifierValue.includes(':')) {
    throw new Error('CDS organization authorization URN requires a legal identifier type and colon-free value.');
  }
  return `urn:cds-${jurisdiction}:${version}:organization:${identifierType}:${identifierValue}`;
}

/**
 * Builds a stable organization-member authorization identifier without a host.
 * `roleType` is mandatory input but only `roleValue` is serialized, matching
 * the compact role convention used by member did:web paths.
 */
export function buildOrganizationMemberAuthorizationUrnCds(
  input: OrganizationMemberAuthorizationUrnCdsInput,
): string {
  const organizationUrn = String(input.organizationUrn || '').trim();
  const memberId = String(input.memberId || '').trim();
  const roleType = String(input.roleType || '').trim();
  const roleValue = String(input.roleValue || '').trim();
  if (!CDS_ORGANIZATION_URN_PATTERN.test(organizationUrn)) {
    throw new Error('CDS organization member authorization URN requires a canonical CDS organization URN.');
  }
  if (!BARE_MULTIBASE_PATTERN.test(memberId)) {
    throw new Error('CDS organization member authorization URN requires memberId as bare base58btc multibase.');
  }
  if (!roleType || !roleValue || roleValue.includes(':')) {
    throw new Error('CDS organization member authorization URN requires roleType and a colon-free roleValue.');
  }
  return `${organizationUrn}:member:${memberId}:${roleValue}`;
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
