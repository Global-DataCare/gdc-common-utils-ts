// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-medication-statement.ts

import { MedicationStatementClaim } from '../models/interoperable-claims/medication-statement-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, requireClaim } from './convert-shared';

export function medicationStatementFlatToFhirR4(claims: FlatClaims): FhirResource {
  const subject = requireClaim(claims, MedicationStatementClaim.Subject);
  const status = requireClaim(claims, MedicationStatementClaim.Status);
  const effectiveDateTime = claims[MedicationStatementClaim.Effective];
  const medicationText = claims[MedicationStatementClaim.CodeText]
    || claims[MedicationStatementClaim.MedicationText];
  const medicationReference = claims[MedicationStatementClaim.Medication];
  const medicationIdentifier = claims[MedicationStatementClaim.MedicationIdentifier];
  const medicationSerialNumber = claims[MedicationStatementClaim.MedicationSerialNumber];
  const medicationExpirationDate = claims[MedicationStatementClaim.MedicationExpirationDate];
  const hasContainedMedication =
    Boolean(medicationIdentifier) || Boolean(medicationSerialNumber) || Boolean(medicationExpirationDate);
  const containedMedicationId = 'medication-contained-1';
  const containedMedication = hasContainedMedication ? {
    resourceType: 'Medication',
    id: containedMedicationId,
    identifier: medicationIdentifier ? [{ value: medicationIdentifier }] : undefined,
    code: claims[MedicationStatementClaim.Code] || medicationText ? {
      coding: codingFromValue(claims[MedicationStatementClaim.Code])?.map((coding) => ({
        ...coding,
        ...(claims[MedicationStatementClaim.CodeDisplay] ? { display: claims[MedicationStatementClaim.CodeDisplay] } : {}),
      })),
      ...(medicationText ? { text: medicationText } : {}),
    } : undefined,
    batch: medicationSerialNumber || medicationExpirationDate ? {
      lotNumber: medicationSerialNumber,
      expirationDate: medicationExpirationDate,
    } : undefined,
  } : undefined;
  const dosageRoute = claims[MedicationStatementClaim.DosageRoute];
  const dosageFrequency = claims[MedicationStatementClaim.TimingFrequency];
  const dosagePeriod = claims[MedicationStatementClaim.TimingPeriod];
  const dosagePeriodUnit = claims[MedicationStatementClaim.TimingPeriodUnit];
  const doseValue = claims[MedicationStatementClaim.DoseQuantityValue];
  const doseUnit = claims[MedicationStatementClaim.DoseQuantityUnit];
  const hasDosage = claims[MedicationStatementClaim.DosageInstruction] || dosageRoute || dosageFrequency || dosagePeriod || doseValue;
  return {
    resourceType: 'MedicationStatement',
    identifier: claims[MedicationStatementClaim.Identifier] ? [{ value: claims[MedicationStatementClaim.Identifier] }] : undefined,
    status,
    subject: { reference: subject },
    effectiveDateTime,
    medicationCodeableConcept: !medicationReference && !hasContainedMedication && claims[MedicationStatementClaim.Code]
      ? {
        coding: codingFromValue(claims[MedicationStatementClaim.Code])?.map((coding) => ({
          ...coding,
          ...(claims[MedicationStatementClaim.CodeDisplay] ? { display: claims[MedicationStatementClaim.CodeDisplay] } : {}),
        })),
        ...(medicationText ? { text: medicationText } : {}),
      }
      : (!medicationReference && !hasContainedMedication && medicationText ? { text: medicationText } : undefined),
    medicationReference: medicationReference
      ? { reference: medicationReference }
      : (hasContainedMedication ? { reference: `#${containedMedicationId}` } : undefined),
    contained: containedMedication ? [containedMedication] : undefined,
    informationSource: claims[MedicationStatementClaim.Source] ? { reference: claims[MedicationStatementClaim.Source] } : undefined,
    dosage: hasDosage ? [{
      text: claims[MedicationStatementClaim.DosageInstruction],
      route: dosageRoute ? { coding: codingFromValue(dosageRoute) } : undefined,
      timing: dosageFrequency || dosagePeriod || dosagePeriodUnit ? { repeat: {
        frequency: dosageFrequency ? Number(dosageFrequency) : undefined,
        period: dosagePeriod ? Number(dosagePeriod) : undefined,
        periodUnit: dosagePeriodUnit,
      } } : undefined,
      doseAndRate: doseValue ? [{ doseQuantity: {
        value: Number(doseValue),
        unit: doseUnit,
        ...(codingFromValue(doseUnit)?.[0] || {}),
      } }] : undefined,
    }] : undefined,
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
  const containedMedicationConcept = containedMedication?.code as { text?: string; coding?: Array<{ system?: string; code?: string; display?: string }> } | undefined;
  const containedMedicationText = containedMedicationConcept?.text;
  const batch = containedMedication?.batch as { lotNumber?: string; expirationDate?: string } | undefined;
  const medicationConcept = resource.medicationCodeableConcept as { text?: string; coding?: Array<{ system?: string; code?: string; display?: string }> } | undefined;
  const medicationCode = codingToValue(medicationConcept?.coding?.[0] || containedMedicationConcept?.coding?.[0]);
  const medicationText = containedMedicationText || medicationConcept?.text || undefined;
  const dosage = (resource.dosage as Array<Record<string, unknown>> | undefined)?.[0];
  const repeat = dosage?.timing
    ? (dosage.timing as { repeat?: Record<string, unknown> }).repeat
    : undefined;
  const routeCoding = (dosage?.route as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0];
  const doseQuantity = ((dosage?.doseAndRate as Array<Record<string, unknown>> | undefined)?.[0]?.doseQuantity) as Record<string, unknown> | undefined;
  return {
    [MedicationStatementClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [MedicationStatementClaim.Subject]: (resource.subject as { reference?: string } | undefined)?.reference,
    [MedicationStatementClaim.Status]: resource.status as string | undefined,
    [MedicationStatementClaim.Effective]: resource.effectiveDateTime as string | undefined,
    [MedicationStatementClaim.Code]: medicationCode,
    [MedicationStatementClaim.CodeText]: medicationText,
    [MedicationStatementClaim.Medication]: medicationReference?.startsWith('#') ? undefined : medicationReference,
    [MedicationStatementClaim.CodeDisplay]: medicationConcept?.coding?.[0]?.display || containedMedicationConcept?.coding?.[0]?.display,
    [MedicationStatementClaim.Note]: (resource.note as Array<{ text?: string }> | undefined)?.[0]?.text,
    [MedicationStatementClaim.DosageInstruction]: (resource.dosage as Array<{ text?: string }> | undefined)?.[0]?.text,
    [MedicationStatementClaim.Source]: (resource.informationSource as { reference?: string } | undefined)?.reference,
    [MedicationStatementClaim.DosageRoute]: codingToValue(routeCoding),
    [MedicationStatementClaim.DoseQuantityValue]: doseQuantity?.value === undefined ? undefined : String(doseQuantity.value),
    [MedicationStatementClaim.DoseQuantityUnit]: codingToValue(doseQuantity?.system || doseQuantity?.code ? { system: doseQuantity?.system as string, code: doseQuantity?.code as string } : undefined) || doseQuantity?.unit as string | undefined,
    [MedicationStatementClaim.TimingFrequency]: repeat?.frequency === undefined ? undefined : String(repeat.frequency),
    [MedicationStatementClaim.TimingPeriod]: repeat?.period === undefined ? undefined : String(repeat.period),
    [MedicationStatementClaim.TimingPeriodUnit]: repeat?.periodUnit as string | undefined,
    [MedicationStatementClaim.MedicationIdentifier]: containedMedicationIdentifier,
    [MedicationStatementClaim.MedicationSerialNumber]: batch?.lotNumber,
    [MedicationStatementClaim.MedicationExpirationDate]: batch?.expirationDate,
  };
}
