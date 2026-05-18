import { describe, expect, it } from '@jest/globals';
import {
  addVC,
  addVCs,
  addLegalRepresentativeCredential,
  addOrganizationCredential,
  buildEpochWindow,
  buildVpTokenCompact,
  createVP,
  generateUuidLike,
  prepareBytesForSignature,
  prepareForSignature,
} from '../src/utils/vp-token.js';

function vcJwt(type: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    type: ['VerifiableCredential', type],
    credentialSubject: { id: 'did:web:subject.example.org' },
  })).toString('base64url');
  return `${header}.${payload}.sig`;
}

describe('vp token utilities', () => {
  it('creates vp payload and appends vcs', () => {
    const vp = createVP({ iss: 'did:web:example.com:alice' });
    addVC(vp, 'eyJ.vc1.sig');
    addVC(vp, 'eyJ.vc2.sig');
    expect(vp.vp.verifiableCredential).toEqual(['eyJ.vc1.sig', 'eyJ.vc2.sig']);
  });

  it('prepares base64url header.payload for external signing', () => {
    const header = { alg: 'ES256', typ: 'JWT', kid: 'did:web:example.com#k1' };
    const vp = createVP({ iss: 'did:web:example.com:alice' });
    addVC(vp, 'eyJ.vc1.sig');
    const prepared = prepareForSignature(header, vp);
    expect(prepared.encodedHeader.length).toBeGreaterThan(10);
    expect(prepared.encodedPayload.length).toBeGreaterThan(10);
    expect(prepared.signingInput).toContain('.');
    expect(prepared.signingInput.split('.')).toHaveLength(2);
  });

  it('returns deterministic bytes for signing input', () => {
    const header = { alg: 'ES256', typ: 'JWT' };
    const vp = createVP({ iss: 'did:web:example.com:alice' });
    const a = prepareBytesForSignature(header, vp);
    const b = prepareBytesForSignature(header, vp);
    expect(Array.from(a)).toEqual(Array.from(b));
  });

  it('builds compact vp token with external signature', () => {
    const token = buildVpTokenCompact('aaa', 'bbb', 'ccc');
    expect(token).toBe('aaa.bbb.ccc');
  });

  it('creates defaults for jti/nonce/iat/exp', () => {
    const vp = createVP({ iss: 'did:web:example.com:alice' });
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
    const vp = createVP({ iss: 'did:web:example.com:alice' });
    addVCs(vp, [vcJwt('OrganizationCredential'), vcJwt('LegalRepresentativeCredential')]);
    expect(vp.vp.verifiableCredential).toHaveLength(2);
  });

  it('validates organization credential type', () => {
    const vp = createVP({ iss: 'did:web:example.com:alice' });
    addOrganizationCredential(vp, vcJwt('OrganizationCredential'));
    expect(vp.vp.verifiableCredential).toHaveLength(1);
    expect(() => addOrganizationCredential(vp, vcJwt('LegalRepresentativeCredential'))).toThrow(
      /Organization VC must include one of types/,
    );
  });

  it('validates representative credential type', () => {
    const vp = createVP({ iss: 'did:web:example.com:alice' });
    addLegalRepresentativeCredential(vp, vcJwt('LegalRepresentativeCredential'));
    expect(vp.vp.verifiableCredential).toHaveLength(1);
    expect(() => addLegalRepresentativeCredential(vp, vcJwt('OrganizationCredential'))).toThrow(
      /LegalRepresentative VC must include one of types/,
    );
  });
});
