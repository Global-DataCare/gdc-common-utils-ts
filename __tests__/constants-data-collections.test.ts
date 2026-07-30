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
    expect(DataCollectionIds.deviceUseStatements).toBe('device-use-statements');
    expect(DataCollectionIds.flags).toBe('flags');
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
    expect(HealthcareSummarySectionDataCollections[HealthcareSummarySections.MedicalDevices.attributeValue]).toEqual([
      DataCollectionIds.deviceUseStatements,
    ]);
    expect(HealthcareSummarySectionDataCollections[HealthcareSummarySections.Alert.attributeValue]).toEqual([
      DataCollectionIds.flags,
    ]);
  });

  it('maps supported FHIR R4 resource families to collection ids', () => {
    expect(FhirResourceTypeDataCollections[ResourceTypesFhirR4.MedicationStatement]).toBe(DataCollectionIds.medications);
    expect(FhirResourceTypeDataCollections[ResourceTypesFhirR4.Observation]).toBe(DataCollectionIds.observations);
    expect(FhirResourceTypeDataCollections[ResourceTypesFhirR4.CarePlan]).toBe(DataCollectionIds.carePlans);
    expect(FhirResourceTypeDataCollections[ResourceTypesFhirR4.DeviceUseStatement]).toBe(DataCollectionIds.deviceUseStatements);
    expect(FhirResourceTypeDataCollections[ResourceTypesFhirR4.Flag]).toBe(DataCollectionIds.flags);
  });
});
