/**
 * Canonical FHIR R4 `resourceType` names shared across GW and SDK packages.
 *
 * Use these constants instead of inline strings such as `"Observation"`
 * or `"DocumentReference"` when building bundles, filters, or SDK facades.
 */
export const ResourceTypesFhirR4 = Object.freeze({
  AdverseEvent: 'AdverseEvent',
  AllergyIntolerance: 'AllergyIntolerance',
  Appointment: 'Appointment',
  AppointmentResponse: 'AppointmentResponse',
  Bundle: 'Bundle',
  CarePlan: 'CarePlan',
  ClinicalImpression: 'ClinicalImpression',
  Communication: 'Communication',
  Composition: 'Composition',
  Condition: 'Condition',
  Consent: 'Consent',
  Coverage: 'Coverage',
  Device: 'Device',
  DeviceUseStatement: 'DeviceUseStatement',
  DiagnosticReport: 'DiagnosticReport',
  DocumentReference: 'DocumentReference',
  Encounter: 'Encounter',
  Flag: 'Flag',
  ImagingStudy: 'ImagingStudy',
  Immunization: 'Immunization',
  ImmunizationRecommendation: 'ImmunizationRecommendation',
  Invoice: 'Invoice',
  Location: 'Location',
  Medication: 'Medication',
  MedicationRequest: 'MedicationRequest',
  MedicationStatement: 'MedicationStatement',
  Observation: 'Observation',
  Organization: 'Organization',
  Patient: 'Patient',
  Practitioner: 'Practitioner',
  PractitionerRole: 'PractitionerRole',
  Procedure: 'Procedure',
  RelatedPerson: 'RelatedPerson',
  Specimen: 'Specimen',
} as const);

/** One canonical FHIR R4 `resourceType` value. */
export type ResourceTypeFhirR4 =
  typeof ResourceTypesFhirR4[keyof typeof ResourceTypesFhirR4];

/**
 * Backwards-compatible alias for the former generic name.
 *
 * Prefer `ResourceTypesFhirR4` in new code so later R5/R6 catalogs can coexist
 * without ambiguity.
 */
export const FhirResourceTypes = ResourceTypesFhirR4;
