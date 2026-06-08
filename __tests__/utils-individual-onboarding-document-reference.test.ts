import {
  EXAMPLE_CONSENT_ATTACHMENT_DATA_BASE64,
  EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
  EXAMPLE_DOCUMENT_REFERENCE_DATE,
  EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_URL,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared';
import { DocumentReferenceClaim } from '../src/models/interoperable-claims/document-reference-claims';
import {
  buildIndividualOnboardingPdfDocumentReferenceClaims,
  buildIndividualOnboardingPdfDocumentReferenceEntry,
  buildIndividualOnboardingPdfDraftBundle,
  buildIndividualOnboardingPdfDraftRequestBundle,
} from '../src/utils/individual-onboarding-document-reference';

describe('individual onboarding DocumentReference helpers', () => {
  const input = Object.freeze({
    subject: EXAMPLE_SUBJECT_DID,
    contentData: EXAMPLE_CONSENT_ATTACHMENT_DATA_BASE64,
    identifier: EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
    contentType: EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
    description: EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION,
    date: EXAMPLE_DOCUMENT_REFERENCE_DATE,
    location: EXAMPLE_DOCUMENT_REFERENCE_URL,
  });

  it('stores PDF base64 in DocumentReferenceClaim.ContentData', () => {
    const claims = buildIndividualOnboardingPdfDocumentReferenceClaims(input);

    expect(claims[DocumentReferenceClaim.Subject]).toBe(EXAMPLE_SUBJECT_DID);
    expect(claims[DocumentReferenceClaim.ContentData]).toBe(EXAMPLE_CONSENT_ATTACHMENT_DATA_BASE64);
    expect(claims[DocumentReferenceClaim.ContentType]).toBe(EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF);
    expect(claims[DocumentReferenceClaim.Location]).toBe(EXAMPLE_DOCUMENT_REFERENCE_URL);
  });

  it('builds a claims-first DocumentReference entry without hydrating attachment.data', () => {
    const entry = buildIndividualOnboardingPdfDocumentReferenceEntry(input);

    expect(entry.type).toBe('DocumentReference');
    expect(entry.resource.resourceType).toBe('DocumentReference');
    expect(entry.resource.meta.claims[DocumentReferenceClaim.ContentData]).toBe(EXAMPLE_CONSENT_ATTACHMENT_DATA_BASE64);
    expect((entry.resource as Record<string, unknown>).content).toBeUndefined();
  });

  it('wraps the DocumentReference entry into a body.data style bundle', () => {
    const bundle = buildIndividualOnboardingPdfDraftBundle(input);

    expect(bundle.resourceType).toBe('Bundle');
    expect(bundle.type).toBe('collection');
    expect(bundle.total).toBe(1);
    expect(bundle.data[0]?.resource.meta.claims[DocumentReferenceClaim.Identifier]).toBe(EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER);
  });

  it('exports an explicit request-bundle helper for individual controller onboarding', () => {
    const bundle = buildIndividualOnboardingPdfDraftRequestBundle(input);

    expect(bundle.data[0]?.resource.meta.claims[DocumentReferenceClaim.ContentData]).toBe(EXAMPLE_CONSENT_ATTACHMENT_DATA_BASE64);
  });
});
