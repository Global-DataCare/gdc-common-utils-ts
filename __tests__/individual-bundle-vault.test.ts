import { describe, expect, it } from '@jest/globals';

import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { Format } from '../src/constants/Schemas.js';
import {
  IndividualClinicalSections,
  IndividualLogicalSections,
} from '../src/constants/individual-sections.js';
import {
  EXAMPLE_CLINICAL_EVENT_DATE_TIME,
  EXAMPLE_CONDITION_CODE,
  EXAMPLE_CONDITION_IDENTIFIER,
  EXAMPLE_CONSENT_IDENTIFIER,
  EXAMPLE_FHIR_STATUS_ACTIVE,
  EXAMPLE_FHIR_STATUS_FINAL,
  EXAMPLE_FHIR_VERIFICATION_STATUS_CONFIRMED,
  EXAMPLE_OBSERVATION_CATEGORY_VITAL_SIGNS,
  EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER,
  EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER_SECONDARY,
  EXAMPLE_OBSERVATION_IDENTIFIER,
  EXAMPLE_OBSERVATION_IDENTIFIER_IPS,
  EXAMPLE_IPS_COMPOSITION_IDENTIFIER,
  EXAMPLE_OBSERVATION_PANEL_IDENTIFIER,
  EXAMPLE_SUBJECT_DID,
  EXAMPLE_SUBJECT_DID_CONDITION,
  EXAMPLE_SUBJECT_DID_IPS,
  EXAMPLE_SUBJECT_DID_SECONDARY,
  EXAMPLE_SUBJECT_DID_TERTIARY,
  EXAMPLE_VAULT_CONDITION_DATE_TIME,
  EXAMPLE_VAULT_IPS_DATE_TIME,
  EXAMPLE_VAULT_PRIMARY_DATE_TIME,
  EXAMPLE_VAULT_QUATERNARY_DATE_TIME,
  EXAMPLE_VAULT_SECONDARY_DATE_TIME,
  EXAMPLE_VAULT_TERTIARY_DATE_TIME,
  EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME,
  EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE,
  EXAMPLE_VITAL_SIGN_VALUE_SYSTOLIC,
  EXAMPLE_VITAL_SIGNS_PANEL_DATE_TIME,
} from '../src/examples/shared.js';
import { ConditionClaim } from '../src/models/interoperable-claims/condition-claims.js';
import {
  ObservationCategoryCodes,
  VitalSignsCodes,
  VitalSignsUnits,
} from '../src/constants/vital-signs.js';
import { ObservationClaim } from '../src/models/interoperable-claims/observation-claims.js';
import { VaultMemRepository } from '../src/storage/VaultMemRepository.js';
import {
  buildVitalSignObservationClaims,
  IndividualBundleVault,
} from '../src/utils/individual-bundle-vault.js';

describe('utils/individual-bundle-vault', () => {
  it('persists one section bundle and keeps composition manifest in sync', async () => {
    const repo = new VaultMemRepository();
    const vault = await new IndividualBundleVault({
      vaultRepository: repo,
      individualId: EXAMPLE_SUBJECT_DID,
      now: () => EXAMPLE_VAULT_PRIMARY_DATE_TIME,
    }).initialize();

    await vault.upsertSectionEntry(IndividualLogicalSections.Consents, {
      resourceType: ResourceTypesFhirR4.Consent,
      fullUrl: EXAMPLE_CONSENT_IDENTIFIER,
      claims: {
        '@context': Format.FHIR_API,
        'Consent.identifier': EXAMPLE_CONSENT_IDENTIFIER,
        'Consent.subject': EXAMPLE_SUBJECT_DID,
      },
    });

    const composition = vault.getCompositionClaims();
    expect(String(composition['Composition.section'])).toContain(IndividualLogicalSections.Consents.attributeValue);
    expect(vault.getSectionContainerIds(IndividualLogicalSections.Consents)).toEqual([EXAMPLE_CONSENT_IDENTIFIER]);

    const reloaded = await new IndividualBundleVault({
      vaultRepository: repo,
      individualId: EXAMPLE_SUBJECT_DID,
      now: () => EXAMPLE_VAULT_SECONDARY_DATE_TIME,
    }).initialize();
    expect(reloaded.getSectionContainerIds(IndividualLogicalSections.Consents)).toEqual([EXAMPLE_CONSENT_IDENTIFIER]);
    expect(reloaded.listSections()).toHaveLength(1);
  });

  it.skip('imports an IPS bundle document and distributes resources by section', async () => {
    const repo = new VaultMemRepository();
    const vault = await new IndividualBundleVault({
      vaultRepository: repo,
      individualId: EXAMPLE_SUBJECT_DID_IPS,
      now: () => EXAMPLE_VAULT_IPS_DATE_TIME,
    }).initialize();

    await vault.importBundleDocument({
      resourceType: 'Bundle',
      type: 'document',
      entry: [
        {
          resource: {
            resourceType: 'Composition',
            id: EXAMPLE_IPS_COMPOSITION_IDENTIFIER,
            section: [
              {
                code: {
                  coding: [{ system: 'http://loinc.org', code: '8716-3' }],
                },
                entry: [{ reference: `Observation/${EXAMPLE_OBSERVATION_IDENTIFIER_IPS}` }],
              },
            ],
          },
        },
        {
          resource: {
            resourceType: 'Observation',
            id: EXAMPLE_OBSERVATION_IDENTIFIER_IPS,
            status: 'final',
            subject: { reference: EXAMPLE_SUBJECT_DID_IPS },
            category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }] }],
            code: { coding: [{ system: 'http://loinc.org', code: '8867-4' }] },
            effectiveDateTime: EXAMPLE_CLINICAL_EVENT_DATE_TIME,
            valueQuantity: { value: 72, system: 'http://unitsofmeasure.org', code: '/min' },
          },
        },
      ],
    });

    const vitalSignIds = await vault.getDisplayableVitalSignResourceIds();
    expect(vitalSignIds).toEqual([EXAMPLE_OBSERVATION_IDENTIFIER_IPS]);
    expect(vault.getSectionContainerIds(IndividualClinicalSections.VitalSigns)).toEqual([EXAMPLE_OBSERVATION_IDENTIFIER_IPS]);
  });

  it('builds and persists a vital-sign observation with quantity fields', async () => {
    const repo = new VaultMemRepository();
    const claims = buildVitalSignObservationClaims({
      identifier: EXAMPLE_OBSERVATION_IDENTIFIER,
      subject: EXAMPLE_SUBJECT_DID_SECONDARY,
      code: VitalSignsCodes.HeartRate,
      unit: VitalSignsUnits.BeatsPerMinute,
      valueQuantity: EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE,
      effectiveDateTime: EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME,
    });

    expect(claims[ObservationClaim.Category]).toBe(ObservationCategoryCodes.VitalSigns.claim);
    expect(claims[ObservationClaim.CodeSystem]).toBe(VitalSignsCodes.HeartRate.system);
    expect(claims[ObservationClaim.CodeValue]).toBe(VitalSignsCodes.HeartRate.code);
    expect(claims[ObservationClaim.CodeText]).toBe(VitalSignsCodes.HeartRate.display);
    expect(claims[ObservationClaim.CodeDisplay]).toBe(VitalSignsCodes.HeartRate.display);
    expect(claims[ObservationClaim.ValueQuantityNumber]).toBe(EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE);
    expect(claims[ObservationClaim.ValueQuantityUnit]).toBe(VitalSignsUnits.BeatsPerMinute.claim);

    const vault = await new IndividualBundleVault({
      vaultRepository: repo,
      individualId: EXAMPLE_SUBJECT_DID_SECONDARY,
      now: () => EXAMPLE_VAULT_TERTIARY_DATE_TIME,
    }).initialize();
    await vault.upsertVitalSign({
      identifier: EXAMPLE_OBSERVATION_IDENTIFIER,
      subject: EXAMPLE_SUBJECT_DID_SECONDARY,
      code: VitalSignsCodes.HeartRate,
      unit: VitalSignsUnits.BeatsPerMinute,
      valueQuantity: EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE,
      effectiveDateTime: EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME,
    });

    const editor = await vault.getSectionEditor(IndividualClinicalSections.VitalSigns);
    const entries = editor.getResourceEntriesByIds([EXAMPLE_OBSERVATION_IDENTIFIER]);
    expect(entries).toHaveLength(1);
    expect(entries[0].resource?.meta?.claims?.[ObservationClaim.ValueQuantityNumber]).toBe(EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE);
    expect(entries[0].resource?.meta?.claims?.[ObservationClaim.Code]).toBe(VitalSignsCodes.HeartRate.claim);
    expect(entries[0].resource?.meta?.claims?.[ObservationClaim.CodeValue]).toBe(VitalSignsCodes.HeartRate.code);

    const persisted = await repo.get<any>(
      `${EXAMPLE_SUBJECT_DID_SECONDARY}_${encodeURIComponent(IndividualClinicalSections.VitalSigns.attributeValue)}`,
      EXAMPLE_OBSERVATION_IDENTIFIER,
    );
    expect(persisted?.indexed?.attributes).toEqual(expect.arrayContaining([
      { name: ObservationClaim.Identifier, value: EXAMPLE_OBSERVATION_IDENTIFIER, unique: true, type: 'uri' },
      { name: ObservationClaim.CodeValue, value: VitalSignsCodes.HeartRate.code, type: 'token' },
      { name: ObservationClaim.ValueQuantityNumber, value: String(EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE), type: 'number' },
      { name: ObservationClaim.ValueQuantityUnit, value: VitalSignsUnits.BeatsPerMinute.claim, type: 'token' },
    ]));
    expect(persisted?.indexed?.attributes.find((item: any) => item.name === ObservationClaim.Note)).toBeUndefined();
  });

  it('ignores indexed component rows without status in normal vital-sign listings', async () => {
    const repo = new VaultMemRepository();
    const vault = await new IndividualBundleVault({
      vaultRepository: repo,
      individualId: EXAMPLE_SUBJECT_DID_TERTIARY,
      now: () => EXAMPLE_VAULT_QUATERNARY_DATE_TIME,
    }).initialize();

    await vault.upsertSectionEntry(IndividualClinicalSections.VitalSigns, {
      resourceType: ResourceTypesFhirR4.Observation,
      fullUrl: EXAMPLE_OBSERVATION_PANEL_IDENTIFIER,
      claims: {
        '@context': Format.FHIR_API,
        [ObservationClaim.Identifier]: EXAMPLE_OBSERVATION_PANEL_IDENTIFIER,
        [ObservationClaim.Subject]: EXAMPLE_SUBJECT_DID_TERTIARY,
        [ObservationClaim.Patient]: EXAMPLE_SUBJECT_DID_TERTIARY,
        [ObservationClaim.Status]: EXAMPLE_FHIR_STATUS_FINAL,
        [ObservationClaim.Category]: EXAMPLE_OBSERVATION_CATEGORY_VITAL_SIGNS,
        [ObservationClaim.Code]: VitalSignsCodes.BloodPressure.claim,
        [ObservationClaim.HasMember]: `${EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER},${EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER_SECONDARY}`,
        [ObservationClaim.Date]: EXAMPLE_VITAL_SIGNS_PANEL_DATE_TIME,
      },
    });

    await vault.upsertSectionEntry(IndividualClinicalSections.VitalSigns, {
      resourceType: ResourceTypesFhirR4.Observation,
      fullUrl: EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER,
      claims: {
        '@context': Format.FHIR_API,
        [ObservationClaim.Identifier]: EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER,
        [ObservationClaim.Subject]: EXAMPLE_SUBJECT_DID_TERTIARY,
        [ObservationClaim.Patient]: EXAMPLE_SUBJECT_DID_TERTIARY,
        [ObservationClaim.Category]: EXAMPLE_OBSERVATION_CATEGORY_VITAL_SIGNS,
        [ObservationClaim.Code]: VitalSignsCodes.SystolicBloodPressure.claim,
        [ObservationClaim.ValueQuantityNumber]: EXAMPLE_VITAL_SIGN_VALUE_SYSTOLIC,
        [ObservationClaim.ValueQuantityUnit]: VitalSignsUnits.MillimeterOfMercury.claim,
      },
    });

    const displayableIds = await vault.getDisplayableVitalSignResourceIds();
    expect(displayableIds).toEqual([EXAMPLE_OBSERVATION_PANEL_IDENTIFIER]);

    const allSectionIds = vault.getSectionContainerIds(IndividualClinicalSections.VitalSigns);
    expect(allSectionIds).toEqual([EXAMPLE_OBSERVATION_PANEL_IDENTIFIER, EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER]);
  });

  it('persists indexed attributes for condition rows using the resource-specific profile', async () => {
    const repo = new VaultMemRepository();
    const vault = await new IndividualBundleVault({
      vaultRepository: repo,
      individualId: EXAMPLE_SUBJECT_DID_CONDITION,
      now: () => EXAMPLE_VAULT_CONDITION_DATE_TIME,
    }).initialize();

    await vault.upsertSectionEntry(IndividualClinicalSections.Conditions, {
      resourceType: ResourceTypesFhirR4.Condition,
      fullUrl: `urn:uuid:${EXAMPLE_CONDITION_IDENTIFIER}`,
      claims: {
        '@context': Format.FHIR_API,
        [ConditionClaim.Identifier]: EXAMPLE_CONDITION_IDENTIFIER,
        [ConditionClaim.Subject]: EXAMPLE_SUBJECT_DID_CONDITION,
        [ConditionClaim.ClinicalStatus]: EXAMPLE_FHIR_STATUS_ACTIVE,
        [ConditionClaim.VerificationStatus]: EXAMPLE_FHIR_VERIFICATION_STATUS_CONFIRMED,
        [ConditionClaim.Code]: EXAMPLE_CONDITION_CODE,
        [ConditionClaim.OnsetDateTime]: EXAMPLE_CLINICAL_EVENT_DATE_TIME,
      },
    });

    const persisted = await repo.get<any>(
      `${EXAMPLE_SUBJECT_DID_CONDITION}_${encodeURIComponent(IndividualClinicalSections.Conditions.attributeValue)}`,
      EXAMPLE_CONDITION_IDENTIFIER,
    );
    expect(persisted?.indexed?.attributes).toEqual(expect.arrayContaining([
      { name: ConditionClaim.Identifier, value: EXAMPLE_CONDITION_IDENTIFIER, unique: true, type: 'string' },
      { name: ConditionClaim.Subject, value: EXAMPLE_SUBJECT_DID_CONDITION, type: 'reference' },
      { name: ConditionClaim.ClinicalStatus, value: EXAMPLE_FHIR_STATUS_ACTIVE, type: 'token' },
      { name: ConditionClaim.Code, value: EXAMPLE_CONDITION_CODE, type: 'token' },
      { name: ConditionClaim.OnsetDateTime, value: EXAMPLE_CLINICAL_EVENT_DATE_TIME, type: 'date' },
    ]));
  });
});
