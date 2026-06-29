import { describe, expect, it } from '@jest/globals';

import { ClaimsOrganizationSchemaorg } from '../src/constants/schemaorg.js';
import {
  buildMemberAuthorizationUrn,
  buildOrganizationAuthorizationUrn,
  buildOrganizationAuthorizationUrnFromClaims,
  normalizeOrganizationAuthorizationUrn,
} from '../src/utils/organization-authorization-urn.js';

describe('organization authorization URN utilities', () => {
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
