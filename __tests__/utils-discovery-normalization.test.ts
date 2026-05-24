import {
  normalizeIcaDiscoveryMetadata,
  normalizeNodeOperatorDiscoveryMetadata,
  normalizeServiceProviderEntry,
} from '../src/utils/discovery-normalization';

describe('discovery-normalization utilities', () => {
  it('normalizes ICA metadata into a did resolution result shape', () => {
    const normalized = normalizeIcaDiscoveryMetadata({
      issuer: 'did:web:ica.example.org',
      didDocument: {
        '@context': 'https://www.w3.org/ns/did/v1',
        id: 'did:web:ica.example.org',
        service: [
          { id: '#jwks', type: 'JsonWebKeyService2020', serviceEndpoint: 'https://ica.example.org/jwks.json' },
        ],
      },
      jwks_uri: 'https://ica.example.org/jwks.json',
    });

    expect(normalized.source).toBe('ica');
    expect(normalized.did).toBe('did:web:ica.example.org');
    expect(normalized.jwksUri).toBe('https://ica.example.org/jwks.json');
  });

  it('normalizes service-provider entries and extracts smart token endpoints', () => {
    const normalized = normalizeServiceProviderEntry({
      providerDid: 'did:web:public.acme.org',
      didDocument: {
        '@context': 'https://www.w3.org/ns/did/v1',
        id: 'did:web:public.acme.org',
        service: [
          { id: '#identity:openid:smart:token', type: 'ApiService', serviceEndpoint: 'https://operator.example.net/acme/token' },
        ],
      },
    });

    expect(normalized.source).toBe('service-provider');
    expect(normalized.smartTokenEndpoint).toBe('https://operator.example.net/acme/token');
  });

  it('normalizes node operator metadata even when only issuer-like fields exist', () => {
    const normalized = normalizeNodeOperatorDiscoveryMetadata({
      operatorDid: 'did:web:operator.example.net',
    });

    expect(normalized.source).toBe('node-operator');
    expect(normalized.did).toBe('did:web:operator.example.net');
  });
});
