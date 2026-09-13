/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - Keep exactly one exported class per file.
 * - Keep this file focused on one typed editor surface.
 * - Move shared helpers to reusable helper/base modules instead of duplicating logic here.
 */
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import type { BundleEditor } from './bundle-editor-core';
import {
  AllowedResourceType,
  type ResourceTypeEntryEditor,
} from '../models/bundle-editor-types';
import {
  cloneClaimValue,
  createCanonicalIdentifierUrn,
  normalizeContainedReference,
  normalizeOptionalIdentifier,
  resolveContainedFlagClaimKey,
  resolveContainedParentReferenceClaimKey,
  resolveContainedReferenceListClaimKey,
} from './bundle-editor-helpers';
import { BundleEntryEditor } from './bundle-entry-editor';
import { ClinicalResourceEntryEditor } from './clinical-resource-entry-editor';
import { EncounterClaim } from '../models/interoperable-claims/encounter-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged Encounter resource entry.
 *
 * Use this when a caller needs to stage one encounter row with claims-first
 * accessors in a bundle authoring flow.
 */
export class EncounterEntryEditor extends ClinicalResourceEntryEditor {
  /** Writes the canonical encounter identifier. */
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(EncounterClaim.Identifier, identifier); }
  /** Reads the canonical encounter identifier. */
  public getIdentifier(): string | undefined { return this.getIdentifierValue(EncounterClaim.Identifier); }
  /** Ensures the encounter entry has one canonical `urn:uuid:*` identifier. */
  public ensureIdentifier(): string { return this.ensureIdentifierValue(EncounterClaim.Identifier); }
  /** Writes the subject/patient reference. */
  public setSubject(subject?: string | null): this { return this.setSubjectClaims(EncounterClaim.Subject, EncounterClaim.Patient, subject); }
  /** Reads the subject/patient reference. */
  public getSubject(): string | undefined { return this.getSubjectClaims(EncounterClaim.Subject, EncounterClaim.Patient); }
  /** Writes the encounter status. */
  public setStatus(value?: string | null): this { return this.setScalarClaim(EncounterClaim.Status, value); }
  /** Reads the encounter status. */
  public getStatus(): string | undefined { return this.getScalarClaim(EncounterClaim.Status); }
  /** Writes the encounter class. */
  public setClass(value?: string | null): this;
  public setClass(codeSystem: string, codeValue: string): this;
  public setClass(valueOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(EncounterClaim.Class, valueOrSystem, codeValue); }
  /** Reads the encounter class. */
  public getClass(): string | undefined { return this.getCodingTokenSystemAndCode(EncounterClaim.Class); }
  public getClassCode(): string | undefined { return this.getCodingTokenCode(EncounterClaim.Class); }
  public setClassCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(EncounterClaim.Class, system); }
  public getClassCodeSystem(): string | undefined { return this.getCodingTokenSystem(EncounterClaim.Class); }
  public setClassSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(EncounterClaim.Class, system, code); }
  public getClassSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(EncounterClaim.Class); }
  /** Writes the encounter type. */
  public setType(value?: string | null): this;
  public setType(codeSystem: string, codeValue: string): this;
  public setType(valueOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(EncounterClaim.Type, valueOrSystem, codeValue); }
  /** Reads the encounter type. */
  public getType(): string | undefined { return this.getCodingTokenSystemAndCode(EncounterClaim.Type); }
  public getTypeCode(): string | undefined { return this.getCodingTokenCode(EncounterClaim.Type); }
  public setTypeCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(EncounterClaim.Type, system); }
  public getTypeCodeSystem(): string | undefined { return this.getCodingTokenSystem(EncounterClaim.Type); }
  public setTypeSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(EncounterClaim.Type, system, code); }
  public getTypeSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(EncounterClaim.Type); }
  /** Writes the participant list. */
  public setParticipantList(values: readonly string[]): this { return this.setCsvClaimList(EncounterClaim.Participant, values); }
  /** Reads the participant list. */
  public getParticipantList(): string[] { return this.getCsvClaimList(EncounterClaim.Participant); }
  /** Writes the service-provider reference. */
  public setServiceProvider(value?: string | null): this { return this.setScalarClaim(EncounterClaim.ServiceProvider, value); }
  /** Reads the service-provider reference. */
  public getServiceProvider(): string | undefined { return this.getScalarClaim(EncounterClaim.ServiceProvider); }
  /** Writes the encounter start date/time. */
  public setPeriodStart(value?: string | null): this { return this.setScalarClaim(EncounterClaim.PeriodStart, value); }
  /** Reads the encounter start date/time. */
  public getPeriodStart(): string | undefined { return this.getScalarClaim(EncounterClaim.PeriodStart); }
  /** Writes the encounter end date/time. */
  public setPeriodEnd(value?: string | null): this { return this.setScalarClaim(EncounterClaim.PeriodEnd, value); }
  /** Reads the encounter end date/time. */
  public getPeriodEnd(): string | undefined { return this.getScalarClaim(EncounterClaim.PeriodEnd); }
  /** Writes the reason code. */
  public setReasonCode(value?: string | null): this;
  public setReasonCode(codeSystem: string, codeValue: string): this;
  public setReasonCode(valueOrSystem?: string | null, codeValue?: string): this { return this.setCodingTokenCode(EncounterClaim.ReasonCode, valueOrSystem, codeValue); }
  /** Reads the reason code. */
  public getReasonCode(): string | undefined { return this.getCodingTokenCode(EncounterClaim.ReasonCode); }
  public setReasonCodeSystem(system?: string | null): this { return this.setCodingTokenSystem(EncounterClaim.ReasonCode, system); }
  public getReasonCodeSystem(): string | undefined { return this.getCodingTokenSystem(EncounterClaim.ReasonCode); }
  public setReasonSystemAndCode(system?: string | null, code?: string | null): this { return this.setCodingTokenSystemAndCode(EncounterClaim.ReasonCode, system, code); }
  public getReasonSystemAndCode(): string | undefined { return this.getCodingTokenSystemAndCode(EncounterClaim.ReasonCode); }
}


registerBundleEntryEditor(BundleEditableResourceTypes.encounter, EncounterEntryEditor);
