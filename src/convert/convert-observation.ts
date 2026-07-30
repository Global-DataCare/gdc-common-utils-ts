// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-observation.ts

import { ObservationClaim } from '../models/interoperable-claims/observation-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingListToCsv, codingToValue, referenceListToCsv, referenceToValue } from './convert-shared';

/**
 * Converts flat editable Observation claims into a FHIR R4 Observation.
 *
 * Naming convention:
 * - place the concrete FHIR version suffix at the end of the helper name
 * - prefer `observationFromFlatToFhirR4` / `observationToFlatFhirR4`
 * - avoid `observationFhirR4ToFlat`
 */
export function observationFromFlatToFhirR4(claims: FlatClaims): FhirResource {
  const subject = claims[ObservationClaim.Subject] ?? claims[ObservationClaim.Patient];
  const codeToken = claims[ObservationClaim.Code]
    ?? codingToValue({
      system: claims[ObservationClaim.CodeSystem],
      code: claims[ObservationClaim.CodeValue],
    });
  const valueConceptToken = claims[ObservationClaim.ValueConcept]
    ?? codingToValue({
      system: claims[ObservationClaim.ValueConceptSystem],
      code: claims[ObservationClaim.ValueConceptValue],
    });
  const valueQuantityCoding = codingFromValue(claims[ObservationClaim.ValueQuantityUnit])?.[0];
  const codeCoding = codingFromValue(codeToken)?.map((coding) => ({
    ...coding,
    ...(claims[ObservationClaim.CodeDisplay] ? { display: claims[ObservationClaim.CodeDisplay] } : {}),
  }));
  const valueConceptCoding = codingFromValue(valueConceptToken)?.map((coding) => ({
    ...coding,
    ...(claims[ObservationClaim.ValueConceptDisplay]
      ? { display: claims[ObservationClaim.ValueConceptDisplay] }
      : {}),
  }));
  return {
    resourceType: 'Observation',
    identifier: claims[ObservationClaim.Identifier] ? [{ value: claims[ObservationClaim.Identifier] }] : undefined,
    status: claims[ObservationClaim.Status],
    category: claims[ObservationClaim.Category] ? claims[ObservationClaim.Category]!.split(',').map((value) => ({ coding: codingFromValue(value.trim()) })) : undefined,
    code: codeToken
      ? {
        coding: codeCoding,
        ...(claims[ObservationClaim.CodeText] ? { text: claims[ObservationClaim.CodeText] } : {}),
      }
      : undefined,
    subject: subject ? { reference: subject } : undefined,
    effectiveDateTime: claims[ObservationClaim.EffectiveDateTime] ?? claims[ObservationClaim.Date],
    issued: claims[ObservationClaim.EffectiveDateTime] ? undefined : claims[ObservationClaim.Date],
    performer: claims[ObservationClaim.Performer] ? claims[ObservationClaim.Performer]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    valueCodeableConcept: valueConceptToken
      ? {
        coding: valueConceptCoding,
        ...(claims[ObservationClaim.ValueConceptText]
          ? { text: claims[ObservationClaim.ValueConceptText] }
          : {}),
      }
      : undefined,
    valueDateTime: claims[ObservationClaim.ValueDate],
    valueQuantity: claims[ObservationClaim.ValueQuantityNumber]
      ? {
        value: Number(claims[ObservationClaim.ValueQuantityNumber]),
        ...(claims[ObservationClaim.ValueQuantityComparator]
          ? { comparator: claims[ObservationClaim.ValueQuantityComparator] as '<' | '<=' | '>=' | '>' }
          : {}),
        ...(claims[ObservationClaim.ValueQuantityUnit]
          ? {
            unit: claims[ObservationClaim.ValueQuantityUnit],
            ...(valueQuantityCoding?.system ? { system: valueQuantityCoding.system } : {}),
            ...(valueQuantityCoding?.code ? { code: valueQuantityCoding.code } : {}),
          }
          : {}),
      }
      : undefined,
    valueString: claims[ObservationClaim.ValueString],
    note: claims[ObservationClaim.Note] ? [{ text: claims[ObservationClaim.Note] }] : undefined,
    basedOn: claims[ObservationClaim.BasedOn] ? claims[ObservationClaim.BasedOn]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    device: claims[ObservationClaim.Device] ? { reference: claims[ObservationClaim.Device] } : undefined,
    encounter: claims[ObservationClaim.Encounter] ? { reference: claims[ObservationClaim.Encounter] } : undefined,
    focus: claims[ObservationClaim.Focus] ? claims[ObservationClaim.Focus]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    hasMember: claims[ObservationClaim.HasMember] ? claims[ObservationClaim.HasMember]!.split(',').map((reference) => ({ reference: reference.trim() })) : undefined,
    method: claims[ObservationClaim.Method] ? { coding: codingFromValue(claims[ObservationClaim.Method]) } : undefined,
    specimen: claims[ObservationClaim.Specimen] ? { reference: claims[ObservationClaim.Specimen] } : undefined,
  };
}

/**
 * Converts a FHIR R4 Observation into the flat editable claims contract.
 *
 * `Observation.category` stays in `Observation.category`.
 * Coded result values belong in `Observation.value-concept-*`.
 */
export function observationToFlatFhirR4(resource: FhirResource): FlatClaims {
  const valueCodeableConcept = resource.valueCodeableConcept as {
    coding?: Array<{ system?: string; code?: string; display?: string }>;
    text?: string;
  } | undefined;
  const codeCoding = (resource.code as { coding?: Array<{ system?: string; code?: string; display?: string }>; text?: string } | undefined)?.coding?.[0];
  const valueConceptCoding = valueCodeableConcept?.coding?.[0] as { system?: string; code?: string; display?: string } | undefined;
  const valueQuantity = resource.valueQuantity as {
    value?: number;
    unit?: string;
    system?: string;
    code?: string;
    comparator?: '<' | '<=' | '>=' | '>';
  } | undefined;
  return {
    [ObservationClaim.BasedOn]: referenceListToCsv(resource.basedOn as Array<{ reference?: string }> | undefined),
    [ObservationClaim.Category]: codingListToCsv((resource.category as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.flatMap((item) => item.coding || [])),
    [ObservationClaim.Code]: codingToValue(codeCoding),
    [ObservationClaim.CodeSystem]: codeCoding?.system,
    [ObservationClaim.CodeValue]: codeCoding?.code,
    [ObservationClaim.CodeText]: (resource.code as { text?: string } | undefined)?.text,
    [ObservationClaim.CodeDisplay]: codeCoding?.display,
    [ObservationClaim.Date]: (resource.effectiveDateTime as string | undefined) || (resource.issued as string | undefined),
    [ObservationClaim.Device]: referenceToValue(resource.device as { reference?: string } | undefined),
    [ObservationClaim.Encounter]: referenceToValue(resource.encounter as { reference?: string } | undefined),
    [ObservationClaim.Focus]: referenceListToCsv(resource.focus as Array<{ reference?: string }> | undefined),
    [ObservationClaim.HasMember]: referenceListToCsv(resource.hasMember as Array<{ reference?: string }> | undefined),
    [ObservationClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [ObservationClaim.Method]: codingToValue((resource.method as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [ObservationClaim.Patient]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [ObservationClaim.Performer]: referenceListToCsv(resource.performer as Array<{ reference?: string }> | undefined),
    [ObservationClaim.Specimen]: referenceToValue(resource.specimen as { reference?: string } | undefined),
    [ObservationClaim.Status]: resource.status as string | undefined,
    [ObservationClaim.Subject]: referenceToValue(resource.subject as { reference?: string } | undefined),
    [ObservationClaim.ValueConcept]: codingToValue(valueConceptCoding),
    [ObservationClaim.ValueConceptSystem]: valueConceptCoding?.system,
    [ObservationClaim.ValueConceptValue]: valueConceptCoding?.code,
    [ObservationClaim.ValueConceptText]: valueCodeableConcept?.text as string | undefined,
    [ObservationClaim.ValueConceptDisplay]: valueConceptCoding?.display,
    [ObservationClaim.ValueDate]: resource.valueDateTime as string | undefined,
    [ObservationClaim.ValueQuantityComparator]: valueQuantity?.comparator,
    [ObservationClaim.ValueQuantityNumber]: valueQuantity?.value !== undefined ? String(valueQuantity.value) : undefined,
    [ObservationClaim.ValueQuantityUnit]: codingToValue(valueQuantity?.system || valueQuantity?.code
      ? { system: valueQuantity?.system, code: valueQuantity?.code }
      : undefined) || valueQuantity?.unit,
    [ObservationClaim.ValueString]: resource.valueString as string | undefined,
    [ObservationClaim.Note]: (resource.note as Array<{ text?: string }> | undefined)?.[0]?.text,
    [ObservationClaim.EffectiveDateTime]: resource.effectiveDateTime as string | undefined,
  };
}

/** @deprecated Prefer `observationFromFlatToFhirR4`. */
export const observationFlatToFhirR4 = observationFromFlatToFhirR4;
/** @deprecated Prefer `observationToFlatFhirR4`. */
export const observationFhirR4ToFlat = observationToFlatFhirR4;
