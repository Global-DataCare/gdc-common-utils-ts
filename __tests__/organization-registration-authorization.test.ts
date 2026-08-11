import { describe, expect, it } from '@jest/globals';
import {
  PostalActivationLicenseStatuses,
  buildOrganizationRegistrationAuthorizationCredential,
  canonicalizeOrganizationRegistrationAuthorizationCredential,
  transitionPostalActivationLicense,
  type PostalActivationLicenseBinding,
} from '../src/utils/organization-registration-authorization';

/**
 * Flow contract: a postal activation code proves delivery before an authorized
 * host employee can issue the VC later attached to Organization/_transaction.
 * Confirmation does not consume the code; `_exchange` redemption does.
 */
describe('organization registration authorization', () => {
  const postalLicense: PostalActivationLicenseBinding = {
    licenseId: 'lic-postal-001',
    applicationId: 'application-dsrc',
    organizationIdentifier: 'DSRC-001',
    controllerEmail: 'developer@dsrc.example',
    controllerKeyMaterial: 'urn:ietf:params:oauth:jwk-thumbprint:sha-256:key',
    postalAddressHash: 'sha256:postal-address',
    hostDid: 'did:web:host.example',
    network: 'test-network',
    status: PostalActivationLicenseStatuses.Delivered,
    issuedAt: '2026-08-10T00:00:00.000Z',
    expiresAt: '2026-09-10T00:00:00.000Z',
    deliveredAt: '2026-08-15T00:00:00.000Z',
  };

  it('builds the out-of-band VC only from a matching delivery-confirmed licence', () => {
    const credential = buildOrganizationRegistrationAuthorizationCredential({
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
      targetNetwork: 'test-network',
      postalLicense,
    });

    expect(credential.type).toEqual([
      'VerifiableCredential',
      'OrganizationRegistrationAuthorizationCredential',
    ]);
    expect(credential.credentialSubject).toMatchObject({
      applicationId: 'application-dsrc',
      organization: { identifier: 'DSRC-001' },
      postalActivationLicense: {
        id: 'lic-postal-001',
        status: 'delivered',
      },
    });
  });

  it('rejects a mismatched or not-yet-delivered postal licence', () => {
    expect(() => buildOrganizationRegistrationAuthorizationCredential({
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
      targetNetwork: 'test-network',
      postalLicense: { ...postalLicense, status: PostalActivationLicenseStatuses.Issued },
    })).toThrow('delivered postal activation licence');
  });

  it('preserves delivered state before one final redemption', () => {
    expect(transitionPostalActivationLicense('issued', 'mark_delivered')).toBe('delivered');
    expect(transitionPostalActivationLicense('delivered', 'redeem')).toBe('redeemed');
    expect(() => transitionPostalActivationLicense('redeemed', 'redeem')).toThrow('Invalid');
  });

  it('canonicalizes every proof over the same proof-free payload', () => {
    const base = buildOrganizationRegistrationAuthorizationCredential({
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
      targetNetwork: 'test-network',
      postalLicense,
    });
    const withProof = { ...base, proof: { type: 'JsonWebSignature2020', jws: 'header..signature' } };

    expect(canonicalizeOrganizationRegistrationAuthorizationCredential(withProof))
      .toBe(canonicalizeOrganizationRegistrationAuthorizationCredential(base));
  });
});
