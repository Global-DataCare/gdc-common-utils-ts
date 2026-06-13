import { describe, expect, it } from '@jest/globals';

import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { ObservationClaim } from '../src/models/interoperable-claims/observation-claims.js';
import {
  EXAMPLE_VITAL_SIGN_HEART_RATE_INPUT,
  buildExampleVitalSignsObservationBundle,
  buildExampleVitalSignsObservationBundleSession,
  buildVitalSignObservationEntry,
} from '../src/examples/vital-signs.js';

describe('examples/vital-signs', () => {
  it('builds one Observation bundle entry from one vital-sign input', () => {
    const entry = buildVitalSignObservationEntry(EXAMPLE_VITAL_SIGN_HEART_RATE_INPUT);

    expect(entry.type).toBe(`${ResourceTypesFhirR4.Observation}-entry-v1.0`);
    expect(entry.resource?.resourceType).toBe(ResourceTypesFhirR4.Observation);
    expect(entry.resource?.meta?.claims?.[ObservationClaim.Identifier]).toBe(EXAMPLE_VITAL_SIGN_HEART_RATE_INPUT.identifier);
  });

  it('builds a direct high-level bundle with four Observation entries', () => {
    const bundle = buildExampleVitalSignsObservationBundle();

    expect(bundle.resourceType).toBe('Bundle');
    expect(bundle.type).toBe('collection');
    expect(bundle.data).toHaveLength(4);
    expect(bundle.data.every((entry) => entry.resource?.resourceType === ResourceTypesFhirR4.Observation)).toBe(true);
  });

  it('builds the same four vital signs through the in-memory session editor', () => {
    const bundle = buildExampleVitalSignsObservationBundleSession();

    expect(bundle.resourceType).toBe('Bundle');
    expect(bundle.data).toHaveLength(4);
    expect(bundle.data.every((entry) => entry.resource?.resourceType === ResourceTypesFhirR4.Observation)).toBe(true);
  });
});
