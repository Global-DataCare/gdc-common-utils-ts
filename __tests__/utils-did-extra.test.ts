import {
  buildHostedProviderDidWeb,
  buildIndividualDidWeb,
  buildIndividualMemberDidWeb,
  buildHostedDidDetails,
  buildOrganizationDidWeb,
  buildProfessionalDidWeb,
  buildProviderSectorDidWeb,
  createHostedDidWeb,
  extractTenantIdFromHostedDidWeb,
  getBaseUrlFromDidWeb,
  normalizeDidWeb,
  toDidMemberRoleCode,
} from '../src/utils/did.js';
import { HealthcareActorRoles } from '../src/constants/healthcare.js';
import { normalizeSameAsHash } from '../src/utils/same-as.js';

describe('did utilities', () => {
  it('normalizes did:web values and role codes', () => {
    const input = 'did:web:Api.Acme.Org:employee:doctor1@acme.org:role:ISCO-08|2211';
    expect(normalizeDidWeb(input)).toBe('did:web:api.acme.org:employee:doctor1@acme.org:role:isco-08|2211');
  });

  it('restores canonical hosted VAT tenant and jurisdiction casing', () => {
    expect(
      normalizeDidWeb(
        'did:web:GW.EXAMPLE.ORG:vates-g02793479:cds-es:v1:research',
      ),
    ).toBe(
      'did:web:gw.example.org:VATES-G02793479:cds-ES:v1:research',
    );
    expect(
      normalizeDidWeb('did:web:LOCALHOST%3a3000:vates-b00000000:cds-es:v1:health-care'),
    ).toBe('did:web:localhost%3A3000:VATES-B00000000:cds-ES:v1:health-care');
  });

  it('does not uppercase non-VAT tenant path segments', () => {
    expect(
      normalizeDidWeb('did:web:GW.EXAMPLE.ORG:Acme-Tenant:cds-es:v1:Health-Care'),
    ).toBe('did:web:gw.example.org:acme-tenant:cds-ES:v1:Health-Care');
    expect(normalizeDidWeb('urn:example:VATES-G02793479')).toBe(
      'urn:example:VATES-G02793479',
    );
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

  it('extracts the hosted tenant id from a hosted did:web', () => {
    expect(
      extractTenantIdFromHostedDidWeb('did:web:192.0.2.10:VATES-B00000000:cds-ES:v1:health-care'),
    ).toBe('VATES-B00000000');
    expect(extractTenantIdFromHostedDidWeb('did:web:api.example.org')).toBeUndefined();
    expect(extractTenantIdFromHostedDidWeb('did:web:api.example.org:cds-ES:v1:health-care')).toBeUndefined();
  });

  it('builds organization/professional/individual data-space did:web values', () => {
    const organizationDid = buildOrganizationDidWeb({
      hostDidWeb: 'did:web:api.example.org',
      tenantId: 'Acme-TaxID',
      jurisdiction: 'ES',
      sector: 'health-care',
    });
    expect(organizationDid).toBe('did:web:api.example.org:Acme-TaxID:cds-ES:v1:health-care');

    const professionalDid = buildProfessionalDidWeb({
      organizationDidWeb: organizationDid,
      email: 'Doctor@Example.Org',
      role: HealthcareActorRoles.GeneralistMedicalPractitioner,
    });
    expect(professionalDid).toContain(`${organizationDid}:employee:`);
    expect(
      professionalDid.endsWith(
        `:${HealthcareActorRoles.GeneralistMedicalPractitioner}`,
      ),
    ).toBe(true);
    expect(professionalDid).not.toContain('doctor@example.org');
    const sameAsMultibase = normalizeSameAsHash('Doctor@Example.Org').replace(
      'urn:multibase:',
      '',
    );
    const professionalMemberId = professionalDid
      .split(':employee:')[1]
      ?.split(':')[0];
    expect(professionalMemberId).toBe(sameAsMultibase);
    expect(normalizeSameAsHash('Doctor@Example.Org')).toBe(
      `urn:multibase:${professionalMemberId}`,
    );

    const hostedProviderDid = buildHostedProviderDidWeb({
      hostDomain: 'host.example.org',
      sector: 'health-care',
      providerTaxId: 'VATES-B00112233',
    });
    expect(hostedProviderDid).toBe('did:web:host.example.org:health-care:organization:taxid:VATES-B00112233');

    const providerDomainDid = buildProviderSectorDidWeb({
      providerSectorDomain: 'health-care.provider.example.org',
    });
    expect(providerDomainDid).toBe('did:web:health-care.provider.example.org');

    const individualDid = buildIndividualDidWeb({
      providerDidWeb: hostedProviderDid,
      individualId: 'z6MkhYExampleIndividualId',
    });
    expect(individualDid).toBe(
      'did:web:host.example.org:health-care:organization:taxid:VATES-B00112233:individual:multibase:z6MkhYExampleIndividualId',
    );

    const memberDid = buildIndividualMemberDidWeb({
      individualDidWeb: individualDid,
      role: 'v3-RoleCode|RESPRSN',
    });
    expect(memberDid).toBe(
      'did:web:host.example.org:health-care:organization:taxid:VATES-B00112233:individual:multibase:z6MkhYExampleIndividualId:member:role:RESPRSN',
    );
  });

  it('strips coding-system prefixes from member role suffixes', () => {
    expect(toDidMemberRoleCode('v3-RoleCode|RESPRSN')).toBe('RESPRSN');
    expect(toDidMemberRoleCode(HealthcareActorRoles.Physician)).toBe('2211');
    expect(toDidMemberRoleCode('ONESELF')).toBe('ONESELF');
  });
});
