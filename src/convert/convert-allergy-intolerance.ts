// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-allergy-intolerance.ts

import { AllergyIntoleranceClaim } from '../models/interoperable-claims/allergy-intolerance-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, requireDidWeb, requireSubjectIdentifier } from './convert-shared';

export function allergyIntoleranceFlatToFhirR4(claims: FlatClaims): FhirResource {
  const patient = claims[AllergyIntoleranceClaim.Subject] ?? claims[AllergyIntoleranceClaim.Patient];
  const recorder = claims[AllergyIntoleranceClaim.Recorder];
  const manifestation = claims[AllergyIntoleranceClaim.Manifestation];
  const severity = claims[AllergyIntoleranceClaim.Severity];
  const reactionOnset = claims[AllergyIntoleranceClaim.Onset];
  const route = claims[AllergyIntoleranceClaim.Route];
  if (!patient) throw new Error(`Missing required claim: ${AllergyIntoleranceClaim.Subject}`);
  if ((severity || reactionOnset || route) && !manifestation) {
    throw new Error(`${severity ? AllergyIntoleranceClaim.Severity : reactionOnset ? AllergyIntoleranceClaim.Onset : AllergyIntoleranceClaim.Route} requires ${AllergyIntoleranceClaim.Manifestation}`);
  }
  requireSubjectIdentifier(patient, AllergyIntoleranceClaim.Subject);
  if (recorder) requireDidWeb(recorder, AllergyIntoleranceClaim.Recorder);
  return {
    resourceType: 'AllergyIntolerance',
    identifier: claims[AllergyIntoleranceClaim.Identifier] ? [{ value: claims[AllergyIntoleranceClaim.Identifier] }] : undefined,
    patient: { reference: patient },
    code: claims[AllergyIntoleranceClaim.Code]
      ? {
        coding: codingFromValue(claims[AllergyIntoleranceClaim.Code])?.map((coding) => ({
          ...coding,
          ...(claims[AllergyIntoleranceClaim.CodeDisplay]
            ? { display: claims[AllergyIntoleranceClaim.CodeDisplay] }
            : {}),
        })),
        ...(claims[AllergyIntoleranceClaim.CodeText]
          ? { text: claims[AllergyIntoleranceClaim.CodeText] }
          : {}),
      }
      : undefined,
    clinicalStatus: claims[AllergyIntoleranceClaim.ClinicalStatus] ? { coding: [{ code: claims[AllergyIntoleranceClaim.ClinicalStatus] }] } : undefined,
    verificationStatus: claims[AllergyIntoleranceClaim.VerificationStatus] ? { coding: [{ code: claims[AllergyIntoleranceClaim.VerificationStatus] }] } : undefined,
    category: claims[AllergyIntoleranceClaim.Category] ? [claims[AllergyIntoleranceClaim.Category]] : undefined,
    criticality: claims[AllergyIntoleranceClaim.Criticality],
    type: claims[AllergyIntoleranceClaim.Type],
    onsetDateTime: claims[AllergyIntoleranceClaim.OnsetDateTime],
    recordedDate: claims[AllergyIntoleranceClaim.RecordedDate],
    lastOccurrence: claims[AllergyIntoleranceClaim.LastOccurrence],
    asserter: claims[AllergyIntoleranceClaim.Asserter]
      ? { reference: claims[AllergyIntoleranceClaim.Asserter] }
      : undefined,
    recorder: recorder ? { reference: recorder } : undefined,
    reaction: manifestation ? [{
      manifestation: [{ coding: codingFromValue(manifestation) }],
      onset: reactionOnset,
      severity,
      exposureRoute: route ? { coding: codingFromValue(route) } : undefined,
    }] : undefined,
  };
}

export function allergyIntoleranceFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const subject = (resource.patient as { reference?: string } | undefined)?.reference;
  const code = resource.code as { text?: string; coding?: Array<{ system?: string; code?: string; display?: string }> } | undefined;
  const reaction = (resource.reaction as Array<Record<string, unknown>> | undefined)?.[0];
  const manifestation = (reaction?.manifestation as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0];
  const exposureRoute = reaction?.exposureRoute as { coding?: Array<{ system?: string; code?: string }> } | undefined;
  return {
    [AllergyIntoleranceClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [AllergyIntoleranceClaim.Subject]: subject,
    [AllergyIntoleranceClaim.Patient]: subject,
    [AllergyIntoleranceClaim.Code]: codingToValue(code?.coding?.[0]) || code?.text,
    [AllergyIntoleranceClaim.CodeText]: code?.text,
    [AllergyIntoleranceClaim.CodeDisplay]: code?.coding?.[0]?.display,
    [AllergyIntoleranceClaim.ClinicalStatus]: (resource.clinicalStatus as { coding?: Array<{ code?: string }> } | undefined)?.coding?.[0]?.code,
    [AllergyIntoleranceClaim.VerificationStatus]: (resource.verificationStatus as { coding?: Array<{ code?: string }> } | undefined)?.coding?.[0]?.code,
    [AllergyIntoleranceClaim.Category]: (resource.category as string[] | undefined)?.[0],
    [AllergyIntoleranceClaim.Criticality]: resource.criticality as string | undefined,
    [AllergyIntoleranceClaim.Type]: resource.type as string | undefined,
    [AllergyIntoleranceClaim.OnsetDateTime]: resource.onsetDateTime as string | undefined,
    [AllergyIntoleranceClaim.RecordedDate]: resource.recordedDate as string | undefined,
    [AllergyIntoleranceClaim.LastOccurrence]: resource.lastOccurrence as string | undefined,
    [AllergyIntoleranceClaim.Asserter]: (resource.asserter as { reference?: string } | undefined)?.reference,
    [AllergyIntoleranceClaim.Manifestation]: codingToValue(manifestation?.coding?.[0]),
    [AllergyIntoleranceClaim.Onset]: reaction?.onset as string | undefined,
    [AllergyIntoleranceClaim.Route]: codingToValue(exposureRoute?.coding?.[0]),
    [AllergyIntoleranceClaim.Severity]: reaction?.severity as string | undefined,
    [AllergyIntoleranceClaim.Recorder]: (resource.recorder as { reference?: string } | undefined)?.reference,
  };
}
