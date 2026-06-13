import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { Format } from '../constants/Schemas';
import {
  IndividualClinicalSections,
  IndividualLogicalSections,
  type IndividualSectionDescriptor,
} from '../constants/individual-sections';
import { HealthcareDocumentTypes } from '../constants/healthcare';
import {
  ObservationCategoryCodes,
  VitalSignsCodes,
  VitalSignsUnits,
  type CodingDescriptor,
} from '../constants/vital-signs';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';
import { CompositionClaim } from '../models/interoperable-claims/composition-claims';
import {
  ObservationClaim,
  isDisplayableVitalSignObservationClaims,
} from '../models/interoperable-claims/observation-claims';
import { type IndexedData } from '../models/confidential-storage';
import {
  AllowedIndexableClaims,
  IndexingClaimSet,
  buildIndexParametersFromClaims,
} from '../models/indexing';
import type { BundleEntry, BundleJsonApi } from '../models/bundle';
import type { RecordBase } from '../models/resource-document';
import type { IVaultRepository } from '../storage/IVaultRepository';
import {
  type BundleDocumentClaims,
  detectClaimsResourceType,
  extractBundleDocumentClaimsList,
  resolveClaimsSectionList,
} from './bundle-document-builder';
import { CommunicationAttachedBundleSession } from './communication-attached-bundle-session';

export type IndividualSectionManifest = Readonly<{
  section: string;
  collectionName: string;
  containerIds: readonly string[];
  resourceTypes: readonly string[];
  updatedAt: string;
}>;

type SectionSelector = string | Pick<IndividualSectionDescriptor, 'attributeValue'> | { attributeValue: string };

type MutableIndividualSectionManifest = {
  section: string;
  collectionName: string;
  containerIds: string[];
  resourceTypes: string[];
  updatedAt: string;
};

type StoredSectionRecord = RecordBase & {
  claims: Record<string, unknown>;
  fullUrl?: string;
  indexed?: IndexedData;
  resourceType: string;
  section: string;
  updatedAt: string;
};

type StoredCompositionRecord = RecordBase & {
  claims: Record<string, unknown>;
  manifest: Record<string, MutableIndividualSectionManifest>;
  updatedAt: string;
};

export type BuildVitalSignObservationClaimsInput = Readonly<{
  identifier: string;
  subject: string;
  code: CodingDescriptor;
  effectiveDateTime?: string;
  issued?: string;
  status?: string;
  note?: string;
  unit?: CodingDescriptor;
  valueQuantity?: number;
  valueString?: string;
}>;

export type IndividualBundleVaultOptions = Readonly<{
  vaultRepository: IVaultRepository;
  individualId: string;
  compositionIdentifier?: string;
  compositionType?: string;
  compositionTitle?: string;
  now?: () => string;
}>;

function asTrimmedString(value: unknown): string {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function splitCsv(value: unknown): string[] {
  return asTrimmedString(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function encodeSectionKey(section: string): string {
  return encodeURIComponent(asTrimmedString(section) || 'unknown');
}

function decodeSectionKey(section: string): string {
  try {
    return decodeURIComponent(section);
  } catch {
    return section;
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function unique(values: readonly string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function buildDefaultCompositionClaims(input: {
  individualId: string;
  compositionIdentifier?: string;
  compositionType?: string;
  compositionTitle?: string;
  now: () => string;
}): Record<string, unknown> {
  return {
    '@context': Format.FHIR_API,
    [CompositionClaim.Identifier]: input.compositionIdentifier || input.individualId,
    [CompositionClaim.Subject]: input.individualId,
    [CompositionClaim.Type]: input.compositionType || HealthcareDocumentTypes.IPS.attributeValue,
    [CompositionClaim.Title]: input.compositionTitle || 'Individual section vault',
    [CompositionClaim.Date]: input.now(),
    [CompositionClaim.Section]: '',
    [CompositionClaim.Entry]: '',
    'Composition.section-manifest': JSON.stringify({}),
  };
}

export function buildVitalSignObservationClaims(
  input: BuildVitalSignObservationClaimsInput,
): Record<string, unknown> {
  const claims: Record<string, unknown> = {
    '@context': Format.FHIR_API,
    [ObservationClaim.Identifier]: input.identifier,
    [ObservationClaim.Subject]: input.subject,
    [ObservationClaim.Patient]: input.subject,
    [ObservationClaim.Status]: input.status || 'final',
    [ObservationClaim.Category]: ObservationCategoryCodes.VitalSigns.claim,
    [ObservationClaim.CodeSystem]: input.code.system,
    [ObservationClaim.CodeValue]: input.code.code,
    [ObservationClaim.CodeText]: input.code.display,
    [ObservationClaim.CodeDisplay]: input.code.display,
    [ObservationClaim.Code]: input.code.claim,
    [ObservationClaim.EffectiveDateTime]: input.effectiveDateTime,
    [ObservationClaim.Date]: input.effectiveDateTime || input.issued,
    [ObservationClaim.Note]: input.note,
  };

  if (typeof input.valueQuantity === 'number') {
    claims[ObservationClaim.ValueQuantityNumber] = input.valueQuantity;
  }
  if (input.unit?.claim) {
    claims[ObservationClaim.ValueQuantityUnit] = input.unit.claim;
  }
  if (input.valueString) {
    claims[ObservationClaim.ValueString] = input.valueString;
  }
  return Object.fromEntries(Object.entries(claims).filter(([, value]) => value !== undefined && value !== ''));
}

export class IndividualBundleVault {
  private readonly vaultRepository: IVaultRepository;
  private readonly individualId: string;
  private readonly now: () => string;
  private compositionClaims: Record<string, unknown>;
  private readonly sectionEditors = new Map<string, CommunicationAttachedBundleSession>();
  private manifest: Record<string, MutableIndividualSectionManifest> = {};

  constructor(options: IndividualBundleVaultOptions) {
    this.vaultRepository = options.vaultRepository;
    this.individualId = options.individualId;
    this.now = options.now || (() => new Date().toISOString());
    this.compositionClaims = buildDefaultCompositionClaims({
      individualId: options.individualId,
      compositionIdentifier: options.compositionIdentifier,
      compositionType: options.compositionType,
      compositionTitle: options.compositionTitle,
      now: this.now,
    });
  }

  async initialize(): Promise<this> {
    const stored = await this.vaultRepository.get<StoredCompositionRecord>(
      this.getCollectionName(IndividualLogicalSections.Composition.attributeValue),
      this.getCompositionRecordId(),
    );
    if (stored?.claims) {
      this.compositionClaims = clone(stored.claims);
      this.manifest = clone(stored.manifest || {});
    } else {
      await this.persistComposition();
    }
    return this;
  }

  getCompositionClaims(): Record<string, unknown> {
    return clone(this.compositionClaims);
  }

  async getSectionEditor(section: SectionSelector): Promise<CommunicationAttachedBundleSession> {
    const sectionValue = this.resolveSectionValue(section);
    const cached = this.sectionEditors.get(sectionValue);
    if (cached) {
      return cached;
    }

    const records = await this.vaultRepository.query<StoredSectionRecord>(this.getCollectionName(sectionValue), {});
    const initialBundle: BundleJsonApi<BundleEntry> = {
      resourceType: ResourceTypesFhirR4.Bundle,
      type: 'collection',
      data: records.map((record) => ({
        id: record.id,
        fullUrl: record.fullUrl,
        type: `${record.resourceType}-vault-entry-v1.0`,
        resource: {
          resourceType: record.resourceType,
          meta: {
            claims: clone(record.claims),
          },
        },
      })),
    };

    const editor = new CommunicationAttachedBundleSession({
      initialBundle,
      communicationClaims: {
        '@context': Format.FHIR_R4,
        [CommunicationClaim.Subject]: this.individualId,
      },
      mode: 'normalize',
    });
    this.sectionEditors.set(sectionValue, editor);
    return editor;
  }

  listSections(): IndividualSectionManifest[] {
    return Object.values(this.manifest).map((entry) => clone(entry));
  }

  getSectionContainerIds(section: SectionSelector): string[] {
    const sectionValue = this.resolveSectionValue(section);
    return [...(this.manifest[sectionValue]?.containerIds || [])];
  }

  /**
   * Returns only visible/searchable Vital Signs rows for the individual.
   *
   * Reduced indexed component rows derived from FHIR `component` are kept in
   * local storage for reconstruction/export but excluded here because they do
   * not carry `Observation.status`.
   */
  async getDisplayableVitalSignResourceIds(): Promise<string[]> {
    const editor = await this.getSectionEditor(IndividualClinicalSections.VitalSigns);
    return editor.getBundleInMemory().data
      .filter((entry) =>
        entry.resource?.resourceType === ResourceTypesFhirR4.Observation
        && isDisplayableVitalSignObservationClaims(entry.resource?.meta?.claims as Record<string, unknown> | undefined))
      .map((entry) => this.resolveEntryRecordId(entry));
  }

  async saveSection(section: SectionSelector): Promise<this> {
    const sectionValue = this.resolveSectionValue(section);
    const editor = await this.getSectionEditor(sectionValue);
    const entries = editor.getBundleInMemory().data || [];
    const collectionName = this.getCollectionName(sectionValue);
    const existing = await this.vaultRepository.query<StoredSectionRecord>(collectionName, {});
    const nextIds = new Set<string>();

    for (const entry of entries) {
      const record = this.entryToStoredSectionRecord(sectionValue, entry);
      nextIds.add(record.id);
      await this.vaultRepository.put(collectionName, record);
    }

    for (const record of existing) {
      if (!nextIds.has(record.id)) {
        await this.vaultRepository.delete(collectionName, record.id);
      }
    }

    this.manifest[sectionValue] = {
      section: sectionValue,
      collectionName,
      containerIds: entries
        .map((entry) => this.resolveEntryRecordId(entry))
        .filter(Boolean),
      resourceTypes: unique(entries.map((entry) => asTrimmedString(entry.resource?.resourceType)).filter(Boolean)),
      updatedAt: this.now(),
    };

    if (this.manifest[sectionValue].containerIds.length === 0) {
      delete this.manifest[sectionValue];
    }

    this.updateCompositionFromManifest();
    await this.persistComposition();
    return this;
  }

  async upsertSectionEntry(
    section: SectionSelector,
    input: Readonly<{
      resourceType: string;
      claims: Record<string, unknown>;
      fullUrl?: string;
      type?: string;
    }>,
  ): Promise<this> {
    const editor = await this.getSectionEditor(section);
    editor.upsertActiveEntry(input).saveAndReleaseActiveEntry();
    await this.saveSection(section);
    return this;
  }

  async upsertVitalSign(
    input: BuildVitalSignObservationClaimsInput,
  ): Promise<this> {
    const claims = buildVitalSignObservationClaims(input);
    return this.upsertSectionEntry(IndividualClinicalSections.VitalSigns, {
      resourceType: ResourceTypesFhirR4.Observation,
      claims,
      fullUrl: `urn:uuid:${input.identifier}`,
    });
  }

  async importBundleDocument(bundle: Record<string, any>): Promise<this> {
    const sectionMap = this.buildBundleDocumentSectionMap(bundle);
    const resources = (Array.isArray(bundle?.entry) ? bundle.entry : [])
      .map((entry) => entry?.resource)
      .filter((resource) =>
        resource
        && typeof resource === 'object'
        && ![ResourceTypesFhirR4.Composition, 'Patient', 'Practitioner', 'PractitionerRole'].includes(String(resource.resourceType || '')),
      );
    const claimsList = extractBundleDocumentClaimsList(bundle);
    for (let index = 0; index < claimsList.length; index += 1) {
      const claims = claimsList[index];
      const resource = resources[index];
      const resourceType = detectClaimsResourceType(claims) || asTrimmedString(resource?.resourceType);
      if (!resourceType) continue;
      const bundleSections = this.resolveBundleSectionsForResource(sectionMap, resource);
      const sections = bundleSections.length > 0
        ? bundleSections
        : this.resolveSectionsForClaims(claims, resourceType);
      for (const section of sections) {
        await this.upsertSectionEntry(section, {
          resourceType,
          claims,
          fullUrl: this.buildDefaultFullUrl(resourceType, claims),
        });
      }
    }
    return this;
  }

  private resolveSectionsForClaims(
    claims: BundleDocumentClaims,
    resourceType: string,
  ): string[] {
    if (resourceType === ResourceTypesFhirR4.Observation) {
      return splitCsv(claims[ObservationClaim.Category]).includes(ObservationCategoryCodes.VitalSigns.claim)
        ? [IndividualClinicalSections.VitalSigns.attributeValue]
        : [IndividualLogicalSections.Observations.attributeValue];
    }

    const explicit = unique(resolveClaimsSectionList(claims));
    if (explicit.length > 0) {
      return explicit;
    }

    switch (resourceType) {
      case ResourceTypesFhirR4.Consent:
        return [IndividualLogicalSections.Consents.attributeValue];
      case ResourceTypesFhirR4.Appointment:
        return [IndividualLogicalSections.Appointments.attributeValue];
      case ResourceTypesFhirR4.Encounter:
        return [IndividualLogicalSections.Encounters.attributeValue];
      case ResourceTypesFhirR4.DocumentReference:
        return [IndividualLogicalSections.Documents.attributeValue];
      case ResourceTypesFhirR4.RelatedPerson:
        return [IndividualLogicalSections.RelatedPersons.attributeValue];
      case ResourceTypesFhirR4.Coverage:
        return [IndividualLogicalSections.Coverage.attributeValue];
      case ResourceTypesFhirR4.DiagnosticReport:
        return [IndividualLogicalSections.DiagnosticReports.attributeValue];
      case ResourceTypesFhirR4.Condition:
        return [IndividualClinicalSections.Conditions.attributeValue];
      case ResourceTypesFhirR4.AllergyIntolerance:
        return [IndividualClinicalSections.AllergiesAndIntolerances.attributeValue];
      case ResourceTypesFhirR4.MedicationStatement:
        return [IndividualClinicalSections.Medications.attributeValue];
      case ResourceTypesFhirR4.Procedure:
        return [IndividualClinicalSections.Procedures.attributeValue];
      case ResourceTypesFhirR4.Immunization:
        return [IndividualClinicalSections.Immunizations.attributeValue];
      case ResourceTypesFhirR4.Communication:
        return [IndividualLogicalSections.Communications.attributeValue];
      default:
        return [IndividualLogicalSections.Documents.attributeValue];
    }
  }

  private buildDefaultFullUrl(resourceType: string, claims: Record<string, unknown>): string | undefined {
    const identifier = this.resolveClaimsIdentifier(resourceType, claims);
    return identifier ? `urn:uuid:${identifier}` : undefined;
  }

  private resolveClaimsIdentifier(resourceType: string, claims: Record<string, unknown>): string {
    const keysByType: Record<string, string[]> = {
      [ResourceTypesFhirR4.Observation]: [ObservationClaim.Identifier],
      [ResourceTypesFhirR4.Composition]: [CompositionClaim.Identifier],
      [ResourceTypesFhirR4.Communication]: [CommunicationClaim.Identifier],
      [ResourceTypesFhirR4.Consent]: ['Consent.identifier'],
      [ResourceTypesFhirR4.Appointment]: ['Appointment.identifier'],
      [ResourceTypesFhirR4.Encounter]: ['Encounter.identifier'],
      [ResourceTypesFhirR4.DocumentReference]: ['DocumentReference.identifier'],
      [ResourceTypesFhirR4.RelatedPerson]: ['RelatedPerson.identifier'],
      [ResourceTypesFhirR4.Coverage]: ['Coverage.identifier'],
      [ResourceTypesFhirR4.DiagnosticReport]: ['DiagnosticReport.identifier'],
      [ResourceTypesFhirR4.Condition]: ['Condition.identifier'],
      [ResourceTypesFhirR4.AllergyIntolerance]: ['AllergyIntolerance.identifier'],
      [ResourceTypesFhirR4.MedicationStatement]: ['MedicationStatement.identifier'],
      [ResourceTypesFhirR4.Procedure]: ['Procedure.identifier'],
      [ResourceTypesFhirR4.Immunization]: ['Immunization.identifier'],
    };
    for (const key of keysByType[resourceType] || []) {
      const value = asTrimmedString(claims[key]);
      if (value) return value;
    }
    return '';
  }

  private buildBundleDocumentSectionMap(bundle: Record<string, any>): Map<string, string[]> {
    const map = new Map<string, string[]>();
    const compositionEntry = (Array.isArray(bundle?.entry) ? bundle.entry : [])
      .find((entry) => entry?.resource?.resourceType === ResourceTypesFhirR4.Composition);
    const sections = Array.isArray(compositionEntry?.resource?.section) ? compositionEntry.resource.section : [];

    for (const section of sections) {
      const sectionCode = asTrimmedString(section?.code?.coding?.[0]?.system)
        && asTrimmedString(section?.code?.coding?.[0]?.code)
        ? `${section.code.coding[0].system}|${section.code.coding[0].code}`
        : asTrimmedString(section?.code?.coding?.[0]?.code);
      if (!sectionCode) continue;
      const refs = Array.isArray(section?.entry) ? section.entry : [];
      for (const refEntry of refs) {
        const reference = asTrimmedString(refEntry?.reference);
        if (!reference) continue;
        map.set(reference, [...(map.get(reference) || []), sectionCode]);
      }
    }

    return map;
  }

  private resolveBundleSectionsForResource(
    sectionMap: Map<string, string[]>,
    resource: Record<string, any> | undefined,
  ): string[] {
    const resourceType = asTrimmedString(resource?.resourceType);
    const resourceId = asTrimmedString(resource?.id);
    if (!resourceType || !resourceId) {
      return [];
    }
    return unique([
      ...(sectionMap.get(`${resourceType}/${resourceId}`) || []),
      ...(sectionMap.get(`urn:uuid:${resourceId}`) || []),
    ]);
  }

  private entryToStoredSectionRecord(section: string, entry: BundleEntry): StoredSectionRecord {
    const resourceType = asTrimmedString(entry.resource?.resourceType) || 'Unknown';
    const claims = clone((entry.resource?.meta?.claims || {}) as Record<string, unknown>);
    return {
      id: this.resolveEntryRecordId(entry),
      claims,
      fullUrl: asTrimmedString(entry.fullUrl) || undefined,
      indexed: this.buildIndexedData(resourceType, claims),
      resourceType,
      section,
      updatedAt: this.now(),
    };
  }

  private buildIndexedData(resourceType: string, claims: Record<string, unknown>): IndexedData | undefined {
    const allowedClaims = this.resolveAllowedIndexableClaims(resourceType, claims);
    if (allowedClaims.length === 0) {
      return undefined;
    }

    const attributes = buildIndexParametersFromClaims(claims, allowedClaims)
      .map((parameter) => ({
        name: parameter.name,
        value: String(parameter.value),
        ...(parameter.type ? { type: parameter.type } : {}),
        ...(parameter.name.endsWith('.identifier') ? { unique: true } : {}),
      }))
      .filter((attribute) => attribute.value !== '');

    return attributes.length > 0 ? { attributes } : undefined;
  }

  private resolveAllowedIndexableClaims(resourceType: string, claims: Record<string, unknown>): readonly string[] {
    switch (resourceType) {
      case ResourceTypesFhirR4.Observation:
        return splitCsv(claims[ObservationClaim.Category]).includes(ObservationCategoryCodes.VitalSigns.claim)
          ? AllowedIndexableClaims[ResourceTypesFhirR4.Observation][IndexingClaimSet.VitalSigns]
          : AllowedIndexableClaims[ResourceTypesFhirR4.Observation][IndexingClaimSet.General];
      case ResourceTypesFhirR4.Condition:
        return AllowedIndexableClaims[ResourceTypesFhirR4.Condition][IndexingClaimSet.General];
      case ResourceTypesFhirR4.MedicationStatement:
        return AllowedIndexableClaims[ResourceTypesFhirR4.MedicationStatement][IndexingClaimSet.General];
      case ResourceTypesFhirR4.DocumentReference:
        return AllowedIndexableClaims[ResourceTypesFhirR4.DocumentReference][IndexingClaimSet.General];
      default:
        return [];
    }
  }

  private resolveEntryRecordId(entry: BundleEntry): string {
    const resourceType = asTrimmedString(entry.resource?.resourceType);
    const claims = (entry.resource?.meta?.claims || {}) as Record<string, unknown>;
    return (
      asTrimmedString(entry.id)
      || this.resolveClaimsIdentifier(resourceType, claims)
      || asTrimmedString(entry.fullUrl)
      || `${resourceType || 'resource'}-${Math.random().toString(16).slice(2)}`
    );
  }

  private updateCompositionFromManifest(): void {
    const sections = Object.keys(this.manifest);
    const containerIds = unique(Object.values(this.manifest).flatMap((entry) => entry.containerIds));
    this.compositionClaims = {
      ...this.compositionClaims,
      [CompositionClaim.Subject]: this.individualId,
      [CompositionClaim.Date]: this.now(),
      [CompositionClaim.Section]: sections.join(','),
      [CompositionClaim.Entry]: containerIds.join(','),
      'Composition.section-manifest': JSON.stringify(this.manifest),
    };
  }

  private async persistComposition(): Promise<void> {
    const record: StoredCompositionRecord = {
      id: this.getCompositionRecordId(),
      claims: clone(this.compositionClaims),
      manifest: clone(this.manifest),
      updatedAt: this.now(),
    };
    await this.vaultRepository.put(
      this.getCollectionName(IndividualLogicalSections.Composition.attributeValue),
      record,
    );
  }

  private resolveSectionValue(section: SectionSelector): string {
    return typeof section === 'string' ? section : section.attributeValue;
  }

  private getCollectionName(section: string): string {
    return `${this.individualId}_${encodeSectionKey(section)}`;
  }

  private getCompositionRecordId(): string {
    return `${this.individualId}_composition`;
  }

  static decodeCollectionSectionKey(encodedSection: string): string {
    return decodeSectionKey(encodedSection);
  }

  static getDefaultVitalSignInputs() {
    return {
      heartRate: {
        code: VitalSignsCodes.HeartRate,
        unit: VitalSignsUnits.BeatsPerMinute,
        section: IndividualClinicalSections.VitalSigns.attributeValue,
      },
      bodyTemperature: {
        code: VitalSignsCodes.BodyTemperature,
        unit: VitalSignsUnits.Celsius,
        section: IndividualClinicalSections.VitalSigns.attributeValue,
      },
      systolicBloodPressure: {
        code: VitalSignsCodes.SystolicBloodPressure,
        unit: VitalSignsUnits.MillimeterOfMercury,
        section: IndividualClinicalSections.VitalSigns.attributeValue,
      },
      diastolicBloodPressure: {
        code: VitalSignsCodes.DiastolicBloodPressure,
        unit: VitalSignsUnits.MillimeterOfMercury,
        section: IndividualClinicalSections.VitalSigns.attributeValue,
      },
    };
  }
}
