// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.
import {
  buildMemberDidWeb,
  extractRepresentativeSubjectId,
  extractDidWebFromCredential,
  isMemberDidWebUnderOwner,
  validateActivationServiceAuthorizationPolicy,
  validateActivationRepresentativePolicy,
} from '../src/utils/activation-policy';
import {
  EXAMPLE_ACTIVATION_AUTHORIZED_CATEGORY,
  EXAMPLE_ACTIVATION_AUTHORIZED_SERVICE_TYPE,
  EXAMPLE_ORGANIZATION_TAX_ID,
  EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
  EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL,
  EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL,
  EXAMPLE_REPRESENTATIVE_IDENTIFIER,
  EXAMPLE_REPRESENTATIVE_SAME_AS,
  EXAMPLE_REPRESENTATIVE_SUBJECT_URN,
  EXAMPLE_REPRESENTATIVE_ROLE_CODE,
} from '../src/examples/ica-activation-proof';
import { cloneExample } from '../src/examples/shared';

describe('Activation Policy Utils', () => {
  // This suite must reuse the shared synthetic ICA activation fixtures unless a
  // test needs a locally-mutated variant to exercise a specific parser/policy branch.
  const organizationCredential = EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL;

  const representativeCredential = {
    ...cloneExample(EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL),
    credentialSubject: {
      ...cloneExample(EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL.credentialSubject),
      memberOf: { taxID: EXAMPLE_ORGANIZATION_TAX_ID.toLowerCase() },
      hasCredential: { material: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID },
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
          id: EXAMPLE_REPRESENTATIVE_SUBJECT_URN,
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
          id: EXAMPLE_REPRESENTATIVE_SUBJECT_URN,
          memberOf: { taxID: EXAMPLE_ORGANIZATION_TAX_ID },
          hasOccupation: { identifier: `v3-RoleCode|${EXAMPLE_REPRESENTATIVE_ROLE_CODE}` },
          hasCredential: { material: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID },
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
          id: EXAMPLE_REPRESENTATIVE_SUBJECT_URN,
          memberOf: { taxID: EXAMPLE_ORGANIZATION_TAX_ID },
          hasOccupation: { identifier: { value: EXAMPLE_REPRESENTATIVE_ROLE_CODE } },
          hasCredential: { identifier: { value: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID } },
        },
      },
    });
    expect(errors).toHaveLength(0);
  });

  it('accepts ICA-style representative urn subject ids and ISCO role identifiers', () => {
    const errors = validateActivationRepresentativePolicy({
      organizationCredential,
      representativeCredential,
    });
    expect(errors).toHaveLength(0);
  });

  it('treats sameAs and hasCredential as complementary proof dimensions', () => {
    const missingBindingErrors = validateActivationRepresentativePolicy({
      organizationCredential,
      representativeCredential: {
        credentialSubject: {
          id: EXAMPLE_REPRESENTATIVE_SUBJECT_URN,
          memberOf: { taxID: EXAMPLE_ORGANIZATION_TAX_ID },
          hasOccupation: { identifier: EXAMPLE_REPRESENTATIVE_ROLE_CODE },
          sameAs: EXAMPLE_REPRESENTATIVE_SAME_AS,
        },
      },
    });
    expect(missingBindingErrors.map((error) => error.code)).toContain('MISSING_REPRESENTATIVE_CREDENTIAL_BINDING');

    const bindingOnlyErrors = validateActivationRepresentativePolicy({
      organizationCredential,
      representativeCredential: {
        credentialSubject: {
          id: EXAMPLE_REPRESENTATIVE_SUBJECT_URN,
          memberOf: { taxID: EXAMPLE_ORGANIZATION_TAX_ID },
          hasOccupation: { identifier: EXAMPLE_REPRESENTATIVE_ROLE_CODE },
          hasCredential: { material: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID },
        },
      },
    });
    expect(bindingOnlyErrors).toHaveLength(0);
  });

  it('builds and validates member did:web hierarchy', () => {
    const owner = 'did:web:provider.example:organization:taxid:ESB00112233';
    const memberDid = buildMemberDidWeb(owner, 'z6MkuX', 'RESPRSN');
    expect(memberDid).toBe('did:web:provider.example:organization:taxid:ESB00112233:member:z6MkuX:RESPRSN');
    expect(isMemberDidWebUnderOwner(memberDid, owner)).toBe(true);
    expect(isMemberDidWebUnderOwner('did:web:other.example:member:z:RESPRSN', owner)).toBe(false);
  });

  it('extracts did:web from credential subject', () => {
    expect(extractDidWebFromCredential(representativeCredential)).toBeUndefined();
  });

  it('extracts representative subject ids from ICA person credentials', () => {
    expect(extractRepresentativeSubjectId(representativeCredential)).toBe(EXAMPLE_REPRESENTATIVE_SUBJECT_URN);
    expect(extractRepresentativeSubjectId({
      credentialSubject: {
        id: `urn:person:identifier:${EXAMPLE_REPRESENTATIVE_IDENTIFIER}`,
      },
    })).toBe(EXAMPLE_REPRESENTATIVE_SUBJECT_URN);
  });

  it('validates service category and serviceType authorization from the organization credential', () => {
    const errors = validateActivationServiceAuthorizationPolicy({
      organizationCredential,
      requiredCategory: EXAMPLE_ACTIVATION_AUTHORIZED_CATEGORY,
      requiredServiceTypes: [EXAMPLE_ACTIVATION_AUTHORIZED_SERVICE_TYPE],
    });
    expect(errors).toHaveLength(0);
  });

  it('reports missing or unauthorized service category and serviceType authorization', () => {
    const errors = validateActivationServiceAuthorizationPolicy({
      organizationCredential: {
        credentialSubject: {
          id: EXAMPLE_ORGANIZATION_TAX_ID,
        },
      },
      requiredCategory: EXAMPLE_ACTIVATION_AUTHORIZED_CATEGORY,
      requiredServiceTypes: [EXAMPLE_ACTIVATION_AUTHORIZED_SERVICE_TYPE],
    });
    expect(errors.map((error) => error.code)).toEqual([
      'MISSING_ORGANIZATION_SERVICE_CATEGORY',
      'MISSING_ORGANIZATION_SERVICE_TYPE',
    ]);
  });

  it('accepts wildcard category authorization for host-style credentials', () => {
    const errors = validateActivationServiceAuthorizationPolicy({
      organizationCredential: {
        credentialSubject: {
          id: EXAMPLE_ORGANIZATION_TAX_ID,
          makesOffer: {
            category: '*',
            serviceType: [EXAMPLE_ACTIVATION_AUTHORIZED_SERVICE_TYPE],
          },
        },
      },
      requiredCategory: EXAMPLE_ACTIVATION_AUTHORIZED_CATEGORY,
      requiredServiceTypes: [EXAMPLE_ACTIVATION_AUTHORIZED_SERVICE_TYPE],
    });
    expect(errors).toHaveLength(0);
  });
});
