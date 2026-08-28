import { describe, expect, it } from '@jest/globals';
import {
  PostalActivationLicenseStatuses,
  buildOrganizationTestNetworkCredential,
  canonicalizeOrganizationTestNetworkCredential,
  transitionPostalActivationLicense,
  type PostalActivationLicenseBinding,
} from '../src/utils/organization-test-network-credential';

/**
 * Flow contract and teaching goal: Test Network review authorization and later postal-address
 * verification are independent flows. The VC attached to
 * Organization/_transaction is bound to the reviewed application and
 * controller key, never to a postal activation secret.
 */
describe('organization Test Network admission', () => {
  const postalLicense: PostalActivationLicenseBinding = {
    licenseId: 'lic-postal-001',
    applicationId: 'application-dsrc',
    organizationIdentifier: 'DSRC-001',
    controllerEmail: 'developer@dsrc.example',
    controllerKeyMaterial: 'urn:ietf:params:oauth:jwk-thumbprint:sha-256:key',
    postalAddressHash: 'sha256:postal-address',
    protectedCode: {
      algorithm: 'scrypt-v1',
      salt: 'base64url-salt',
      digest: 'base64url-scrypt-digest',
    },
    hostDid: 'did:web:host.example',
    network: 'test-network',
    status: PostalActivationLicenseStatuses.Delivered,
    issuedAt: '2026-08-10T00:00:00.000Z',
    expiresAt: '2026-09-10T00:00:00.000Z',
    deliveredAt: '2026-08-15T00:00:00.000Z',
  };

  it('builds the out-of-band VC from the reviewed application and controller binding', () => {
    const credential = buildOrganizationTestNetworkCredential({
      issuerDid: postalLicense.hostDid,
      subjectDid: 'did:web:host.example:DSRC-001',
      credentialId: 'urn:uuid:authorization-dsrc',
      validFrom: '2026-08-15T00:00:00.000Z',
      validUntil: '2026-09-10T00:00:00.000Z',
      legalName: 'DSRC Example Organization',
      organizationIdentifier: postalLicense.organizationIdentifier,
      controllerEmail: postalLicense.controllerEmail,
      controllerKeyMaterial: postalLicense.controllerKeyMaterial,
      applicationId: postalLicense.applicationId,
      accessPath: 'test-network',
    });

    expect(credential.type).toEqual([
      'VerifiableCredential',
      'OrganizationTestNetworkCredential',
    ]);
    expect(credential.credentialSubject).toMatchObject({
      applicationId: 'application-dsrc',
      organization: { identifier: 'DSRC-001' },
    });
    expect(credential.credentialSubject).not.toHaveProperty('targetNetwork');
    expect(credential.credentialSubject).not.toHaveProperty('postalActivationLicense');
  });

  it('rejects a missing controller key without consulting postal state', () => {
    expect(() => buildOrganizationTestNetworkCredential({
      issuerDid: postalLicense.hostDid,
      subjectDid: 'did:web:host.example:DSRC-001',
      credentialId: 'urn:uuid:authorization-dsrc',
      validFrom: '2026-08-15T00:00:00.000Z',
      validUntil: '2026-09-10T00:00:00.000Z',
      legalName: 'DSRC Example Organization',
      organizationIdentifier: postalLicense.organizationIdentifier,
      controllerEmail: postalLicense.controllerEmail,
      controllerKeyMaterial: '',
      applicationId: postalLicense.applicationId,
      accessPath: 'test-network',
    })).toThrow('controllerKeyMaterial');
  });

  it('preserves delivered state before one final redemption', () => {
    expect(transitionPostalActivationLicense('issued', 'mark_delivered')).toBe('delivered');
    expect(transitionPostalActivationLicense('delivered', 'redeem')).toBe('redeemed');
    expect(() => transitionPostalActivationLicense('redeemed', 'redeem')).toThrow('Invalid');
  });

  it('canonicalizes every proof over the same proof-free payload', () => {
    const base = buildOrganizationTestNetworkCredential({
      issuerDid: postalLicense.hostDid,
      subjectDid: 'did:web:host.example:DSRC-001',
      credentialId: 'urn:uuid:authorization-dsrc',
      validFrom: '2026-08-15T00:00:00.000Z',
      validUntil: '2026-09-10T00:00:00.000Z',
      legalName: 'DSRC Example Organization',
      organizationIdentifier: postalLicense.organizationIdentifier,
      controllerEmail: postalLicense.controllerEmail,
      controllerKeyMaterial: postalLicense.controllerKeyMaterial,
      applicationId: postalLicense.applicationId,
      accessPath: 'test-network',
    });
    const withProof = { ...base, proof: { type: 'JsonWebSignature2020', jws: 'header..signature' } };

    expect(canonicalizeOrganizationTestNetworkCredential(withProof))
      .toBe(canonicalizeOrganizationTestNetworkCredential(base));
  });
});
