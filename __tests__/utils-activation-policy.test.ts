// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.
import {
  buildMemberDidWeb,
  extractDidWebFromCredential,
  isMemberDidWebUnderOwner,
  validateActivationRepresentativePolicy,
} from '../src/utils/activation-policy';
import {
  EXAMPLE_ICA_LEGAL_REPRESENTATIVE_CREDENTIAL,
  EXAMPLE_ICA_ORGANIZATION_CREDENTIAL,
  EXAMPLE_ICA_ORGANIZATION_TAX_ID,
  EXAMPLE_ICA_REPRESENTATIVE_BINDING_MATERIAL,
  EXAMPLE_ICA_REPRESENTATIVE_ROLE_CODE,
} from '../src/examples/ica-activation-proof';

describe('Activation Policy Utils', () => {
  // This suite must reuse the shared synthetic ICA activation fixtures unless a
  // test needs a locally-mutated variant to exercise a specific parser/policy branch.
  const organizationCredential = EXAMPLE_ICA_ORGANIZATION_CREDENTIAL;

  const representativeCredential = {
    ...EXAMPLE_ICA_LEGAL_REPRESENTATIVE_CREDENTIAL,
    credentialSubject: {
      ...EXAMPLE_ICA_LEGAL_REPRESENTATIVE_CREDENTIAL.credentialSubject,
      id: 'did:web:provider.example:organization:taxid:ESB00112233:member:zabc:RESPRSN',
      memberOf: { taxID: EXAMPLE_ICA_ORGANIZATION_TAX_ID.toLowerCase() },
      hasCredential: { material: EXAMPLE_ICA_REPRESENTATIVE_BINDING_MATERIAL },
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
          hasOccupation: { identifier: { value: 'OTHER' } },
        },
      },
    });
    expect(errors.map((e) => e.code)).toContain('REPRESENTATIVE_TAXID_MISMATCH');
    expect(errors.map((e) => e.code)).toContain('MISSING_REPRESENTATIVE_ROLE_RESPRSN');
    expect(errors.map((e) => e.code)).toContain('MISSING_REPRESENTATIVE_CREDENTIAL_BINDING');
  });

  it('accepts legacy tokenized occupation values', () => {
    const errors = validateActivationRepresentativePolicy({
      organizationCredential,
      representativeCredential: {
        credentialSubject: {
          id: 'did:web:provider.example:organization:taxid:ESB00112233:member:zabc:RESPRSN',
          memberOf: { taxID: EXAMPLE_ICA_ORGANIZATION_TAX_ID },
          hasOccupation: { identifier: `v3-RoleCode|${EXAMPLE_ICA_REPRESENTATIVE_ROLE_CODE}` },
          hasCredential: { material: EXAMPLE_ICA_REPRESENTATIVE_BINDING_MATERIAL },
        },
      },
    });
    expect(errors).toHaveLength(0);
  });

  it('accepts representative credential binding from hasCredential.identifier.value', () => {
    const errors = validateActivationRepresentativePolicy({
      organizationCredential,
      representativeCredential: {
        credentialSubject: {
          id: 'did:web:provider.example:organization:taxid:ESB00112233:member:zabc:RESPRSN',
          memberOf: { taxID: EXAMPLE_ICA_ORGANIZATION_TAX_ID },
          hasOccupation: { identifier: { value: EXAMPLE_ICA_REPRESENTATIVE_ROLE_CODE } },
          hasCredential: { identifier: { value: EXAMPLE_ICA_REPRESENTATIVE_BINDING_MATERIAL } },
        },
      },
    });
    expect(errors).toHaveLength(0);
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
