// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.
import { describe, expect, it } from '@jest/globals';
import {
  ActivationCredentialTypes,
  W3cCredentialTypes,
} from '../src/constants/verifiable-credentials.js';
import {
  EXAMPLE_ICA_ACTIVATION_VP_PAYLOAD,
  EXAMPLE_ICA_LEGAL_REPRESENTATIVE_CREDENTIAL,
  EXAMPLE_ICA_ORGANIZATION_CREDENTIAL,
  EXAMPLE_ICA_ORGANIZATION_DID,
  EXAMPLE_ICA_ORGANIZATION_TAX_ID,
  EXAMPLE_ICA_REPRESENTATIVE_DID,
  EXAMPLE_ICA_VP_ISSUER_DID,
} from '../src/examples/ica-activation-proof.js';
import {
  addVC,
  addVCs,
  addLegalRepresentativeCredential,
  addOrganizationCredential,
  buildEpochWindow,
  buildVpTokenCompact,
  createVP,
  getLegalRepresentativeCredentialFromVpToken,
  getOrganizationCredentialFromVpToken,
  getVpCredentials,
  generateUuidLike,
  prepareBytesForSignature,
  prepareForSignature,
} from '../src/utils/vp-token.js';

function vcJwt(type: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    type: [W3cCredentialTypes.VerifiableCredential, type],
    credentialSubject: { id: 'did:web:subject.example.org' },
  })).toString('base64url');
  return `${header}.${payload}.sig`;
}

describe('vp token utilities', () => {
  // This suite must reuse shared synthetic VP/VC fixtures and credential-type
  // constants. Do not re-hardcode issuer DIDs or activation VC subtype names
  // inline in each test case.
  it('creates vp payload and appends vcs', () => {
    const vp = createVP({ iss: EXAMPLE_ICA_VP_ISSUER_DID });
    addVC(vp, 'eyJ.vc1.sig');
    addVC(vp, 'eyJ.vc2.sig');
    expect(vp.vp.verifiableCredential).toEqual(['eyJ.vc1.sig', 'eyJ.vc2.sig']);
  });

  it('prepares base64url header.payload for external signing', () => {
    const header = { alg: 'ES256', typ: 'JWT', kid: 'did:web:example.com#k1' };
    const vp = createVP({ iss: EXAMPLE_ICA_VP_ISSUER_DID });
    addVC(vp, 'eyJ.vc1.sig');
    const prepared = prepareForSignature(header, vp);
    expect(prepared.encodedHeader.length).toBeGreaterThan(10);
    expect(prepared.encodedPayload.length).toBeGreaterThan(10);
    expect(prepared.signingInput).toContain('.');
    expect(prepared.signingInput.split('.')).toHaveLength(2);
  });

  it('returns deterministic bytes for signing input', () => {
    const header = { alg: 'ES256', typ: 'JWT' };
    const vp = createVP({ iss: EXAMPLE_ICA_VP_ISSUER_DID });
    const a = prepareBytesForSignature(header, vp);
    const b = prepareBytesForSignature(header, vp);
    expect(Array.from(a)).toEqual(Array.from(b));
  });

  it('builds compact vp token with external signature', () => {
    const token = buildVpTokenCompact('aaa', 'bbb', 'ccc');
    expect(token).toBe('aaa.bbb.ccc');
  });

  it('creates defaults for jti/nonce/iat/exp', () => {
    const vp = createVP({ iss: EXAMPLE_ICA_VP_ISSUER_DID });
    expect(typeof vp.jti).toBe('string');
    expect(typeof vp.nonce).toBe('string');
    expect(typeof vp.iat).toBe('number');
    expect(typeof vp.exp).toBe('number');
    expect((vp.exp as number) > (vp.iat as number)).toBe(true);
  });

  it('builds epoch window and id helpers', () => {
    const w = buildEpochWindow(120);
    expect(w.exp - w.iat).toBe(120);
    expect(typeof generateUuidLike()).toBe('string');
  });

  it('adds one or many vc entries via addVCs', () => {
    const vp = createVP({ iss: EXAMPLE_ICA_VP_ISSUER_DID });
    addVCs(vp, [
      vcJwt(ActivationCredentialTypes.OrganizationCredential),
      vcJwt(ActivationCredentialTypes.LegalRepresentativeCredential),
    ]);
    expect(vp.vp.verifiableCredential).toHaveLength(2);
  });

  it('validates organization credential type', () => {
    const vp = createVP({ iss: EXAMPLE_ICA_VP_ISSUER_DID });
    addOrganizationCredential(vp, vcJwt(ActivationCredentialTypes.OrganizationCredential));
    expect(vp.vp.verifiableCredential).toHaveLength(1);
    expect(() => addOrganizationCredential(vp, vcJwt(ActivationCredentialTypes.LegalRepresentativeCredential))).toThrow(
      /Organization VC must include one of types/,
    );
  });

  it('validates representative credential type', () => {
    const vp = createVP({ iss: EXAMPLE_ICA_VP_ISSUER_DID });
    addLegalRepresentativeCredential(vp, vcJwt(ActivationCredentialTypes.LegalRepresentativeCredential));
    expect(vp.vp.verifiableCredential).toHaveLength(1);
    expect(() => addLegalRepresentativeCredential(vp, vcJwt(ActivationCredentialTypes.OrganizationCredential))).toThrow(
      /LegalRepresentative VC must include one of types/,
    );
  });

  it('extracts organization and legal representative credentials from a VP token', () => {
    const vp = createVP({
      iss: EXAMPLE_ICA_VP_ISSUER_DID,
      vp: {
        verifiableCredential: [
          JSON.stringify(EXAMPLE_ICA_ORGANIZATION_CREDENTIAL),
          JSON.stringify(EXAMPLE_ICA_LEGAL_REPRESENTATIVE_CREDENTIAL),
        ],
      },
    });
    const compact = buildVpTokenCompact(
      Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url'),
      Buffer.from(JSON.stringify(vp)).toString('base64url'),
      'sig',
    );

    expect(getVpCredentials(compact)).toHaveLength(2);
    expect(getOrganizationCredentialFromVpToken(compact)?.credentialSubject).toMatchObject({
      id: EXAMPLE_ICA_ORGANIZATION_DID,
      taxID: EXAMPLE_ICA_ORGANIZATION_TAX_ID,
    });
    expect(getLegalRepresentativeCredentialFromVpToken(compact)?.credentialSubject).toMatchObject({
      id: EXAMPLE_ICA_REPRESENTATIVE_DID,
    });
  });

  it('keeps the shared synthetic ICA activation VP example decodable', () => {
    const vp = createVP(EXAMPLE_ICA_ACTIVATION_VP_PAYLOAD);
    expect(vp.iss).toBe(EXAMPLE_ICA_VP_ISSUER_DID);
    expect(vp.vp.verifiableCredential).toHaveLength(2);
  });
});
