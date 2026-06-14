import {
  buildExampleConfidentialBlobInfo,
  buildExampleConfidentialJwe,
  buildExampleConfidentialStorageDoc,
} from '../src/utils/confidential-storage-test-data';

describe('confidential-storage-test-data', () => {
  it('builds a canonical confidential storage document with inline jwe by default', () => {
    const doc = buildExampleConfidentialStorageDoc();

    expect(doc).toMatchObject({
      id: 'doc-1',
      status: 'active',
      sequence: 0,
      jwe: buildExampleConfidentialJwe(),
    });
    expect(doc.indexed?.attributes).toHaveLength(2);
  });

  it('allows callers to override only the relevant fields', () => {
    const doc = buildExampleConfidentialStorageDoc({
      id: 'doc-2',
      blob: buildExampleConfidentialBlobInfo(),
      jwe: undefined,
    });

    expect(doc.id).toBe('doc-2');
    expect(doc.blob?.blobRef).toBe('zQmExampleBlobRefForEncryptedPayload');
    expect(doc.jwe).toBeUndefined();
  });
});
