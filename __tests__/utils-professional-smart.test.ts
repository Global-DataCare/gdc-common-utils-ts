import { describe, expect, it } from '@jest/globals';

import { ClaimsPersonSchemaorg } from '../src/constants/schemaorg';
import { ProfessionalCredentialTypes, W3cCredentialTypes } from '../src/constants/verifiable-credentials';
import { EXAMPLE_PROFESSIONAL_IDENTITY } from '../src/examples/employee';
import {
  buildProfessionalEmployeeCredential,
  buildProfessionalIdentityVpPayload,
  buildProfessionalSmartVpPayload,
  buildUnsignedProfessionalIdentityVpJwt,
  buildUnsignedProfessionalSmartVpJwt,
  getProfessionalIdentitySameAs,
  getProfessionalIdentityTelephone,
  getProfessionalIdentityVC,
} from '../src/utils/professional-smart';
import { normalizeSameAsHash, normalizeTelephoneHash } from '../src/utils/same-as';
import { decodeVpTokenPayload } from '../src/utils/vp-token';

describe('professional SMART helpers', () => {
  it('returns one normalized sameAs array for the current professional identity source', () => {
    expect(getProfessionalIdentitySameAs(EXAMPLE_PROFESSIONAL_IDENTITY)).toEqual([
      normalizeSameAsHash(EXAMPLE_PROFESSIONAL_IDENTITY.email),
    ]);
  });

  it('returns one normalized hashed telephone continuity value when present', () => {
    expect(getProfessionalIdentityTelephone(EXAMPLE_PROFESSIONAL_IDENTITY)).toBe(
      normalizeTelephoneHash(EXAMPLE_PROFESSIONAL_IDENTITY.telephone),
    );
  });

  it('builds one canonical employee credential for SMART/OpenID4VP demos', () => {
    expect(getProfessionalIdentityVC(EXAMPLE_PROFESSIONAL_IDENTITY)).toEqual({
      type: [
        W3cCredentialTypes.VerifiableCredential,
        ProfessionalCredentialTypes.EmployeeCredential,
      ],
      credentialSubject: {
        id: EXAMPLE_PROFESSIONAL_IDENTITY.actorDid,
        hasOccupation: EXAMPLE_PROFESSIONAL_IDENTITY.role,
        sameAs: normalizeSameAsHash(EXAMPLE_PROFESSIONAL_IDENTITY.email),
        [ClaimsPersonSchemaorg.telephone]: normalizeTelephoneHash(EXAMPLE_PROFESSIONAL_IDENTITY.telephone),
        [ClaimsPersonSchemaorg.hasCredentialMaterial]: EXAMPLE_PROFESSIONAL_IDENTITY.credentialMaterial,
      },
    });
  });

  it('keeps the legacy employee credential helper aligned with the canonical identity VC builder', () => {
    expect(buildProfessionalEmployeeCredential(EXAMPLE_PROFESSIONAL_IDENTITY)).toEqual(
      getProfessionalIdentityVC(EXAMPLE_PROFESSIONAL_IDENTITY),
    );
  });

  it('builds one VP payload without exposing inline credential literals to callers', () => {
    const expectedIdentityCredential = getProfessionalIdentityVC(EXAMPLE_PROFESSIONAL_IDENTITY);
    expect(buildProfessionalSmartVpPayload({
      clientId: EXAMPLE_PROFESSIONAL_IDENTITY.actorDid,
      ...EXAMPLE_PROFESSIONAL_IDENTITY,
    })).toEqual({
      vp: {
        holder: EXAMPLE_PROFESSIONAL_IDENTITY.actorDid,
        verifiableCredential: [expectedIdentityCredential],
      },
    });
  });

  it('exposes one identity-oriented VP payload alias for higher SDK facades', () => {
    expect(buildProfessionalIdentityVpPayload({
      clientId: EXAMPLE_PROFESSIONAL_IDENTITY.actorDid,
      ...EXAMPLE_PROFESSIONAL_IDENTITY,
    })).toEqual(buildProfessionalSmartVpPayload({
      clientId: EXAMPLE_PROFESSIONAL_IDENTITY.actorDid,
      ...EXAMPLE_PROFESSIONAL_IDENTITY,
    }));
  });

  it('builds one unsigned compact VP JWT for the current professional SMART happy path', () => {
    const token = buildUnsignedProfessionalSmartVpJwt({
      clientId: EXAMPLE_PROFESSIONAL_IDENTITY.actorDid,
      ...EXAMPLE_PROFESSIONAL_IDENTITY,
    });

    expect(decodeVpTokenPayload(token)).toMatchObject({
      vp: {
        holder: EXAMPLE_PROFESSIONAL_IDENTITY.actorDid,
        verifiableCredential: [{
          type: [
            W3cCredentialTypes.VerifiableCredential,
            ProfessionalCredentialTypes.EmployeeCredential,
          ],
          credentialSubject: {
            id: EXAMPLE_PROFESSIONAL_IDENTITY.actorDid,
            hasOccupation: EXAMPLE_PROFESSIONAL_IDENTITY.role,
            sameAs: normalizeSameAsHash(EXAMPLE_PROFESSIONAL_IDENTITY.email),
          },
        }],
      },
    });
  });

  it('exposes one identity-oriented unsigned VP JWT alias for higher SDK facades', () => {
    expect(buildUnsignedProfessionalIdentityVpJwt({
      clientId: EXAMPLE_PROFESSIONAL_IDENTITY.actorDid,
      ...EXAMPLE_PROFESSIONAL_IDENTITY,
    })).toBe(buildUnsignedProfessionalSmartVpJwt({
      clientId: EXAMPLE_PROFESSIONAL_IDENTITY.actorDid,
      ...EXAMPLE_PROFESSIONAL_IDENTITY,
    }));
  });
});
