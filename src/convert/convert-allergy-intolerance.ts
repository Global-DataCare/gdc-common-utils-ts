// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-allergy-intolerance.ts

import { AllergyIntoleranceClaim } from '../models/interoperable-claims/allergy-intolerance-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, requireDidWeb, requireSubjectIdentifier } from './convert-shared';

export function allergyIntoleranceFlatToFhirR4(claims: FlatClaims): FhirResource {
  const patient = claims[AllergyIntoleranceClaim.Subject] ?? claims[AllergyIntoleranceClaim.Patient];
  const recorder = claims[AllergyIntoleranceClaim.Recorder];
  if (!patient) throw new Error(`Missing required claim: ${AllergyIntoleranceClaim.Subject}`);
  requireSubjectIdentifier(patient, AllergyIntoleranceClaim.Subject);
  if (recorder) requireDidWeb(recorder, AllergyIntoleranceClaim.Recorder);
  return {
    resourceType: 'AllergyIntolerance',
    identifier: claims[AllergyIntoleranceClaim.Identifier] ? [{ value: claims[AllergyIntoleranceClaim.Identifier] }] : undefined,
    patient: { reference: patient },
    code: claims[AllergyIntoleranceClaim.Code] ? { coding: codingFromValue(claims[AllergyIntoleranceClaim.Code]) } : undefined,
    clinicalStatus: claims[AllergyIntoleranceClaim.ClinicalStatus] ? { coding: [{ code: claims[AllergyIntoleranceClaim.ClinicalStatus] }] } : undefined,
    verificationStatus: claims[AllergyIntoleranceClaim.VerificationStatus] ? { coding: [{ code: claims[AllergyIntoleranceClaim.VerificationStatus] }] } : undefined,
    category: claims[AllergyIntoleranceClaim.Category] ? [claims[AllergyIntoleranceClaim.Category]] : undefined,
    criticality: claims[AllergyIntoleranceClaim.Criticality],
    onsetDateTime: claims[AllergyIntoleranceClaim.OnsetDateTime],
    recorder: recorder ? { reference: recorder } : undefined,
  };
}

export function allergyIntoleranceFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const subject = (resource.patient as { reference?: string } | undefined)?.reference;
  const code = resource.code as { text?: string; coding?: Array<{ system?: string; code?: string }> } | undefined;
  return {
    [AllergyIntoleranceClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [AllergyIntoleranceClaim.Subject]: subject,
    [AllergyIntoleranceClaim.Patient]: subject,
    [AllergyIntoleranceClaim.Code]: codingToValue(code?.coding?.[0]) || code?.text,
    [AllergyIntoleranceClaim.ClinicalStatus]: (resource.clinicalStatus as { coding?: Array<{ code?: string }> } | undefined)?.coding?.[0]?.code,
    [AllergyIntoleranceClaim.VerificationStatus]: (resource.verificationStatus as { coding?: Array<{ code?: string }> } | undefined)?.coding?.[0]?.code,
    [AllergyIntoleranceClaim.Category]: (resource.category as string[] | undefined)?.[0],
    [AllergyIntoleranceClaim.Criticality]: resource.criticality as string | undefined,
    [AllergyIntoleranceClaim.OnsetDateTime]: resource.onsetDateTime as string | undefined,
    [AllergyIntoleranceClaim.Recorder]: (resource.recorder as { reference?: string } | undefined)?.reference,
  };
}
