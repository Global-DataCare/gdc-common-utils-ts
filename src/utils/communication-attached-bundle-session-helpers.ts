// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import {
  getHealthcareRoleByClaim,
  HealthcareRoleFamilies,
  getHealthcareSectionsByFamily,
  getHealthcareSectionByCode,
  getHealthcareSectionFamilyByCode,
  HealthcareConsentPurposes,
  HealthcareCanonicalSectionFamilies,
  type HealthcareCanonicalSectionFamily,
} from '../constants/healthcare';
import { ClaimConsent } from '../models/consent-rule';
import type { BundleEntry, BundleEntryResource, BundleJsonApi } from '../models/bundle';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';
import { AppointmentClaim } from '../models/interoperable-claims/appointment-claims';
import { AppointmentResponseClaim } from '../models/interoperable-claims/appointment-response-claims';
import { CarePlanClaim } from '../models/interoperable-claims/care-plan-claims';
import { ClinicalImpressionClaim } from '../models/interoperable-claims/clinical-impression-claims';
import { ConditionClaim } from '../models/interoperable-claims/condition-claims';
import { CompositionClaim } from '../models/interoperable-claims/composition-claims';
import { CoverageClaim } from '../models/interoperable-claims/coverage-claims';
import { DeviceClaim } from '../models/interoperable-claims/device-claims';
import { DeviceUseStatementClaim } from '../models/interoperable-claims/device-use-statement-claims';
import { DiagnosticReportClaim } from '../models/interoperable-claims/diagnostic-report-claims';
import { DocumentReferenceClaim } from '../models/interoperable-claims/document-reference-claims';
import { EncounterClaim } from '../models/interoperable-claims/encounter-claims';
import { FlagClaim } from '../models/interoperable-claims/flag-claims';
import { ImmunizationClaim } from '../models/interoperable-claims/immunization-claims';
import { LocationClaim } from '../models/interoperable-claims/location-claims';
import {
  MedicationStatementClaim,
} from '../models/interoperable-claims/medication-statement-claims';
import { ObservationClaim } from '../models/interoperable-claims/observation-claims';
import { OrganizationClaim } from '../models/interoperable-claims/organization-claims';
import { ProcedureClaim } from '../models/interoperable-claims/procedure-claims';
import { RelatedPersonClaim } from '../models/interoperable-claims/related-person-claims';
import { AllergyIntoleranceClaim } from '../models/interoperable-claims/allergy-intolerance-claims';
import type {
  CommunicationAttachedBundleSessionMode,
  ConsentEditorClassifiedActorRole,
  ConsentEditorClassifiedActors,
  ConsentEditorClassifiedJurisdiction,
  ConsentEditorClassifiedOrganization,
  ConsentEditorClassifiedPurpose,
  ConsentEditorClassifiedRole,
  ConsentEditorClassifiedRoles,
  ConsentEditorClassifiedTarget,
  ConsentEditorClassifiedUser,
  ConsentViewModel,
  ConsentEditorScopeCode,
  ConsentEditorTargetKind,
} from '../models/communication-attached-bundle-session';
import {
  ConsentEditorScopeCodes,
  ConsentEditorTargetKinds,
} from '../models/communication-attached-bundle-session';

export const CSV_SEPARATOR = ',';
const DID_WEB_PREFIX = 'did:web:';
const PHONE_PREFIX = 'tel:';

export function ensureEntryResource(
  entry: BundleEntry,
  mode: CommunicationAttachedBundleSessionMode,
): BundleEntryResource {
  const resource = entry.resource as BundleEntryResource | undefined;
  if (resource && typeof resource === 'object') {
    return resource;
  }
  if (mode === 'normalize') {
    return { meta: { claims: {} } };
  }
  throw new Error('Active entry does not contain a valid resource object.');
}

export function validateBundleLike(
  bundle: BundleJsonApi<BundleEntry>,
  mode: CommunicationAttachedBundleSessionMode,
): void {
  const looksLikeBundle = bundle
    && bundle.resourceType === ResourceTypesFhirR4.Bundle
    && (Array.isArray((bundle as any).data) || Array.isArray((bundle as any).entry));
  if (looksLikeBundle || mode === 'normalize') {
    return;
  }
  throw new Error('Decoded attachment is not a valid BundleJsonApi payload.');
}

export function createEmptyBundle(): BundleJsonApi<BundleEntry> {
  return {
    resourceType: ResourceTypesFhirR4.Bundle,
    type: 'batch',
    data: [],
  };
}

export function encodeBundleToBase64(bundle: BundleJsonApi<BundleEntry>): string {
  return Buffer.from(JSON.stringify(bundle), 'utf8').toString('base64');
}

export function cloneBundle(bundle: BundleJsonApi<BundleEntry>): BundleJsonApi<BundleEntry> {
  return JSON.parse(JSON.stringify(bundle)) as BundleJsonApi<BundleEntry>;
}

export function cloneEntry(entry: BundleEntry): BundleEntry {
  return JSON.parse(JSON.stringify(entry)) as BundleEntry;
}

export function cloneUnknownValue<T>(value: T): T {
  if (value === undefined) {
    return value;
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

export function asTrimmedString(value: unknown): string {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value).trim();
}

export function resolveContainedDocumentsClaimKey(resourceType: string): string {
  if (resourceType === ResourceTypesFhirR4.Consent) {
    return ClaimConsent.containedReferenceList;
  }
  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    return MedicationStatementClaim.ContainedReferenceList;
  }
  if (resourceType === ResourceTypesFhirR4.Condition) {
    return ConditionClaim.ContainedReferenceList;
  }
  if (resourceType === ResourceTypesFhirR4.AllergyIntolerance) {
    return AllergyIntoleranceClaim.ContainedReferenceList;
  }
  if (resourceType === ResourceTypesFhirR4.DiagnosticReport) {
    return DiagnosticReportClaim.ContainedReferenceList;
  }
  return '';
}

export function resolveSubjectFromClaims(claims: Record<string, unknown>): string {
  return asTrimmedString(
    claims[ClaimConsent.subject]
    || claims[MedicationStatementClaim.Subject]
    || claims[MedicationStatementClaim.Patient]
    || claims[DiagnosticReportClaim.Subject]
    || claims[DiagnosticReportClaim.Patient]
    || claims[CarePlanClaim.Subject]
    || claims[CarePlanClaim.Patient]
    || claims[ConditionClaim.Subject]
    || claims[ProcedureClaim.Subject]
    || claims[ProcedureClaim.Patient]
    || claims[AllergyIntoleranceClaim.Subject]
    || claims[AllergyIntoleranceClaim.Patient]
    || claims[ImmunizationClaim.Subject]
    || claims[ImmunizationClaim.Patient]
    || claims[EncounterClaim.Subject]
    || claims[EncounterClaim.Patient]
    || claims[DocumentReferenceClaim.Subject]
    || claims[ObservationClaim.Subject]
    || claims[ObservationClaim.Patient]
    || claims[FlagClaim.Subject]
    || claims[FlagClaim.Patient]
    || claims[ClinicalImpressionClaim.Subject]
    || claims[DeviceClaim.Patient]
    || claims[DeviceUseStatementClaim.Subject]
    || claims[CoverageClaim.Beneficiary]
    || claims[AppointmentResponseClaim.Patient]
    || claims[CompositionClaim.Subject]
    || claims[RelatedPersonClaim.Patient],
  );
}

/**
 * Resolves the canonical resource-scoped identifier used for upsert matching.
 */
export function resolveBundleEntryIdentifier(claims: Record<string, unknown>): string {
  const identifierCandidates: ReadonlyArray<readonly [string, string]> = [
    [ResourceTypesFhirR4.Consent, ClaimConsent.identifier],
    [ResourceTypesFhirR4.MedicationStatement, MedicationStatementClaim.Identifier],
    [ResourceTypesFhirR4.DiagnosticReport, DiagnosticReportClaim.Identifier],
    [ResourceTypesFhirR4.DocumentReference, DocumentReferenceClaim.Identifier],
    [ResourceTypesFhirR4.Condition, ConditionClaim.Identifier],
    [ResourceTypesFhirR4.AllergyIntolerance, AllergyIntoleranceClaim.Identifier],
    [ResourceTypesFhirR4.Observation, ObservationClaim.Identifier],
    [ResourceTypesFhirR4.Appointment, AppointmentClaim.Identifier],
    [ResourceTypesFhirR4.AppointmentResponse, AppointmentResponseClaim.Identifier],
    [ResourceTypesFhirR4.CarePlan, CarePlanClaim.Identifier],
    [ResourceTypesFhirR4.Procedure, ProcedureClaim.Identifier],
    [ResourceTypesFhirR4.Immunization, ImmunizationClaim.Identifier],
    [ResourceTypesFhirR4.Encounter, EncounterClaim.Identifier],
    [ResourceTypesFhirR4.Device, DeviceClaim.Identifier],
    [ResourceTypesFhirR4.DeviceUseStatement, DeviceUseStatementClaim.Identifier],
    [ResourceTypesFhirR4.Flag, FlagClaim.Identifier],
    [ResourceTypesFhirR4.ClinicalImpression, ClinicalImpressionClaim.Identifier],
    [ResourceTypesFhirR4.Coverage, CoverageClaim.Identifier],
    [ResourceTypesFhirR4.Composition, CompositionClaim.Identifier],
    [ResourceTypesFhirR4.Location, LocationClaim.Identifier],
    [ResourceTypesFhirR4.Organization, OrganizationClaim.Identifier],
    [ResourceTypesFhirR4.RelatedPerson, RelatedPersonClaim.IdentifierValue],
    [ResourceTypesFhirR4.RelatedPerson, RelatedPersonClaim.Identifier],
    [ResourceTypesFhirR4.Communication, CommunicationClaim.Identifier],
  ];

  for (const [resourceType, claimKey] of identifierCandidates) {
    const identifier = asTrimmedString(claims[claimKey]);
    if (identifier) {
      return `${resourceType}:${identifier}`;
    }
  }

  return '';
}

/**
 * Resolves the stable entry id value stored in `BundleEntry.id`.
 */
export function resolveBundleEntryCanonicalIdValue(claims: Record<string, unknown>): string {
  const identifierCandidates: readonly string[] = [
    ClaimConsent.identifier,
    MedicationStatementClaim.Identifier,
    DiagnosticReportClaim.Identifier,
    DocumentReferenceClaim.Identifier,
    ConditionClaim.Identifier,
    AllergyIntoleranceClaim.Identifier,
    ObservationClaim.Identifier,
    AppointmentClaim.Identifier,
    AppointmentResponseClaim.Identifier,
    CarePlanClaim.Identifier,
    ProcedureClaim.Identifier,
    ImmunizationClaim.Identifier,
    EncounterClaim.Identifier,
    DeviceClaim.Identifier,
    DeviceUseStatementClaim.Identifier,
    FlagClaim.Identifier,
    ClinicalImpressionClaim.Identifier,
    CoverageClaim.Identifier,
    CompositionClaim.Identifier,
    LocationClaim.Identifier,
    OrganizationClaim.Identifier,
    RelatedPersonClaim.IdentifierValue,
    RelatedPersonClaim.Identifier,
    CommunicationClaim.Identifier,
  ];

  for (const claimKey of identifierCandidates) {
    const identifier = asTrimmedString(claims[claimKey]);
    if (identifier) {
      return identifier;
    }
  }

  return '';
}

export function setIfMissing(target: Record<string, unknown>, key: string, value: unknown): void {
  if (target[key] !== undefined) {
    return;
  }
  if (value === undefined || value === null || String(value).trim() === '') {
    return;
  }
  target[key] = value;
}

export function runtimeUuid(prefix: string): string {
  const cryptoLike = globalThis as typeof globalThis & {
    crypto?: { randomUUID?: () => string };
  };
  if (typeof cryptoLike.crypto?.randomUUID === 'function') {
    return cryptoLike.crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function splitCsv(value: unknown): string[] {
  return normalizeCsvValues(String(value || '').split(CSV_SEPARATOR));
}

export function normalizeCsvValues(values: readonly unknown[]): string[] {
  return Array.from(new Set(
    values
      .map((item) => String(item || '').trim())
      .filter(Boolean),
  ));
}

export function buildClassifiedConsentTarget(
  kind: ConsentEditorTargetKind,
  code: string,
  scopeCodes: readonly ConsentEditorScopeCode[],
  sectionFamily?: HealthcareCanonicalSectionFamily,
): ConsentEditorClassifiedTarget {
  const normalizedCode = String(code || '').trim();
  return {
    target: {
      kind,
      code: normalizedCode,
      display: resolveConsentTargetDisplay(kind, normalizedCode),
      ...(kind === ConsentEditorTargetKinds.Section
        ? { sectionFamily: sectionFamily || getHealthcareSectionFamilyByCode(normalizedCode) }
        : {}),
    },
    scopes: normalizeScopeCodes(scopeCodes).map((scopeCode) => ({
      code: scopeCode,
      display: resolveConsentScopeDisplay(scopeCode),
    })),
  };
}

export function buildSectionCatalogOptions(
  sectionKind: HealthcareCanonicalSectionFamily,
): ConsentEditorClassifiedTarget[] {
  return Object.values(getHealthcareSectionsByFamily(sectionKind)).map((descriptor) =>
    buildClassifiedConsentTarget(
      ConsentEditorTargetKinds.Section,
      descriptor.attributeValue,
      [ConsentEditorScopeCodes.Read],
    ));
}

export function normalizeScopeCodes(scopeCodes: readonly ConsentEditorScopeCode[]): ConsentEditorScopeCode[] {
  const values = Array.from(new Set(scopeCodes.map((scopeCode) => String(scopeCode).trim()).filter(Boolean)));
  return values.filter((scopeCode): scopeCode is ConsentEditorScopeCode =>
    Object.values(ConsentEditorScopeCodes).includes(scopeCode as ConsentEditorScopeCode),
  );
}

export function normalizeClassifiedTargets(targets: readonly ConsentEditorClassifiedTarget[]): ConsentEditorClassifiedTarget[] {
  const result = new Map<string, ConsentEditorClassifiedTarget>();
  for (const target of targets) {
    const normalized = buildClassifiedConsentTarget(
      target.target.kind,
      String(target.target.code || '').trim(),
      target.scopes.map((scope) => scope.code),
      target.target.sectionFamily,
    );
    const key = `${normalized.target.kind}:${normalized.target.code}`;
    result.set(key, normalized);
  }
  return Array.from(result.values());
}

export function resolveConsentTargetDisplay(kind: ConsentEditorTargetKind, code: string): string | undefined {
  if (kind === ConsentEditorTargetKinds.ResourceType) {
    return code;
  }
  if (kind === ConsentEditorTargetKinds.Section) {
    const loincCode = code.includes('|') ? code.split('|').slice(-1)[0] : code;
    return getHealthcareSectionByCode(loincCode)?.titleEn;
  }
  return undefined;
}

export function resolveConsentScopeDisplay(scopeCode: ConsentEditorScopeCode): string {
  if (scopeCode === ConsentEditorScopeCodes.Search) return 'search';
  if (scopeCode === ConsentEditorScopeCodes.Read) return 'read';
  if (scopeCode === ConsentEditorScopeCodes.Create) return 'create';
  if (scopeCode === ConsentEditorScopeCodes.Update) return 'update';
  return 'delete';
}

export function resolveConsentPurposeDisplay(code: string): string {
  const normalized = String(code || '').trim();
  if (normalized === HealthcareConsentPurposes.Treatment) return 'Treatment';
  if (normalized === HealthcareConsentPurposes.EmergencyTreatment) return 'Emergency treatment';
  if (normalized === HealthcareConsentPurposes.CareManagement) return 'Care management';
  if (normalized === HealthcareConsentPurposes.Operations) return 'Operations';
  if (normalized === HealthcareConsentPurposes.PatientAdministration) return 'Patient administration';
  if (normalized === HealthcareConsentPurposes.RecordsManagement) return 'Records management';
  return normalized;
}

export function looksLikeEmailToken(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim().toLowerCase());
}

export function looksLikePhoneToken(value: string): boolean {
  return String(value || '').trim().startsWith(PHONE_PREFIX);
}

export function looksLikeJurisdictionToken(value: string): boolean {
  return /^[A-Z]{2}([\-:][A-Z0-9]+)?$/.test(String(value || '').trim());
}

export function parseDidWebOrganizationToken(value: string): ConsentEditorClassifiedOrganization | undefined {
  const normalized = String(value || '').trim();
  if (!normalized.startsWith(DID_WEB_PREFIX)) {
    return undefined;
  }
  const segments = normalized.slice(DID_WEB_PREFIX.length).split(':').filter(Boolean);
  if (segments.length === 0) {
    return undefined;
  }
  const [domain, ...departmentSegments] = segments;
  return {
    domain,
    display: domain,
    departments: departmentSegments.map((segment) => ({
      code: segment,
      display: segment,
    })),
    locations: [],
  };
}

export function parseConsentActorRole(value: string): ConsentEditorClassifiedActorRole | undefined {
  const normalized = String(value || '').trim();
  if (!normalized) {
    return undefined;
  }
  const healthcareRole = getHealthcareRoleByClaim(normalized);
  if (healthcareRole) {
    return {
      codingSystem: healthcareRole.codingSystem,
      code: healthcareRole.code,
      display: healthcareRole.titleEn,
    };
  }

  const separatorIndex = normalized.indexOf('|');
  if (separatorIndex < 0) {
    return {
      codingSystem: '',
      code: normalized,
      display: normalized,
    };
  }

  return {
    codingSystem: normalized.slice(0, separatorIndex),
    code: normalized.slice(separatorIndex + 1),
    display: normalized,
  };
}

export function flattenClassifiedActors(classifiedActors: ConsentEditorClassifiedActors): string[] {
  return normalizeCsvValues([
    ...classifiedActors.jurisdictions.map((jurisdiction) => jurisdiction.code),
    ...classifiedActors.organizations.map(serializeClassifiedOrganization),
    ...classifiedActors.users.flatMap((user) => [user.email, user.phone]),
  ]);
}

export function serializeClassifiedOrganization(organization: ConsentEditorClassifiedOrganization): string {
  const domain = String(organization.domain || '').trim();
  const departments = organization.departments
    .map((department) => String(department.code || '').trim())
    .filter(Boolean);
  return [DID_WEB_PREFIX.replace(/:$/, ''), domain, ...departments].join(':');
}

export function flattenClassifiedRoles(classifiedRoles: ConsentEditorClassifiedRoles): string[] {
  return normalizeCsvValues([
    ...classifiedRoles.professional.map(serializeClassifiedRole),
    ...classifiedRoles.relationship.map(serializeClassifiedRole),
    ...classifiedRoles.legalRepresentative.map(serializeClassifiedRole),
    ...classifiedRoles.other.map(serializeClassifiedRole),
  ]);
}

export function serializeClassifiedRole(role: ConsentEditorClassifiedRole): string {
  const descriptor = getHealthcareRoleByClaim(`${String(role.codingSystem || '').trim()}|${String(role.code || '').trim()}`);
  if (descriptor) {
    return descriptor.claim;
  }
  return String(role.code || '').trim() || String(role.display || '').trim();
}

export function flattenClassifiedTargets(
  classifiedTargets: readonly ConsentEditorClassifiedTarget[],
): Readonly<{
  coreSections: readonly string[];
  kindOfDocuments: readonly string[];
  typeOfServices: readonly string[];
  subjectMatterDomains: readonly string[];
  resourceTypes: readonly string[];
}> {
  const coreSections: string[] = [];
  const kindOfDocuments: string[] = [];
  const typeOfServices: string[] = [];
  const subjectMatterDomains: string[] = [];
  const resourceTypes: string[] = [];

  for (const entry of normalizeClassifiedTargets(classifiedTargets)) {
    if (entry.target.kind === ConsentEditorTargetKinds.ResourceType) {
      resourceTypes.push(entry.target.code);
      continue;
    }

    const sectionFamily = entry.target.sectionFamily || getHealthcareSectionFamilyByCode(entry.target.code);
    if (sectionFamily === HealthcareCanonicalSectionFamilies.KindOfDocument) {
      kindOfDocuments.push(entry.target.code);
      continue;
    }
    if (sectionFamily === HealthcareCanonicalSectionFamilies.TypeOfService) {
      typeOfServices.push(entry.target.code);
      continue;
    }
    if (sectionFamily === HealthcareCanonicalSectionFamilies.SubjectMatterDomain) {
      subjectMatterDomains.push(entry.target.code);
      continue;
    }
    coreSections.push(entry.target.code);
  }

  return {
    coreSections: normalizeCsvValues(coreSections),
    kindOfDocuments: normalizeCsvValues(kindOfDocuments),
    typeOfServices: normalizeCsvValues(typeOfServices),
    subjectMatterDomains: normalizeCsvValues(subjectMatterDomains),
    resourceTypes: normalizeCsvValues(resourceTypes),
  };
}

export function classifyConsentTargetsFromClaims(
  claims: Record<string, unknown>,
): ConsentEditorClassifiedTarget[] {
  const actionTargets = splitCsv(claims[ClaimConsent.action]).map((code) =>
    buildClassifiedConsentTarget(ConsentEditorTargetKinds.Section, code, [ConsentEditorScopeCodes.Read]));
  const categoryTargets = splitCsv(claims[ClaimConsent.category]).map((code) =>
    buildClassifiedConsentTarget(
      ConsentEditorTargetKinds.Section,
      code,
      [ConsentEditorScopeCodes.Read],
      HealthcareCanonicalSectionFamilies.KindOfDocument,
    ));
  const resourceTypes = splitCsv(claims[ClaimConsent.resourceType]).map((code) =>
    buildClassifiedConsentTarget(ConsentEditorTargetKinds.ResourceType, code, [ConsentEditorScopeCodes.Read]));

  return normalizeClassifiedTargets([
    ...actionTargets,
    ...categoryTargets,
    ...resourceTypes,
  ]);
}

export function classifyConsentPurposes(
  purposeCodes: readonly string[],
): ConsentEditorClassifiedPurpose[] {
  return purposeCodes.map((code) => ({
    code,
    display: resolveConsentPurposeDisplay(code),
  }));
}

export function classifyConsentRoles(
  roleTokens: readonly string[],
): ConsentEditorClassifiedRoles {
  const classified: {
    professional: ConsentEditorClassifiedRole[];
    relationship: ConsentEditorClassifiedRole[];
    legalRepresentative: ConsentEditorClassifiedRole[];
    other: ConsentEditorClassifiedRole[];
  } = {
    professional: [],
    relationship: [],
    legalRepresentative: [],
    other: [],
  };

  for (const roleToken of roleTokens) {
    const role = getHealthcareRoleByClaim(roleToken);
    if (!role) {
      classified.other.push({
        codingSystem: '',
        code: roleToken,
        display: roleToken,
      });
      continue;
    }

    const nextRole: ConsentEditorClassifiedRole = {
      kind: role.family,
      codingSystem: role.codingSystem,
      code: role.code,
      display: role.titleEn,
      definition: role.definition,
    };

    if (role.family === HealthcareRoleFamilies.ProfessionalOccupationIsco08) {
      classified.professional.push(nextRole);
    } else if (role.family === HealthcareRoleFamilies.PersonalRelationshipHl7) {
      classified.relationship.push(nextRole);
    } else if (role.family === HealthcareRoleFamilies.LegalRepresentativeHl7) {
      classified.legalRepresentative.push(nextRole);
    } else {
      classified.other.push(nextRole);
    }
  }

  return classified;
}

export function classifyConsentActors(
  actorTokens: readonly string[],
  actorRoleToken?: string,
): ConsentEditorClassifiedActors {
  const actorRole = parseConsentActorRole(actorRoleToken || '');
  const jurisdictions = new Map<string, ConsentEditorClassifiedJurisdiction>();
  const organizations = new Map<string, ConsentEditorClassifiedOrganization>();
  const users = new Map<string, ConsentEditorClassifiedUser>();

  for (const token of actorTokens) {
    if (looksLikeJurisdictionToken(token)) {
      jurisdictions.set(token, { code: token, display: token });
      continue;
    }

    if (looksLikeEmailToken(token)) {
      users.set(`email:${token}`, {
        email: token,
        ...(actorRole ? { role: actorRole } : {}),
      });
      continue;
    }

    if (looksLikePhoneToken(token)) {
      users.set(`phone:${token}`, {
        phone: token,
        ...(actorRole ? { role: actorRole } : {}),
      });
      continue;
    }

    const organization = parseDidWebOrganizationToken(token);
    if (organization) {
      organizations.set(organization.domain, organization);
    }
  }

  return {
    jurisdictions: Array.from(jurisdictions.values()),
    organizations: Array.from(organizations.values()),
    users: Array.from(users.values()),
  };
}

export function buildConsentViewModel(
  activeEntry: BundleEntry | null,
  decision: string,
  classifiedActors: ConsentEditorClassifiedActors,
  classifiedRoles: ConsentEditorClassifiedRoles,
  classifiedPurposes: readonly ConsentEditorClassifiedPurpose[],
  classifiedTargets: readonly ConsentEditorClassifiedTarget[],
): ConsentViewModel {
  const claims = {
    ...(activeEntry?.resource?.meta?.claims || {}),
  };

  return {
    ...(activeEntry?.fullUrl ? { fullUrl: activeEntry.fullUrl } : {}),
    identifier: asTrimmedString(claims[ClaimConsent.identifier]),
    subject: asTrimmedString(claims[ClaimConsent.subject]),
    decision,
    classifiedActors,
    classifiedRoles,
    classifiedPurposes,
    classifiedTargets,
  };
}
