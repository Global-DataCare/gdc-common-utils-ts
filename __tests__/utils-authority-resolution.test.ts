import {
  authorityResolutionToCatalogRecord,
  buildAuthorityDidWeb,
  buildLegacyAuthorityResolution,
  resolveAuthorityBaseUrl,
} from '../src/utils/authority-resolution';

describe('authority resolution helpers', () => {
  test('builds one authority did:web from one https URL', () => {
    expect(buildAuthorityDidWeb({
      authority: 'https://gw.example.org',
    })).toBe('did:web:gw.example.org');
  });

  test('normalizes base URL from one root authority did:web', () => {
    expect(resolveAuthorityBaseUrl({
      authorityDidWeb: 'did:web:gw.example.org',
    })).toBe('https://gw.example.org/');
  });

  test('builds one legacy authority resolution without requiring host did knowledge in the caller', () => {
    const resolution = buildLegacyAuthorityResolution({
      authorityBaseUrl: 'https://gw.example.org',
      tenantId: 'acme-id',
      jurisdiction: 'ES',
      sector: 'health-care',
      subjectSameAs: 'CARD-724-0000-111-222-333-444',
    });

    expect(resolution.authorityDidWeb).toBe('did:web:gw.example.org');
    expect(resolution.authorityBaseUrl).toBe('https://gw.example.org/');
    expect(resolution.tenantDidWeb).toBe('did:web:gw.example.org:acme-id:cds-ES:v1:health-care');
    expect(resolution.source).toBe('legacy');
    expect(resolution.matchedBy).toBe('subject-same-as');
  });

  test('maps one resolution to one preloadable catalog record', () => {
    const record = authorityResolutionToCatalogRecord(buildLegacyAuthorityResolution({
      authorityDidWeb: 'did:web:gw.example.org',
      tenantId: 'acme-id',
      jurisdiction: 'ES',
      sector: 'health-care',
    }));

    expect(record).toEqual({
      authorityDidWeb: 'did:web:gw.example.org',
      authorityBaseUrl: 'https://gw.example.org/',
      tenantDidWeb: 'did:web:gw.example.org:acme-id:cds-ES:v1:health-care',
      metadataUrl: undefined,
    });
  });
});
