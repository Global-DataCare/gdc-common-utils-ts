import { describe, expect, it } from '@jest/globals';

import {
  readFirstBundleResourceFromResponseBody,
  unwrapBundleLikeResponseBody,
} from '../src/utils/bundle-reader';

describe('bundle reader response helpers', () => {
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
