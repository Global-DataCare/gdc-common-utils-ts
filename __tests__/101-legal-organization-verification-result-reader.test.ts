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
  readOrganizationControllerBindingFromResponseBody,
  readOrganizationControllerCredentialFromResponseBody,
  readOrganizationControllerCredentialsFromResponseBody,
  readOrganizationControllerSameAsFromResponseBody,
  readServiceControllerCredentialFromResponseBody,
  readServiceControllerCredentialsFromResponseBody,
} from '../src/utils/legal-organization-verification-result';

describe('legal organization verification result reader', () => {
  it('reads the representative pair plus the independent controller VC from a direct ICA response', () => {
    const response = cloneIcaVerifyTermsResponseSuccessExample();

    const pair = readLegalOrganizationVerificationCredentialPairFromResponseBody(response.body);

    expect(pair.verificationEntries).toHaveLength(3);
    expect(pair.organizationCredential.credentialSubject).toBeDefined();
    expect(pair.legalRepresentativeCredential.credentialSubject).toBeDefined();
    expect(readLegalOrganizationVerificationTaxIdFromResponseBody(response.body)).toBe(EXAMPLE_PROVIDER_TAX_ID);
    expect(readLegalRepresentativeSameAsFromResponseBody(response.body)).toBe(EXAMPLE_REPRESENTATIVE_SAME_AS);
    expect(readLegalRepresentativeBindingFromResponseBody(response.body)).toBe(EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID);
    expect(readOrganizationControllerCredentialsFromResponseBody(response.body)).toHaveLength(1);
    expect(readServiceControllerCredentialsFromResponseBody(response.body)).toHaveLength(1);
    expect((pair.legalRepresentativeCredential.credentialSubject as any).hasOccupation.occupationalCategory)
      .toBe('ISCO-08|1120');
    expect((pair.legalRepresentativeCredential.credentialSubject as any).hasOccupation.name).toBeUndefined();
    const controllerOwner = (readOrganizationControllerCredentialFromResponseBody(response.body)?.credentialSubject as any)
      .owner;
    expect(controllerOwner.additionalType).toBe('RESPRSN');
    expect(controllerOwner.hasOccupation).toEqual({
      '@type': 'Occupation',
      occupationalCategory: 'ISCO-08|1330',
    });
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

    expect(entries).toHaveLength(3);
    expect(readLegalOrganizationVerificationTaxIdFromResponseBody(gwTransactionResponse)).toBe(EXAMPLE_PROVIDER_TAX_ID);
  });

  it('reads the credential pair from a projected vc[] response shape', () => {
    const response = cloneIcaVerifyTermsResponseSuccessExample();
    const organizationCredential = response.body.data[0].resource;
    const legalRepresentativeCredential = response.body.data[1].resource;
    const organizationControllerCredential = response.body.data[2].resource;
    const projectedResponse = {
      body: {
        data: [{
          type: 'Organization-transaction-response-v1.0',
          vc: [organizationCredential, legalRepresentativeCredential, organizationControllerCredential],
        }],
      },
    };

    const pair = readLegalOrganizationVerificationCredentialPairFromResponseBody(projectedResponse);

    expect(pair.organizationCredential).toEqual(organizationCredential);
    expect(pair.legalRepresentativeCredential).toEqual(legalRepresentativeCredential);
    expect(readLegalRepresentativeBindingFromResponseBody(projectedResponse)).toBe(EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID);
  });

  it('reads an independently bound organization-controller service credential', () => {
    const response = cloneIcaVerifyTermsResponseSuccessExample();
    const controllerCredential = response.body.data[2].resource as any;

    expect(readOrganizationControllerCredentialsFromResponseBody(response.body)).toEqual([controllerCredential]);
    expect(readOrganizationControllerCredentialFromResponseBody(response.body)).toEqual(controllerCredential);
    expect(readOrganizationControllerSameAsFromResponseBody(response.body)).toBe(EXAMPLE_REPRESENTATIVE_SAME_AS);
    expect(readOrganizationControllerBindingFromResponseBody(response.body)).toBe(
      EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
    );

    const secondControllerCredential = {
      ...controllerCredential,
      credentialSubject: {
        ...controllerCredential.credentialSubject,
        owner: {
          ...controllerCredential.credentialSubject.owner,
          sameAs: 'urn:multibase:zSecondTechnicalController',
        },
      },
    };
    response.body.data.push({
      type: 'ServiceController-verification-v1.0',
      response: { status: '200' },
      resource: secondControllerCredential,
    } as never);
    expect(readOrganizationControllerCredentialsFromResponseBody(response.body)).toHaveLength(2);
    expect(readServiceControllerCredentialFromResponseBody(
      response.body,
      'urn:multibase:zSecondTechnicalController',
    )).toEqual(secondControllerCredential);
    expect(readOrganizationControllerCredentialFromResponseBody(
      response.body,
      'urn:multibase:zSecondTechnicalController',
    )).toEqual(secondControllerCredential);
  });

  it('does not substitute the legal-representative credential when no controller credential exists', () => {
    const response = cloneIcaVerifyTermsResponseSuccessExample();
    response.body.data = response.body.data.filter((entry: any) => (
      !entry.resource?.type?.includes('ServiceControllerCredential')
    ));
    response.body.total = 2;

    expect(readOrganizationControllerCredentialsFromResponseBody(response.body)).toEqual([]);
    expect(readOrganizationControllerCredentialFromResponseBody(response.body)).toBeUndefined();
    expect(readOrganizationControllerSameAsFromResponseBody(response.body)).toBeUndefined();
    expect(readOrganizationControllerBindingFromResponseBody(response.body)).toBeUndefined();
  });
});
