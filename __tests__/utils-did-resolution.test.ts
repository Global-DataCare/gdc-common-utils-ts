import {
  getActorKindFromDid,
  getDidDocumentEndpoint,
  getJwksServiceEndpoint,
  getOrganizationDidFromIndividualDid,
  getProviderDidFromSubjectDid,
  getSmartTokenEndpoint,
  resolveDidDocumentServices,
} from '../src/utils/did-resolution';

describe('did-resolution utilities', () => {
  const didDocument = {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: 'did:web:public.acme.org',
    service: [
      { id: '#did-document', type: 'LinkedDomains', serviceEndpoint: 'https://public.acme.org/.well-known/did.json' },
      { id: '#jwks', type: 'JsonWebKeyService2020', serviceEndpoint: 'https://public.acme.org/jwks.json' },
      { id: '#identity:openid:smart:token', type: 'ApiService', serviceEndpoint: 'https://operator.example.net/acme/token' },
    ],
  };

  it('resolves canonical public and operational endpoints from service[]', () => {
    const services = resolveDidDocumentServices(didDocument as any);
    expect(services).toHaveLength(3);
    expect(getDidDocumentEndpoint(didDocument as any)).toBe('https://public.acme.org/.well-known/did.json');
    expect(getJwksServiceEndpoint(didDocument as any)).toBe('https://public.acme.org/jwks.json');
    expect(getSmartTokenEndpoint(didDocument as any)).toBe('https://operator.example.net/acme/token');
  });

  it('derives organization/provider did from member did shapes', () => {
    const familyDid = 'did:web:host.example.org:acme:cds-es:v1:health-care:family:subject-001:v3-RoleCode|ONESELF';
    const employeeDid = 'did:web:host.example.org:acme:cds-es:v1:health-care:employee:member-001:RESPRSN';
    expect(getOrganizationDidFromIndividualDid(familyDid)).toBe('did:web:host.example.org:acme:cds-es:v1:health-care');
    expect(getProviderDidFromSubjectDid(employeeDid)).toBe('did:web:host.example.org:acme:cds-es:v1:health-care');
  });

  it('infers actor kind heuristically from did shape', () => {
    expect(getActorKindFromDid('did:web:host.example.org:acme:cds-es:v1:health-care:employee:member-001:RESPRSN')).toBe('organization_controller');
    expect(getActorKindFromDid('did:web:host.example.org:acme:cds-es:v1:health-care:family:subject-001:v3-RoleCode|ONESELF')).toBe('individual_controller');
    expect(getActorKindFromDid('did:web:host.example.org:acme:cds-es:v1:health-care:family:subject-001:NMTH')).toBe('individual_member');
  });
});
