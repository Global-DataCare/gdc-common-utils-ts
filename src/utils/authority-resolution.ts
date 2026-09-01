// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import type {
  AuthorityCatalogRecord,
  AuthorityResolution,
  AuthorityResolutionInput,
  AuthorityResolutionMatch,
} from '../models/authority-resolution';
import { buildOrganizationDidWeb, getBaseUrlFromDidWeb } from './did';

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function encodeDidWebAuthority(authority: string): string {
  // DNS hostnames are case-insensitive, while the canonical did:web spelling
  // keeps URI percent escapes uppercase for exact DID-document comparisons.
  return authority.toLowerCase().replace(/:/g, '%3A');
}

function normalizeAuthorityHost(value: string): string {
  const raw = normalizeString(value).replace(/\/+$/, '');
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) {
    try {
      return new URL(raw).host;
    } catch {
      return raw.replace(/^https?:\/\//i, '');
    }
  }
  return raw;
}

function protocolForAuthority(authority: string): string {
  const normalized = authority.trim().toLowerCase();
  return normalized.startsWith('localhost')
    || normalized.startsWith('127.0.0.1')
    || normalized.startsWith('[::1]')
    ? 'http'
    : 'https';
}

function inferMatchedBy(input: AuthorityResolutionInput): AuthorityResolutionMatch {
  if (normalizeString(input.subjectDid)) return 'subject-did';
  if (normalizeString(input.subjectSameAs)) return 'subject-same-as';
  if (normalizeString(input.authorityDidWeb)) return 'authority-did';
  if (normalizeString(input.authorityBaseUrl)) return 'authority-base-url';
  return 'tenant-context';
}

/**
 * Builds one authority/root `did:web` from a bare host authority or URL.
 *
 * Examples:
 * - `https://gw.example.org` -> `did:web:gw.example.org`
 * - `localhost:3300` -> `did:web:localhost%3A3300`
 */
export function buildAuthorityDidWeb(input: { authority: string }): string {
  const authority = normalizeAuthorityHost(input.authority);
  if (!authority) throw new Error('buildAuthorityDidWeb requires authority.');
  return `did:web:${encodeDidWebAuthority(authority)}`;
}

/**
 * Normalizes one authority base URL from either an explicit URL or one
 * authority/root `did:web`.
 */
export function resolveAuthorityBaseUrl(input: {
  authorityBaseUrl?: string;
  authorityDidWeb?: string;
}): string | undefined {
  const direct = normalizeString(input.authorityBaseUrl);
  if (direct) {
    const host = normalizeAuthorityHost(direct);
    return host ? `${protocolForAuthority(host)}://${host}/` : undefined;
  }
  const did = normalizeString(input.authorityDidWeb);
  if (!did) return undefined;
  return getBaseUrlFromDidWeb(did);
}

/**
 * Builds one compatibility authority resolution when the caller only knows:
 * - tenant context
 * - one base URL or one root authority `did:web`
 *
 * This helper intentionally keeps the current hosted-DID fallback in one place
 * so app code does not have to hand-invent `did:web` strings.
 */
export function buildLegacyAuthorityResolution(
  input: AuthorityResolutionInput & Readonly<{
    tenantId: string;
    jurisdiction: string;
    sector: string;
  }>,
): AuthorityResolution {
  const authorityDidWeb = normalizeString(input.authorityDidWeb)
    || buildAuthorityDidWeb({ authority: normalizeString(input.authorityBaseUrl) });
  const authorityBaseUrl = resolveAuthorityBaseUrl({
    authorityBaseUrl: input.authorityBaseUrl,
    authorityDidWeb,
  });
  const tenantDidWeb = buildOrganizationDidWeb({
    hostDidWeb: authorityDidWeb,
    tenantId: input.tenantId,
    jurisdiction: input.jurisdiction,
    version: normalizeString(input.version) || 'v1',
    sector: input.sector,
  });

  return {
    authorityDidWeb,
    authorityBaseUrl,
    tenantDidWeb,
    metadataUrl: normalizeString(input.metadataUrl) || undefined,
    source: 'legacy',
    matchedBy: inferMatchedBy(input),
  };
}

/**
 * Converts one resolution into a catalog-style record so runtimes can preload
 * legacy fallback data into a shared resolver cache.
 */
export function authorityResolutionToCatalogRecord(
  resolution: AuthorityResolution,
): AuthorityCatalogRecord {
  return {
    authorityDidWeb: resolution.authorityDidWeb,
    authorityBaseUrl: resolution.authorityBaseUrl,
    tenantDidWeb: resolution.tenantDidWeb,
    metadataUrl: resolution.metadataUrl,
  };
}
