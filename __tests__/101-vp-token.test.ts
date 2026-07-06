/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

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
  createVP,
} from '../src/utils/vp-token.js';
import { createJwtSigner } from '../src/utils/jwt-signer.js';

describe('VP Token 101 legal organization onboarding sequence', () => {
  it('creates one controller signer and uses it to prepare one legal-onboarding vp_token', async () => {
    const signer = await createJwtSigner({
      alg: 'ES384',
      seed: 'organization-controller-seed-001',
      purpose: 'organization-controller',
    });

    expect(signer.getMode()).toBe('deterministic');
    expect(signer.getPublicJwk()).toMatchObject({
      kty: 'EC',
      crv: 'P-384',
      use: 'sig',
    });
    expect(signer.getKid()).toBe(signer.getThumbprintUri());

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

    const prepared = signer.prepareJwt({
      payload: vpPayload,
    });
    const signingBytes = prepared.signingBytes;
    expect(prepared.protectedHeader.kid).toBe(signer.getKid());

    expect(prepared.signingInput).toBe(
      `${prepared.encodedHeader}.${prepared.encodedPayload}`,
    );
    expect(Array.from(signingBytes)).toEqual(
      Array.from(Buffer.from(prepared.signingInput, 'utf8'))
    );

    const signatureBase64Url = 'external-kms-signature-base64url';
    const vpToken = signer.buildCompact(signatureBase64Url, prepared);

    expect(vpToken).toBe(
      `${prepared.encodedHeader}.${prepared.encodedPayload}.${signatureBase64Url}`,
    );
  });
});
