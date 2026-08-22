// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import type { OrganizationRoleLicense } from '../models/organization-role-license';
import { buildStableActorIdentifier } from '../utils/actor-identifier';
import {
  buildOrganizationRoleLicenseId,
  type OrganizationRoleLicenseIdentity,
} from '../utils/organization-role-license';

/** Reusable synthetic identity for role-licence contract and consumer tests. */
export const EXAMPLE_ORGANIZATION_ROLE_LICENSE_IDENTITY: OrganizationRoleLicenseIdentity = Object.freeze({
  jurisdiction: 'es',
  organizationId: 'urn:org:TAX:ES-B12345678',
  stableContactIdentifier: buildStableActorIdentifier({
    contactKind: 'email',
    contact: 'professional@example.org',
  }),
  licensedRole: 'RESPRSN',
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
      clientId: 'example-client-health-1',
      clientInstanceId: 'example-installation-health-1',
      sector: 'health-care',
      host: 'https://gw.example.org',
      status: 'active',
      activatedAt: 1_700_000_000,
    }),
  ],
  createdAt: 1_700_000_000,
  updatedAt: 1_700_000_000,
});

