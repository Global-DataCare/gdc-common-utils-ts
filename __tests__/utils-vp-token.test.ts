// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.
import { describe, expect, it } from '@jest/globals';
import {
  ActivationCredentialTypes,
  W3cCredentialTypes,
} from '../src/constants/verifiable-credentials.js';
import {
  EXAMPLE_ORGANIZATION_ID,
  EXAMPLE_ORGANIZATION_TAX_ID,
  EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL,
  EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL,
  EXAMPLE_ORG_ACTIVATION_PROOF_VP_PAYLOAD,
  EXAMPLE_PRESENTATION_SIGNER_KEY_ID,
  EXAMPLE_REPRESENTATIVE_KEY_ID,
} from '../src/examples/ica-activation-proof.js';
import {
  addVC,
  addVCs,
  addLegalRepresentativeCredential,
  addOrganizationCredential,
  buildEpochWindow,
  buildVpTokenCompact,
  createVP,
  generateUuidLike,
  getLegalRepresentativeCredentialFromVpToken,
  getOrganizationCredentialFromVpToken,
  getVpCredentials,
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
  // constants. Do not re-hardcode signer ids or activation VC subtype names
  // inline in each test case.
  it('creates vp payload and appends vcs', () => {
    const vp = createVP({ iss: EXAMPLE_PRESENTATION_SIGNER_KEY_ID });
    addVC(vp, 'eyJ.vc1.sig');
    addVC(vp, 'eyJ.vc2.sig');
    expect(vp.vp.verifiableCredential).toEqual(['eyJ.vc1.sig', 'eyJ.vc2.sig']);
  });

  it('appends VC JSON objects without manual serialization', () => {
    const vp = createVP({ iss: EXAMPLE_PRESENTATION_SIGNER_KEY_ID });
    addVC(vp, EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL);
    expect(vp.vp.verifiableCredential).toEqual([EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL]);
  });

  it('prepares base64url header.payload for external signing', () => {
    const header = { alg: 'ES256', typ: 'JWT', kid: 'did:web:example.com#k1' };
    const vp = createVP({ iss: EXAMPLE_PRESENTATION_SIGNER_KEY_ID });
    addVC(vp, 'eyJ.vc1.sig');
    const prepared = prepareForSignature(header, vp);
    expect(prepared.encodedHeader.length).toBeGreaterThan(10);
    expect(prepared.encodedPayload.length).toBeGreaterThan(10);
    expect(prepared.signingInput).toContain('.');
    expect(prepared.signingInput.split('.')).toHaveLength(2);
  });

  it('returns deterministic bytes for signing input', () => {
    const header = { alg: 'ES256', typ: 'JWT' };
    const vp = createVP({ iss: EXAMPLE_PRESENTATION_SIGNER_KEY_ID });
    const a = prepareBytesForSignature(header, vp);
    const b = prepareBytesForSignature(header, vp);
    expect(Array.from(a)).toEqual(Array.from(b));
  });

  it('builds compact vp token with external signature', () => {
    const token = buildVpTokenCompact('aaa', 'bbb', 'ccc');
    expect(token).toBe('aaa.bbb.ccc');
  });

  it('creates defaults for jti/nonce/iat/exp', () => {
    const vp = createVP({ iss: EXAMPLE_PRESENTATION_SIGNER_KEY_ID });
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
    const vp = createVP({ iss: EXAMPLE_PRESENTATION_SIGNER_KEY_ID });
    addVCs(vp, [
      vcJwt(ActivationCredentialTypes.OrganizationCredential),
      vcJwt(ActivationCredentialTypes.LegalRepresentativeCredential),
    ]);
    expect(vp.vp.verifiableCredential).toHaveLength(2);
  });

  it('adds mixed compact and JSON VC entries via addVCs', () => {
    const vp = createVP({ iss: EXAMPLE_PRESENTATION_SIGNER_KEY_ID });
    addVCs(vp, [
      vcJwt(ActivationCredentialTypes.OrganizationCredential),
      EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL,
    ]);
    expect(vp.vp.verifiableCredential).toEqual([
      expect.any(String),
      EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL,
    ]);
  });

  it('validates organization credential type', () => {
    const vp = createVP({ iss: EXAMPLE_PRESENTATION_SIGNER_KEY_ID });
    addOrganizationCredential(vp, vcJwt(ActivationCredentialTypes.OrganizationCredential));
    expect(vp.vp.verifiableCredential).toHaveLength(1);
    addOrganizationCredential(vp, EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL);
    expect(vp.vp.verifiableCredential).toHaveLength(2);
    expect(() => addOrganizationCredential(vp, vcJwt(ActivationCredentialTypes.LegalRepresentativeCredential))).toThrow(
      /Organization VC must include one of types/,
    );
  });

  it('validates representative credential type', () => {
    const vp = createVP({ iss: EXAMPLE_PRESENTATION_SIGNER_KEY_ID });
    addLegalRepresentativeCredential(vp, vcJwt(ActivationCredentialTypes.LegalRepresentativeCredential));
    expect(vp.vp.verifiableCredential).toHaveLength(1);
    addLegalRepresentativeCredential(vp, EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL);
    expect(vp.vp.verifiableCredential).toHaveLength(2);
    expect(() => addLegalRepresentativeCredential(vp, vcJwt(ActivationCredentialTypes.OrganizationCredential))).toThrow(
      /LegalRepresentative VC must include one of types/,
    );
  });

  it('extracts organization and legal representative credentials from a VP token', () => {
    const vp = createVP({
      iss: EXAMPLE_PRESENTATION_SIGNER_KEY_ID,
      vp: {
        verifiableCredential: [
          JSON.stringify(EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL),
          JSON.stringify(EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL),
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
      id: EXAMPLE_ORGANIZATION_ID,
      taxID: EXAMPLE_ORGANIZATION_TAX_ID,
    });
    expect(getLegalRepresentativeCredentialFromVpToken(compact)?.credentialSubject).toMatchObject({
      id: EXAMPLE_REPRESENTATIVE_KEY_ID,
    });
  });

  it('keeps the shared synthetic org activation VP example decodable', () => {
    const vp = createVP(EXAMPLE_ORG_ACTIVATION_PROOF_VP_PAYLOAD);
    expect(vp.iss).toBe(EXAMPLE_PRESENTATION_SIGNER_KEY_ID);
    expect(vp.sub).toBe(EXAMPLE_ORGANIZATION_TAX_ID);
    expect(vp.vp.verifiableCredential).toHaveLength(2);
  });
});
