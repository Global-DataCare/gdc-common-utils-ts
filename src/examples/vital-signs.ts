// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { VitalSignsCodes, VitalSignsUnits } from '../constants/vital-signs';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';
import type { BundleEntry, BundleJsonApi } from '../models/bundle';
import { Format } from '../constants/Schemas';
import { observationFromFlatToFhirR4 } from '../convert/convert-observation';
import type { FlatClaims } from '../convert/convert-shared';
import { CommunicationAttachedBundleSession } from '../utils/communication-attached-bundle-session';
import { buildVitalSignObservationClaims } from '../utils/individual-bundle-vault';
import type { BuildVitalSignObservationClaimsInput } from '../utils/individual-bundle-vault';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER,
  EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER_SECONDARY,
  EXAMPLE_OBSERVATION_IDENTIFIER,
  EXAMPLE_OBSERVATION_PANEL_IDENTIFIER,
  EXAMPLE_SUBJECT_DID,
  EXAMPLE_VITAL_SIGN_DISPLAY_VITAL_SIGNS,
  EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME,
  EXAMPLE_VITAL_SIGNS_NOTE,
  EXAMPLE_VITAL_SIGN_VALUE_BODY_TEMPERATURE,
  EXAMPLE_VITAL_SIGN_VALUE_DIASTOLIC,
  EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE,
  EXAMPLE_VITAL_SIGN_VALUE_SYSTOLIC,
} from './shared';

/**
 * Shared example inputs for authoring vital-sign Observations in claims-first
 * flows.
 *
 * Reference:
 * - HL7 CIMI Vital Signs with Qualifying Elements IG
 *   https://build.fhir.org/ig/HL7/cimi-vital-signs/
 *
 * These examples intentionally cover only direct vital-sign authoring inputs
 * that a person or simple frontend form would create:
 * - heart rate
 * - body temperature
 * - systolic blood pressure
 * - diastolic blood pressure
 *
 * Panel/group authoring is excluded on purpose because panels are typically
 * imported from external FHIR systems or composed by professional workflows.
 */

/** Example claims-first input for one heart rate Observation (LOINC 8867-4, UCUM /min). */
export const EXAMPLE_VITAL_SIGN_HEART_RATE_INPUT: BuildVitalSignObservationClaimsInput = {
  identifier: EXAMPLE_OBSERVATION_IDENTIFIER,
  subject: EXAMPLE_SUBJECT_DID,
  code: VitalSignsCodes.HeartRate,
  unit: VitalSignsUnits.BeatsPerMinute,
  valueQuantity: EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE,
  effectiveDateTime: EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME,
};

/** Example claims-first input for one body temperature Observation (LOINC 8310-5, UCUM Cel). */
export const EXAMPLE_VITAL_SIGN_BODY_TEMPERATURE_INPUT: BuildVitalSignObservationClaimsInput = {
  identifier: EXAMPLE_OBSERVATION_PANEL_IDENTIFIER,
  subject: EXAMPLE_SUBJECT_DID,
  code: VitalSignsCodes.BodyTemperature,
  unit: VitalSignsUnits.Celsius,
  valueQuantity: EXAMPLE_VITAL_SIGN_VALUE_BODY_TEMPERATURE,
  effectiveDateTime: EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME,
};

/** Example claims-first input for one systolic blood pressure Observation (LOINC 8480-6, UCUM mm[Hg]). */
export const EXAMPLE_VITAL_SIGN_SYSTOLIC_BLOOD_PRESSURE_INPUT: BuildVitalSignObservationClaimsInput = {
  identifier: EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER,
  subject: EXAMPLE_SUBJECT_DID,
  code: VitalSignsCodes.SystolicBloodPressure,
  unit: VitalSignsUnits.MillimeterOfMercury,
  valueQuantity: EXAMPLE_VITAL_SIGN_VALUE_SYSTOLIC,
  effectiveDateTime: EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME,
};

/** Example claims-first input for one diastolic blood pressure Observation (LOINC 8462-4, UCUM mm[Hg]). */
export const EXAMPLE_VITAL_SIGN_DIASTOLIC_BLOOD_PRESSURE_INPUT: BuildVitalSignObservationClaimsInput = {
  identifier: EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER_SECONDARY,
  subject: EXAMPLE_SUBJECT_DID,
  code: VitalSignsCodes.DiastolicBloodPressure,
  unit: VitalSignsUnits.MillimeterOfMercury,
  valueQuantity: EXAMPLE_VITAL_SIGN_VALUE_DIASTOLIC,
  effectiveDateTime: EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME,
};

function resolveObservationEntryFullUrl(identifier: string): string {
  return String(identifier || '').startsWith('urn:')
    ? String(identifier)
    : `urn:uuid:${String(identifier)}`;
}

function toFlatClaims(record: Record<string, unknown>): FlatClaims {
  const claims: FlatClaims = {};
  for (const [key, value] of Object.entries(record || {})) {
    if (value === undefined || value === null) continue;
    claims[key] = typeof value === 'string' ? value : String(value);
  }
  return claims;
}

/**
 * Builds one high-level bundle entry for a vital-sign Observation.
 *
 * This is the preferred copy-paste pattern for frontend flows:
 * 1. author flat claims with `buildVitalSignObservationClaims(...)`
 * 2. convert them to one FHIR R4 `Observation`
 * 3. keep the claims in `resource.meta.claims`
 * 4. append the entry to a `Bundle.data` array
 */
export function buildVitalSignObservationEntry(
  input: BuildVitalSignObservationClaimsInput,
): BundleEntry {
  const claims = buildVitalSignObservationClaims(input);
  const flatClaims = toFlatClaims(claims);
  const resource = observationFromFlatToFhirR4(flatClaims);
  return {
    id: String(claims['Observation.identifier'] || input.identifier),
    fullUrl: resolveObservationEntryFullUrl(String(claims['Observation.identifier'] || input.identifier)),
    type: `${ResourceTypesFhirR4.Observation}-entry-v1.0`,
    resource: {
      ...resource,
      meta: {
        ...(resource.meta || {}),
        claims: flatClaims,
      },
    },
  };
}

/**
 * Builds a high-level bundle with one entry per directly authored vital sign.
 *
 * Included examples:
 * - heart rate
 * - body temperature
 * - systolic blood pressure
 * - diastolic blood pressure
 *
 * Panels are intentionally excluded because the app user normally authors
 * simple observations, not professional/imported panel structures.
 */
export function buildExampleVitalSignsObservationBundle(): BundleJsonApi<BundleEntry> {
  return {
    resourceType: ResourceTypesFhirR4.Bundle,
    type: 'collection',
    data: [
      buildVitalSignObservationEntry(EXAMPLE_VITAL_SIGN_HEART_RATE_INPUT),
      buildVitalSignObservationEntry(EXAMPLE_VITAL_SIGN_BODY_TEMPERATURE_INPUT),
      buildVitalSignObservationEntry(EXAMPLE_VITAL_SIGN_SYSTOLIC_BLOOD_PRESSURE_INPUT),
      buildVitalSignObservationEntry(EXAMPLE_VITAL_SIGN_DIASTOLIC_BLOOD_PRESSURE_INPUT),
    ],
  };
}

/**
 * Builds the same vital-sign bundle through `CommunicationAttachedBundleSession`
 * for flows that already use the in-memory bundle editor/session abstraction.
 */
export function buildExampleVitalSignsObservationBundleSession(): BundleJsonApi<BundleEntry> {
  const session = new CommunicationAttachedBundleSession({
    communicationClaims: {
      '@context': Format.FHIR_API,
      [CommunicationClaim.Identifier]: EXAMPLE_COMMUNICATION_IDENTIFIER,
      [CommunicationClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [CommunicationClaim.Text]: EXAMPLE_VITAL_SIGN_DISPLAY_VITAL_SIGNS,
    },
  });

  const inputs = [
    EXAMPLE_VITAL_SIGN_HEART_RATE_INPUT,
    EXAMPLE_VITAL_SIGN_BODY_TEMPERATURE_INPUT,
    EXAMPLE_VITAL_SIGN_SYSTOLIC_BLOOD_PRESSURE_INPUT,
    EXAMPLE_VITAL_SIGN_DIASTOLIC_BLOOD_PRESSURE_INPUT,
  ];

  for (const input of inputs) {
    session.upsertActiveObservationEntry({
      claims: buildVitalSignObservationClaims({
        ...input,
        note: EXAMPLE_VITAL_SIGNS_NOTE,
      }),
      fullUrl: resolveObservationEntryFullUrl(input.identifier),
      type: `${ResourceTypesFhirR4.Observation}-entry-v1.0`,
    });
    session.saveAndReleaseActiveEntry();
  }

  return session.getBundleInMemory();
}
