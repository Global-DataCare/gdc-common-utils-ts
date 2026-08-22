// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  buildOrganizationRoleLicenseId,
  buildOrganizationRoleLicensePreimage,
  normalizeOrganizationRoleLicensePolicies,
  organizationRoleLicenseAllowsDevice,
  organizationRoleLicenseAllowsSector,
  resolveOrganizationRoleLicensePolicy,
} from '../src/utils/organization-role-license';
import type { OrganizationRoleLicense } from '../src/models/organization-role-license';
import {
  EXAMPLE_ORGANIZATION_ROLE_LICENSE,
  EXAMPLE_ORGANIZATION_ROLE_LICENSE_IDENTITY,
  EXAMPLE_ORGANIZATION_ROLE_LICENSE_POLICIES,
} from '../src/examples/organization-role-license';
import {
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  EXAMPLE_JURISDICTION,
  EXAMPLE_ORGANIZATION_CONTROLLER_ROLE,
} from '../src/examples/shared';

const stableContactIdentifier = EXAMPLE_ORGANIZATION_ROLE_LICENSE_IDENTITY.stableContactIdentifier;

const identity = {
  jurisdiction: EXAMPLE_JURISDICTION,
  organizationOfficialId: EXAMPLE_ORGANIZATION_ROLE_LICENSE_IDENTITY.organizationOfficialId,
  stableContactIdentifier,
  licensedRole: EXAMPLE_ORGANIZATION_CONTROLLER_ROLE,
} as const;

describe('organization role licence contract', () => {
  it('uses the compact CDS preimage and a deterministic SHA3-384 multihash id', () => {
    expect(buildOrganizationRoleLicensePreimage(identity)).toBe(
      `urn:cds-${EXAMPLE_JURISDICTION.toLowerCase()}:${identity.organizationOfficialId}:${stableContactIdentifier}:${EXAMPLE_ORGANIZATION_CONTROLLER_ROLE}`,
    );
    expect(buildOrganizationRoleLicenseId(identity)).toMatch(/^urn:multibase:z/);
    expect(buildOrganizationRoleLicenseId(identity)).toBe(buildOrganizationRoleLicenseId(identity));
  });

  it('keeps the role in the identity so controller and doctor are distinct seats', () => {
    expect(buildOrganizationRoleLicenseId(identity)).not.toBe(buildOrganizationRoleLicenseId({
      ...identity,
      licensedRole: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
    }));
  });

  it('rejects an organization URN where the official identifier value is required', () => {
    expect(() => buildOrganizationRoleLicensePreimage({
      ...identity,
      organizationOfficialId: `urn:org:tax:${identity.organizationOfficialId}`,
    })).toThrow(/official identifier value/);
  });

  it('normalizes policies and rejects duplicate or invalid device limits', () => {
    expect(normalizeOrganizationRoleLicensePolicies([
      { sector: 'Health-Care', active: true, maxDevices: 5 },
      { sector: '', active: true, maxDevices: null },
    ])).toEqual([
      { sector: 'health-care', active: true, maxDevices: 5 },
      { sector: '', active: true, maxDevices: null },
    ]);
    expect(() => normalizeOrganizationRoleLicensePolicies([
      { sector: '', active: true, maxDevices: null },
      { sector: '', active: false, maxDevices: 2 },
    ])).toThrow(/Duplicate/);
    expect(() => normalizeOrganizationRoleLicensePolicies([
      { sector: '', active: true, maxDevices: 0 },
    ])).toThrow(/positive integer/);
  });

  it('uses an exact sector entry before the catch-all entry', () => {
    const policies = [
      { sector: '', active: true, maxDevices: null },
      { sector: 'animal-care', active: false, maxDevices: 2 },
    ];
    expect(resolveOrganizationRoleLicensePolicy(policies, 'animal-care')).toEqual(policies[1]);
    expect(resolveOrganizationRoleLicensePolicy(policies, 'health-care')).toEqual(policies[0]);
  });

  it('deactivates one sector without revoking the global licence', () => {
    const license = {
      status: 'active',
      data: EXAMPLE_ORGANIZATION_ROLE_LICENSE_POLICIES,
    } as const;
    expect(organizationRoleLicenseAllowsSector(license, 'health-care')).toBe(true);
    expect(organizationRoleLicenseAllowsSector(license, 'animal-care')).toBe(false);
  });

  it('counts installations per sector across hosts and applies the portal default', () => {
    const base = {
      ...EXAMPLE_ORGANIZATION_ROLE_LICENSE,
      data: [{ sector: '', active: true, maxDevices: null }],
      devices: [
        { clientId: 'client-a', clientInstanceId: 'install-a', sector: 'health-care', host: 'https://a.example', status: 'active', activatedAt: 1 },
        { clientId: 'client-b', clientInstanceId: 'install-b', sector: 'health-care', host: 'https://b.example', status: 'active', activatedAt: 2 },
        { clientId: 'client-c', clientInstanceId: 'install-c', sector: 'animal-care', host: 'https://b.example', status: 'active', activatedAt: 3 },
      ],
      updatedAt: 3,
    } satisfies OrganizationRoleLicense;
    expect(organizationRoleLicenseAllowsDevice(base, {
      sector: 'health-care', clientId: 'client-b', clientInstanceId: 'install-b', defaultMaxDevices: 2,
    })).toBe(true);
    expect(organizationRoleLicenseAllowsDevice(base, {
      sector: 'health-care', clientId: 'client-new', clientInstanceId: 'install-new', defaultMaxDevices: 2,
    })).toBe(false);
    expect(organizationRoleLicenseAllowsDevice(base, {
      sector: 'animal-care', clientId: 'client-new', clientInstanceId: 'install-new', defaultMaxDevices: 2,
    })).toBe(true);
  });
});
