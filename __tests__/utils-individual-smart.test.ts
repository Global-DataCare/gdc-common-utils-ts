import { describe, expect, it } from '@jest/globals';

import { ClaimsPersonSchemaorg } from '../src/constants/schemaorg';
import { IndividualCredentialTypes, W3cCredentialTypes } from '../src/constants/verifiable-credentials';
import { EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY } from '../src/examples/individual-controller';
import { EXAMPLE_INDIVIDUAL_SUBJECT_IDENTITY } from '../src/examples/individual-controller';
import { EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY } from '../src/examples/related-person';
import {
  buildIndividualControllerIdentityVpPayload,
  buildIndividualMemberIdentityVpPayload,
  buildUnsignedIndividualControllerIdentityVpJwt,
  buildUnsignedIndividualMemberIdentityVpJwt,
  getIndividualControllerIdentitySameAs,
  getIndividualControllerIdentityTelephone,
  getIndividualControllerIdentityVC,
  getIndividualSubjectVC,
  getIndividualMemberIdentitySameAs,
  getIndividualMemberIdentityTelephone,
  getIndividualMemberIdentityVC,
} from '../src/utils/individual-smart';
import { normalizeSameAsHash, normalizeTelephoneHash } from '../src/utils/same-as';
import { decodeVpTokenPayload } from '../src/utils/vp-token';

describe('individual identity SMART helpers', () => {
  it('builds one canonical individual-controller identity VC', () => {
    expect(getIndividualControllerIdentitySameAs(EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY)).toEqual([
      normalizeSameAsHash(EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.email),
    ]);
    expect(getIndividualControllerIdentityTelephone(EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY)).toBe(
      normalizeTelephoneHash(EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.telephone),
    );
    expect(getIndividualControllerIdentityVC(EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY)).toEqual({
      type: [
        W3cCredentialTypes.VerifiableCredential,
        IndividualCredentialTypes.IndividualControllerCredential,
      ],
      credentialSubject: {
        id: EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.actorDid,
        subject: EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.subjectDid,
        relationship: EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.relationship,
        authorityBasis: EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.authorityBasis,
        sameAs: normalizeSameAsHash(EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.email),
        [ClaimsPersonSchemaorg.telephone]: normalizeTelephoneHash(EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.telephone),
        [ClaimsPersonSchemaorg.hasCredentialMaterial]: EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.credentialMaterial,
      },
      evidence: [...EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.evidence],
    });
  });

  it('builds one canonical individual-member identity VC', () => {
    expect(getIndividualMemberIdentitySameAs(EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY)).toEqual([
      normalizeSameAsHash(EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.email),
    ]);
    expect(getIndividualMemberIdentityTelephone(EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY)).toBe(
      normalizeTelephoneHash(EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.telephone),
    );
    expect(getIndividualMemberIdentityVC(EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY)).toEqual({
      type: [
        W3cCredentialTypes.VerifiableCredential,
        IndividualCredentialTypes.IndividualMemberCredential,
      ],
      credentialSubject: {
        id: EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.actorDid,
        subject: EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.subjectDid,
        relationship: EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.relationship,
        authorityBasis: EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.authorityBasis,
        sameAs: normalizeSameAsHash(EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.email),
        [ClaimsPersonSchemaorg.telephone]: normalizeTelephoneHash(EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.telephone),
        [ClaimsPersonSchemaorg.hasCredentialMaterial]: EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.credentialMaterial,
      },
      evidence: [...EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.evidence],
    });
  });

  it('builds one canonical subject VC for dependent child/pet identity claims', () => {
    expect(getIndividualSubjectVC(EXAMPLE_INDIVIDUAL_SUBJECT_IDENTITY)).toEqual({
      type: [
        W3cCredentialTypes.VerifiableCredential,
        IndividualCredentialTypes.IndividualSubjectCredential,
      ],
      credentialSubject: {
        id: EXAMPLE_INDIVIDUAL_SUBJECT_IDENTITY.subjectDid,
        sameAs: normalizeSameAsHash(EXAMPLE_INDIVIDUAL_SUBJECT_IDENTITY.sameAs),
        [ClaimsPersonSchemaorg.telephone]: normalizeTelephoneHash(EXAMPLE_INDIVIDUAL_SUBJECT_IDENTITY.telephone),
        alternateName: 'Ana',
      },
      evidence: [...EXAMPLE_INDIVIDUAL_SUBJECT_IDENTITY.evidence],
    });
  });

  it('builds VP payloads for controller and member actors', () => {
    expect(buildIndividualControllerIdentityVpPayload({
      clientId: EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.actorDid,
      ...EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY,
    })).toEqual({
      vp: {
        holder: EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.actorDid,
        verifiableCredential: [getIndividualControllerIdentityVC(EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY)],
      },
    });

    expect(buildIndividualMemberIdentityVpPayload({
      clientId: EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.actorDid,
      ...EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY,
    })).toEqual({
      vp: {
        holder: EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.actorDid,
        verifiableCredential: [getIndividualMemberIdentityVC(EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY)],
      },
    });
  });

  it('builds unsigned compact VP JWTs for controller and member actors', () => {
    const controllerToken = buildUnsignedIndividualControllerIdentityVpJwt({
      clientId: EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.actorDid,
      ...EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY,
    });
    const memberToken = buildUnsignedIndividualMemberIdentityVpJwt({
      clientId: EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.actorDid,
      ...EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY,
    });

    expect(decodeVpTokenPayload(controllerToken)).toMatchObject({
      vp: {
        holder: EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.actorDid,
        verifiableCredential: [{
          type: [
            W3cCredentialTypes.VerifiableCredential,
            IndividualCredentialTypes.IndividualControllerCredential,
          ],
          credentialSubject: {
            id: EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.actorDid,
            subject: EXAMPLE_INDIVIDUAL_CONTROLLER_IDENTITY.subjectDid,
          },
        }],
      },
    });
    expect(decodeVpTokenPayload(memberToken)).toMatchObject({
      vp: {
        holder: EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.actorDid,
        verifiableCredential: [{
          type: [
            W3cCredentialTypes.VerifiableCredential,
            IndividualCredentialTypes.IndividualMemberCredential,
          ],
          credentialSubject: {
            id: EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.actorDid,
            subject: EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY.subjectDid,
          },
        }],
      },
    });
  });
});
