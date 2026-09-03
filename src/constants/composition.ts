import { Format } from './Schemas';
import { ResourceTypesFhirR4 } from './fhir-resource-types';

/** Semantic `@type` values used by Composition profiles across GW and SDK writers. */
export const CompositionSemanticTypes = Object.freeze({
  ResearcherWorkingSelection: 'Composition:ResearcherWorkingSelection',
} as const);

/** Relative request paths owned by shared Composition write contracts. */
export const CompositionRequestPaths = Object.freeze({
  ResearcherWorkingSelection: `digitaltwin/${Format.FHIR_R4}/${ResourceTypesFhirR4.Composition}`,
} as const);

/** Search parameter names supported by the shared Composition selection contract. */
export const CompositionSearchParameterNames = Object.freeze({
  MetaTag: 'Composition.meta-tag',
  Section: 'section',
} as const);
