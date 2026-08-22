// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import type { OrganizationRoleLicense } from '../models/organization-role-license';
import { buildStableActorIdentifier, StableActorContactKinds } from '../utils/actor-identifier';
import {
  buildOrganizationRoleLicenseId,
  type OrganizationRoleLicenseIdentity,
} from '../utils/organization-role-license';
import {
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_EMPLOYEE_DEVICE_CLIENT_ID_PRIMARY,
  EXAMPLE_EMPLOYEE_DEVICE_INSTANCE_ID_PRIMARY,
  EXAMPLE_HOST_PUBLIC_HOSTNAME,
  EXAMPLE_JURISDICTION,
  EXAMPLE_LEGAL_ORGANIZATION_TAX_ID,
  EXAMPLE_ORGANIZATION_CONTROLLER_ROLE,
  EXAMPLE_SECTOR,
} from './shared';

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

/** Reusable catch-all plus exact-override policy example. */
export const EXAMPLE_ORGANIZATION_ROLE_LICENSE_POLICIES = Object.freeze([
  Object.freeze({ sector: '', active: true, maxDevices: null }),
  Object.freeze({ sector: 'animal-care', active: false, maxDevices: 2 }),
]);

/** Public ledger fixture: no clear contact or tenant-local employee UUID. */
export const EXAMPLE_ORGANIZATION_ROLE_LICENSE: OrganizationRoleLicense = Object.freeze({
  id: buildOrganizationRoleLicenseId(EXAMPLE_ORGANIZATION_ROLE_LICENSE_IDENTITY),
  ...EXAMPLE_ORGANIZATION_ROLE_LICENSE_IDENTITY,
  status: 'active',
  data: [...EXAMPLE_ORGANIZATION_ROLE_LICENSE_POLICIES],
  devices: [
    Object.freeze({
      clientId: EXAMPLE_EMPLOYEE_DEVICE_CLIENT_ID_PRIMARY,
      clientInstanceId: EXAMPLE_EMPLOYEE_DEVICE_INSTANCE_ID_PRIMARY,
      sector: EXAMPLE_SECTOR,
      host: `https://${EXAMPLE_HOST_PUBLIC_HOSTNAME}`,
      status: 'active',
      activatedAt: 1_700_000_000,
    }),
  ],
  createdAt: 1_700_000_000,
  updatedAt: 1_700_000_000,
});
