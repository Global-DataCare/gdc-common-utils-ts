/**
 * Canonical FHIR/HL7 code system URLs shared across GW and SDK packages.
 *
 * Use these constants instead of inline system strings when building
 * FHIR codings, filters, or test fixtures.
 */
export const FhirCodeSystems = Object.freeze({
  Loinc: 'http://loinc.org',
  SnomedCt: 'http://snomed.info/sct',
  Ucum: 'http://unitsofmeasure.org',
  CommunicationCategory: 'http://terminology.hl7.org/CodeSystem/communication-category',
  ObservationCategory: 'http://terminology.hl7.org/CodeSystem/observation-category',
} as const);
