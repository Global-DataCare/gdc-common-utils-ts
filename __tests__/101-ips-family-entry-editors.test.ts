/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { describe, expect, it } from '@jest/globals';

import {
  AllergyIntoleranceClinicalStatuses,
  AllergyIntoleranceVerificationStatuses,
  BundleEditableResourceTypes,
  BundleEditor,
  BundleQuery,
  BundleReader,
  ConditionClinicalStatuses,
  ConditionVerificationStatuses,
  EmployeeBundleOperations,
  EXAMPLE_ALLERGY_CATEGORY,
  EXAMPLE_ALLERGY_CODE,
  EXAMPLE_ALLERGY_CRITICALITY_HIGH,
  EXAMPLE_ALLERGY_DOCUMENT_IDENTIFIER,
  EXAMPLE_ALLERGY_IDENTIFIER,
  EXAMPLE_ALLERGY_ONSET_DATE_TIME,
  EXAMPLE_ALLERGY_RECORDER_REFERENCE,
  EXAMPLE_DIAGNOSTIC_REPORT_CATEGORY,
  EXAMPLE_DIAGNOSTIC_REPORT_CODE,
  EXAMPLE_DIAGNOSTIC_REPORT_CONTAINED_DOCUMENT_IDENTIFIER,
  EXAMPLE_DIAGNOSTIC_REPORT_DATE,
  EXAMPLE_DIAGNOSTIC_REPORT_ENCOUNTER_REFERENCE,
  EXAMPLE_DIAGNOSTIC_REPORT_IDENTIFIER,
  EXAMPLE_DIAGNOSTIC_REPORT_PERFORMER_REFERENCE,
  EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_CONTENT_TYPE,
  EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_DATA_BASE64,
  EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_URL,
  EXAMPLE_DIAGNOSTIC_REPORT_RESULT_REFERENCE,
  EXAMPLE_DIAGNOSTIC_REPORT_SPECIMEN_REFERENCE,
  EXAMPLE_DIAGNOSTIC_REPORT_STATUS_FINAL,
  EXAMPLE_BLOOD_PRESSURE_PANEL_MEMBER_REFERENCES,
  EXAMPLE_CARE_PLAN_CATEGORY,
  EXAMPLE_CARE_PLAN_DATE,
  EXAMPLE_CARE_PLAN_ENCOUNTER_REFERENCE,
  EXAMPLE_CARE_PLAN_IDENTIFIER,
  EXAMPLE_CARE_PLAN_INTENT_PLAN,
  EXAMPLE_CARE_PLAN_NOTE,
  EXAMPLE_CARE_PLAN_STATUS_ACTIVE,
  EXAMPLE_CLINICAL_IMPRESSION_ASSESSOR_REFERENCE,
  EXAMPLE_CLINICAL_IMPRESSION_DESCRIPTION,
  EXAMPLE_CLINICAL_IMPRESSION_EFFECTIVE_DATE_TIME,
  EXAMPLE_CLINICAL_IMPRESSION_ENCOUNTER_REFERENCE,
  EXAMPLE_CLINICAL_IMPRESSION_IDENTIFIER,
  EXAMPLE_CLINICAL_IMPRESSION_STATUS_COMPLETED,
  EXAMPLE_CLINICAL_IMPRESSION_SUMMARY,
  EXAMPLE_CONDITION_DOCUMENT_IDENTIFIER,
  EXAMPLE_CONDITION_IDENTIFIER_SECONDARY,
  EXAMPLE_CONDITION_ONSET_DATE_TIME,
  EXAMPLE_CONDITION_RECORDER_REFERENCE,
  EXAMPLE_CONDITION_SEVERITY,
  EXAMPLE_CONDITION_CODE,
  EXAMPLE_CONDITION_CATEGORY_PROBLEM_LIST_ITEM,
  EXAMPLE_COVERAGE_IDENTIFIER,
  EXAMPLE_COVERAGE_PAYOR_REFERENCE,
  EXAMPLE_COVERAGE_PERIOD_END,
  EXAMPLE_COVERAGE_PERIOD_START,
  EXAMPLE_COVERAGE_POLICY_HOLDER_REFERENCE,
  EXAMPLE_COVERAGE_RELATIONSHIP,
  EXAMPLE_COVERAGE_STATUS_ACTIVE,
  EXAMPLE_COVERAGE_SUBSCRIBER_REFERENCE,
  EXAMPLE_COVERAGE_TYPE,
  EXAMPLE_DEVICE_IDENTIFIER,
  EXAMPLE_DEVICE_LOCATION_REFERENCE,
  EXAMPLE_DEVICE_MANUFACTURER,
  EXAMPLE_DEVICE_MODEL,
  EXAMPLE_DEVICE_NAME,
  EXAMPLE_DEVICE_NOTE,
  EXAMPLE_DEVICE_ORGANIZATION_REFERENCE,
  EXAMPLE_DEVICE_SERIAL_NUMBER,
  EXAMPLE_DEVICE_STATUS_ACTIVE,
  EXAMPLE_DEVICE_TYPE,
  EXAMPLE_DEVICE_URL,
  EXAMPLE_DEVICE_USE_STATEMENT_IDENTIFIER,
  EXAMPLE_DEVICE_USE_STATEMENT_REASON_CODE,
  EXAMPLE_DEVICE_USE_STATEMENT_RECORDED_ON,
  EXAMPLE_DEVICE_USE_STATEMENT_SOURCE,
  EXAMPLE_DEVICE_USE_STATEMENT_STATUS_ACTIVE,
  EXAMPLE_DEVICE_USE_STATEMENT_TIMING_DATE_TIME,
  EXAMPLE_DOCUMENT_REFERENCE_AUTHOR,
  EXAMPLE_DOCUMENT_REFERENCE_CATEGORY,
  EXAMPLE_DOCUMENT_REFERENCE_CONTENT_HASH,
  EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE,
  EXAMPLE_DOCUMENT_REFERENCE_DATE,
  EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_LOCATION,
  EXAMPLE_DOCUMENT_REFERENCE_TYPE,
  EXAMPLE_ENCOUNTER_CLASS,
  EXAMPLE_ENCOUNTER_IDENTIFIER,
  EXAMPLE_ENCOUNTER_PARTICIPANT_REFERENCE,
  EXAMPLE_ENCOUNTER_PERIOD_END,
  EXAMPLE_ENCOUNTER_PERIOD_START,
  EXAMPLE_ENCOUNTER_REASON_CODE,
  EXAMPLE_ENCOUNTER_SERVICE_PROVIDER_REFERENCE,
  EXAMPLE_ENCOUNTER_STATUS_FINISHED,
  EXAMPLE_ENCOUNTER_TYPE,
  EXAMPLE_FLAG_CATEGORY,
  EXAMPLE_FLAG_CODE,
  EXAMPLE_FLAG_DATE,
  EXAMPLE_FLAG_ENCOUNTER_REFERENCE,
  EXAMPLE_FLAG_IDENTIFIER,
  EXAMPLE_FLAG_PERIOD_END,
  EXAMPLE_FLAG_PERIOD_START,
  EXAMPLE_FLAG_STATUS_ACTIVE,
  EXAMPLE_FHIR_STATUS_ACTIVE,
  EXAMPLE_FHIR_STATUS_FINAL,
  EXAMPLE_IMMUNIZATION_DATE,
  EXAMPLE_IMMUNIZATION_DOSE_SEQUENCE,
  EXAMPLE_IMMUNIZATION_IDENTIFIER,
  EXAMPLE_IMMUNIZATION_LOCATION_REFERENCE,
  EXAMPLE_IMMUNIZATION_LOT_NUMBER,
  EXAMPLE_IMMUNIZATION_MANUFACTURER_REFERENCE,
  EXAMPLE_IMMUNIZATION_NOTE,
  EXAMPLE_IMMUNIZATION_PERFORMER_REFERENCE,
  EXAMPLE_IMMUNIZATION_REACTION_DATE,
  EXAMPLE_IMMUNIZATION_REASON_CODE,
  EXAMPLE_IMMUNIZATION_SERIES,
  EXAMPLE_IMMUNIZATION_STATUS_COMPLETED,
  EXAMPLE_IMMUNIZATION_STATUS_REASON,
  EXAMPLE_IMMUNIZATION_TARGET_DISEASE,
  EXAMPLE_IMMUNIZATION_VACCINE_CODE,
  EXAMPLE_LAB_PANEL_CODE_COMPLETE_BLOOD_COUNT,
  EXAMPLE_LAB_PANEL_DISPLAY_COMPLETE_BLOOD_COUNT,
  EXAMPLE_LAB_PANEL_IDENTIFIER,
  EXAMPLE_LAB_PANEL_MEMBER_REFERENCES,
  EXAMPLE_LAB_RESULT_HEMOGLOBIN_CODE,
  EXAMPLE_LAB_RESULT_HEMOGLOBIN_DISPLAY,
  EXAMPLE_LAB_RESULT_HEMOGLOBIN_IDENTIFIER,
  EXAMPLE_LAB_RESULT_HEMOGLOBIN_UNIT,
  EXAMPLE_LAB_RESULT_HEMOGLOBIN_VALUE,
  EXAMPLE_LAB_RESULT_PLATELET_CODE,
  EXAMPLE_LAB_RESULT_PLATELET_DISPLAY,
  EXAMPLE_LAB_RESULT_PLATELET_IDENTIFIER,
  EXAMPLE_LAB_RESULT_PLATELET_UNIT,
  EXAMPLE_LAB_RESULT_PLATELET_VALUE,
  EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER,
  EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER_SECONDARY,
  EXAMPLE_OBSERVATION_PANEL_IDENTIFIER,
  EXAMPLE_MEDICATION_CODE_RXNORM,
  EXAMPLE_MEDICATION_DOSE_UNIT_MG,
  EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE,
  EXAMPLE_MEDICATION_IBUPROFEN_NOTE,
  EXAMPLE_MEDICATION_IBUPROFEN_TEXT,
  EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
  EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS,
  EXAMPLE_PROCEDURE_BASED_ON_REFERENCE,
  EXAMPLE_PROCEDURE_CODE,
  EXAMPLE_PROCEDURE_DATE,
  EXAMPLE_PROCEDURE_ENCOUNTER_REFERENCE,
  EXAMPLE_PROCEDURE_IDENTIFIER,
  EXAMPLE_PROCEDURE_LOCATION_REFERENCE,
  EXAMPLE_PROCEDURE_NOTE,
  EXAMPLE_PROCEDURE_PERFORMER_REFERENCE,
  EXAMPLE_PROCEDURE_REASON_CODE,
  EXAMPLE_PROCEDURE_REASON_REFERENCE,
  EXAMPLE_PROCEDURE_STATUS_COMPLETED,
  EXAMPLE_SUBJECT_DID,
  EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME,
  EXAMPLE_VITAL_SIGN_VALUE_DIASTOLIC,
  EXAMPLE_VITAL_SIGN_VALUE_SYSTOLIC,
  HealthcareBasicSections,
  ObservationCategoryCodes,
  ResourceTypesFhirR4,
  VitalSignsCodes,
  VitalSignsUnits,
} from '../src';
import { AllergyIntoleranceClaim } from '../src/models/interoperable-claims/allergy-intolerance-claims.js';
import { CarePlanClaim } from '../src/models/interoperable-claims/care-plan-claims.js';
import { ClinicalImpressionClaim } from '../src/models/interoperable-claims/clinical-impression-claims.js';
import { ConditionClaim } from '../src/models/interoperable-claims/condition-claims.js';
import { CoverageClaim } from '../src/models/interoperable-claims/coverage-claims.js';
import { DiagnosticReportClaim } from '../src/models/interoperable-claims/diagnostic-report-claims.js';
import { DeviceClaim } from '../src/models/interoperable-claims/device-claims.js';
import { DeviceUseStatementClaim } from '../src/models/interoperable-claims/device-use-statement-claims.js';
import { DocumentReferenceClaim } from '../src/models/interoperable-claims/document-reference-claims.js';
import { EncounterClaim } from '../src/models/interoperable-claims/encounter-claims.js';
import { FlagClaim } from '../src/models/interoperable-claims/flag-claims.js';
import { ImmunizationClaim } from '../src/models/interoperable-claims/immunization-claims.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import { ObservationClaim } from '../src/models/interoperable-claims/observation-claims.js';
import { ProcedureClaim } from '../src/models/interoperable-claims/procedure-claims.js';

function getBuiltEntryClaims(
  built: { entry?: Array<{ resource?: { resourceType?: string; meta?: { claims?: Record<string, unknown> } } }> },
): Record<string, unknown> {
  return built.entry?.[0]?.resource?.meta?.claims || {};
}

function getBuiltEntryResourceType(
  built: { entry?: Array<{ resource?: { resourceType?: string } }> },
): string | undefined {
  return built.entry?.[0]?.resource?.resourceType;
}

function getBuiltEntryClaimsAtIndex(
  built: { entry?: Array<{ resource?: { meta?: { claims?: Record<string, unknown> } } }> },
  index: number,
): Record<string, unknown> {
  return built.entry?.[index]?.resource?.meta?.claims || {};
}

describe('101: IPS family entry editors', () => {
  it('hydrates canonical viewer fields back into any typed clinical editor', () => {
    const editor = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.observation);
    const observation = editor
      .newEntryAs(ResourceTypesFhirR4.Observation, 'Observation/result-field-roundtrip')
      .asObservation();

    observation.setFhirApiClaimFields([
      { claim: 'org.hl7.fhir.api.Observation.status', value: 'final' },
      { claim: 'Observation.value-quantity-number', value: '7.2' },
      { claim: 'Observation.value-quantity-unit', value: 'mmol/L' },
      { claim: 'Composition.section', value: 'LOINC|30954-2' },
    ]);

    expect(observation.getFhirApiClaim('Observation.status')).toBe('final');
    expect(observation.getFhirApiClaim('org.hl7.fhir.api.Observation.value-quantity-unit')).toBe('mmol/L');
    expect(getBuiltEntryClaims(editor.build())).toMatchObject({
      'Observation.status': 'final',
      'Observation.value-quantity-number': '7.2',
      'Observation.value-quantity-unit': 'mmol/L',
      'Composition.section': 'LOINC|30954-2',
    });
    expect(() => observation.setFhirApiClaim('org.hl7.fhir.r4.Observation.status', 'final'))
      .toThrow(/must use org\.hl7\.fhir\.api/);
    expect(() => observation.setFhirApiClaim('Observation.effectiveDateTime', '2026-08-04'))
      .toThrow(/Invalid FHIR API claim key/);
  });
  it('teaches one chainable Immunization entry flow without low-level claim plumbing', () => {
    /*
     * Teaching goal:
     * - the app wants to stage one Immunization entry in an IPS-style bundle
     * - the app should use chainable semantic setters/getters
     * - the app should not write raw `meta.claims` directly in the primary path
     */

    // Step 1.
    // The app starts one bundle restricted to Immunization entries.
    const entryEditor = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.immunization)
      .newEntry(EXAMPLE_IMMUNIZATION_IDENTIFIER)
      .asImmunization()
      .setIdentifier(EXAMPLE_IMMUNIZATION_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setStatus(EXAMPLE_IMMUNIZATION_STATUS_COMPLETED)
      .setDate(EXAMPLE_IMMUNIZATION_DATE)
      .setVaccineCode(EXAMPLE_IMMUNIZATION_VACCINE_CODE)
      .setVaccineCodeTextLocal('Vacuna COVID-19')
      .setVaccineCodeDisplay('COVID-19 vaccine')
      .setLocation(EXAMPLE_IMMUNIZATION_LOCATION_REFERENCE)
      .setManufacturer(EXAMPLE_IMMUNIZATION_MANUFACTURER_REFERENCE)
      .setLotNumber(EXAMPLE_IMMUNIZATION_LOT_NUMBER)
      .setPerformerList([EXAMPLE_IMMUNIZATION_PERFORMER_REFERENCE])
      .setReasonCode(EXAMPLE_IMMUNIZATION_REASON_CODE)
      .setStatusReason(EXAMPLE_IMMUNIZATION_STATUS_REASON)
      .setTargetDisease(EXAMPLE_IMMUNIZATION_TARGET_DISEASE)
      .setDoseSequence(EXAMPLE_IMMUNIZATION_DOSE_SEQUENCE)
      .setSeries(EXAMPLE_IMMUNIZATION_SERIES)
      .setReactionDate(EXAMPLE_IMMUNIZATION_REACTION_DATE)
      .setClinicalNote(EXAMPLE_IMMUNIZATION_NOTE);

    // Step 2.
    // The app can read the same semantic surface back before saving.
    expect(entryEditor.getIdentifier()).toBe(EXAMPLE_IMMUNIZATION_IDENTIFIER);
    expect(entryEditor.getSubject()).toBe(EXAMPLE_SUBJECT_DID);
    expect(entryEditor.getStatus()).toBe(EXAMPLE_IMMUNIZATION_STATUS_COMPLETED);
    expect(entryEditor.getDate()).toBe(EXAMPLE_IMMUNIZATION_DATE);
    expect(entryEditor.getVaccineCodeTextLocal()).toBe('Vacuna COVID-19');
    expect(entryEditor.getVaccineCodeDisplay()).toBe('COVID-19 vaccine');
    expect(entryEditor.getPerformerList()).toEqual([EXAMPLE_IMMUNIZATION_PERFORMER_REFERENCE]);
    expect(entryEditor.getClinicalNote()).toBe(EXAMPLE_IMMUNIZATION_NOTE);

    // Step 3.
    // Saving the entry materializes the canonical flat claims for downstream layers.
    const built = entryEditor.doneEntry().build();
    const claims = getBuiltEntryClaims(built);

    expect(getBuiltEntryResourceType(built)).toBe(ResourceTypesFhirR4.Immunization);
    expect(claims).toMatchObject({
      [ImmunizationClaim.Identifier]: EXAMPLE_IMMUNIZATION_IDENTIFIER,
      [ImmunizationClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [ImmunizationClaim.Patient]: EXAMPLE_SUBJECT_DID,
      [ImmunizationClaim.Status]: EXAMPLE_IMMUNIZATION_STATUS_COMPLETED,
      [ImmunizationClaim.Date]: EXAMPLE_IMMUNIZATION_DATE,
      [ImmunizationClaim.VaccineCode]: EXAMPLE_IMMUNIZATION_VACCINE_CODE,
      [ImmunizationClaim.VaccineCodeText]: 'Vacuna COVID-19',
      [ImmunizationClaim.VaccineCodeDisplay]: 'COVID-19 vaccine',
      [ImmunizationClaim.LotNumber]: EXAMPLE_IMMUNIZATION_LOT_NUMBER,
      [ImmunizationClaim.Note]: EXAMPLE_IMMUNIZATION_NOTE,
    });
  });

  it('teaches one chainable Procedure entry flow without low-level claim plumbing', () => {
    /*
     * Teaching goal:
     * - the app wants to stage one Procedure entry
     * - bundle editing stays on semantic getters/setters
     * - list-valued references stay public as typed list methods
     */

    // Step 1.
    const entryEditor = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.procedure)
      .newEntry(EXAMPLE_PROCEDURE_IDENTIFIER)
      .asProcedure()
      .setIdentifier(EXAMPLE_PROCEDURE_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setStatus(EXAMPLE_PROCEDURE_STATUS_COMPLETED)
      .setDate(EXAMPLE_PROCEDURE_DATE)
      .setCode(EXAMPLE_PROCEDURE_CODE)
      .setCodeTextLocal('Apendicectomia')
      .setCodeDisplay('Appendectomy')
      .setEncounter(EXAMPLE_PROCEDURE_ENCOUNTER_REFERENCE)
      .setLocation(EXAMPLE_PROCEDURE_LOCATION_REFERENCE)
      .setReasonCode(EXAMPLE_PROCEDURE_REASON_CODE)
      .setPerformerList([EXAMPLE_PROCEDURE_PERFORMER_REFERENCE])
      .setBasedOnList([EXAMPLE_PROCEDURE_BASED_ON_REFERENCE])
      .setReasonReferenceList([EXAMPLE_PROCEDURE_REASON_REFERENCE])
      .setClinicalNote(EXAMPLE_PROCEDURE_NOTE);

    // Step 2.
    expect(entryEditor.getCode()).toBe(EXAMPLE_PROCEDURE_CODE);
    expect(entryEditor.getCodeTextLocal()).toBe('Apendicectomia');
    expect(entryEditor.getCodeDisplay()).toBe('Appendectomy');
    expect(entryEditor.getEncounter()).toBe(EXAMPLE_PROCEDURE_ENCOUNTER_REFERENCE);
    expect(entryEditor.getPerformerList()).toEqual([EXAMPLE_PROCEDURE_PERFORMER_REFERENCE]);
    expect(entryEditor.getBasedOnList()).toEqual([EXAMPLE_PROCEDURE_BASED_ON_REFERENCE]);
    expect(entryEditor.getReasonReferenceList()).toEqual([EXAMPLE_PROCEDURE_REASON_REFERENCE]);
    expect(entryEditor.getClinicalNote()).toBe(EXAMPLE_PROCEDURE_NOTE);

    // Step 3.
    const built = entryEditor.doneEntry().build();
    const claims = getBuiltEntryClaims(built);

    expect(getBuiltEntryResourceType(built)).toBe(ResourceTypesFhirR4.Procedure);
    expect(claims).toMatchObject({
      [ProcedureClaim.Identifier]: EXAMPLE_PROCEDURE_IDENTIFIER,
      [ProcedureClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [ProcedureClaim.Patient]: EXAMPLE_SUBJECT_DID,
      [ProcedureClaim.Status]: EXAMPLE_PROCEDURE_STATUS_COMPLETED,
      [ProcedureClaim.Date]: EXAMPLE_PROCEDURE_DATE,
      [ProcedureClaim.Code]: EXAMPLE_PROCEDURE_CODE,
      [ProcedureClaim.CodeText]: 'Apendicectomia',
      [ProcedureClaim.CodeDisplay]: 'Appendectomy',
      [ProcedureClaim.Note]: EXAMPLE_PROCEDURE_NOTE,
    });
  });

  it('teaches one chainable DiagnosticReport entry flow without low-level claim plumbing', () => {
    /*
     * Teaching goal:
     * - the app wants to stage one DiagnosticReport entry plus linked result/document ids
     * - the primary path stays semantic and chainable
     * - attachment metadata remains public through focused getters/setters
     */

    // Step 1.
    const entryEditor = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.diagnosticReport)
      .newEntry(EXAMPLE_DIAGNOSTIC_REPORT_IDENTIFIER)
      .asDiagnosticReport()
      .setIdentifier(EXAMPLE_DIAGNOSTIC_REPORT_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setStatus(EXAMPLE_DIAGNOSTIC_REPORT_STATUS_FINAL)
      .setDate(EXAMPLE_DIAGNOSTIC_REPORT_DATE)
      .setCategory(EXAMPLE_DIAGNOSTIC_REPORT_CATEGORY)
      .setCode(EXAMPLE_DIAGNOSTIC_REPORT_CODE)
      .setCodeTextLocal('Hemograma completo')
      .setCodeDisplay('Complete blood count panel')
      .setEncounter(EXAMPLE_DIAGNOSTIC_REPORT_ENCOUNTER_REFERENCE)
      .setPerformerList([EXAMPLE_DIAGNOSTIC_REPORT_PERFORMER_REFERENCE])
      .setResultList([EXAMPLE_DIAGNOSTIC_REPORT_RESULT_REFERENCE])
      .setSpecimenList([EXAMPLE_DIAGNOSTIC_REPORT_SPECIMEN_REFERENCE])
      .setContainedDocumentIdentifierList([EXAMPLE_DIAGNOSTIC_REPORT_CONTAINED_DOCUMENT_IDENTIFIER])
      .setPresentedFormContentType(EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_CONTENT_TYPE)
      .setPresentedFormData(EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_DATA_BASE64)
      .setPresentedFormUrl(EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_URL);

    // Step 2.
    expect(entryEditor.getCategory()).toBe(EXAMPLE_DIAGNOSTIC_REPORT_CATEGORY);
    expect(entryEditor.getCode()).toBe(EXAMPLE_DIAGNOSTIC_REPORT_CODE);
    expect(entryEditor.getCodeTextLocal()).toBe('Hemograma completo');
    expect(entryEditor.getCodeDisplay()).toBe('Complete blood count panel');
    expect(entryEditor.getPerformerList()).toEqual([EXAMPLE_DIAGNOSTIC_REPORT_PERFORMER_REFERENCE]);
    expect(entryEditor.getResultList()).toEqual([EXAMPLE_DIAGNOSTIC_REPORT_RESULT_REFERENCE]);
    expect(entryEditor.getSpecimenList()).toEqual([EXAMPLE_DIAGNOSTIC_REPORT_SPECIMEN_REFERENCE]);
    expect(entryEditor.getContainedDocumentIdentifierList()).toEqual([
      EXAMPLE_DIAGNOSTIC_REPORT_CONTAINED_DOCUMENT_IDENTIFIER,
    ]);
    expect(entryEditor.getPresentedFormContentType()).toBe(
      EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_CONTENT_TYPE,
    );

    // Step 3.
    const built = entryEditor.doneEntry().build();
    const claims = getBuiltEntryClaims(built);

    expect(getBuiltEntryResourceType(built)).toBe(ResourceTypesFhirR4.DiagnosticReport);
    expect(claims).toMatchObject({
      [DiagnosticReportClaim.Identifier]: EXAMPLE_DIAGNOSTIC_REPORT_IDENTIFIER,
      [DiagnosticReportClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [DiagnosticReportClaim.Patient]: EXAMPLE_SUBJECT_DID,
      [DiagnosticReportClaim.Status]: EXAMPLE_DIAGNOSTIC_REPORT_STATUS_FINAL,
      [DiagnosticReportClaim.Date]: EXAMPLE_DIAGNOSTIC_REPORT_DATE,
      [DiagnosticReportClaim.Category]: EXAMPLE_DIAGNOSTIC_REPORT_CATEGORY,
      [DiagnosticReportClaim.Code]: EXAMPLE_DIAGNOSTIC_REPORT_CODE,
      [DiagnosticReportClaim.CodeText]: 'Hemograma completo',
      [DiagnosticReportClaim.CodeDisplay]: 'Complete blood count panel',
      [DiagnosticReportClaim.PresentedFormContentType]:
        EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_CONTENT_TYPE,
      [DiagnosticReportClaim.PresentedFormData]:
        EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_DATA_BASE64,
      [DiagnosticReportClaim.PresentedFormUrl]:
        EXAMPLE_DIAGNOSTIC_REPORT_PRESENTED_FORM_URL,
    });
  });

  it('teaches chainable allergy, condition, medication, and document-reference entries for the main IPS clinical history families', () => {
    /*
     * Teaching goal:
     * - the main IPS history families should also be teachable through public entry editors
     * - each example should stay on semantic getters/setters
     * - the final bundle entry should still materialize canonical flat claims
     */

    // Step 1.
    // AllergyIntolerance: one allergy entry with status, verification, timing,
    // and linked document identifiers.
    const allergyBuilt = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.allergyIntolerance)
      .newEntry(EXAMPLE_ALLERGY_IDENTIFIER)
      .asAllergy()
      .setIdentifier(EXAMPLE_ALLERGY_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setSectionList([HealthcareBasicSections.AllergiesAndIntolerances.attributeValue])
      .setCode(EXAMPLE_ALLERGY_CODE)
      .setCodeTextLocal('Penicilina')
      .setCodeDisplay('Penicillin')
      .setClinicalStatus(AllergyIntoleranceClinicalStatuses.Active)
      .setVerificationStatus(AllergyIntoleranceVerificationStatuses.Confirmed)
      .setCategory(EXAMPLE_ALLERGY_CATEGORY)
      .setCriticality(EXAMPLE_ALLERGY_CRITICALITY_HIGH)
      .setOnsetDateTime(EXAMPLE_ALLERGY_ONSET_DATE_TIME)
      .setRecorder(EXAMPLE_ALLERGY_RECORDER_REFERENCE)
      .setContainedDocumentIdentifierList([EXAMPLE_ALLERGY_DOCUMENT_IDENTIFIER])
      .doneEntry()
      .build();

    expect(getBuiltEntryClaims(allergyBuilt)).toMatchObject({
      [AllergyIntoleranceClaim.Identifier]: EXAMPLE_ALLERGY_IDENTIFIER,
      [AllergyIntoleranceClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [AllergyIntoleranceClaim.Patient]: EXAMPLE_SUBJECT_DID,
      'AllergyIntolerance.section': HealthcareBasicSections.AllergiesAndIntolerances.attributeValue,
      [AllergyIntoleranceClaim.Code]: EXAMPLE_ALLERGY_CODE,
      [AllergyIntoleranceClaim.CodeText]: 'Penicilina',
      [AllergyIntoleranceClaim.CodeDisplay]: 'Penicillin',
      [AllergyIntoleranceClaim.ClinicalStatus]: AllergyIntoleranceClinicalStatuses.Active,
      [AllergyIntoleranceClaim.VerificationStatus]: AllergyIntoleranceVerificationStatuses.Confirmed,
      [AllergyIntoleranceClaim.ContainedReferenceList]: EXAMPLE_ALLERGY_DOCUMENT_IDENTIFIER,
    });

    // Step 2.
    // Condition: one problem-list entry with status, severity, onset, and
    // recorder metadata.
    const conditionBuilt = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.condition)
      .newEntry(EXAMPLE_CONDITION_IDENTIFIER_SECONDARY)
      .asCondition()
      .setIdentifier(EXAMPLE_CONDITION_IDENTIFIER_SECONDARY)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setCode(EXAMPLE_CONDITION_CODE)
      .setCodeTextLocal('Diabetes mellitus tipo 2')
      .setCodeDisplay('Type 2 diabetes mellitus')
      .setClinicalStatus(ConditionClinicalStatuses.Active)
      .setVerificationStatus(ConditionVerificationStatuses.Confirmed)
      .setCategory(EXAMPLE_CONDITION_CATEGORY_PROBLEM_LIST_ITEM)
      .setSeverity(EXAMPLE_CONDITION_SEVERITY)
      .setOnsetDateTime(EXAMPLE_CONDITION_ONSET_DATE_TIME)
      .setRecorder(EXAMPLE_CONDITION_RECORDER_REFERENCE)
      .setContainedDocumentIdentifierList([EXAMPLE_CONDITION_DOCUMENT_IDENTIFIER])
      .doneEntry()
      .build();

    expect(getBuiltEntryClaims(conditionBuilt)).toMatchObject({
      [ConditionClaim.Identifier]: EXAMPLE_CONDITION_IDENTIFIER_SECONDARY,
      [ConditionClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [ConditionClaim.Code]: EXAMPLE_CONDITION_CODE,
      [ConditionClaim.CodeText]: 'Diabetes mellitus tipo 2',
      [ConditionClaim.CodeDisplay]: 'Type 2 diabetes mellitus',
      [ConditionClaim.ClinicalStatus]: ConditionClinicalStatuses.Active,
      [ConditionClaim.VerificationStatus]: ConditionVerificationStatuses.Confirmed,
      [ConditionClaim.Severity]: EXAMPLE_CONDITION_SEVERITY,
      [ConditionClaim.ContainedReferenceList]: EXAMPLE_CONDITION_DOCUMENT_IDENTIFIER,
    });

    // Step 3.
    // MedicationStatement: one active medication with dosage/timing data and
    // user-facing text, still without touching raw claim keys.
    const medicationBuilt = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.medicationStatement)
      .newEntry(EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER)
      .asMedicationStatement()
      .setIdentifier(EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setStatus(EXAMPLE_FHIR_STATUS_ACTIVE)
      .setEffective(EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE)
      .setCode(EXAMPLE_MEDICATION_CODE_RXNORM)
      .setMedicationText(EXAMPLE_MEDICATION_IBUPROFEN_TEXT)
      .setCodeDisplay('Ibuprofen')
      .setNote(EXAMPLE_MEDICATION_IBUPROFEN_NOTE)
      .setCategoryList([HealthcareBasicSections.HistoryOfMedicationUse.attributeValue])
      .setDoseQuantityValue(400)
      .setDoseQuantityUnit(EXAMPLE_MEDICATION_DOSE_UNIT_MG)
      .setTimingFrequency(1)
      .setTimingPeriod(8)
      .setTimingPeriodUnit(EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS)
      .setDosageAsNeeded(true)
      .doneEntry()
      .build();

    expect(getBuiltEntryClaims(medicationBuilt)).toMatchObject({
      [MedicationStatementClaim.Identifier]: EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
      [MedicationStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [MedicationStatementClaim.Patient]: EXAMPLE_SUBJECT_DID,
      [MedicationStatementClaim.Code]: EXAMPLE_MEDICATION_CODE_RXNORM,
      [MedicationStatementClaim.CodeText]: EXAMPLE_MEDICATION_IBUPROFEN_TEXT,
      [MedicationStatementClaim.CodeDisplay]: 'Ibuprofen',
      [MedicationStatementClaim.Note]: EXAMPLE_MEDICATION_IBUPROFEN_NOTE,
    });

    // Step 4.
    // DocumentReference: one linked clinical document with content metadata.
    const documentReferenceBuilt = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.documentReference)
      .newEntry(EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER)
      .asDocumentReference()
      .setIdentifier(EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setType(EXAMPLE_DOCUMENT_REFERENCE_TYPE)
      .setCategory(EXAMPLE_DOCUMENT_REFERENCE_CATEGORY)
      .setContentType(EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE)
      .setContentHash(EXAMPLE_DOCUMENT_REFERENCE_CONTENT_HASH)
      .setLocation(EXAMPLE_DOCUMENT_REFERENCE_LOCATION)
      .setDescription(EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION)
      .setDate(EXAMPLE_DOCUMENT_REFERENCE_DATE)
      .setAuthor(EXAMPLE_DOCUMENT_REFERENCE_AUTHOR)
      .doneEntry()
      .build();

    expect(getBuiltEntryClaims(documentReferenceBuilt)).toMatchObject({
      [DocumentReferenceClaim.Identifier]: EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
      [DocumentReferenceClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [DocumentReferenceClaim.Type]: EXAMPLE_DOCUMENT_REFERENCE_TYPE,
      [DocumentReferenceClaim.Category]: EXAMPLE_DOCUMENT_REFERENCE_CATEGORY,
      [DocumentReferenceClaim.ContentType]: EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE,
      [DocumentReferenceClaim.ContentHash]: EXAMPLE_DOCUMENT_REFERENCE_CONTENT_HASH,
    });
  });

  it('teaches chainable IPS support resources beyond the core history families', () => {
    /*
     * Teaching goal:
     * - IPS is not only allergies/conditions/medications/results
     * - the bundle editor should also stage common support resources through
     *   focused public methods instead of raw claim patching
     */

    // Step 1. CarePlan
    expect(
      getBuiltEntryClaims(
        new BundleEditor()
          .setBundleOperation(EmployeeBundleOperations.create)
          .setAllowedResourceType(BundleEditableResourceTypes.carePlan)
          .newEntry(EXAMPLE_CARE_PLAN_IDENTIFIER)
          .asCarePlan()
          .setIdentifier(EXAMPLE_CARE_PLAN_IDENTIFIER)
          .setSubject(EXAMPLE_SUBJECT_DID)
          .setStatus(EXAMPLE_CARE_PLAN_STATUS_ACTIVE)
          .setIntent(EXAMPLE_CARE_PLAN_INTENT_PLAN)
          .setCategory(EXAMPLE_CARE_PLAN_CATEGORY)
          .setDate(EXAMPLE_CARE_PLAN_DATE)
          .setEncounter(EXAMPLE_CARE_PLAN_ENCOUNTER_REFERENCE)
          .setNote(EXAMPLE_CARE_PLAN_NOTE)
          .doneEntry()
          .build(),
      ),
    ).toMatchObject({
      [CarePlanClaim.Identifier]: EXAMPLE_CARE_PLAN_IDENTIFIER,
      [CarePlanClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [CarePlanClaim.Patient]: EXAMPLE_SUBJECT_DID,
      [CarePlanClaim.Status]: EXAMPLE_CARE_PLAN_STATUS_ACTIVE,
    });

    // Step 2. Flag
    expect(
      getBuiltEntryClaims(
        new BundleEditor()
          .setBundleOperation(EmployeeBundleOperations.create)
          .setAllowedResourceType(BundleEditableResourceTypes.flag)
          .newEntry(EXAMPLE_FLAG_IDENTIFIER)
          .asFlag()
          .setIdentifier(EXAMPLE_FLAG_IDENTIFIER)
          .setSubject(EXAMPLE_SUBJECT_DID)
          .setStatus(EXAMPLE_FLAG_STATUS_ACTIVE)
          .setCategory(EXAMPLE_FLAG_CATEGORY)
          .setCode(EXAMPLE_FLAG_CODE)
          .setCodeTextLocal('Dieta sin marisco')
          .setCodeDisplay('Shellfish free diet')
          .setDate(EXAMPLE_FLAG_DATE)
          .setEncounter(EXAMPLE_FLAG_ENCOUNTER_REFERENCE)
          .setPeriodStart(EXAMPLE_FLAG_PERIOD_START)
          .setPeriodEnd(EXAMPLE_FLAG_PERIOD_END)
          .doneEntry()
          .build(),
      ),
    ).toMatchObject({
      [FlagClaim.Identifier]: EXAMPLE_FLAG_IDENTIFIER,
      [FlagClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [FlagClaim.Patient]: EXAMPLE_SUBJECT_DID,
      [FlagClaim.Status]: EXAMPLE_FLAG_STATUS_ACTIVE,
      [FlagClaim.CodeText]: 'Dieta sin marisco',
      [FlagClaim.CodeDisplay]: 'Shellfish free diet',
    });

    // Step 3. ClinicalImpression
    expect(
      getBuiltEntryClaims(
        new BundleEditor()
          .setBundleOperation(EmployeeBundleOperations.create)
          .setAllowedResourceType(BundleEditableResourceTypes.clinicalImpression)
          .newEntry(EXAMPLE_CLINICAL_IMPRESSION_IDENTIFIER)
          .asClinicalImpression()
          .setIdentifier(EXAMPLE_CLINICAL_IMPRESSION_IDENTIFIER)
          .setSubject(EXAMPLE_SUBJECT_DID)
          .setStatus(EXAMPLE_CLINICAL_IMPRESSION_STATUS_COMPLETED)
          .setDescription(EXAMPLE_CLINICAL_IMPRESSION_DESCRIPTION)
          .setEncounter(EXAMPLE_CLINICAL_IMPRESSION_ENCOUNTER_REFERENCE)
          .setEffectiveDateTime(EXAMPLE_CLINICAL_IMPRESSION_EFFECTIVE_DATE_TIME)
          .setAssessor(EXAMPLE_CLINICAL_IMPRESSION_ASSESSOR_REFERENCE)
          .setSummary(EXAMPLE_CLINICAL_IMPRESSION_SUMMARY)
          .doneEntry()
          .build(),
      ),
    ).toMatchObject({
      [ClinicalImpressionClaim.Identifier]: EXAMPLE_CLINICAL_IMPRESSION_IDENTIFIER,
      [ClinicalImpressionClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [ClinicalImpressionClaim.Status]: EXAMPLE_CLINICAL_IMPRESSION_STATUS_COMPLETED,
    });

    // Step 4. Device + DeviceUseStatement
    expect(
      getBuiltEntryClaims(
        new BundleEditor()
          .setBundleOperation(EmployeeBundleOperations.create)
          .setAllowedResourceType(BundleEditableResourceTypes.device)
          .newEntry(EXAMPLE_DEVICE_IDENTIFIER)
          .asDevice()
          .setIdentifier(EXAMPLE_DEVICE_IDENTIFIER)
          .setPatient(EXAMPLE_SUBJECT_DID)
          .setStatus(EXAMPLE_DEVICE_STATUS_ACTIVE)
          .setType(EXAMPLE_DEVICE_TYPE)
          .setManufacturer(EXAMPLE_DEVICE_MANUFACTURER)
          .setModel(EXAMPLE_DEVICE_MODEL)
          .setDeviceName(EXAMPLE_DEVICE_NAME)
          .setSerialNumber(EXAMPLE_DEVICE_SERIAL_NUMBER)
          .setOrganization(EXAMPLE_DEVICE_ORGANIZATION_REFERENCE)
          .setLocation(EXAMPLE_DEVICE_LOCATION_REFERENCE)
          .setUrl(EXAMPLE_DEVICE_URL)
          .setNote(EXAMPLE_DEVICE_NOTE)
          .doneEntry()
          .build(),
      ),
    ).toMatchObject({
      [DeviceClaim.Identifier]: EXAMPLE_DEVICE_IDENTIFIER,
      [DeviceClaim.Patient]: EXAMPLE_SUBJECT_DID,
      [DeviceClaim.Status]: EXAMPLE_DEVICE_STATUS_ACTIVE,
      [DeviceClaim.Type]: EXAMPLE_DEVICE_TYPE,
    });

    expect(
      getBuiltEntryClaims(
        new BundleEditor()
          .setBundleOperation(EmployeeBundleOperations.create)
          .setAllowedResourceType(BundleEditableResourceTypes.deviceUseStatement)
          .newEntry(EXAMPLE_DEVICE_USE_STATEMENT_IDENTIFIER)
          .asDeviceUseStatement()
          .setIdentifier(EXAMPLE_DEVICE_USE_STATEMENT_IDENTIFIER)
          .setSubject(EXAMPLE_SUBJECT_DID)
          .setStatus(EXAMPLE_DEVICE_USE_STATEMENT_STATUS_ACTIVE)
          .setDevice(`${ResourceTypesFhirR4.Device}/${EXAMPLE_DEVICE_IDENTIFIER}`)
          .setRecordedOn(EXAMPLE_DEVICE_USE_STATEMENT_RECORDED_ON)
          .setTimingDateTime(EXAMPLE_DEVICE_USE_STATEMENT_TIMING_DATE_TIME)
          .setReasonCode(EXAMPLE_DEVICE_USE_STATEMENT_REASON_CODE)
          .setSource(EXAMPLE_DEVICE_USE_STATEMENT_SOURCE)
          .doneEntry()
          .build(),
      ),
    ).toMatchObject({
      [DeviceUseStatementClaim.Identifier]: EXAMPLE_DEVICE_USE_STATEMENT_IDENTIFIER,
      [DeviceUseStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [DeviceUseStatementClaim.Status]: EXAMPLE_DEVICE_USE_STATEMENT_STATUS_ACTIVE,
    });

    // Step 5. Encounter + Coverage
    expect(
      getBuiltEntryClaims(
        new BundleEditor()
          .setBundleOperation(EmployeeBundleOperations.create)
          .setAllowedResourceType(BundleEditableResourceTypes.encounter)
          .newEntry(EXAMPLE_ENCOUNTER_IDENTIFIER)
          .asEncounter()
          .setIdentifier(EXAMPLE_ENCOUNTER_IDENTIFIER)
          .setSubject(EXAMPLE_SUBJECT_DID)
          .setStatus(EXAMPLE_ENCOUNTER_STATUS_FINISHED)
          .setClass(EXAMPLE_ENCOUNTER_CLASS)
          .setType(EXAMPLE_ENCOUNTER_TYPE)
          .setParticipantList([EXAMPLE_ENCOUNTER_PARTICIPANT_REFERENCE])
          .setServiceProvider(EXAMPLE_ENCOUNTER_SERVICE_PROVIDER_REFERENCE)
          .setPeriodStart(EXAMPLE_ENCOUNTER_PERIOD_START)
          .setPeriodEnd(EXAMPLE_ENCOUNTER_PERIOD_END)
          .setReasonCode(EXAMPLE_ENCOUNTER_REASON_CODE)
          .doneEntry()
          .build(),
      ),
    ).toMatchObject({
      [EncounterClaim.Identifier]: EXAMPLE_ENCOUNTER_IDENTIFIER,
      [EncounterClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [EncounterClaim.Patient]: EXAMPLE_SUBJECT_DID,
      [EncounterClaim.Status]: EXAMPLE_ENCOUNTER_STATUS_FINISHED,
    });

    expect(
      getBuiltEntryClaims(
        new BundleEditor()
          .setBundleOperation(EmployeeBundleOperations.create)
          .setAllowedResourceType(BundleEditableResourceTypes.coverage)
          .newEntry(EXAMPLE_COVERAGE_IDENTIFIER)
          .asCoverage()
          .setIdentifier(EXAMPLE_COVERAGE_IDENTIFIER)
          .setStatus(EXAMPLE_COVERAGE_STATUS_ACTIVE)
          .setType(EXAMPLE_COVERAGE_TYPE)
          .setPolicyHolder(EXAMPLE_COVERAGE_POLICY_HOLDER_REFERENCE)
          .setSubscriber(EXAMPLE_COVERAGE_SUBSCRIBER_REFERENCE)
          .setBeneficiary(EXAMPLE_SUBJECT_DID)
          .setRelationship(EXAMPLE_COVERAGE_RELATIONSHIP)
          .setPeriodStart(EXAMPLE_COVERAGE_PERIOD_START)
          .setPeriodEnd(EXAMPLE_COVERAGE_PERIOD_END)
          .setPayorList([EXAMPLE_COVERAGE_PAYOR_REFERENCE])
          .doneEntry()
          .build(),
      ),
    ).toMatchObject({
      [CoverageClaim.Identifier]: EXAMPLE_COVERAGE_IDENTIFIER,
      [CoverageClaim.Status]: EXAMPLE_COVERAGE_STATUS_ACTIVE,
      [CoverageClaim.Type]: EXAMPLE_COVERAGE_TYPE,
      [CoverageClaim.Beneficiary]: EXAMPLE_SUBJECT_DID,
    });
  });

  it('teaches one multi-entry Observation bundle with panels, subtypes, and reopen/edit flow', () => {
    /*
     * Teaching goal:
     * - one IPS-style bundle can contain several Observation entries of different semantic kinds
     * - some Observations are standalone results, others are parent panels that group child entries
     * - the public editor path should stay on chainable `asObservation()` / `asVitalSign()` methods
     * - when the app needs to adjust one child result later, it should reopen the staged entry instead of rewriting raw claims
     */

    // Step 1.
    // The app creates one Observation-only bundle and stages one blood-pressure
    // panel together with its systolic/diastolic child results.
    const clinicalBundleEditor = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.observation);

    clinicalBundleEditor
      .newEntry(EXAMPLE_OBSERVATION_PANEL_IDENTIFIER)
      .asObservation()
      .setIdentifier(EXAMPLE_OBSERVATION_PANEL_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
      .setStatus(EXAMPLE_FHIR_STATUS_FINAL)
      .setVitalSignType(VitalSignsCodes.BloodPressure, VitalSignsUnits.MillimeterOfMercury)
      .setHasMemberList([
        `${ResourceTypesFhirR4.Observation}/${EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER}`,
        `${ResourceTypesFhirR4.Observation}/${EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER_SECONDARY}`,
      ])
      .doneEntry()
      .newEntry(EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER)
      .asVitalSign()
      .setIdentifier(EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
      .setSystolicBloodPressure(EXAMPLE_VITAL_SIGN_VALUE_SYSTOLIC)
      .doneEntry()
      .newEntry(EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER_SECONDARY)
      .asVitalSign()
      .setIdentifier(EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER_SECONDARY)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
      .setDiastolicBloodPressure(EXAMPLE_VITAL_SIGN_VALUE_DIASTOLIC)
      .doneEntry();

    // Step 2.
    // The same bundle can also carry one laboratory panel plus child blood-test results.
    // In Observation:
    // - `setCodeTextLocal(...)` is the local/UI label the app wants to show
    // - `setCodeDisplay(...)` is the canonical English/international display
    clinicalBundleEditor
      .newEntry(EXAMPLE_LAB_PANEL_IDENTIFIER)
      .asObservation()
      .setIdentifier(EXAMPLE_LAB_PANEL_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
      .setStatus(EXAMPLE_FHIR_STATUS_FINAL)
      .setCategory(ObservationCategoryCodes.Laboratory)
      .setCode(EXAMPLE_LAB_PANEL_CODE_COMPLETE_BLOOD_COUNT)
      .setCodeTextLocal(EXAMPLE_LAB_PANEL_DISPLAY_COMPLETE_BLOOD_COUNT)
      .setCodeDisplay(EXAMPLE_LAB_PANEL_DISPLAY_COMPLETE_BLOOD_COUNT)
      .setHasMemberList([
        `${ResourceTypesFhirR4.Observation}/${EXAMPLE_LAB_RESULT_HEMOGLOBIN_IDENTIFIER}`,
        `${ResourceTypesFhirR4.Observation}/${EXAMPLE_LAB_RESULT_PLATELET_IDENTIFIER}`,
      ])
      .doneEntry()
      .newEntry(EXAMPLE_LAB_RESULT_HEMOGLOBIN_IDENTIFIER)
      .asObservation()
      .setIdentifier(EXAMPLE_LAB_RESULT_HEMOGLOBIN_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
      .setStatus(EXAMPLE_FHIR_STATUS_FINAL)
      .setCategory(ObservationCategoryCodes.Laboratory)
      .setCode(EXAMPLE_LAB_RESULT_HEMOGLOBIN_CODE)
      .setCodeTextLocal(EXAMPLE_LAB_RESULT_HEMOGLOBIN_DISPLAY)
      .setCodeDisplay(EXAMPLE_LAB_RESULT_HEMOGLOBIN_DISPLAY)
      .setValueQuantityNumber(EXAMPLE_LAB_RESULT_HEMOGLOBIN_VALUE)
      .setValueQuantityUnit(EXAMPLE_LAB_RESULT_HEMOGLOBIN_UNIT)
      .doneEntry()
      .newEntry(EXAMPLE_LAB_RESULT_PLATELET_IDENTIFIER)
      .asObservation()
      .setIdentifier(EXAMPLE_LAB_RESULT_PLATELET_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
      .setStatus(EXAMPLE_FHIR_STATUS_FINAL)
      .setCategory(ObservationCategoryCodes.Laboratory)
      .setCode(EXAMPLE_LAB_RESULT_PLATELET_CODE)
      .setCodeTextLocal(EXAMPLE_LAB_RESULT_PLATELET_DISPLAY)
      .setCodeDisplay(EXAMPLE_LAB_RESULT_PLATELET_DISPLAY)
      .setValueQuantityNumber(EXAMPLE_LAB_RESULT_PLATELET_VALUE)
      .setValueQuantityUnit(EXAMPLE_LAB_RESULT_PLATELET_UNIT)
      .doneEntry();

    // Step 3.
    // Later in the same editing session, the app reopens one child result and
    // updates it through the same public getter/setter path.
    const reopenedHemoglobinEntry = clinicalBundleEditor
      .openEntry(EXAMPLE_LAB_RESULT_HEMOGLOBIN_IDENTIFIER)
      .asObservation()
      .setValueQuantityNumber(EXAMPLE_LAB_RESULT_HEMOGLOBIN_VALUE + 0.1);

    expect(reopenedHemoglobinEntry.getIdentifier()).toBe(EXAMPLE_LAB_RESULT_HEMOGLOBIN_IDENTIFIER);
    expect(reopenedHemoglobinEntry.getValueQuantityNumber()).toBe(EXAMPLE_LAB_RESULT_HEMOGLOBIN_VALUE + 0.1);
    expect(reopenedHemoglobinEntry.getValueQuantityUnit()).toBe(EXAMPLE_LAB_RESULT_HEMOGLOBIN_UNIT);

    // Step 4.
    // Once built, the bundle exposes one coherent set of Observation entries:
    // parent panels plus their grouped child results.
    const built = clinicalBundleEditor.build();
    const observationBuilt = built as {
      entry: Array<{ resource?: { resourceType?: string; meta?: { claims?: Record<string, unknown> } } }>;
    };

    expect(observationBuilt.entry).toHaveLength(6);
    expect(observationBuilt.entry.every((entry) => entry.resource?.resourceType === ResourceTypesFhirR4.Observation)).toBe(true);

    const bloodPressurePanelClaims = getBuiltEntryClaimsAtIndex(observationBuilt, 0);
    const hemoglobinClaims = getBuiltEntryClaimsAtIndex(observationBuilt, 4);
    const plateletClaims = getBuiltEntryClaimsAtIndex(observationBuilt, 5);

    expect(bloodPressurePanelClaims).toMatchObject({
      [ObservationClaim.Identifier]: EXAMPLE_OBSERVATION_PANEL_IDENTIFIER,
      [ObservationClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [ObservationClaim.Code]: VitalSignsCodes.BloodPressure.claim,
      [ObservationClaim.HasMember]: EXAMPLE_BLOOD_PRESSURE_PANEL_MEMBER_REFERENCES,
    });
    expect(hemoglobinClaims).toMatchObject({
      [ObservationClaim.Identifier]: EXAMPLE_LAB_RESULT_HEMOGLOBIN_IDENTIFIER,
      [ObservationClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [ObservationClaim.Category]: ObservationCategoryCodes.Laboratory.claim,
      [ObservationClaim.Code]: EXAMPLE_LAB_RESULT_HEMOGLOBIN_CODE,
      [ObservationClaim.CodeTextLocal]: EXAMPLE_LAB_RESULT_HEMOGLOBIN_DISPLAY,
      [ObservationClaim.CodeDisplay]: EXAMPLE_LAB_RESULT_HEMOGLOBIN_DISPLAY,
      [ObservationClaim.ValueQuantityNumber]: String(EXAMPLE_LAB_RESULT_HEMOGLOBIN_VALUE + 0.1),
      [ObservationClaim.ValueQuantityUnit]: EXAMPLE_LAB_RESULT_HEMOGLOBIN_UNIT,
    });
    expect(plateletClaims).toMatchObject({
      [ObservationClaim.Identifier]: EXAMPLE_LAB_RESULT_PLATELET_IDENTIFIER,
      [ObservationClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [ObservationClaim.Category]: ObservationCategoryCodes.Laboratory.claim,
      [ObservationClaim.Code]: EXAMPLE_LAB_RESULT_PLATELET_CODE,
      [ObservationClaim.CodeTextLocal]: EXAMPLE_LAB_RESULT_PLATELET_DISPLAY,
      [ObservationClaim.CodeDisplay]: EXAMPLE_LAB_RESULT_PLATELET_DISPLAY,
      [ObservationClaim.ValueQuantityNumber]: String(EXAMPLE_LAB_RESULT_PLATELET_VALUE),
      [ObservationClaim.ValueQuantityUnit]: EXAMPLE_LAB_RESULT_PLATELET_UNIT,
    });

    // Step 5.
    // The laboratory parent panel keeps explicit child references, so higher
    // layers can render or export the grouped blood-test results coherently.
    expect(getBuiltEntryClaimsAtIndex(observationBuilt, 3)).toMatchObject({
      [ObservationClaim.Identifier]: EXAMPLE_LAB_PANEL_IDENTIFIER,
      [ObservationClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [ObservationClaim.Category]: ObservationCategoryCodes.Laboratory.claim,
      [ObservationClaim.Code]: EXAMPLE_LAB_PANEL_CODE_COMPLETE_BLOOD_COUNT,
      [ObservationClaim.CodeTextLocal]: EXAMPLE_LAB_PANEL_DISPLAY_COMPLETE_BLOOD_COUNT,
      [ObservationClaim.CodeDisplay]: EXAMPLE_LAB_PANEL_DISPLAY_COMPLETE_BLOOD_COUNT,
      [ObservationClaim.HasMember]: EXAMPLE_LAB_PANEL_MEMBER_REFERENCES,
    });

    // Step 6.
    // The same generated bundle can later be loaded back from JSON through one
    // generic clinical-bundle reader, then refined with query helpers when the
    // app needs resource-type/date filters before reopening one selected entry.
    //
    // Cross-reference:
    // - `101-bundle-reader.test.ts` is the dedicated tutorial for BundleReader
    // - here we only use the minimal BundleReader path needed to keep IPS
    //   bundle editing connected to generic bundle navigation by identifier
    const draftBundle = clinicalBundleEditor.buildJsonApi();
    const clinicalBundleReader = new BundleReader(draftBundle as unknown as Record<string, unknown>);
    const clinicalBundleQuery = new BundleQuery(draftBundle);
    const hemoglobinEntryIndex = clinicalBundleReader.getEntryIndexByIdentifier(
      EXAMPLE_LAB_RESULT_HEMOGLOBIN_IDENTIFIER,
    );
    const observationIds = clinicalBundleQuery.getResourceIds({
      types: [ResourceTypesFhirR4.Observation],
      date: {
        start: EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME,
        end: EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME,
      },
    });
    const hemoglobinFullUrl = clinicalBundleQuery.getEntryUrl(EXAMPLE_LAB_RESULT_HEMOGLOBIN_IDENTIFIER);

    expect(clinicalBundleReader.getEntries()).toHaveLength(6);
    expect(hemoglobinEntryIndex).toBe(4);
    expect(observationIds).toContain(EXAMPLE_LAB_RESULT_HEMOGLOBIN_IDENTIFIER);
    expect(observationIds).toContain(EXAMPLE_LAB_PANEL_IDENTIFIER);
    expect(hemoglobinFullUrl).toBe(EXAMPLE_LAB_RESULT_HEMOGLOBIN_IDENTIFIER);

    if (hemoglobinEntryIndex === undefined) {
      throw new Error('Expected the authored hemoglobin entry in the Bundle readback.');
    }
    clinicalBundleReader.openEntry(hemoglobinEntryIndex);
    const reloadedClaims = clinicalBundleReader.getActiveEntryClaims();

    expect(reloadedClaims[ObservationClaim.Identifier]).toBe(EXAMPLE_LAB_RESULT_HEMOGLOBIN_IDENTIFIER);
    expect(reloadedClaims[ObservationClaim.CodeTextLocal]).toBe(EXAMPLE_LAB_RESULT_HEMOGLOBIN_DISPLAY);
    expect(reloadedClaims[ObservationClaim.CodeDisplay]).toBe(EXAMPLE_LAB_RESULT_HEMOGLOBIN_DISPLAY);
    expect(reloadedClaims[ObservationClaim.ValueQuantityNumber]).toBe(
      String(EXAMPLE_LAB_RESULT_HEMOGLOBIN_VALUE + 0.1),
    );
  });
});
