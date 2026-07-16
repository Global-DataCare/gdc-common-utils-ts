import { describe, expect, it, jest } from '@jest/globals';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { ObservationClaim } from '../src/models/interoperable-claims/observation-claims.js';
import {
  VitalSignDayBatchClaim,
  openOrCreateVitalSignDayBatchBundle,
  resolveVitalSignDayBatchId,
} from '../src/utils/vital-sign-day-batch.js';

describe('utils/vital-sign-day-batch', () => {
  it('reuses the existing actor-owned batch id for the same subject and day', () => {
    const existingBundle = {
      id: 'urn:uuid:existing-day-batch',
      resourceType: ResourceTypesFhirR4.Bundle,
      type: 'collection',
      meta: {
        claims: {
          [VitalSignDayBatchClaim.Identifier]: 'urn:uuid:existing-day-batch',
          [VitalSignDayBatchClaim.Subject]: 'did:web:subject-1',
          [VitalSignDayBatchClaim.Actor]: 'Practitioner/prac-1',
          [VitalSignDayBatchClaim.Day]: '2026-07-07',
        },
      },
      data: [
        {
          id: 'obs-1',
          fullUrl: 'urn:uuid:obs-1',
          type: 'Observation-entry-v1.0',
          resource: {
            resourceType: ResourceTypesFhirR4.Observation,
            meta: {
              claims: {
                [ObservationClaim.Identifier]: 'obs-1',
                [ObservationClaim.Subject]: 'did:web:subject-1',
                [ObservationClaim.Date]: '2026-07-07T08:30:00.000Z',
              },
            },
          },
        },
      ],
    };

    const result = resolveVitalSignDayBatchId({
      bundle: existingBundle,
      subject: 'did:web:subject-1',
      actor: 'Practitioner/prac-1',
      date: '2026-07-07',
      entry: {
        id: 'obs-2',
        fullUrl: 'urn:uuid:obs-2',
        type: 'Observation-entry-v1.0',
        resource: {
          resourceType: ResourceTypesFhirR4.Observation,
          meta: {
            claims: {
              [ObservationClaim.Identifier]: 'obs-2',
              [ObservationClaim.Subject]: 'did:web:subject-1',
              [ObservationClaim.Date]: '2026-07-07T10:00:00.000Z',
            },
          },
        },
      },
    });

    expect(result.reused).toBe(true);
    expect(result.batchId).toBe('urn:uuid:existing-day-batch');
    expect(result.bundle.id).toBe('urn:uuid:existing-day-batch');
    expect(result.bundle.meta?.claims?.[VitalSignDayBatchClaim.Actor]).toBe('Practitioner/prac-1');
    expect(result.bundle.data).toHaveLength(2);
    expect(result.bundle.data[1].resource?.meta?.claims?.[ObservationClaim.Identifier]).toBe('obs-2');
  });

  it('creates a fresh UUID-backed batch id when no matching day batch exists', () => {
    const spy = jest.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000111');

    const result = openOrCreateVitalSignDayBatchBundle({
      subject: 'did:web:subject-2',
      actor: 'Practitioner/prac-2',
      date: '2026-07-08T09:15:00.000Z',
      entry: {
        id: 'obs-3',
        fullUrl: 'urn:uuid:obs-3',
        type: 'Observation-entry-v1.0',
        resource: {
          resourceType: ResourceTypesFhirR4.Observation,
          meta: {
            claims: {
              [ObservationClaim.Identifier]: 'obs-3',
              [ObservationClaim.Subject]: 'did:web:subject-2',
              [ObservationClaim.Date]: '2026-07-08T09:15:00.000Z',
            },
          },
        },
      },
    });

    spy.mockRestore();

    expect(result.id).toBe('urn:uuid:00000000-0000-4000-8000-000000000111');
    expect(result.meta?.claims?.[VitalSignDayBatchClaim.Identifier]).toBe('urn:uuid:00000000-0000-4000-8000-000000000111');
    expect(result.meta?.claims?.[VitalSignDayBatchClaim.Subject]).toBe('did:web:subject-2');
    expect(result.meta?.claims?.[VitalSignDayBatchClaim.Actor]).toBe('Practitioner/prac-2');
    expect(result.meta?.claims?.[VitalSignDayBatchClaim.Day]).toBe('2026-07-08');
    expect(result.data).toHaveLength(1);
  });

  it('creates a new batch when the actor changes for the same day', () => {
    const existingBundle = {
      id: 'urn:uuid:existing-day-batch',
      resourceType: ResourceTypesFhirR4.Bundle,
      type: 'collection',
      meta: {
        claims: {
          [VitalSignDayBatchClaim.Identifier]: 'urn:uuid:existing-day-batch',
          [VitalSignDayBatchClaim.Subject]: 'did:web:subject-3',
          [VitalSignDayBatchClaim.Actor]: 'Practitioner/prac-1',
          [VitalSignDayBatchClaim.Day]: '2026-07-07',
        },
      },
      data: [],
    };

    const result = resolveVitalSignDayBatchId({
      bundle: existingBundle,
      subject: 'did:web:subject-3',
      actor: 'Practitioner/prac-9',
      date: '2026-07-07',
    });

    expect(result.reused).toBe(false);
    expect(result.batchId).not.toBe('urn:uuid:existing-day-batch');
    expect(result.bundle.meta?.claims?.[VitalSignDayBatchClaim.Actor]).toBe('Practitioner/prac-9');
  });
});