import {
  buildOrganizationActivationRequest,
  validateOrganizationActivationRequest,
} from '../src/utils/activation-request';

describe('activation-request utilities', () => {
  it('builds canonical activation payload with vp_token first and controller binding second', () => {
    const payload = buildOrganizationActivationRequest({
      vpToken: 'header.payload.signature',
      controller: {
        did: 'did:web:people.example.org:controllers:primary',
        publicKeyJwk: {
          kid: 'controller-sig-001',
          kty: 'EC',
          crv: 'P-384',
          x: 'x',
          y: 'y',
          alg: 'ES384',
          use: 'sig',
        },
      },
    });

    expect(payload.vp_token).toBe('header.payload.signature');
    expect(payload.controller?.did).toBe('did:web:people.example.org:controllers:primary');
    expect(payload.organizationCredential).toBeUndefined();
  });

  it('warns on deprecated legacy credential side-fields and errors on missing vp_token', () => {
    const validation = validateOrganizationActivationRequest({
      organizationCredential: { id: 'legacy-org' },
      representativeCredential: { id: 'legacy-rep' },
    });

    expect(validation.ok).toBe(false);
    expect(validation.errors.map((issue) => issue.code)).toContain('missing-vp-token');
    expect(validation.warnings.map((issue) => issue.code)).toEqual([
      'deprecated-organization-credential',
      'deprecated-representative-credential',
    ]);
  });

  it('rejects incomplete controller binding when did/sameAs is present without public key material', () => {
    const validation = validateOrganizationActivationRequest({
      vp_token: 'header.payload.signature',
      controller: {
        did: 'did:web:people.example.org:controllers:primary',
        sameAs: 'mailto:controller@example.org',
      },
    });

    expect(validation.ok).toBe(false);
    expect(validation.errors[0]?.code).toBe('incomplete-controller-binding');
  });
});
