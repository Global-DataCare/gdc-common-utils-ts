import { deviceFhirR4ToFlat } from '../convert/convert-device';
import { observationToFlatFhirR4 } from '../convert/convert-observation';
import type { FhirResource, FlatClaims } from '../convert/convert-shared';

export const FHIR_R4_PATIENT_ANIMAL_EXTENSION_URL = 'http://hl7.org/fhir/StructureDefinition/patient-animal';

export type ConnectedDeviceSubjectKind = 'animal' | 'person';

export type ConnectedDeviceFhirR4Bundle = Readonly<{
  resourceType: 'Bundle';
  type: 'transaction';
  entry: Array<{
    fullUrl?: string;
    resource: FhirResource;
    request: { method: 'PUT'; url: string };
  }>;
}>;

export type ConnectedDeviceObservationInput = Readonly<{
  id: string;
  identifierSystem: string;
  identifierValue: string;
  status: 'final' | 'amended' | 'corrected';
  codeSystem: string;
  code: string;
  display?: string;
  effectiveDateTime: string;
  value: number;
  unit: string;
  unitSystem: string;
  unitCode: string;
}>;

export type BuildConnectedDeviceFhirR4BundleInput = Readonly<{
  subjectKind: ConnectedDeviceSubjectKind;
  subjectIdentifierSystem: string;
  subjectIdentifier: string;
  subjectResourceId: string;
  animalSpecies?: Readonly<{ system: string; code: string; display?: string }>;
  organizationReference: string;
  device: Readonly<{
    id: string;
    identifierSystem: string;
    identifierValue: string;
    manufacturer?: string;
    modelNumber?: string;
  }>;
  observations: readonly ConnectedDeviceObservationInput[];
}>;

export type NormalizedConnectedDeviceFhirR4Bundle = Readonly<{
  subjectIdentifier: string;
  subjectKind: ConnectedDeviceSubjectKind;
  device: Readonly<{ resource: FhirResource; claims: Readonly<Record<string, string>> }>;
  observations: readonly Readonly<{ resource: FhirResource; claims: Readonly<Record<string, string>> }>[];
  provenance: readonly FhirResource[];
  sourceBundle: ConnectedDeviceFhirR4Bundle;
}>;

/**
 * Builds the minimum FHIR R4 transaction accepted from a device manufacturer
 * or clinic. `Patient` is the interoperable wire resource for either subject
 * kind; it does not replace the internal neutral Subject model.
 */
export function buildConnectedDeviceFhirR4Bundle(
  input: BuildConnectedDeviceFhirR4BundleInput,
): ConnectedDeviceFhirR4Bundle {
  assertStableIdentifier(input.subjectIdentifier, 'subjectIdentifier');
  assertStableIdentifier(input.subjectIdentifierSystem, 'subjectIdentifierSystem');
  assertId(input.subjectResourceId, 'subjectResourceId');
  assertReference(input.organizationReference, 'organizationReference');
  assertId(input.device.id, 'device.id');
  if (!input.device.identifierSystem.trim() || !input.device.identifierValue.trim()) {
    throw new Error('Connected Device requires identifier system and value.');
  }
  if (input.subjectKind === 'animal' && (!input.animalSpecies?.system.trim() || !input.animalSpecies.code.trim())) {
    throw new Error('Animal FHIR Patient projection requires patient-animal species coding.');
  }
  if (input.observations.length === 0) throw new Error('Connected Device bundle requires at least one Observation.');

  const patientReference = `Patient/${input.subjectResourceId}`;
  const deviceReference = `Device/${input.device.id}`;
  const patient: FhirResource = {
    resourceType: 'Patient',
    id: input.subjectResourceId,
    identifier: [{ system: input.subjectIdentifierSystem, value: input.subjectIdentifier }],
    ...(input.subjectKind === 'animal'
      ? {
          extension: [{
            url: FHIR_R4_PATIENT_ANIMAL_EXTENSION_URL,
            extension: [{
              url: 'species',
              valueCodeableConcept: { coding: [{ ...input.animalSpecies }] },
            }],
          }],
        }
      : {}),
  };
  const device: FhirResource = {
    resourceType: 'Device',
    id: input.device.id,
    identifier: [{ system: input.device.identifierSystem, value: input.device.identifierValue }],
    status: 'active',
    patient: { reference: patientReference },
    owner: { reference: input.organizationReference },
    ...(input.device.manufacturer ? { manufacturer: input.device.manufacturer } : {}),
    ...(input.device.modelNumber ? { modelNumber: input.device.modelNumber } : {}),
  };
  const observations = input.observations.map((observation) => buildObservation(
    observation,
    patientReference,
    deviceReference,
    input.organizationReference,
  ));
  const provenance: FhirResource = {
    resourceType: 'Provenance',
    id: 'device-measurement-provenance',
    target: observations.map((observation) => ({ reference: `Observation/${String(observation.id)}` })),
    recorded: input.observations.map((observation) => observation.effectiveDateTime).sort().at(-1),
    agent: [{ type: { text: 'author' }, who: { reference: input.organizationReference } }],
    entity: [{ role: 'source', what: { reference: deviceReference } }],
  };
  const resources = [patient, device, ...observations, provenance];
  return {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: resources.map((resource) => ({
      resource,
      request: { method: 'PUT', url: `${resource.resourceType}/${String(resource.id)}` },
    })),
  };
}

/**
 * Validates exact subject, Device, Observation and Provenance references, then
 * projects registered clinical resources into scalar flat claims. Consent and
 * SMART checks remain gateway responsibilities and must run before indexing.
 */
export function normalizeConnectedDeviceFhirR4Bundle(
  bundle: ConnectedDeviceFhirR4Bundle,
  options: Readonly<{
    expectedSubjectIdentifier: string;
    expectedSubjectIdentifierSystem: string;
    expectedSubjectKind: ConnectedDeviceSubjectKind;
  }>,
): NormalizedConnectedDeviceFhirR4Bundle {
  if (bundle?.resourceType !== 'Bundle' || bundle.type !== 'transaction' || !Array.isArray(bundle.entry)) {
    throw new Error('Connected Device payload must be a FHIR R4 transaction Bundle.');
  }
  const resources = bundle.entry.map((entry) => entry.resource);
  const patient = requireExactlyOne(resources, 'Patient');
  const device = requireExactlyOne(resources, 'Device');
  const observations = resources.filter((resource) => resource.resourceType === 'Observation');
  const provenance = resources.filter((resource) => resource.resourceType === 'Provenance');
  if (observations.length === 0) throw new Error('Connected Device bundle requires at least one Observation.');
  if (provenance.length === 0) throw new Error('Connected Device bundle requires Provenance.');

  const subjectIdentifier = readIdentifierValue(
    patient,
    options.expectedSubjectIdentifier,
    options.expectedSubjectIdentifierSystem,
  );
  if (subjectIdentifier !== options.expectedSubjectIdentifier) {
    throw new Error('FHIR Patient does not identify the exact authorized subject identifier.');
  }
  const hasAnimalExtension = ((patient.extension as Array<{ url?: string }> | undefined) || [])
    .some((extension) => extension.url === FHIR_R4_PATIENT_ANIMAL_EXTENSION_URL);
  if ((options.expectedSubjectKind === 'animal') !== hasAnimalExtension) {
    throw new Error(`FHIR Patient subject kind does not match ${options.expectedSubjectKind}.`);
  }

  const patientReference = `Patient/${requiredResourceId(patient)}`;
  const deviceReference = `Device/${requiredResourceId(device)}`;
  if (referenceValue(device.patient) !== patientReference) {
    throw new Error('Device.patient must reference the exact FHIR Patient projection.');
  }
  readFirstIdentifier(device, 'Device');

  const provenanceTargets = new Set(provenance.flatMap((resource) =>
    ((resource.target as Array<{ reference?: string }> | undefined) || []).map((target) => String(target.reference || '').trim())));
  for (const resource of provenance) {
    const agents = (resource.agent as Array<{ who?: { reference?: string; identifier?: unknown } }> | undefined) || [];
    if (!agents.some((agent) => agent.who?.reference || agent.who?.identifier)) {
      throw new Error('Provenance requires an accountable agent.');
    }
  }

  const normalizedObservations = observations.map((observation) => {
    const observationReference = `Observation/${requiredResourceId(observation)}`;
    if (!provenanceTargets.has(observationReference)) {
      throw new Error(`Provenance does not cover ${observationReference}.`);
    }
    validateObservation(observation, patientReference, deviceReference);
    return { resource: observation, claims: scalarClaims(observationToFlatFhirR4(observation)) };
  });

  return {
    subjectIdentifier,
    subjectKind: options.expectedSubjectKind,
    device: { resource: device, claims: scalarClaims(deviceFhirR4ToFlat(device)) },
    observations: normalizedObservations,
    provenance,
    sourceBundle: bundle,
  };
}

function buildObservation(
  input: ConnectedDeviceObservationInput,
  patientReference: string,
  deviceReference: string,
  organizationReference: string,
): FhirResource {
  assertId(input.id, 'observation.id');
  if (!input.identifierSystem.trim() || !input.identifierValue.trim()) throw new Error('Observation identifier is required.');
  if (!input.codeSystem.trim() || !input.code.trim()) throw new Error('Observation code system and code are required.');
  if (!Number.isFinite(input.value)) throw new Error('Observation numeric value must be finite.');
  if (!Number.isFinite(Date.parse(input.effectiveDateTime))) throw new Error('Observation effectiveDateTime must be ISO 8601.');
  return {
    resourceType: 'Observation',
    id: input.id,
    identifier: [{ system: input.identifierSystem, value: input.identifierValue }],
    status: input.status,
    category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }] }],
    code: { coding: [{ system: input.codeSystem, code: input.code, ...(input.display ? { display: input.display } : {}) }] },
    subject: { reference: patientReference },
    device: { reference: deviceReference },
    performer: [{ reference: organizationReference }],
    effectiveDateTime: input.effectiveDateTime,
    valueQuantity: {
      value: input.value,
      unit: input.unit,
      system: input.unitSystem,
      code: input.unitCode,
    },
  };
}

function validateObservation(resource: FhirResource, patientReference: string, deviceReference: string): void {
  readFirstIdentifier(resource, 'Observation');
  if (referenceValue(resource.subject) !== patientReference) throw new Error('Observation.subject does not match the exact Patient.');
  if (referenceValue(resource.device) !== deviceReference) throw new Error('Observation.device does not match the registered Device.');
  const coding = (resource.code as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0];
  if (!coding?.system || !coding.code) throw new Error('Observation requires a coded measurement.');
  if (!resource.effectiveDateTime && !resource.issued) throw new Error('Observation requires an effective or issued time.');
  if (!resource.valueQuantity && !resource.valueCodeableConcept && resource.valueString === undefined) {
    throw new Error('Observation requires a value.');
  }
}

function requireExactlyOne(resources: readonly FhirResource[], resourceType: string): FhirResource {
  const matches = resources.filter((resource) => resource.resourceType === resourceType);
  if (matches.length !== 1) throw new Error(`Connected Device bundle requires exactly one ${resourceType}.`);
  return matches[0];
}

function readIdentifierValue(resource: FhirResource, expected: string, expectedSystem: string): string {
  const identifiers = (resource.identifier as Array<{ system?: string; value?: string }> | undefined) || [];
  return String(identifiers.find((identifier) =>
    identifier.system === expectedSystem && identifier.value === expected)?.value || '');
}

function readFirstIdentifier(resource: FhirResource, label: string): string {
  const value = String((resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value || '').trim();
  if (!value) throw new Error(`${label} requires a stable identifier for replay protection.`);
  return value;
}

function requiredResourceId(resource: FhirResource): string {
  const id = String(resource.id || '').trim();
  assertId(id, `${resource.resourceType}.id`);
  return id;
}

function referenceValue(value: unknown): string {
  return String((value as { reference?: string } | undefined)?.reference || '').trim();
}

function scalarClaims(claims: FlatClaims): Readonly<Record<string, string>> {
  return Object.freeze(Object.fromEntries(Object.entries(claims)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .map(([key, value]) => [key, String(value)])));
}

function assertStableIdentifier(value: string, field: string): void {
  if (!/^(?:did|urn|https):\S+$/i.test(String(value || '').trim())) throw new Error(`${field} must be a stable URI.`);
}

function assertReference(value: string, field: string): void {
  if (!/^[A-Z][A-Za-z]+\/[A-Za-z0-9.-]+$/.test(String(value || '').trim())) throw new Error(`${field} must be a FHIR reference.`);
}

function assertId(value: string, field: string): void {
  if (!/^[A-Za-z0-9.-]{1,64}$/.test(String(value || '').trim())) throw new Error(`${field} must be a valid FHIR id.`);
}
