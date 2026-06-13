import { FhirCodeSystems } from './fhir-code-systems';
import type { CodingDescriptor } from './observation-category';

export { ObservationCategoryCodes } from './observation-category';
export type { CodingDescriptor } from './observation-category';

function defineCoding(system: string, code: string, display?: string): CodingDescriptor {
  return Object.freeze({
    system,
    code,
    display,
    claim: `${system}|${code}`,
  });
}

/**
 * Canonical LOINC descriptors for the currently supported Vital Signs.
 */
export const VitalSignsCodes = Object.freeze({
  HeartRate: defineCoding(FhirCodeSystems.Loinc, '8867-4', 'Heart rate'),
  BloodPressure: defineCoding(FhirCodeSystems.Loinc, '85354-9', 'Blood pressure panel'),
  SystolicBloodPressure: defineCoding(FhirCodeSystems.Loinc, '8480-6', 'Systolic blood pressure'),
  DiastolicBloodPressure: defineCoding(FhirCodeSystems.Loinc, '8462-4', 'Diastolic blood pressure'),
  BodyTemperature: defineCoding(FhirCodeSystems.Loinc, '8310-5', 'Body temperature'),
} as const);

/**
 * Canonical UCUM unit descriptors used by the supported Vital Signs.
 */
export const VitalSignsUnits = Object.freeze({
  BeatsPerMinute: defineCoding(FhirCodeSystems.Ucum, '/min', 'beats/minute'),
  MillimeterOfMercury: defineCoding(FhirCodeSystems.Ucum, 'mm[Hg]', 'mmHg'),
  Celsius: defineCoding(FhirCodeSystems.Ucum, 'Cel', 'degrees Celsius'),
} as const);
