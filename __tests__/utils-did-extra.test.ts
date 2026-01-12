import {
  buildHostedDidDetails,
  createHostedDidWeb,
  getBaseUrlFromDidWeb,
  normalizeDidWeb,
} from '../src/utils/did.js';

describe('did utilities', () => {
  it('normalizes did:web values and role codes', () => {
    const input = 'did:web:Api.Acme.Org:employee:doctor1@acme.org:role:ISCO-08|2211';
    expect(normalizeDidWeb(input)).toBe('did:web:api.acme.org:employee:doctor1@acme.org:role:isco-08|2211');
  });

  it('creates hosted did:web strings', () => {
    const did = createHostedDidWeb('did:web:host.example.com', 'acme', {
      jurisdiction: 'es',
      version: 'v1',
      sector: 'health-care',
    });
    expect(did).toBe('did:web:host.example.com:acme:cds-es:v1:health-care');
  });

  it('builds hosted DID details with defaults', () => {
    const details = buildHostedDidDetails({ host: 'example.com', alternateName: 'acme' });
    expect(details.did).toBe('did:web:example.com:acme:cds-ES:v1:health-care');
    expect(details.url).toBe('https://example.com/acme/cds-ES/v1/health-care/');
  });

  it('derives base URL from did:web', () => {
    const url = getBaseUrlFromDidWeb('did:web:localhost%3A3000:acme:cds-es:v1:health-care');
    expect(url).toBe('http://localhost:3000/acme/cds-ES/v1/health-care/');
  });
});
