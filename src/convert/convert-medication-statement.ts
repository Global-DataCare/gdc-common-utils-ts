// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-medication-statement.ts

import { MedicationStatementClaim } from '../models/interoperable-claims/medication-statement-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, requireClaim } from './convert-shared';

export function medicationStatementFlatToFhirR4(claims: FlatClaims): FhirResource {
  const subject = requireClaim(claims, MedicationStatementClaim.Subject);
  const status = requireClaim(claims, MedicationStatementClaim.Status);
  const effectiveDateTime = claims[MedicationStatementClaim.Effective];
  const medicationText = claims[MedicationStatementClaim.MedicationText];
  const medicationIdentifier = claims[MedicationStatementClaim.MedicationIdentifier];
  const medicationSerialNumber = claims[MedicationStatementClaim.MedicationSerialNumber];
  const medicationExpirationDate = claims[MedicationStatementClaim.MedicationExpirationDate];
  const hasContainedMedication =
    Boolean(medicationIdentifier) || Boolean(medicationSerialNumber) || Boolean(medicationExpirationDate) || Boolean(medicationText);
  const containedMedicationId = 'medication-contained-1';
  const containedMedication = hasContainedMedication ? {
    resourceType: 'Medication',
    id: containedMedicationId,
    identifier: medicationIdentifier ? [{ value: medicationIdentifier }] : undefined,
    code: medicationText ? { text: medicationText } : undefined,
    batch: medicationSerialNumber || medicationExpirationDate ? {
      lotNumber: medicationSerialNumber,
      expirationDate: medicationExpirationDate,
    } : undefined,
  } : undefined;
  return {
    resourceType: 'MedicationStatement',
    identifier: claims[MedicationStatementClaim.Identifier] ? [{ value: claims[MedicationStatementClaim.Identifier] }] : undefined,
    status,
    subject: { reference: subject },
    effectiveDateTime,
    medicationCodeableConcept: claims[MedicationStatementClaim.Code]
      ? {
        coding: codingFromValue(claims[MedicationStatementClaim.Code])?.map((coding) => ({
          ...coding,
          ...(claims[MedicationStatementClaim.CodeDisplay] ? { display: claims[MedicationStatementClaim.CodeDisplay] } : {}),
        })),
        ...(medicationText ? { text: medicationText } : {}),
      }
      : (!hasContainedMedication && medicationText ? { text: medicationText } : undefined),
    medicationReference: hasContainedMedication ? { reference: `#${containedMedicationId}` } : undefined,
    contained: containedMedication ? [containedMedication] : undefined,
    dosage: claims[MedicationStatementClaim.DosageInstruction] ? [{ text: claims[MedicationStatementClaim.DosageInstruction] }] : undefined,
    note: claims[MedicationStatementClaim.Note] ? [{ text: claims[MedicationStatementClaim.Note] }] : undefined,
  };
}

export function medicationStatementFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const medicationReference = (resource.medicationReference as { reference?: string } | undefined)?.reference;
  const containedResources = Array.isArray(resource.contained) ? (resource.contained as Array<Record<string, unknown>>) : [];
  const containedMedication = medicationReference?.startsWith('#')
    ? containedResources.find((item) => item?.resourceType === 'Medication' && String(item?.id || '') === medicationReference.slice(1))
    : containedResources.find((item) => item?.resourceType === 'Medication');
  const containedMedicationIdentifier = (containedMedication?.identifier as Array<{ value?: string }> | undefined)?.[0]?.value;
  const containedMedicationText = (containedMedication?.code as { text?: string } | undefined)?.text;
  const batch = containedMedication?.batch as { lotNumber?: string; expirationDate?: string } | undefined;
  const medicationConcept = resource.medicationCodeableConcept as { text?: string; coding?: Array<{ system?: string; code?: string; display?: string }> } | undefined;
  const medicationCode = codingToValue(medicationConcept?.coding?.[0]);
  const medicationText = containedMedicationText || medicationConcept?.text || undefined;
  return {
    [MedicationStatementClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [MedicationStatementClaim.Subject]: (resource.subject as { reference?: string } | undefined)?.reference,
    [MedicationStatementClaim.Status]: resource.status as string | undefined,
    [MedicationStatementClaim.Effective]: resource.effectiveDateTime as string | undefined,
    [MedicationStatementClaim.Code]: medicationCode,
    [MedicationStatementClaim.MedicationText]: medicationText,
    [MedicationStatementClaim.CodeDisplay]: medicationConcept?.coding?.[0]?.display,
    [MedicationStatementClaim.Note]: (resource.note as Array<{ text?: string }> | undefined)?.[0]?.text,
    [MedicationStatementClaim.DosageInstruction]: (resource.dosage as Array<{ text?: string }> | undefined)?.[0]?.text,
    [MedicationStatementClaim.MedicationIdentifier]: containedMedicationIdentifier,
    [MedicationStatementClaim.MedicationSerialNumber]: batch?.lotNumber,
    [MedicationStatementClaim.MedicationExpirationDate]: batch?.expirationDate,
  };
}
