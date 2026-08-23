// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import type { DataspaceSector } from '../constants/sectors';

/** Lifecycle of one organization-owned, role-bearing licence assignment. */
export type OrganizationRoleLicenseStatus = 'active' | 'revoked';

/**
 * Contractual policy for one sector.
 *
 * Every entry targets one canonical dataspace sector. Omitting `maxDevices`
 * delegates the numeric limit to the GW/portal policy.
 */
export interface OrganizationRoleLicenseSectorPolicy {
  sector: DataspaceSector;
  active: boolean;
  maxDevices?: number;
}

/**
 * Public ledger projection of one licence assigned by an organization.
 *
 * The stable contact is a one-way `urn:multibase:` identifier. Clear email,
 * telephone, tenant-local employee UUIDs, payment details, DCR registrations,
 * hosts and application permissions must never be written to this asset.
 */
export interface OrganizationRoleLicense {
  id: string;
  /** Official legal identifier value; never an embedded `urn:org:*` identifier. */
  organizationOfficialId: string;
  jurisdiction: string;
  stableContactIdentifier: string;
  licensedRole: string;
  status: OrganizationRoleLicenseStatus;
  data: OrganizationRoleLicenseSectorPolicy[];
  createdAt: number;
  updatedAt: number;
  revokedAt?: number;
}
