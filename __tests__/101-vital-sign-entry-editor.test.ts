import {
  BundleEditor,
  BundleEditableResourceTypes,
  EmployeeBundleOperations,
  EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER,
  EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER_SECONDARY,
  EXAMPLE_OBSERVATION_IDENTIFIER,
  EXAMPLE_OBSERVATION_PANEL_IDENTIFIER,
  EXAMPLE_SUBJECT_DID,
  EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME,
  EXAMPLE_VITAL_SIGN_VALUE_BODY_TEMPERATURE,
  EXAMPLE_VITAL_SIGN_VALUE_DIASTOLIC,
  EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE,
  EXAMPLE_VITAL_SIGN_VALUE_SYSTOLIC,
  ObservationCategoryCodes,
  ResourceTypesFhirR4,
  VitalSignsCodes,
  VitalSignsUnits,
} from '../src';
import { ObservationClaim } from '../src/models/interoperable-claims/observation-claims.js';

describe('101: vital sign entry editor', () => {
  it('builds a bundle through bundle.newEntry().asVitalSign() with heart-rate helpers', () => {
    const bundle = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.vitalSign);

    const vitalEntry = bundle
      .newEntry(EXAMPLE_OBSERVATION_IDENTIFIER)
      .asVitalSign()
      .setIdentifier(EXAMPLE_OBSERVATION_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
      .setHeartRate(EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE);

    expect(vitalEntry.getIdentifier()).toBe(EXAMPLE_OBSERVATION_IDENTIFIER);
    expect(vitalEntry.getSubject()).toBe(EXAMPLE_SUBJECT_DID);
    expect(vitalEntry.getDate()).toBe(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME);
    expect(vitalEntry.getCode()).toBe(VitalSignsCodes.HeartRate.claim);
    expect(vitalEntry.getCodeValue()).toBe(VitalSignsCodes.HeartRate.code);
    expect(vitalEntry.getCategory()).toBe(ObservationCategoryCodes.VitalSigns.claim);
    expect(vitalEntry.getLocalText()).toBe(VitalSignsCodes.HeartRate.display);
    expect(vitalEntry.getHeartRate()).toBe(EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE);
    expect(vitalEntry.getValueQuantityUnit()).toBe(VitalSignsUnits.BeatsPerMinute.claim);

    const built = vitalEntry.doneEntry().build();

    expect(built.entry[0]).toMatchObject({
      resource: {
        resourceType: ResourceTypesFhirR4.Observation,
        id: EXAMPLE_OBSERVATION_IDENTIFIER,
        meta: {
          claims: {
            [ObservationClaim.Identifier]: EXAMPLE_OBSERVATION_IDENTIFIER,
            [ObservationClaim.Subject]: EXAMPLE_SUBJECT_DID,
            [ObservationClaim.Category]: ObservationCategoryCodes.VitalSigns.claim,
            [ObservationClaim.Code]: VitalSignsCodes.HeartRate.claim,
            [ObservationClaim.ValueQuantityNumber]: String(EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE),
            [ObservationClaim.ValueQuantityUnit]: VitalSignsUnits.BeatsPerMinute.claim,
          },
        },
      },
    });
  });

  it('supports one example of each directly authored vital sign type', () => {
    const bundle = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.observation)
      .newEntry(EXAMPLE_OBSERVATION_IDENTIFIER)
      .asVitalSign()
      .setIdentifier(EXAMPLE_OBSERVATION_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
      .setHeartRate(EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE)
      .doneEntry()
      .newEntry(EXAMPLE_OBSERVATION_PANEL_IDENTIFIER)
      .asVitalSign()
      .setIdentifier(EXAMPLE_OBSERVATION_PANEL_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
      .setBodyTemperature(EXAMPLE_VITAL_SIGN_VALUE_BODY_TEMPERATURE)
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
      .doneEntry()
      .build();

    expect(bundle.entry).toHaveLength(4);
    expect(bundle.entry.map((entry) => (entry.resource as { meta?: { claims?: Record<string, unknown> } } | undefined)?.meta?.claims?.[ObservationClaim.Code])).toEqual([
      VitalSignsCodes.HeartRate.claim,
      VitalSignsCodes.BodyTemperature.claim,
      VitalSignsCodes.SystolicBloodPressure.claim,
      VitalSignsCodes.DiastolicBloodPressure.claim,
    ]);
  });

  it('extends vital-sign editing with general observation helpers through asObservation()', () => {
    const observationEntry = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.observation)
      .newEntry(EXAMPLE_OBSERVATION_IDENTIFIER)
      .asObservation()
      .setIdentifier(EXAMPLE_OBSERVATION_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
      .setVitalSignType(VitalSignsCodes.HeartRate, VitalSignsUnits.BeatsPerMinute)
      .setValueQuantityNumber(EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE)
      .setEncounter('Encounter/enc-1')
      .setPerformer('Practitioner/prac-1')
      .setBasedOn('ServiceRequest/sr-1')
      .setHasMember('Observation/member-1');

    expect(observationEntry.getEncounter()).toBe('Encounter/enc-1');
    expect(observationEntry.getPerformer()).toBe('Practitioner/prac-1');
    expect(observationEntry.getBasedOn()).toBe('ServiceRequest/sr-1');
    expect(observationEntry.getHasMember()).toBe('Observation/member-1');
    expect(observationEntry.getHeartRate()).toBe(EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE);
  });
});
