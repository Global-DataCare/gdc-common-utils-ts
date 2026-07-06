/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { describe, expect, it } from '@jest/globals';

import {
  BundleEntryClaimsContext,
  ClaimConsent,
  createConsentLifecycleResultReader,
  createLifecycleResultReader,
  IssueSeverity,
} from '../src';

describe('101: consent lifecycle result reader', () => {
  it('reads consent result wrappers through one consent-named alias without changing the neutral output contract', () => {
    const resultBody = {
      body: {
        data: [
          {
            meta: {
              claims: {
                '@context': BundleEntryClaimsContext,
                [ClaimConsent.identifier]: 'urn:uuid:consent-1',
              },
            },
            response: {
              status: '200',
            },
          },
          {
            meta: {
              claims: {
                '@context': BundleEntryClaimsContext,
                [ClaimConsent.identifier]: 'urn:uuid:consent-2',
              },
            },
            response: {
              status: '409',
              outcome: {
                issue: [{
                  severity: IssueSeverity.Error,
                  diagnostics: 'consent is already revoked',
                }],
              },
            },
          },
        ],
      },
    };

    const genericReader = createLifecycleResultReader(resultBody);
    const consentReader = createConsentLifecycleResultReader(resultBody);

    expect(consentReader.getSuccessfulIdentifiers()).toEqual(['urn:uuid:consent-1']);
    expect(consentReader.getFailedIdentifiers()).toEqual(['urn:uuid:consent-2']);
    expect(consentReader.getEntrySummaryByIdentifier('urn:uuid:consent-2')).toEqual(
      expect.objectContaining({
        identifier: 'urn:uuid:consent-2',
        responseStatus: '409',
        isSuccessful: false,
      }),
    );
    expect(consentReader.getResponseAnalysis()).toEqual(genericReader.getResponseAnalysis());
  });
});
