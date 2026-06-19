import { describe, expect, it } from '@jest/globals';

import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { buildIpsClinicalHistoryBundleExample } from '../src/examples/ips-bundle.js';
import { summarizeClinicalBundle } from '../src/utils/clinical-bundle-summary.js';

describe('summarizeClinicalBundle', () => {
  it('returns high-level counts for IPS-like bundles', () => {
    const example = buildIpsClinicalHistoryBundleExample();
    const firstEntry = example.bundleInMemory.data?.[0];
    if (firstEntry?.resource) {
      firstEntry.resource.text = {
        status: 'generated',
        div: '<div>Allergy narrative</div>',
      };
    }

    const summary = summarizeClinicalBundle(example.bundleInMemory);

    expect(summary.totalEntries).toBe(4);
    expect(summary.xhtmlEntries).toBe(1);
    expect(summary.notedEntries).toBe(0);
    expect(summary.resourceTypes).toEqual([
      { resourceType: ResourceTypesFhirR4.AllergyIntolerance, count: 1 },
      { resourceType: ResourceTypesFhirR4.Condition, count: 1 },
      { resourceType: ResourceTypesFhirR4.DocumentReference, count: 1 },
      { resourceType: ResourceTypesFhirR4.MedicationStatement, count: 1 },
    ]);
  });
});
