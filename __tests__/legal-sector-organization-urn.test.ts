// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.

import {
  buildLegalSectorOrganizationAssetId,
  buildLegalSectorOrganizationUrn,
} from '../src/utils/legal-sector-organization-urn.js';

describe('legal sector organization URN', () => {
  it('builds the governed national organization identifier', () => {
    // Exact serialization is the behavior under test: absent administrative
    // subdivisions remain empty positional fields and the official ID keeps
    // its issuer-defined casing.
    expect(buildLegalSectorOrganizationUrn({
      sector: 'Health-Care',
      country: 'ES',
      identifierType: 'TAX',
      identifierValue: 'VATES-B42215152',
    })).toBe('urn:legal:health-care:es::::organization:tax:VATES-B42215152');
  });

  it('preserves one governed regional subdivision', () => {
    expect(buildLegalSectorOrganizationUrn({
      sector: 'Health-Care',
      country: 'CA',
      administrativeSublevel1: 'CA-BC',
      identifierType: 'BN',
      identifierValue: '123456789',
    })).toBe('urn:legal:health-care:ca:ca-bc:::organization:bn:123456789');
  });

  it('derives a SHA3-256 multibase multihash URN from the canonical sector URN', () => {
    const organizationUrn = buildLegalSectorOrganizationUrn({
      sector: 'Health-Care',
      country: 'ES',
      identifierType: 'TAX',
      identifierValue: 'VATES-B42215152',
    });
    expect(buildLegalSectorOrganizationAssetId(organizationUrn))
      .toBe('urn:multibase:zW1cX5FkaKMZQVzMsL7eim1XRfjdzczsvZvhaX6R9meAxbS');
  });

  it('rejects delimiter injection in governed segments and the official identifier', () => {
    expect(() => buildLegalSectorOrganizationUrn({
      sector: 'health-care:other',
      country: 'ES',
      identifierType: 'TAX',
      identifierValue: 'VATES-B42215152',
    })).toThrow(/sector/i);
    expect(() => buildLegalSectorOrganizationUrn({
      sector: 'health-care',
      country: 'ES',
      identifierType: 'TAX',
      identifierValue: 'VATES:B42215152',
    })).toThrow(/identifierValue/i);
  });
});
