import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { AllergyIntoleranceClaim } from '../models/interoperable-claims/allergy-intolerance-claims';
import { CompositionClaim } from '../models/interoperable-claims/composition-claims';
import { ConditionClaim } from '../models/interoperable-claims/condition-claims';
import { DiagnosticReportClaim } from '../models/interoperable-claims/diagnostic-report-claims';
import { MedicationStatementClaim } from '../models/interoperable-claims/medication-statement-claims';
import { ClaimConsent } from '../models/consent-rule';
import {
  allergyIntoleranceFlatToFhirR4,
  appointmentFlatToFhirR4,
  carePlanFlatToFhirR4,
  clinicalImpressionFlatToFhirR4,
  compositionFlatToFhirR4,
  conditionFlatToFhirR4,
  consentFlatToFhirR4,
  convertFhirResourceToClaims,
  coverageFlatToFhirR4,
  deviceFlatToFhirR4,
  documentReferenceFlatToFhirR4,
  diagnosticReportFlatToFhirR4,
  encounterFlatToFhirR4,
  flagFlatToFhirR4,
  flatClaimsToFhirResource,
  immunizationFlatToFhirR4,
  locationFlatToFhirR4,
  medicationStatementFlatToFhirR4,
  observationFromFlatToFhirR4,
  organizationFlatToFhirR4,
  procedureFlatToFhirR4,
  practitionerRoleFlatToFhirR4,
  relatedPersonFlatToFhirR4,
  type FhirResource,
  type FlatClaims,
} from './clinical-resource-converters';

export type BundleDocumentClaims = Readonly<Record<string, unknown>>;

export type BuildBundleDocumentFromClaimsInput = Readonly<{
  claimsList: readonly BundleDocumentClaims[];
  subjectDid?: string;
  compositionType?: string;
  compositionClaims?: BundleDocumentClaims;
}>;

export type ValidateBundleDocumentResult = Readonly<{
  ok: boolean;
  issues: string[];
}>;

export type BundleDocumentResourceFilter = Readonly<{
  section?: string;
  resourceType?: string;
}>;

export type PrepareBundleDocumentForSubjectOptions = Readonly<{
  context?: string;
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

export function getSimpleClaimAttributeName(key: string): string {
  const value = asTrimmedString(key);
  if (!value) return '';
  const knownPrefixes = [
    'org.hl7.fhir.r4.',
    'org.hl7.fhir.api.',
  ];
  for (const prefix of knownPrefixes) {
    if (value.startsWith(prefix)) {
      return value.slice(prefix.length);
    }
  }
  return value;
}

export function extractFlatClaimValue(record: Record<string, any> | undefined, key: string): string {
  const normalizedKey = getSimpleClaimAttributeName(key);
  if (!record || typeof record !== 'object') return '';
  const direct = record[normalizedKey];
  if (typeof direct === 'string' && direct.trim()) return direct.trim();
  const contextualizedR4 = record[`org.hl7.fhir.r4.${normalizedKey}`];
  if (typeof contextualizedR4 === 'string' && contextualizedR4.trim()) return contextualizedR4.trim();
  const contextualizedApi = record[`org.hl7.fhir.api.${normalizedKey}`];
  if (typeof contextualizedApi === 'string' && contextualizedApi.trim()) return contextualizedApi.trim();
  const nested = record?.meta?.claims?.[normalizedKey];
  if (typeof nested === 'string' && nested.trim()) return nested.trim();
  const nestedR4 = record?.meta?.claims?.[`org.hl7.fhir.r4.${normalizedKey}`];
  if (typeof nestedR4 === 'string' && nestedR4.trim()) return nestedR4.trim();
  const nestedApi = record?.meta?.claims?.[`org.hl7.fhir.api.${normalizedKey}`];
  if (typeof nestedApi === 'string' && nestedApi.trim()) return nestedApi.trim();
  return '';
}

function claimsToFlatStrings(claims: BundleDocumentClaims): FlatClaims {
  const out: FlatClaims = {};
  for (const [key, value] of Object.entries(claims || {})) {
    if (value === undefined || value === null || key === '@context') continue;
    const canonicalKey = getSimpleClaimAttributeName(key);
    if (canonicalKey === key) continue;
    out[canonicalKey] = typeof value === 'string' ? value : String(value);
  }
  for (const [key, value] of Object.entries(claims || {})) {
    if (value === undefined || value === null || key === '@context') continue;
    const canonicalKey = getSimpleClaimAttributeName(key);
    if (canonicalKey !== key) continue;
    out[key] = typeof value === 'string' ? value : String(value);
  }
  return out;
}

function ensureClaimsIdentifier(
  claims: BundleDocumentClaims,
  resource: Record<string, unknown>,
): BundleDocumentClaims {
  const resourceType = asTrimmedString(resource?.resourceType);
  const identifierKey = resourceType ? `${resourceType}.identifier` : '';
  if (!identifierKey) {
    return claims;
  }
  if (asTrimmedString(claims[identifierKey])) {
    return claims;
  }
  const resourceId = asTrimmedString(resource?.id);
  if (!resourceId) {
    return claims;
  }
  return {
    ...claims,
    [identifierKey]: resourceId,
  };
}

function ensureResourceIdentifier(resource: FhirResource, claims: BundleDocumentClaims, fallbackIndex: number): void {
  const identifier = Object.entries(claims).find(([key]) => String(key).toLowerCase().endsWith('.identifier'))?.[1];
  const nextId = asTrimmedString(identifier) || `${resource.resourceType.toLowerCase()}-${fallbackIndex + 1}`;
  if (!asTrimmedString(resource.id)) {
    resource.id = nextId;
  }
}

function normalizeSectionCode(value: string): { code: string; system?: string } {
  const raw = asTrimmedString(value);
  if (!raw) return { code: '' };
  const [system, code] = raw.split('|');
  if (!code) return { code: system };
  return { system, code };
}

function toCanonicalSectionToken(system: unknown, code: unknown): string {
  const normalizedSystem = asTrimmedString(system);
  const normalizedCode = asTrimmedString(code);
  if (!normalizedCode) return '';
  if (!normalizedSystem) return normalizedCode;
  return `${normalizedSystem === 'http://loinc.org' ? 'LOINC' : normalizedSystem}|${normalizedCode}`;
}

function resourceReferenceAliases(entry: Record<string, any>): string[] {
  const resource = entry?.resource;
  const resourceType = asTrimmedString(resource?.resourceType);
  const resourceId = asTrimmedString(resource?.id);
  const fullUrl = asTrimmedString(entry?.fullUrl);
  return Array.from(new Set([
    fullUrl,
    resourceType && resourceId ? `${resourceType}/${resourceId}` : '',
    resourceId,
    fullUrl ? fullUrl.split('/').slice(-2).join('/') : '',
  ].filter(Boolean)));
}

function sectionMembershipByReference(composition: Record<string, any>): Map<string, string[]> {
  const memberships = new Map<string, string[]>();
  const visit = (sections: unknown): void => {
    if (!Array.isArray(sections)) return;
    for (const section of sections) {
      const coding = Array.isArray(section?.code?.coding) ? section.code.coding[0] : undefined;
      const token = toCanonicalSectionToken(coding?.system, coding?.code);
      if (token && Array.isArray(section?.entry)) {
        for (const item of section.entry) {
          const reference = asTrimmedString(item?.reference);
          if (!reference) continue;
          const aliases = [reference, reference.split('/').slice(-2).join('/'), reference.split('/').pop() || ''];
          for (const alias of aliases.filter(Boolean)) {
            memberships.set(alias, Array.from(new Set([...(memberships.get(alias) || []), token])));
          }
        }
      }
      visit(section?.section);
    }
  };
  visit(composition?.section);
  return memberships;
}

function allCompositionSectionTokens(composition: Record<string, any>): string[] {
  const tokens: string[] = [];
  const visit = (sections: unknown): void => {
    if (!Array.isArray(sections)) return;
    for (const section of sections) {
      const coding = Array.isArray(section?.code?.coding) ? section.code.coding[0] : undefined;
      const token = toCanonicalSectionToken(coding?.system, coding?.code);
      if (token) tokens.push(token);
      visit(section?.section);
    }
  };
  visit(composition?.section);
  return Array.from(new Set(tokens));
}

function replacePatientSubjectReference(resource: Record<string, any>, subjectDid: string): void {
  const resourceType = asTrimmedString(resource?.resourceType);
  if (resourceType === ResourceTypesFhirR4.Composition || resource?.subject?.reference) {
    resource.subject = { ...(resource.subject || {}), reference: subjectDid };
  }
  if (resource?.patient?.reference) {
    resource.patient = { ...(resource.patient || {}), reference: subjectDid };
  }
}

/**
 * Validates and prepares an imported FHIR document for one authorized subject.
 *
 * The input is cloned. Every resource receives a deterministic flat
 * `meta.claims` projection. Resources referenced by `Composition.section`
 * receive the canonical section tokens in `Composition.section`, and patient
 * subject references are rebound to the selected `did:web` subject. Existing
 * claims are retained, except subject/patient values are forced to the
 * selected subject so an imported local `Patient/{id}` cannot escape the
 * controller-authorized index scope. The source object is never mutated.
 *
 * This is a conversion primitive only. It neither confirms that a mismatched
 * Patient is the right person nor persists anything; confirmation belongs to
 * the product UI and transport/authorization remain GW concerns.
 */
export function prepareBundleDocumentForSubject(
  bundle: Record<string, any>,
  subjectDid: string,
  options: PrepareBundleDocumentForSubjectOptions = {},
): Record<string, any> {
  const validation = validateBundleDocumentBasic(bundle);
  if (!validation.ok) throw new Error(validation.issues.join(' '));
  const normalizedSubjectDid = asTrimmedString(subjectDid);
  if (!normalizedSubjectDid) throw new Error('A subject DID is required.');

  const prepared = JSON.parse(JSON.stringify(bundle)) as Record<string, any>;
  const entries = prepared.entry as Array<Record<string, any>>;
  const composition = entries[0]?.resource as Record<string, any>;
  const membership = sectionMembershipByReference(composition);
  const allSections = allCompositionSectionTokens(composition);

  for (const entry of entries) {
    const resource = entry?.resource;
    if (!resource || typeof resource !== 'object') continue;
    replacePatientSubjectReference(resource, normalizedSubjectDid);
    const generated = convertFhirResourceToClaims(resource as FhirResource, options.context || 'org.hl7.fhir.r4');
    const existing = resource?.meta?.claims;
    const claims: Record<string, unknown> = {
      ...generated,
      ...(existing && typeof existing === 'object' && !Array.isArray(existing) ? existing : {}),
    };
    const resourceType = asTrimmedString(resource.resourceType);
    if (resourceType !== 'Patient') {
      if (resource?.subject?.reference) claims[`${resourceType}.subject`] = normalizedSubjectDid;
      if (resource?.patient?.reference) claims[`${resourceType}.patient`] = normalizedSubjectDid;
    }
    const resourceSections = resourceType === ResourceTypesFhirR4.Composition
      ? allSections
      : resourceReferenceAliases(entry).flatMap((alias) => membership.get(alias) || []);
    if (resourceSections.length > 0) {
      claims[CompositionClaim.Section] = Array.from(new Set(resourceSections)).join(',');
    }
    resource.meta = {
      ...(resource.meta && typeof resource.meta === 'object' ? resource.meta : {}),
      claims,
    };
  }
  return prepared;
}

/**
 * Returns the Patient Full Name addressed by the document Composition.
 *
 * Resolution prefers the Patient referenced by `Composition.subject`, then
 * falls back to the first Patient for compatibility with incomplete imports.
 * Name selection prefers `use=official`, then `usual`, then the first name;
 * `HumanName.text` wins over assembling prefix/given/family/suffix.
 */
export function getBundleDocumentPatientFullName(bundle: Record<string, any>): string | undefined {
  const entries = Array.isArray(bundle?.entry) ? bundle.entry : [];
  const composition = entries[0]?.resource;
  const subjectReference = asTrimmedString(composition?.subject?.reference);
  const patientEntry = entries.find((entry: Record<string, any>) => {
    if (entry?.resource?.resourceType !== 'Patient') return false;
    if (!subjectReference) return true;
    return resourceReferenceAliases(entry).some((alias) =>
      alias === subjectReference
      || alias === subjectReference.split('/').slice(-2).join('/')
      || alias === subjectReference.split('/').pop(),
    );
  }) || entries.find((entry: Record<string, any>) => entry?.resource?.resourceType === 'Patient');
  const names = Array.isArray(patientEntry?.resource?.name) ? patientEntry.resource.name : [];
  const name = names.find((item: Record<string, any>) => item?.use === 'official')
    || names.find((item: Record<string, any>) => item?.use === 'usual')
    || names[0];
  if (!name) return undefined;
  const text = asTrimmedString(name.text);
  if (text) return text;
  const parts = [
    ...(Array.isArray(name.prefix) ? name.prefix : []),
    ...(Array.isArray(name.given) ? name.given : []),
    name.family,
    ...(Array.isArray(name.suffix) ? name.suffix : []),
  ].map(asTrimmedString).filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : undefined;
}

/**
 * Temporary Full Name comparison key: whitespace folding plus uppercase only.
 * Diacritics and punctuation are intentionally preserved until the shared
 * ICAO transliteration contract exists, so `JOSE` and `JOSÉ` do not compare as
 * equal by accident.
 */
export function normalizeFullNameForComparison(value: unknown): string {
  return asTrimmedString(value).replace(/\s+/g, ' ').toUpperCase();
}

function resolveContainedReferenceListClaimKey(resourceType: string): string | undefined {
  switch (resourceType) {
    case ResourceTypesFhirR4.MedicationStatement:
      return MedicationStatementClaim.ContainedReferenceList;
    case ResourceTypesFhirR4.AllergyIntolerance:
      return AllergyIntoleranceClaim.ContainedReferenceList;
    case ResourceTypesFhirR4.Condition:
      return ConditionClaim.ContainedReferenceList;
    case ResourceTypesFhirR4.DiagnosticReport:
      return DiagnosticReportClaim.ContainedReferenceList;
    case ResourceTypesFhirR4.Consent:
      return ClaimConsent.containedReferenceList;
    default:
      return undefined;
  }
}

function resolveContainedFlagClaimKey(resourceType: string): string | undefined {
  const normalized = asTrimmedString(resourceType);
  return normalized ? `${normalized}.is-contained` : undefined;
}

function resolveContainedParentReferenceClaimKey(resourceType: string): string | undefined {
  const normalized = asTrimmedString(resourceType);
  return normalized ? `${normalized}.contained-parent-reference` : undefined;
}

function mergeContainedResourceReferenceList(
  claims: BundleDocumentClaims,
  references: readonly string[],
): BundleDocumentClaims {
  const resourceType = detectClaimsResourceType(claims);
  const claimKey = resourceType ? resolveContainedReferenceListClaimKey(resourceType) : undefined;
  if (!claimKey || references.length === 0) {
    return claims;
  }
  const current = splitCsv(claims[claimKey]);
  const next = Array.from(new Set([...current, ...references].map((item) => asTrimmedString(item)).filter(Boolean)));
  return {
    ...claims,
    [claimKey]: next.join(','),
  };
}

export function detectClaimsResourceType(claims: BundleDocumentClaims): string | undefined {
  const keys = Object.keys(claims || {});
  if (keys.some((key) => key.startsWith('MedicationStatement.'))) return ResourceTypesFhirR4.MedicationStatement;
  if (keys.some((key) => key.startsWith('AllergyIntolerance.'))) return ResourceTypesFhirR4.AllergyIntolerance;
  if (keys.some((key) => key.startsWith('Condition.'))) return ResourceTypesFhirR4.Condition;
  if (keys.some((key) => key.startsWith('DocumentReference.'))) return ResourceTypesFhirR4.DocumentReference;
  const firstContextualized = keys
    .map((key) => getSimpleClaimAttributeName(key))
    .find((key) => key.includes('.'));
  if (firstContextualized) {
    return firstContextualized.split('.')[0];
  }
  return undefined;
}

export function convertClaimsToFhirResource(
  claims: BundleDocumentClaims,
  version: 'r4' = 'r4',
): FhirResource {
  void version;
  const flatClaims = claimsToFlatStrings(claims);
  const resourceType = detectClaimsResourceType(claims);
  const resource = convertClaimsToFhirResourceByType(flatClaims, resourceType);
  const language = resourceType ? asTrimmedString(flatClaims[`${resourceType}.language`]) : '';
  return language ? { ...resource, language } : resource;
}

function convertClaimsToFhirResourceByType(
  flatClaims: FlatClaims,
  resourceType: string | undefined,
): FhirResource {
  switch (resourceType) {
    case ResourceTypesFhirR4.MedicationStatement:
      return medicationStatementFlatToFhirR4(flatClaims);
    case ResourceTypesFhirR4.AllergyIntolerance:
      return allergyIntoleranceFlatToFhirR4(flatClaims);
    case ResourceTypesFhirR4.Condition:
      return conditionFlatToFhirR4(flatClaims);
    case ResourceTypesFhirR4.DocumentReference:
      return documentReferenceFlatToFhirR4(flatClaims);
    case 'Immunization':
      return immunizationFlatToFhirR4(flatClaims);
    case 'Location':
      return locationFlatToFhirR4(flatClaims);
    case 'Observation':
      return observationFromFlatToFhirR4(flatClaims);
    case 'Organization':
      return organizationFlatToFhirR4(flatClaims);
    case 'Procedure':
      return procedureFlatToFhirR4(flatClaims);
    case 'Device':
      return deviceFlatToFhirR4(flatClaims);
    case 'Flag':
      return flagFlatToFhirR4(flatClaims);
    case 'CarePlan':
      return carePlanFlatToFhirR4(flatClaims);
    case 'DiagnosticReport':
      return diagnosticReportFlatToFhirR4(flatClaims);
    case 'Composition':
      return compositionFlatToFhirR4(flatClaims);
    case 'Appointment':
      return appointmentFlatToFhirR4(flatClaims);
    case 'Encounter':
      return encounterFlatToFhirR4(flatClaims);
    case 'RelatedPerson':
      return relatedPersonFlatToFhirR4(flatClaims);
    case 'Coverage':
      return coverageFlatToFhirR4(flatClaims);
    case 'ClinicalImpression':
      return clinicalImpressionFlatToFhirR4(flatClaims);
    case ResourceTypesFhirR4.Consent:
      return consentFlatToFhirR4(flatClaims);
    case ResourceTypesFhirR4.PractitionerRole:
      return practitionerRoleFlatToFhirR4(flatClaims);
    default:
      return flatClaimsToFhirResource(flatClaims);
  }
}

/**
 * Extracts one flat-claims object per resource from a FHIR `Bundle document`.
 *
 * Existing `resource.meta.claims` projections are preserved when present.
 * Otherwise the function falls back to a generic structural flattening so
 * unsupported resource types can still be reviewed and later regenerated.
 *
 * By design this helper currently skips demographic/actor resources that are
 * not yet part of the clinical claims-first pipeline:
 * `Composition`, `Patient`, `Practitioner`, `PractitionerRole`.
 */
export function extractBundleDocumentClaimsList(
  bundle: Record<string, any>,
  context: string = 'org.hl7.fhir.r4',
): BundleDocumentClaims[] {
  const entries = Array.isArray(bundle?.entry) ? bundle.entry : [];
  const ignoredResourceTypes = new Set<string>([
    ResourceTypesFhirR4.Composition,
    'Patient',
    'Practitioner',
    'PractitionerRole',
  ]);
  return entries
    .map((entry) => entry?.resource)
    .filter((resource) => resource && typeof resource === 'object')
    .filter((resource) => !ignoredResourceTypes.has(String(resource.resourceType || '')))
    .flatMap((resource) => {
      const resourceRecord = resource as Record<string, any>;
      const resourceReference = `${asTrimmedString(resourceRecord.resourceType)}/${asTrimmedString(resourceRecord.id)}`;
      const metaClaims = resourceRecord?.meta?.claims;
      const baseClaims = metaClaims && typeof metaClaims === 'object' && !Array.isArray(metaClaims)
        ? ensureClaimsIdentifier({ ...metaClaims }, resourceRecord)
        : ensureClaimsIdentifier(
          convertFhirResourceToClaims(resourceRecord as FhirResource, context),
          resourceRecord,
        );

      const containedResources = Array.isArray(resourceRecord.contained)
        ? (resourceRecord.contained as Array<Record<string, unknown>>)
        : [];

      const containedClaimsList = containedResources.map((containedResource, index) => {
        const containedMetaClaims = ((containedResource?.meta as Record<string, unknown> | undefined)?.claims);
        const containedClaims = containedMetaClaims && typeof containedMetaClaims === 'object' && !Array.isArray(containedMetaClaims)
          ? ensureClaimsIdentifier({ ...containedMetaClaims }, containedResource)
          : ensureClaimsIdentifier(
            convertFhirResourceToClaims(containedResource as FhirResource, context),
            containedResource,
          );
        const containedResourceType = asTrimmedString(containedResource.resourceType);
        const containedFlagClaimKey = resolveContainedFlagClaimKey(containedResourceType);
        const containedParentReferenceClaimKey = resolveContainedParentReferenceClaimKey(containedResourceType);
        return {
          ...containedClaims,
          ...(containedFlagClaimKey ? { [containedFlagClaimKey]: true } : {}),
          ...(containedParentReferenceClaimKey ? { [containedParentReferenceClaimKey]: resourceReference } : {}),
          ...(asTrimmedString(containedResource.id) ? {} : {
            [`${containedResource.resourceType}.identifier`]: `${resourceReference}#contained-${index + 1}`,
          }),
        };
      });

      const containedReferences = containedResources
        .map((containedResource, index) => {
          const containedType = asTrimmedString(containedResource.resourceType);
          const containedId = asTrimmedString(containedResource.id) || `${resourceReference}#contained-${index + 1}`;
          if (!containedType || !containedId) {
            return '';
          }
          return `${containedType}/${containedId}`;
        })
        .filter(Boolean);

      return [
        mergeContainedResourceReferenceList(baseClaims, containedReferences),
        ...containedClaimsList,
      ];
    });
}

export function resolveClaimsSectionList(claims: BundleDocumentClaims): string[] {
  const values: string[] = [];
  for (const [key, value] of Object.entries(claims || {})) {
    const normalized = String(key || '').toLowerCase();
    if (
      normalized.endsWith('.category')
      || normalized.endsWith('.section')
      || normalized.endsWith('.action')
    ) {
      values.push(...splitCsv(value));
    }
  }
  return Array.from(new Set(values));
}

export function buildBundleDocumentFromClaims(
  input: BuildBundleDocumentFromClaimsInput,
): Record<string, unknown> {
  const compositionClaims = { ...(input.compositionClaims || {}) };
  const compositionType = asTrimmedString(input.compositionType || compositionClaims[CompositionClaim.Type]) || 'http://loinc.org|60591-5';
  const compositionSubject = asTrimmedString(input.subjectDid || compositionClaims[CompositionClaim.Subject]);
  const compositionIdentifier = asTrimmedString(compositionClaims[CompositionClaim.Identifier]);
  const compositionTitle = asTrimmedString(compositionClaims[CompositionClaim.Title]);
  const compositionDate = asTrimmedString(compositionClaims[CompositionClaim.Date]);
  const compositionAuthorList = splitCsv(compositionClaims[CompositionClaim.Author]);
  const compositionSections = new Map<string, { code: { coding: Array<{ code: string; system?: string }> }; entry: Array<{ reference: string }> }>();
  const visibleEntries: Array<{ resource: Record<string, unknown> }> = [];
  const resourceByReference = new Map<string, Record<string, unknown>>();
  const containedChildrenByParentReference = new Map<string, Array<Record<string, unknown>>>();

  input.claimsList.forEach((claims, index) => {
    const resource = convertClaimsToFhirResource(claims);
    resource.meta = {
      ...(typeof resource.meta === 'object' && resource.meta ? resource.meta : {}),
      claims: { ...claims },
    };
    ensureResourceIdentifier(resource, claims, index);
    const resourceReference = `${resource.resourceType}/${asTrimmedString(resource.id)}`;
    const containedFlagClaimKey = resolveContainedFlagClaimKey(resource.resourceType);
    const containedParentReferenceClaimKey = resolveContainedParentReferenceClaimKey(resource.resourceType);
    const isContained = containedFlagClaimKey
      ? (claims[containedFlagClaimKey] === true || claims[containedFlagClaimKey] === 'true')
      : false;
    const containedParentReference = containedParentReferenceClaimKey
      ? asTrimmedString(claims[containedParentReferenceClaimKey])
      : '';

    if (isContained && containedParentReference) {
      const currentChildren = containedChildrenByParentReference.get(containedParentReference) || [];
      containedChildrenByParentReference.set(containedParentReference, [...currentChildren, resource]);
      return;
    }

    visibleEntries.push({ resource });
    resourceByReference.set(resourceReference, resource);

    const resourceRef = resourceReference;
    resolveClaimsSectionList(claims).forEach((sectionValue) => {
      const normalizedSection = asTrimmedString(sectionValue);
      if (!normalizedSection) return;
      const section = compositionSections.get(normalizedSection) || {
        code: {
          coding: [normalizeSectionCode(normalizedSection)],
        },
        entry: [],
      };
      if (!section.entry.some((item) => item.reference === resourceRef)) {
        section.entry.push({ reference: resourceRef });
      }
      compositionSections.set(normalizedSection, section);
    });
  });

  containedChildrenByParentReference.forEach((children, parentReference) => {
    const parent = resourceByReference.get(parentReference);
    if (!parent) {
      return;
    }
    parent.contained = [...(Array.isArray(parent.contained) ? parent.contained : []), ...children];
  });

  const [compositionSystem, compositionCode] = compositionType.split('|');
  return {
    resourceType: ResourceTypesFhirR4.Bundle,
    type: 'document',
    entry: [
      {
        resource: {
          resourceType: ResourceTypesFhirR4.Composition,
          ...(compositionIdentifier ? { id: compositionIdentifier } : {}),
          status: 'final',
          ...(compositionIdentifier ? {
            identifier: [{ value: compositionIdentifier }],
          } : {}),
          ...(compositionSubject ? {
            subject: { reference: compositionSubject },
          } : {}),
          type: {
            coding: [
              compositionCode
                ? { system: compositionSystem, code: compositionCode }
                : { code: compositionSystem },
            ],
          },
          ...(compositionTitle ? { title: compositionTitle } : {}),
          ...(compositionDate ? { date: compositionDate } : {}),
          ...(compositionAuthorList.length > 0 ? {
            author: compositionAuthorList.map((reference) => ({ reference })),
          } : {}),
          meta: { claims: compositionClaims },
          section: Array.from(compositionSections.values()),
        },
      },
      ...(compositionSubject
        ? [{
          resource: {
            resourceType: 'Patient',
            id: compositionSubject,
          },
        }]
        : []),
      ...visibleEntries,
    ],
  };
}

export function validateBundleDocumentBasic(bundle: Record<string, unknown>): ValidateBundleDocumentResult {
  const issues: string[] = [];
  if (bundle?.resourceType !== ResourceTypesFhirR4.Bundle) {
    issues.push('Bundle.resourceType must be Bundle.');
  }
  if (bundle?.type !== 'document') {
    issues.push('Bundle.type must be document.');
  }
  const entries = Array.isArray(bundle?.entry) ? bundle.entry : [];
  if (entries.length === 0) {
    issues.push('Bundle.entry must contain at least one entry.');
  }
  if (entries[0]?.resource?.resourceType !== ResourceTypesFhirR4.Composition) {
    issues.push('Bundle.entry[0].resource must be Composition.');
  }
  return {
    ok: issues.length === 0,
    issues,
  };
}

export function getBundleDocumentResources(
  bundle: Record<string, any>,
  filter: BundleDocumentResourceFilter = {},
): Record<string, any>[] {
  const entries = Array.isArray(bundle?.entry) ? bundle.entry : [];
  const resources = entries
    .map((entry) => entry?.resource)
    .filter((resource) => resource && typeof resource === 'object');

  if (!filter.section && !filter.resourceType) {
    return resources;
  }

  let allowedRefs: Set<string> | undefined;
  if (filter.section) {
    const composition = resources.find((resource) => resource.resourceType === ResourceTypesFhirR4.Composition);
    const sections = Array.isArray(composition?.section) ? composition.section : [];
    const wanted = normalizeSectionCode(filter.section).code.toLowerCase();
    allowedRefs = new Set<string>();
    sections.forEach((section: Record<string, any>) => {
      const code = section?.code?.coding?.[0]?.code;
      if (String(code || '').trim().toLowerCase() !== wanted) return;
      const refs = Array.isArray(section?.entry) ? section.entry : [];
      refs.forEach((item: Record<string, any>) => {
        const reference = asTrimmedString(item?.reference);
        if (!reference) return;
        allowedRefs!.add(reference);
        allowedRefs!.add(reference.split('/').pop() || reference);
      });
    });
  }

  return resources.filter((resource) => {
    if (filter.resourceType && resource.resourceType !== filter.resourceType) {
      return false;
    }
    if (!allowedRefs) {
      return true;
    }
    const resourceId = asTrimmedString(resource.id);
    const fullRef = `${resource.resourceType}/${resourceId}`;
    return allowedRefs.has(resourceId) || allowedRefs.has(fullRef);
  });
}

export function getBundleDocumentResourceIds(
  bundle: Record<string, any>,
  filter: BundleDocumentResourceFilter = {},
): string[] {
  return getBundleDocumentResources(bundle, filter)
    .map((resource) => asTrimmedString(resource.id) || extractFlatClaimValue(resource, `${resource.resourceType}.identifier`))
    .filter(Boolean);
}
