import {
  CONFIDENTIAL_JWE_BLOB_CONTENT_TYPE,
  externalizeConfidentialStorageDocForPersistence,
  hydrateConfidentialStorageDocFromPersistence,
} from '../src/utils/confidential-storage-persistence';
import {
  buildExampleConfidentialBlobInfo,
  buildExampleConfidentialJwe,
  buildExampleConfidentialStorageDoc,
} from '../src/utils/confidential-storage-test-data';

describe('confidential-storage-persistence', () => {
  it('externalizes inline jwe to blob metadata and removes jwe from the persisted record', async () => {
    const document = buildExampleConfidentialStorageDoc();
    const put = jest.fn(async () => buildExampleConfidentialBlobInfo());

    const persisted = await externalizeConfidentialStorageDocForPersistence(document, {
      provider: 'gcs',
      put,
    });

    expect(put).toHaveBeenCalledTimes(1);
    expect(put).toHaveBeenCalledWith(
      expect.any(Uint8Array),
      CONFIDENTIAL_JWE_BLOB_CONTENT_TYPE,
    );
    expect(persisted.jwe).toBeUndefined();
    expect(persisted.blob).toEqual(buildExampleConfidentialBlobInfo());
  });

  it('hydrates persisted blob-backed records back into inline jwe shape', async () => {
    const jwe = buildExampleConfidentialJwe();
    const persistedDocument = buildExampleConfidentialStorageDoc({
      jwe: undefined,
      blob: buildExampleConfidentialBlobInfo(),
    });
    const get = jest.fn(async () => ({
      dataBytes: new TextEncoder().encode(JSON.stringify(jwe)),
      contentType: CONFIDENTIAL_JWE_BLOB_CONTENT_TYPE,
    }));

    const hydrated = await hydrateConfidentialStorageDocFromPersistence(persistedDocument, { get });

    expect(get).toHaveBeenCalledWith(persistedDocument.blob?.blobRef);
    expect(hydrated.jwe).toEqual(jwe);
    expect(hydrated.blob).toEqual(buildExampleConfidentialBlobInfo());
  });
});
