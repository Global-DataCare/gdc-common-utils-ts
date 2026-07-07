// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.
import { sha256 } from '@noble/hashes/sha2.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';
import { DocumentReferenceClaim } from '../models/interoperable-claims/document-reference-claims';
import { encodeMultibase58btc } from './multibase58.js';
import { canonicalizeFhirResource, fhirResourceToCid } from './fhir-cid.js';
import { EvidenceObjectDLT } from '../models/oidc4ida.evidence.model';

export type AttachmentKind = 'fhir' | 'pdf' | 'png' | 'jpg' | 'binary';
export type BuildMode = 'strict' | 'normalize';

export type BuildDocumentReferenceOptions = {
  /**
   * strict: validation errors throw.
   * normalize: best-effort defaults + warnings.
   */
  mode?: BuildMode;
};

export type BuildDocumentReferenceResult = {
  /**
   * Generated or normalized DocumentReference projection.
   *
   * Current simplified profile:
   * - one Communication payload attachment -> one DocumentReference
   * - one DocumentReference content[0].attachment
   */
  documentReference: Record<string, any>;
  /**
   * CID for the attached artifact content.
   * Used as version-like content fingerprint in this profile.
   */
  contentCid: string;
  evidence: EvidenceObjectDLT[];
  warnings: string[];
};

export type BlockchainArtifactDocumentReferenceInput = Readonly<{
  subject: string;
  resource?: Record<string, unknown>;
  contentDataBase64?: string;
  contentType?: string;
  identifier?: string;
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  language?: string;
}>;

const CID_V1 = 0x01;
const MULTICODEC_RAW = 0x55;
const MULTIHASH_SHA2_256_CODE = 0x12;
const MULTIHASH_SHA2_256_LEN = 32;

function encodeVarint(value: number): Uint8Array {
  const out: number[] = [];
  let n = value >>> 0;
  while (n >= 0x80) {
    out.push((n & 0x7f) | 0x80);
    n >>>= 7;
  }
  out.push(n);
  return Uint8Array.from(out);
}

function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((acc, part) => acc + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function cidFromBytes(bytes: Uint8Array): string {
  const digest = sha256(bytes);
  const multihash = concatBytes(
    Uint8Array.from([MULTIHASH_SHA2_256_CODE, MULTIHASH_SHA2_256_LEN]),
    digest,
  );
  const cidBytes = concatBytes(encodeVarint(CID_V1), encodeVarint(MULTICODEC_RAW), multihash);
  return encodeMultibase58btc(cidBytes);
}

function decodeBase64(data: string): Uint8Array {
  return Uint8Array.from(Buffer.from(data, 'base64'));
}

function encodeBase64Utf8(data: string): string {
  return Buffer.from(data, 'utf8').toString('base64');
}

function toStringOrUndefined(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  return text || undefined;
}

/**
 * Detects the logical attachment kind from a MIME type.
 *
 * @param contentType Attachment content type.
 */
export function detectAttachmentKind(contentType?: string): AttachmentKind {
  const ct = String(contentType || '').toLowerCase();
  if (ct.includes('fhir') || ct.includes('application/json+fhir')) return 'fhir';
  if (ct === 'application/pdf') return 'pdf';
  if (ct === 'image/png') return 'png';
  if (ct === 'image/jpg' || ct === 'image/jpeg') return 'jpg';
  return 'binary';
}

function buildEvidenceForKind(kind: AttachmentKind, cid: string): EvidenceObjectDLT {
  if (kind === 'pdf') {
    return {
      type: 'electronic_signature',
      signature_type: 'detached',
      issuer: 'did:web:unknown',
      serial_number: cid,
      created_at: new Date().toISOString(),
      attachments: [{ content_type: 'cid', content: cid }],
    };
  }
  return {
    type: 'electronic_record',
    record: { type: kind.toUpperCase(), source: 'Communication.payload.contentAttachment', digest: { alg: 'sha-256', value: cid } } as any,
    check_details: [],
  } as any;
}

function isCidLike(value?: string): boolean {
  return !!value && value.startsWith('z') && value.length > 10;
}

/**
 * Builds a simplified `DocumentReference` projection from the first
 * `Communication.payload[0].contentAttachment`.
 *
 * @param communication FHIR `Communication`-like resource carrying the attachment.
 * @param options.mode `strict` throws on invalid input, `normalize` applies best-effort defaults.
 */
export function buildDocumentReferenceFromCommunicationPayload(
  communication: Record<string, any>,
  options: BuildDocumentReferenceOptions = {},
): BuildDocumentReferenceResult {
  /**
   * Data model notes:
   * - FHIR DocumentReference logical identifier and version are distinct concerns.
   * - Current implementation uses content CID for claims identifier/version-like tracking.
   * - Future target profile should keep stable DocumentReference.identifier (UUID/URN) and
   *   store evolving content CID in meta.versionId/content hash fields across versions.
   * - Multi-attachment DocumentReference content[i] is intentionally out of scope for now;
   *   roadmap can introduce indexed flat claims such as DocumentReference.attachment[i]-*.
   */
  const mode = options.mode ?? 'strict';
  const warnings: string[] = [];

  const payload = communication?.payload?.[0];
  const attachment = payload?.contentAttachment;
  if (!attachment) {
    throw new Error('Communication payload with contentAttachment is required.');
  }

  const contentType = toStringOrUndefined(attachment.contentType) || 'application/octet-stream';
  if (!attachment.contentType && mode === 'normalize') {
    warnings.push('Missing contentAttachment.contentType. Defaulting to application/octet-stream.');
  }

  const dataBase64 = toStringOrUndefined(attachment.data);
  const url = toStringOrUndefined(attachment.url);
  if (!dataBase64 && !url && mode === 'strict') {
    throw new Error('contentAttachment requires data or url.');
  }

  const kind = detectAttachmentKind(contentType);
  let contentCid = toStringOrUndefined(attachment.id);

  if (!isCidLike(contentCid)) {
    if (kind === 'fhir' && dataBase64) {
      const json = Buffer.from(dataBase64, 'base64').toString('utf8');
      const parsed = JSON.parse(json);
      const canonical = canonicalizeFhirResource(parsed);
      contentCid = fhirResourceToCid(JSON.parse(canonical)).cid;
    } else if (dataBase64) {
      contentCid = cidFromBytes(decodeBase64(dataBase64));
    } else {
      contentCid = cidFromBytes(utf8ToBytes(url || 'empty-content'));
    }
  }
  if (!contentCid) {
    throw new Error('Unable to generate content CID from attachment.');
  }

  // Good practice note:
  // reusable Communication claim keys consumed here must come from
  // `CommunicationClaim`, not re-hardcoded inline in readers/tests.
  const subject = communication?.meta?.claims?.[CommunicationClaim.Subject];
  const documentReference: Record<string, any> = {
    resourceType: 'DocumentReference',
    status: 'current',
    meta: {
      versionId: contentCid,
      claims: {
        [DocumentReferenceClaim.Subject]: subject,
        [DocumentReferenceClaim.ContentType]: contentType,
        [DocumentReferenceClaim.Identifier]: contentCid,
      },
    },
    subject: subject ? { reference: subject } : undefined,
    content: [
      {
        attachment: {
          id: contentCid,
          contentType,
          data: dataBase64,
          url,
          title: toStringOrUndefined(attachment.title),
        },
      },
    ],
  };

  return {
    documentReference,
    contentCid,
    evidence: [buildEvidenceForKind(kind, contentCid)],
    warnings,
  };
}

/**
 * Builds a blockchain-ready `DocumentReference` projection from either a FHIR
 * resource or already-encoded attachment bytes.
 *
 * The resulting projection keeps two identifiers distinct:
 * - `contentCid`: canonical content address used for blockchain registration
 * - `documentReference.identifier`: optional business identifier supplied by the caller
 *
 * @param input Source artifact data to wrap.
 */
export function buildBlockchainArtifactDocumentReference(
  input: BlockchainArtifactDocumentReferenceInput,
): BuildDocumentReferenceResult {
  const subject = toStringOrUndefined(input.subject);
  if (!subject) {
    throw new Error('buildBlockchainArtifactDocumentReference requires subject.');
  }

  const resource = input.resource;
  const hasResource = !!resource && typeof resource === 'object' && !Array.isArray(resource);
  const contentType = toStringOrUndefined(input.contentType) || (hasResource ? 'application/fhir+json' : 'application/octet-stream');
  const title = toStringOrUndefined(input.title) || (hasResource
    ? `${String((resource as Record<string, unknown>).resourceType || 'resource').toLowerCase()}.json`
    : 'artifact.bin');

  let contentDataBase64 = toStringOrUndefined(input.contentDataBase64);
  let contentCid: string;
  let communicationLike: Record<string, any>;

  if (hasResource) {
    const serialized = JSON.stringify(resource);
    contentDataBase64 = encodeBase64Utf8(serialized);
    contentCid = fhirResourceToCid(resource as Record<string, unknown>).cid;
    communicationLike = {
      resourceType: 'Communication',
      meta: { claims: { [CommunicationClaim.Subject]: subject } },
      payload: [{ contentAttachment: { contentType, data: contentDataBase64, title } }],
    };
  } else {
    if (!contentDataBase64) {
      throw new Error('buildBlockchainArtifactDocumentReference requires contentDataBase64 when resource is absent.');
    }
    contentCid = cidFromBytes(decodeBase64(contentDataBase64));
    communicationLike = {
      resourceType: 'Communication',
      meta: { claims: { [CommunicationClaim.Subject]: subject } },
      payload: [{ contentAttachment: { contentType, data: contentDataBase64, title, url: input.location } }],
    };
  }

  const result = buildDocumentReferenceFromCommunicationPayload(communicationLike, { mode: 'strict' });
  const logicalIdentifier = toStringOrUndefined(input.identifier) || contentCid;

  const documentReference = {
    ...result.documentReference,
    identifier: logicalIdentifier ? [{ value: logicalIdentifier }] : undefined,
    description: toStringOrUndefined(input.description) || result.documentReference.description,
    date: toStringOrUndefined(input.date) || result.documentReference.date,
    content: [{
      attachment: {
        ...(result.documentReference.content?.[0]?.attachment || {}),
        contentType,
        data: contentDataBase64,
        url: toStringOrUndefined(input.location) || result.documentReference.content?.[0]?.attachment?.url,
        title,
        language: toStringOrUndefined(input.language) || result.documentReference.content?.[0]?.attachment?.language,
        hash: contentCid,
      },
    }],
    meta: {
      ...(result.documentReference.meta || {}),
      versionId: contentCid,
      claims: {
        ...((result.documentReference.meta || {}).claims || {}),
        [DocumentReferenceClaim.Identifier]: logicalIdentifier,
        [DocumentReferenceClaim.ContentHash]: contentCid,
        [DocumentReferenceClaim.ContentData]: contentDataBase64,
        [DocumentReferenceClaim.ContentType]: contentType,
        [DocumentReferenceClaim.Subject]: subject,
        ...(toStringOrUndefined(input.description) ? { [DocumentReferenceClaim.Description]: input.description } : {}),
        ...(toStringOrUndefined(input.date) ? { [DocumentReferenceClaim.Date]: input.date } : {}),
        ...(toStringOrUndefined(input.location) ? { [DocumentReferenceClaim.Location]: input.location } : {}),
        ...(toStringOrUndefined(input.language) ? { [DocumentReferenceClaim.Language]: input.language } : {}),
      },
    },
  };

  return {
    ...result,
    contentCid,
    documentReference,
  };
}
