import {
  getHealthcareProfessionalRolesBySector,
  getHealthcareRoleByClaim,
  getHealthcareRolesByFamily,
  getHealthcareSectionFamilyByCode,
  HealthcareActorRoles,
  HealthcareBasicSections,
  HealthcareConsentPurposes,
  HealthcareDocumentTypes,
  HealthcareRoleFamilies,
  type HealthcareActorRoleDescriptor,
  type HealthcareCanonicalSectionFamily,
} from '../constants/healthcare.js';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types.js';
import {
  HL7_CODING_SYSTEM_PERSONAL_RELATIONSHIP,
} from '../constants/hl7-roles.js';
import { DataspaceSectors, type DataspaceSector } from '../constants/sectors.js';
import { BundleEntry } from '../models/bundle.js';
import { ClaimConsent, ConsentDecisions, type ConsentDecision } from '../models/consent-rule.js';

export const PermissionTemplateActorTypes = Object.freeze({
  Professional: 'professional',
  RelatedPerson: 'related-person',
} as const);

export type PermissionTemplateActorType =
  typeof PermissionTemplateActorTypes[keyof typeof PermissionTemplateActorTypes];

export const PermissionTemplateTargetKinds = Object.freeze({
  Section: 'section',
  ResourceType: 'resource-type',
} as const);

export type PermissionTemplateTargetKind =
  typeof PermissionTemplateTargetKinds[keyof typeof PermissionTemplateTargetKinds];

export const PermissionTemplateOperationCodes = Object.freeze({
  Search: 's',
  Read: 'r',
  Create: 'c',
  Update: 'u',
  Delete: 'd',
} as const);

export type PermissionTemplateOperationCode =
  typeof PermissionTemplateOperationCodes[keyof typeof PermissionTemplateOperationCodes];

export type PermissionTemplateTarget = Readonly<{
  kind: PermissionTemplateTargetKind;
  code: string;
  sectionFamily?: HealthcareCanonicalSectionFamily;
  scopes: readonly PermissionTemplateOperationCode[];
}>;

export type PermissionTemplateRoleRef = Readonly<{
  family: string;
  codingSystem: string;
  code: string;
  claim: string;
  display?: string;
}>;

export type RolePermissionTemplate = Readonly<{
  id: string;
  actorType: PermissionTemplateActorType;
  sector: DataspaceSector;
  role: PermissionTemplateRoleRef;
  decision: ConsentDecision;
  purposes: readonly string[];
  targets: readonly PermissionTemplateTarget[];
  metadataOnly?: boolean;
  smartScopes?: readonly string[];
}>;

export type PermissionGrantRequestDraft = Readonly<{
  actorIdentifiers: readonly string[];
  purposes: readonly string[];
  roles: readonly string[];
  targets: readonly PermissionTemplateTarget[];
  metadataOnly?: boolean;
  smartScopes?: readonly string[];
}>;

export type PermissionGrantDecision = PermissionGrantRequestDraft & Readonly<{
  decision: ConsentDecision;
}>;

export type ResolvedPermissionProfile = Readonly<{
  template: RolePermissionTemplate;
  decision: PermissionGrantDecision;
}>;

export type ResolvePermissionTemplateInput = Readonly<{
  sector: DataspaceSector;
  roleClaim?: string;
  role?: Readonly<{
    codingSystem: string;
    code: string;
  }>;
}>;

export type ImportPermissionTemplateOverrides = Readonly<{
  actorIdentifiers?: readonly string[];
  decision?: ConsentDecision;
  purposes?: readonly string[];
  roles?: readonly string[];
  targets?: readonly PermissionTemplateTarget[];
  metadataOnly?: boolean;
  smartScopes?: readonly string[];
}>;

export type ExportConsentClaimsOptions = Readonly<{
  identifier?: string;
  subject?: string;
}>;

export type ExportConsentEntryOptions = ExportConsentClaimsOptions & Readonly<{
  fullUrl?: string;
  type?: string;
}>;

const DEFAULT_CONSENT_ENTRY_TYPE = 'Consent' as const;

function buildRoleRef(descriptor: HealthcareActorRoleDescriptor): PermissionTemplateRoleRef {
  return Object.freeze({
    family: descriptor.family,
    codingSystem: descriptor.codingSystem,
    code: descriptor.code,
    claim: descriptor.claim,
    display: descriptor.titleEn,
  });
}

function buildTemplateKey(sector: DataspaceSector, role: PermissionTemplateRoleRef): string {
  return `${sector}_${getCodingSystemKey(role)}_${role.code}`;
}

function getCodingSystemKey(role: Readonly<{ family: string; codingSystem: string }>): string {
  if (role.family === HealthcareRoleFamilies.ProfessionalOccupationIsco08) {
    return 'isco-08';
  }
  if (role.codingSystem === HL7_CODING_SYSTEM_PERSONAL_RELATIONSHIP) {
    return 'v3-PersonalRelationshipRoleType';
  }
  return 'v3-RoleCode';
}

function createSectionTarget(
  code: string,
  scopes: readonly PermissionTemplateOperationCode[],
): PermissionTemplateTarget {
  return Object.freeze({
    kind: PermissionTemplateTargetKinds.Section,
    code,
    sectionFamily: getHealthcareSectionFamilyByCode(code),
    scopes,
  });
}

function createResourceTypeTarget(
  code: string,
  scopes: readonly PermissionTemplateOperationCode[],
): PermissionTemplateTarget {
  return Object.freeze({
    kind: PermissionTemplateTargetKinds.ResourceType,
    code,
    scopes,
  });
}

const professionalRoles = {
  controller: buildRoleRef(getHealthcareRoleByClaim(HealthcareActorRoles.Controller) as HealthcareActorRoleDescriptor),
  physician: buildRoleRef(getHealthcareRoleByClaim(HealthcareActorRoles.GeneralistMedicalPractitioner) as HealthcareActorRoleDescriptor),
  nurse: buildRoleRef(getHealthcareRoleByClaim(HealthcareActorRoles.NursingProfessional) as HealthcareActorRoleDescriptor),
  veterinarian: buildRoleRef(getHealthcareRoleByClaim(HealthcareActorRoles.Veterinarian) as HealthcareActorRoleDescriptor),
};

const relationshipMother = buildRoleRef(
  getHealthcareRolesByFamily(HealthcareRoleFamilies.PersonalRelationshipHl7).MTH as HealthcareActorRoleDescriptor,
);

export const ConsentPermissionTemplates = Object.freeze(
  Object.fromEntries([
    Object.freeze({
      id: buildTemplateKey(DataspaceSectors.HealthCare, professionalRoles.controller),
      actorType: PermissionTemplateActorTypes.Professional,
      sector: DataspaceSectors.HealthCare,
      role: professionalRoles.controller,
      decision: ConsentDecisions.Permit,
      purposes: [HealthcareConsentPurposes.PatientAdministration],
      targets: [
        createSectionTarget(HealthcareDocumentTypes.IPS.attributeValue, [PermissionTemplateOperationCodes.Search]),
        createResourceTypeTarget(ResourceTypesFhirR4.DocumentReference, [PermissionTemplateOperationCodes.Search]),
      ],
      metadataOnly: true,
    }),
    Object.freeze({
      id: buildTemplateKey(DataspaceSectors.HealthCare, professionalRoles.physician),
      actorType: PermissionTemplateActorTypes.Professional,
      sector: DataspaceSectors.HealthCare,
      role: professionalRoles.physician,
      decision: ConsentDecisions.Permit,
      purposes: [
        HealthcareConsentPurposes.Treatment,
        HealthcareConsentPurposes.EmergencyTreatment,
      ],
      targets: [
        createSectionTarget(HealthcareBasicSections.Results.attributeValue, [PermissionTemplateOperationCodes.Read]),
        createSectionTarget(HealthcareBasicSections.HistoryOfMedicationUse.attributeValue, [PermissionTemplateOperationCodes.Read]),
        createSectionTarget(HealthcareDocumentTypes.IPS.attributeValue, [PermissionTemplateOperationCodes.Read]),
        createResourceTypeTarget(ResourceTypesFhirR4.DocumentReference, [PermissionTemplateOperationCodes.Read]),
        createResourceTypeTarget(ResourceTypesFhirR4.MedicationStatement, [PermissionTemplateOperationCodes.Read]),
        createResourceTypeTarget(ResourceTypesFhirR4.Observation, [PermissionTemplateOperationCodes.Read]),
      ],
    }),
    Object.freeze({
      id: buildTemplateKey(DataspaceSectors.HealthCare, professionalRoles.nurse),
      actorType: PermissionTemplateActorTypes.Professional,
      sector: DataspaceSectors.HealthCare,
      role: professionalRoles.nurse,
      decision: ConsentDecisions.Permit,
      purposes: [HealthcareConsentPurposes.Treatment],
      targets: [
        createSectionTarget(HealthcareBasicSections.HistoryOfMedicationUse.attributeValue, [PermissionTemplateOperationCodes.Read]),
        createResourceTypeTarget(ResourceTypesFhirR4.DocumentReference, [PermissionTemplateOperationCodes.Read]),
        createResourceTypeTarget(ResourceTypesFhirR4.MedicationStatement, [PermissionTemplateOperationCodes.Read]),
      ],
    }),
    Object.freeze({
      id: buildTemplateKey(DataspaceSectors.AnimalCare, professionalRoles.veterinarian),
      actorType: PermissionTemplateActorTypes.Professional,
      sector: DataspaceSectors.AnimalCare,
      role: professionalRoles.veterinarian,
      decision: ConsentDecisions.Permit,
      purposes: [HealthcareConsentPurposes.Treatment],
      targets: [
        createSectionTarget(HealthcareBasicSections.PatientSummaryDocument.attributeValue, [PermissionTemplateOperationCodes.Read]),
        createResourceTypeTarget(ResourceTypesFhirR4.DocumentReference, [PermissionTemplateOperationCodes.Read]),
        createResourceTypeTarget(ResourceTypesFhirR4.Observation, [PermissionTemplateOperationCodes.Read]),
      ],
    }),
    Object.freeze({
      id: buildTemplateKey(DataspaceSectors.HealthCare, relationshipMother),
      actorType: PermissionTemplateActorTypes.RelatedPerson,
      sector: DataspaceSectors.HealthCare,
      role: relationshipMother,
      decision: ConsentDecisions.Permit,
      purposes: [HealthcareConsentPurposes.Treatment],
      targets: [
        createSectionTarget(HealthcareBasicSections.PatientSummaryDocument.attributeValue, [PermissionTemplateOperationCodes.Read]),
        createResourceTypeTarget(ResourceTypesFhirR4.DocumentReference, [PermissionTemplateOperationCodes.Read]),
      ],
    }),
  ].map((template) => [template.id, template] as const)),
) as Readonly<Record<string, RolePermissionTemplate>>;

/**
 * Returns the canonical permission-template catalog keyed by
 * `<sector>_<codingSystem>_<code>`.
 */
export function getConsentPermissionTemplates(): Readonly<Record<string, RolePermissionTemplate>> {
  return ConsentPermissionTemplates;
}

/** Returns the available professional role catalog for one sector. */
export function getAvailableProfessionalRolesBySector(
  sector: DataspaceSector,
): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
  return getHealthcareProfessionalRolesBySector(sector);
}

/** Returns the available relationship-role catalog. */
export function getAvailableRelationshipRoles(): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
  return getHealthcareRolesByFamily(HealthcareRoleFamilies.PersonalRelationshipHl7);
}

/** Resolves one catalog template by sector plus role claim or coding tuple. */
export function resolvePermissionTemplate(
  input: ResolvePermissionTemplateInput,
): RolePermissionTemplate | undefined {
  if (input.roleClaim) {
    const descriptor = getHealthcareRoleByClaim(input.roleClaim);
    if (!descriptor) {
      return undefined;
    }
    return ConsentPermissionTemplates[buildTemplateKey(input.sector, buildRoleRef(descriptor))];
  }

  if (!input.role) {
    return undefined;
  }

  return Object.values(ConsentPermissionTemplates)
    .find((template) =>
      template.sector === input.sector
      && template.role.codingSystem === input.role?.codingSystem
      && template.role.code === input.role?.code,
    );
}

/** Builds an editable permission decision from one base template plus overrides. */
export function importPermissionTemplate(
  template: RolePermissionTemplate,
  overrides: ImportPermissionTemplateOverrides = {},
): PermissionGrantDecision {
  return Object.freeze({
    actorIdentifiers: overrides.actorIdentifiers || [],
    decision: overrides.decision || template.decision,
    purposes: overrides.purposes || template.purposes,
    roles: overrides.roles || [template.role.claim],
    targets: overrides.targets || template.targets,
    metadataOnly: overrides.metadataOnly ?? template.metadataOnly,
    smartScopes: overrides.smartScopes || template.smartScopes || [],
  });
}

/** Imports current consent claims into the canonical editor-facing decision shape. */
export function importConsentClaims(claims: Record<string, unknown>): PermissionGrantDecision {
  return Object.freeze({
    actorIdentifiers: splitCsv(claims[ClaimConsent.actorIdentifier]),
    decision: normalizeConsentDecision(claims[ClaimConsent.decision]),
    purposes: splitCsv(claims[ClaimConsent.purpose]),
    roles: splitCsv(claims[ClaimConsent.actorRole]),
    targets: [
      ...splitCsv(claims[ClaimConsent.action]).map((code) => createSectionTarget(code, [PermissionTemplateOperationCodes.Read])),
      ...splitCsv(claims[ClaimConsent.category]).map((code) => createSectionTarget(code, [PermissionTemplateOperationCodes.Read])),
      ...splitCsv(claims[ClaimConsent.resourceType]).map((code) => createResourceTypeTarget(code, [PermissionTemplateOperationCodes.Read])),
    ],
    metadataOnly: false,
    smartScopes: [],
  });
}

/** Imports one bundle entry carrying a Consent resource back into the canonical decision shape. */
export function importConsentEntry(entry: BundleEntry): PermissionGrantDecision {
  const claims = (entry.resource?.meta?.claims || {}) as Record<string, unknown>;
  return importConsentClaims(claims);
}

/** Exports a canonical permission decision into the current consent claim contract. */
export function exportConsentClaims(
  decision: PermissionGrantDecision,
  options: ExportConsentClaimsOptions = {},
): Record<string, unknown> {
  const sectionActionCodes: string[] = [];
  const sectionCategoryCodes: string[] = [];
  const resourceTypes: string[] = [];

  for (const target of decision.targets) {
    assertClaimCompatibleTarget(target);
    if (target.kind === PermissionTemplateTargetKinds.ResourceType) {
      resourceTypes.push(target.code);
      continue;
    }
    if (target.sectionFamily === 'kind-of-document') {
      sectionCategoryCodes.push(target.code);
      continue;
    }
    if (target.kind === PermissionTemplateTargetKinds.Section) {
      sectionActionCodes.push(target.code);
    }
  }

  return {
    '@context': 'org.hl7.fhir.api',
    [ClaimConsent.decision]: decision.decision,
    ...(options.identifier ? { [ClaimConsent.identifier]: options.identifier } : {}),
    ...(options.subject ? { [ClaimConsent.subject]: options.subject } : {}),
    ...(decision.actorIdentifiers.length ? { [ClaimConsent.actorIdentifier]: decision.actorIdentifiers.join(',') } : {}),
    ...(decision.purposes.length ? { [ClaimConsent.purpose]: decision.purposes.join(',') } : {}),
    ...(decision.roles.length ? { [ClaimConsent.actorRole]: decision.roles.join(',') } : {}),
    ...(sectionActionCodes.length ? { [ClaimConsent.action]: normalizeCsvValues(sectionActionCodes).join(',') } : {}),
    ...(sectionCategoryCodes.length ? { [ClaimConsent.category]: normalizeCsvValues(sectionCategoryCodes).join(',') } : {}),
    ...(resourceTypes.length ? { [ClaimConsent.resourceType]: normalizeCsvValues(resourceTypes).join(',') } : {}),
  };
}

/** Exports one canonical permission decision into a Consent bundle entry. */
export function exportConsentEntry(
  decision: PermissionGrantDecision,
  options: ExportConsentEntryOptions = {},
): BundleEntry {
  return {
    type: options.type || DEFAULT_CONSENT_ENTRY_TYPE,
    resource: {
      resourceType: ResourceTypesFhirR4.Consent,
      meta: {
        claims: exportConsentClaims(decision, options),
      },
    },
    ...(options.fullUrl ? { fullUrl: options.fullUrl } : {}),
  };
}

/** Exports many canonical permission decisions into Consent bundle entries. */
export function exportConsentEntries(
  decisions: readonly PermissionGrantDecision[],
  options: ExportConsentEntryOptions = {},
): BundleEntry[] {
  return decisions.map((decision, index) =>
    exportConsentEntry(decision, {
      ...options,
      fullUrl: options.fullUrl ? `${options.fullUrl}-${index + 1}` : undefined,
    }));
}

function normalizeConsentDecision(value: unknown): ConsentDecision {
  return String(value || '').trim() === ConsentDecisions.Deny
    ? ConsentDecisions.Deny
    : ConsentDecisions.Permit;
}

function assertClaimCompatibleTarget(target: PermissionTemplateTarget): void {
  const normalizedScopes = normalizeCsvValues(target.scopes);
  const unsupported = normalizedScopes.filter((scope) => scope !== PermissionTemplateOperationCodes.Read);
  if (unsupported.length > 0) {
    throw new Error(
      `Current consent claims only preserve read-oriented targets. Unsupported scopes: ${unsupported.join(',')}`,
    );
  }
}

function splitCsv(value: unknown): string[] {
  return normalizeCsvValues(String(value || '').split(','));
}

function normalizeCsvValues(values: readonly unknown[]): string[] {
  return Array.from(new Set(
    values
      .map((value) => String(value || '').trim())
      .filter(Boolean),
  ));
}
