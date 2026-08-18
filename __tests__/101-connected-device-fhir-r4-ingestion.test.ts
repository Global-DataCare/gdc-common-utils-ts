import {
  buildConnectedDeviceFhirR4Bundle,
  normalizeConnectedDeviceFhirR4Bundle,
} from '../src/utils/connected-device-fhir-r4';
import { ObservationClaim } from '../src/models/interoperable-claims/observation-claims';
import { DeviceClaim } from '../src/models/interoperable-claims/device-claims';

describe('101: connected-device FHIR R4 ingestion for human and animal subjects', () => {
  it.each(['animal', 'person'] as const)(
    'builds and normalizes one %s measurement without changing the claims-first store',
    (subjectKind) => {
      // Teaching goal:
      // - a manufacturer sends standard FHIR R4 Patient, Device, Observation
      //   and Provenance resources;
      // - Patient is only the FHIR wire projection for either an animal or a
      //   human Subject;
      // - the receiver validates exact card identity and converts Device plus
      //   Observation into registered flat claims before indexing.

      // Step 1. Build the transaction a US FHIR clinic or device platform can send.
      const subjectIdentifier = subjectKind === 'animal'
        ? 'did:web:animal-card.example:subject:1'
        : 'did:web:person-card.example:subject:1';
      const bundle = buildConnectedDeviceFhirR4Bundle({
        subjectKind,
        subjectIdentifierSystem: 'https://identity.example/fhir/sid/card',
        subjectIdentifier,
        subjectResourceId: 'subject-1',
        ...(subjectKind === 'animal' ? {
          animalSpecies: { system: 'http://purl.obolibrary.org/obo/ncbitaxon.owl', code: '9615', display: 'Canis lupus familiaris' },
        } : {}),
        organizationReference: 'Organization/manufacturer-1',
        device: {
          id: 'device-1',
          identifierSystem: 'https://devices.example.com/serial',
          identifierValue: 'SMART-COLLAR-0001',
          manufacturer: 'Example Devices',
          modelNumber: 'Collar One',
        },
        observations: [{
          id: 'observation-1',
          identifierSystem: 'https://devices.example.com/measurement',
          identifierValue: 'measurement-0001',
          status: 'final',
          codeSystem: 'http://loinc.org',
          code: '8867-4',
          display: 'Heart rate',
          effectiveDateTime: '2026-08-16T12:00:00Z',
          value: 92,
          unit: '/min',
          unitSystem: 'http://unitsofmeasure.org',
          unitCode: '/min',
        }],
      });

      // Step 2. Validate all cross-resource references and normalize to the
      // registered claims used by subject-centric storage and indexing.
      const normalized = normalizeConnectedDeviceFhirR4Bundle(bundle, {
        expectedSubjectIdentifier: subjectIdentifier,
        expectedSubjectIdentifierSystem: 'https://identity.example/fhir/sid/card',
        expectedSubjectKind: subjectKind,
      });

      // Step 3. Prove that the persisted values are flat scalar claims; the
      // nested FHIR JSON remains the wire/audit representation only.
      expect(normalized.subjectIdentifier).toBe(subjectIdentifier);
      expect(normalized.device.claims[DeviceClaim.Identifier]).toBe('SMART-COLLAR-0001');
      expect(normalized.observations[0].claims).toEqual(expect.objectContaining({
        [ObservationClaim.Identifier]: 'measurement-0001',
        [ObservationClaim.Subject]: 'Patient/subject-1',
        [ObservationClaim.Device]: 'Device/device-1',
        [ObservationClaim.CodeSystem]: 'http://loinc.org',
        [ObservationClaim.CodeValue]: '8867-4',
        [ObservationClaim.ValueQuantityNumber]: '92',
      }));
      expect(Object.values(normalized.observations[0].claims)
        .every((value) => typeof value === 'string')).toBe(true);
    },
  );

  it('rejects a measurement not covered by Provenance', () => {
    const bundle = buildConnectedDeviceFhirR4Bundle({
      subjectKind: 'animal',
      subjectIdentifierSystem: 'https://identity.example/fhir/sid/card',
      subjectIdentifier: 'did:web:animal-card.example:subject:1',
      subjectResourceId: 'subject-1',
      animalSpecies: { system: 'http://purl.obolibrary.org/obo/ncbitaxon.owl', code: '9615' },
      organizationReference: 'Organization/manufacturer-1',
      device: {
        id: 'device-1', identifierSystem: 'https://devices.example.com/serial', identifierValue: 'DEVICE-1',
      },
      observations: [{
        id: 'observation-1', identifierSystem: 'https://devices.example.com/measurement', identifierValue: 'M-1',
        status: 'final', codeSystem: 'http://loinc.org', code: '8867-4', effectiveDateTime: '2026-08-16T12:00:00Z',
        value: 92, unit: '/min', unitSystem: 'http://unitsofmeasure.org', unitCode: '/min',
      }],
    });
    const provenance = bundle.entry.find((entry) => entry.resource.resourceType === 'Provenance')!;
    (provenance.resource as Record<string, unknown>).target = [];

    expect(() => normalizeConnectedDeviceFhirR4Bundle(bundle, {
      expectedSubjectIdentifier: 'did:web:animal-card.example:subject:1',
      expectedSubjectIdentifierSystem: 'https://identity.example/fhir/sid/card',
      expectedSubjectKind: 'animal',
    })).toThrow('Provenance');
  });

  it('rejects a measurement addressed to another subject card', () => {
    const bundle = buildConnectedDeviceFhirR4Bundle({
      subjectKind: 'person',
      subjectIdentifierSystem: 'https://identity.example/fhir/sid/card',
      subjectIdentifier: 'did:web:person-card.example:subject:1',
      subjectResourceId: 'subject-1',
      organizationReference: 'Organization/manufacturer-1',
      device: { id: 'device-1', identifierSystem: 'https://devices.example.com/serial', identifierValue: 'DEVICE-1' },
      observations: [{
        id: 'observation-1', identifierSystem: 'https://devices.example.com/measurement', identifierValue: 'M-1',
        status: 'final', codeSystem: 'http://loinc.org', code: '8867-4', effectiveDateTime: '2026-08-16T12:00:00Z',
        value: 70, unit: '/min', unitSystem: 'http://unitsofmeasure.org', unitCode: '/min',
      }],
    });

    expect(() => normalizeConnectedDeviceFhirR4Bundle(bundle, {
      expectedSubjectIdentifier: 'did:web:person-card.example:subject:another',
      expectedSubjectIdentifierSystem: 'https://identity.example/fhir/sid/card',
      expectedSubjectKind: 'person',
    })).toThrow('exact authorized subject identifier');
  });
});
