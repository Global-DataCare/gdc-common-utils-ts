/**
 * Flow contract: Test Network scope is carried by the signed credential
 * `type[]`; schema.org credential subjects contain only domain properties.
 */
import {
  buildTestNetworkOrganizationCredentialSet,
  canonicalizeTestNetworkOrganizationCredential,
} from '../src/utils/test-network-organization-credentials.js';

const input = {
  issuerDid: 'did:web:review.example',
  organizationDid: 'did:web:host.example:organization:example',
  applicationId: 'application-1',
  validFrom: '2026-08-16T00:00:00.000Z',
  validUntil: '2027-02-16T00:00:00.000Z',
  pdfSha256: 'a'.repeat(64),
  documentVersion: '2026081601',
  legalName: 'EXAMPLE ORGANIZATION INC.',
  organizationIdentifier: '61-2272694',
  identifierType: 'taxID',
  addressCountry: 'US',
  serviceCategory: 'onehealth-research',
  legalRepresentativeEmail: 'legal.representative@example.com',
  legalRepresentativeFullName: 'Example Representative',
  controllerEmail: 'controller@example.com',
  controllerKeyMaterial: 'urn:ietf:params:oauth:jwk-thumbprint:sha-256:example',
} as const;

describe('Test Network organization credential set', () => {
  it('builds the same three credential types as production with Test Network restrictions', () => {
    const [organization, representative, controller] = buildTestNetworkOrganizationCredentialSet(input);
    expect(organization.type).toContain('OrganizationCredential');
    expect(organization.type).toContain('TestNetworkCredential');
    expect(representative.type).toContain('LegalRepresentativeCredential');
    expect(representative.type).toContain('TestNetworkCredential');
    expect(representative.credentialSubject).toMatchObject({
      hasOccupation: { occupationalCategory: 'ISCO-08|1120' },
      memberOf: { taxID: input.organizationIdentifier },
    });
    expect(controller.type).toContain('ServiceControllerCredential');
    expect(controller.type).toContain('TestNetworkCredential');
    expect(controller.credentialSubject).toMatchObject({
      owner: {
        additionalType: 'RESPRSN',
        hasOccupation: { occupationalCategory: 'ISCO-08|1330' },
        hasCredential: { material: input.controllerKeyMaterial },
      },
    });
    expect(organization.credentialSubject).not.toHaveProperty('targetNetwork');
    expect(representative.credentialSubject).not.toHaveProperty('targetNetwork');
    expect(controller.credentialSubject).not.toHaveProperty('targetNetwork');
  });

  it('canonicalizes without proof so the reviewer can add detached signatures', () => {
    const [credential] = buildTestNetworkOrganizationCredentialSet(input);
    const first = canonicalizeTestNetworkOrganizationCredential(credential);
    const second = canonicalizeTestNetworkOrganizationCredential({
      ...credential,
      proof: { type: 'JsonWebSignature2020', jws: 'header..signature' },
    });
    expect(second).toBe(first);
  });
});
