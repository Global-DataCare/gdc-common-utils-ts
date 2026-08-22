import {
  ClaimsOrderSchemaorg,
  FhirCodeSystems,
  ObservationCategoryCodes,
  VitalSignsCodes,
} from '../src/constants';
import {
  EXAMPLE_OBSERVATION_ANXIETY_CODING,
  EXAMPLE_OBSERVATION_BODY_WEIGHT_CODING,
  EXAMPLE_OBSERVATION_EVENT_TIMING_NIGHT_CODING,
  EXAMPLE_LICENSE_PAYMENT_METHOD_STRIPE,
} from '../src/examples';
import { EXAMPLE_DEVICE_LICENSE_AVAILABLE } from '../src/examples/license';
import { POSTAL_ACTIVATION_CODE_BINDING_ALGORITHM } from '../src/utils/organization-test-network-credential';

describe('canonical Order claims and reusable clinical codings', () => {
  it('uses Schema.org confirmationNumber instead of a private gdc claim', () => {
    expect(ClaimsOrderSchemaorg.confirmationNumber).toBe('org.schema.Order.confirmationNumber');
    expect(POSTAL_ACTIVATION_CODE_BINDING_ALGORITHM).toBe('scrypt-v1');
    expect(EXAMPLE_LICENSE_PAYMENT_METHOD_STRIPE).toBe('Stripe');
    expect(EXAMPLE_DEVICE_LICENSE_AVAILABLE.status).toBe('available');
  });

  it('exports reusable standard codings without a private tag system', () => {
    expect(VitalSignsCodes.BodyWeight).toMatchObject(EXAMPLE_OBSERVATION_BODY_WEIGHT_CODING);
    expect(ObservationCategoryCodes.VitalSigns.system).toBe(FhirCodeSystems.ObservationCategory);
    expect(EXAMPLE_OBSERVATION_ANXIETY_CODING.system).toBe(FhirCodeSystems.SnomedCt);
    expect(EXAMPLE_OBSERVATION_EVENT_TIMING_NIGHT_CODING.system).toBe(FhirCodeSystems.EventTiming);
    for (const coding of [
      EXAMPLE_OBSERVATION_BODY_WEIGHT_CODING,
      EXAMPLE_OBSERVATION_ANXIETY_CODING,
      EXAMPLE_OBSERVATION_EVENT_TIMING_NIGHT_CODING,
    ]) {
      expect(coding.system).not.toMatch(/^(?:org\.schema\.)?gdc\./);
    }
  });
});
