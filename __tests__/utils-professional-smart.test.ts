import { describe, expect, it } from '@jest/globals';

import { ProfessionalCredentialTypes, W3cCredentialTypes } from '../src/constants/verifiable-credentials';
import {
  buildProfessionalEmployeeCredential,
  buildProfessionalSmartVpPayload,
  buildUnsignedProfessionalSmartVpJwt,
} from '../src/utils/professional-smart';
import { decodeVpTokenPayload } from '../src/utils/vp-token';

describe('professional SMART helpers', () => {
  it('builds one canonical employee credential for SMART/OpenID4VP demos', () => {
    expect(buildProfessionalEmployeeCredential({
      actorDid: 'did:web:provider.example.org:professional:1',
      role: 'ISCO-08|2211',
    })).toEqual({
      type: [
        W3cCredentialTypes.VerifiableCredential,
        ProfessionalCredentialTypes.EmployeeCredential,
      ],
      credentialSubject: {
        id: 'did:web:provider.example.org:professional:1',
        hasOccupation: 'ISCO-08|2211',
      },
    });
  });

  it('builds one VP payload without exposing inline credential literals to callers', () => {
    expect(buildProfessionalSmartVpPayload({
      clientId: 'did:web:device-001',
      actorDid: 'did:web:provider.example.org:professional:1',
      role: 'ISCO-08|2211',
    })).toEqual({
      vp: {
        holder: 'did:web:device-001',
        verifiableCredential: [{
          type: [
            W3cCredentialTypes.VerifiableCredential,
            ProfessionalCredentialTypes.EmployeeCredential,
          ],
          credentialSubject: {
            id: 'did:web:provider.example.org:professional:1',
            hasOccupation: 'ISCO-08|2211',
          },
        }],
      },
    });
  });

  it('builds one unsigned compact VP JWT for the current professional SMART happy path', () => {
    const token = buildUnsignedProfessionalSmartVpJwt({
      clientId: 'did:web:device-001',
      actorDid: 'did:web:provider.example.org:professional:1',
      role: 'ISCO-08|2211',
    });

    expect(decodeVpTokenPayload(token)).toMatchObject({
      vp: {
        holder: 'did:web:device-001',
        verifiableCredential: [{
          type: [
            W3cCredentialTypes.VerifiableCredential,
            ProfessionalCredentialTypes.EmployeeCredential,
          ],
          credentialSubject: {
            id: 'did:web:provider.example.org:professional:1',
            hasOccupation: 'ISCO-08|2211',
          },
        }],
      },
    });
  });
});
