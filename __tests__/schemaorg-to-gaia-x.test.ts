// Flow contract: schema.org remains the internal credential vocabulary. These
// tests protect the deterministic projection into unsigned Gaia-X ICAM 25.11
// credential drafts and the discovery aggregate that transports signed VC-JWTs.

import { ClaimsOrganizationSchemaorg, ClaimsServiceSchemaorg } from '../src/constants/schemaorg';
import {
  buildGaiaXLegalPersonCredentialDraft,
  buildGaiaXServiceOfferingCredentialDraft,
  buildGaiaXParticipantAttachment,
  buildIcaMemberDiscoveryData,
  buildGaiaXLegalPersonProjectionFromOrganizationCredential,
} from '../src/convert/schemaorg-to-gaia-x';
import {
  GaiaXCredentialAttachmentFormat,
  GaiaXCredentialAttachmentRole,
  GaiaXCredentialMediaType,
  type IcaMemberDiscoveryData,
} from '../src/models/gaia-x';

const issuedAt = '2026-07-21T12:00:00.000Z';
const participantDid = 'did:web:provider.example';
const participantCredentialId = 'https://provider.example/.well-known/gaia-x/legal-person.vc';
const registrationCredentialId = 'https://notary.example/credentials/registration/ES-B42215152';

const organizationClaims = {
  [ClaimsOrganizationSchemaorg.legalName]: 'Global Data Care S.L.',
  [ClaimsOrganizationSchemaorg.taxId]: 'VATES-B42215152',
  [ClaimsOrganizationSchemaorg.identifierValue]: 'B42215152',
  [ClaimsOrganizationSchemaorg.addressCountry]: 'ES',
  [ClaimsOrganizationSchemaorg.addressRegion]: 'ES-M',
  [ClaimsOrganizationSchemaorg.url]: 'https://provider.example',
};

describe('schema.org to Gaia-X ICAM 25.11 conversion', () => {
  it('projects the legal entity as gx:LegalPerson without projecting a natural representative', () => {
    const credential = buildGaiaXLegalPersonCredentialDraft({
      claims: organizationClaims,
      credentialId: participantCredentialId,
      subjectId: participantDid,
      issuerId: participantDid,
      legalRegistrationNumberCredentialId: registrationCredentialId,
      validFrom: issuedAt,
    });

    expect(credential).toEqual({
      '@context': ['https://www.w3.org/ns/credentials/v2'],
      type: ['VerifiableCredential', 'LegalPerson'],
      id: participantCredentialId,
      issuer: participantDid,
      validFrom: issuedAt,
      credentialSubject: {
        id: participantDid,
        type: 'gx:LegalPerson',
        'gx:legalName': 'Global Data Care S.L.',
        'gx:legalRegistrationNumber': { id: registrationCredentialId },
        'gx:headquarterAddress': { 'gx:countrySubdivisionCode': 'ES-M' },
        'gx:legalAddress': { 'gx:countrySubdivisionCode': 'ES-M' },
        'gx:website': 'https://provider.example',
      },
    });
    expect(JSON.stringify(credential)).not.toContain('VATES-B42215152');
    expect(JSON.stringify(credential)).not.toContain('LegalRepresentative');
  });

  it('preserves the organization subject id and exposes its jurisdiction-qualified registration source', () => {
    const projection = buildGaiaXLegalPersonProjectionFromOrganizationCredential({
      organizationCredential: {
        '@context': ['https://www.w3.org/ns/credentials/v2', 'https://schema.org'],
        id: 'urn:gdc:organization-credential:1',
        type: ['VerifiableCredential', 'OrganizationCredential'],
        issuer: 'did:web:ica.example',
        validFrom: issuedAt,
        credentialSubject: {
          id: participantDid,
          '@type': 'Organization',
          legalName: 'Global Data Care S.L.',
          url: 'https://provider.example',
          identifier: {
            '@type': 'PropertyValue',
            additionalType: 'VAT',
            value: 'VATES-B42215152',
          },
        },
      },
      issuerId: participantDid,
      legalRegistrationNumberCredentialId: registrationCredentialId,
      addressSubdivisionCode: 'ES-M',
      validFrom: issuedAt,
    });

    expect(projection.sourceCredentialId).toBe('urn:gdc:organization-credential:1');
    expect(projection.registrationIdentifier).toEqual({ additionalType: 'VAT', value: 'VATES-B42215152' });
    expect(projection.credential.id).toBe('urn:gdc:organization-credential:1#gaia-x-legal-person');
    expect(projection.credential.credentialSubject.id).toBe(participantDid);
  });

  it('builds a service offering that references its provider and terms', () => {
    const credential = buildGaiaXServiceOfferingCredentialDraft({
      claims: {
        [ClaimsServiceSchemaorg.name]: 'Health data access',
        [ClaimsServiceSchemaorg.description]: 'Consent-controlled health data service.',
        [ClaimsServiceSchemaorg.url]: 'https://provider.example/api',
      },
      credentialId: 'https://provider.example/.well-known/gaia-x/service-offering.vc',
      subjectId: 'urn:uuid:service-offering-1',
      issuerId: participantDid,
      providedByCredentialId: participantCredentialId,
      termsAndConditionsUrl: 'https://provider.example/terms',
      termsAndConditionsHash: 'sha256:abc123',
      validFrom: issuedAt,
    });

    expect(credential.credentialSubject).toMatchObject({
      type: 'gx:ServiceOffering',
      'gx:providedBy': { id: participantCredentialId },
      'gx:serviceOfferingTermsAndConditions': [{
        'gx:url': 'https://provider.example/terms',
        'gx:hash': 'sha256:abc123',
      }],
      'gx:name': 'Health data access',
      'gx:description': 'Consent-controlled health data service.',
      'gx:endpoint': [{ 'gx:endpointURL': 'https://provider.example/api' }],
    });
  });

  it('places the Gaia-X participant VC-JWT first without duplicating VAT outside schema.org VC', () => {
    const participantAttachment = buildGaiaXParticipantAttachment({
      id: 'participant-vc-jwt',
      jwt: 'header.payload.signature',
    });
    const discovery: IcaMemberDiscoveryData = buildIcaMemberDiscoveryData({
      id: participantDid,
      vc: [{ credentialSubject: { taxID: 'VATES-B42215152' } }],
      did: {
        document: { '@context': 'https://www.w3.org/ns/did/v1', id: participantDid },
        meta: { fetchedAt: issuedAt, sourceUrl: 'https://provider.example/.well-known/did.json' },
      },
      attachments: [participantAttachment],
    });

    expect(discovery.attachments[0]).toEqual({
      id: 'participant-vc-jwt',
      format: GaiaXCredentialAttachmentFormat,
      role: GaiaXCredentialAttachmentRole.Participant,
      media_type: GaiaXCredentialMediaType.VcJwt,
      data: { json: { jwt: 'header.payload.signature' } },
    });
    expect('vat' in discovery).toBe(false);
  });
});
