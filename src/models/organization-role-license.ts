// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import type { DeviceBindingStatus } from '../constants/device';

/** Lifecycle of one organization-owned, role-bearing licence assignment. */
export type OrganizationRoleLicenseStatus = 'active' | 'revoked';

/**
 * Contractual policy for one sector.
 *
 * `sector: ""` is the catch-all policy. An exact sector entry overrides it.
 * `maxDevices: null` delegates the numeric limit to the GW/portal policy; it
 * does not mean an unlimited number of installations.
 */
export interface OrganizationRoleLicenseSectorPolicy {
  sector: string;
  active: boolean;
  maxDevices: number | null;
}

/** One concrete DCR installation registered against the licence. */
export interface OrganizationRoleLicenseDevice {
  clientId: string;
  clientInstanceId: string;
  sector: string;
  host: string;
  status: DeviceBindingStatus;
  activatedAt: number;
  revokedAt?: number;
}

/**
 * Public ledger projection of one licence assigned by an organization.
 *
 * The stable contact is a one-way `urn:multibase:` identifier. Clear email,
 * telephone, tenant-local employee UUIDs, payment details and application
 * permissions must never be written to this asset.
 */
export interface OrganizationRoleLicense {
  id: string;
  organizationId: string;
  jurisdiction: string;
  stableContactIdentifier: string;
  licensedRole: string;
  status: OrganizationRoleLicenseStatus;
  data: OrganizationRoleLicenseSectorPolicy[];
  devices: OrganizationRoleLicenseDevice[];
  createdAt: number;
  updatedAt: number;
  revokedAt?: number;
}

