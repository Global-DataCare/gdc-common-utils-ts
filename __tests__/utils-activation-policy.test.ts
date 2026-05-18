import {
  buildMemberDidWeb,
  extractDidWebFromCredential,
  isMemberDidWebUnderOwner,
  validateActivationRepresentativePolicy,
} from '../src/utils/activation-policy';

describe('Activation Policy Utils', () => {
  const organizationCredential = {
    credentialSubject: {
      id: 'did:web:provider.example:organization:taxid:ESB00112233',
      taxID: 'ESB00112233',
    },
  };

  const representativeCredential = {
    credentialSubject: {
      id: 'did:web:provider.example:organization:taxid:ESB00112233:member:zabc:RESPRSN',
      memberOf: { taxID: 'esb00112233' },
      hasOccupation: { identifier: '|RESPRSN' },
      hasCredential: { material: 'sha256:abc' },
    },
  };

  it('validates a representative credential linked to organization taxID and role', () => {
    const errors = validateActivationRepresentativePolicy({
      organizationCredential,
      representativeCredential,
    });
    expect(errors).toHaveLength(0);
  });

  it('reports mismatch and missing mandatory fields', () => {
    const errors = validateActivationRepresentativePolicy({
      organizationCredential,
      representativeCredential: {
        credentialSubject: {
          id: 'did:web:provider.example:organization:taxid:OTHER:member:zabc:OTHER',
          memberOf: { taxID: 'ES999' },
          hasOccupation: { identifier: '|OTHER' },
        },
      },
    });
    expect(errors.map((e) => e.code)).toContain('REPRESENTATIVE_TAXID_MISMATCH');
    expect(errors.map((e) => e.code)).toContain('MISSING_REPRESENTATIVE_ROLE_RESPRSN');
    expect(errors.map((e) => e.code)).toContain('MISSING_REPRESENTATIVE_CREDENTIAL_MATERIAL');
  });

  it('builds and validates member did:web hierarchy', () => {
    const owner = 'did:web:provider.example:organization:taxid:ESB00112233';
    const memberDid = buildMemberDidWeb(owner, 'z6MkuX', 'RESPRSN');
    expect(memberDid).toBe('did:web:provider.example:organization:taxid:ESB00112233:member:z6MkuX:RESPRSN');
    expect(isMemberDidWebUnderOwner(memberDid, owner)).toBe(true);
    expect(isMemberDidWebUnderOwner('did:web:other.example:member:z:RESPRSN', owner)).toBe(false);
  });

  it('extracts did:web from credential subject', () => {
    expect(extractDidWebFromCredential(representativeCredential)).toBe(
      'did:web:provider.example:organization:taxid:ESB00112233:member:zabc:RESPRSN',
    );
  });
});
