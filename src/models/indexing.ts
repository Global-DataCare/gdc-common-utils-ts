// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.
// File: src/models/indexing.ts

import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { ClaimsOrganizationSchemaorg } from '../constants/schemaorg';
import { ConditionClaim } from './interoperable-claims/condition-claims';
import { DocumentReferenceClaim } from './interoperable-claims/document-reference-claims';
import { MedicationStatementClaim } from './interoperable-claims/medication-statement-claims';
import {
  ObservationClaim,
  ObservationGeneralClaimsList,
  ObservationVitalSignsClaimsList,
} from './interoperable-claims/observation-claims';
import type { ParameterData, ParameterType } from './params';

/**
 * Canonical index profile names used under each resource type.
 */
export const IndexingClaimSet = Object.freeze({
  General: 'General',
  Registry: 'Registry',
  VitalSigns: 'VitalSigns',
} as const);

export type IndexingClaimSetKey = typeof IndexingClaimSet[keyof typeof IndexingClaimSet];

/**
 * Defines which claims are allowed to be indexed for different resource types.
 *
 * Preferred shape:
 * `AllowedIndexableClaims[ResourceType][General/category/type]`
 */
export const AllowedIndexableClaims = {
  Organization: {
    /**
     * Claims that can be indexed in the central tenant registry for an Organization.
     */
    [IndexingClaimSet.Registry]: [
      ClaimsOrganizationSchemaorg.alternateName,
      ClaimsOrganizationSchemaorg.identifierValue,
      ClaimsOrganizationSchemaorg.identifierType,
      ClaimsOrganizationSchemaorg.addressCountry,
    ] as const,
  },

  [ResourceTypesFhirR4.Observation]: {
    /**
     * Searchable/indexable subset for a general Observation row.
     *
     * Keep this aligned with GW managers that build `indexed.attributes` from
     * claims-first payloads. UI-only or long free-text fields stay out.
     */
    [IndexingClaimSet.General]: [
      ObservationClaim.Identifier,
      ObservationClaim.Subject,
      ObservationClaim.Patient,
      ObservationClaim.Status,
      ObservationClaim.Category,
      ObservationClaim.CodeSystem,
      ObservationClaim.CodeValue,
      ObservationClaim.Code,
      ObservationClaim.Date,
      ObservationClaim.EffectiveDateTime,
      ObservationClaim.ValueConceptSystem,
      ObservationClaim.ValueConceptValue,
      ObservationClaim.ValueConcept,
      ObservationClaim.ValueDate,
      ObservationClaim.ValueQuantityComparator,
      ObservationClaim.ValueQuantityNumber,
      ObservationClaim.ValueQuantityUnit,
      ObservationClaim.ScoreTotalNumber,
      ObservationClaim.ComponentTags,
      ObservationClaim.ComponentCodeValues,
      ObservationClaim.ComponentNames,
      ObservationClaim.BloodPressureSystolicNumber,
      ObservationClaim.BloodPressureDiastolicNumber,
      ObservationClaim.HasMember,
      ObservationClaim.Encounter,
      ObservationClaim.Device,
      ObservationClaim.Specimen,
      ObservationClaim.Performer,
      ObservationClaim.BasedOn,
      ObservationClaim.Focus,
      ObservationClaim.Method,
      ObservationClaim.Language,
    ] as const,

    /**
     * Searchable/indexable subset for a Vital Signs Observation row.
     *
     * This is intentionally narrower than the full persisted claims list and
     * excludes local-language labels, XHTML/narrative, and note text.
     */
    [IndexingClaimSet.VitalSigns]: [
      ObservationClaim.Identifier,
      ObservationClaim.Subject,
      ObservationClaim.Patient,
      ObservationClaim.Status,
      ObservationClaim.Category,
      ObservationClaim.CodeSystem,
      ObservationClaim.CodeValue,
      ObservationClaim.Code,
      ObservationClaim.Date,
      ObservationClaim.EffectiveDateTime,
      ObservationClaim.ValueConceptSystem,
      ObservationClaim.ValueConceptValue,
      ObservationClaim.ValueConcept,
      ObservationClaim.ValueDate,
      ObservationClaim.ValueQuantityComparator,
      ObservationClaim.ValueQuantityNumber,
      ObservationClaim.ValueQuantityUnit,
      ObservationClaim.ScoreTotalNumber,
      ObservationClaim.ComponentTags,
      ObservationClaim.ComponentCodeValues,
      ObservationClaim.ComponentNames,
      ObservationClaim.BloodPressureSystolicNumber,
      ObservationClaim.BloodPressureDiastolicNumber,
      ObservationClaim.HasMember,
      ObservationClaim.Method,
      ObservationClaim.Language,
    ] as const,
  },

  [ResourceTypesFhirR4.Condition]: {
    [IndexingClaimSet.General]: [
      ConditionClaim.Identifier,
      ConditionClaim.Subject,
      ConditionClaim.ClinicalStatus,
      ConditionClaim.VerificationStatus,
      ConditionClaim.Category,
      ConditionClaim.Code,
      ConditionClaim.Severity,
      ConditionClaim.OnsetDateTime,
      ConditionClaim.Recorder,
    ] as const,
  },

  [ResourceTypesFhirR4.MedicationStatement]: {
    [IndexingClaimSet.General]: [
      MedicationStatementClaim.Identifier,
      MedicationStatementClaim.Subject,
      MedicationStatementClaim.Patient,
      MedicationStatementClaim.Status,
      MedicationStatementClaim.Category,
      MedicationStatementClaim.Effective,
      MedicationStatementClaim.Code,
      MedicationStatementClaim.Medication,
      MedicationStatementClaim.PartOf,
      MedicationStatementClaim.Source,
      MedicationStatementClaim.MedicationIdentifier,
      MedicationStatementClaim.MedicationSerialNumber,
      MedicationStatementClaim.MedicationExpirationDate,
    ] as const,
  },

  [ResourceTypesFhirR4.DocumentReference]: {
    [IndexingClaimSet.General]: [
      DocumentReferenceClaim.Identifier,
      DocumentReferenceClaim.Subject,
      DocumentReferenceClaim.Author,
      DocumentReferenceClaim.Attester,
      DocumentReferenceClaim.BasedOn,
      DocumentReferenceClaim.Category,
      DocumentReferenceClaim.ContentHash,
      DocumentReferenceClaim.ContentType,
      DocumentReferenceClaim.Context,
      DocumentReferenceClaim.Creation,
      DocumentReferenceClaim.Date,
      DocumentReferenceClaim.EventCode,
      DocumentReferenceClaim.EventReference,
      DocumentReferenceClaim.FormatUri,
      DocumentReferenceClaim.Language,
      DocumentReferenceClaim.Location,
      DocumentReferenceClaim.Modality,
      DocumentReferenceClaim.RelatesTo,
      DocumentReferenceClaim.Relation,
      DocumentReferenceClaim.Type,
    ] as const,
  },
} as const;

export type AllowedIndexableClaimsKey = keyof typeof AllowedIndexableClaims;

/**
 * Deprecated compatibility aliases.
 *
 * Prefer `AllowedIndexableClaims[ResourceTypesFhirR4.Observation].General`,
 * `AllowedIndexableClaims[ResourceTypesFhirR4.Observation].VitalSigns`, and
 * `AllowedIndexableClaims.Organization.Registry` in new code.
 */
export const AllowedIndexableClaimAliases = Object.freeze({
  organizationRegistry: AllowedIndexableClaims.Organization.Registry,
  observationGeneral: AllowedIndexableClaims[ResourceTypesFhirR4.Observation][IndexingClaimSet.General],
  observationVitalSigns: AllowedIndexableClaims[ResourceTypesFhirR4.Observation][IndexingClaimSet.VitalSigns],
} as const);

/**
 * Projects a claims-first record to the `ParameterData[]` shape used by GW/KMS
 * before optional HMAC protection.
 */
export function buildIndexParametersFromClaims(
  claims: Record<string, unknown>,
  allowedClaims: readonly string[],
): ParameterData[] {
  const parameters: ParameterData[] = [];

  for (const claimKey of allowedClaims) {
    const rawValue = claims[claimKey];
    if (rawValue === undefined || rawValue === null || rawValue === '') {
      continue;
    }

    const value = typeof rawValue === 'number' ? rawValue : String(rawValue).trim();
    if (value === '') {
      continue;
    }

    const parameter: ParameterData = {
      name: claimKey,
      value: value as string | number,
      type: inferParameterTypeFromClaimKey(claimKey, rawValue),
      ...(claimKey === ObservationClaim.ValueQuantityUnit && typeof rawValue === 'string'
        ? { unit: rawValue }
        : {}),
    };
    parameters.push(parameter);
  }

  return parameters;
}

function inferParameterTypeFromClaimKey(claimKey: string, rawValue: unknown): ParameterType {
  if (
    claimKey === ObservationClaim.ValueQuantityNumber
    || claimKey === ObservationClaim.ScoreTotalNumber
    || claimKey === ObservationClaim.BloodPressureSystolicNumber
    || claimKey === ObservationClaim.BloodPressureDiastolicNumber
  ) {
    return 'number';
  }
  if (
    claimKey === ObservationClaim.Date
    || claimKey === ObservationClaim.EffectiveDateTime
    || claimKey === ObservationClaim.ValueDate
    || claimKey === ConditionClaim.OnsetDateTime
    || claimKey === MedicationStatementClaim.Effective
    || claimKey === MedicationStatementClaim.MedicationExpirationDate
    || claimKey === DocumentReferenceClaim.Creation
    || claimKey === DocumentReferenceClaim.Date
  ) {
    return 'date';
  }
  if (
    claimKey === ObservationClaim.Subject
    || claimKey === ObservationClaim.Patient
    || claimKey === ObservationClaim.Encounter
    || claimKey === ObservationClaim.Device
    || claimKey === ObservationClaim.Specimen
    || claimKey === ObservationClaim.Performer
    || claimKey === ObservationClaim.BasedOn
    || claimKey === ObservationClaim.Focus
    || claimKey === ObservationClaim.HasMember
    || claimKey === ConditionClaim.Subject
    || claimKey === ConditionClaim.Recorder
    || claimKey === MedicationStatementClaim.Subject
    || claimKey === MedicationStatementClaim.Patient
    || claimKey === MedicationStatementClaim.PartOf
    || claimKey === MedicationStatementClaim.Source
    || claimKey === DocumentReferenceClaim.Subject
    || claimKey === DocumentReferenceClaim.Author
    || claimKey === DocumentReferenceClaim.Attester
    || claimKey === DocumentReferenceClaim.BasedOn
    || claimKey === DocumentReferenceClaim.Context
    || claimKey === DocumentReferenceClaim.EventReference
    || claimKey === DocumentReferenceClaim.RelatesTo
  ) {
    return 'reference';
  }
  if (
    claimKey === ObservationClaim.Category
    || claimKey === ObservationClaim.ComponentTags
    || claimKey === ObservationClaim.ComponentCodeValues
    || claimKey === ObservationClaim.CodeSystem
    || claimKey === ObservationClaim.CodeValue
    || claimKey === ObservationClaim.Code
    || claimKey === ObservationClaim.ValueConceptSystem
    || claimKey === ObservationClaim.ValueConceptValue
    || claimKey === ObservationClaim.ValueConcept
    || claimKey === ObservationClaim.Method
    || claimKey === ObservationClaim.Language
    || claimKey === ObservationClaim.ValueQuantityComparator
    || claimKey === ObservationClaim.ValueQuantityUnit
    || claimKey === ConditionClaim.ClinicalStatus
    || claimKey === ConditionClaim.VerificationStatus
    || claimKey === ConditionClaim.Category
    || claimKey === ConditionClaim.Code
    || claimKey === ConditionClaim.Severity
    || claimKey === MedicationStatementClaim.Status
    || claimKey === MedicationStatementClaim.Category
    || claimKey === MedicationStatementClaim.Code
    || claimKey === MedicationStatementClaim.Medication
    || claimKey === DocumentReferenceClaim.Category
    || claimKey === DocumentReferenceClaim.ContentType
    || claimKey === DocumentReferenceClaim.EventCode
    || claimKey === DocumentReferenceClaim.FormatUri
    || claimKey === DocumentReferenceClaim.Language
    || claimKey === DocumentReferenceClaim.Modality
    || claimKey === DocumentReferenceClaim.Relation
    || claimKey === DocumentReferenceClaim.Type
  ) {
    return 'token';
  }
  if (claimKey === ObservationClaim.ComponentNames) {
    return 'string';
  }
  if (
    (
      claimKey === ObservationClaim.Identifier
      || claimKey === ConditionClaim.Identifier
      || claimKey === MedicationStatementClaim.Identifier
      || claimKey === DocumentReferenceClaim.Identifier
    )
    && typeof rawValue === 'string'
    && /^urn:|^did:|^https?:/i.test(rawValue)
  ) {
    return 'uri';
  }
  return 'string';
}

/**
 * Sanity guard to keep the indexable subset anchored to the broader claims
 * lists declared by the interoperable-claims contract.
 */
export function isAllowedObservationIndexableClaim(claimKey: string, variant: 'general' | 'vital-signs'): boolean {
  const fullList = variant === 'general' ? ObservationGeneralClaimsList : ObservationVitalSignsClaimsList;
  const allowed = variant === 'general'
    ? AllowedIndexableClaims[ResourceTypesFhirR4.Observation][IndexingClaimSet.General]
    : AllowedIndexableClaims[ResourceTypesFhirR4.Observation][IndexingClaimSet.VitalSigns];
  return fullList.some((item) => item === claimKey) && allowed.some((item) => item === claimKey);
}
