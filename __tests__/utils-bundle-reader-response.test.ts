// Flow contract: Bundle response readers surface canonical OperationOutcome issue text without hiding terminal failures.
import { describe, expect, it } from '@jest/globals';

import {
  BundleReader,
  readFirstBundleResourceFromResponseBody,
  unwrapBundleLikeResponseBody,
} from '../src';

describe('bundle reader response helpers', () => {
  it('uses OperationOutcome issue.details.text when diagnostics is absent', () => {
    const reader = new BundleReader({
      resourceType: 'Bundle',
      type: 'batch-response',
      entry: [{
        response: {
          status: '500',
          outcome: {
            resourceType: 'OperationOutcome',
            issue: [{
              severity: 'error',
              code: 'processing',
              details: { text: 'Clinical section provenance is invalid.' },
            }],
          },
        },
      }],
    });

    expect(reader.getResponseAnalysis().issueDiagnostics).toEqual([
      'Clinical section provenance is invalid.',
    ]);
  });

  it('unwraps one nested poll body bundle without leaking body.body plumbing to callers', () => {
    expect(unwrapBundleLikeResponseBody({
      body: {
        resourceType: 'Bundle',
        type: 'collection',
        data: [{ resource: { resourceType: 'DocumentReference', id: 'doc-1' } }],
      },
    })).toEqual({
      resourceType: 'Bundle',
      type: 'collection',
      data: [{ resource: { resourceType: 'DocumentReference', id: 'doc-1' } }],
    });
  });

  it('reads the first resource from either direct or nested bundle responses', () => {
    expect(readFirstBundleResourceFromResponseBody({
      body: {
        resourceType: 'Bundle',
        type: 'collection',
        data: [{ resource: { resourceType: 'DocumentReference', id: 'doc-1' } }],
      },
    })).toEqual({
      resourceType: 'DocumentReference',
      id: 'doc-1',
    });
  });
});
