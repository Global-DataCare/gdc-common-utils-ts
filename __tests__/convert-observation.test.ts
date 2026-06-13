import { describe, expect, it } from '@jest/globals';

import { FhirCodeSystems } from '../src/constants/fhir-code-systems.js';
import { ObservationCategoryCodes, VitalSignsCodes } from '../src/constants/vital-signs.js';
import { Format } from '../src/constants/Schemas.js';
import {
  EXAMPLE_CLINICAL_EVENT_DATE_TIME,
  EXAMPLE_FHIR_STATUS_FINAL,
  EXAMPLE_OBSERVATION_IDENTIFIER,
  EXAMPLE_OBSERVATION_CODE_TOBACCO_SMOKING_STATUS,
  EXAMPLE_OBSERVATION_DISPLAY_TOBACCO_SMOKING_STATUS,
  EXAMPLE_OBSERVATION_VALUE_CONCEPT_NEVER_SMOKER_CODE,
  EXAMPLE_OBSERVATION_VALUE_CONCEPT_NEVER_SMOKER_DISPLAY,
  EXAMPLE_SOCIAL_HISTORY_CATEGORY,
  EXAMPLE_SUBJECT_DID,
  EXAMPLE_VITAL_SIGN_CODE_BODY_TEMPERATURE,
  EXAMPLE_VITAL_SIGN_DISPLAY_BODY_TEMPERATURE,
} from '../src/examples/shared.js';
import { ObservationClaim } from '../src/models/interoperable-claims/observation-claims.js';
import { observationFromFlatToFhirR4, observationToFlatFhirR4 } from '../src/convert/convert-observation.js';

describe('convert/convert-observation', () => {
  it('builds FHIR Observation category and code from split editable claims', () => {
    const claims = {
      '@context': Format.FHIR_API,
      [ObservationClaim.Identifier]: EXAMPLE_OBSERVATION_IDENTIFIER,
      [ObservationClaim.Status]: EXAMPLE_FHIR_STATUS_FINAL,
      [ObservationClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [ObservationClaim.Category]: ObservationCategoryCodes.VitalSigns.claim,
      [ObservationClaim.CodeSystem]: VitalSignsCodes.HeartRate.system,
      [ObservationClaim.CodeValue]: VitalSignsCodes.HeartRate.code,
      [ObservationClaim.CodeText]: VitalSignsCodes.HeartRate.display,
    };

    const resource = observationFromFlatToFhirR4(claims);

    expect(resource.resourceType).toBe('Observation');
    expect((resource.category as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]).toEqual({
      system: ObservationCategoryCodes.VitalSigns.system,
      code: ObservationCategoryCodes.VitalSigns.code,
    });
    expect((resource.code as { coding?: Array<{ system?: string; code?: string }>; text?: string }).coding?.[0]).toEqual({
      system: VitalSignsCodes.HeartRate.system,
      code: VitalSignsCodes.HeartRate.code,
    });
    expect((resource.code as { text?: string }).text).toBe(VitalSignsCodes.HeartRate.display);
  });

  it('extracts split editable claims from FHIR Observation category and coding structures', () => {
    const resource = {
      resourceType: 'Observation',
      status: EXAMPLE_FHIR_STATUS_FINAL,
      subject: { reference: EXAMPLE_SUBJECT_DID },
      category: [{ coding: [{ system: ObservationCategoryCodes.VitalSigns.system, code: ObservationCategoryCodes.VitalSigns.code }] }],
      code: {
        coding: [{ system: FhirCodeSystems.Loinc, code: EXAMPLE_VITAL_SIGN_CODE_BODY_TEMPERATURE, display: EXAMPLE_VITAL_SIGN_DISPLAY_BODY_TEMPERATURE }],
        text: EXAMPLE_VITAL_SIGN_DISPLAY_BODY_TEMPERATURE,
      },
      effectiveDateTime: EXAMPLE_CLINICAL_EVENT_DATE_TIME,
    };

    const claims = observationToFlatFhirR4(resource);

    expect(claims[ObservationClaim.Category]).toBe(ObservationCategoryCodes.VitalSigns.claim);
    expect(claims[ObservationClaim.Code]).toBe(`${FhirCodeSystems.Loinc}|${EXAMPLE_VITAL_SIGN_CODE_BODY_TEMPERATURE}`);
    expect(claims[ObservationClaim.CodeSystem]).toBe(FhirCodeSystems.Loinc);
    expect(claims[ObservationClaim.CodeValue]).toBe(EXAMPLE_VITAL_SIGN_CODE_BODY_TEMPERATURE);
    expect(claims[ObservationClaim.CodeText]).toBe(EXAMPLE_VITAL_SIGN_DISPLAY_BODY_TEMPERATURE);
    expect(claims[ObservationClaim.CodeDisplay]).toBe(EXAMPLE_VITAL_SIGN_DISPLAY_BODY_TEMPERATURE);
  });

  it('builds and extracts valueCodeableConcept from split editable claims', () => {
    const claims = {
      '@context': Format.FHIR_API,
      [ObservationClaim.Identifier]: EXAMPLE_OBSERVATION_IDENTIFIER,
      [ObservationClaim.Status]: EXAMPLE_FHIR_STATUS_FINAL,
      [ObservationClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [ObservationClaim.Category]: EXAMPLE_SOCIAL_HISTORY_CATEGORY,
      [ObservationClaim.CodeSystem]: FhirCodeSystems.Loinc,
      [ObservationClaim.CodeValue]: EXAMPLE_OBSERVATION_CODE_TOBACCO_SMOKING_STATUS,
      [ObservationClaim.CodeText]: EXAMPLE_OBSERVATION_DISPLAY_TOBACCO_SMOKING_STATUS,
      [ObservationClaim.ValueConceptSystem]: FhirCodeSystems.SnomedCt,
      [ObservationClaim.ValueConceptValue]: EXAMPLE_OBSERVATION_VALUE_CONCEPT_NEVER_SMOKER_CODE,
      [ObservationClaim.ValueConceptText]: EXAMPLE_OBSERVATION_VALUE_CONCEPT_NEVER_SMOKER_DISPLAY,
    };

    const resource = observationFromFlatToFhirR4(claims);

    expect((resource.valueCodeableConcept as { coding?: Array<{ system?: string; code?: string }>; text?: string }).coding?.[0]).toEqual({
      system: FhirCodeSystems.SnomedCt,
      code: EXAMPLE_OBSERVATION_VALUE_CONCEPT_NEVER_SMOKER_CODE,
    });
    expect((resource.valueCodeableConcept as { text?: string }).text).toBe(EXAMPLE_OBSERVATION_VALUE_CONCEPT_NEVER_SMOKER_DISPLAY);

    const roundtripClaims = observationToFlatFhirR4(resource);

    expect(roundtripClaims[ObservationClaim.ValueConcept]).toBe(`${FhirCodeSystems.SnomedCt}|${EXAMPLE_OBSERVATION_VALUE_CONCEPT_NEVER_SMOKER_CODE}`);
    expect(roundtripClaims[ObservationClaim.ValueConceptSystem]).toBe(FhirCodeSystems.SnomedCt);
    expect(roundtripClaims[ObservationClaim.ValueConceptValue]).toBe(EXAMPLE_OBSERVATION_VALUE_CONCEPT_NEVER_SMOKER_CODE);
    expect(roundtripClaims[ObservationClaim.ValueConceptText]).toBe(EXAMPLE_OBSERVATION_VALUE_CONCEPT_NEVER_SMOKER_DISPLAY);
    expect(roundtripClaims[ObservationClaim.ValueConceptDisplay]).toBeUndefined();
  });
});
