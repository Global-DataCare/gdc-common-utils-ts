import { sha256 } from '@noble/hashes/sha2.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';
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

  const subject = communication?.meta?.claims?.['Communication.subject'];
  const documentReference: Record<string, any> = {
    resourceType: 'DocumentReference',
    status: 'current',
    meta: {
      versionId: contentCid,
      claims: {
        'DocumentReference.subject': subject,
        'DocumentReference.contenttype': contentType,
        'DocumentReference.identifier': contentCid,
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
