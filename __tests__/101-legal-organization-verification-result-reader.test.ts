/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { describe, expect, it } from '@jest/globals';

import {
  cloneIcaVerifyTermsResponseSuccessExample,
} from '../src/examples/ica-verify-response';
import { EXAMPLE_PROVIDER_TAX_ID } from '../src/examples/shared';
import {
  EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
  EXAMPLE_REPRESENTATIVE_SAME_AS,
} from '../src/examples/ica-activation-proof';
import {
  getLegalOrganizationVerificationEntriesFromResponseBody,
  readLegalOrganizationVerificationCredentialPairFromResponseBody,
  readLegalOrganizationVerificationTaxIdFromResponseBody,
  readLegalRepresentativeBindingFromResponseBody,
  readLegalRepresentativeSameAsFromResponseBody,
} from '../src/utils/legal-organization-verification-result';

describe('legal organization verification result reader', () => {
  it('reads the credential pair from a direct ICA verify-response body', () => {
    const response = cloneIcaVerifyTermsResponseSuccessExample();

    const pair = readLegalOrganizationVerificationCredentialPairFromResponseBody(response.body);

    expect(pair.verificationEntries).toHaveLength(2);
    expect(pair.organizationCredential.credentialSubject).toBeDefined();
    expect(pair.legalRepresentativeCredential.credentialSubject).toBeDefined();
    expect(readLegalOrganizationVerificationTaxIdFromResponseBody(response.body)).toBe(EXAMPLE_PROVIDER_TAX_ID);
    expect(readLegalRepresentativeSameAsFromResponseBody(response.body)).toBe(EXAMPLE_REPRESENTATIVE_SAME_AS);
    expect(readLegalRepresentativeBindingFromResponseBody(response.body)).toBe(EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID);
  });

  it('reads the credential pair from a GW transaction response with nested icaResponse', () => {
    const response = cloneIcaVerifyTermsResponseSuccessExample();
    const gwTransactionResponse = {
      body: {
        data: [{
          type: 'Organization-transaction-response-v1.0',
          resource: {
            icaResponse: response.body,
          },
        }],
      },
    };

    const entries = getLegalOrganizationVerificationEntriesFromResponseBody(gwTransactionResponse);

    expect(entries).toHaveLength(2);
    expect(readLegalOrganizationVerificationTaxIdFromResponseBody(gwTransactionResponse)).toBe(EXAMPLE_PROVIDER_TAX_ID);
  });

  it('reads the credential pair from a projected vc[] response shape', () => {
    const response = cloneIcaVerifyTermsResponseSuccessExample();
    const organizationCredential = response.body.data[0].resource;
    const legalRepresentativeCredential = response.body.data[1].resource;
    const projectedResponse = {
      body: {
        data: [{
          type: 'Organization-transaction-response-v1.0',
          vc: [organizationCredential, legalRepresentativeCredential],
        }],
      },
    };

    const pair = readLegalOrganizationVerificationCredentialPairFromResponseBody(projectedResponse);

    expect(pair.organizationCredential).toEqual(organizationCredential);
    expect(pair.legalRepresentativeCredential).toEqual(legalRepresentativeCredential);
    expect(readLegalRepresentativeBindingFromResponseBody(projectedResponse)).toBe(EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID);
  });
});
