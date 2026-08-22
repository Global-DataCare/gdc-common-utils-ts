// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import type {
  OrganizationRoleLicense,
  OrganizationRoleLicenseDevice,
  OrganizationRoleLicenseSectorPolicy,
} from '../models/organization-role-license';
import { encodeMultibaseSha3 } from './multibasehash';

export type OrganizationRoleLicenseIdentity = Readonly<{
  jurisdiction: string;
  organizationOfficialId: string;
  stableContactIdentifier: string;
  licensedRole: string;
}>;

function required(value: string, label: string): string {
  const normalized = String(value || '').trim();
  if (!normalized) throw new TypeError(`${label} is required.`);
  return normalized;
}

function normalizedSector(value: string): string {
  return String(value || '').trim().toLowerCase();
}

function validateStableContactIdentifier(value: string): string {
  const normalized = required(value, 'stableContactIdentifier');
  if (!/^urn:multibase:z[1-9A-HJ-NP-Za-km-z]+$/.test(normalized)) {
    throw new TypeError('stableContactIdentifier must be a canonical urn:multibase value.');
  }
  return normalized;
}

export function validateOrganizationOfficialId(value: string): string {
  const normalized = required(value, 'organizationOfficialId');
  if (normalized.includes(':') || /^urn:/i.test(normalized)) {
    throw new TypeError(
      'organizationOfficialId must be the official identifier value, not an organization URN.',
    );
  }
  return normalized;
}

/**
 * Builds the exact, compact licence preimage agreed across portals and hosts.
 * The preimage is hashed before persistence and is never itself a ledger key.
 */
export function buildOrganizationRoleLicensePreimage(
  identity: OrganizationRoleLicenseIdentity,
): string {
  const jurisdiction = required(identity.jurisdiction, 'jurisdiction').toLowerCase();
  const organizationOfficialId = validateOrganizationOfficialId(identity.organizationOfficialId);
  const stableContactIdentifier = validateStableContactIdentifier(identity.stableContactIdentifier);
  const licensedRole = required(identity.licensedRole, 'licensedRole');
  return `urn:cds-${jurisdiction}:${organizationOfficialId}:${stableContactIdentifier}:${licensedRole}`;
}

/** SHA3-384 multihash identifier for organization + contact + licensed role. */
export function buildOrganizationRoleLicenseId(
  identity: OrganizationRoleLicenseIdentity,
): string {
  return `urn:multibase:${encodeMultibaseSha3(buildOrganizationRoleLicensePreimage(identity), 384)}`;
}

/** Validates and de-duplicates sector policies while preserving input order. */
export function normalizeOrganizationRoleLicensePolicies(
  policies: readonly OrganizationRoleLicenseSectorPolicy[],
): OrganizationRoleLicenseSectorPolicy[] {
  if (!Array.isArray(policies) || policies.length === 0) {
    throw new TypeError('At least one licence sector policy is required.');
  }
  const seen = new Set<string>();
  return policies.map((policy) => {
    const sector = normalizedSector(policy.sector);
    if (seen.has(sector)) throw new TypeError(`Duplicate licence sector policy: ${sector || '<all>'}.`);
    seen.add(sector);
    if (policy.maxDevices !== null
      && (!Number.isInteger(policy.maxDevices) || policy.maxDevices < 1)) {
      throw new TypeError('maxDevices must be null or a positive integer.');
    }
    return { sector, active: Boolean(policy.active), maxDevices: policy.maxDevices };
  });
}

/** Exact sector policy wins; the empty-sector catch-all is only a fallback. */
export function resolveOrganizationRoleLicensePolicy(
  policies: readonly OrganizationRoleLicenseSectorPolicy[],
  sector: string,
): OrganizationRoleLicenseSectorPolicy | undefined {
  const requested = required(sector, 'sector').toLowerCase();
  return policies.find((policy) => normalizedSector(policy.sector) === requested)
    ?? policies.find((policy) => normalizedSector(policy.sector) === '');
}

/** Returns the contractual limit or the positive GW/portal default. */
export function resolveOrganizationRoleLicenseMaxDevices(
  policy: OrganizationRoleLicenseSectorPolicy,
  defaultMaxDevices: number,
): number {
  if (policy.maxDevices !== null) return policy.maxDevices;
  if (!Number.isInteger(defaultMaxDevices) || defaultMaxDevices < 1) {
    throw new TypeError('defaultMaxDevices must be a positive integer.');
  }
  return defaultMaxDevices;
}

/** Checks global status plus the resolved exact/catch-all sector policy. */
export function organizationRoleLicenseAllowsSector(
  license: Readonly<{
    status: OrganizationRoleLicense['status'];
    data: readonly OrganizationRoleLicenseSectorPolicy[];
  }>,
  sector: string,
): boolean {
  if (license.status !== 'active') return false;
  return resolveOrganizationRoleLicensePolicy(license.data, sector)?.active === true;
}

/** Active DCR installations are counted per concrete sector, across hosts/apps. */
export function countActiveOrganizationRoleLicenseDevices(
  devices: readonly OrganizationRoleLicenseDevice[],
  sector: string,
): number {
  const requested = required(sector, 'sector').toLowerCase();
  return devices.filter((device) => device.status === 'active'
    && normalizedSector(device.sector) === requested).length;
}

/**
 * Deterministic DCR admission decision. Re-registering the same active client
 * is idempotent and does not consume an additional device slot.
 */
export function organizationRoleLicenseAllowsDevice(
  license: Readonly<{
    status: OrganizationRoleLicense['status'];
    data: readonly OrganizationRoleLicenseSectorPolicy[];
    devices: readonly OrganizationRoleLicenseDevice[];
  }>,
  input: Readonly<{ sector: string; clientId: string; clientInstanceId: string; defaultMaxDevices: number }>,
): boolean {
  const sector = required(input.sector, 'sector').toLowerCase();
  const clientId = required(input.clientId, 'clientId');
  const clientInstanceId = required(input.clientInstanceId, 'clientInstanceId');
  if (!organizationRoleLicenseAllowsSector(license, sector)) return false;
  if (license.devices.some((device) => device.status === 'active'
    && device.clientId === clientId
    && device.clientInstanceId === clientInstanceId
    && normalizedSector(device.sector) === sector)) return true;
  const policy = resolveOrganizationRoleLicensePolicy(license.data, sector);
  if (!policy) return false;
  return countActiveOrganizationRoleLicenseDevices(license.devices, sector)
    < resolveOrganizationRoleLicenseMaxDevices(policy, input.defaultMaxDevices);
}
