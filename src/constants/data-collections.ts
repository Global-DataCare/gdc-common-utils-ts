import { ResourceTypesFhirR4 } from './fhir-resource-types';
import { HealthcareSummarySections } from './healthcare';

/**
 * Reusable logical collection ids for normalized healthcare persistence and
 * indexing layers.
 *
 * They are intentionally domain-level names, not backend-specific table names,
 * so gateways, SDK tooling, and other runtimes can share one stable taxonomy
 * when mapping IPS sections or FHIR resource families to indexed collections.
 */
export const DataCollectionIds = Object.freeze({
  adverseEvents: 'adverse-events',
  allergies: 'allergies',
  carePlans: 'care-plans',
  communications: 'communications',
  composition: 'composition',
  conditions: 'conditions',
  consents: 'consents',
  diagnosticReports: 'diagnostic-reports',
  documentReferences: 'document-references',
  encounters: 'encounters',
  imagingStudies: 'imaging-studies',
  immunizations: 'immunizations',
  medications: 'medications',
  observations: 'observations',
  procedures: 'procedures',
  relatedPersons: 'related-persons',
} as const);

/**
 * Canonical IPS summary section -> collection mapping.
 *
 * Public search contracts should stay section-first. Internals can then fan
 * out to the collections declared here without making callers pick one
 * concrete `resourceType`.
 */
export const HealthcareSummarySectionDataCollections: Readonly<Record<string, readonly string[]>> = Object.freeze({
  [HealthcareSummarySections.HistoryOfMedicationUse.attributeValue]: Object.freeze([DataCollectionIds.medications]),
  [HealthcareSummarySections.AllergiesAndIntolerances.attributeValue]: Object.freeze([DataCollectionIds.allergies]),
  [HealthcareSummarySections.ProblemList.attributeValue]: Object.freeze([DataCollectionIds.conditions]),
  [HealthcareSummarySections.Results.attributeValue]: Object.freeze([
    DataCollectionIds.observations,
    DataCollectionIds.diagnosticReports,
  ]),
  [HealthcareSummarySections.Procedures.attributeValue]: Object.freeze([DataCollectionIds.procedures]),
  [HealthcareSummarySections.Immunizations.attributeValue]: Object.freeze([DataCollectionIds.immunizations]),
  [HealthcareSummarySections.FunctionalStatus.attributeValue]: Object.freeze([DataCollectionIds.conditions]),
  [HealthcareSummarySections.PlanOfCare.attributeValue]: Object.freeze([DataCollectionIds.carePlans]),
  [HealthcareSummarySections.SocialHistory.attributeValue]: Object.freeze([DataCollectionIds.observations]),
  [HealthcareSummarySections.VitalSigns.attributeValue]: Object.freeze([DataCollectionIds.observations]),
  [HealthcareSummarySections.AdvanceDirectives.attributeValue]: Object.freeze([DataCollectionIds.consents]),
  [HealthcareSummarySections.HistoryOfPastIllness.attributeValue]: Object.freeze([DataCollectionIds.conditions]),
  [HealthcareSummarySections.PregnancyHistory.attributeValue]: Object.freeze([DataCollectionIds.observations]),
  [HealthcareSummarySections.GoalsAndPreferences.attributeValue]: Object.freeze([DataCollectionIds.consents]),
  [HealthcareSummarySections.Alert.attributeValue]: Object.freeze([]),
  [HealthcareSummarySections.MedicalDevices.attributeValue]: Object.freeze([]),
});

/**
 * Canonical FHIR R4 resource family -> collection mapping for normalized
 * storage/index adapters.
 */
export const FhirResourceTypeDataCollections = Object.freeze({
  [ResourceTypesFhirR4.AdverseEvent]: DataCollectionIds.adverseEvents,
  [ResourceTypesFhirR4.AllergyIntolerance]: DataCollectionIds.allergies,
  [ResourceTypesFhirR4.CarePlan]: DataCollectionIds.carePlans,
  [ResourceTypesFhirR4.Condition]: DataCollectionIds.conditions,
  [ResourceTypesFhirR4.Consent]: DataCollectionIds.consents,
  [ResourceTypesFhirR4.DiagnosticReport]: DataCollectionIds.diagnosticReports,
  [ResourceTypesFhirR4.Encounter]: DataCollectionIds.encounters,
  [ResourceTypesFhirR4.ImagingStudy]: DataCollectionIds.imagingStudies,
  [ResourceTypesFhirR4.Immunization]: DataCollectionIds.immunizations,
  [ResourceTypesFhirR4.MedicationStatement]: DataCollectionIds.medications,
  [ResourceTypesFhirR4.Observation]: DataCollectionIds.observations,
  [ResourceTypesFhirR4.Procedure]: DataCollectionIds.procedures,
  [ResourceTypesFhirR4.RelatedPerson]: DataCollectionIds.relatedPersons,
} as const);
