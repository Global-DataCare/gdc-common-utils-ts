/**
 * Flow contract: one clinical Bundle.type=batch may create, update, and delete
 * different resources independently. The typed editor owns FHIR request
 * methods, canonical resource URLs, optimistic version matching, and the rule
 * that DELETE entries have no resource body. Callers never author raw request
 * literals. Invalid lifecycle combinations fail before transport.
 */
import { HttpRequestMethods } from '../src/constants/http.js';
import {
  BundleEditableResourceTypes,
  BundleTypes,
} from '../src/models/bundle-editor-types.js';
import { BundleEditor } from '../src/utils/bundle-editor-core.js';
import '../src/utils/allergy-intolerance-entry-editor.js';
import '../src/utils/observation-entry-editor.js';

const OBSERVATION_ID = 'observation-blood-pressure-001';
const ALLERGY_ID = 'allergy-penicillin-001';
const ALLERGY_VERSION_ID = 'zClinicalVersion001';

describe('101: mixed clinical batch entry operations', () => {
  test('builds independent POST and version-checked DELETE entries through typed methods', () => {
    // Step 1. Create one batch without declaring one operation for every entry.
    const batch = new BundleEditor().setBundleType(BundleTypes.batch);

    // Step 2. Stage a create through the clinical entry editor.
    batch
      .newEntryAs(BundleEditableResourceTypes.observation, OBSERVATION_ID)
      .create();

    // Step 3. Stage an independent delete and optimistic version condition.
    batch
      .newEntryAs(BundleEditableResourceTypes.allergyIntolerance, ALLERGY_ID)
      .delete()
      .ifMatch(ALLERGY_VERSION_ID);

    // Step 4. Materialize standard FHIR batch request semantics.
    const built = batch.build();
    expect(built.type).toBe(BundleTypes.batch);
    expect(built.entry).toHaveLength(2);
    expect(built.entry[0]).toMatchObject({
      request: {
        method: HttpRequestMethods.Post,
        url: BundleEditableResourceTypes.observation,
      },
      resource: {
        resourceType: BundleEditableResourceTypes.observation,
        id: OBSERVATION_ID,
      },
    });
    expect(built.entry[1]).toMatchObject({
      request: {
        method: HttpRequestMethods.Delete,
        url: `${BundleEditableResourceTypes.allergyIntolerance}/${ALLERGY_ID}`,
        ifMatch: `W/"${ALLERGY_VERSION_ID}"`,
      },
    });
    expect(built.entry[1].resource).toBeUndefined();
  });

  test('rejects delete without a technical resource id and ifMatch on create', () => {
    const batch = new BundleEditor().setBundleType(BundleTypes.batch);
    const deleteEntry = batch
      .newEntryAs(BundleEditableResourceTypes.allergyIntolerance, ALLERGY_ID)
      .setResourceId(null)
      .setFullUrl(null);

    expect(() => deleteEntry.delete())
      .toThrow('delete requires a technical resource id');

    const createEntry = batch
      .newEntryAs(BundleEditableResourceTypes.observation, OBSERVATION_ID)
      .create();
    expect(() => createEntry.ifMatch(ALLERGY_VERSION_ID))
      .toThrow('ifMatch is supported only for update or delete entries');
  });
});
