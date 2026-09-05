// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
import {
  buildSecureIdValueIndividual,
  buildSecureIdValueMember,
  buildHostedProviderDidWeb,
  buildIndividualDidWeb,
  buildIndividualMemberDidWeb,
  buildIndividualMemberDidWebFromPrivateIdentifiers,
  buildHostedDidDetails,
  buildOrganizationDidWeb,
  buildProfessionalDidWeb,
  buildProviderSectorDidWeb,
  createHostedDidWeb,
  extractTenantIdFromHostedDidWeb,
  getBaseUrlFromDidWeb,
  normalizeDidWeb,
  parseIndividualMemberDidWeb,
  toDidMemberRoleCode,
} from '../src/utils/did.js';
import { SecureIdTypesIndividual } from '../src/constants/identity-identifiers.js';
import { HealthcareActorRoles } from '../src/constants/healthcare.js';
import { normalizeSameAsHash } from '../src/utils/same-as.js';

describe('did utilities', () => {
  it('hashes private individual identifiers as SHA3-384 multihashes before DID construction', () => {
    // Exact serialization vectors: these literals are the behavior under test.
    expect(buildSecureIdValueIndividual({
      secureIdTypeIndividual: SecureIdTypesIndividual.Uuid,
      privateIdValueIndividual: 'a87e5b15-aea4-4475-9c7c-40aa88354b6f',
    })).toBe('zG9H82pae9SCXvec3D4YKqhX8bj8F1mRgzxMEdwXXonT7BWsvsUiP2u52sWQTeESpoMee');
    expect(buildSecureIdValueIndividual({
      secureIdTypeIndividual: SecureIdTypesIndividual.Email,
      privateIdValueIndividual: ' Controller@Example.ORG ',
    })).toBe('zG9DrMLpQW8eoCc9Ay9AFxuMGiswgJePpbUMz9svJCZ8tKjUd4xoExgCPA5jmHc6hPATJ');
    expect(buildSecureIdValueIndividual({
      secureIdTypeIndividual: SecureIdTypesIndividual.Phone,
      privateIdValueIndividual: 'tel:+34 600 123 456',
    })).toBe('zG9HJcrDrWojdcjTntBWPeAvERP6sExFDEumqTu6jVMgVCg9oLD3d1kq6NpF4hYEqab6F');
  });

  it('rejects malformed UUIDs instead of hashing their text representation', () => {
    expect(() => buildSecureIdValueIndividual({
      secureIdTypeIndividual: SecureIdTypesIndividual.Uuid,
      privateIdValueIndividual: 'not-a-uuid',
    })).toThrow(/UUID/i);
  });

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

  it('derives an HTTP base URL for an encoded IPv4 loopback authority', () => {
    const url = getBaseUrlFromDidWeb('did:web:127.0.0.1%3A3300:704457077:cds-CA-BC:v1:animal-care');
    expect(url).toBe('http://127.0.0.1:3300/704457077/cds-CA-BC/v1/animal-care/');
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

    const secureIdValueIndividual = buildSecureIdValueIndividual({
      secureIdTypeIndividual: SecureIdTypesIndividual.Uuid,
      privateIdValueIndividual: 'a87e5b15-aea4-4475-9c7c-40aa88354b6f',
    });
    const individualDid = buildIndividualDidWeb({
      providerDidWeb: hostedProviderDid,
      secureIdTypeIndividual: SecureIdTypesIndividual.Uuid,
      secureIdValueIndividual,
    });
    expect(individualDid).toBe(
      `did:web:host.example.org:health-care:organization:taxid:VATES-B00112233:individual:UUID:${secureIdValueIndividual}`,
    );

    const memberDid = buildIndividualMemberDidWeb({
      individualDidWeb: individualDid,
      memberId: buildSecureIdValueMember({
        secureIdTypeMember: SecureIdTypesIndividual.Email,
        privateIdValueMember: 'controller@example.org',
      }),
      roleType: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode',
      roleValue: 'RESPRSN',
    });
    expect(memberDid).toBe(
      `did:web:host.example.org:health-care:organization:taxid:VATES-B00112233:individual:UUID:${secureIdValueIndividual}:member:zG9DrMLpQW8eoCc9Ay9AFxuMGiswgJePpbUMz9svJCZ8tKjUd4xoExgCPA5jmHc6hPATJ:RESPRSN`,
    );
    expect(parseIndividualMemberDidWeb(memberDid)).toEqual({
      individualDidWeb: individualDid,
      memberId: 'zG9DrMLpQW8eoCc9Ay9AFxuMGiswgJePpbUMz9svJCZ8tKjUd4xoExgCPA5jmHc6hPATJ',
      roleValue: 'RESPRSN',
    });
    expect(buildIndividualMemberDidWebFromPrivateIdentifiers({
      providerDidWeb: hostedProviderDid,
      secureIdTypeIndividual: SecureIdTypesIndividual.Uuid,
      privateIdValueIndividual: 'a87e5b15-aea4-4475-9c7c-40aa88354b6f',
      secureIdTypeMember: SecureIdTypesIndividual.Email,
      privateIdValueMember: 'controller@example.org',
      roleType: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode',
      roleValue: 'RESPRSN',
    })).toBe(memberDid);
  });

  it('rejects the legacy family actor path as an individual member DID', () => {
    expect(() => parseIndividualMemberDidWeb(
      'did:web:host.example.org:individual:UUID:zSecure:family:zMember:RESPRSN',
    )).toThrow(/member DID/i);
  });

  it('strips coding-system prefixes from member role suffixes', () => {
    expect(toDidMemberRoleCode('v3-RoleCode|RESPRSN')).toBe('RESPRSN');
    expect(toDidMemberRoleCode(HealthcareActorRoles.Physician)).toBe('2211');
    expect(toDidMemberRoleCode('ONESELF')).toBe('ONESELF');
  });
});
