// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import type { OrganizationRoleLicense } from '../models/organization-role-license';
import { buildStableActorIdentifier, StableActorContactKinds } from '../utils/actor-identifier';
import {
  buildOrganizationRoleLicenseId,
  DEFAULT_ORGANIZATION_ROLE_LICENSE_POLICY,
  type OrganizationRoleLicenseIdentity,
} from '../utils/organization-role-license';
import {
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_JURISDICTION,
  EXAMPLE_LEGAL_ORGANIZATION_TAX_ID,
  EXAMPLE_ORGANIZATION_CONTROLLER_ROLE,
} from './shared';
import { DataspaceSectors } from '../constants/sectors';

/** Reusable synthetic identity for role-licence contract and consumer tests. */
export const EXAMPLE_ORGANIZATION_ROLE_LICENSE_IDENTITY: OrganizationRoleLicenseIdentity = Object.freeze({
  jurisdiction: EXAMPLE_JURISDICTION,
  organizationOfficialId: EXAMPLE_LEGAL_ORGANIZATION_TAX_ID,
  stableContactIdentifier: buildStableActorIdentifier({
    contactKind: StableActorContactKinds.Email,
    contact: EXAMPLE_EMAIL_PROFESSIONAL,
  }),
  licensedRole: EXAMPLE_ORGANIZATION_CONTROLLER_ROLE,
});

/** Reusable exact-sector policies; no empty-sector wildcard is authored. */
export const EXAMPLE_ORGANIZATION_ROLE_LICENSE_POLICIES = Object.freeze([
  DEFAULT_ORGANIZATION_ROLE_LICENSE_POLICY,
  Object.freeze({ sector: DataspaceSectors.AnimalCare, active: false, maxDevices: 2 }),
]);

/** Public ledger fixture: no clear contact or tenant-local employee UUID. */
export const EXAMPLE_ORGANIZATION_ROLE_LICENSE: OrganizationRoleLicense = Object.freeze({
  id: buildOrganizationRoleLicenseId(EXAMPLE_ORGANIZATION_ROLE_LICENSE_IDENTITY),
  ...EXAMPLE_ORGANIZATION_ROLE_LICENSE_IDENTITY,
  status: 'active',
  data: [...EXAMPLE_ORGANIZATION_ROLE_LICENSE_POLICIES],
  createdAt: 1_700_000_000,
  updatedAt: 1_700_000_000,
});
