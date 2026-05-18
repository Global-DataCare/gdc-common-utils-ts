// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/clinical-resource-converters.ts

import { DocumentReferenceClaim } from '../models/interoperable-claims/document-reference-claims';

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
 */
export function medicationStatementFlatToFhir(claims: FlatClaims): FhirResource {
  const subject = requireClaim(claims, 'MedicationStatement.subject');
  const status = requireClaim(claims, 'MedicationStatement.status');

  return {
    resourceType: 'MedicationStatement',
    identifier: claims['MedicationStatement.identifier'] ? [{ value: claims['MedicationStatement.identifier'] }] : undefined,
    status,
    subject: { reference: subject },
    effectiveDateTime: claims['MedicationStatement.effective'],
    medicationCodeableConcept: claims['MedicationStatement.code']
      ? { coding: codingFromValue(claims['MedicationStatement.code']) }
      : undefined,
  };
}

/**
 * Converts a minimal MedicationStatement resource to flat claims.
 */
export function medicationStatementFhirToFlat(resource: FhirResource): FlatClaims {
  return {
    'MedicationStatement.identifier': (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    'MedicationStatement.subject': (resource.subject as { reference?: string } | undefined)?.reference,
    'MedicationStatement.status': resource.status as string | undefined,
    'MedicationStatement.effective': resource.effectiveDateTime as string | undefined,
    'MedicationStatement.code': codingToValue((resource.medicationCodeableConcept as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
  };
}

export function allergyIntoleranceFlatToFhir(claims: FlatClaims): FhirResource {
  const patient = claims['AllergyIntolerance.subject'] ?? claims['AllergyIntolerance.patient'];
  if (!patient) {
    throw new Error('Missing required claim: AllergyIntolerance.subject');
  }
  requireSubjectIdentifier(patient, 'AllergyIntolerance.subject');
  if (claims['AllergyIntolerance.recorder']) {
    requireDidWeb(claims['AllergyIntolerance.recorder'], 'AllergyIntolerance.recorder');
  }

  return {
    resourceType: 'AllergyIntolerance',
    identifier: claims['AllergyIntolerance.identifier'] ? [{ value: claims['AllergyIntolerance.identifier'] }] : undefined,
    patient: { reference: patient },
    code: claims['AllergyIntolerance.code'] ? { coding: codingFromValue(claims['AllergyIntolerance.code']) } : undefined,
    clinicalStatus: claims['AllergyIntolerance.clinical-status']
      ? { coding: [{ code: claims['AllergyIntolerance.clinical-status'] }] }
      : undefined,
    verificationStatus: claims['AllergyIntolerance.verification-status']
      ? { coding: [{ code: claims['AllergyIntolerance.verification-status'] }] }
      : undefined,
    recorder: claims['AllergyIntolerance.recorder'] ? { reference: claims['AllergyIntolerance.recorder'] } : undefined,
  };
}

export function allergyIntoleranceFhirToFlat(resource: FhirResource): FlatClaims {
  const subject = (resource.patient as { reference?: string } | undefined)?.reference;
  return {
    'AllergyIntolerance.identifier': (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    'AllergyIntolerance.subject': subject,
    'AllergyIntolerance.patient': subject,
    'AllergyIntolerance.code': codingToValue((resource.code as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    'AllergyIntolerance.clinical-status': (resource.clinicalStatus as { coding?: Array<{ code?: string }> } | undefined)?.coding?.[0]?.code,
    'AllergyIntolerance.verification-status': (resource.verificationStatus as { coding?: Array<{ code?: string }> } | undefined)?.coding?.[0]?.code,
    'AllergyIntolerance.recorder': (resource.recorder as { reference?: string } | undefined)?.reference,
  };
}

export function conditionFlatToFhir(claims: FlatClaims): FhirResource {
  const subject = requireClaim(claims, 'Condition.subject');

  return {
    resourceType: 'Condition',
    identifier: claims['Condition.identifier'] ? [{ value: claims['Condition.identifier'] }] : undefined,
    subject: { reference: subject },
    code: claims['Condition.code'] ? { coding: codingFromValue(claims['Condition.code']) } : undefined,
    clinicalStatus: claims['Condition.clinical-status'] ? { coding: [{ code: claims['Condition.clinical-status'] }] } : undefined,
    verificationStatus: claims['Condition.verification-status'] ? { coding: [{ code: claims['Condition.verification-status'] }] } : undefined,
  };
}

export function conditionFhirToFlat(resource: FhirResource): FlatClaims {
  return {
    'Condition.identifier': (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    'Condition.subject': (resource.subject as { reference?: string } | undefined)?.reference,
    'Condition.code': codingToValue((resource.code as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    'Condition.clinical-status': (resource.clinicalStatus as { coding?: Array<{ code?: string }> } | undefined)?.coding?.[0]?.code,
    'Condition.verification-status': (resource.verificationStatus as { coding?: Array<{ code?: string }> } | undefined)?.coding?.[0]?.code,
  };
}

export function deviceUseStatementFlatToFhir(claims: FlatClaims): FhirResource {
  const subject = requireClaim(claims, 'DeviceUseStatement.subject');
  const device = requireClaim(claims, 'DeviceUseStatement.device');
  const status = requireClaim(claims, 'DeviceUseStatement.status');

  return {
    resourceType: 'DeviceUseStatement',
    identifier: claims['DeviceUseStatement.identifier'] ? [{ value: claims['DeviceUseStatement.identifier'] }] : undefined,
    subject: { reference: subject },
    device: { reference: device },
    status,
    recordedOn: claims['DeviceUseStatement.recordedon'],
    timingDateTime: claims['DeviceUseStatement.timing-datetime'],
  };
}

export function deviceUseStatementFhirToFlat(resource: FhirResource): FlatClaims {
  return {
    'DeviceUseStatement.identifier': (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    'DeviceUseStatement.subject': (resource.subject as { reference?: string } | undefined)?.reference,
    'DeviceUseStatement.device': (resource.device as { reference?: string } | undefined)?.reference,
    'DeviceUseStatement.status': resource.status as string | undefined,
    'DeviceUseStatement.recordedon': resource.recordedOn as string | undefined,
    'DeviceUseStatement.timing-datetime': resource.timingDateTime as string | undefined,
  };
}

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
