import { Format } from '../constants/Schemas';
import { CompositionRequestPaths, CompositionSemanticTypes } from '../constants/composition';
import { HealthcareBasicSections } from '../constants/healthcare';
import { HttpAuthorizationSchemes, HttpRequestMethods } from '../constants/http';
import { JsonLdKeywords } from '../constants/jsonld';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { UrnPrefixes } from '../constants/urn';
import { BundleTypes } from '../models/bundle-editor-types';
import { CompositionClaim } from '../models/interoperable-claims/composition-claims';
import {
  EXAMPLE_COMPOSITION_DATE_MEDICATION_DOCUMENT,
  EXAMPLE_LICENSE_SEAT_UUID_ACTIVE,
  EXAMPLE_PROFESSIONAL_DID,
} from './shared';

export const EXAMPLE_RESEARCHER_WORKING_SELECTION_COMPOSITION_ID =
  EXAMPLE_LICENSE_SEAT_UUID_ACTIVE;
export const EXAMPLE_RESEARCHER_WORKING_SELECTION_SUBJECT_ID =
  `${UrnPrefixes.Uuid}${EXAMPLE_LICENSE_SEAT_UUID_ACTIVE}` as const;
export const EXAMPLE_RESEARCHER_WORKING_SELECTION_AUTHOR_ID = EXAMPLE_PROFESSIONAL_DID;
export const EXAMPLE_RESEARCHER_WORKING_SELECTION_DATE =
  EXAMPLE_COMPOSITION_DATE_MEDICATION_DOCUMENT;
export const EXAMPLE_RESEARCHER_WORKING_SELECTION_THREAD_ID =
  'researcher-selection-composition-save-001' as const;
export const EXAMPLE_RESEARCHER_WORKING_SELECTION_SEARCH_THREAD_ID =
  'researcher-selection-composition-search-001' as const;
export const EXAMPLE_RESEARCHER_WORKING_SELECTION_ACCESS_TOKEN = 'demo-token' as const;
export const EXAMPLE_RESEARCHER_WORKING_SELECTION_AUTHORIZATION =
  `${HttpAuthorizationSchemes.Bearer} ${EXAMPLE_RESEARCHER_WORKING_SELECTION_ACCESS_TOKEN}` as const;
export const EXAMPLE_RESEARCHER_WORKING_SELECTION_TAG = Object.freeze({
  id: 'Composition.meta.tag[0]',
  system: 'urn:research:tag:score',
  code: '10',
});

export type ResearcherWorkingSelectionInput = Readonly<{
  compositionId?: string;
  subjectId?: string;
  authorId?: string;
  date?: string;
  tag?: Readonly<{ id: string; system: string; code: string }>;
}>;

export function buildResearcherWorkingSelectionBundle(
  input: ResearcherWorkingSelectionInput = {},
) {
  const compositionId = input.compositionId
    ?? EXAMPLE_RESEARCHER_WORKING_SELECTION_COMPOSITION_ID;
  const subjectId = input.subjectId ?? EXAMPLE_RESEARCHER_WORKING_SELECTION_SUBJECT_ID;
  const authorId = input.authorId ?? EXAMPLE_RESEARCHER_WORKING_SELECTION_AUTHOR_ID;
  const date = input.date ?? EXAMPLE_RESEARCHER_WORKING_SELECTION_DATE;
  const tag = input.tag ? { tag: [input.tag] } : {};

  return {
    resourceType: ResourceTypesFhirR4.Bundle,
    type: BundleTypes.batch,
    entry: [{
      type: ResourceTypesFhirR4.Composition,
      request: {
        method: HttpRequestMethods.Post,
        url: CompositionRequestPaths.ResearcherWorkingSelection,
      },
      resource: {
        resourceType: ResourceTypesFhirR4.Composition,
        id: compositionId,
        meta: {
          claims: {
            [JsonLdKeywords.Context]: Format.FHIR_R4,
            [JsonLdKeywords.Type]: CompositionSemanticTypes.ResearcherWorkingSelection,
            [CompositionClaim.Identifier]: compositionId,
            [CompositionClaim.Subject]: subjectId,
            [CompositionClaim.Section]: HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
            [CompositionClaim.Type]: HealthcareBasicSections.PatientSummaryDocument.attributeValue,
            [CompositionClaim.Author]: authorId,
            [CompositionClaim.Date]: date,
          },
          ...tag,
        },
      },
    }],
  } as const;
}
