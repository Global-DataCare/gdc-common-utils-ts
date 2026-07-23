import { describe, expect, it } from '@jest/globals';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { ClaimConsent } from '../src/models/consent-rule.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import { BundleReader } from '../src/utils/bundle-reader.js';
import { BundleQuery } from '../src/utils/bundle-query.js';

describe('utils/bundle-query', () => {
  it('is reusable outside communication and supports IDs + filters + URL resolution', () => {
    const bundle = {
      resourceType: 'Bundle' as const,
      type: 'batch',
      data: [
        {
          id: 'consent-1',
          fullUrl: 'urn:uuid:consent-1',
          type: 'Consent-edit-request-v1.0',
          resource: {
            resourceType: ResourceTypesFhirR4.Consent,
            meta: {
              claims: {
                [ClaimConsent.identifier]: 'consent-1',
                [ClaimConsent.action]: 'LOINC|48765-2',
                [ClaimConsent.date]: '2026-06-01',
              },
            },
          },
        },
        {
          id: 'med-1',
          fullUrl: 'urn:uuid:med-1',
          type: 'MedicationStatement-edit-request-v1.0',
          resource: {
            resourceType: ResourceTypesFhirR4.MedicationStatement,
            meta: {
              claims: {
                [MedicationStatementClaim.Identifier]: 'med-1',
                [MedicationStatementClaim.Category]: 'LOINC|10160-0',
                [MedicationStatementClaim.Effective]: '2026-07-10',
              },
            },
          },
        },
      ],
    };

    const query = new BundleQuery(bundle);

    // Compatibility path: existing callers keep working during migration.
    const legacyIds = query.getResourceIds({
      sections: ['LOINC|10160-0'],
      resourceTypes: [ResourceTypesFhirR4.MedicationStatement],
      dateFrom: '2026-07-01',
      dateTo: '2026-07-31',
    });

    expect(legacyIds).toEqual(['med-1']);

    // Canonical path: BundleReader and FhirDocumentFacade use one filter shape.
    const ids = query.getResourceIds({
      sections: ['LOINC|10160-0'],
      types: [ResourceTypesFhirR4.MedicationStatement],
      date: {
        start: '2026-07-01',
        end: '2026-07-31',
      },
    });

    expect(ids).toEqual(['med-1']);
    expect(query.getResourceIds({
      types: [ResourceTypesFhirR4.AllergyIntolerance],
      date: { start: '2026-07-01', end: '2026-07-31' },
    })).toEqual([]);

    const entries = query.getResourceEntriesByIds(ids);
    expect(entries).toHaveLength(1);
    expect(entries[0].resource?.resourceType).toBe(ResourceTypesFhirR4.MedicationStatement);

    expect(query.getEntryUrl('med-1')).toBe('urn:uuid:med-1');
    expect(query.getEntryUrl('missing-id')).toBeUndefined();
  });

  it('navigates visible resources in a native FHIR document by fullUrl, resource id and fallback id', () => {
    const reader = new BundleReader({
      resourceType: 'Bundle',
      type: 'document',
      entry: [
        {
          resource: {
            resourceType: ResourceTypesFhirR4.Composition,
          },
        },
        {
          fullUrl: 'urn:uuid:allergy-1',
          resource: {
            resourceType: ResourceTypesFhirR4.AllergyIntolerance,
            id: 'allergy-1',
          },
        },
      ],
    });

    expect(reader.getEntryCount()).toBe(2);
    expect(reader.getVisibleResourceCount()).toBe(2);
    expect(reader.getVisibleResourceIds()).toEqual([
      `${ResourceTypesFhirR4.Composition}#0`,
      'urn:uuid:allergy-1',
    ]);
    expect(reader.getVisibleEntryIndexes()).toEqual([0, 1]);
    expect(reader.getEntryIndexByIdentifier('allergy-1')).toBe(1);
    expect(reader.getEntryIndexByIdentifier('missing')).toBeUndefined();
  });
});
