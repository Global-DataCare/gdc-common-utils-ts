import { describe, expect, it } from '@jest/globals';

import {
  BundleReader,
  getClaimsInBundleEntryAt,
  getClaimsInFirstDataEntry,
} from '../src/utils/bundle-reader';

describe('bundle entry claim readers', () => {
  it('reads claims from one concrete bundle entry array index', () => {
    const bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [
        {
          id: 'entry-1',
          resource: {
            resourceType: 'DocumentReference',
            meta: {
              claims: {
                logicalId: 'doc-1',
                canonicalOnly: 'canonical-value',
              },
            },
          },
        },
        {
          id: 'entry-2',
          resource: {
            resourceType: 'DocumentReference',
            meta: {
              claims: {
                logicalId: 'doc-2',
                canonicalOnly: 'canonical-value-2',
              },
            },
          },
        },
      ],
    };

    expect(getClaimsInBundleEntryAt(bundle, 1)).toEqual({
      logicalId: 'doc-2',
      canonicalOnly: 'canonical-value-2',
    });
    expect(getClaimsInBundleEntryAt(bundle, 99)).toEqual({});
  });

  it('keeps the same canonical view through first-entry and BundleReader helpers', () => {
    const bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [
        {
          id: 'entry-1',
          resource: {
            resourceType: 'DocumentReference',
            meta: {
              claims: {
                logicalId: 'doc-1',
                canonicalOnly: 'canonical-value',
              },
            },
          },
        },
      ],
    };

    expect(getClaimsInFirstDataEntry(bundle)).toEqual({
      logicalId: 'doc-1',
      canonicalOnly: 'canonical-value',
    });

    const reader = new BundleReader(bundle);
    expect(reader.getEntryClaimsByArrayIndex(0)).toEqual({
      logicalId: 'doc-1',
      canonicalOnly: 'canonical-value',
    });
    expect(reader.openEntry(0).getActiveEntryClaims()).toEqual({
      logicalId: 'doc-1',
      canonicalOnly: 'canonical-value',
    });
  });
});
