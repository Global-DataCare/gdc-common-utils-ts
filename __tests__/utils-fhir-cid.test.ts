// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import { ClaimConsent } from '../src/models/consent-rule';
import {
  assignCidToClaimsId,
  assignCidToFhirBundleEntries,
  assignCidToFhirResourceVersionId,
  canonicalizeClaimsForContentHash,
  claimsToCid,
  claimsToContentCid,
  canonicalizeFhirResource,
  fhirResourceToCid,
} from '../src/utils/fhir-cid.js';

describe('fhir-cid utilities', () => {
  // Reusable consent claim keys must be imported from shared models, never duplicated inline in CID tests.
  it('canonicalizes recursively and strips meta.versionId by default', () => {
    const resource = {
      resourceType: 'Observation',
      id: '8f0f9f88-7a8e-42c4-b89a-a58d5d3ca2df',
      meta: { versionId: 'old', source: 'ehr' },
      code: { text: 'BP', coding: [{ code: '85354-9', system: 'http://loinc.org' }] },
    };

    const canonical = canonicalizeFhirResource(resource);
    expect(canonical).toContain('"source":"ehr"');
    expect(canonical).not.toContain('"versionId"');
  });

  it('generates deterministic CID for semantically identical resources with different key order', () => {
    const a = {
      resourceType: 'Patient',
      id: '68a78f38-7d7d-4f6e-b6ef-0d0066f8c241',
      meta: { versionId: 'previous', profile: ['http://hl7.org/fhir/StructureDefinition/Patient'] },
      name: [{ given: ['Ana'], family: 'Lopez' }],
    };
    const b = {
      name: [{ family: 'Lopez', given: ['Ana'] }],
      resourceType: 'Patient',
      id: '68a78f38-7d7d-4f6e-b6ef-0d0066f8c241',
      meta: { profile: ['http://hl7.org/fhir/StructureDefinition/Patient'], versionId: 'another' },
    };

    const cidA = fhirResourceToCid(a);
    const cidB = fhirResourceToCid(b);
    expect(cidA.cid).toBe(cidB.cid);
    expect(cidA.versionId).toBe(cidA.cid);
    expect(cidA.cid.startsWith('z')).toBe(true);
  });

  it('keeps resource.id unchanged and maps CID into meta.versionId', () => {
    const resource = {
      resourceType: 'DocumentReference',
      id: '8e4db04c-3536-4b03-a33a-69bb1f3729e7',
      meta: { source: 'portal' },
    };
    const assigned = assignCidToFhirResourceVersionId(resource);
    expect(assigned.resource.id).toBe(resource.id);
    expect((assigned.resource.meta as any).versionId).toBe(assigned.mapping.cid);
  });

  it('assigns CID versionIds across bundle entries and returns mappings', () => {
    const bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [
        {
          fullUrl: 'urn:uuid:11111111-1111-1111-1111-111111111111',
          resource: { resourceType: 'Patient', id: '11111111-1111-1111-1111-111111111111' },
        },
        {
          fullUrl: 'urn:uuid:22222222-2222-2222-2222-222222222222',
          resource: { resourceType: 'Observation', id: '22222222-2222-2222-2222-222222222222' },
        },
      ],
    };

    const result = assignCidToFhirBundleEntries(bundle);
    expect(result.mappings.length).toBe(2);
    expect(((result.bundle.entry as any[])[0].resource.meta.versionId).startsWith('z')).toBe(true);
    expect(result.mappings[0].fullUrl).toBe('urn:uuid:11111111-1111-1111-1111-111111111111');
  });

  it('generates claims CID excluding @context/@type/@id and writes claims.@id', () => {
    const claimsA = {
      '@context': 'org.hl7.fhir.api',
      '@type': 'Consent',
      '@id': 'old',
      [ClaimConsent.subject]: 'did:web:subject.example.com',
      [ClaimConsent.actorRole]: 'Practitioner',
    };
    const claimsB = {
      '@type': 'Consent',
      [ClaimConsent.actorRole]: 'Practitioner',
      [ClaimConsent.subject]: 'did:web:subject.example.com',
      '@context': 'org.hl7.fhir.api',
      '@id': 'another',
    };

    const cidA = claimsToCid(claimsA);
    const cidB = claimsToCid(claimsB);
    expect(cidA.cid).toBe(cidB.cid);
    expect(cidA.canonicalJson).not.toContain('@context');
    expect(cidA.canonicalJson).not.toContain('@type');
    expect(cidA.canonicalJson).not.toContain('@id');

    const assigned = assignCidToClaimsId(claimsA);
    expect(assigned.claims['@id']).toBe(assigned.cid);
    expect(String(assigned.cid).startsWith('z')).toBe(true);
  });

  it('canonicalizes content-hash claims without envelope, id, identifier, or version keys', () => {
    const canonicalJson = canonicalizeClaimsForContentHash({
      '@context': 'org.hl7.fhir.r4',
      '@type': 'Composition',
      '@id': 'old-jsonld-id',
      'Composition.id': 'composition-resource-id',
      'Composition.identifier': 'urn:uuid:composition-logical-id',
      'Composition.identifier.value': 'urn:uuid:composition-logical-id',
      'Composition.subject': 'did:web:subject.example.com',
      'Composition.section': 'http://loinc.org|10160-0',
      'Composition.type': 'http://loinc.org|60591-5',
      'Composition.meta.versionId': 'zold',
    });

    expect(canonicalJson).not.toContain('@context');
    expect(canonicalJson).not.toContain('@type');
    expect(canonicalJson).not.toContain('@id');
    expect(canonicalJson).not.toContain('Composition.id');
    expect(canonicalJson).not.toContain('Composition.identifier');
    expect(canonicalJson).not.toContain('versionId');
    expect(canonicalJson).toContain('Composition.subject');
    expect(canonicalJson).toContain('Composition.section');
  });

  it('generates the same content CID when only id and identifier differ', () => {
    const claimsA = {
      '@context': 'org.hl7.fhir.r4',
      'Composition.id': 'composition-a',
      'Composition.identifier': 'urn:uuid:composition-a',
      'Composition.subject': 'did:web:subject.example.com',
      'Composition.section': 'http://loinc.org|10160-0',
      'Composition.type': 'http://loinc.org|60591-5',
    };
    const claimsB = {
      '@context': 'org.hl7.fhir.r4',
      'Composition.id': 'composition-b',
      'Composition.identifier': 'urn:uuid:composition-b',
      'Composition.subject': 'did:web:subject.example.com',
      'Composition.section': 'http://loinc.org|10160-0',
      'Composition.type': 'http://loinc.org|60591-5',
    };

    const cidA = claimsToContentCid(claimsA);
    const cidB = claimsToContentCid(claimsB);
    expect(cidA.cid).toBe(cidB.cid);
    expect(cidA.digestHex).toBe(cidB.digestHex);
  });
});
