// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  buildOrganizationRoleLicenseId,
  buildOrganizationRoleLicensePreimage,
  normalizeOrganizationRoleLicensePolicies,
  organizationRoleLicenseAllowsSector,
  resolveOrganizationRoleLicensePolicy,
} from '../src/utils/organization-role-license';
import {
  EXAMPLE_ORGANIZATION_ROLE_LICENSE_IDENTITY,
  EXAMPLE_ORGANIZATION_ROLE_LICENSE_POLICIES,
} from '../src/examples/organization-role-license';
import {
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  EXAMPLE_JURISDICTION,
  EXAMPLE_ORGANIZATION_CONTROLLER_ROLE,
} from '../src/examples/shared';
import { DataspaceSectors } from '../src/constants/sectors';

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
      { sector: DataspaceSectors.HealthCare, active: true, maxDevices: 5 },
      { sector: DataspaceSectors.OneHealthResearch, active: true },
    ])).toEqual([
      { sector: DataspaceSectors.HealthCare, active: true, maxDevices: 5 },
      { sector: DataspaceSectors.OneHealthResearch, active: true },
    ]);
    expect(() => normalizeOrganizationRoleLicensePolicies([
      { sector: DataspaceSectors.AnimalCare, active: true },
      { sector: DataspaceSectors.AnimalCare, active: false, maxDevices: 2 },
    ])).toThrow(/Duplicate/);
    expect(() => normalizeOrganizationRoleLicensePolicies([
      { sector: DataspaceSectors.HealthCare, active: true, maxDevices: 0 },
    ])).toThrow(/positive integer/);
    expect(() => normalizeOrganizationRoleLicensePolicies([
      { sector: '' as any, active: true },
    ])).toThrow(/requires a canonical sector/);
  });

  it('resolves only an exact canonical sector entry', () => {
    const policies = [
      { sector: DataspaceSectors.OneHealthResearch, active: true },
      { sector: DataspaceSectors.AnimalCare, active: false, maxDevices: 2 },
    ] as const;
    expect(resolveOrganizationRoleLicensePolicy(policies, DataspaceSectors.AnimalCare)).toEqual(policies[1]);
    expect(resolveOrganizationRoleLicensePolicy(policies, DataspaceSectors.HealthCare)).toBeUndefined();
  });

  it('deactivates one sector without revoking the global licence', () => {
    const license = {
      status: 'active',
      data: EXAMPLE_ORGANIZATION_ROLE_LICENSE_POLICIES,
    } as const;
    expect(organizationRoleLicenseAllowsSector(license, DataspaceSectors.OneHealthResearch)).toBe(true);
    expect(organizationRoleLicenseAllowsSector(license, DataspaceSectors.AnimalCare)).toBe(false);
  });

});
