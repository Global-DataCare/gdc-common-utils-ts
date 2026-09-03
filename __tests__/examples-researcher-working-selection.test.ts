// Flow contract: researcher working-selection examples reuse the shared canonical Bundle entry and claims vocabulary.
import {
  BundleTypes,
  CompositionClaim,
  CompositionRequestPaths,
  CompositionSemanticTypes,
  EXAMPLE_RESEARCHER_WORKING_SELECTION_AUTHOR_ID,
  EXAMPLE_RESEARCHER_WORKING_SELECTION_COMPOSITION_ID,
  EXAMPLE_RESEARCHER_WORKING_SELECTION_DATE,
  EXAMPLE_RESEARCHER_WORKING_SELECTION_SUBJECT_ID,
  HttpRequestMethods,
  JsonLdKeywords,
  ResourceTypesFhirR4,
  buildResearcherWorkingSelectionBundle,
} from '../src/index.js';
import { Format } from '../src/constants/Schemas.js';

describe('researcher working-selection Composition example', () => {
  it('builds one canonical resource.meta.claims entry without legacy entry claims', () => {
    const bundle = buildResearcherWorkingSelectionBundle();
    const entry = bundle.entry[0];
    const legacyEntry = entry as typeof entry & { meta?: { claims?: unknown } };

    expect(bundle.resourceType).toBe(ResourceTypesFhirR4.Bundle);
    expect(bundle.type).toBe(BundleTypes.batch);
    expect(entry.type).toBe(ResourceTypesFhirR4.Composition);
    expect(entry.request).toEqual({
      method: HttpRequestMethods.Post,
      url: CompositionRequestPaths.ResearcherWorkingSelection,
    });
    expect(entry.resource).toMatchObject({
      resourceType: ResourceTypesFhirR4.Composition,
      id: EXAMPLE_RESEARCHER_WORKING_SELECTION_COMPOSITION_ID,
      meta: {
        claims: {
          [JsonLdKeywords.Context]: Format.FHIR_R4,
          [JsonLdKeywords.Type]: CompositionSemanticTypes.ResearcherWorkingSelection,
          [CompositionClaim.Identifier]: EXAMPLE_RESEARCHER_WORKING_SELECTION_COMPOSITION_ID,
          [CompositionClaim.Subject]: EXAMPLE_RESEARCHER_WORKING_SELECTION_SUBJECT_ID,
          [CompositionClaim.Author]: EXAMPLE_RESEARCHER_WORKING_SELECTION_AUTHOR_ID,
          [CompositionClaim.Date]: EXAMPLE_RESEARCHER_WORKING_SELECTION_DATE,
        },
      },
    });
    expect(legacyEntry.meta?.claims).toBeUndefined();
  });
});
