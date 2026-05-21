import {
  buildDocumentReferenceFromCommunicationPayload,
  detectAttachmentKind,
} from '../src/utils/communication-document-reference.js';

describe('communication-document-reference utilities', () => {
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
      meta: { claims: { 'Communication.subject': 'did:web:example.com:patient:1' } },
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
      meta: { claims: { 'Communication.subject': 'did:web:example.com:patient:2' } },
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
});
