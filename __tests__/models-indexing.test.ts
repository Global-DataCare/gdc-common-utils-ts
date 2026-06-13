import { describe, expect, it } from '@jest/globals';

import { FhirCodeSystems } from '../src/constants/fhir-code-systems.js';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { Format } from '../src/constants/Schemas.js';
import {
  EXAMPLE_CLINICAL_EVENT_DATE_TIME,
  EXAMPLE_CONDITION_CODE,
  EXAMPLE_CONDITION_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_FHIR_STATUS_ACTIVE,
  EXAMPLE_FHIR_STATUS_FINAL,
  EXAMPLE_MEDICATION_CODE_RXNORM,
  EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
  EXAMPLE_MEDICATION_STATEMENT_STATUS,
  EXAMPLE_OBSERVATION_CATEGORY_VITAL_SIGNS,
  EXAMPLE_OBSERVATION_COMPONENT_CODE_VALUES_BLOOD_PRESSURE,
  EXAMPLE_OBSERVATION_COMPONENT_NAMES_BLOOD_PRESSURE,
  EXAMPLE_OBSERVATION_COMPONENT_TAGS_BLOOD_PRESSURE,
  EXAMPLE_OBSERVATION_IDENTIFIER,
  EXAMPLE_SUBJECT_DID,
  EXAMPLE_VITAL_SIGN_CODE_HEART_RATE,
  EXAMPLE_VITAL_SIGN_DISPLAY_HEART_RATE,
  EXAMPLE_VITAL_SIGN_UNIT_BEATS_PER_MINUTE,
  EXAMPLE_VITAL_SIGN_VALUE_DIASTOLIC,
  EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE,
  EXAMPLE_VITAL_SIGN_VALUE_SYSTOLIC,
  EXAMPLE_VITAL_SIGNS_NOTE,
} from '../src/examples/shared.js';
import { ConditionClaim } from '../src/models/interoperable-claims/condition-claims.js';
import { DocumentReferenceClaim } from '../src/models/interoperable-claims/document-reference-claims.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import {
  AllowedIndexableClaimAliases,
  AllowedIndexableClaims,
  IndexingClaimSet,
  buildIndexParametersFromClaims,
  isAllowedObservationIndexableClaim,
} from '../src/models/indexing.js';
import { ObservationClaim, ObservationVitalSignsClaimsList } from '../src/models/interoperable-claims/observation-claims.js';

describe('models/indexing', () => {
  it('uses hierarchical AllowedIndexableClaims naming for observation variants', () => {
    expect(AllowedIndexableClaims[ResourceTypesFhirR4.Observation][IndexingClaimSet.General]).toContain(ObservationClaim.CodeValue);
    expect(AllowedIndexableClaims[ResourceTypesFhirR4.Observation][IndexingClaimSet.VitalSigns]).toContain(ObservationClaim.ValueQuantityNumber);
    expect(AllowedIndexableClaims[ResourceTypesFhirR4.Observation][IndexingClaimSet.VitalSigns]).not.toContain(ObservationClaim.Note);
    expect(ObservationVitalSignsClaimsList).toContain(ObservationClaim.Note);
    expect(AllowedIndexableClaimAliases.observationVitalSigns).toBe(
      AllowedIndexableClaims[ResourceTypesFhirR4.Observation][IndexingClaimSet.VitalSigns],
    );
  });

  it('projects allowed observation claims to ParameterData[] for indexing', () => {
    const claims = {
      '@context': Format.FHIR_API,
      [ObservationClaim.Identifier]: EXAMPLE_OBSERVATION_IDENTIFIER,
      [ObservationClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [ObservationClaim.Status]: EXAMPLE_FHIR_STATUS_FINAL,
      [ObservationClaim.Category]: EXAMPLE_OBSERVATION_CATEGORY_VITAL_SIGNS,
      [ObservationClaim.CodeSystem]: FhirCodeSystems.Loinc,
      [ObservationClaim.CodeValue]: EXAMPLE_VITAL_SIGN_CODE_HEART_RATE,
      [ObservationClaim.CodeText]: EXAMPLE_VITAL_SIGN_DISPLAY_HEART_RATE,
      [ObservationClaim.ValueQuantityNumber]: EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE,
      [ObservationClaim.ValueQuantityUnit]: EXAMPLE_VITAL_SIGN_UNIT_BEATS_PER_MINUTE,
      [ObservationClaim.ComponentTags]: EXAMPLE_OBSERVATION_COMPONENT_TAGS_BLOOD_PRESSURE,
      [ObservationClaim.ComponentCodeValues]: EXAMPLE_OBSERVATION_COMPONENT_CODE_VALUES_BLOOD_PRESSURE,
      [ObservationClaim.ComponentNames]: EXAMPLE_OBSERVATION_COMPONENT_NAMES_BLOOD_PRESSURE,
      [ObservationClaim.BloodPressureSystolicNumber]: EXAMPLE_VITAL_SIGN_VALUE_SYSTOLIC,
      [ObservationClaim.BloodPressureDiastolicNumber]: EXAMPLE_VITAL_SIGN_VALUE_DIASTOLIC,
      [ObservationClaim.Note]: EXAMPLE_VITAL_SIGNS_NOTE,
    };

    const parameters = buildIndexParametersFromClaims(
      claims,
      AllowedIndexableClaims[ResourceTypesFhirR4.Observation][IndexingClaimSet.VitalSigns],
    );

    expect(parameters).toEqual(expect.arrayContaining([
      { name: ObservationClaim.Identifier, value: EXAMPLE_OBSERVATION_IDENTIFIER, type: 'uri' },
      { name: ObservationClaim.Subject, value: EXAMPLE_SUBJECT_DID, type: 'reference' },
      { name: ObservationClaim.CodeValue, value: EXAMPLE_VITAL_SIGN_CODE_HEART_RATE, type: 'token' },
      { name: ObservationClaim.ValueQuantityNumber, value: EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE, type: 'number' },
      { name: ObservationClaim.ValueQuantityUnit, value: EXAMPLE_VITAL_SIGN_UNIT_BEATS_PER_MINUTE, type: 'token', unit: EXAMPLE_VITAL_SIGN_UNIT_BEATS_PER_MINUTE },
      { name: ObservationClaim.ComponentTags, value: EXAMPLE_OBSERVATION_COMPONENT_TAGS_BLOOD_PRESSURE, type: 'token' },
      { name: ObservationClaim.ComponentCodeValues, value: EXAMPLE_OBSERVATION_COMPONENT_CODE_VALUES_BLOOD_PRESSURE, type: 'token' },
      { name: ObservationClaim.ComponentNames, value: EXAMPLE_OBSERVATION_COMPONENT_NAMES_BLOOD_PRESSURE, type: 'string' },
      { name: ObservationClaim.BloodPressureSystolicNumber, value: EXAMPLE_VITAL_SIGN_VALUE_SYSTOLIC, type: 'number' },
      { name: ObservationClaim.BloodPressureDiastolicNumber, value: EXAMPLE_VITAL_SIGN_VALUE_DIASTOLIC, type: 'number' },
    ]));
    expect(parameters.find((item) => item.name === ObservationClaim.Note)).toBeUndefined();
  });

  it('checks whether one observation claim is allowed in one indexable variant', () => {
    expect(isAllowedObservationIndexableClaim(ObservationClaim.CodeValue, 'vital-signs')).toBe(true);
    expect(isAllowedObservationIndexableClaim(ObservationClaim.BloodPressureSystolicNumber, 'vital-signs')).toBe(true);
    expect(isAllowedObservationIndexableClaim(ObservationClaim.Note, 'vital-signs')).toBe(false);
  });

  it('projects core clinical resource claims to ParameterData[] with resource-specific profiles', () => {
    const conditionParams = buildIndexParametersFromClaims({
      [ConditionClaim.Identifier]: EXAMPLE_CONDITION_IDENTIFIER,
      [ConditionClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [ConditionClaim.ClinicalStatus]: EXAMPLE_FHIR_STATUS_ACTIVE,
      [ConditionClaim.Code]: EXAMPLE_CONDITION_CODE,
      [ConditionClaim.OnsetDateTime]: EXAMPLE_CLINICAL_EVENT_DATE_TIME,
    }, AllowedIndexableClaims[ResourceTypesFhirR4.Condition][IndexingClaimSet.General]);
    expect(conditionParams).toEqual(expect.arrayContaining([
      { name: ConditionClaim.Identifier, value: EXAMPLE_CONDITION_IDENTIFIER, type: 'string' },
      { name: ConditionClaim.Subject, value: EXAMPLE_SUBJECT_DID, type: 'reference' },
      { name: ConditionClaim.ClinicalStatus, value: EXAMPLE_FHIR_STATUS_ACTIVE, type: 'token' },
      { name: ConditionClaim.Code, value: EXAMPLE_CONDITION_CODE, type: 'token' },
      { name: ConditionClaim.OnsetDateTime, value: EXAMPLE_CLINICAL_EVENT_DATE_TIME, type: 'date' },
    ]));

    const medicationParams = buildIndexParametersFromClaims({
      [MedicationStatementClaim.Identifier]: EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
      [MedicationStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [MedicationStatementClaim.Status]: EXAMPLE_MEDICATION_STATEMENT_STATUS,
      [MedicationStatementClaim.Medication]: EXAMPLE_MEDICATION_CODE_RXNORM,
    }, AllowedIndexableClaims[ResourceTypesFhirR4.MedicationStatement][IndexingClaimSet.General]);
    expect(medicationParams).toEqual(expect.arrayContaining([
      { name: MedicationStatementClaim.Identifier, value: EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER, type: 'uri' },
      { name: MedicationStatementClaim.Subject, value: EXAMPLE_SUBJECT_DID, type: 'reference' },
      { name: MedicationStatementClaim.Status, value: EXAMPLE_MEDICATION_STATEMENT_STATUS, type: 'token' },
      { name: MedicationStatementClaim.Medication, value: EXAMPLE_MEDICATION_CODE_RXNORM, type: 'token' },
    ]));

    const docParams = buildIndexParametersFromClaims({
      [DocumentReferenceClaim.Identifier]: EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
      [DocumentReferenceClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [DocumentReferenceClaim.ContentType]: EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
      [DocumentReferenceClaim.Date]: EXAMPLE_CLINICAL_EVENT_DATE_TIME,
    }, AllowedIndexableClaims[ResourceTypesFhirR4.DocumentReference][IndexingClaimSet.General]);
    expect(docParams).toEqual(expect.arrayContaining([
      { name: DocumentReferenceClaim.Identifier, value: EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER, type: 'string' },
      { name: DocumentReferenceClaim.Subject, value: EXAMPLE_SUBJECT_DID, type: 'reference' },
      { name: DocumentReferenceClaim.ContentType, value: EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF, type: 'token' },
      { name: DocumentReferenceClaim.Date, value: EXAMPLE_CLINICAL_EVENT_DATE_TIME, type: 'date' },
    ]));
  });
});
