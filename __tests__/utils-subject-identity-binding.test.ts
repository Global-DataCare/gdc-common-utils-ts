import { describe, expect, it } from '@jest/globals';
import { DataspaceSectors } from '../src/constants/sectors.js';
import {
  EXAMPLE_ALTERNATE_PORTAL_INDIVIDUAL_DID,
  EXAMPLE_PHYSICAL_SUPPORT_DID,
  EXAMPLE_PORTAL_INDIVIDUAL_DID,
  EXAMPLE_SUBJECT_IDENTITY_BINDING_CREDENTIAL,
  EXAMPLE_TRUSTED_HEALTH_PORTAL_DID,
} from '../src/examples/subject-identity-binding.js';
import {
  buildSubjectIdentityBindingCredential,
  getMatchingSubjectIdentityBindingFromVpToken,
  matchesSubjectIdentityBinding,
  summarizeSubjectIdentityBinding,
} from '../src/utils/subject-identity-binding.js';
import { addVC, createVP } from '../src/utils/vp-token.js';

describe('subject identity binding utils', () => {
  it('builds and matches individual DIDs issued by a trusted sector portal', () => {
    const summary = summarizeSubjectIdentityBinding(EXAMPLE_SUBJECT_IDENTITY_BINDING_CREDENTIAL);

    expect(summary).toMatchObject({
      issuerDid: EXAMPLE_TRUSTED_HEALTH_PORTAL_DID,
      subjectDid: EXAMPLE_PORTAL_INDIVIDUAL_DID,
      aliasDids: [EXAMPLE_ALTERNATE_PORTAL_INDIVIDUAL_DID],
      sectors: [DataspaceSectors.HealthCare],
    });
    expect(matchesSubjectIdentityBinding(summary, {
      trustedIssuerDids: [EXAMPLE_TRUSTED_HEALTH_PORTAL_DID],
      requiredSubjectDids: [
        EXAMPLE_PORTAL_INDIVIDUAL_DID,
        EXAMPLE_ALTERNATE_PORTAL_INDIVIDUAL_DID,
      ],
      sector: DataspaceSectors.HealthCare,
      now: '2026-07-23T00:00:00.000Z',
    })).toBe(true);
  });

  it('finds the binding through the normal VP credential extraction path', () => {
    const vp = addVC(
      createVP({ iss: EXAMPLE_PORTAL_INDIVIDUAL_DID }),
      EXAMPLE_SUBJECT_IDENTITY_BINDING_CREDENTIAL,
    );

    expect(getMatchingSubjectIdentityBindingFromVpToken(JSON.stringify(vp), {
      trustedIssuerDids: [EXAMPLE_TRUSTED_HEALTH_PORTAL_DID],
      requiredSubjectDids: [
        EXAMPLE_PORTAL_INDIVIDUAL_DID,
        EXAMPLE_ALTERNATE_PORTAL_INDIVIDUAL_DID,
      ],
      sector: DataspaceSectors.HealthCare,
      now: '2026-07-23T00:00:00.000Z',
    })).toBeDefined();
  });

  it('rejects an untrusted issuer, wrong sector, expired credential, and physical support DID', () => {
    const summary = summarizeSubjectIdentityBinding(EXAMPLE_SUBJECT_IDENTITY_BINDING_CREDENTIAL);
    const base = {
      requiredSubjectDids: [
        EXAMPLE_PORTAL_INDIVIDUAL_DID,
        EXAMPLE_ALTERNATE_PORTAL_INDIVIDUAL_DID,
      ],
      sector: DataspaceSectors.HealthCare,
      now: '2026-07-23T00:00:00.000Z',
    };

    expect(matchesSubjectIdentityBinding(summary, {
      ...base,
      trustedIssuerDids: ['did:web:untrusted.example.org'],
    })).toBe(false);
    expect(matchesSubjectIdentityBinding(summary, {
      ...base,
      trustedIssuerDids: [EXAMPLE_TRUSTED_HEALTH_PORTAL_DID],
      sector: DataspaceSectors.HealthResearch,
    })).toBe(false);
    expect(matchesSubjectIdentityBinding(summary, {
      ...base,
      trustedIssuerDids: [EXAMPLE_TRUSTED_HEALTH_PORTAL_DID],
      now: '2028-01-01T00:00:00.000Z',
    })).toBe(false);
    expect(matchesSubjectIdentityBinding(summary, {
      ...base,
      trustedIssuerDids: [EXAMPLE_TRUSTED_HEALTH_PORTAL_DID],
      requiredSubjectDids: [EXAMPLE_PORTAL_INDIVIDUAL_DID, EXAMPLE_PHYSICAL_SUPPORT_DID],
    })).toBe(false);
  });

  it('rejects malformed DIDs and bindings without an individual alias', () => {
    expect(() => buildSubjectIdentityBindingCredential({
      issuerDid: EXAMPLE_TRUSTED_HEALTH_PORTAL_DID,
      subjectDid: EXAMPLE_PORTAL_INDIVIDUAL_DID,
      aliasDids: [EXAMPLE_PORTAL_INDIVIDUAL_DID],
      sectors: [DataspaceSectors.HealthCare],
      validFrom: '2026-01-01T00:00:00.000Z',
    })).toThrow('aliasDids');

    expect(summarizeSubjectIdentityBinding({
      ...EXAMPLE_SUBJECT_IDENTITY_BINDING_CREDENTIAL,
      credentialSubject: {
        ...EXAMPLE_SUBJECT_IDENTITY_BINDING_CREDENTIAL.credentialSubject,
        sameAs: ['https://cards.example.org/subject'],
      },
    })).toBeUndefined();
  });
});
