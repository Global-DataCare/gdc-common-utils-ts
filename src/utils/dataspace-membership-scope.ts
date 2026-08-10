// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

const SCOPE_SEGMENT_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

/**
 * Normalizes the extensible `<service-category>:<membership-profile>` contract
 * used by dataspace onboarding.
 *
 * This intentionally does not embed a product-specific sector allowlist.
 * Governance deployments may supply `allowedScopes`; otherwise syntactically
 * valid future categories remain interoperable.
 */
export function normalizeDataspaceMembershipScope(
  rawScope: string,
  options: { defaultProfile?: string; allowedScopes?: readonly string[] } = {},
): string {
  const defaultProfile = (options.defaultProfile || 'provider').trim().toLowerCase();
  let normalized = String(rawScope || '').trim().toLowerCase();
  if (!normalized) throw new Error('Dataspace membership scope cannot be empty.');
  if (!normalized.includes(':')) normalized = `${normalized}:${defaultProfile}`;

  const parts = normalized.split(':');
  if (parts.length !== 2 || parts.some((part) => !SCOPE_SEGMENT_PATTERN.test(part))) {
    throw new Error(
      `Invalid dataspace membership scope "${rawScope}". Expected <service-category>:<membership-profile>.`,
    );
  }

  if (options.allowedScopes?.length) {
    const allowed = new Set(options.allowedScopes.map((scope) => scope.trim().toLowerCase()).filter(Boolean));
    if (!allowed.has(normalized)) {
      throw new Error(`Dataspace membership scope "${normalized}" is not allowed by deployment policy.`);
    }
  }
  return normalized;
}

/** Parses and normalizes a comma-separated deployment allowlist. */
export function parseDataspaceMembershipScopeCsv(rawScopes: string | undefined): string[] {
  if (!rawScopes?.trim()) return [];
  return Array.from(new Set(
    rawScopes
      .split(',')
      .map((scope) => normalizeDataspaceMembershipScope(scope))
      .filter(Boolean),
  ));
}
