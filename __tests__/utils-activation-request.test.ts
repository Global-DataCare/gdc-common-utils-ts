import {
  ClaimsPersonSchemaorg,
  buildControllerBindingInput,
  buildOrganizationBindingInput,
  buildOrganizationActivationRequest,
  normalizeSameAsHash,
  validateOrganizationActivationRequest,
} from '../src';

describe('activation-request utilities', () => {
  it('builds canonical activation payload with vp_token first and controller binding second', () => {
    const payload = buildOrganizationActivationRequest({
      vpToken: 'header.payload.signature',
      controller: buildControllerBindingInput({
        did: 'did:web:people.example.org:controllers:primary',
        publicSignKey: {
          kid: 'controller-sig-001',
          kty: 'EC',
          crv: 'P-384',
          x: 'x',
          y: 'y',
          alg: 'ES384',
          use: 'sig',
        },
      }),
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
    const controllerSameAs = normalizeSameAsHash('controller@example.org');
    const validation = validateOrganizationActivationRequest({
      vp_token: 'header.payload.signature',
      controller: {
        did: 'did:web:people.example.org:controllers:primary',
        sameAs: controllerSameAs,
      },
    });

    expect(validation.ok).toBe(false);
    expect(validation.errors[0]?.code).toBe('incomplete-controller-binding');
  });

  it('maps semantic controller variables to canonical controller binding fields', () => {
    const controllerSameAs = normalizeSameAsHash('controller@example.org');
    const binding = buildControllerBindingInput({
      did: 'did:web:people.example.org:controllers:primary',
      sameAs: controllerSameAs,
      publicSignKey: { kid: 'sig-1', kty: 'EC' },
      publicKeys: [{ kid: 'enc-1', kty: 'EC', use: 'enc' }],
    });

    expect(binding.did).toBe('did:web:people.example.org:controllers:primary');
    expect(binding.sameAs).toBe(controllerSameAs);
    expect(binding.publicKeyJwk).toEqual({ kid: 'sig-1', kty: 'EC' });
    expect(binding.jwks?.keys).toEqual([{ kid: 'enc-1', kty: 'EC', use: 'enc' }]);
  });

  it('maps semantic organization variables to canonical organization binding fields', () => {
    const binding = buildOrganizationBindingInput({
      did: 'did:web:provider.example.org',
      url: 'https://provider.example.org',
      publicSignKey: { kid: 'org-sig-1', kty: 'EC' },
      publicKeys: { keys: [{ kid: 'org-enc-1', kty: 'EC', use: 'enc' }] },
    });

    expect(binding.did).toBe('did:web:provider.example.org');
    expect(binding.url).toBe('https://provider.example.org');
    expect(binding.publicKeyJwk).toEqual({ kid: 'org-sig-1', kty: 'EC' });
    expect(binding.jwks?.keys).toEqual([{ kid: 'org-enc-1', kty: 'EC', use: 'enc' }]);
  });

  it('documents the BFF activation pattern when ICA VC/PDF did not include representative sameAs/email', () => {
    const controllerEmail = 'controller@example.org';
    const controllerSameAs = normalizeSameAsHash(controllerEmail);

    const payload = buildOrganizationActivationRequest({
      vpToken: 'header.payload.signature',
      controller: buildControllerBindingInput({
        sameAs: controllerSameAs,
        publicSignKey: { kid: 'sig-1', kty: 'EC' },
      }),
      data: [
        {
          type: 'Organization-activation-request-v1.0',
          meta: {
            claims: {
              '@context': 'org.schema',
              [ClaimsPersonSchemaorg.email]: controllerEmail,
            },
          },
        },
      ],
    });

    // BFF rule:
    // - pass controller.sameAs already normalized for ICA/GW interoperability
    // - keep the raw email in claims when GW must bootstrap the internal admin
    //   profile even if the ICA VC/PDF omitted that contact value
    // - this fallback is only for demo/local bootstrap; production should send
    //   `person.email` in the signed ICA PDF annex so the VC itself carries the
    //   canonical representative sameAs
    const claims = ((payload.data?.[0] as any)?.meta?.claims || {}) as Record<string, unknown>;
    expect(payload.controller?.sameAs).toBe(controllerSameAs);
    expect(claims[ClaimsPersonSchemaorg.email]).toBe(controllerEmail);
  });
});
