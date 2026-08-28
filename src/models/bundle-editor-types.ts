/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - This file owns only exported bundle-editor types and constants.
 * - Do not move helper implementations or class logic here.
 */
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { type BundleEntry, type BundleJsonApi, type BundleRequest } from './bundle';
import {
  EmployeeBundleOperations,
  EmployeeResourceTypes,
  type EmployeeClaims,
} from '../utils/employee';
import type { BundleEntryEditor } from '../utils/bundle-entry-editor';
import type { EmployeeEntryEditor } from '../utils/employee-entry-editor';
import type { VitalSignEntryEditor } from '../utils/vital-sign-entry-editor';
import type { ObservationEntryEditor } from '../utils/observation-entry-editor';
import type { AllergyIntoleranceEntryEditor } from '../utils/allergy-intolerance-entry-editor';
import type { ConditionEntryEditor } from '../utils/condition-entry-editor';
import type { MedicationStatementEntryEditor } from '../utils/medication-statement-entry-editor';
import type { DocumentReferenceEntryEditor } from '../utils/document-reference-entry-editor';
import type { CarePlanEntryEditor } from '../utils/care-plan-entry-editor';
import type { FlagEntryEditor } from '../utils/flag-entry-editor';
import type { ClinicalImpressionEntryEditor } from '../utils/clinical-impression-entry-editor';
import type { DeviceEntryEditor } from '../utils/device-entry-editor';
import type { DeviceUseStatementEntryEditor } from '../utils/device-use-statement-entry-editor';
import type { EncounterEntryEditor } from '../utils/encounter-entry-editor';
import type { CoverageEntryEditor } from '../utils/coverage-entry-editor';
import type { ImmunizationEntryEditor } from '../utils/immunization-entry-editor';
import type { ProcedureEntryEditor } from '../utils/procedure-entry-editor';
import type { DiagnosticReportEntryEditor } from '../utils/diagnostic-report-entry-editor';
import type { ConsentEntryEditor } from '../utils/consent-entry-editor';
import type { RelatedPersonEntryEditor } from '../utils/related-person-entry-editor';

/** Runtime-neutral business operations staged by `BundleEditor`. */
export const BundleOperations = Object.freeze({
  create: EmployeeBundleOperations.create,
  search: EmployeeBundleOperations.search,
  disable: EmployeeBundleOperations.disable,
  purge: EmployeeBundleOperations.purge,
} as const);

export type BundleOperation =
  (typeof BundleOperations)[keyof typeof BundleOperations];

/** Resource types that the shared bundle editors currently know how to open as typed entry editors. */
export const BundleEditableResourceTypes = Object.freeze({
  employee: EmployeeResourceTypes.employee,
  consent: ResourceTypesFhirR4.Consent,
  relatedPerson: ResourceTypesFhirR4.RelatedPerson,
  observation: ResourceTypesFhirR4.Observation,
  vitalSign: ResourceTypesFhirR4.Observation,
  allergyIntolerance: ResourceTypesFhirR4.AllergyIntolerance,
  condition: ResourceTypesFhirR4.Condition,
  medicationStatement: ResourceTypesFhirR4.MedicationStatement,
  documentReference: ResourceTypesFhirR4.DocumentReference,
  carePlan: ResourceTypesFhirR4.CarePlan,
  flag: ResourceTypesFhirR4.Flag,
  clinicalImpression: ResourceTypesFhirR4.ClinicalImpression,
  device: ResourceTypesFhirR4.Device,
  deviceUseStatement: ResourceTypesFhirR4.DeviceUseStatement,
  encounter: ResourceTypesFhirR4.Encounter,
  coverage: ResourceTypesFhirR4.Coverage,
  immunization: ResourceTypesFhirR4.Immunization,
  procedure: ResourceTypesFhirR4.Procedure,
  diagnosticReport: ResourceTypesFhirR4.DiagnosticReport,
} as const);

export type AllowedResourceType = string;

/** Mutable staged entry shape kept inside `BundleEditor` before final materialization. */
export type BuiltBundleEntry = {
  type: string;
  request: { method: BundleRequest['method']; url?: string; ifMatch?: string };
  resource: {
    resourceType: string;
    id?: string;
    meta: { claims: EmployeeClaims };
    [key: string]: unknown;
  };
  fullUrl?: string;
  /** @internal Materialization hint for request-only FHIR operations. */
  omitResource?: boolean;
};

export const BundleTypes = Object.freeze({
  batch: 'batch',
  document: 'document',
  collection: 'collection',
  transaction: 'transaction',
} as const);

export type BundleType = (typeof BundleTypes)[keyof typeof BundleTypes];

/** Canonical validation issues returned by `BundleEditor.validateDocumentAuthoring()`. */
export const BundleEditorValidationIssues = Object.freeze({
  DocumentModeRequired: 'BundleEditor must be in document mode before document validation.',
  CompositionSubjectRequired: 'Composition.subject is required before document transport.',
  CompositionTypeRequired: 'Composition.type is required before document transport.',
  CompositionTitleRequired: 'Composition.title is required before document transport.',
  CompositionDateRequired: 'Composition.date is required before document transport.',
  CompositionAuthorRequired: 'Composition.author is required before document transport.',
  DocumentEntryRequired: 'Bundle.document requires at least one staged resource entry.',
} as const);

export type BundleEditorValidationIssue =
  typeof BundleEditorValidationIssues[keyof typeof BundleEditorValidationIssues];

/** Convenience alias for the in-memory JSON-API-like bundle shape returned by `buildJsonApi()`. */
export type BundleJsonApiShape = BundleJsonApi<BundleEntry>;

/**
 * Type-level mapping from `BundleEditableResourceTypes.*` to the concrete
 * editor class returned by `newEntryAs(...)` / `newContainedResourceAs(...)`.
 *
 * This exists so callers get the correct chainable editor surface from the
 * resource type they requested, instead of falling back to the generic
 * `BundleEntryEditor` API.
 */
export type ResourceTypeEntryEditor<T extends AllowedResourceType> =
  T extends typeof BundleEditableResourceTypes.employee ? EmployeeEntryEditor
    : T extends typeof BundleEditableResourceTypes.consent ? ConsentEntryEditor
      : T extends typeof BundleEditableResourceTypes.relatedPerson ? RelatedPersonEntryEditor
        : T extends typeof BundleEditableResourceTypes.vitalSign ? VitalSignEntryEditor
      : T extends typeof BundleEditableResourceTypes.observation ? ObservationEntryEditor
        : T extends typeof BundleEditableResourceTypes.allergyIntolerance ? AllergyIntoleranceEntryEditor
          : T extends typeof BundleEditableResourceTypes.condition ? ConditionEntryEditor
            : T extends typeof BundleEditableResourceTypes.medicationStatement ? MedicationStatementEntryEditor
              : T extends typeof BundleEditableResourceTypes.documentReference ? DocumentReferenceEntryEditor
                : T extends typeof BundleEditableResourceTypes.carePlan ? CarePlanEntryEditor
                  : T extends typeof BundleEditableResourceTypes.flag ? FlagEntryEditor
                    : T extends typeof BundleEditableResourceTypes.clinicalImpression ? ClinicalImpressionEntryEditor
                      : T extends typeof BundleEditableResourceTypes.device ? DeviceEntryEditor
                        : T extends typeof BundleEditableResourceTypes.deviceUseStatement ? DeviceUseStatementEntryEditor
                          : T extends typeof BundleEditableResourceTypes.encounter ? EncounterEntryEditor
                            : T extends typeof BundleEditableResourceTypes.coverage ? CoverageEntryEditor
                              : T extends typeof BundleEditableResourceTypes.immunization ? ImmunizationEntryEditor
                                : T extends typeof BundleEditableResourceTypes.procedure ? ProcedureEntryEditor
                                  : T extends typeof BundleEditableResourceTypes.diagnosticReport ? DiagnosticReportEntryEditor
                                      : BundleEntryEditor;
