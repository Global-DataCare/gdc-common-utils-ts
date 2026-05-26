// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/clinical-resource-converters.ts
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import { AllergyIntoleranceClaim } from '../models/interoperable-claims/allergy-intolerance-claims';
import { ConditionClaim } from '../models/interoperable-claims/condition-claims';
import { DeviceUseStatementClaim } from '../models/interoperable-claims/device-use-statement-claims';
import { DocumentReferenceClaim } from '../models/interoperable-claims/document-reference-claims';
import { MedicationStatementClaim } from '../models/interoperable-claims/medication-statement-claims';

export type FlatClaims = Record<string, string | undefined>;
export type FhirResource = Record<string, unknown> & { resourceType: string };

function codingFromValue(value?: string): Array<{ system?: string; code: string }> | undefined {
  if (!value) {
    return undefined;
  }
  const [system, code] = value.split('|');
  if (!code) {
    return [{ code: system }];
  }
  return [{ system, code }];
}

function codingToValue(coding?: { system?: string; code?: string }): string | undefined {
  if (!coding?.code) {
    return undefined;
  }
  return coding.system ? `${coding.system}|${coding.code}` : coding.code;
}

function requireClaim(claims: FlatClaims, key: string): string {
  const value = claims[key];
  if (!value) {
    throw new Error(`Missing required claim: ${key}`);
  }
  return value;
}

function requireSubjectIdentifier(value: string, key: string): void {
  if (!value.startsWith('urn:') && !value.startsWith('did:web:')) {
    throw new Error(`Invalid ${key}: expected urn:* or did:web:*`);
  }
}

function requireDidWeb(value: string, key: string): void {
  if (!value.startsWith('did:web:')) {
    throw new Error(`Invalid ${key}: expected did:web:*`);
  }
}

/**
 * Converts flat claims into a minimal MedicationStatement resource.
 *
 * @param claims Flat medication claims map.
 */
export function medicationStatementFlatToFhir(claims: FlatClaims): FhirResource {
  const subject = requireClaim(claims, MedicationStatementClaim.Subject);
  const status = requireClaim(claims, MedicationStatementClaim.Status);
  const effectiveDateTime = claims[MedicationStatementClaim.Effective];

  const medicationText = claims[MedicationStatementClaim.MedicationText];

  const medicationIdentifier = claims[MedicationStatementClaim.MedicationIdentifier];
  const medicationSerialNumber = claims[MedicationStatementClaim.MedicationSerialNumber];
  const medicationExpirationDate = claims[MedicationStatementClaim.MedicationExpirationDate];
  const hasContainedMedication =
    Boolean(medicationIdentifier)
    || Boolean(medicationSerialNumber)
    || Boolean(medicationExpirationDate)
    || Boolean(medicationText);

  const containedMedicationId = 'medication-contained-1';
  const containedMedication = hasContainedMedication
    ? {
      resourceType: 'Medication',
      id: containedMedicationId,
      identifier: medicationIdentifier ? [{ value: medicationIdentifier }] : undefined,
      code: medicationText ? { text: medicationText } : undefined,
      batch: medicationSerialNumber || medicationExpirationDate
        ? {
          lotNumber: medicationSerialNumber,
          expirationDate: medicationExpirationDate,
        }
        : undefined,
    }
    : undefined;

  const dosageInstructionText = claims[MedicationStatementClaim.DosageInstruction];
  const noteText = claims[MedicationStatementClaim.Note];

  return {
    resourceType: 'MedicationStatement',
    identifier: claims[MedicationStatementClaim.Identifier] ? [{ value: claims[MedicationStatementClaim.Identifier] }] : undefined,
    status,
    subject: { reference: subject },
    effectiveDateTime,
    medicationCodeableConcept: claims[MedicationStatementClaim.Code]
      ? { coding: codingFromValue(claims[MedicationStatementClaim.Code]) }
      : (!hasContainedMedication && medicationText ? { text: medicationText } : undefined),
    medicationReference: hasContainedMedication ? { reference: `#${containedMedicationId}` } : undefined,
    contained: containedMedication ? [containedMedication] : undefined,
    dosage: dosageInstructionText ? [{ text: dosageInstructionText }] : undefined,
    note: noteText ? [{ text: noteText }] : undefined,
  };
}

/**
 * Converts a minimal MedicationStatement resource to flat claims.
 *
 * @param resource FHIR `MedicationStatement` resource.
 */
export function medicationStatementFhirToFlat(resource: FhirResource): FlatClaims {
  const medicationReference = (resource.medicationReference as { reference?: string } | undefined)?.reference;
  const containedResources = Array.isArray(resource.contained) ? (resource.contained as Array<Record<string, unknown>>) : [];
  const containedMedication = medicationReference?.startsWith('#')
    ? containedResources.find((item) =>
      item?.resourceType === 'Medication' && String(item?.id || '') === medicationReference.slice(1))
    : containedResources.find((item) => item?.resourceType === 'Medication');
  const containedMedicationIdentifier = (containedMedication?.identifier as Array<{ value?: string }> | undefined)?.[0]?.value;
  const containedMedicationText = (containedMedication?.code as { text?: string } | undefined)?.text;
  const batch = containedMedication?.batch as { lotNumber?: string; expirationDate?: string } | undefined;
  const dosageInstructionText = (resource.dosage as Array<{ text?: string }> | undefined)?.[0]?.text;
  const noteText = (resource.note as Array<{ text?: string }> | undefined)?.[0]?.text;
  const medicationCode = codingToValue((resource.medicationCodeableConcept as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]);
  const medicationText =
    containedMedicationText
    || (resource.medicationCodeableConcept as { text?: string } | undefined)?.text
    || undefined;

  return {
    [MedicationStatementClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [MedicationStatementClaim.Subject]: (resource.subject as { reference?: string } | undefined)?.reference,
    [MedicationStatementClaim.Status]: resource.status as string | undefined,
    [MedicationStatementClaim.Effective]: resource.effectiveDateTime as string | undefined,
    [MedicationStatementClaim.Code]: medicationCode,
    [MedicationStatementClaim.MedicationText]: medicationText,
    [MedicationStatementClaim.Note]: noteText,
    [MedicationStatementClaim.DosageInstruction]: dosageInstructionText,
    [MedicationStatementClaim.MedicationIdentifier]: containedMedicationIdentifier,
    [MedicationStatementClaim.MedicationSerialNumber]: batch?.lotNumber,
    [MedicationStatementClaim.MedicationExpirationDate]: batch?.expirationDate,
  };
}

/**
 * Converts flat claims into a minimal AllergyIntolerance resource.
 *
 * @param claims Flat allergy/intolerance claims map.
 */
export function allergyIntoleranceFlatToFhir(claims: FlatClaims): FhirResource {
  const patient = claims[AllergyIntoleranceClaim.Subject] ?? claims[AllergyIntoleranceClaim.Patient];
  const recorder = claims[AllergyIntoleranceClaim.Recorder];
  if (!patient) {
    throw new Error(`Missing required claim: ${AllergyIntoleranceClaim.Subject}`);
  }
  requireSubjectIdentifier(patient, AllergyIntoleranceClaim.Subject);
  if (recorder) {
    requireDidWeb(recorder, AllergyIntoleranceClaim.Recorder);
  }

  return {
    resourceType: 'AllergyIntolerance',
    identifier: claims[AllergyIntoleranceClaim.Identifier] ? [{ value: claims[AllergyIntoleranceClaim.Identifier] }] : undefined,
    patient: { reference: patient },
    code: claims[AllergyIntoleranceClaim.Code] ? { coding: codingFromValue(claims[AllergyIntoleranceClaim.Code]) } : undefined,
    clinicalStatus: claims[AllergyIntoleranceClaim.ClinicalStatus]
      ? { coding: [{ code: claims[AllergyIntoleranceClaim.ClinicalStatus] }] }
      : undefined,
    verificationStatus: claims[AllergyIntoleranceClaim.VerificationStatus]
      ? { coding: [{ code: claims[AllergyIntoleranceClaim.VerificationStatus] }] }
      : undefined,
    recorder: recorder ? { reference: recorder } : undefined,
  };
}

/**
 * Converts a minimal AllergyIntolerance resource to flat claims.
 *
 * @param resource FHIR `AllergyIntolerance` resource.
 */
export function allergyIntoleranceFhirToFlat(resource: FhirResource): FlatClaims {
  const subject = (resource.patient as { reference?: string } | undefined)?.reference;
  return {
    [AllergyIntoleranceClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [AllergyIntoleranceClaim.Subject]: subject,
    [AllergyIntoleranceClaim.Patient]: subject,
    [AllergyIntoleranceClaim.Code]: codingToValue((resource.code as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [AllergyIntoleranceClaim.ClinicalStatus]: (resource.clinicalStatus as { coding?: Array<{ code?: string }> } | undefined)?.coding?.[0]?.code,
    [AllergyIntoleranceClaim.VerificationStatus]: (resource.verificationStatus as { coding?: Array<{ code?: string }> } | undefined)?.coding?.[0]?.code,
    [AllergyIntoleranceClaim.Recorder]: (resource.recorder as { reference?: string } | undefined)?.reference,
  };
}

/**
 * Converts flat claims into a minimal Condition resource.
 *
 * @param claims Flat condition claims map.
 */
export function conditionFlatToFhir(claims: FlatClaims): FhirResource {
  const subject = requireClaim(claims, ConditionClaim.Subject);

  return {
    resourceType: 'Condition',
    identifier: claims[ConditionClaim.Identifier] ? [{ value: claims[ConditionClaim.Identifier] }] : undefined,
    subject: { reference: subject },
    code: claims[ConditionClaim.Code] ? { coding: codingFromValue(claims[ConditionClaim.Code]) } : undefined,
    clinicalStatus: claims[ConditionClaim.ClinicalStatus] ? { coding: [{ code: claims[ConditionClaim.ClinicalStatus] }] } : undefined,
    verificationStatus: claims[ConditionClaim.VerificationStatus] ? { coding: [{ code: claims[ConditionClaim.VerificationStatus] }] } : undefined,
  };
}

/**
 * Converts a minimal Condition resource to flat claims.
 *
 * @param resource FHIR `Condition` resource.
 */
export function conditionFhirToFlat(resource: FhirResource): FlatClaims {
  return {
    [ConditionClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [ConditionClaim.Subject]: (resource.subject as { reference?: string } | undefined)?.reference,
    [ConditionClaim.Code]: codingToValue((resource.code as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [ConditionClaim.ClinicalStatus]: (resource.clinicalStatus as { coding?: Array<{ code?: string }> } | undefined)?.coding?.[0]?.code,
    [ConditionClaim.VerificationStatus]: (resource.verificationStatus as { coding?: Array<{ code?: string }> } | undefined)?.coding?.[0]?.code,
  };
}

/**
 * Converts flat claims into a minimal DeviceUseStatement resource.
 *
 * @param claims Flat device-use claims map.
 */
export function deviceUseStatementFlatToFhir(claims: FlatClaims): FhirResource {
  const subject = requireClaim(claims, DeviceUseStatementClaim.Subject);
  const device = requireClaim(claims, DeviceUseStatementClaim.Device);
  const status = requireClaim(claims, DeviceUseStatementClaim.Status);

  return {
    resourceType: 'DeviceUseStatement',
    identifier: claims[DeviceUseStatementClaim.Identifier] ? [{ value: claims[DeviceUseStatementClaim.Identifier] }] : undefined,
    subject: { reference: subject },
    device: { reference: device },
    status,
    recordedOn: claims[DeviceUseStatementClaim.RecordedOn],
    timingDateTime: claims[DeviceUseStatementClaim.TimingDateTime],
  };
}

/**
 * Converts a minimal DeviceUseStatement resource to flat claims.
 *
 * @param resource FHIR `DeviceUseStatement` resource.
 */
export function deviceUseStatementFhirToFlat(resource: FhirResource): FlatClaims {
  return {
    [DeviceUseStatementClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [DeviceUseStatementClaim.Subject]: (resource.subject as { reference?: string } | undefined)?.reference,
    [DeviceUseStatementClaim.Device]: (resource.device as { reference?: string } | undefined)?.reference,
    [DeviceUseStatementClaim.Status]: resource.status as string | undefined,
    [DeviceUseStatementClaim.RecordedOn]: resource.recordedOn as string | undefined,
    [DeviceUseStatementClaim.TimingDateTime]: resource.timingDateTime as string | undefined,
  };
}

/**
 * Converts flat claims into a minimal DocumentReference resource.
 *
 * @param claims Flat document reference claims map.
 */
export function documentReferenceFlatToFhir(claims: FlatClaims): FhirResource {
  const subject = requireClaim(claims, DocumentReferenceClaim.Subject);

  return {
    resourceType: 'DocumentReference',
    identifier: claims[DocumentReferenceClaim.Identifier] ? [{ value: claims[DocumentReferenceClaim.Identifier] }] : undefined,
    subject: { reference: subject },
    description: claims[DocumentReferenceClaim.Description],
    date: claims[DocumentReferenceClaim.Date],
    content: [
      {
        attachment: {
          contentType: claims[DocumentReferenceClaim.ContentType],
          data: claims[DocumentReferenceClaim.ContentData],
          url: claims[DocumentReferenceClaim.Location],
          hash: claims[DocumentReferenceClaim.ContentHash],
          language: claims[DocumentReferenceClaim.Language],
        },
      },
    ],
  };
}

/**
 * Converts a minimal DocumentReference resource to flat claims.
 *
 * @param resource FHIR `DocumentReference` resource.
 */
export function documentReferenceFhirToFlat(resource: FhirResource): FlatClaims {
  const attachment = (resource.content as Array<{ attachment?: Record<string, string> }> | undefined)?.[0]?.attachment;
  return {
    [DocumentReferenceClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [DocumentReferenceClaim.Subject]: (resource.subject as { reference?: string } | undefined)?.reference,
    [DocumentReferenceClaim.Description]: resource.description as string | undefined,
    [DocumentReferenceClaim.Date]: resource.date as string | undefined,
    [DocumentReferenceClaim.ContentType]: attachment?.contentType,
    [DocumentReferenceClaim.ContentData]: attachment?.data,
    [DocumentReferenceClaim.Location]: attachment?.url,
    [DocumentReferenceClaim.ContentHash]: attachment?.hash,
    [DocumentReferenceClaim.Language]: attachment?.language,
  };
}
