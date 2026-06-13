import { FhirCodeSystems } from './fhir-code-systems';

export type CodingDescriptor = Readonly<{
  system: string;
  code: string;
  display?: string;
  claim: string;
}>;

function defineCoding(system: string, code: string, display?: string): CodingDescriptor {
  return Object.freeze({
    system,
    code,
    display,
    claim: `${system}|${code}`,
  });
}

/**
 * Canonical `Observation.category` descriptors.
 *
 * Source:
 * - HL7 Terminology Observation Category code system:
 *   https://terminology.hl7.org/7.1.0/CodeSystem-observation-category.html
 *
 * Keep category in `Observation.category`.
 * Do not store category codes in `Observation.value-concept-*`.
 */
export const ObservationCategoryCodes = Object.freeze({
  SocialHistory: defineCoding(FhirCodeSystems.ObservationCategory, 'social-history', 'Social History'),
  VitalSigns: defineCoding(FhirCodeSystems.ObservationCategory, 'vital-signs', 'Vital Signs'),
  Imaging: defineCoding(FhirCodeSystems.ObservationCategory, 'imaging', 'Imaging'),
  Laboratory: defineCoding(FhirCodeSystems.ObservationCategory, 'laboratory', 'Laboratory'),
  Procedure: defineCoding(FhirCodeSystems.ObservationCategory, 'procedure', 'Procedure'),
  Survey: defineCoding(FhirCodeSystems.ObservationCategory, 'survey', 'Survey'),
  Exam: defineCoding(FhirCodeSystems.ObservationCategory, 'exam', 'Exam'),
  Therapy: defineCoding(FhirCodeSystems.ObservationCategory, 'therapy', 'Therapy'),
  Activity: defineCoding(FhirCodeSystems.ObservationCategory, 'activity', 'Activity'),
} as const);
