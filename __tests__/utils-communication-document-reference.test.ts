// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims.js';
import {
  buildBlockchainArtifactDocumentReference,
  buildDocumentReferenceFromCommunicationPayload,
  detectAttachmentKind,
} from '../src/utils/communication-document-reference.js';

describe('communication-document-reference utilities', () => {
  // Good practice note:
  // reusable `Communication.*` claim keys in test fixtures must come from
  // `CommunicationClaim`.
  it('detects attachment kinds for fhir/pdf/png/jpg', () => {
    expect(detectAttachmentKind('application/fhir+json')).toBe('fhir');
    expect(detectAttachmentKind('application/pdf')).toBe('pdf');
    expect(detectAttachmentKind('image/png')).toBe('png');
    expect(detectAttachmentKind('image/jpeg')).toBe('jpg');
  });

  it('builds DocumentReference from FHIR attachment and computes CID if missing', () => {
    const patient = {
      resourceType: 'Patient',
      id: 'p-1',
      meta: { versionId: 'old' },
      name: [{ family: 'Lopez', given: ['Ana'] }],
    };
    const data = Buffer.from(JSON.stringify(patient), 'utf8').toString('base64');

    const communication = {
      resourceType: 'Communication',
      payload: [{ contentAttachment: { contentType: 'application/fhir+json', data, title: 'patient.json' } }],
      meta: { claims: { [CommunicationClaim.Subject]: 'did:web:example.com:patient:1' } },
    };

    const result = buildDocumentReferenceFromCommunicationPayload(communication, { mode: 'strict' });

    expect(result.contentCid.startsWith('z')).toBe(true);
    expect(result.documentReference.resourceType).toBe('DocumentReference');
    expect(result.documentReference.meta?.versionId).toBe(result.contentCid);
    expect(result.documentReference.content?.[0]?.attachment?.contentType).toBe('application/fhir+json');
    expect(result.documentReference.subject?.reference).toBe('did:web:example.com:patient:1');
    expect(result.evidence[0].type).toContain('electronic_record');
  });

  it('preserves attachment.id as CID when valid', () => {
    const data = Buffer.from('fake-pdf-content', 'utf8').toString('base64');
    const cid = 'zb2rhfJk6M9MHiMagUhM6YJ6R7Sx9nN2m7r8cfDkQ2uYbGxZq';
    const communication = {
      resourceType: 'Communication',
      payload: [{ contentAttachment: { id: cid, contentType: 'application/pdf', data, title: 'report.pdf' } }],
      meta: { claims: { [CommunicationClaim.Subject]: 'did:web:example.com:patient:2' } },
    };

    const result = buildDocumentReferenceFromCommunicationPayload(communication, { mode: 'strict' });
    expect(result.contentCid).toBe(cid);
    expect(result.documentReference.meta?.versionId).toBe(cid);
  });

  it('fails in strict mode when payload is missing', () => {
    expect(() => buildDocumentReferenceFromCommunicationPayload({ resourceType: 'Communication' }, { mode: 'strict' })).toThrow(
      'Communication payload with contentAttachment is required.',
    );
  });

  it('normalizes in normalize mode when contentType missing', () => {
    const data = Buffer.from('bytes', 'utf8').toString('base64');
    const communication = {
      resourceType: 'Communication',
      payload: [{ contentAttachment: { data } }],
    };

    const result = buildDocumentReferenceFromCommunicationPayload(communication, { mode: 'normalize' });
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.documentReference.content?.[0]?.attachment?.contentType).toBe('application/octet-stream');
  });

  it('builds a blockchain-ready DocumentReference for a FHIR resource and keeps the logical identifier separate', () => {
    const result = buildBlockchainArtifactDocumentReference({
      subject: 'did:web:example.com:subject:1',
      identifier: 'resource-logical-id-001',
      resource: {
        resourceType: 'Observation',
        id: 'obs-1',
        status: 'final',
        code: { text: 'Heart rate' },
      },
    });

    expect(result.contentCid.startsWith('z')).toBe(true);
    expect(result.documentReference.meta?.versionId).toBe(result.contentCid);
    expect(result.documentReference.identifier?.[0]?.value).toBe('resource-logical-id-001');
    expect(result.documentReference.meta?.claims?.['DocumentReference.contenthash']).toBe(result.contentCid);
    expect(result.documentReference.meta?.claims?.['DocumentReference.identifier']).toBe('resource-logical-id-001');
    expect(result.documentReference.meta?.claims?.['DocumentReference.subject']).toBe('did:web:example.com:subject:1');
  });

  it('builds a blockchain-ready DocumentReference for raw PDF bytes', () => {
    const dataBase64 = Buffer.from('%PDF-1.4', 'utf8').toString('base64');
    const result = buildBlockchainArtifactDocumentReference({
      subject: 'did:web:example.com:subject:2',
      contentType: 'application/pdf',
      contentDataBase64: dataBase64,
      title: 'report.pdf',
    });

    expect(result.contentCid.startsWith('z')).toBe(true);
    expect(result.documentReference.content?.[0]?.attachment?.contentType).toBe('application/pdf');
    expect(result.documentReference.content?.[0]?.attachment?.hash).toBe(result.contentCid);
    expect(result.documentReference.identifier?.[0]?.value).toBe(result.contentCid);
    expect(result.documentReference.meta?.claims?.['DocumentReference.contentdata']).toBe(dataBase64);
  });
});
