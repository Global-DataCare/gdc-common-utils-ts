import { describe, expect, it } from '@jest/globals';
import {
  EXAMPLE_ORGANIZATION_TAX_ID,
  EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
  EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL,
  EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL,
  EXAMPLE_PRESENTATION_AUDIENCE_HOST_ID,
} from '../src/examples/ica-activation-proof.js';
import {
  addLegalRepresentativeCredential,
  addOrganizationCredential,
  buildVpTokenCompact,
  createVP,
  prepareBytesForSignature,
  prepareForSignature,
} from '../src/utils/vp-token.js';
import { ClassicalJoseSignatureAlgorithms } from '../src/constants/cryptography.js';

describe('VP Token 101 legal organization onboarding sequence', () => {
  it('builds the VP payload, prepares the bytes for an external KMS, and compacts the final VP JWT', () => {
    const vpPayload = createVP({
      iss: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
      sub: EXAMPLE_ORGANIZATION_TAX_ID,
      aud: EXAMPLE_PRESENTATION_AUDIENCE_HOST_ID,
    });

    addOrganizationCredential(
      vpPayload,
      EXAMPLE_ORG_ACTIVATION_ORGANIZATION_CREDENTIAL,
    );
    addLegalRepresentativeCredential(
      vpPayload,
      EXAMPLE_ORG_ACTIVATION_LEGAL_REPRESENTATIVE_CREDENTIAL,
    );

    expect(vpPayload.vp.verifiableCredential).toHaveLength(2);

    // The protected header must reflect the actual signing algorithm used by the
    // controller-side wallet or external KMS. This example keeps ES384 because
    // the current legal-onboarding fixtures still use the legacy P-384 profile.
    const protectedHeader = {
      alg: ClassicalJoseSignatureAlgorithms.Es384,
      typ: 'JWT',
      kid: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
    };

    const prepared = prepareForSignature(protectedHeader, vpPayload);
    const signingBytes = prepareBytesForSignature(protectedHeader, vpPayload);

    expect(prepared.signingInput).toBe(
      `${prepared.encodedHeader}.${prepared.encodedPayload}`,
    );
    expect(Array.from(signingBytes)).toEqual(
      Array.from(Buffer.from(prepared.signingInput, 'utf8')),
    );

    // In production, the external KMS signs `signingBytes` or `prepared.signingInput`.
    // The test uses a deterministic placeholder to document the final assembly step.
    const signatureBase64Url = 'external-kms-signature-base64url';
    const vpToken = buildVpTokenCompact(
      prepared.encodedHeader,
      prepared.encodedPayload,
      signatureBase64Url,
    );

    expect(vpToken).toBe(
      `${prepared.encodedHeader}.${prepared.encodedPayload}.${signatureBase64Url}`,
    );
  });
});
