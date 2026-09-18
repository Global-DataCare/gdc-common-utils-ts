// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
import { describe, expect, it } from '@jest/globals';

import {
  AllergyIntoleranceClaim,
  AllergyIntoleranceCriticalities,
  AllergyIntoleranceSearchParamNames,
  AllergyIntoleranceSearchParamToClaimKey,
  AllergyIntoleranceReactionSeverities,
  BundleEditableResourceTypes,
  BundleEditor,
  EmployeeBundleOperations,
  EXAMPLE_SUBJECT_DID,
  ImmunizationClaim,
  MedicationStatementClaim,
  ObservationClaim,
  allergyIntoleranceFhirR4ToFlat,
  allergyIntoleranceFlatToFhirR4,
  medicationStatementFhirR4ToFlat,
  medicationStatementFlatToFhirR4,
} from '../src';

// Exact dates and terminology tokens below are serialization inputs under test.
const REACTION_MANIFESTATION_SYSTEM = 'http://snomed.info/sct';
const REACTION_MANIFESTATION_CODE = '247472004';
const REACTION_MANIFESTATION = `${REACTION_MANIFESTATION_SYSTEM}|${REACTION_MANIFESTATION_CODE}`;
const MEDICATION_START = '2026-09-01T08:00:00Z';
const MEDICATION_END = '2026-09-10T20:00:00Z';
const IMMUNIZATION_ROUTE = 'http://snomed.info/sct|78421000';
const IMMUNIZATION_SITE = 'http://snomed.info/sct|368208006';
const REFERENCE_RANGE_TEXT = 'Expected after a minimum eight-hour fast';

function firstClaims(bundle: ReturnType<BundleEditor['build']>): Record<string, unknown> {
  const resource = bundle.entry?.[0]?.resource as { meta?: { claims?: Record<string, unknown> } } | undefined;
  return resource?.meta?.claims || {};
}

describe('FHIR clinical detail contract', () => {
  it('catalogues every resource-specific FHIR R4 AllergyIntolerance search parameter', () => {
    const standardSearchParameters = [
      AllergyIntoleranceSearchParamNames.Asserter,
      AllergyIntoleranceSearchParamNames.Category,
      AllergyIntoleranceSearchParamNames.ClinicalStatus,
      AllergyIntoleranceSearchParamNames.Code,
      AllergyIntoleranceSearchParamNames.Criticality,
      AllergyIntoleranceSearchParamNames.Date,
      AllergyIntoleranceSearchParamNames.Identifier,
      AllergyIntoleranceSearchParamNames.LastDate,
      AllergyIntoleranceSearchParamNames.Manifestation,
      AllergyIntoleranceSearchParamNames.Onset,
      AllergyIntoleranceSearchParamNames.Patient,
      AllergyIntoleranceSearchParamNames.Recorder,
      AllergyIntoleranceSearchParamNames.Route,
      AllergyIntoleranceSearchParamNames.Severity,
      AllergyIntoleranceSearchParamNames.Type,
      AllergyIntoleranceSearchParamNames.VerificationStatus,
    ];

    expect(Object.keys(AllergyIntoleranceSearchParamToClaimKey)).toEqual(
      expect.arrayContaining(standardSearchParameters),
    );
  });

  it('keeps future risk criticality separate from reaction-event severity and exposes typed editor hints', () => {
    const allergyEditor = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.allergyIntolerance)
      .newEntry('allergy-example')
      .asAllergy()
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setCriticality(AllergyIntoleranceCriticalities.High)
      .setReactionManifestation(REACTION_MANIFESTATION_SYSTEM, REACTION_MANIFESTATION_CODE)
      .setReactionSeverity(AllergyIntoleranceReactionSeverities.Moderate);

    expect(allergyEditor.getReactionManifestationSystem()).toBe(REACTION_MANIFESTATION_SYSTEM);
    expect(allergyEditor.getReactionManifestationCode()).toBe(REACTION_MANIFESTATION_CODE);
    expect(allergyEditor.getReactionManifestationSystemAndCode()).toBe(REACTION_MANIFESTATION);

    const claims = firstClaims(allergyEditor
      .doneEntry()
      .build());

    expect(claims).toMatchObject({
      [AllergyIntoleranceClaim.Criticality]: AllergyIntoleranceCriticalities.High,
      [AllergyIntoleranceClaim.Manifestation]: REACTION_MANIFESTATION,
      [AllergyIntoleranceClaim.Severity]: AllergyIntoleranceReactionSeverities.Moderate,
    });

    const resource = allergyIntoleranceFlatToFhirR4(claims as Record<string, string>);
    expect(resource).toMatchObject({
      criticality: AllergyIntoleranceCriticalities.High,
      reaction: [{
        manifestation: [{ coding: [{ system: 'http://snomed.info/sct', code: '247472004' }] }],
        severity: AllergyIntoleranceReactionSeverities.Moderate,
      }],
    });
    expect(allergyIntoleranceFhirR4ToFlat(resource)).toMatchObject({
      [AllergyIntoleranceClaim.Manifestation]: REACTION_MANIFESTATION,
      [AllergyIntoleranceClaim.Severity]: AllergyIntoleranceReactionSeverities.Moderate,
    });
  });

  it('rejects reaction severity without the mandatory FHIR manifestation', () => {
    expect(() => allergyIntoleranceFlatToFhirR4({
      [AllergyIntoleranceClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [AllergyIntoleranceClaim.Severity]: AllergyIntoleranceReactionSeverities.Severe,
    })).toThrow('AllergyIntolerance.severity requires AllergyIntolerance.manifestation');
  });

  it('keeps the combined manifestation token as compatibility input and clears it with null', () => {
    const allergyEditor = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.allergyIntolerance)
      .newEntry('allergy-compatibility-example')
      .asAllergy()
      .setReactionManifestation(REACTION_MANIFESTATION);

    expect(allergyEditor.getReactionManifestationSystem()).toBe(REACTION_MANIFESTATION_SYSTEM);
    expect(allergyEditor.getReactionManifestationCode()).toBe(REACTION_MANIFESTATION_CODE);

    allergyEditor.setReactionManifestation(null);
    expect(allergyEditor.getReactionManifestation()).toBeUndefined();
  });

  it('preserves MedicationStatement effectivePeriod and migrates an existing effective start when the end is set', () => {
    const claims = firstClaims(new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.medicationStatement)
      .newEntry('medication-example')
      .asMedicationStatement()
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setStatus('completed')
      .setEffective(MEDICATION_START)
      .setEffectivePeriodEnd(MEDICATION_END)
      .doneEntry()
      .build());

    expect(claims).toMatchObject({
      [MedicationStatementClaim.EffectivePeriodStart]: MEDICATION_START,
      [MedicationStatementClaim.EffectivePeriodEnd]: MEDICATION_END,
    });
    expect(claims).not.toHaveProperty(MedicationStatementClaim.Effective);

    const resource = medicationStatementFlatToFhirR4(claims as Record<string, string>);
    expect(resource).toMatchObject({ effectivePeriod: { start: MEDICATION_START, end: MEDICATION_END } });
    expect(resource).not.toHaveProperty('effectiveDateTime');
    expect(medicationStatementFhirR4ToFlat(resource)).toMatchObject({
      [MedicationStatementClaim.EffectivePeriodStart]: MEDICATION_START,
      [MedicationStatementClaim.EffectivePeriodEnd]: MEDICATION_END,
    });
  });

  it('provides semantic setters for Immunization route/site and Observation reference-range text', () => {
    const immunization = firstClaims(new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.immunization)
      .newEntry('immunization-example')
      .asImmunization()
      .setRoute(IMMUNIZATION_ROUTE)
      .setSite(IMMUNIZATION_SITE)
      .doneEntry()
      .build());
    expect(immunization).toMatchObject({
      [ImmunizationClaim.Route]: IMMUNIZATION_ROUTE,
      [ImmunizationClaim.Site]: IMMUNIZATION_SITE,
    });

    const observation = firstClaims(new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.observation)
      .newEntry('observation-example')
      .asObservation()
      .setReferenceRangeText(REFERENCE_RANGE_TEXT)
      .doneEntry()
      .build());
    expect(observation).toMatchObject({ [ObservationClaim.ReferenceRangeText]: REFERENCE_RANGE_TEXT });
  });
});
