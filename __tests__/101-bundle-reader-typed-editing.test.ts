// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
/**
 * Teaching goal:
 * - read one received Bundle through `BundleReader`;
 * - explicitly create an editable clone before using typed getters/setters;
 * - prove that editing the clone never mutates the received Bundle;
 * - keep generic reader navigation separate from resource-specific editing.
 */

import {
  AllergyIntoleranceReactionSeverities,
  AllergyIntoleranceEntryEditor,
  BundleEditableResourceTypes,
  BundleEditor,
  BundleReader,
  CarePlanEntryEditor,
  ClinicalImpressionEntryEditor,
  ConditionEntryEditor,
  ConsentEntryEditor,
  CoverageEntryEditor,
  DeviceEntryEditor,
  DeviceUseStatementEntryEditor,
  DiagnosticReportEntryEditor,
  DocumentReferenceEntryEditor,
  EmployeeEntryEditor,
  EncounterEntryEditor,
  EXAMPLE_ALLERGY_CODE,
  EXAMPLE_ALLERGY_IDENTIFIER,
  EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE,
  EXAMPLE_LEGAL_ORGANIZATION_TAX_ID,
  EXAMPLE_PROVIDER_ORGANIZATION_AUTHORIZATION_URN_CDS,
  FlagEntryEditor,
  ImmunizationEntryEditor,
  MedicationStatementEntryEditor,
  ObservationEntryEditor,
  ProcedureEntryEditor,
  RelatedPersonEntryEditor,
  VitalSignEntryEditor,
} from '../src';

describe('101: typed getters and setters for received Bundle entries', () => {
  it('opens a received FHIR-style Bundle as an editable clone with typed allergy accessors', () => {
    // Step 1. The application authors one resource with the normal typed editor.
    const receivedBundle = new BundleEditor()
      .newEntryAs(BundleEditableResourceTypes.allergyIntolerance, EXAMPLE_ALLERGY_IDENTIFIER)
      .asAllergy()
      .setIdentifier(EXAMPLE_ALLERGY_IDENTIFIER)
      .setCode(EXAMPLE_ALLERGY_CODE)
      .setReactionSeverity(AllergyIntoleranceReactionSeverities.Mild)
      .doneEntry()
      .build();

    // Step 2. BundleReader remains the read-only navigation/outcome surface.
    const reader = new BundleReader(receivedBundle);

    // Step 3. The caller explicitly asks for an editable clone, then reopens
    // the selected entry using its array position and its resource family.
    const editableBundle = reader.toBundleEditor();
    const allergy = editableBundle
      .openEntryByArrayIndex(0)
      .asAllergy();

    expect(allergy.getIdentifier()).toBe(EXAMPLE_ALLERGY_IDENTIFIER);
    expect(allergy.getSystemAndCode()).toBe(EXAMPLE_ALLERGY_CODE);
    expect(allergy.getReactionSeverity()).toBe(AllergyIntoleranceReactionSeverities.Mild);

    // Step 4. The same typed surface can update the editable clone.
    allergy.setReactionSeverity(AllergyIntoleranceReactionSeverities.Severe);
    expect(allergy.getReactionSeverity()).toBe(AllergyIntoleranceReactionSeverities.Severe);

    // Step 5. Reader input remains unchanged: conversion is an explicit clone,
    // not an implicit mutation of a server response.
    expect(
      reader.toBundleEditor()
        .openEntryByArrayIndex(0)
        .asAllergy()
        .getReactionSeverity(),
    ).toBe(AllergyIntoleranceReactionSeverities.Mild);
  });

  it('provides symmetric getters for employee organization fields', () => {
    const employee = new BundleEditor()
      .newEntryAs(BundleEditableResourceTypes.employee, EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.resourceId)
      .asEmployee()
      .setWorksFor(EXAMPLE_PROVIDER_ORGANIZATION_AUTHORIZATION_URN_CDS)
      .setMemberOf(EXAMPLE_PROVIDER_ORGANIZATION_AUTHORIZATION_URN_CDS)
      .setMemberOfOrgTaxId(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID);

    expect(employee.getWorksFor()).toBe(EXAMPLE_PROVIDER_ORGANIZATION_AUTHORIZATION_URN_CDS);
    expect(employee.getMemberOf()).toBe(EXAMPLE_PROVIDER_ORGANIZATION_AUTHORIZATION_URN_CDS);
    expect(employee.getMemberOfOrgTaxId()).toBe(EXAMPLE_LEGAL_ORGANIZATION_TAX_ID);
  });

  it('opens a received JSON-API-style Bundle through the same typed surface', () => {
    const receivedBundle = new BundleEditor()
      .newEntryAs(BundleEditableResourceTypes.allergyIntolerance, EXAMPLE_ALLERGY_IDENTIFIER)
      .asAllergy()
      .setReactionSeverity(AllergyIntoleranceReactionSeverities.Moderate)
      .doneEntry()
      .buildJsonApi();

    const allergy = new BundleReader(receivedBundle)
      .toBundleEditor()
      .openEntryByArrayIndex(0)
      .asAllergy();

    expect(allergy.getReactionSeverity()).toBe(AllergyIntoleranceReactionSeverities.Moderate);
  });

  it('rejects a received Bundle type that the editable Bundle contract does not support', () => {
    // The invalid literal is intentional: it proves the negative validation path.
    const reader = new BundleReader({ resourceType: 'Bundle', type: 'unsupported', entry: [] });
    expect(() => reader.toBundleEditor()).toThrow('BundleEditor.setBundle does not support Bundle.type');
  });

  it('keeps every scalar typed setter paired with a getter', () => {
    const typedEditors = [
      AllergyIntoleranceEntryEditor,
      CarePlanEntryEditor,
      ClinicalImpressionEntryEditor,
      ConditionEntryEditor,
      ConsentEntryEditor,
      CoverageEntryEditor,
      DeviceEntryEditor,
      DeviceUseStatementEntryEditor,
      DiagnosticReportEntryEditor,
      DocumentReferenceEntryEditor,
      EmployeeEntryEditor,
      EncounterEntryEditor,
      FlagEntryEditor,
      ImmunizationEntryEditor,
      MedicationStatementEntryEditor,
      ObservationEntryEditor,
      ProcedureEntryEditor,
      RelatedPersonEntryEditor,
      VitalSignEntryEditor,
    ];
    const compositeSetters = new Set(['setFhirApiClaimFields', 'setVitalSignType']);

    for (const Editor of typedEditors) {
      const methods = new Set<string>();
      let prototype: object | null = Editor.prototype;
      while (prototype && prototype !== Object.prototype) {
        for (const name of Object.getOwnPropertyNames(prototype)) methods.add(name);
        prototype = Object.getPrototypeOf(prototype) as object | null;
      }

      const missingGetters = [...methods]
        .filter((name) => /^set[A-Z]/.test(name) && !compositeSetters.has(name))
        .map((name) => `get${name.slice(3)}`)
        .filter((name) => !methods.has(name));

      expect({ editor: Editor.name, missingGetters }).toEqual({
        editor: Editor.name,
        missingGetters: [],
      });
    }
  });
});
