import { describe, expect, it } from '@jest/globals';
import {
  DataCollectionIds,
  FhirResourceTypeDataCollections,
  HealthcareSummarySectionDataCollections,
  HealthcareSummarySections,
  ResourceTypesFhirR4,
} from '../src/constants/index.js';

describe('shared data collection catalogs', () => {
  it('exposes canonical logical collection ids', () => {
    expect(DataCollectionIds.medications).toBe('medications');
    expect(DataCollectionIds.diagnosticReports).toBe('diagnostic-reports');
    expect(DataCollectionIds.documentReferences).toBe('document-references');
  });

  it('maps IPS summary sections to their supported collections', () => {
    expect(HealthcareSummarySectionDataCollections[HealthcareSummarySections.HistoryOfMedicationUse.attributeValue]).toEqual([
      DataCollectionIds.medications,
    ]);
    expect(HealthcareSummarySectionDataCollections[HealthcareSummarySections.Results.attributeValue]).toEqual([
      DataCollectionIds.observations,
      DataCollectionIds.diagnosticReports,
    ]);
    expect(HealthcareSummarySectionDataCollections[HealthcareSummarySections.PregnancyHistory.attributeValue]).toEqual([
      DataCollectionIds.observations,
    ]);
    expect(HealthcareSummarySectionDataCollections[HealthcareSummarySections.GoalsAndPreferences.attributeValue]).toEqual([
      DataCollectionIds.consents,
    ]);
  });

  it('maps supported FHIR R4 resource families to collection ids', () => {
    expect(FhirResourceTypeDataCollections[ResourceTypesFhirR4.MedicationStatement]).toBe(DataCollectionIds.medications);
    expect(FhirResourceTypeDataCollections[ResourceTypesFhirR4.Observation]).toBe(DataCollectionIds.observations);
    expect(FhirResourceTypeDataCollections[ResourceTypesFhirR4.CarePlan]).toBe(DataCollectionIds.carePlans);
  });
});
