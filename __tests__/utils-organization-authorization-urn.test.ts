import { describe, expect, it } from '@jest/globals';

import { ClaimsOrganizationSchemaorg } from '../src/constants/schemaorg.js';
import {
  buildMemberAuthorizationUrn,
  buildOrganizationAuthorizationUrn,
  buildOrganizationAuthorizationUrnCds,
  buildOrganizationAuthorizationUrnFromClaims,
  buildOrganizationMemberAuthorizationUrnCds,
  normalizeOrganizationAuthorizationUrn,
} from '../src/utils/organization-authorization-urn.js';

describe('organization authorization URN utilities', () => {
  it('builds jurisdictional versioned CDS organization and member paths', () => {
    // Flow contract: legal organizations and licensed members share a stable
    // CDS hierarchy without depending on a resolvable did:web host.
    const organizationUrn = buildOrganizationAuthorizationUrnCds({
      jurisdiction: 'ES',
      version: 'v1',
      identifierType: 'TAX',
      identifierValue: 'ES-B00112233',
    });
    expect(organizationUrn).toBe('urn:cds-es:v1:organization:tax:ES-B00112233');
    expect(buildOrganizationMemberAuthorizationUrnCds({
      organizationUrn,
      memberId: 'zG9FEVaXcQgzppJZUe7WwnqbM1mqTLbktoPSbPvMj2T6fj121vncQCbKyqh4BTYtSh2Tj',
      roleType: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode',
      roleValue: 'RESPRSN',
    })).toBe(
      'urn:cds-es:v1:organization:tax:ES-B00112233:member:zG9FEVaXcQgzppJZUe7WwnqbM1mqTLbktoPSbPvMj2T6fj121vncQCbKyqh4BTYtSh2Tj:RESPRSN',
    );
  });

  it.each([
    ['CA-BC', 'BN', 'BC-1234567', 'urn:cds-ca-bc:v1:organization:bn:BC-1234567'],
    ['US', 'EIN', '12-3456789', 'urn:cds-us:v1:organization:ein:12-3456789'],
    ['US-WA', 'UBI', '604123456', 'urn:cds-us-wa:v1:organization:ubi:604123456'],
  ])('keeps %s as the authority for its %s identifier space', (
    jurisdiction,
    identifierType,
    identifierValue,
    expected,
  ) => {
    expect(buildOrganizationAuthorizationUrnCds({
      jurisdiction,
      identifierType,
      identifierValue,
    })).toBe(expected);
  });

  it('builds the canonical organization authorization URN from identifier claims', () => {
    expect(buildOrganizationAuthorizationUrn({
      identifierType: 'TAX',
      identifierValue: 'VATES-B12345678',
    })).toBe('urn:org:tax:VATES-B12345678');
  });

  it('normalizes legacy TYPE|VALUE organization ids to the canonical URN', () => {
    expect(normalizeOrganizationAuthorizationUrn('TAX|VATES-B12345678'))
      .toBe('urn:org:tax:VATES-B12345678');
    expect(normalizeOrganizationAuthorizationUrn('urn:org:tax:VATES-B12345678'))
      .toBe('urn:org:tax:VATES-B12345678');
  });

  it('builds the canonical member authorization URN rooted in the organization URN', () => {
    expect(buildMemberAuthorizationUrn({
      organizationUrn: 'TAX|VATES-B12345678',
      memberId: '123e4567-e89b-12d3-a456-426614174000',
      roleCode: 'ISCO-08|2211',
    })).toBe(
      'urn:org:tax:VATES-B12345678:member:123e4567-e89b-12d3-a456-426614174000',
    );
  });

  it('derives the canonical organization authorization URN directly from schema.org claims', () => {
    expect(buildOrganizationAuthorizationUrnFromClaims({
      [ClaimsOrganizationSchemaorg.identifierType]: 'TAX',
      [ClaimsOrganizationSchemaorg.identifierValue]: 'acme-id',
    })).toBe('urn:org:tax:acme-id');
  });
});
