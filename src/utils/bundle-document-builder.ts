import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import {
  allergyIntoleranceFlatToFhirR4,
  appointmentFlatToFhirR4,
  carePlanFlatToFhirR4,
  clinicalImpressionFlatToFhirR4,
  compositionFlatToFhirR4,
  conditionFlatToFhirR4,
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
  relatedPersonFlatToFhirR4,
  type FhirResource,
  type FlatClaims,
} from './clinical-resource-converters';

export type BundleDocumentClaims = Readonly<Record<string, unknown>>;

export type BuildBundleDocumentFromClaimsInput = Readonly<{
  claimsList: readonly BundleDocumentClaims[];
  subjectDid?: string;
  compositionType?: string;
}>;

export type ValidateBundleDocumentResult = Readonly<{
  ok: boolean;
  issues: string[];
}>;

export type BundleDocumentResourceFilter = Readonly<{
  section?: string;
  resourceType?: string;
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
    if (value === undefined || value === null) continue;
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
    .map((resource) => {
      const metaClaims = resource?.meta?.claims;
      if (metaClaims && typeof metaClaims === 'object' && !Array.isArray(metaClaims)) {
        return ensureClaimsIdentifier({ ...metaClaims }, resource);
      }
      return ensureClaimsIdentifier(
        convertFhirResourceToClaims(resource as FhirResource, context),
        resource,
      );
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
  const compositionType = asTrimmedString(input.compositionType) || 'http://loinc.org|60591-5';
  const compositionSections = new Map<string, { code: { coding: Array<{ code: string; system?: string }> }; entry: Array<{ reference: string }> }>();
  const entries: Array<{ resource: Record<string, unknown> }> = [];

  input.claimsList.forEach((claims, index) => {
    const resource = convertClaimsToFhirResource(claims);
    resource.meta = {
      ...(typeof resource.meta === 'object' && resource.meta ? resource.meta : {}),
      claims: { ...claims },
    };
    ensureResourceIdentifier(resource, claims, index);
    entries.push({ resource });

    const resourceRef = `${resource.resourceType}/${resource.id}`;
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

  const [compositionSystem, compositionCode] = compositionType.split('|');
  return {
    resourceType: ResourceTypesFhirR4.Bundle,
    type: 'document',
    entry: [
      {
        resource: {
          resourceType: ResourceTypesFhirR4.Composition,
          status: 'final',
          subject: input.subjectDid ? { reference: input.subjectDid } : undefined,
          type: {
            coding: [
              compositionCode
                ? { system: compositionSystem, code: compositionCode }
                : { code: compositionSystem },
            ],
          },
          section: Array.from(compositionSections.values()),
        },
      },
      ...(input.subjectDid
        ? [{
          resource: {
            resourceType: 'Patient',
            id: input.subjectDid,
          },
        }]
        : []),
      ...entries,
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
