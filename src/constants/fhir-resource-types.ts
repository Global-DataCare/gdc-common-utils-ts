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
  Invoice: 'Invoice',
  Location: 'Location',
  MedicationStatement: 'MedicationStatement',
  Observation: 'Observation',
  Organization: 'Organization',
  Procedure: 'Procedure',
  RelatedPerson: 'RelatedPerson',
} as const);

/**
 * Backwards-compatible alias for the former generic name.
 *
 * Prefer `ResourceTypesFhirR4` in new code so later R5/R6 catalogs can coexist
 * without ambiguity.
 */
export const FhirResourceTypes = ResourceTypesFhirR4;
